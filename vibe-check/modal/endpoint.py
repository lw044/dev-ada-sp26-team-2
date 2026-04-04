from common import *
from inference import Inference
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

web_app = modal.asgi_app()

fastapi_app = __import__('fastapi').FastAPI()

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.post("/")
async def analyze(request: Request):
    data = await request.json()
    text = data.get("text", "")
    inference = Inference()
    label = inference.predict.remote(text)
    return {"tone": label}

@app.function(image=image)
@modal.asgi_app()
def analyze():
    return fastapi_app