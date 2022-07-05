
$(document).ready(function () {
var lineOffset = 4;		//legt fest ei groß das Rechteck mindestens sein muss um angelegt/gezeichnet werden 
var anchrSize = 3;		//definiert die Größe der Punkte an den Ecken

var mousedown = false; //definiert, dass Mousdown mal auf null gestellt wird
var clickedArea = {box: -1, pos:'o'};   //das ist ein Objekt das dazu dient Eigenschaften der geklickten Fläche zu definien //box definiert ob man auf überhaupt auf eine Fläche geklickt hat und pos.... 
var x1 = -1; // die Koordinate x1 auf nicht vorhanden gesetzt  
var y1 = -1; // die Koordinate y1 auf nicht vorhanden gesetzt
var x2 = -1; // die Koordinate x2 auf nicht vorhanden gesetzt
var y2 = -1; // die Koordinate y2 auf nicht vorhanden gesetzt

var boxes = [];   		//legt das Array boxes an
var tmpBox = null;		//wir benötigt wenn man mehrere Boxen anlegen will

var count = 0;			//bleibt 0 solange noch keine Box angelegt ist --> wurde von mir eingeführt

//MAIN CANVAS ELEMENT  
var canvas = document.getElementById('canvas');								//Definition des main canvas element
var ctx = canvas.getContext('2d');											//Definition des main canvas element

//ACHSEN BESCHRIFTUNGS CANVAS ELEMENTE 
var canvas1 = document.getElementById('canvas1'); 							//Definition des likelihood element
var canvas2 = document.getElementById('canvas2'); 							//Definition des impact element
var ctx1 = canvas1.getContext('2d');			  							//Definition des likelihood element	
var ctx2 = canvas2.getContext('2d');			  							//Definition des impact element
ctx1.font = "13px Arial";													//Schriftgröße des likelihood element
ctx2.font = "13px Arial";													//Schriftgröße des impact element
ctx1.fillText(document.getElementById('likelihood_low').value, 20, 30); 	//hier wird aus dem zugehörigen INPUT_Field der Wert für das likelihood_low Element geholt und die Position festgelegt
ctx1.fillText(document.getElementById('likelihood_mid').value, 230, 30);	//hier wird aus dem zugehörigen INPUT_Field der Wert für das likelihood_mid Element geholt und die Position festgelegt
ctx1.fillText(document.getElementById('likelihood_high').value, 450, 30); 	//hier wird aus dem zugehörigen INPUT_Field der Wert für das likelihood_high Element geholt und die Position festgelegt
ctx1.fillText(document.getElementById('likelihood').value, 170, 80);		//hier wird aus dem zugehörigen INPUT_Field der Wert für das likelihood Beschrifungs-Element geholt und die Position festgelegt
ctx2.fillText(document.getElementById('impact_low').value, 50, 30); 		//hier wird aus dem zugehörigen INPUT_Field der Wert für das impact_low Element geholt und die Position festgelegt
ctx2.fillText(document.getElementById('impact_mid').value, 55, 250);		//hier wird aus dem zugehörigen INPUT_Field der Wert für das impact_low Element geholt und die Position festgelegt
ctx2.fillText(document.getElementById('impact_high').value, 59, 483);		//hier wird aus dem zugehörigen INPUT_Field der Wert für das impact_low Element geholt und die Position festgelegt
ctx2.translate(20, 280);													//hier wird die Position für das impact Beschriftungs-Element fetsgelegt
ctx2.rotate(-Math.PI / 2);													//Funktion zur 90° Drehung des Textes für das impact Element
ctx2.fillText(document.getElementById('impact').value, 0, 0);				//hier wird aus dem zugehörigen INPUT_Field der Wert für das impact Beschriftungs-Element geholt


//FUNKTION WENN MAUS GEDRÜCKT WIRD
document.getElementById("canvas").onmousedown = function(e) {
  mousedown = true;															//die variable Mousedown geht auf true
  clickedArea = findCurrentArea(e.offsetX, e.offsetY); 						//Sieht nach, ob wir auf eine bestehende Area geklickt haben und gibt zurück wo wir den ersten Klick gemacht haben
  x1 = e.offsetX; 															// Schreibt die X Koordinaten des ersten Klicks in die Variable X1
  y1 = e.offsetY; 															// Schreibt die Y Koordinaten des ersten Klicks in die Variable Y1
  x2 = e.offsetX; 															// Schreibt die X Koordinaten des ersten Klicks in die Variable X2
  y2 = e.offsetY; 															// Schreibt die Y Koordinaten des ersten Klicks in die Variable Y2
};

//FUNKTION WENN MAUS LOSGESLASSEN WIRD
document.getElementById("canvas").onmouseup = function(e) {
	if (clickedArea.box == -1 && tmpBox != null && count == 0 )  //  solange keine Box vorhanden ist und wir auf keiner vorhandenen Fläche sind und wir auch keine Box bearbeiten
	{
		boxes.push(tmpBox); //verschiebt die tmpbox nach dem loslassen in das array boxes und legt sozusagn das Element an
	  	count = 1;			//sobald eine BOX gezeichnet ist wird count auf 1 gesetzt und die schleife verhindert das wieder aufrufen
	  
  	} 
  	else if (clickedArea.box != -1) // wenn genau losgelassen wird, wenn eine Box darunter ist
  	{
  		var selectedBox = boxes[clickedArea.box];   //schreibt das angeklickte Element in die Zwischenvariable "selected box" 
    	   			
    	if (selectedBox.x1 > selectedBox.x2) 		//wenn die bestehende x1 Koordinate größer wird als x2 dann muss x2 zum neuen x1 gemacht werden. Die Funktion dreht das ganze herum
    	{
    		var previousX1 = selectedBox.x1;		//speichert x1 zwischen
      		selectedBox.x1 = selectedBox.x2;		//macht x2 zum neuen x1
      		selectedBox.x2 = previousX1;			//macht den zwischengespeicherten x1 zum neuen x2
      		
   	 	}
    	if (selectedBox.y1 > selectedBox.y2)	//wenn die bestehende y1 Koordinate größer wird als y2 dann muss y2 zum neuen y1 gemacht werden. Die Funktion dreht das ganze herum	 
    	{
    		var previousY1 = selectedBox.y1;	//speichert y1 zwischen y2
    		selectedBox.y1 = selectedBox.y2;	//macht y2 zum neuen y1
      		selectedBox.y2 = previousY1; 		//macht den zwischengespeicherten y1 zum neuen y2
    	}
  }
  clickedArea = {box: -1, pos:'o'}; //nach dem erzeugen bzw. verschieben der Box werden die Objektparameter wieder resetet
  tmpBox = null;					//die tmpbox wird resetet
  mousedown = false; 				//mousedown wird resetet
  console.log(boxes);   			//schreibt das boxes arry in den consolen log -->aufruf mit F12
};

//FUNKTION WENN DER MAUSZEIGER DAS CANVAS VERLÄSST
document.getElementById("canvas").onmouseout = function(e) {
		
	if (clickedArea.box != -1) 
	{
  		var selectedBox = boxes[clickedArea.box];
    	if (selectedBox.x1 > selectedBox.x2) 
    	{
    		var previousX1 = selectedBox.x1;
      		selectedBox.x1 = selectedBox.x2;
      		selectedBox.x2 > previousX1;
    	}
    	if (selectedBox.y1 > selectedBox.y2) 
    	{
    		var previousY1 = selectedBox.y1;
      		selectedBox.y1 = selectedBox.y2;
      		selectedBox.y2 > previousY1;
    	}
  }
  mousedown = false;
  clickedArea = {box: -1, pos:'o'};
  tmpBox = null;
};

//FUNKTION SOBALD DIE MAUS IM CANVAS BEWEGT WIRD
document.getElementById("canvas").onmousemove = function(e) { 
	
  if (mousedown && clickedArea.box == -1 && count == 0)						//Wenn die Maus gedrückt wurde und keine bestehende Area darunter liegt --> Zum erstellen eines neuen Rechtecks
  {
  	
    x2 = e.offsetX;														
    y2 = e.offsetY;
    document.getElementById("myinputx2").value = e.offsetX;
  	document.getElementById("myinputy2").value = e.offsetY;
      
    redraw();
    
  }
  else if (mousedown && clickedArea.box != -1) //Wenn die Maus gedrückt wurde und eine bestehende Area darunter liegt --> Zum verschieben eines bestehenden Rechtecks
  {
  	
    x2 = e.offsetX;
    y2 = e.offsetY;
    xOffset = x2 - x1;
    yOffset = y2 - y1;
    x1 = x2;
    y1 = y2;
    //document.getElementById("myinputx2").value = x1;
  	//document.getElementById("myinputy2").value = y1;
    

    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 'l'  ||
        clickedArea.pos == 'bl') 
    {
      	boxes[clickedArea.box].x1 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 't'  ||
        clickedArea.pos == 'tr') 
    {
      	boxes[clickedArea.box].y1 += yOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tr' ||
        clickedArea.pos == 'r'  ||
        clickedArea.pos == 'br') 
    {
      	boxes[clickedArea.box].x2 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'bl' ||
        clickedArea.pos == 'b'  ||
        clickedArea.pos == 'br') 
    {
      	boxes[clickedArea.box].y2 += yOffset;
    }
    redraw();
  }
};



function redraw() 
{
  var context = document.getElementById("canvas").getContext('2d'); //Um ein Objekt dieses Interfaces zu erhalten, benutzen Sie die Methode getContext() (en-US) eines <canvas>, mit "2d" als Argument:
  context.clearRect(0, 0, 800, 800); //zum Größer ziehen des Rechtecks muss das CANVAS mit dieser Funktion laufend gelöscht werden
  context.beginPath(); 				//Zeichnet einen Pfad ...jedes CANVAS kann immer nur einen Pfad haben
  for (var i = 0; i < boxes.length; i++) {
    drawBoxOn(boxes[i], context);
  }
  if (clickedArea.box == -1)  //wenn box nicht vorhanden ist
  {
  		
    	tmpBox = newBox(x1, y1, x2, y2);
   		if (tmpBox != null) 
   		{
      		drawBoxOn(tmpBox, context);
    	}
    
  }
}

function findCurrentArea(x, y) { //Sieht nach, ob wir auf eine bestehende Area geklickt haben und übernimmt die Koordinaten des Klicks
  	for (var i = 0; i < boxes.length; i++) { //die Schleife durchsucht das Array bis die richtige box gefunden wurde.
    var box = boxes[i];		//die Werte des Objekts werden in die varaible box übernommen			
    xCenter = box.x1 + (box.x2 - box.x1) / 2; 	//Kalkuliert die Mitte der x-Achse
    yCenter = box.y1 + (box.y2 - box.y1) / 2;	//Kalkuliert die Mitte der y-Achse		
   
	if (box.x1 - lineOffset <  x && x < box.x1 + lineOffset) 
    {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) 
      {
      								
        return {box: i, pos:'tl'};	//top left
      } 
      else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) 
      {
        return {box: i, pos:'bl'};	//bottom left
      } 
      else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) 
      {
      	return {box: i, pos:'l'};	//left (middle)	
      }
    } 
    
    else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) 
    {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) 
      {
        return {box: i, pos:'tr'};  //top right
      } 
      else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) 
      {
        return {box: i, pos:'br'};	//bottom right
      } 
      else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) 
      {
        return {box: i, pos:'r'};	//right (middle)		
      }
    }
     
    else if (xCenter - lineOffset <  x && x < xCenter + lineOffset) 
    {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) 
      {
        return {box: i, pos:'t'}; 	//top (middle)
      }
      else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) 
      {
        return {box: i, pos:'b'};	//bottom (middle)	
      } 
      else if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) 
      {
        return {box: i, pos:'i'};	//middle	
      }
    } 
    
    else if (box.x1 - lineOffset <  x && x < box.x2 + lineOffset) 
    {
      if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) 
      {
        return {box: i, pos:'i'};  //oder sonst wo im rechteck
      }
    }
  }
  return {box: -1, pos:'o'}; //wenn wir nicht auf einer Area sind werden die Attribute der Klasse wieder rückgesetzt
}

