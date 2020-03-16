import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.autograd import Variable
import numpy as np 
import matplotlib.pyplot as plt
import cv2

def predict(model, X):
    X = torch.Tensor(X).view(-1,28,28)
    X = X /255.0
    X = Variable(X).view(-1,1,28,28)
    
    output = model(X)
    label = torch.max(output.data,1)[1]

        
    pct = F.softmax(output.data,dim=1)
    pct = pct.numpy()[0]
   
    pct_list = [[i,np.round(j*100,2)] for i,j in enumerate(pct)]
    pct_list.sort(key = lambda x: x[1], reverse=True)
    top_3_list = pct_list[:3]
    top_3_dict =dict(top_3_list)
    
    return pct_list[0][1], top_3_dict
    


def preprocess_image(img):

    thresh = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)[1]
    cnts, tmp = cv2.findContours(thresh,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    if (len(cnts) == 0):
        print("No contours found")
        return cv2.resize(img,(28,28))
    else: 
        x,y,w,h = cv2.boundingRect(cnts[0])
        img_crop = img[y:(y+h), x:(x+w)]
        
        DIGITS_SIZE = 20

        a,b=h,w
        d = int(max(h,w)/DIGITS_SIZE)
        if h > DIGITS_SIZE:
            a = int(h/d)
        if w > DIGITS_SIZE:
            b = int(w/d)
        a = 5 if a <= 0 else a
        b = 5 if b <= 0 else b
        img_crop = cv2.resize(img_crop,(b,a))
    
        horizontal = 28 - b
        vertical = 28 - a
        top = bot = int(vertical/2)
        left = right = int(horizontal/2)

        img_padding = cv2.copyMakeBorder(img_crop,top,bot,left,right,cv2.BORDER_CONSTANT)

        kernel = np.ones((2,2), np.uint8) 
        img_dilation = cv2.dilate(img_padding,kernel=kernel,iterations = 1)
        
        img = cv2.resize(img_dilation,(28,28))
        return img
