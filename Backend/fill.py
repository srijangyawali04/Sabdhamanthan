
# import torch
# from model import NepaliTransformer, NERModel, POSModel
# from nepalitokenizer import NepaliTokenizer

# def devices ():
#     torch.manual_seed(42)
#     torch.cuda.manual_seed(42)

# tokenizer = NepaliTokenizer(load_path='nepali_tokenizer.json')
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# # Load your trained model
# model = NepaliTransformer(vocab_size=30000, d_model=768, num_layers=6, num_heads=8).to(device)
# snapshot = torch.load(r'models/snapshot.pt', map_location=device)
# model.load_state_dict(snapshot['MODEL_STATE'])
# model.eval()


# def predict_masked_tokens():
#     devices()
#     text = "नयाँ सरकार गठनपछि मुलुकमा <mask> स्थायित्व हुने भएकाले आर्थिक विकासले प्राथमिकता पाउने, राजस्व संकलन र पुँजीगत खर्च बढ्ने दाबी सरकारले गरे पनि नतिजा सन्तोषजनक छैन ।"
#     # if not text:
#     #     raise HTTPException(status_code=400, detail="Empty text received")
#     inputs = tokenizer.encode(text)
#     input_ids = inputs["input_ids"]
#     attention_mask = inputs["attention_mask"]
#     mask_positions = [i for i, e in enumerate(input_ids) if e == tokenizer.mask_token_id]

#     # if not mask_positions:
#     #     raise HTTPException(status_code=400, detail="No mask token found in the input text")

#     with torch.no_grad(): 
#         logits = model(input_ids.unsqueeze(0).to(device), attention_mask=attention_mask.unsqueeze(0).to(device))

#         if len(mask_positions) == 1:
#             mask_idx = mask_positions[0]
#             mask_logits = logits[0, mask_idx, :]    
#             top_k_logits, top_k_indices = torch.topk(mask_logits, 5)  # Get top 5 predictions
#             probabilities = torch.nn.functional.softmax(top_k_logits, dim=-1)
#             predictions = [
#                 f"Token: {tokenizer.decode([int(idx)])} (probability: {prob:.4f})"
#                 for idx, prob in zip(top_k_indices.tolist(), probabilities.tolist())
#             ]

#         else:
#             modified_text = text
#             for mask_idx in sorted(mask_positions, reverse=True):
#                 mask_logits = logits[0, mask_idx, :]
#                 top_idx = torch.argmax(mask_logits).item()
#                 predicted_word = tokenizer.decode([top_idx])
#                 start_index = modified_text.find('<mask>')
#                 if start_index != -1:
#                     end_index = start_index + len('<mask>')
#                     modified_text = modified_text[:start_index] + predicted_word + modified_text[end_index:]

#             predictions = [modified_text]

#     return predictions


# if __name__ == '__main__':
#     print(predict_masked_tokens())

import argparse
import pickle
import token
from pydoc import text

import numpy as np
import pandas as pd
import tokenizers
import torch
import torch.nn as nn

from model import NepaliTransformer
from nepalitokenizer import NepaliTokenizer


def load_model(model_path, device="cpu"):
    model = NepaliTransformer(
        vocab_size=30000, d_model=768, num_layers=6, num_heads=8
    ).to(device)
    snapshot = torch.load(model_path, map_location=device)
    model.load_state_dict(snapshot["MODEL_STATE"])
    model.eval()
    return model


def load_ids(model_path="snapshot.pt", tokenizer_path="nepali_tokenizer.json"):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tokenizer = NepaliTokenizer(load_path=tokenizer_path)
    model = load_model(model_path).to(device)
    return model, tokenizer, device




def get_predictions_for_masks(model, tokenizer, device, text, k=1):
    # Tokenize the text and find all mask positions
    inputs = tokenizer.encode(text)
    mask_positions = [
        i for i, e in enumerate(inputs["input_ids"]) if e == tokenizer.mask_token_id
    ]

    # If there's only one mask, output just the predicted tokens with probabilities
    if len(mask_positions) == 1:
        mask_idx = mask_positions[0]
        predictions = []

        with torch.no_grad():
            lm_head, cls_embedding = model(
                inputs["input_ids"].unsqueeze(0).to(device),
                attention_mask=inputs["attention_mask"].unsqueeze(0).to(device),
            )

        # Get probabilities for masked position
        mask_logits = lm_head[0, mask_idx, :]

        # Get top k predictions
        top_k_logits, top_k_indices = torch.topk(mask_logits, k)

        # Convert to probabilities using softmax
        probabilities = torch.nn.functional.softmax(top_k_logits, dim=0)

        # Convert to numpy for easier handling
        top_k_indices = top_k_indices.cpu().numpy()
        probabilities = probabilities.cpu().numpy()

        # Generate list of predicted tokens and their probabilities
        for idx, prob in zip(top_k_indices, probabilities):
            predicted_word = tokenizer.decode([int(idx)])
            predictions.append(f"Token: {predicted_word} (probability: {prob:.4f})")

        return predictions
    else:
        # Keep existing multiple mask handling
        modified_text = text
        for mask_idx in mask_positions:
            with torch.no_grad():
                lm_head, cls_embedding = model(
                    inputs["input_ids"].unsqueeze(0).to(device),
                    attention_mask=inputs["attention_mask"].unsqueeze(0).to(device),
                )

            mask_logits = lm_head[0, mask_idx, :]
            top_k_logits, top_k_indices = torch.topk(mask_logits, 1)
            probabilities = torch.nn.functional.softmax(top_k_logits, dim=0)
            predicted_idx = top_k_indices[0]
            predicted_word = tokenizer.decode([int(predicted_idx)])
            modified_text = modified_text.replace("<mask>", predicted_word, 1)

        return modified_text

if __name__ == "__main__":


    # Extract the text entered by the user
    text = "नयाँ सरकार गठनपछि मुलुकमा <mask> स्थायित्व हुने भएकाले आर्थिक विकासले प्राथमिकता पाउने, राजस्व संकलन र पुँजीगत खर्च बढ्ने दाबी सरकारले गरे पनि नतिजा सन्तोषजनक छैन ।"

    model_path = r"models/snapshot.pt"
    tokenizer_path = "nepali_tokenizer.json"

    model, tokenizer, device = load_ids(model_path, tokenizer_path)

    print("Model Loaded")

    # Get the result based on the number of masks in the sentence
    predictions = get_predictions_for_masks(model, tokenizer, device, text, k=5)

    if isinstance(predictions, list):
        print("\nGenerated sentences with top predictions for the mask:")
        for sentence in predictions:
            print(sentence)
    else:
        print("\nGenerated sentence with top predictions for each mask:")
        print(predictions)