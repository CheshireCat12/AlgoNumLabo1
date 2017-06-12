var myFunc = "";
var powTen = 8;
var asymptLimit = 8 * Math.pow(10, 7);
var epsilon = 1 * Math.pow(10, -powTen);

/*
*   function to recover the values from the html page and test the values.
*/
function evaluateFunc()
{
    myFunc = $("mathFunction").value;
    let x = 4;
    let step;
    let min;
    let max;
    try {
        eval(myFunc);

        step = checkValue($("step"));
        min = checkValue($("minValue"));
        max = checkValue($("maxValue"));
        $("error").style.display = "none";
        let intersectionPoints = explore(step, f, min, max);
        applyMethod(intersectionPoints);
        $('plot').style.display='block';
    } catch (e) {
        $("error").innerHTML = "<h3>" + e.name + "</h3><p>" + e.message + "</p>";
        $("error").style.display = "block";
    }
}

/*
*   Function to check if the value pass in argumts is valid
*/
function checkValue(value)
{
    if(value.value == "") throw new TypeError(value.id + " is empty");
    if(isNaN(value.value)) throw new TypeError(value.id + " is not a number");
    return parseFloat(value.value);
}

/*
*   Apply each method on the points found in the explore function.
*   And show them in the html page
*/
function applyMethod(intersectionPoints)
{
    let arrayDichotomy = [];
    let arrayNewton = [];
    let arrayFixedPoint = [];
    let tempDichotomy;
    let tempNewton;
    let tempFixedPoint;
    let t0;
    for(let i = 0; i < intersectionPoints.length; i++)
    {
        t0 = performance.now();
        tempDichotomy = dichotomy(intersectionPoints[i][0] , intersectionPoints[i][1]);
        arrayDichotomy.push([tempDichotomy, (performance.now()-t0).toFixed(3)]);
        t0 = performance.now();
        tempNewton = methodNewton(intersectionPoints[i][0]);
        arrayNewton.push([tempNewton, (performance.now()-t0).toFixed(3)]);
        t0 = performance.now();
        tempFixedPoint=pointFixe(intersectionPoints[i][1]);
        arrayFixedPoint.push([tempFixedPoint, (performance.now()-t0).toFixed(3)]);
    }
    resetArray("resultsDichotomy");
    resetArray("resultsNewton");
    resetArray("resultsFixedPoint");
    let averageDichotomy = displayArray("resultsDichotomy", arrayDichotomy);
    let averageNewton = displayArray("resultsNewton", arrayNewton);
    let averageFixedPoint = displayArray("resultsFixedPoint", arrayFixedPoint);
    let final = displayFinal("par dichotomie", averageDichotomy);
    final += displayFinal("de Newton", averageNewton);
    final += displayFinal("par point fixe", averageFixedPoint);
    $("comparaisonResult").innerHTML = final;
    $('results').style.display='block';
}

/*
*   function to display the final result of the computation
*/
function displayFinal(nameMethod, array)
{
    return "<p>Zéro distinct trouvé grâce à la méthode "+ nameMethod +" : "+ array[0] +", avec un temps moyen de "+ array[1] +" milliseconds</p>";
}

function resetArray(id)
{
    let tableRef = $(id);
    tableRef.innerHTML = "<tr><th>Zéro en</th><th>temps(ms)</th></tr>";
}

/*
*   Function to show the array pass in paramters in the html table
*
*   Arguments:  id (the id of the html table)
*               array (the array to show)
*
*   Return:     array (the number of distinct roots found, and the average time to found them)
*/
function displayArray(id, array)
{
    let tableRef = $(id);
    let newRow;
    let newCell;
    let newText;
    let countTime = 0;
    let countDisctinct = 0;
    let temp = array[0];
    let arrayResult = [];
    arrayResult.push(temp);
    for(let i = 0; i < array.length; i++)
    {
        // Insert a row in the table at the last row
        newRow   = tableRef.insertRow(tableRef.rows.length);
        // Insert a cell in the row at index 0
        newCell = newRow.insertCell(0);
        newText = document.createTextNode(array[i][0]);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newText = document.createTextNode(array[i][1]);
        newCell.appendChild(newText);

        if(temp !== array[i][0] && isNumeric(array[i][0]))
        {
            countDisctinct++;
            countTime += Number(array[i][1]);
        }
        temp = array[i][0];
    }
    return [countDisctinct, (countTime / countDisctinct).toFixed(3)];
}

