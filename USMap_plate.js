USMap_plate =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 6; 
	this.title = "US-Map";
	this.vis = this.canvas.set(); // set for visualization
	this.plot = this.canvas.set();
	this.wire = new Array();
	this.lines = new Array();
	this.o_data = [new Array(), new Array(), new Array()];
	this.colors = ["blue", "green", "cyan", "brown", "yellow", "red", "black"];
};

USMap_plate.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "white", "fill-opacity":0, "stroke":"black"});
	this.vis.push(this.vis_rect);
	
	this.map = this.canvas.USMap(this, this.width);
	this.map_vis = this.canvas.set();
//	this.vis.push(this.map.vis); // don't do this this is handled inside usmap.js
	
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
	this.map.vis.toFront();
};

USMap_plate.prototype.translate = function(dx, dy){
	this.map.vis.translate(dx*950/this.width, dy*950/this.width);
};

USMap_plate.prototype.addListeners = function (visual, canvas, node){
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

USMap_plate.prototype.highlightSelectData = function(rect){
	
};

USMap_plate.prototype.selectData = function(state, value, index, add){
	
	if (add){
		this.o_data[0][this.o_data[0].length] = index;
		this.o_data[1][this.o_data[1].length] = state;
		this.o_data[2][this.o_data[2].length] = value;
	}
	else{
		var pos = Xplate.findArrayIndex(this.o_data[0], index, 0);
		if (pos != -1){
			this.o_data[0].splice(pos, 1);
			this.o_data[1].splice(pos, 1);
			this.o_data[2].splice(pos, 1);
		}
	}
//	alert("hello");
	this.visual.addSpecialOutputAnchor([this.o_data[0], this.o_data[1]], [this.o_data[0], this.o_data[2]], this.wire[0].label, this.wire[1].label);
//	if (temp1.length>0)
//		this.visual.addOutputAnchor(selectData);
};

USMap_plate.prototype.highlightData = function(ishighlight, data){
	
};

// ************************* Wire Snapping Code **************************

USMap_plate.prototype.addIt = function (wire){
	if (this.wire.length<2){
		this.wire[this.wire.length] = wire;
		if (this.wire.length == 2)
			this.addData();
		return true;
	}
	return false;
};

USMap_plate.prototype.addData = function (){	
	if (this.wire.length<2)
		return;
	this.states = this.wire[0].data[1];
	this.darken = this.wire[1].data[1];
	var maxDarken = Number.MIN_VALUE; var minDarken = Number.MAX_VALUE;
	for (var i=0; i<this.darken.length; i++){
		if (maxDarken < this.darken[i]) maxDarken = this.darken[i];
		if (minDarken > this.darken[i]) minDarken = this.darken[i];
	}
	var range = maxDarken-minDarken;
	for (i=0; i<this.states.length; i++){
		this.map.darkenState(this.states[i], (this.darken[i]-minDarken)/range, this.states[i]+" "+this.wire[1].label+": "+this.darken[i], this.darken[i], i);
//		this.plot.push(this.map.plot(this.states[i], this.darken[i], "Hello"));
	}
//	this.vis.push(this.plot);
};

USMap_plate.prototype.update = function (){
	if (this.wire.length>=2){
		this.plot.remove();
		this.plot = this.canvas.set();
		this.addData();
		return true;
	}
	return false;
};

USMap_plate.prototype.removeData = function (wire){
	if (this.wire.length>=2){
		this.plot.remove();
		this.plot = this.canvas.set();
	}
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
	this.addData();
};
