var canvasWrapper = document.getElementById('canvasWrapper');
var two = new Two({ width: 1540, height: 500 }).appendTo(canvasWrapper);
var startClustering = document.getElementById('startClustering');
var points = [];

canvasWrapper.addEventListener('click',(event) => {
    if(checkIfPointExists(event.offsetX,event.offsetY)==false){
        points.push(new Point(event.offsetX,event.offsetY,null));
        drawCircle(event.offsetX,event.offsetY);
    }
});

startClustering.addEventListener('click',() => {
    canvasWrapper.style.pointerEvents = "none";
    console.log(points);
    startClusteringProcess();
});

function drawCircle(xPosition, yPosition){
    let circle = two.makeCircle(xPosition, yPosition, 5);
    circle.fill = '#000000';
    circle.stroke = 'black';
    two.update();
}

function drawFlickeringStar(xPosition, yPosition){
    let star = two.makeStar(xPosition, yPosition,5);
    star.fill = '#000000';
    star.stroke = 'black';
    setInterval(() => {
        star.opacity=0;
        two.update();
    }, 50);
    setInterval(() => {
        star.opacity=1;
        two.update();
    }, 100);
}

class Point{
    constructor(xCordinate,yCordinate,centroidBelongsTo){
        this.xCordinate=xCordinate;
        this.yCordinate=yCordinate;
        this.oldCentroidbelongsTo = null;
        this.centroidBelongsTo = centroidBelongsTo;
        this.cost = null;
    }

    assignCentroidBelongsTo(arrOfCentroids){
        this.oldCentroidbelongsTo = this.centroidBelongsTo;
        let minimunDist=Infinity;
        let dist;
        arrOfCentroids.forEach(centroid => {
            dist = calculateManhattanDistance(this.xCordinate,this.yCordinate,centroid.xCordinate,centroid.yCordinate);
            if(dist<minimunDist){
                minimunDist = dist;
                this.centroidBelongsTo = centroid;
                this.cost = minimunDist;
            }
        });
        drawLineBetweenTwoPoints(this.xCordinate,this.yCordinate,this.centroidBelongsTo.xCordinate,this.centroidBelongsTo.yCordinate);
    }
}

function checkIfPointExists(x,y){
    return points.some((er)=>{
        return (er.xCordinate === x && er.yCordinate === y);
    })
}

function startClusteringProcess(){
    let kCentroids = getKCentroids();
    do{
        points.forEach(sPoint => {
            sPoint.assignCentroidBelongsTo(kCentroids);
        });
        kCentroids = calculateNewCentroid(kCentroids);
    } while(checkIfNewDataPointsAddedToAnyCentroids()==true);
    startClustering.style.backgroundColor = "black";
}

function getAveragePoint(arr){
    let xSum=0;
    let ySum=0;
    arr.forEach(ele => {
        xSum += ele.xCordinate;
        ySum += ele.yCordinate;
    });
    return new Point((xSum/arr.length) ,(ySum/arr.length), null);
}

function calculateManhattanDistance(x1,y1,x2,y2){
    return (Math.abs(y2-y1) + Math.abs(x2-x1));
}

function getKCentroids(){
    let arr = [];
    for(let i=0;i<2;i++){
        arr.push(new Point(Math.floor(Math.random()*1540),Math.floor(Math.random()*500),null));
        drawFlickeringStar(arr[arr.length-1].xCordinate,arr[arr.length-1].yCordinate);
    }
    return arr;
}

function calculateNewCentroid(kCent){
    two.clear();
    points.forEach(sp => {
        drawCircle(sp.xCordinate,sp.yCordinate);
    });
    let dataPointsBelongedToCentroid;
    let retArr=[];
    kCent.forEach(sCentroid => {
        dataPointsBelongedToCentroid = points.filter((point) =>{
            return (sCentroid.xCordinate === point.centroidBelongsTo.xCordinate && sCentroid.yCordinate === point.centroidBelongsTo.yCordinate);
        })
        retArr.push(getAveragePoint(dataPointsBelongedToCentroid));
        drawFlickeringStar(retArr[retArr.length-1].xCordinate,retArr[retArr.length-1].yCordinate)
    });
    return retArr;
}

function checkIfNewDataPointsAddedToAnyCentroids(){
    let ret = false;
    for(let i=0; i<points.length; i++){
        if( points[i].oldCentroidbelongsTo!=null && ((points[i].centroidBelongsTo.xCordinate != points[i].oldCentroidbelongsTo.xCordinate) || (points[i].centroidBelongsTo.yCordinate != points[i].oldCentroidbelongsTo.yCordinate)) ){
            ret = true;
            break;
        }
    }
    return ret;
}

function drawLineBetweenTwoPoints(x1,y1,x2,y2){
    const line = two.makeLine(x1,y1,x2,y2);
    two.update();
}