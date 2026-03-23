# import sys
# sys.path.append("../modal")
from common import *

# define app for function to run in modal container
@app.function(
    image = image, 
    volumes={"/data": volume} # load data from volume 
)
def preprocess():
    import pandas as pd
    import re 
    # just the first 10k rows of the dataset !!
    df = pd.read_csv("/data/data_10k.csv")
    
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
    def clean_text(text):
        text = str(text)
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"http\S+", "", text)
        return text.strip()

    df["text"] = df["text"].apply(clean_text) #actual cleaning

    # write cleaned data to volume
    df.to_csv("/data/data_cleaned.csv", index=False)
    volume.commit()

@app.local_entrypoint()
def main():
    preprocess.remote()