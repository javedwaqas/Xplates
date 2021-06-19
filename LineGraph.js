LineGraph =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 1; 
	this.title = "Line Graph";
	this.vis = this.canvas.set(); // set for visualization
	this.wire = new Array();
	this.lines = new Array();
	this.colors = ["blue", "green", "cyan", "brown", "yellow", "red", "black"];
};

LineGraph.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "white", "fill-opacity":0, "stroke":"black"});
	this.vis.push(this.vis_rect);

//	************************************************
	this.numGrid = 5;
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
};

LineGraph.prototype.addListeners = function (visual, canvas, node){
//	var highlight;
	node.drag(function(dx, dy, x, y, event){ // move function
		this.highlight.attr({"width":(dx)*canvas.viewScale, "height":(visual.height)});
        event.stop();
	}, function(x, y){ // drag start function
		var point = canvas.plate.viewToLocal(x,y);
		this.highlight = canvas.rect(point[0], visual.y,0.0001,visual.height).attr({"fill":"red", "fill-opacity":0.2}).toFront();
		this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
	}, function(){ // drag end function
		if (visual.wire.length!=0){
			visual.selectData(this.highlight);
		}
		this.highlight.remove();
	}
	);	
	
//	node.mouseover(function(){
////		make this visual active
////		if (glow == null){
////			glow = node.glow();
//			canvas.plate.updateActiveVisual(visual, true);
////		}
//	});
//	node.mouseout(function(event){
////		make this visual inactive
////		glow.remove();
////		glow = null;
//		canvas.plate.updateActiveVisual(visual, false);
//	});
};

//************************* Data Selection Code **************************

LineGraph.prototype.selectData = function(rect){
	// o/p = [label1, data1, index2, data2, ...]
	var bounds = rect.getBBox();
//	(this.x+((xdata[j]-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width))
	var selectData = new Array();
	var dataSelected = false;
	
	for (var j=0; j<this.wire.length; j++){
		var data = this.wire[j].data;
		var xdata = data[0];
		var ydata = data[1];
		this.xmin = Number.MAX_VALUE; this.xmax = Number.MIN_VALUE; 
		for (var i=0; i<xdata.length; i++){
			if (this.xmin>xdata[i]) this.xmin = xdata[i];
			if (this.xmax<xdata[i]) this.xmax = xdata[i];
		}
		var temp = new Array(); 
		var index = new Array();
		for (var k=0; k<xdata.length; k++){
//			var pointX = this.x+((xdata[k]-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width);
			var pointX = this.x+((k)/xdata.length)*(this.width);
			if (pointX>bounds.x && pointX<bounds.x+bounds.width){
				index[index.length] = xdata[k];
				temp[temp.length] = ydata[k];
			}
		}
		if (temp.length>1)
			dataSelected = true;
		var subData = [index, temp];
		selectData[selectData.length] = this.wire[j].label;
		selectData[selectData.length] = subData;
	}
	if (dataSelected)
		this.visual.addOutputAnchor(selectData);
};

LineGraph.prototype.highlightData = function(ishighlight, inData){
	if (!ishighlight){
		this.highlight.remove();
		return;
	}
	var data = this.wire[0].data;
	var xdata = data[0];
	this.xmin = Number.MAX_VALUE; this.xmax = Number.MIN_VALUE; 
	for (var i=0; i<xdata.length; i++){
		if (this.xmin>xdata[i]) this.xmin = xdata[i];
		if (this.xmax<xdata[i]) this.xmax = xdata[i];
	} 
	var temp = inData[1];
	var index = temp[0];
	var xmin = Number.MAX_VALUE; var xmax = Number.MIN_VALUE; 
	for (var j=0; j<index.length; j++){
		if (xmin>index[j]) xmin = index[j];
		if (xmax<index[j]) xmax = index[j];
	} 
	var x = this.x+((xmin-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width);
	var w = this.x+((xmax-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width) - x;
	this.highlight = this.canvas.rect(x, this.y, w, this.height).attr({"fill":"red", "fill-opacity":0.2}).toFront();
	this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
};

// ************************* Wire Snapping Code **************************

LineGraph.prototype.addIt = function (wire){
	this.wire[this.wire.length] = wire;
	this.addData(wire.data, wire.label);
	return true;
};

LineGraph.prototype.addData = function (data, label){	
		
	var xdata = data[0];
	var ydata = data[1];
	this.xmin = Number.MAX_VALUE; this.xmax = Number.MIN_VALUE; this.ymin = Number.MAX_VALUE; this.ymax = Number.MIN_VALUE;
	for (var i=0; i<xdata.length; i++){
		if (this.xmin>xdata[i]) this.xmin = xdata[i];
		if (this.xmax<xdata[i]) this.xmax = xdata[i];
		if (this.ymin>ydata[i]) this.ymin = ydata[i];
		if (this.ymax<ydata[i]) this.ymax = ydata[i];
	}
	
	// Draw plot
	var plot = this.canvas.set();
	this.lines[this.lines.length] = plot;
	var j=0;
	for (j=0; j<xdata.length-1; j++){
		plot.push(this.canvas.path("M"+(this.x+((j)/Math.max((xdata.length-1),1))*(this.width))+" "+(this.y+this.height-(((ydata[j]-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height)))+"L"+(this.x+((j+1)/Math.max((xdata.length-1),1))*(this.width))+" "+(this.y+this.height-(((ydata[j+1]-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height)))).attr({"title":label, "stroke-width":2}));
//			plot.push(this.canvas.path("M"+(this.x+((xdata[j]-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width))+" "+(this.y+this.height-(((ydata[j]-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height)))+"L"+(this.x+((xdata[j+1]-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width))+" "+(this.y+this.height-(((ydata[j+1]-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height)))).attr({"title":label, "stroke-width":2}));		
	}

	plot.attr("stroke", this.colors[(this.lines.length-1)%this.colors.length]);
	this.vis.push(plot);
	
};

LineGraph.prototype.update = function (){
	for (var i=0; i<this.wire.length; i++){
		this.lines[i].remove();	
	}
	this.lines = new Array();
	for (var j=0; j<this.wire.length; j++){
		var wire = this.wire[j];
		this.addData(wire.data, wire.label);
	}
	return true;
};

LineGraph.prototype.removeData = function (wire){
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
	this.lines[index].remove();
	this.lines.splice(index, 1);
	var temp = this.colors[index];
	this.colors.splice(index, 1);
	this.colors[this.colors.length] = temp;
};
