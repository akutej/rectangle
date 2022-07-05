
$(document).ready(function () {
var lineOffset = 4; 
var anchrSize = 3;//definiert die Größe der Punkte an den Ecken

var mousedown = false; //defniert, dass Mousdown mal auf null gestellt wird
var clickedArea = {box: -1, pos:'o'};
var x1 = -1;
var y1 = -1;
var x2 = -1;
var y2 = -1;

var boxes = [];
var tmpBox = null;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvas1 = document.getElementById('canvas1'); //likelihood element
var canvas2 = document.getElementById('canvas2'); //impact element
var ctx1 = canvas1.getContext('2d');			  //likelihood element	
var ctx2 = canvas2.getContext('2d');			  //likelihood element
ctx1.font = "13px Arial";
ctx2.font = "13px Arial";
ctx1.fillText(document.getElementById('likelihood_low').value, 20, 30); 
ctx1.fillText(document.getElementById('likelihood_mid').value, 230, 30);
ctx1.fillText(document.getElementById('likelihood_high').value, 450, 30);
ctx1.fillText(document.getElementById('likelihood').value, 170, 80);

ctx2.fillText(document.getElementById('impact_low').value, 50, 30); 
ctx2.fillText(document.getElementById('impact_mid').value, 55, 250);
ctx2.fillText(document.getElementById('impact_high').value, 59, 483);
ctx2.save();
ctx2.translate(20, 280);
ctx2.rotate(-Math.PI / 2);
ctx2.fillText(document.getElementById('impact').value, 0, 0);
ctx2.restore();


document.getElementById("canvas").onmousedown = function(e) {
  mousedown = true;
  clickedArea = findCurrentArea(e.offsetX, e.offsetY); //Sieht nach, ob wir auf eine bestehende Area geklickt haben und gibt zurück wo wir den ersten Klick gemacht haben
  document.getElementById("myinputx1").value = e.offsetX; // Schreibt die X Koordinaten des ersten Klicks in das Input Feld
  document.getElementById("myinputy1").value = e.offsetY; // Schreibt die Y Koordinaten des ersten Klicks in das Input Feld
  x1 = e.offsetX; // Schreibt die X Koordinaten des ersten Klicks in die Variable X1
  y1 = e.offsetY; // Schreibt die Y Koordinaten des ersten Klicks in die Variable Y1
  x2 = e.offsetX; // Schreibt die X Koordinaten des ersten Klicks in die Variable X2
  y2 = e.offsetY; // Schreibt die Y Koordinaten des ersten Klicks in die Variable Y2
};
document.getElementById("canvas").onmouseup = function(e) {
	if (clickedArea.box == -1 && tmpBox != null) {
	  	boxes.push(tmpBox); //verschiebt die Box glaub ich
  } else if (clickedArea.box != -1) {
  	var selectedBox = boxes[clickedArea.box];
    if (selectedBox.x1 > selectedBox.x2) {
    	var previousX1 = selectedBox.x1;
      selectedBox.x1 = selectedBox.x2;
      selectedBox.x2 = previousX1;
    }
    if (selectedBox.y1 > selectedBox.y2) {
    	var previousY1 = selectedBox.y1;
      selectedBox.y1 = selectedBox.y2;
      selectedBox.y2 = previousY1;
    }
  }
  clickedArea = {box: -1, pos:'o'};
  tmpBox = null;
  mousedown = false;
  console.log(boxes);
};
document.getElementById("canvas").onmouseout = function(e) {
	if (clickedArea.box != -1) {
  	var selectedBox = boxes[clickedArea.box];
    if (selectedBox.x1 > selectedBox.x2) {
    	var previousX1 = selectedBox.x1;
      selectedBox.x1 = selectedBox.x2;
      selectedBox.x2 > previousX1;
    }
    if (selectedBox.y1 > selectedBox.y2) {
    	var previousY1 = selectedBox.y1;
      selectedBox.y1 = selectedBox.y2;
      selectedBox.y2 > previousY1;
    }
  }
  mousedown = false;
  clickedArea = {box: -1, pos:'o'};
  tmpBox = null;
};

document.getElementById("canvas").onmousemove = function(e) { //Beim Zeichnen sobald die Maus bewegt wird	
  if (mousedown && clickedArea.box == -1) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    document.getElementById("myinputx2").value = e.offsetX;
  	document.getElementById("myinputy2").value = e.offsetY;
      
    redraw();
  } else if (mousedown && clickedArea.box != -1) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    xOffset = x2 - x1;
    yOffset = y2 - y1;
    x1 = x2;
    y1 = y2;

    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 'l'  ||
        clickedArea.pos == 'bl') {
      boxes[clickedArea.box].x1 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 't'  ||
        clickedArea.pos == 'tr') {
      boxes[clickedArea.box].y1 += yOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tr' ||
        clickedArea.pos == 'r'  ||
        clickedArea.pos == 'br') {
      boxes[clickedArea.box].x2 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'bl' ||
        clickedArea.pos == 'b'  ||
        clickedArea.pos == 'br') {
      boxes[clickedArea.box].y2 += yOffset;
    }
    redraw();
  }
}