function newBox(x1, y1, x2, y2) { 		// ZUM ZEICHNEN EINER NEUEN BOX --> Die nächsten Zeilen werden gebraucht um zu wissen, ob der User von links nach recht bzw. oben nach unten oder umgekehrt zeichnet
  boxX1 = x1 < x2 ? x1 : x2;    		// BEDINGUNG WENN x1 kleiner als x2 ist, dann ist boxX1 = x1, falls nicht ist boxX1 = x2 
  boxY1 = y1 < y2 ? y1 : y2;			// BEDINGUNG WENN y1 kleiner als y2 ist, dann ist boxY1 = y1, falls nicht ist boxY1 = y2
  boxX2 = x1 > x2 ? x1 : x2;			// BEDINGUNG WENN x1 größer als x2 ist, dann ist boxX2 = x1, falls nicht ist boxX2 = x2
  boxY2 = y1 > y2 ? y1 : y2;			// BEDINGUNG WENN y1 größer als y2 ist, dann ist boxY2 = y1, falls nicht ist boxY2 = y2
  if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) { //sobald der lineoffset erreicht wurde, werden erst die Koordinaten zur Ausgabe zurück gegeben
    return {x1: boxX1,				//gibt den X Wert der oberen Ecke des Rechtecks zurück
            y1: boxY1,				//gibt den Y Wert der oberen Ecke des Rechtecks zurück
            x2: boxX2,				//gibt den X Wert der unteren Ecke des Rechtecks zurück
            y2: boxY2,				//gibt den Y Wert der unteren Ecke des Rechtecks zurück
            //lineWidth: 0,			//gibt die Strichstärke des Rechtecks an --> wird später an einer anderen Stelle definiert
            //color: 'DeepSkyBlue', //gibt die Farbe des Rechtecks an --> wird später an einer anderen Stelle definiert
            };
  } else {							//solange der eingestellte Lineoffset noch nicht erreicht wurde, passiert erstmal nichts :-)
    return null; 
  }
}

