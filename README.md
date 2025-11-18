# Sabdamanthan (शब्दमन्थन): A Nepali Transformer Model

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made in Nepal](https://img.shields.io/badge/Made%20in-Nepal-green.svg)](https://github.com/)

A powerful, efficient Nepali language embedding model designed to revolutionize natural language processing for Nepali text. [cite_start]This model was developed as a final year project for the Bachelor of Computer Engineering at Khwopa College of Engineering[cite: 1].

[cite_start]**Sabdamanthan** is a Nepali Transformer model built with 89 million parameters[cite: 19, 261]. [cite_start]Despite its relatively small architecture, it demonstrates remarkable performance, outperforming larger models like multilingual BERT and XLM-Rbase on key Nepali NLP benchmarks[cite: 19, 304].

## 🚀 Key Features

* [cite_start]**High Performance:** Achieves a state-of-the-art Nep-GLUE score of **92.68**[cite: 279].
* [cite_start]**Efficient Architecture:** Built with only **89M parameters**, making it more compact than models like NepBERT (110M) or XLM-Rbase (270M)[cite: 279, 322].
* [cite_start]**Rich Dataset:** Trained on a diverse and high-quality **25GB Nepali dataset** [cite: 217] curated from:
    * [cite_start]The OSCAR dataset (5GB) [cite: 218]
    * [cite_start]The NepBERTa corpus (14GB) [cite: 219]
    * [cite_start]Nepali news websites (6GB) (e.g., Setopati, Ratopati, Kantipur) [cite: 220]
* [cite_start]**State-of-the-Art on NER:** Outperforms all compared models on Named Entity Recognition (NER) with a score of **94.40**[cite: 279, 304].

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

[cite_start]*Scores based on Table 6.1 in the report[cite: 279].*

### Training
[cite_start]The model was trained for 10 epochs using an AdamW optimizer and a Cosine Annealing scheduler[cite: 261]. [cite_start]The training and validation loss curves show stable convergence[cite: 276].


## 🛠️ Model Architecture

Sabdamanthan is a Transformer Encoder-based model. The architecture was designed to be efficient without compromising on performance.

| Parameter | Value |
| :--- | :--- |
| **Total Parameters** | [cite_start]**89,030,448** [cite: 261] |
| Number of Layers | [cite_start]6 [cite: 261] |
| Number of Heads | [cite_start]8 [cite: 261] |
| Model Dimension | [cite_start]768 [cite: 261] |
| Max Token Length | [cite_start]512 [cite: 261] |
| Vocabulary Size | [cite_start]30,000 [cite: 260] |
| Tokenizer | [cite_start]Byte Pair Encoding (BPE) [cite: 224] |

## 💡 Application & Demo

[cite_start]A web application was developed to demonstrate the model's capabilities in real-world NLP tasks[cite: 366].

### 1. Fill in the Blank (Masked Language Model)
[cite_start]Users can input a sentence with a blank (mask), and the model suggests the most appropriate words to fill it[cite: 370, 374].


### 2. Part-of-Speech (POS) Tagging
[cite_start]The model analyzes Nepali text and tags each word with its appropriate part of speech (e.g., Noun, Verb, Adjective)[cite: 368, 376].


### 3. Named Entity Recognition (NER)
[cite_start]The model identifies and classifies named entities in the text, such as Person, Location, and Organization[cite: 368].

## 👨‍💻 Authors

[cite_start]This project was submitted in 2025 by[cite: 1, 2]:

* [cite_start]**Manish Pyakurel** (KCE077BCT020) [cite: 1, 16]
* [cite_start]**Rupak Neupane** (KCE077BCT028) [cite: 1, 16]
* [cite_start]**Sarjyant Shrestha** (KCE077BCT033) [cite: 1, 16]
* [cite_start]**Srijan Gyawali** (KCE077BCT036) [cite: 1, 16]

### Supervision
* **Er. [cite_start]Subhadra Joshi** (Project Supervisor) [cite: 2, 4]
* **Er. [cite_start]Dinesh Gothe** (Head of Department) [cite: 5, 13]

### Institution
* [cite_start]**Khwopa College of Engineering**, Bhaktapur, Nepal [cite: 1, 5]
* [cite_start]*Affiliated to Tribhuvan University* [cite: 1]

## 📜 How to Cite

If you use this model or find this work helpful in your research, please consider citing the original report:

```bibtex
@bachelorthesis{pyakurel2025embedding,
  title     = {A Final Report on Embedding in Nepali Language},
  author    = {Manish Pyakurel and Rupak Neupane and Sarjyant Shrestha and Srijan Gyawali},
  school    = {Department of Computer and Electronics Engineering, Khwopa College of Engineering},
  year      = {2025},
  address   = {Bhaktapur, Nepal},
  note      = {Submitted in partial fulfillment of the requirements for the degree Bachelor of Computer Engineering, Tribhuvan University}
}
