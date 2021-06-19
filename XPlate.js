//window.onload = function () {
////	var container = document.getElementById('xplate-holder');
////	var canvas = Raphael(container, container.offsetWidth, container.style.height);
////	canvas.ZPD({ zoom: true, pan: true, drag: true });
////	var zpd = new RaphaelZPD(canvas, { zoom: true, pan: true, drag: false});
//	var xplate = new Xplate(canvas, container.offsetWidth, container.offsetHeight);
//};

Xplate = function (canvas, w, h){
	this.canvas = canvas;
	this.canvas.plate = this;
	this.canvas.xview = 0;
	this.canvas.yview = 0;
	this.canvas.w = w;
	this.canvas.h = h;
	this.canvas.x = 0;
	this.canvas.y = 0;
	this.vis = this.canvas.set();
	this.initialize(); 
};

Xplate.prototype.initialize = function (){
//	this.viewport = this.canvas.rect(0, 0, this.canvas.w, this.canvas.h).attr({"fill": "null", "fill-opacity":0, "stroke":"null"}).toFront();
	this.canvas.viewScale = 1;
	this.addListeners(this.canvas, this.vis);
	this.activeVisual = null;
	this.parentVisual = null;
//	this.visualLists = new Array();
	this.dataPlates = new Array();
	this.canvasManager = new CanvasManager();
	Xplate.annotation_color = "#000000";
	Xplate.annotation_width = 1;
};

Xplate.prototype.addData = function (data){	
	this.data = data;	
	var dim = this.canvasManager.getCanvasPosition(0, this.parentVisual);
	var dc = new ViewData(this.canvas, data, document.getElementById('dataURL').value, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, this.dataPlates.length, dim[2]);
	this.dataPlates[this.dataPlates.length] = dc;
	this.vis.push(dc.vis);
	this.canvasManager.addVisual(dc);
	CanvasManager.animateView(this.canvas, dc);
};

Xplate.prototype.addDataPlate = function (name){
	var dp;
	var dim = this.canvasManager.getCanvasPosition(0, this.parentVisual);
	if (name == 3) //Join
		dp = new JoinPlate(this.canvas, name, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, dim[2]);
	else if (name == 4) //FreqCounter
		dp = new FreqCounter(this.canvas, name, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, dim[2]);
	else	
		dp = new DataManipulationPlate(this.canvas, name, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, dim[2]);

	this.vis.push(dp.vis);
	this.canvasManager.addVisual(dp);
};

Xplate.prototype.addBranch = function (vis_name){
	if (this.dataPlates.length == 0)
		return;
	var vis, visual;
	if (vis_name == 0){ //scatterplot
		vis = new ScatterPlot(this.canvas);
	}
	else if (vis_name == 1){ // Line Graph
		vis = new LineGraph(this.canvas);
	}
	else if (vis_name == 2){ // Wordle
		vis = new Wordle(this.canvas);
	}
	else if (vis_name == 3){ // Map
		vis = new WorldMap_plate(this.canvas);
	}
	else if (vis_name == 4){ // Pie Chart
		vis = new PieChart(this.canvas);
	}
	else if (vis_name == 5){ // Bar Chart
		vis = new BarChart(this.canvas);
	}
	else if (vis_name == 6){ // US Map
		vis = new USMap_plate(this.canvas);
	}
	else if (vis_name == 100){ // Annotation
		vis = new Annotation(this.canvas);
	}
	
	var dim = this.canvasManager.getCanvasPosition(1, this.parentVisual);
	if (vis_name != 100)
		visual = new Visual(this.canvas, vis, dim[0], dim[1], CanvasManager.visual_width, CanvasManager.visual_height, this.dataPlates[this.dataPlates.length-1], dim[2], 0);
	else{
		dim = this.canvasManager.getCanvasPosition(0, this.parentVisual);
		visual = new Annotation_Visual(this.canvas, vis, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, this.dataPlates[this.dataPlates.length-1], dim[2], 0);
	}
	this.vis.push(visual.vis);
	this.canvasManager.addVisual(visual);
//	CanvasManager.animateView(this.canvas, visual);
};

