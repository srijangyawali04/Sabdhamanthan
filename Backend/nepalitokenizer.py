from tokenizers import Tokenizer, models, pre_tokenizers, trainers
import os
import torch

class NepaliTokenizer:
    def __init__(self,load_path=None):
        self.tokenizer = Tokenizer(models.BPE(unk_token="<unk>"))
        if load_path and os.path.exists(load_path):
            self._load_tokenizer(load_path)
        else:
            self._build_tokenizer()
        self.pad_token_id = self.tokenizer.token_to_id("<pad>")
        self.cls_token_id = self.tokenizer.token_to_id("<cls>")
        self.sep_token_id = self.tokenizer.token_to_id("<sep>")
        self.mask_token_id = self.tokenizer.token_to_id("<mask>")

    def _build_tokenizer(self):
        self.tokenizer.pre_tokenizer = pre_tokenizers.WhitespaceSplit()
        
        trainer = trainers.BpeTrainer(
            vocab_size=30000,
            special_tokens=["<pad>", "<unk>", "<cls>", "<sep>", "<mask>"],
            continuing_subword_prefix="##"
        )
        
        self.tokenizer.train(["/home/ubuntu/dataset/new_final_single_col.tsv"], trainer=trainer)
        self.tokenizer.enable_padding(pad_id=self.pad_token_id, pad_token="<pad>")
        self.tokenizer.enable_truncation(max_length=512)

        # Save the trained tokenizer
        self._save_tokenizer("nepali_tokenizer.json")

    def get_vocab_size(self):
        return self.tokenizer.get_vocab_size()
    
    def _save_tokenizer(self, path):
        self.tokenizer.save(path)

    def _load_tokenizer(self, path):
        self.tokenizer = Tokenizer.from_file(path)
        self.tokenizer.enable_padding(pad_id=self.tokenizer.token_to_id("<pad>"), pad_token="<pad>")
        self.tokenizer.enable_truncation(max_length=512)

    def encode(self, text, max_length=512):
        """Encode text with CLS and SEP tokens, add attention mask, and apply padding."""
        # Encode the text
        encoding = self.tokenizer.encode(text)
        tokens = encoding.ids
    
        # Truncate if needed (leaving room for CLS and SEP)
        if len(tokens) > max_length - 2:  # -2 for CLS and SEP
            tokens = tokens[:(max_length - 2)]
    
        # Add CLS and SEP tokens
        tokens = [self.cls_token_id] + tokens + [self.sep_token_id]
    
        # Create attention mask (1 for real tokens, 0 for padding)
        attention_mask = [1] * len(tokens)
    
        # Apply padding if necessary
        padding_length = max_length - len(tokens)
        if padding_length > 0:
            tokens += [self.pad_token_id] * padding_length
            attention_mask += [0] * padding_length  # 0 for padded tokens
    
        return {
            "input_ids": torch.tensor(tokens,dtype=torch.long),
            "attention_mask": torch.tensor(attention_mask,dtype=torch.long)
        }
    
    def decode(self, tokens):
        return self.tokenizer.decode(tokens)