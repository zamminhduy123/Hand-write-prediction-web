from flask import Flask, request, redirect, render_template, url_for, make_response
from werkzeug.utils import secure_filename
import psycopg2
import cv2
import numpy as np 
import matplotlib.pyplot as plt
import os
from model.model import predict
import io
import base64
from PIL import Image
UPLOAD_FOLDER = '/images'
path = os.path.dirname(__file__)
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

global prediction 
global img_path
global acc 
global drawing 
global checkpoint
checkpoint = "0"
@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.route('/', methods = ['GET', 'POST'])
@app.route('/home', methods = ['GET', 'POST'])
def home():
    prediction = None
    img_path = None
    acc = None
    drawing = False
    blank = True
    global checkpoint
    print(checkpoint)
    if request.method == "POST":
        if request.is_json:
            if 'cmd' in request.json:
                command = request.json['cmd']
                if (command == 'draw'):
                    drawing = True
                    prediction = None
                    img_path = None
                    acc = None
                    print("drawing is true")
                elif command =='save':
                    img_path = "/static/images/test.png"
                    pth = path+img_path
                    img_gray = cv2.imread(pth,0)
                    acc, prediction = predict(img_gray)
                    img_path = "../static/images/test.png"  
                print(command)
            elif 'image' in request.json:
                drawing = True
                data = request.json['image']
                
                encode_img = data.replace('data:image/png;base64,', '')
                decoded_img = Image.open(io.BytesIO(base64.b64decode(encode_img)))
                if decoded_img.getbbox():
                    print("yes, drawn image saved")
                    decoded_img.save("static/images/test.png", 'PNG')
                    pth = path+"/static/images/test.png" 
                    img_gray = cv2.imread(pth,0)
                    acc, prediction = predict(img_gray)
                    img_path = "../static/images/test.png"
                    checkpoint = "3"
                    #return render_template('main-page.html', prediction = None, img_path= img_path, accuracy = None) 
                else:
                    print("no, cannot save drawn image")
                    prediction = {'Error': 'Blank image',}
                    blank = True
                    acc = None
                    img_path = None
        if "submit" in request.form:
            img = request.files["file"].read()
            npimg = np.frombuffer(img,np.uint8)
            if npimg.size != 0:
                img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
                img_name = "test.png"
                img_path = os.path.join("static\images",img_name)
                cv2.imwrite(img_path,img)
                checkpoint = "1"
                print(checkpoint)
            else:
                print("Cannot Open Image")
        if "predict-button" in request.form:
            if checkpoint == "1":
                img_path = "/static/images/test.png"
                pth = path+img_path
                img_gray = cv2.imread(pth,0)
                acc, prediction = predict(img_gray)
                img_path = "../static/images/test.png"  
                print(checkpoint)
                checkpoint = "0" 
            else:
                while checkpoint != "3": 
                    print(checkpoint) 
                    pass
                img_path = "/static/images/test.png"
                pth = path+img_path
                img_gray = cv2.imread(pth,0)
                acc, prediction = predict(img_gray)
                img_path = "../static/images/test.png" 
                print(checkpoint) 
                checkpoint = "0"        

    return render_template('main-page.html', prediction = prediction, img_path= img_path, accuracy = acc)




if __name__ =="__main__":
    app.run(debug=True)
