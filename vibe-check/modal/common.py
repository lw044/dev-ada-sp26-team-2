import modal
app = modal.App("tone-classifier")

# define image with necessary dependencies
image = modal.Image.debian_slim().pip_install(
    "pandas",
    "transformers",
    "datasets",
    "torch",
    "accelerate"
).add_local_python_source("common")

# define volume to store model weights (like a USB drive for the container)
# helps avoid retraining the model every time we run the function, 
volume = modal.Volume.from_name("storage", create_if_missing=True)

# # mount to access local files
# modal_dir = modal.Mount.from_local_dir("modal/", remote_path="/vibe-check/modal")