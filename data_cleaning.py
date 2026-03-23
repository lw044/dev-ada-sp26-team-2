# just the first 10k rows of the dataset !!

import pandas as pd
import re

df = pd.read_csv("data_10k.csv")

#convert labels to integers

label_map = {
    "sadness": 0,
    "confusion": 1,
    "love": 2,
    "anger": 3,
    "fear": 4,
    "surprise": 5,
    "neutral": 6,
    "happiness": 7,
    "disgust": 8,
    "shame": 9,
    "guilt": 10,
    "sarcasm": 11,
    "desire": 12
}


df["label_id"] = df["Label"].map(label_map)

df = df.rename(columns={
    "Sentence": "text",
    "Label": "label"
})
df = df.dropna(subset=["text","label"]) #remove null rows
df = df.drop_duplicates(subset="text")

import re

def clean_text(text):
    text = str(text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"http\S+", "", text)
    return text.strip()

df["text"] = df["text"].apply(clean_text) #actual cleaning

train_df = df.sample(frac=0.9, random_state=42)
val_df = df.drop(train_df.index) #split into training and validation data
train_df = train_df.reset_index(drop=True)
val_df = val_df.reset_index(drop=True)

#print(train_df["label"].value_counts())

#tokenization:
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize(batch):
    return tokenizer(
        batch["text"],
        padding="max_length",
        truncation=True,
        max_length=128
    )


from datasets import Dataset

train_dataset = Dataset.from_pandas(train_df)
val_dataset = Dataset.from_pandas(val_df)

train_dataset = train_dataset.map(tokenize, batched=True)
val_dataset = val_dataset.map(tokenize, batched=True)

print(train_dataset[0])

