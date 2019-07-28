var canvasWrapper = document.getElementById('canvasWrapper');
var two = new Two({ width: 1330, height: 500 }).appendTo(canvasWrapper);
var startKMeansClustering = document.getElementById('startKMeansClustering');
var randomInputs = document.getElementById('randomInputs');
var points = [];
var numberOfClustersElement = document.getElementById('numberOfClusters');
var numberOfClusters = 3;

numberOfClustersElement.addEventListener('input', (event) => {
    numberOfClusters = event.srcElement.value;
})

canvasWrapper.addEventListener('click',(event) => {
    if(checkIfPointExists(points,event.offsetX,event.offsetY)==false){
        points.push(new Point(event.offsetX,event.offsetY));
        drawCircle(event.offsetX,event.offsetY);
    }
});

startKMeansClustering.addEventListener('click',() => {
    canvasWrapper.style.pointerEvents = "none";
    console.log(points);
    startKMeansClusteringProcess();
});

function drawCircle(xPosition, yPosition){
    let circle = two.makeCircle(xPosition, yPosition, 5);
    circle.fill = '#595959';
    circle.stroke = 'black';
    two.update();
}

function drawFlickeringStar(xPosition, yPosition){
    let star = two.makeStar(xPosition, yPosition,5);
    star.fill = '#eb4034';
    star.stroke = 'red';
    setInterval(() => {
        star.opacity=0;
        two.update();
    }, 50);
    setInterval(() => {
        star.opacity=1;
        two.update();
    }, 100);
}

function checkIfPointExists(arr,x,y){
    return arr.some((er)=>{
        return (er.xCordinate === x && er.yCordinate === y);
    })
}

function startKMeansClusteringProcess(){
    let kCentroids = getKCentroids();
    do{
        setTimeout(() => {
            points.forEach(sPoint => {
                sPoint.assignCentroidBelongsTo(kCentroids);
            });
            drawKMeansClusters(kCentroids);
            kCentroids = calculateNewCentroid(kCentroids);
        }, 200);
    } while(checkIfNewDataPointsAddedToAnyCentroids()==true);
    points.forEach(sPoint => {
        sPoint.assignCentroidBelongsTo(kCentroids);
    });
    drawKMeansClusters(kCentroids);
    startKMeansClustering.style.backgroundColor = "black";
    startKMeansClustering.style.color = "lime";
}

function getAveragePoint(arr){
    let xSum=0;
    let ySum=0;
    arr.forEach(ele => {
        xSum += ele.xCordinate;
        ySum += ele.yCordinate;
    });
    return new Point((xSum/arr.length) ,(ySum/arr.length));
}

function calculateManhattanDistance(x1,y1,x2,y2){
    return (Math.abs(y2-y1) + Math.abs(x2-x1));
}

function getKCentroids(){
    let arr = [];
    for(let i=0;i<numberOfClusters;i++){
        arr.push(new Point(Math.floor(Math.random()*1311 + 10),Math.floor(Math.random()*481 + 10)));
    }
    return arr;
}

function calculateNewCentroid(kCent){
    
    let dataPointsBelongedToCentroid;
    let retArr=[];
    kCent.forEach(sCentroid => {
        dataPointsBelongedToCentroid = points.filter((point) =>{
            return (sCentroid.xCordinate === point.centroidBelongsToXCordinate && sCentroid.yCordinate === point.centroidBelongsToYCordinate);
        })
        retArr.push(getAveragePoint(dataPointsBelongedToCentroid));
    });
    return retArr;
}

