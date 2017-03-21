<html>
<head>
  <script type="text/javascript" src="js/script.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
  <div id="myDiv" width="400" height="400"></div>


  <script>
  var aryY = new Array();   //affichage du graphe
  var aryX = new Array();
  for (let i = 0; i < 200; i++){
    aryX[i] = i-100;
  }

  aryY = getPlotPoints(f);
  c(aryY[40]);
  var trace1 = {
    x: aryX,
    y: aryY,
    type: 'scatter'
  };
  var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter'
  };
  var data = [trace1];
  Plotly.newPlot('myDiv', data);


  var tabBornes = new Array();
  var tabResultat = new Array();
  explore(1, f, tabBornes, tabResultat);
  getZeros(tabResultat, tabBornes,  0.1**10, f);


  c("bornes : ");
  printDoubleAry(tabBornes);
  c("resultats : ");
  printAry(tabResultat);

  </script>
</body>
</html>
