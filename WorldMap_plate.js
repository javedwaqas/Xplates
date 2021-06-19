WorldMap_plate =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 3; 
	this.title = "World-Map";
	this.vis = this.canvas.set(); // set for visualization
	this.plot = this.canvas.set();
	this.wire = new Array();
	this.lines = new Array();
	this.colors = ["blue", "green", "cyan", "brown", "yellow", "red", "black"];
};

WorldMap_plate.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "0-#9bb7cb-#adc8da", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	
	this.map = this.canvas.WorldMap(this, this.width);
	this.map_vis = this.canvas.set();
//	this.vis.push(this.map.vis); // don't do this this is handled inside usmap.js
	
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
	this.map.vis.toFront();
};

WorldMap_plate.prototype.translate = function(dx, dy){
	this.map.vis.translate(dx*1000/this.width, dy*1000/this.width);
};

WorldMap_plate.prototype.addListeners = function (visual, canvas, node){
//	var highlight;
	node.drag(function(dx, dy, x, y, event){ // move function
		this.highlight.attr({"width":(dx)*canvas.viewScale, "height":(dy)*canvas.viewScale});
		if (visual.wire.length != 0)
			visual.highlightSelectData(this.highlight);
        event.stop();
	}, function(x, y){ // drag start function
		var point = canvas.plate.viewToLocal(x,y);
		this.highlight = canvas.rect(point[0], point[1],0.0001,0.0001).attr({"fill":"white", "fill-opacity":0.2}).toFront();
		this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
	}, function(){ // drag end function
		if (visual.wire.length>=2){
			visual.selectData(this.highlight);
			visual.plot.attr({"fill": "green", "stroke":"green"});
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

WorldMap_plate.prototype.highlightSelectData = function(rect){
	// Local Method
	var bounds = rect.getBBox();
	for (var j=0; j<this.plot.length; j++){
		var point = this.plot[j].getBBox();
		if (point.x>=bounds.x && point.x+point.width<=bounds.x+bounds.width && point.y>=bounds.y && point.y+point.height<=bounds.y+bounds.height){
			this.plot[j].attr({"fill":"blue", "stroke":"blue"});
		}
		else
			this.plot[j].attr({"fill":"green", "stroke":"green"});
	}
};

WorldMap_plate.prototype.selectData = function(rect){
	// o/p = [label1, data1, index2, data2, ...]
	var bounds = rect.getBBox();
	var selectData = new Array();
	var subdata1 = new Array(); var subdata2 = new Array();
	var temp1 = new Array(); var index1 = new Array();
	var temp2 = new Array(); var index2 = new Array();
	
	for (var j=0; j<this.plot.length; j++){
		var point = this.plot[j].getBBox();
		if (point.x+point.width/2>=bounds.x && point.x+point.width/2<=bounds.x+bounds.width && point.y+point.height/2>=bounds.y && point.y+point.height/2<=bounds.y+bounds.height){
			temp1[temp1.length] = this.wire[0].data[1][j]; index1[index1.length] = this.wire[0].data[0][j]
			temp2[temp2.length] = this.wire[1].data[1][j]; index2[index2.length] = this.wire[1].data[0][j];
		}
	}
	subdata1 = [index1, temp1];
	subdata2 = [index2, temp2];
		
	selectData = [this.wire[0].label, subdata1, this.wire[1].label, subdata2];
	
	if (temp1.length>0)
		this.visual.addOutputAnchor(selectData);
};

WorldMap_plate.prototype.highlightData = function(ishighlight, data){
	if (!ishighlight){
		this.plot.attr({"fill":"green", "stroke": "green"});
		return;
	}
	var temp = data[1];
	var datax = temp[1];
	temp = data[3];
	var datay = temp[1];
	
	for (var i=0; i<datax.length; i++){
		for (var j=0; j<this.wire[0].data[1].length; j++){
			if (datax[i]==this.wire[0].data[1][j] && datay[i]==this.wire[1].data[1][j]){
				this.plot[j].attr({"fill":"blue", "stroke": "blue"});
				break;
			}
		}
	}
};

// ************************* Wire Snapping Code **************************

WorldMap_plate.prototype.addIt = function (wire){
//	if (this.wire.length<2){
		this.wire[this.wire.length] = wire;
		if (this.wire.length >= 2)
			this.addData();
		return true;
//	}
//	return false;
};

WorldMap_plate.prototype.addData = function (){	
	if (this.wire.length<2)
		return;
	
	if (this.wire.length>2)
		this.removeAll();
	
	this.lat = this.wire[0].data[1];
	this.lang = this.wire[1].data[1];
	
	for (var i=0; i<this.lat.length; i++){
		var message = null;
		for (var j=2; j<this.wire.length; j++){
			if (message != null)
				message += "\n"+this.wire[j].label+": "+this.wire[j].data[1][i];
			else
				message = this.wire[j].label+": "+this.wire[j].data[1][i];
		}
		this.plot.push(this.map.plot(this.lat[i], this.lang[i], message));
	}
	this.vis.push(this.plot);
};

WorldMap_plate.prototype.update = function (){
	if (this.wire.length>=2){
		this.plot.remove();
		this.plot = this.canvas.set();
		this.addData();
		return true;
	}
	return false;
};

WorldMap_plate.prototype.removeData = function (wire){
	if (this.wire.length>=2){
		this.plot.remove();
		this.plot = this.canvas.set();
	}
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
	this.addData();
};

WorldMap_plate.prototype.removeAll = function (){
	if (this.wire.length>2){
		this.plot.remove();
		this.plot = this.canvas.set();
	}
};
