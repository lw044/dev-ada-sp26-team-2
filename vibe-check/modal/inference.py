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

        emotion = result[0]["label"]

        return emotion

@app.local_entrypoint()
def main():
    inference = Inference()
    print(inference.predict.remote("I don't like pointers or trees!!!!!!!!"))
    print(inference.predict.remote("No, you think?"))
    print(inference.predict.remote("Bro I just failed my exam"))
    print(inference.predict.remote("Gosh, it was SO embarrasing"))
    print(inference.predict.remote("To whom it may concern, "))
    print(inference.predict.remote("Priority Queues are used to organize heaps."))
    print(inference.predict.remote("I'm not sure what you mean.."))
    print(inference.predict.remote("huh?"))
    print(inference.predict.remote("huh."))
    print(inference.predict.remote("Why are gas giants so big?"))
    print(inference.predict.remote("Studio ghibli films are the best!"))
    print(inference.predict.remote("My bus missed my stop again. Why are these busses so unreliable!!"))
    print(inference.predict.remote("My interview is in 2 minutes and I didnt prepare. WHat am I gonna do?"))



# test it once
# modal run inference.py

# deploy it as a persistent API endpoint
# modal deploy inference.py