Xplate.prototype.addVisualization = function (vis_name, branch, wire, parent){
	var dim = this.canvasManager.getCanvasPosition(0, parent);
	var dp = new DataPlate(this.canvas, wire, dim[0], dim[1], CanvasManager.dp_width, CanvasManager.dp_height, parent);
	this.canvasManager.addVisual(dp);
	dim = this.canvasManager.getCanvasPosition(1, dp);
	var vis, visual;
	if (vis_name == 0){ //scatterplot
		vis = new ScatterPlot(this.canvas);
	}
	else if (vis_name == 1){ // Line Graph
		vis = new LineGraph(this.canvas);
	}
	else if (vis_name == 2){ // Wordle
		vis = new Wordle(this.canvas);
	}
	else if (vis_name == 3){ // Map
		vis = new WorldMap_plate(this.canvas);
	}
	else if (vis_name == 4){ // Pie Chart
		vis = new PieChart(this.canvas);
	}
	else if (vis_name == 5){ // Bar Chart
		vis = new BarChart(this.canvas);
	}
	else if (vis_name == 6){ // US Map
		vis = new USMap_plate(this.canvas);
	}
	
	visual = new Visual(this.canvas, vis, dim[0], dim[1], CanvasManager.visual_width, CanvasManager.visual_height, dp, branch, parent.start+1);
	dp.addOutputDataWires(visual);
	// Move Viewport to new DataPlate location
	this.canvasManager.addVisual(visual);
//	CanvasManager.animateView(this.canvas, dp);
	return dp;
	
};

Xplate.prototype.removeVisualization = function(visual){
	this.canvasManager.removeVisual(visual);
	if (this.parentVisual != null){
		this.parentVisual.unSelect();
		this.parentVisual = null;
	}
};

Xplate.prototype.addWire = function(source, data, label, dataBase, pos, visual){
	var wire = new DataWire(this.canvas, source, data, label, dataBase, pos, visual);
	this.vis.push(wire.vis);
	return wire;
};

Xplate.prototype.snapWire = function(wire){
	if (this.activeVisual != null){
		return this.activeVisual.addIt(wire);
	}
	return false;
};

Xplate.prototype.updateActiveVisual = function (visual, addORremove){
//	Add which visual has mouse over
	if (addORremove)
		this.activeVisual = visual;
	else
		this.activeVisual = null;
};

Xplate.prototype.showAll = function(){
	CanvasManager.showAll(this.canvas);
};

Xplate.prototype.clearAnnotation = function(){
	this.annotation_drawing.remove();
	this.annotation_drawing = this.canvas.set();
};

Xplate.prototype.viewToLocal = function(x, y){
	var point = new Array();
	point[0] = (x-document.getElementById('xplate-holder').offsetLeft)*this.canvas.viewScale+this.canvas.x;
	point[1] = (y-document.getElementById('xplate-holder').offsetTop)*this.canvas.viewScale+this.canvas.y;
	return point;	
};

Xplate.prototype.setSelectedVisual = function(vis){
	if (this.parentVisual != null)
		this.parentVisual.unSelect();
	this.parentVisual = vis;
};

