import torch
import torch.nn as nn


# class NepaliTransformer(nn.Module):
#     def __init__(self, vocab_size=30000, d_model=512, max_len=512, num_layers=6, num_heads=8):
#         super().__init__()
#         self.embedding = nn.Embedding(vocab_size, d_model)
#         self.position = nn.Embedding(max_len, d_model)
        
#         self.encoder_layers = nn.ModuleList([
#             nn.TransformerEncoderLayer(
#                 d_model=d_model,
#                 nhead=num_heads,
#                 dim_feedforward=d_model*4,
#                 activation="gelu",
#                 batch_first=True
#             ) for _ in range(num_layers)
#         ])
        
#         self.lm_head = nn.Linear(d_model, vocab_size)
#         self.cls_head = nn.Linear(d_model, d_model)  # Optional projection NSP ko lagi use hudo recha aayela kaam lagena


#     def forward(self, x, attention_mask):
#         # Add [CLS] token position (always position 0)
#         positions = torch.arange(x.size(1), device=x.device).expand(x.size(0), -1)
#         x = self.embedding(x) + self.position(positions)
        
#         pad_mask = (attention_mask == 0)
        
#         for layer in self.encoder_layers:
#             x = layer(x, src_key_padding_mask=pad_mask)
        
#         return x
#         # return self.lm_head(x),self.cls_head(x)  # return logits for language modeling and classification



class NepaliTransformer(nn.Module):
    def __init__(self, vocab_size=30000, d_model=768, max_len=512, num_layers=6, num_heads=8):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.position = nn.Embedding(max_len, d_model)
        
        self.encoder_layers = nn.ModuleList([
            nn.TransformerEncoderLayer(
                d_model=d_model,
                nhead=num_heads,
                dim_feedforward=d_model*4,
                activation="gelu",
                batch_first=True
            ) for _ in range(num_layers)
        ])
        
        self.lm_head = nn.Linear(d_model, vocab_size)
        self.cls_head = nn.Linear(d_model, d_model)  # Optional projection

    def forward(self, x, attention_mask):
        # Add [CLS] token position (always position 0)
        positions = torch.arange(x.size(1), device=x.device).expand(x.size(0), -1)
        x = self.embedding(x) + self.position(positions)
        
        pad_mask = (attention_mask == 0)
        
        for layer in self.encoder_layers:
            x = layer(x, src_key_padding_mask=pad_mask)
        
        return x
    
    def lm_token(self, x,attention_mask):
        positions = torch.arange(x.size(1), device=x.device).expand(x.size(0), -1)
        x = self.embedding(x) + self.position(positions)
        
        pad_mask = (attention_mask == 0)
        
        for layer in self.encoder_layers:
            x = layer(x, src_key_padding_mask=pad_mask)
        
        return self.lm_head(x)
    
class NERModel(nn.Module):
    def __init__(self, embedding_model, hidden_dim, num_classes, dropout_rate=0.3):
        super(NERModel, self).__init__()
        self.embedding = embedding_model
        self.dropout = nn.Dropout(dropout_rate)
        self.fc1 = nn.Linear(768, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, num_classes)  
        # Freeze embedding model
        for param in self.embedding.parameters():
            param.requires_grad = False
    
    def forward(self, x, attention_mask):
        embedded = self.embedding.forward(x, attention_mask)
        embedded = self.dropout(embedded)
        logits = self.fc1(embedded)
        logits = self.relu(logits)
        logits = self.dropout(logits)
        logits = self.fc2(logits)
        return logits
    
class POSModel(nn.Module):
    def __init__(self, embedding_model, hidden_dim, num_classes, dropout_rate=0.3):
        super(POSModel, self).__init__()
        self.embedding = embedding_model
        self.dropout = nn.Dropout(dropout_rate)
        self.fc1 = nn.Linear(768, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, num_classes)  
        # Freeze embedding model
        for param in self.embedding.parameters():
            param.requires_grad = False
    
    def forward(self, x, attention_mask):
        embedded = self.embedding.forward(x, attention_mask)
        embedded = self.dropout(embedded)
        logits = self.fc1(embedded)
        logits = self.relu(logits)
        logits = self.dropout(logits)
        logits = self.fc2(logits)
        return logits