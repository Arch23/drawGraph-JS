import drawGraph from "./graphDrawing.js"

var getText = fileName => {
    return new Promise((resolve, reject) => {
        fetch(fileName).then(response => {
            resolve(response.text());
        });
    });
};

getText("tourRed.txt").then(response => {
    drawGraph("canvas",response,true,0);
});

getText("tourBlue.txt").then(response => {
    drawGraph("canvas",response,false,0);
});

getText("tourOff.txt").then(response => {
    drawGraph("canvas1",response,false,0);
});