Xplate.prototype.addListeners = function (canvas, node){
	var sx=0, sy=0;
	var scaleFactor = 1.15;
	var plate = this;
	this.annotation_drawing = canvas.set();
//	viewport.drag(function(dx, dy, x, y){ // move function
//        node.translate((dx-sx)/canvas.viewScale, (dy-sy)/canvas.viewScale);
//        sx = dx; sy = dy;
//	}, function(x, y){ // drag start function
//		sx = 0;
//		sy = 0;
//	}, function(){ // drag end function
//		sx = 0; sy = 0;
//	}
//	);
	var isDrag = false;
	var path = "";
	var temp_annotation = this.canvas.set();
	document.getElementById('xplate-holder').onmousedown= function (event) {
		isDrag = true;
//		document.body.style.cursor='crosshair';
		var mouseX, mouseY; // Calculating mouse position for different browsers 		
		if (event.pageX) mouseX = event.pageX;
		else if (event.clientX)
		   mouseX = event.clientX + (document.documentElement.scrollLeft ?
		   document.documentElement.scrollLeft :
		   document.body.scrollLeft);
		else mouseX = 0;
		
		if (event.pageY) mouseY = event.pageY;
		else if (event.clientY)
		   mouseY = event.clientY + (document.documentElement.scrollTop ?
				   document.documentElement.scrollTop :
					   document.body.scrollTop);
		else mouseY = 0;
		sx = mouseX; sy=mouseY;
		var current_point = plate.viewToLocal(sx, sy);
		path = "M"+current_point[0]+" "+current_point[1];
	};
	
	document.getElementById('xplate-holder').onmouseup= function (event) {
		isDrag = false;
		document.body.style.cursor='default';
		temp_annotation.remove();
		plate.annotation_drawing.push(canvas.path(path).attr({"stroke":Xplate.annotation_color, "stroke-width":Xplate.annotation_width}).toBack());
		plate.annotation_drawing.toBack();
		
	};
	
	document.getElementById('xplate-holder').onmousemove= function (event) {
		if (isDrag && event.altKey){
			document.body.style.cursor='move';
			event.cancelBubble = true;
	        event.stopPropagation();
			var mouseX, mouseY; // Calculating mouse position for different browsers 		
			if (event.pageX) mouseX = event.pageX;
			else if (event.clientX)
			   mouseX = event.clientX + (document.documentElement.scrollLeft ?
			   document.documentElement.scrollLeft :
			   document.body.scrollLeft);
			else mouseX = 0;
			
			if (event.pageY) mouseY = event.pageY;
			else if (event.clientY)
			   mouseY = event.clientY + (document.documentElement.scrollTop ?
					   document.documentElement.scrollTop :
						   document.body.scrollTop);
			else mouseY = 0;
//			 node.translate((mouseX-sx), (mouseY-sy));
			 canvas.setViewBox(canvas.x-((mouseX-sx)*canvas.viewScale), canvas.y-((mouseY-sy)*canvas.viewScale), canvas.w, canvas.h, true); canvas.x = canvas.x-((mouseX-sx)*canvas.viewScale); canvas.y = canvas.y-((mouseY-sy)*canvas.viewScale);
			 sx = mouseX; sy = mouseY;
//			 viewport.scale(1,1);
		}
		else if (isDrag && event.ctrlKey /*plate.parentVisual == null*/){
			document.body.style.cursor='crosshair';
			event.cancelBubble = true;
	        event.stopPropagation();
			var mouseXX, mouseYY; // Calculating mouse position for different browsers 		
			if (event.pageX) mouseXX = event.pageX;
			else if (event.clientX)
			   mouseXX = event.clientX + (document.documentElement.scrollLeft ?
			   document.documentElement.scrollLeft :
			   document.body.scrollLeft);
			else mouseXX = 0;
			
			if (event.pageY) mouseYY = event.pageY;
			else if (event.clientY)
			   mouseYY = event.clientY + (document.documentElement.scrollTop ?
					   document.documentElement.scrollTop :
						   document.body.scrollTop);
			else mouseYY = 0;
			var current_point = plate.viewToLocal(sx, sy);
			var point = plate.viewToLocal(mouseXX, mouseYY);
			path = path+"L"+point[0]+" "+point[1];
			temp_annotation.remove();
			temp_annotation.push(canvas.path(path).attr({"stroke":Xplate.annotation_color, "stroke-width":Xplate.annotation_width}).toBack());
			temp_annotation.toBack();
//			plate.annotation_drawing.push(canvas.path("M"+current_point[0]+" "+current_point[1]+"L"+point[0]+" "+point[1]).attr({"stroke":plate.annotation_color, "stroke-width":plate.annotation_width}).toBack());
//			plate.annotation_drawing.toBack();
			sx = mouseXX; sy = mouseYY;
		}
	};
	
//	viewport.node.onmousewheel= function (event) {
	document.getElementById('xplate-holder').onmousewheel= function (event) {
		event.stopPropagation();
		var delta = 0; 
        if (!event) /* For IE. */
                event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta/120;
        } else if (event.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = -event.detail/3;
        }
        
        var mouseX, mouseY; // Calculating mouse position for different browsers 		
		if (event.pageX) mouseX = event.pageX;
		else if (event.clientX)
		   mouseX = event.clientX + (document.documentElement.scrollLeft ?
		   document.documentElement.scrollLeft :
		   document.body.scrollLeft);
		else mouseX = 0;
		
		if (event.pageY) mouseY = event.pageY;
		else if (event.clientY)
		   mouseY = event.clientY + (document.documentElement.scrollTop ?
				   document.documentElement.scrollTop :
					   document.body.scrollTop);
		else mouseY = 0;
        
		var before = new Array();
		before[0] = (mouseX-document.getElementById('xplate-holder').offsetLeft)*canvas.viewScale+canvas.x;
		before[1] = (mouseY-document.getElementById('xplate-holder').offsetTop)*canvas.viewScale+canvas.y;
		var after = new Array();
	   if (delta<0){
		   canvas.setViewBox(canvas.x, canvas.y, canvas.w*scaleFactor, canvas.h*scaleFactor, true); canvas.w = canvas.w*scaleFactor; canvas.h = canvas.h*scaleFactor; 
//		   node.scale(1.1,1.1, 0, 0);
		   canvas.viewScale = canvas.viewScale*scaleFactor;
		   
		   after[0] = (mouseX-document.getElementById('xplate-holder').offsetLeft)*canvas.viewScale+canvas.x;
		   after[1] = (mouseY-document.getElementById('xplate-holder').offsetTop)*canvas.viewScale+canvas.y;
		   canvas.setViewBox(canvas.x-(after[0]-before[0]), canvas.y-(after[1]-before[1]), canvas.w, canvas.h, true); canvas.x = canvas.x-(after[0]-before[0]); canvas.y = canvas.y-(after[1]-before[1]);
	   }
	   else{
		   canvas.setViewBox(canvas.x, canvas.y, canvas.w/scaleFactor, canvas.h/scaleFactor, true); canvas.w = canvas.w/scaleFactor; canvas.h = canvas.h/scaleFactor;
//		   node.scale(1/1.1,1/1.1, 0, 0);
		   canvas.viewScale = canvas.viewScale/scaleFactor;
		   
		   after[0] = (mouseX-document.getElementById('xplate-holder').offsetLeft)*canvas.viewScale+canvas.x;
		   after[1] = (mouseY-document.getElementById('xplate-holder').offsetTop)*canvas.viewScale+canvas.y;
		   canvas.setViewBox(canvas.x-(after[0]-before[0]), canvas.y-(after[1]-before[1]), canvas.w, canvas.h, true); canvas.x = canvas.x-(after[0]-before[0]); canvas.y = canvas.y-(after[1]-before[1]);	  
	   }
	   canvas.safari();
//	   viewport.scale(1,1);
	};
};

Xplate.findArrayIndex = function(array, object, fromIndex){
	if (fromIndex == null) {
        fromIndex = 0;
    } else if (fromIndex < 0) {
        fromIndex = Math.max(0, array.length + fromIndex);
    }
    for (var i = fromIndex, j = array.length; i < j; i++) {
        if (array[i] === object)
            return i;
    }
    return -1;
};