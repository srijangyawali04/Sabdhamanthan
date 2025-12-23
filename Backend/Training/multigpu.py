import torch
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torch.amp import GradScaler, autocast

import torch.multiprocessing as mp
from torch.utils.data.distributed import DistributedSampler
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.distributed import init_process_group, destroy_process_group
import os


from nepalitokenizer import NepaliTokenizer
from chunkdataset import ChunkDataset
from model import NepaliTransformer
from tqdm.auto import tqdm

def ddp_setup(rank, world_size):
    """
    Args:
        rank: Unique identifier of each process
        world_size: Total number of processes
    """
    os.environ["MASTER_ADDR"] = "localhost"
    os.environ["MASTER_PORT"] = "12355"
    torch.cuda.set_device(rank)
    init_process_group(backend="nccl", rank=rank, world_size=world_size)

class Trainer:
    def __init__(
        self,
        model: torch.nn.Module,
        train_data: DataLoader,
        valid_data: DataLoader,
        optimizer: torch.optim.Optimizer,
        tokenizer:any,
        gpu_id: int,
        save_every= 1,
        # snapshot_path: str,
    ) -> None:
        print('la ya ta print huuu')
        self.gpu_id = gpu_id
        self.model =  model.to(torch.device(self.gpu_id))
        print(self.model)
        self.train_data = train_data
        self.valid_data = valid_data
        self.optimizer = optimizer
        self.tokenizer = tokenizer
        self.scaler = GradScaler()
        self.criterion = torch.nn.CrossEntropyLoss(ignore_index=-100)
        self.save_every = save_every
        self.epochs_run = 0
        self.snapshot_path = 'snapshot.pt'
        # if os.path.exists(snapshot_path):
        #     print("Loading snapshot")
        #     self._load_snapshot(snapshot_path)
        print('suru ko hai trainer')

        self.model = DDP(self.model, device_ids=[self.gpu_id])

    def _load_snapshot(self, snapshot_path):
        loc = f"cuda:{self.gpu_id}"
        snapshot = torch.load(snapshot_path, map_location=loc)
        self.model.load_state_dict(snapshot["MODEL_STATE"])
        self.optimizer.load_state_dict(snapshot["OPTIMIZER_STATE"])

        if self.scaler is not None and 'SCALER_STATE' in snapshot:
            self.scaler.load_state_dict(snapshot["SCALER_STATE"])
        self.epochs_run = snapshot["EPOCHS_RUN"]
        print(f"Resuming training from snapshot at Epoch {self.epochs_run}")

    def _run_batch(self,input_ids,attention_mask,labels):
        with autocast(f"cuda:{self.gpu_id}"):
            output = self.model(input_ids,attention_mask=attention_mask)
            loss = self.criterion(output.view(-1, self.tokenizer.tokenizer.get_vocab_size()), labels.view(-1))
        return loss

    def _run_epoch(self, epoch):
        self.model.train()
        b_sz = len(next(iter(self.train_data))[0])
        print(f"[GPU{self.gpu_id}] Epoch {epoch} | Batchsize: {b_sz} | Steps: {len(self.train_data)}")
        total_train_loss = 0
        self.train_data.sampler.set_epoch(epoch)
        train_bar = tqdm(self.train_data)
        for batch in train_bar:
            input_ids = batch['input_ids'].to(self.gpu_id)
            attention_mask = batch['attention_mask'].to(self.gpu_id)
            labels = batch['labels'].to(self.gpu_id)

            self.optimizer.zero_grad()
            loss = self._run_batch(input_ids,attention_mask,labels)
            self.scaler(loss).backward()
            self.scaler.step(self.optimizer)
            self.scaler.update()
            train_bar.set_postfix(
                {
                    "loss":f"{loss.item():.4f}"
                }
            )
            total_train_loss += loss.item()
        return total_train_loss

    def _valid_epoch(self,epoch):
        self.model.eval()
        b_sz = len(next(iter(self.valid_data))[0])
        print(f"[GPU{self.gpu_id}] Epoch {epoch} | Batchsize: {b_sz} | Steps: {len(self.train_data)}")
        total_valid_loss = 0
        self.valid_data.sampler.set_epoch(epoch)
        valid_bar = tqdm(self.valid_data)
        for batch in valid_bar:
            input_ids = batch['input_ids'].to(self.gpu_id)
            attention_mask = batch['attention_mask'].to(self.gpu_id)
            labels = batch['labels'].to(self.gpu_id)

            loss = self._run_batch(input_ids,attention_mask,labels)
            valid_bar.set_postfix(
                {
                    "loss":f"{loss.item():.4f}"
                }
            )
            total_valid_loss += loss.item()        
        return total_valid_loss

    def _save_snapshot(self, epoch):
        snapshot = {
            "MODEL_STATE": self.model.module.state_dict(),
            "EPOCHS_RUN": epoch,
            "OPTIMIZER_STATE": self.optimizer.state_dict()
        }
        if self.scaler is not None:
            snapshot['SCALER_STATE'] = self.scaler.state_dict()
        torch.save(snapshot, self.snapshot_path)
        print(f"Epoch {epoch} | Training snapshot saved at {self.snapshot_path}")

    def train(self, max_epochs: int):
        history ={
            'train_loss':[],
            'valid_loss':[]
        }
        for epoch in range(self.epochs_run, max_epochs):
            history['train_loss'].append(self._run_epoch(epoch))
            if self.gpu_id == 0 and epoch % self.save_every == 0:
                self._save_snapshot(epoch)
            history['valid_loss'].append(self._valid_epoch(epoch))