/*
*   Funtion to find the roots by the Newton's method.
*
*   Arguments : a & b the 2 limit needed in the dichotomy method
*
*   return : the root found
*/
function methodNewton(x0)
{
    let f2 = fDerivate(f, 0.01);
    let x1 = x0;
    let x2 = x1 - f(x1) / f2(x1);
    while(Math.abs(x2 - x1) > epsilon)
    {
        x1 = x2;
        x2 = x1 - f(x1) / f2(x1);
    }
    if(isNaN(x2))
    {
        x2 = "Asymptote";
    }
    return (x2 = isZero(x2)).toFixed(powTen);
}

/*
*   Funtion to find the roots by the fixed point method.
*
*   Arguments : a & b the 2 limit needed in the dichotomy method
*
*   return : the root found
*/
function pointFixe(x0)
{
    let h = function(x)
    {
        return f(x) + x;
    }
    let x1 = x0;
    let x2 = h(x1);
    let count = 0;
    while(Math.abs(x2 - x1) > epsilon && count <= 150000)
    {
        count++;
        x1 = x2;
        x2 = h(x1);
    }
    if(count >= 150000 || x2 >= asymptLimit)
    {
        x2 = "Error computation";
    }
    return (x2 = isZero(x2)).toFixed(powTen);
}

/*
*   Funtion to find the roots by the dichotomy's method.
*
*   Arguments : a & b the 2 limit needed in the dichotomy method
*
*   return : the root found
*/
function dichotomy(a, b)
{
    let sa = Math.sign(f(a));
    let x = (a + b) / 2;
    let sx = Math.sign(f(x))
    while((b - a) > epsilon)
    {
        if(sx != sa)
        {
            b = x;
        }else{
            a = x;
        }
        x = (a + b)/2;
        sx = Math.sign(f(x))
    }
    let result = (a + b)/2;
    if (f(result) > asymptLimit || f(result) < -asymptLimit){
        return "Asymptote";
    }
    return (result = isZero(result)).toFixed(powTen);
}

/*
*   Method to check if the number pass in paramters is close enough from zero to be a zero. If it's true return 0 else return the number.
*
*   Arguments : value (Number to check)
*
*   return :    0 or the value
*/
function isZero(value)
{
    if(Math.abs(value) < Math.pow(10, -powTen))
    {
        return 0;
    }
    return value;
}

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/*
*	Function to explore the range, this function is used to found all the values where the function past in parameters touch zero.
*	This function use a constant step and we used this function for a disctontinuous function.
*
*	Arguments :	step (The size of the step)
*				f (the mathematical function to explore)
*				bornesAry (the array where the bornes will be store)
*				resultAry (the array where the mathematical function touch zero)
*
*	Returns :		nothing
*/
function explore(step, f, min, max){
    intersectionPoints = [];
    let i;
    for (i = min; i < max; i+= step)
    {
        if ((f(i) > 0 && f(i+step) < 0) || (f(i) < 0 && f(i+step) > 0))
        {
            intersectionPoints.push(new Array(i, i+1));
        }
    }
    return intersectionPoints;
}

/*
*   Function to return the derivate of the function pass in arguments.
*
*   Arguments : f (the base function)
*               h (the error )
*
*   Returns :   the approximated derivative function
*/
function fDerivate(f, h)
{
    var newFunc = function(x)
    {
        return (8.0*(f(x + (h / 2.0)) - f(x - (h / 2.0))) - f(x + h) + f(x - h)) / (6 * h);
    }
    return newFunc;
}

/*
*   return the evaluated function passed in arguments
*/
function f(x)
{
    return eval(myFunc);
}

function $(id)
{
    return document.getElementById(id);
}

function log(data)
{
    console.log(data);
}

/***********************************************\
*   Plot the funciton
\***********************************************/

function plotFunction()
{
    var min = parseFloat($("minValue").value);
    var max = parseFloat($("maxValue").value);

    var plotCos = plotCalculation(f, "MathFunction", min, max);


    var data = [plotCos];

    var range = {
        xaxis: {
            range: [min,max]

        },
        yaxis: {
            range: [-10, 10]

        },
        hovermode: 'closest'
    };

    Plotly.newPlot("FunctionPlot", data, range);

}

/*
*   function to calculate the point for the plot function
*/
function plotCalculation(functionToPlot, name, min, max)
{
    plot = {};
    plot.type = 'scatter';
    plot.x = [];
    plot.y = [];
    plot.name = name;

    let x = min;

    while (x < max)
    {
        plot.x.push(x);
        plot.y.push(functionToPlot(x));
        x += 0.01;
    }

    return plot;
}
