import torch
from torch.utils.data import Dataset

from datasets import load_dataset

class NepaliDataset(Dataset):
    def __init__(self, tokenizer, max_length=128):
        self.dataset = load_dataset("IRIISNEPAL/Nepali-Text-Corpus")
        self.texts = self.dataset['train']['Article']
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(text)
        return {
            'input_ids': encoding[''],
            'attention_mask': encoding.attention_mask
        }
    

if __name__=='__main__':
    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained("IRIISNEPAL/RoBERTa_Nepali_110M")
    dataset = NepaliDataset(tokenizer=tokenizer)
    print(dataset[0])