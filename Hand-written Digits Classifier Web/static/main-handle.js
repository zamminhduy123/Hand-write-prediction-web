const realFileButton = document.getElementById('input-file')
const uploadButton = document.getElementById('upload-button')
const userImg = document.getElementById('user-image')
const drawButton = document.getElementById('draw-button')
const cvDrawingBoard = document.getElementById('drawing-board')
const drawingDir = document.getElementById('drawing-direction');
const drawingSec = document.getElementById('drawing-section');
const brushSize = document.getElementById('brush-range')
const clearButton = document.getElementById('clear-button')
const predictButton = document.getElementById('predict-button');
const fakeButton = document.getElementById('fake-button');

var sendBase64ToServer = function(base64){
    var httpPost = new XMLHttpRequest(),
        path = "/",
        data = JSON.stringify({image: base64});
        console.log(data);
    httpPost.onreadystatechange = function(err) {
            if (httpPost.readyState == 4 && httpPost.status == 200){
                console.log(httpPost.responseText);
            } else {
                console.log(err);
            }
        };
    // Set the content type of the request to json since that's what's being sent
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpPost.send(data);
};

var sendPost = function(command){
    var httpPost = new XMLHttpRequest(),
        path = "/",
        data = JSON.stringify({cmd: command});
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpPost.send(data);
}

function handleFiles(files) {
    drawingSec.hidden = true;
    const reader = new FileReader()
    reader.onload = () => {
        userImg.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            //resize image if bigger than image-holder
            var MAX_WIDTH = 600;
            var MAX_HEIGHT = 400;
            var width = userImg.width;
            var height = userImg.height;
        
            if (width == height){
                width = MAX_HEIGHT;
                height = MAX_HEIGHT;
            } else {
            if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            userImg.width = width;
            userImg.height = height;
            canvas.width = width;
            canvas.height = height;
            //push the canvas back to image
            context.drawImage(userImg,0,0,width,height);
            //change the image to black and white
            const imgData = context.getImageData(0,0,canvas.width,canvas.height)
            const data = imgData.data
            context.putImageData(imgData,0,0)
            userImg.src = canvas.toDataURL('image/jpg', 1.0)
            userImg.hidden = false;
            sendBase64ToServer(userImg.src)
        }
        userImg.src = reader.result
    }
    //read file
    reader.readAsDataURL(files[0])
    
}




//fake upload button trigger
uploadButton.addEventListener("click", () => {
    drawingSec.hidden = true;
    cvDrawingBoard.hidden == true
    realFileButton.click();
})
//change the files
realFileButton.addEventListener('change',function(e){
    handleFiles(realFileButton.files);
},false)

realFileButton.onchange = function() {
    document.getElementById("submit").click();
}

document.addEventListener('dragover',function(e){
    e.preventDefault();
    e.stopPropagation();
},false)

document.addEventListener('drop',function(e){
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
},false)

clearButton.onclick = () => {
    const ctx = cvDrawingBoard.getContext('2d');
    createDrawBoard(ctx);
}

const createDrawBoard = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, 300, 300);
    ctx.fill();
    ctx.beginPath();
    ctx.beginPath();
}


drawButton.addEventListener('click', () => {
    cvDrawingBoard.hidden=false
    drawingSec.hidden = false;
    userImg.hidden = true;
    userImg.src = '#';
    document.getElementById("input-file").value = "";
    const ctx = cvDrawingBoard.getContext('2d');
    cvDrawingBoard.height = 300;
    cvDrawingBoard.width = 300;

    createDrawBoard(ctx);
 
    let drawing = false;
    function startPos (e) {
        drawing = true;
        draw(e);
    }
    function endPos(){
        drawing = false;
        ctx.beginPath();
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

    function draw(e){
        if (!drawing){
            return;
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        const mouse = getMousePos(cvDrawingBoard,e);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouse.x,mouse.y);
    }

    cvDrawingBoard.addEventListener('mousedown',startPos);
    cvDrawingBoard.addEventListener('mouseup',endPos);
    cvDrawingBoard.addEventListener('mousemove',draw);

});


    predictButton.addEventListener('click',function(e) {
    if (userImg.hidden){
            const img = new Image();
                    const ctx = cvDrawingBoard.getContext('2d');
                    ctx.drawImage(img,0,0,cvDrawingBoard.width,cvDrawingBoard.height);
                    const imgData = ctx.getImageData(0,0,cvDrawingBoard.width,cvDrawingBoard.height)
                    ctx.putImageData(imgData,0,0);
                    
                    img.src = cvDrawingBoard.toDataURL('image/jpg', 1.0);
                    sendBase64ToServer(img.src);
                    console.log("b")
                } else {
                    return;
                }
                    
            },false)