def load_train_objs():
    lr = 5e-5
    d_model=768
    max_len=512
    num_layers=6
    num_heads=8
    tokenizer = NepaliTokenizer(load_path = 'nepali_tokenizer.json')
    vocab_size=tokenizer.tokenizer.get_vocab_size()
    dataset = ChunkDataset(tokenizer,metadata_path='metadata.json')
    model = NepaliTransformer(vocab_size,d_model,max_len,num_layers,num_heads)
    optimizer = torch.optim.AdamW(model.parameters(),lr=lr)
    return dataset, tokenizer, model, optimizer


def prepare_dataloader(dataset: Dataset, batch_size: int):
    return DataLoader(
        dataset,
        batch_size=batch_size,
        num_workers = 4,
        pin_memory=True,
        shuffle=False,
        sampler=DistributedSampler(dataset)
    )


def main(rank: int,world_size: int,save_every: int, total_epochs: int, batch_size: int):
    ddp_setup(rank,world_size)
    dataset, tokenizer, model, optimizer = load_train_objs()
    train_dataset, valid_dataset, test_dataset = dataset.split(
        train_ratio=0.8,  # 80% training
        valid_ratio=0.1,  # 10% validation
        seed=42  # For reproducibility
    )
    train_data = prepare_dataloader(train_dataset, batch_size)
    valid_data = prepare_dataloader(valid_dataset,batch_size)
    trainer = Trainer(model, train_data,valid_data, optimizer, tokenizer, save_every)
    trainer.train(total_epochs)

    destroy_process_group()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='simple distributed training job')
    parser.add_argument('--total_epochs',default=5, type=int, help='Total epochs to train the model')
    parser.add_argument('--save_every',default=1, type=int, help='How often to save a snapshot')
    parser.add_argument('--batch_size', default=32, type=int, help='Input batch size on each device (default: 32)')
    # parser.add_argument('--snapshot_path', default="snapshot.pt", type=str, help='Path to save the snapshot')
    args = parser.parse_args()

    world_size = torch.cuda.device_count()
    mp.spawn(main, args=(world_size, args.save_every, args.total_epochs, args.batch_size), nprocs=world_size)