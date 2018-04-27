import drawGraph from "./graphDrawing.js"

var getText = fileName => {
    return new Promise((resolve, reject) => {
        fetch(fileName).then(response => {
            resolve(response.text());
        });
    });
};

getText("tourRed.txt").then(response => {
    drawGraph("canvas",response, "#FF0000AA",true,2);
});

getText("tourBlue.txt").then(response => {
    drawGraph("canvas",response, "#0000FFAA",false,-2);
});

getText("tourOff.txt").then(response => {
    drawGraph("canvas",response, "#00FF00AA",false,0);
});