function checkIfNewDataPointsAddedToAnyCentroids(){
    let ret = false;
    for(let i=0; i<points.length; i++){
        if( (points[i].centroidBelongsToXCordinate != points[i].oldCentroidbelongsToYCordinate) || (points[i].centroidBelongsToYCordinate != points[i].oldCentroidbelongsToYCordinate) ){
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


randomInputs.addEventListener('click', () => {
    two.clear();
    two.update();
    points=[];
    for(let i=0;i<1000;i++){
        points.push(new Point(Math.floor(Math.random()*1311) + 10,Math.floor(Math.random()*481)+10));
        drawCircle(points[points.length-1].xCordinate,points[points.length-1].yCordinate);;
    }
});

function drawKMeansClusters(centroids){
    setTimeout(() => {
        two.clear();
        centroids.forEach(centroid => {
            drawFlickeringStar(centroid.xCordinate,centroid.yCordinate);
        });
        points.forEach(sp => {
            drawCircle(sp.xCordinate,sp.yCordinate);
            drawLineBetweenTwoPoints(sp.xCordinate,sp.yCordinate,sp.centroidBelongsToXCordinate,sp.centroidBelongsToYCordinate);
        });
    }, 200);
}

class Point{
    constructor(xCordinate,yCordinate){
        this.xCordinate=xCordinate;
        this.yCordinate=yCordinate;
        this.oldCentroidbelongsToXCordinate = null;
        this.oldCentroidbelongsToYCordinate = null;
        this.centroidBelongsToXCordinate = null;
        this.centroidBelongsToYCordinate = null;
        this.cost = null;
    }

    assignCentroidBelongsTo(arrOfCentroids){
        this.oldCentroidbelongsToXCordinate = this.centroidBelongsToXCordinate;
        this.oldCentroidbelongsToYCordinate = this.centroidBelongsToYCordinate;
        let minimunDist=Infinity;
        let dist;
        arrOfCentroids.forEach(centroid => {
            dist = calculateManhattanDistance(this.xCordinate,this.yCordinate,centroid.xCordinate,centroid.yCordinate);
            if(dist<minimunDist){
                minimunDist = dist;
                this.centroidBelongsToXCordinate = centroid.xCordinate;
                this.centroidBelongsToYCordinate = centroid.yCordinate;
                this.cost = minimunDist;
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------------------------------

var startKMedoidsClustering = document.getElementById('startKMedoidsClustering');
var bestCost = Infinity;
var randomMedoids;

startKMedoidsClustering.addEventListener('click', ()=>{
    randomMedoids = points.slice(0,numberOfClusters);
    let currentMedoidsCost = 0;
    console.log(randomMedoids);
    points.forEach(sPoint => {
        sPoint.assignCentroidBelongsTo(randomMedoids);
        currentMedoidsCost += sPoint.cost;
    });
    if(currentMedoidsCost<bestCost){
        bestCost = currentMedoidsCost;
        drawBestClusters(randomMedoids);
    }
    _.range(1000).forEach(i => {
        setTimeout(() => {
            randomMedoids = getNewMedoids(randomMedoids.slice());
            if(i==999){        
                startKMedoidsClustering.style.backgroundColor = 'black';
                startKMedoidsClustering.style.color = "lime";
            }
        }, 10);
    })
});


function getNewMedoids(medoids){
    let retMedoids = medoids.slice();
    let currentMedoidsCost = 0;
    let newMedoid = points[Math.floor(Math.random()*points.length)];
    while(checkIfPointExists(medoids,newMedoid.xCordinate,newMedoid.yCordinate) == true){
        newMedoid = points[Math.floor(Math.random()*points.length)];
    }
    medoids[Math.floor(Math.random()*medoids.length)] = newMedoid;
    points.forEach(sPoint => {
        sPoint.assignCentroidBelongsTo(medoids);
        currentMedoidsCost += sPoint.cost;
    });
    if(currentMedoidsCost<bestCost){
        bestCost = currentMedoidsCost;
        retMedoids = medoids;
        points.forEach(sPoint => {
            sPoint.assignCentroidBelongsTo(medoids);
        });
        drawBestClusters(retMedoids);
    }
    return retMedoids;
}
 
function drawBestClusters(bestMedoids){
    two.clear();
    points.forEach(sp => {
        drawCircle(sp.xCordinate,sp.yCordinate);
    });
    bestMedoids.forEach(med => {
        drawFlickeringStar(med.xCordinate,med.yCordinate);
        points.forEach(sPoint => {
            if(sPoint.centroidBelongsToXCordinate == med.xCordinate && sPoint.centroidBelongsToYCordinate == med.yCordinate){
                drawLineBetweenTwoPoints(sPoint.xCordinate,sPoint.yCordinate,med.xCordinate,med.yCordinate);
            }
        })
    })
    two.update();
}