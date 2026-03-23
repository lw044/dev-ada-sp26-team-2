from common import *

# define app for function to run in modal container
@app.function(
    image = image,
    gpu="A100",
    volumes = {"/data": volume}, # load data from volume
    timeout=3000
)

def train():
    import pandas as pd
    from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
    from datasets import Dataset

    df = pd.read_csv("/data/data_cleaned.csv")

    train_df = df.sample(frac=0.9, random_state=42)
    val_df = df.drop(train_df.index) #split into training and validation data
    train_df = train_df.reset_index(drop=True)
    val_df = val_df.reset_index(drop=True)

    #print(train_df["label"].value_counts())

    #tokenization:
    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

    def tokenize(batch):
        return tokenizer(
            batch["text"],
            padding="max_length",
            truncation=True,
            max_length=128
        )
    train_dataset = Dataset.from_pandas(train_df)
    val_dataset = Dataset.from_pandas(val_df)

    train_dataset = train_dataset.map(tokenize, batched=True)
    val_dataset = val_dataset.map(tokenize, batched=True)

    print(train_dataset[0])

    # set format for PyTorch
    train_dataset = train_dataset.rename_column("label_id", "labels")
    val_dataset = val_dataset.rename_column("label_id", "labels")
    train_dataset.set_format("torch", columns=["input_ids", "attention_mask", "labels"])
    val_dataset.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

    # load model
    model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=13)

    # training arguments
    args = TrainingArguments(
        output_dir = "data/model_checkpoints",   # where to save model weights during training
        num_train_epochs = 3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        eval_strategy="epoch",
        save_strategy="epoch",  # save checkpoint every epoch
        load_best_model_at_end=True,    # load best checkpoint
    )
    trainer = Trainer(
        model=model,   
        args=args,      
        train_dataset=train_dataset,
        eval_dataset=val_dataset  
    )

    trainer.train()

    # save model weights to volume
    model.save_pretrained("/data/model_weights")    # model's trained weights
    tokenizer.save_pretrained("/data/model_weights")    # tokenizer's rules
    volume.commit()

@app.local_entrypoint()
def main():
    train.remote()