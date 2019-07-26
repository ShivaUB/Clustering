var canvasWrapper = document.getElementById('canvasWrapper');
var two = new Two({ width: 500, height: 500 }).appendTo(canvasWrapper);

canvasWrapper.addEventListener('mousemove',(event) => {
    drawCircle(event.offsetX,event.offsetY);
});

function drawCircle(xPosition, yPosition){
    console.log(event.offsetX+','+event.offsetY);
    let circle = two.makeCircle(xPosition, yPosition, 5);
    circle.fill = '#FF8000';
    circle.stroke = 'orangered';
    two.update();
}