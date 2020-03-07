const realFileButton = document.getElementById('input-file')
const uploadButton = document.getElementById('upload-button')
const userImg = document.getElementById('user-image')
const drawButton = document.getElementById('draw-button')
const cvDrawingBoard = document.getElementById('drawing-board')
const drawingDir = document.getElementById('drawing-direction');

uploadButton.addEventListener("click", () => {
    realFileButton.click();
})
function handleFiles(files) {
    cvDrawingBoard.hidden = true;
    const reader = new FileReader()
    reader.onload = () => {
        userImg.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
                    
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
            context.drawImage(userImg,0,0,width,height);
            
            //context.drawImage(userImg,0,0)
            
            const imgData = context.getImageData(0,0,canvas.width,canvas.height)
            const data = imgData.data
            console.log(data);
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
    reader.readAsDataURL(files[0])
}

realFileButton.addEventListener('change',function(e){
    handleFiles(input.files)
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

drawButton.addEventListener('click', () => {
    cvDrawingBoard.hidden = false;
    userImg.hidden = true;
    drawingDir.hidden = false;
    const ctx = cvDrawingBoard.getContext('2d');

    

    cvDrawingBoard.height = 300;
    cvDrawingBoard.width = 300;

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, 300, 300);
    ctx.fill();
    ctx.beginPath();
    ctx.beginPath();

    let drawing = false;
    function startPos (e) {
        drawing = true;
        draw(e);
    }
    function endPos(){
        drawing = false;
        ctx.beginPath();
    }

    function draw(e){
        if (!drawing){
            return;
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - 180,e.clientY - 146);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - 180,e.clientY  - 146);
    }

    cvDrawingBoard.addEventListener('mousedown',startPos);
    cvDrawingBoard.addEventListener('mouseup',endPos);
    cvDrawingBoard.addEventListener('mousemove',draw);

});
