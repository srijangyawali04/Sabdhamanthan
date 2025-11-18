# Sabdamanthan (शब्दमन्थन): A Nepali Transformer Model

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made in Nepal](https://img.shields.io/badge/Made%20in-Nepal-green.svg)](https://github.com/)

A powerful, efficient Nepali language embedding model designed to revolutionize natural language processing for Nepali text. This model was developed as a final year project for the Bachelor of Computer Engineering at Khwopa College of Engineering.

**Sabdamanthan** is a Nepali Transformer model built with 89 million parameters. Despite its relatively small architecture, it demonstrates remarkable performance, outperforming larger models like multilingual BERT and XLM-Rbase on key Nepali NLP benchmarks.

## 🚀 Key Features

* **High Performance:** Achieves a state-of-the-art Nep-GLUE score of **92.68**.
* **Efficient Architecture:** Built with only **89M parameters**, making it more compact than models like NepBERT (110M) or XLM-Rbase (270M).
* **Rich Dataset:** Trained on a diverse and high-quality **25GB Nepali dataset** curated from:
    * The OSCAR dataset (5GB) 
    * The NepBERTa corpus (14GB) 
    * Nepali news websites (6GB) (e.g., Setopati, Ratopati, Kantipur) 
* **State-of-the-Art on NER:** Outperforms all compared models on Named Entity Recognition (NER) with a score of **94.40**.

## 📊 Performance (Nep-gLUE Benchmark)

Sabdamanthan was evaluated against other prominent models on the Nep-gLUE benchmark. The results demonstrate its superior performance, particularly in NER and POS tagging.

| Model | PARAMS | NER | POS | CC | CPS | Nep-GLUE |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| multilingual BERT | 172M | 85.45 | 94.65 | 91.08 | 93.60 | 91.19 |
| XLM-Rbase | 270M | 87.59 | 94.88 | 92.33 | 93.65 | 92.11 |
| NepBERT | 110M | 79.12 | 95.06 | 90.15 | 95.05 | 87.94 |
| NepaliBERT | 110M | 82.45 | 91.67 | 90.10 | 89.46 | 88.42 |
| NepBERTa | 110M | 91.09 | 95.56 | 93.13 | 94.42 | 93.55 |
| **Sabdamanthan (Ours)** | **89M** | **94.40** | **94.60** | **91.07** | **90.67** | **92.68** |


### Training
The model was trained for 10 epochs using an AdamW optimizer and a Cosine Annealing scheduler. The training and validation loss curves show stable convergence.


## 🛠️ Model Architecture

Sabdamanthan is a Transformer Encoder-based model. The architecture was designed to be efficient without compromising on performance.

| Parameter | Value |
| :--- | :--- |
| **Total Parameters** | **89,030,448** |
| Number of Layers | 6 |
| Number of Heads | 8  |
| Model Dimension | 768 |
| Max Token Length | 512 |
| Vocabulary Size | 30,000  |
| Tokenizer | Byte Pair Encoding (BPE)  |

## 💡 Application & Demo

A web application was developed to demonstrate the model's capabilities in real-world NLP tasks.

### 1. Fill in the Blank (Masked Language Model)
Users can input a sentence with a blank (mask), and the model suggests the most appropriate words to fill it.


### 2. Part-of-Speech (POS) Tagging
The model analyzes Nepali text and tags each word with its appropriate part of speech (e.g., Noun, Verb, Adjective).


### 3. Named Entity Recognition (NER)
The model identifies and classifies named entities in the text, such as Person, Location, and Organization.

## 👨‍💻 Authors

* **Manish Pyakurel** (KCE077BCT020) 
* **Rupak Neupane** (KCE077BCT028) 
* **Sarjyant Shrestha** (KCE077BCT033)
* **Srijan Gyawali** (KCE077BCT036) 

### Supervision
* **Er. Subhadra Joshi** (Project Supervisor) 
* **Er. Dinesh Gothe** (Head of Department) 

### Institution
* **Khwopa College of Engineering**, Bhaktapur, Nepal 
* *Affiliated to Tribhuvan University*
  
## 📜 How to Cite

If you use this model or find this work helpful in your research, please consider citing the original report:

```bibtex
@bachelorthesis{sabdamanthan2025embedding,
  title     = {A Final Report on Embedding in Nepali Language},
  author    = {Manish Pyakurel, Rupak Neupane, Sarjyant Shrestha, Srijan Gyawali},
  school    = {Department of Computer and Electronics Engineering, Khwopa College of Engineering},
  year      = {2025},
  address   = {Bhaktapur, Nepal},
  note      = {Submitted in partial fulfillment of the requirements for the degree Bachelor of Computer Engineering, Tribhuvan University}
}