function redraw() {
  // canvas.width = canvas.width;
  var context = document.getElementById("canvas").getContext('2d'); //Um ein Objekt dieses Interfaces zu erhalten, benutzen Sie die Methode getContext() (en-US) eines <canvas>, mit "2d" als Argument:
  context.clearRect(0, 0, 800, 600);
  
  context.beginPath();
  for (var i = 0; i < boxes.length; i++) {
    drawBoxOn(boxes[i], context);
  }
  if (clickedArea.box == -1) {
    tmpBox = newBox(x1, y1, x2, y2);
    if (tmpBox != null) {
      drawBoxOn(tmpBox, context);
    }
  }
}

function findCurrentArea(x, y) { //Sieht nach, ob wir auf eine bestehende Area geklickt haben und gibt zurück wo wir den ersten Klick gemacht haben
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    xCenter = box.x1 + (box.x2 - box.x1) / 2;
    yCenter = box.y1 + (box.y2 - box.y1) / 2;
    if (box.x1 - lineOffset <  x && x < box.x1 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'tl'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'bl'};
      } else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) {
        return {box: i, pos:'l'};
      }
    } else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'tr'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'br'};
      } else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) {
        return {box: i, pos:'r'};
      }
    } else if (xCenter - lineOffset <  x && x < xCenter + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'t'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'b'};
      } else if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'i'};
      }
    } else if (box.x1 - lineOffset <  x && x < box.x2 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'i'};
      }
    }
  }
  return {box: -1, pos:'o'};
}

function newBox(x1, y1, x2, y2) {
  boxX1 = x1 < x2 ? x1 : x2;
  boxY1 = y1 < y2 ? y1 : y2;
  boxX2 = x1 > x2 ? x1 : x2;
  boxY2 = y1 > y2 ? y1 : y2;
  if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) {
    return {x1: boxX1,
            y1: boxY1,
            x2: boxX2,
            y2: boxY2,
            //lineWidth: 0,
            //color: 'DeepSkyBlue', 
            };
  } else {
    return null;
  }
}

function drawBoxOn(box, context) {
	
	
  xCenter = box.x1 + (box.x2 - box.x1) / 2; //Kalkuliert die Mitte der Box in x-Achse für die Punkte 
  yCenter = box.y1 + (box.y2 - box.y1) / 2; //Kalkuliert die Mitte der Box in y-Achse für die Punkte 
  
  //context.strokeStyle='#ff0000'; //Der Rahmen des Recktecks --> ursprünglich über diesen Parameter übergeben = box.color;
  
  //context.fillRect = (box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1));

  context.rect(box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1)); //Das ist die Hauptbox
   
  //'#F9DC5C';
  //context.lineWidth = box.lineWidth;
  
  context.stroke();
  context.fillStyle ='#F9DC5C'; // Die Farbe der Eckpunkte --> ursprünglich über diesen Parameter übergeben = box.color;
  context.fillRect(box.x1 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  context.fillRect(box.x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize,2 * anchrSize);   //Das ist der deaktivierte Center - Linke Rand Punkt
  context.fillRect(box.x1 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  context.fillRect(xCenter - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);  //Das ist der deaktivierte Center - Obere Rand Punkt
  //context.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize); //Das ist der deaktivierte Center - Center Punkt
  context.fillRect(xCenter - anchrSize, box.y2 - anchrSize, 2 * anchrSize,2 * anchrSize); //Das ist der deaktivierte Center - Untere Rand Punkt
  context.fillRect(box.x2 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  context.fillRect(box.x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize); //Das ist der deaktivierte Center - Rechte Rand Punkt
  context.fillRect(box.x2 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  
}

});

