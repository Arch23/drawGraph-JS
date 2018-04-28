var width, height, ctx, offset, drawLabels, mainGraphColor, margin, maxX, maxY, minX, minY, fitness, position, name, margin;

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

var printLabel = () => {
    let text = "";
    if(name != undefined){
        text += name+" ";
    }
    if(fitness != undefined){
        text += fitness+" ";
    }
    if(text.length != 0){
        const textWidth = ctx.measureText(text).width;
        //hack to get aproximated font height
        const textHeight = ctx.measureText("M").width;

        let x = width-textWidth-margin;
        let y = height-((textHeight+5)*position)-margin;


        ctx.fillStyle = mainGraphColor;
        ctx.fillText(text,x,y);
    }
};

var drawCircle = (x, y) => {
    const r = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = mainGraphColor;
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
    const points = graph.split("\n");

    if(points[0].indexOf("#") != -1){
        mainGraphColor = points[0];
        points.splice(0,1);
    }
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

var getData = graph => {
    let lines = graph.split("\n");
    let data = lines.filter(line => {
        return line.indexOf("//")!=-1;
    });
    let cleanGraph = lines.filter(line => {
        return(line.indexOf("//")==-1);
    }).join("\n");
    data.forEach(el => {
        if(el.indexOf("#color")!=-1){
            const splited = el.split(" ");
            mainGraphColor = splited[1];
        }else if(el.indexOf("#position")!=-1){
            const splited = el.split(" ");
            position = splited[1];
        }else if(el.indexOf("#fitness")!=-1){
            const splited = el.split(" ");
            fitness = splited[1];
        }else if(el.indexOf("#name")!=-1){
            const splited = el.split(" ");
            name = splited[1];
        }
    });
    return cleanGraph.trim();
};

var unsetGlobals = () => {
    width = height = ctx = offset = drawLabels = mainGraphColor = margin = maxX = maxY = minX = minY = fitness = position = name = margin = undefined;
};

var drawGraph = (canvasId, graph,dL=true,off=0,m=20) => {
    //initialize variables
    margin = m;
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext("2d");
    ctx.lineCap="round";

    height = canvas.height, width = canvas.width;
    drawLabels = dL;
    offset = off;
    position = 0;

    graph = getData(graph);
    printLabel();

    [maxX, maxY, minX, minY] = getLimits(graph);

    const sections = graph.split("\n\n");
    if(sections.length == 1){
        simpleGraph(sections[0]);
    }else{
        complexGraph(sections);
    }

    unsetGlobals();
};

export default drawGraph;