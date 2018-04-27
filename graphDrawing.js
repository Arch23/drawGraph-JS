var width, height, canvas, offset, drawLabels, mainGraphColor, margin, maxX, maxY, minX, minY;

var hex2rgba = hexa => {
    const r = parseInt(hexa.slice(1, 3), 16),
    g = parseInt(hexa.slice(3, 5), 16),
    b = parseInt(hexa.slice(5, 7), 16),
    a = parseInt(hexa.slice(7, 9), 16) / 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

var mapValue = (value, minValue, maxValue, dimension, margin) => {
    const delta = maxValue - minValue;
    const percentage = (value - minValue) / delta;
    return ((dimension - (margin * 2)) * percentage) + margin;
};

var printText = (text, x, y) => {
    const ctx = canvas.getContext("2d");
    const textWidth = ctx.measureText(text).width;
    
    //hack to get aproximated font height
    const textHeight = ctx.measureText("M").width;

    if (x + textWidth > width) {
        x -= textWidth;
    } else if (y - textHeight < 0 ) {
        y += textHeight;
    }
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);
};

var drawCircle = (x, y) => {
    const ctx = canvas.getContext("2d");
    const r = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};

var getPointData = point => {
    let [id,x,y] = point.split(" ");
    x = mapValue(x, minX, maxX, width, margin)+offset;
    y = mapValue(y, minY, maxY, height, margin)+offset;
    return [id,x,y];
};

var getLimits = (graph) => {
    let lines = graph.split("\n");

    lines = lines.filter( line => {
        return !(line.indexOf("#") != -1 || line.length == 0);
    });

    let xArray = [], yArray = [], maxX, maxY, minX, minY;
    lines.forEach(point => {
        var [id, x, y] = point.split(" ");
        xArray.push(x);
        yArray.push(y);
    });

    maxX = Math.max(...xArray);
    maxY = Math.max(...yArray);
    minX = Math.min(...xArray);
    minY = Math.min(...yArray);

    return [maxX, maxY, minX, minY];
};

var simpleGraph = (graph) => {
    const ctx = canvas.getContext("2d");
    const points = graph.split("\n");

    for (let i = 0; i <= points.length; i++) {
        let [id, x, y] = getPointData(points[i % points.length]);
        if (i == 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineWidth=2;
            ctx.strokeStyle = hex2rgba(mainGraphColor);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        if(drawLabels){
            printText(id, x, y);
        }
        drawCircle(x, y);
    }
};

var complexGraph = sections => {
    const ctx = canvas.getContext("2d");
    
    let firstCity = undefined;

    sections.forEach((section)=>{
        const points = section.split("\n");
        let color = mainGraphColor;
        if(points[0].indexOf("#") != -1){
            color = points[0];
            points.splice(0,1);
        }
        points.forEach((point)=> {
            let [id, x, y] = getPointData(point);
            if(firstCity == undefined){
                firstCity = point;
                ctx.moveTo(x,y);
            }else{
                ctx.lineWidth=2;
                ctx.strokeStyle = hex2rgba(color);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            if(drawLabels){
                printText(id, x, y);
            }
            drawCircle(x, y);
        });
    });
    let [id, x, y] = getPointData(firstCity);
    ctx.lineTo(x,y);
    ctx.stroke();
};

var drawGraph = (canvasId, graph, hexColor="#000000FF",dL=true,off=0) => {
    //initialize variables
    margin = 20;
    canvas = document.getElementById(canvasId);
    height = canvas.height, width = canvas.width;
    mainGraphColor = hexColor;
    drawLabels = dL;
    offset = off; 

    [maxX, maxY, minX, minY] = getLimits(graph);

    const sections = graph.split("\n\n");
    if(sections.length == 1){
        simpleGraph(sections[0]);
    }else{
        complexGraph(sections);
    }
};

export default drawGraph;