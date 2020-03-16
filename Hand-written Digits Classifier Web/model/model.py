import torch
import numpy as np
import os
from model.classes import CNN
import model.functions as f

path = os.path.dirname(__file__)

def predict(img):
    model = CNN()
    model.load_state_dict(torch.load("model/model-saves/preprocess-model.pth"))
    processed_img = f.preprocess_image(img)
    img = np.array(processed_img)
    prediction = f.predict(model,img)

    return prediction

