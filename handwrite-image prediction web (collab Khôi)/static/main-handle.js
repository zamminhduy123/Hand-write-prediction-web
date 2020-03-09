const realFileButton = document.getElementById('input-file')
const uploadButton = document.getElementById('upload-button')
const userImg = document.getElementById('user-image')
const drawButton = document.getElementById('draw-button')
const cvDrawingBoard = document.getElementById('drawing-board')
const drawingDir = document.getElementById('drawing-direction');
const drawingSec = document.getElementById('drawing-section');
const brushSize = document.getElementById('brush-range')
const clearButton = document.getElementById('clear-button')


function handleFiles(files) {
    drawingSec.hidden = true;
    const reader = new FileReader()
    reader.onload = () => {
        userImg.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            //resize image if bigger than image-holder
            var MAX_WIDTH = 600;
            var MAX_HEIGHT = 600;
            var width = userImg.width;
            var height = userImg.height;
        
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            //push the canvas back to image
            context.drawImage(userImg,0,0,width,height);
            //change the image to black and white
            const imgData = context.getImageData(0,0,canvas.width,canvas.height)
            const data = imgData.data
            for (var i = 0;i<=data.length;i+=4){
                const avg = (data[i] + data[i+1] + data[i+2])/3;
                data[i] = avg;
                data[i+1]=avg;
                data[i+2]=avg;
            }
            context.putImageData(imgData,0,0)
            userImg.src = canvas.toDataURL('image/jpeg', 1.0)
            userImg.hidden = false;
        }
        userImg.src = reader.result
    }
    //read file
    reader.readAsDataURL(files[0])
    
}


//fake upload button trigger
uploadButton.addEventListener("click", () => {
    drawingSec.hidden = true;
    realFileButton.click();
})
//change the files
realFileButton.addEventListener('change',function(e){
    handleFiles(realFileButton.files);
    document.getElementById("input-file").value = "";
},false)

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
    drawingSec.hidden = false;
    userImg.hidden = true;
    userImg.src = '#';

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