function drawBoxOn(box, context) { //DIESE FUNKTION ZEICHNET DAS RECHTECK
	
	
  xCenter = box.x1 + (box.x2 - box.x1) / 2; //Kalkuliert die Mitte der Box in x-Achse für die Punkte 
  yCenter = box.y1 + (box.y2 - box.y1) / 2; //Kalkuliert die Mitte der Box in y-Achse für die Punkte 
  
  //context.strokeStyle='#ff0000'; //Der Rahmen des Recktecks --> ursprünglich über diesen Parameter übergeben = box.color;
  
  //context.fillRect = (box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1));

  context.rect(box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1)); //Das ist die Hauptbox
 
  
  if (box.x1<box.x2){
  document.getElementById("myinputx1").value = box.x1;
  document.getElementById("myinputx2").value = box.x2;
  }
  else {
  document.getElementById("myinputx1").value = box.x2;
  document.getElementById("myinputx2").value = box.x1;  	
  }
  if (box.y1<box.y2){
  document.getElementById("myinputy1").value = box.y1;
  document.getElementById("myinputy2").value = box.y2;
  }
  else {
  document.getElementById("myinputy1").value = box.y2;
  document.getElementById("myinputy2").value = box.y1;  	
  }
  
    
   
  //'#F9DC5C';
  //context.lineWidth = box.lineWidth;
  //context.strokeStyle = "#749CB2";
  context.stroke();							//zeichnet 
  
  context.fillStyle ='#F9DC5C'; // Die Farbe der Eckpunkte --> ursprünglich über diesen Parameter übergeben = box.color;
  context.fillRect(box.x1 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);	//
  context.fillRect(box.x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize,2 * anchrSize);   //Das ist der aktivierte Center - Linke Rand Punkt
  context.fillRect(box.x1 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  context.fillRect(xCenter - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);  //Das ist der aktivierte Center - Obere Rand Punkt
  //context.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize); //Das ist der deaktivierte Center - Center Punkt
  context.fillRect(xCenter - anchrSize, box.y2 - anchrSize, 2 * anchrSize,2 * anchrSize); //Das ist der aktivierte Center - Untere Rand Punkt
  context.fillRect(box.x2 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  context.fillRect(box.x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize); //Das ist der aktivierte Center - Rechte Rand Punkt
  context.fillRect(box.x2 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  
}

});

