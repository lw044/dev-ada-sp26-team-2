from common import *
from inference import Inference
 
@app.function(image=image)
@modal.web_endpoint(method="POST")
def analyze(item: dict):
    text = item["text"]
    inference = Inference()
    label = inference.predict.remote(text)
    return {"tone": label}
 