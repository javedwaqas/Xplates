ScatterPlot =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 0;
	this.title = "Scatter Plot";
	this.vis = this.canvas.set(); // set for visualization
	this.wire = new Array();
//	this.visualize(this.x,this.y,this.width, this.height);
};

ScatterPlot.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;

	var vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "white", "fill-opacity":0, "stroke":null});
	this.vis.push(vis_rect);

//	************************************************
	
	// Draw Grid
	this.grid = this.canvas.set();
	var numGrid = 5;
	this.numGrid = numGrid;
	for (var i=0; i<=numGrid; i++){
		this.grid.push(this.canvas.rect(this.x+0, this.y+i*(height/numGrid), width, 0.0001).toBack()); // horizontal grid
		this.grid.push(this.canvas.rect(this.x+i*(width/numGrid), this.y+0, 0.0001, height).toBack()); // vertical grid
//		this.grid.push(this.canvas.path("M0 "+i*(height/numGrid)+"L"+width+" "+i*(height/numGrid)).toBack());
//		this.grid.push(this.canvas.path("M"+i*(height/numGrid)+" 0L"+i*(height/numGrid)+" "+height).toBack());
	}	
	this.grid.attr("stroke", "lightgray");
	this.vis.push(this.grid);
	
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
};

ScatterPlot.prototype.addListeners = function (visual, canvas, node){
//	var highlight;
	var sx=0, sy=0;
	var px=0, py=0;
	node.drag(function(dx, dy, x, y, event){ // move function
		var point = canvas.plate.viewToLocal(x,y);
		this.highlight.attr({"width":(dx)*canvas.viewScale, "height":(dy)*canvas.viewScale});
		if (visual.wire.length != 0)
			visual.highlightSelectData(this.highlight);
		sx = dx; sy = dy;
        event.stop();
	}, function(x, y){ // drag start function
		sx = 0;
		sy = 0;
		var point = canvas.plate.viewToLocal(x,y);
		px = point[0], py = point[1];
		this.highlight = canvas.rect(point[0], point[1],1,1).toFront();
		this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
	}, function(){ // drag end function
		if (visual.wire.length!=0){
			visual.selectData(this.highlight);
			visual.plot.attr({"fill": "blue", "stroke": "blue"});
		}
		this.highlight.remove();
		sx = 0; sy = 0;
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

ScatterPlot.prototype.highlightSelectData = function(rect){
	// Local Method
	var bounds = rect.getBBox();
//	this.plot.attr({"fill":"green", "stroke": "green"});
	for (var j=0; j<this.plot.length; j++){
		var point = this.plot[j].getBBox();
		if (point.x+point.width/2>=bounds.x && point.x+point.width/2<=bounds.x+bounds.width && point.y+point.height/2>=bounds.y && point.y+point.height/2<=bounds.y+bounds.height){
			this.plot[j].attr({"fill":"green", "stroke": "green"});
		}
		else
			this.plot[j].attr({"fill":"blue", "stroke": "blue"});
	}
};
ScatterPlot.prototype.selectData = function(rect){
	// o/p = [label1, data1, index2, data2, ...]
	var bounds = rect.getBBox();
	var selectData = new Array();
	var subdata1 = new Array(); var subdata2 = new Array();
	var temp1 = new Array(); var index1 = new Array();
	var temp2 = new Array(); var index2 = new Array();
	
	for (var j=0; j<this.plot.length; j++){
		var point = this.plot[j].getBBox();
		if (point.x+point.width/2>=bounds.x && point.x+point.width/2<=bounds.x+bounds.width && point.y+point.height/2>=bounds.y && point.y+point.height/2<=bounds.y+bounds.height){
			temp1[temp1.length] = this.xdata[j]; index1[index1.length] = this.xdata_index[j];
			temp2[temp2.length] = this.ydata[j]; index2[index2.length] = this.ydata_index[j];
		}
	}
	subdata1 = [index1, temp1];
	subdata2 = [index2, temp2];
	if (this.xdata_label == null)
		selectData = [this.ydata_label, subdata1];
	else
		selectData = [this.xdata_label, subdata1, this.ydata_label, subdata2];
	
	if (temp1.length>0)
		this.visual.addOutputAnchor(selectData);
};

ScatterPlot.prototype.highlightData = function(ishighlight, data){
	if (!ishighlight){
		this.plot.attr({"fill":"blue", "stroke": "blue"});
		this.highlight.remove();
		return;
	}
	var temp = data[1];
	var datax = temp[1];
	temp = data[3];
	var datay = temp[1];
//	var temp1 = datax, temp2 = datay;
////	this.plot.attr({"fill":"green", "stroke": "green"});
//	for (var i=0; i<temp1.length; i++){
//		for (var j=0; j<this.plot.length; j++){
//			var point = this.plot[j].getBBox();
//			if (this.x+10+((temp1[i]-this.xmin)/(this.xmax-this.xmin))*(this.width-20) == point.x+point.width/2
//					&& this.y+this.height-(10+((temp2[i]-this.ymin)/(this.ymax-this.ymin))*(this.height-20)) == point.y+point.height/2){
//				this.plot[j].attr({"fill":"green", "stroke": "green"});
//			}
//		}
//	}
	
	var xmin = Number.MAX_VALUE; var xmax = Number.MIN_VALUE; var ymin = Number.MAX_VALUE; var ymax = Number.MIN_VALUE;
	for (var k=0; k<datax.length; k++){
		if (xmin>datax[k]) xmin = datax[k];
		if (xmax<datax[k]) xmax = datax[k];
		if (ymin>datay[k]) ymin = datay[k];
		if (ymax<datay[k]) ymax = datay[k];
	} 
	var x = this.x+10+((xmin-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width-20);
	var w = this.x+10+((xmax-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width-20) - x;
	var y = this.y+this.height-(10+((ymax-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height-20));
	var h = this.y+this.height-(10+((ymin-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height-20)) - y;
	this.highlight = this.canvas.rect(x, y, Math.max(w,1), Math.max(h,1)).attr({"stroke": "red", "stroke-dasharray":"-"}).toFront();
//	this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
	
	var bounds = this.highlight.getBBox();
//	this.plot.attr({"fill":"green", "stroke": "green"});
	for (var j=0; j<this.plot.length; j++){
		var point = this.plot[j].getBBox();
		if (point.x+point.width/2>=bounds.x && point.x+point.width/2<=bounds.x+bounds.width && point.y+point.height/2>=bounds.y && point.y+point.height/2<=bounds.y+bounds.height){
			this.plot[j].attr({"fill":"green", "stroke": "green"});
		}
	}
};

// ************************* Wire Snapping Code **************************

ScatterPlot.prototype.addIt = function (wire){
	if (this.wire.length < 2){
		this.wire[this.wire.length] = wire;
		this.addData();
		return true;
	}
	return false;
};

ScatterPlot.prototype.addData = function (){	
	if (this.wire.length < 2)
		return;
//	if (this.wire.length == 1){
//		this.xdata = this.wire[0].data[0];
//		this.xdata_index = this.wire[0].data[0];
//		this.xdata_label = "index";
//		this.ydata = this.wire[0].data[1];
//		this.ydata_index = this.wire[0].data[0];
//		this.ydata_label = this.wire[0].label;
//	}
//	else{
//		this.plot.remove();
		this.xdata = this.wire[0].data[1];
		this.xdata_index = this.wire[0].data[0];
		this.xdata_label = this.wire[0].label;
		this.ydata = this.wire[1].data[1];
		this.ydata_index = this.wire[1].data[0];
		this.ydata_label = this.wire[1].label;
//	}
	this.xmin = Number.MAX_VALUE; this.xmax = Number.MIN_VALUE; this.ymin = Number.MAX_VALUE; this.ymax = Number.MIN_VALUE;
	for (var i=0; i<this.xdata.length; i++){
		if (this.xmin>this.xdata[i]) this.xmin = this.xdata[i];
		if (this.xmax<this.xdata[i]) this.xmax = this.xdata[i];
		if (this.ymin>this.ydata[i]) this.ymin = this.ydata[i];
		if (this.ymax<this.ydata[i]) this.ymax = this.ydata[i];
	}
	
	// Draw plot
	this.plot = this.canvas.set();
	
	for (var j=0; j<this.xdata.length; j++){
		var point = this.canvas.ellipse(this.x+10+((this.xdata[j]-this.xmin)/Math.max((this.xmax-this.xmin),1))*(this.width-20), this.y+this.height-(10+((this.ydata[j]-this.ymin)/Math.max((this.ymax-this.ymin),1))*(this.height-20)), 5, 5).attr({"title":"x="+this.xdata[j]+", y="+this.ydata[j]});
		var canvas = this.canvas;
		this.plot.push(point);
	}
	this.plot.attr("fill", "blue");
	this.plot.attr("stroke", "blue");
	this.vis.push(this.plot);
	
	// Add Labels
	var x_label, y_label;
	this.label = this.canvas.set();
	for (var k=0; k<=this.numGrid; k++){
		x_label = Math.floor((this.xmin+(this.xmax-this.xmin)*k/this.numGrid)*10)/10;
		y_label = Math.floor((this.ymin+(this.ymax-this.ymin)*(this.numGrid-k)/this.numGrid)*10)/10;
		this.label.push(this.canvas.text(this.x+k*(this.width/this.numGrid), this.y+this.height+15, x_label).attr({"font-size":20}));
		this.label.push(this.canvas.text(this.x+this.width+15, this.y+k*(this.height/this.numGrid), y_label).attr({"font-size":20}));
	}	
	this.vis.push(this.label);
};

ScatterPlot.prototype.update = function(){
	if (this.wire.length>=2){
		this.plot.remove();
		this.label.remove();
		this.addData();
		return true;
	}
	return false;
};

ScatterPlot.prototype.removeData = function (wire){
	if (this.wire.length>=2){
		this.plot.remove();
		this.label.remove();
	}
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
	this.addData();
};
