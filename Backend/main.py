from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import torch
from model import NepaliTransformer, NERModel, POSModel
from nepalitokenizer import NepaliTokenizer

def devices ():
    torch.manual_seed(42)
    torch.cuda.manual_seed(42)

# Initialize the FastAPI app
app = FastAPI()

origins = [
    "http://localhost:5173",  # Or the origin of your React app
    "http://localhost:8000",  # or whatever port your front-end is using
    "http://localhost",
    "*"  # only for testing in development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the input and output models for FastAPI
class TextRequest(BaseModel):
    text: str


class EntityResponse(BaseModel):
    text: str
    type: str


class MaskRequest(BaseModel):
    text: str


# Load the Nepali tokenizer
tokenizer = NepaliTokenizer(load_path='nepali_tokenizer.json')
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Load your trained model
model = NepaliTransformer(vocab_size=30000, d_model=768, num_layers=6, num_heads=8).to(device)
snapshot = torch.load(r'models/snapshot.pt', map_location=device)
model.load_state_dict(snapshot['MODEL_STATE'])
model.eval()

nermodel = NERModel(model, hidden_dim=512, num_classes=7).to(device)
nermodel.load_state_dict(torch.load(r"models/NER.pt", map_location=device))
ner_idx2label = {
    0: 'O',
    1: 'B-LOC',
    2: 'B-PER',
    3: 'B-ORG',
    4: 'I-LOC',
    5: 'I-ORG',
    6: 'I-PER'
}

posmodel = POSModel(model, hidden_dim=512, num_classes=39).to(device)
posmodel.load_state_dict(torch.load(r"models/POS.pt", map_location=device))
pos_idx2label = {
    0: 'CD',
    1: 'JJ',
    2: 'NNP',
    3: 'POP',
    4: 'NN',
    5: 'PKO',
    6: 'VBX',
    7: 'YF',
    8: 'FB',
    9: 'VBF',
    10: 'PLAI',
    11: 'DUM',
    12: 'VBKO',
    13: 'RBO',
    14: 'VBI',
    15: 'VBO',
    16: 'HRU',
    17: 'JJD',
    18: 'YM',
    19: 'PLE',
    20: 'JJM',
    21: 'RP',
    22: 'VBNE',
    23: 'CS',
    24: 'YQ',
    25: 'CL',
    26: 'PP',
    27: 'PP$',
    28: 'CC',
    29: 'SYM',
    30: 'PPR',
    31: 'DM',
    32: 'OD',
    33: 'QW',
    34: 'UNW',
    35: 'RBM',
    36: 'FW',
    37: 'YB',
    38: 'ALPH'
}


@app.post("/fill-mask", response_model=List[str])
def predict_masked_tokens(request: MaskRequest):
    devices()
    text = request.text
 
    if not text:
        raise HTTPException(status_code=400, detail="Empty text received")
    inputs = tokenizer.encode(text)
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]
    mask_positions = [i for i, e in enumerate(input_ids) if e == tokenizer.mask_token_id]

    if not mask_positions:
        raise HTTPException(status_code=400, detail="No mask token found in the input text")

    with torch.no_grad(): 
        logits = model.lm_token(input_ids.unsqueeze(0).to(device), attention_mask=attention_mask.unsqueeze(0).to(device))
        

        if len(mask_positions) == 1:
            mask_idx = mask_positions[0]
            mask_logits = logits[0, mask_idx, :]    
            top_k_logits, top_k_indices = torch.topk(mask_logits, 5)  # Get top 5 predictions
            probabilities = torch.nn.functional.softmax(top_k_logits, dim=-1)
            predictions = [
                f"Token: {tokenizer.decode([int(idx)])} (probability: {prob:.4f})"
                for idx, prob in zip(top_k_indices.tolist(), probabilities.tolist())
            ]

        else:
            modified_text = text
            for mask_idx in sorted(mask_positions, reverse=True):
                mask_logits = logits[0, mask_idx, :]
                top_idx = torch.argmax(mask_logits).item()
                predicted_word = tokenizer.decode([top_idx])
                start_index = modified_text.find('<mask>')
                if start_index != -1:
                    end_index = start_index + len('<mask>')
                    modified_text = modified_text[:start_index] + predicted_word + modified_text[end_index:]

            predictions = [modified_text]

    return predictions


@app.post("/ner", response_model=List[EntityResponse])
def predict_entities(request: TextRequest):
    devices()
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Empty text received")
    # Tokenize the input text using the Nepali tokenizer
    with torch.no_grad():
        tokens = tokenizer.encode(text)
        outputs = nermodel(tokens['input_ids'].unsqueeze(0).to(device),
                           tokens['attention_mask'].unsqueeze(0).to(device))  # Forward pass through the model
        predictions = torch.argmax(outputs, dim=-1).squeeze().tolist()  # Get the predicted labels
        predictions = predictions[1:sum(tokens['attention_mask'].tolist())]  # Remove the [CLS] and [SEP] tokens
        entities = []
        i = 1
        while i < len(predictions):
            pred = predictions[i]
            if pred in ner_idx2label:
                token_id = [tokens['input_ids'][i].item()]
                current_text = tokenizer.decode(token_id)
                current_type = ner_idx2label[pred]
                
                # Look ahead for ##
                next_idx = i + 1
                while (next_idx < len(predictions) and tokenizer.decode([tokens['input_ids'][next_idx].item()]).startswith('##')):
                    # Merge with the current token
                    next_token = tokenizer.decode([tokens['input_ids'][next_idx].item()])
                    current_text += next_token.replace('##', '')
                    i = next_idx
                    next_idx += 1
                
                entities.append({
                    "text": current_text,
                    "type": current_type
                })
            i += 1
        return entities

    


@app.post("/pos", response_model=List[EntityResponse])
def predict_entities(request: TextRequest):
    devices()
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Empty text received")
    # Tokenize the input text using the Nepali tokenizer
    
    with torch.no_grad():
        tokens = tokenizer.encode(text)
        outputs = posmodel(tokens['input_ids'].unsqueeze(0).to(device),
                           tokens['attention_mask'].unsqueeze(0).to(device))  # Forward pass through the model
        predictions = torch.argmax(outputs, dim=-1).squeeze().tolist()  # Get the predicted labels
        all_preds = [pos_idx2label[idx] for idx in predictions]
        all_preds = all_preds[1:sum(tokens['attention_mask'].tolist()) - 1]  # Remove the [CLS] and [SEP] tokens
        entities = []
        for i, pred in enumerate(all_preds):
            token_id = [tokens['input_ids'][i + 1].item()]
            text = tokenizer.decode(token_id)
            entities.append({
                "text": text,
                "type": pred
            })
        return entities



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)