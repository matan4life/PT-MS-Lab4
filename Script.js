// JavaScript source code
function $(id) {
    return document.getElementById(id);
}
class NormalTest {
    constructor() { }
    getBTable() {
        return [
            [.2422, .2434, .2448, .2477, .2491, .2485, .2500, .2508, .2525, .2518, .2530, .2519, .2551, .2536, .2533, .2556, .2560],
            [.2666, .2698, .2702, .2756, .2753, .2789, .2774, .2795, .2784, .2791, .2820, .2804, .2812, .2822, .2830, .2839, .2840],
            [.3120, .3148, .3224, .3286, .3331, .3332, .3317, .3356, .3385, .3367, .3370, .3376, .3376, .3374, .3413, .3363, .3370]
        ];
    }
    erf(x) {
        var sign = (x >= 0) ? 1 : -1;
        x = Math.abs(x);
        var a1 = 0.254829592;
        var a2 = -0.284496736;
        var a3 = 1.421413741;
        var a4 = -1.453152027;
        var a5 = 1.061405429;
        var p = 0.3275911;
        var t = 1.0 / (1.0 + p * x);
        var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    }
    Gauss_Function(x) {
        return (1 + this.erf(x / Math.SQRT2)) / 2;
    }
    Test(x) {
        let stat = new Statistic();
        let result = 0;
        for (let i = 1; i <= x.length; i++) {
            let z = (x[i - 1] - stat.Mean(x)) / (Math.sqrt(stat.Moved_Variance(x)));
            result += Math.abs(this.Gauss_Function(z) - (i - 0.5) / x.length);
        }
        result /= Math.sqrt(x.length);
        let index0 = $('b').value == "90%" ? 0 : $('b').value == "95%" ? 1 : 2; 
        let index1 = x.length > 20 ? 21 : x.length;
        return result < this.getBTable()[index0][index1-5];
    }
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
    Moved_Variance(sample) {
        let sum = 0;
        for (let elem of sample) {
            sum += Math.pow((elem - this.Mean(sample)), 2);
        }
        return sum / sample.length;
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
    Corelation(x, y) {
        return (this.Mean(this.SampleMultiply(x, y)) - this.Mean(x) * this.Mean(y)) / (this.Deviation(x) * this.Deviation(y));
    }
    Determination(x, y) {
        return Math.pow(this.Corelation(x, y), 2);
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
    TestCorel(k, b, size) {
        let x = [];
        let y = [];
        for (let i = 0; i < size; i++) {
            let tempx = this.UniformDistribution(0, 26, 1)[0];
            let tempy = k * x + b;
            x.push(tempx);
            y.push(tempy);
        }
        return [x,y];
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
        let alpha = (points[0].length * exp - xmean * ymean) / (points[0].length *squares -  Math.pow(xmean, 2));
        let beta = ymean - alpha * xmean;
        return [alpha, beta];
    }
    Error(x) {
        var stat = new Statistic();
        let quantile = $('b').value == "90%" ? 0.9 : $('b').value == "95%" ? 0.95 : $('b').value == "99%" ? 0.99 : -1;
        return stat.Z(quantile) * stat.Deviation(x) / Math.sqrt(x.length);
    }
    IsCorrect(x, y) {
        let stat = new Statistic();
        let determ = stat.Determination(x, y);
        return determ < 0.5 ? 0 : determ < 0.8 ? 1 : determ < 1 ? 2 : 3;
    }
    Remnant_Analyse(points) {
        let a = this.MSS(points)[1];
        let b = this.MSS(points)[0];
        let remnants = [];
        for (let i = 0; i < points[0].length; i++) {
            remnants.push(a + b * points[0][i] - points[1][i]);
        }
        let test = new NormalTest();
        let stat = new Statistic();
        return test.Test(remnants) && stat.Mean(remnants) == 0;
    }
    Main() {
        var stat = new Statistic();
        Clearcanvas();
        let points = this.Points($('a').valueAsNumber);
        for (let i = 0; i < points[0].length; i++) {
            DrawPoint(50 * points[0][i], 500 - (5 * points[1][i]));
        }
        DrawLine(this.MSS(points)[0], this.MSS(points)[1]);
        DrawPunctureLine(this.MSS(points)[0], this.MSS(points)[1] + this.Error(points[0]));
        DrawPunctureLine(this.MSS(points)[0], this.MSS(points)[1] - this.Error(points[0]));
        $('formulas').style.display = 'inline-block';
        $('alpha').innerHTML = ("β = "+this.MSS(points)[0]+"");
        $('beta').innerHTML = ("α= " + this.MSS(points)[1] + "");
        $('epsilon').innerHTML = ("ε= " + this.Error(points[0]));
        $('corel').innerHTML = ("r(x, y)= " + stat.Corelation(points[0], points[1]));
        $('determ').innerHTML = ("R^2= " + stat.Determination(points[0], points[1]));
        let coefdeterm = this.IsCorrect(points[0], points[1]);
        $('determination').style.display = 'block';
        if (coefdeterm == 0) {
            $('determination').textContent = "Модель линейной регрессии описывает выборку неадекватно";
        }
        else if (coefdeterm == 1) {
            $('determination').textContent = "Модель линейной регрессии описывает выборку приемлимо";
        }
        else if (coefdeterm == 2) {
            $('determination').textContent = "Модель линейной регрессии описывает выборку достаточно хорошо";
        }
        else if (coefdeterm == 3) {
            $('determination').textContent = "Присутствует функциональная зависимость между x и y";
        }
        $('remnants').style.display = 'block';
        if (!this.Remnant_Analyse(points)) {
            $('remnants').textContent = "Согласно анализу остатков, модель регрессии неудовлетворительно описывает истинную зависимость y от х";
        }
        else {
            $('remnants').textContent = "Согласно анализу остатков, модель регрессии удовлетворительно описывает истинную зависимость y от х";
        }
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
function DrawPunctureLine(k, b) {
    let context = $('canvas').getContext('2d');
    context.beginPath();
    context.moveTo(0, 500 - b * 5);
    for (let i = 0; i <= 26; i += 0.5) {
        if ((i - 0.5) % 1 == 0) {
            context.lineTo(i*50, 500 - (k * i + b) * 5);
            context.moveTo((i + 0.5)*50, 500 - (k * (i + 0.5) + b) * 5);
        }
    }
    context.strokeStyle = "#0B00A2";
    context.stroke();
}
function DrawLine(k, b) {
    let context = $('canvas').getContext('2d');
    context.beginPath();
    context.moveTo(0, 500-b*5);
    context.lineTo(1300, 500-(k * 26 + b)*5);
    context.strokeStyle = "#007C09";
    context.stroke();
}
function Clearcanvas() {
    $('formulas').style.display = 'none';
    $('remnants').style.display = 'none';
    $('determination').style.display = 'none';
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
var temp = new NormalTest();
CreateAxis();

