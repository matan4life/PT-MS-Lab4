// JavaScript source code
function $(id) {
    return document.getElementById(id);
}
class Statistic {
    constructor() {

    }
    Sum(sample) {
        let sum = 0;
        for (let elem of sample) {
            sum += elem;
        }
        return sum;
    }
    SampleMultiply(x, y) {
        let list = [];
        for (let i = 0; i < x.length; i++) {
            list.push(x[i] * y[i]);
        }
        return list;
    }
    Mean(sample) {
        return this.Sum(sample) / sample.length;
    }
    Variance(sample) {
        let sum = 0;
        for (let elem of sample) {
            sum += Math.pow((elem - this.Mean(sample)), 2);
        }
        return sum / (sample.length - 1);
    }
    Deviation(sample) {
        return Math.sqrt(this.Variance(sample));
    }
    Expectation(x, y) {
        return this.Sum(this.SampleMultiply(x, y));
    }
    Z(x) {
        if (x == 0.9) {
            return 1.64;
        }
        if (x == 0.95) {
            return 1.96;
        }
        if (x == 0.99) {
            return 2.575;
        }
    }
}
class LinearRegression {
    constructor() { }
    UniformDistribution(a, b, max) {
        let list = [];
        var counter = 0;
        while (counter < max) {
            list.push(Math.random() * (b - a) + a);
            counter++;
        }
        list.sort((a, b) => a - b);
        return list;
    }
    GeneratePoint() {
        return [this.UniformDistribution(0, 26, 1)[0], this.UniformDistribution(0, 100, 1)[0]];
    }
    Points(size) {
        let x = [];
        let y = [];
        for (let i = 0; i < size; i++) {
            let gp = this.GeneratePoint();
            x.push(gp[0]);
            y.push(gp[1]);
        }
        return [x, y];
    }
    MSS(points) {
        var st = new Statistic();
        let xmean = st.Mean(points[0]);
        let ymean = st.Mean(points[1]);
        let exp = st.Expectation(points[0], points[1]);
        let squares = st.Expectation(points[0], points[0]);
        let alpha = (exp - points[0].length * xmean * ymean) / (squares - points[0].length * Math.pow(xmean, 2));
        let beta = ymean - alpha * xmean;
        return [alpha, beta];
    }
    Error(x) {
        var stat = new Statistic();
        let quantile = $('b').value == "90%" ? 0.9 : $('b').value == "95%" ? 0.95 : $('b').value == "99%" ? 0.99 : -1;
        return stat.Z(quantile) * stat.Deviation(x) / Math.sqrt(x.length);
    }
    Main() {
        Clearcanvas();
        let points = this.Points($('a').valueAsNumber);
        for (let i = 0; i < points[0].length; i++) {
            DrawPoint(50 * points[0][i], 500 - (5 * points[1][i]));
        }
        DrawLine(this.MSS(points)[0], this.MSS(points)[1]);
        DrawLine(this.MSS(points)[0], this.MSS(points)[1] + this.Error(points[0]));
        DrawLine(this.MSS(points)[0], this.MSS(points)[1] - this.Error(points[0]));
    }
}
function DrawPoint(x, y) {
    let context = $('canvas').getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
    context.arc(x, y, 1, 0, 2 * Math.PI);
    context.strokeStyle = "#FF0000";
    context.stroke();
}
//function DrawPunctureLine
function DrawLine(k, b) {
    let context = $('canvas').getContext('2d');
    context.beginPath();
    context.moveTo(0, 500-b*5);
    context.lineTo(1300, 500-(k * 26 + b)*5);
    context.strokeStyle = "#0000FF";
    context.stroke();
}
function Clearcanvas() {
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    CreateAxis();
}
function CreateAxis() {
    var canv = document.getElementById("canvas");
    var context = canv.getContext("2d");
    context.beginPath();
    context.strokeStyle = "#000";
    context.font = "bold 14px sans-serif";
    for (let i = 1; i < 10; i++) {
        context.moveTo(0, 500 - i * 50);
        context.fillText(i * 10 + "", 0, 500 - i * 50);
        context.lineTo(1300, 500 - i * 50);
    }
    for (let i = 1; i < 26; i++) {
        context.moveTo(i * 50, 500);
        context.lineTo(i  * 50, 0);
        context.fillText(i + "", i * 50, 500);
    }
    context.fillText("26", 1285, 500);
    context.fillText("0", 0, 500);
    context.fillText("100", 0, 13);
    context.stroke();
    context.closePath();
}
function CreateRegress() {
    var obj = new LinearRegression();
    obj.Main();
}
CreateAxis();

