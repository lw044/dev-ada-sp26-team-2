# this file defines the inference class
# which loads the trained model and makes predictions on new text inputs. 
# we use Hugging Face transformers library to load the model and perform inference

from common import *

@app.cls(
    image=image,
    gpu="T4",
    volumes={"/data": volume}
)
class Inference:
    @modal.enter()
    def load_model(self):
        from transformers import pipeline
        self.pipe = pipeline(
            "text-classification",  # pipeline task
            model="/data/model_weights", # load model and tokenizer from volume
            device=0    # use GPU for inference
        )
    @modal.method()
    def predict(self, text: str):
        result = self.pipe(text)
        return result

@app.local_entrypoint()
def main():
    inference = Inference()
    print(inference.predict.remote("I am so happy today!"))

# test it once
# modal run inference.py

# deploy it as a persistent API endpoint
# modal deploy inference.py