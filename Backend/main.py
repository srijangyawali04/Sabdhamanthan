from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
import torch
from model import NepaliTransformer,NERModel,POSModel
from nepalitokenizer import NepaliTokenizer

# Initialize the FastAPI app
app = FastAPI()

# Define the input and output models for FastAPI
class TextRequest(BaseModel):
    text: str

class EntityResponse(BaseModel):
    text: str
    type: str

# Load the Nepali tokenizer
tokenizer = NepaliTokenizer(load_path='nepali_tokenizer.json')
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load your trained model
model = NepaliTransformer(vocab_size=30000,d_model=768, num_layers=6, num_heads=8).to(device)
snapshot = torch.load(r'models\snapshot.pt',map_location=device)
model.load_state_dict(snapshot['MODEL_STATE'])
model.eval()

nermodel = NERModel(model, hidden_dim=512, num_classes=7).to(device)
nermodel.load_state_dict(torch.load(r"models\NER.pt", map_location=device))
# nermodel = torch.load("models/NER.pt", map_location=torch.device("cpu"))

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
posmodel.load_state_dict(torch.load(r"models\POS.pt", map_location=torch.device("cpu")))

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

@app.post("/ner", response_model=List[EntityResponse])
def predict_entities(request: TextRequest):
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Empty text received")

    # Tokenize the input text using the Nepali tokenizer
    tokens = tokenizer.encode(text)


    with torch.no_grad():
        outputs = nermodel(tokens['input_ids'].unsqueeze(1).to(device),tokens['attention_mask'].unsqueeze(1).to(device))  # Forward pass through the model

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