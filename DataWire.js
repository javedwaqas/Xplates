DataWire = function(canvas, source, data, label, dataBase, pos, visual){
	if (data == null){
		alert("Input Data Error!!!");
	}
	else{
		this.canvas = canvas;
		this.source = source;
		this.source_visual = visual;
		this.data = data; // data[0]=index, data[1]=value
		this.dataBase = dataBase;
		this.pos = pos;
		this.x = source.getBBox().x+source.getBBox().width;
		this.y = source.getBBox().y+source.getBBox().height/2;
		this.label = label;
		this.stroke_width = 3;
		this.stroke = {"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width};
		this.highlight_stroke = {"stroke":"navy", "title":this.label, "stroke-width":this.stroke_width+2};
//		****** Initialization *************************	
		this.vis = this.canvas.set(); // set for visualization
		this.visualize(1, 1);
	}
};

DataWire.prototype.visualize = function(width, height){
	
	this.wire = this.canvas.path("M"+this.x+" "+this.y).toFront();
	this.vis.push(this.wire);
	this.wire.attr({"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width});
	this.addListeners(this, this.wire);
	this.addListeners(this, this.source);
};

DataWire.prototype.update = function(x, y){
//	var point = this.canvas.plate.viewToLocal(x, y);
//	x = (x-this.canvas.x)/this.canvas.viewScale;
//	y = (y-this.canvas.y)/this.canvas.viewScale;
	var point = this.canvas.plate.viewToLocal(x,y);
	this.wire.remove();
	this.x = this.source.getBBox().x+this.source.getBBox().width;
	this.y = this.source.getBBox().y+this.source.getBBox().height/2;
	this.wire = this.canvas.path("M"+this.x+" "+this.y+"C"+(this.x+(point[0]-this.x)*1/4)+" "+(this.y+(point[1]-this.y)*3/4)+" "+(this.x+(point[0]-this.x)*3/4)+" "+(this.y+(point[1]-this.y)*1/4)+" "+point[0]+" "+point[1]).toFront();
//	this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+point[0]+" "+point[1]).toBack();
//	this.vis.push(this.wire);
	this.wire.attr({"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width});
	this.addListeners(this, this.wire);
};

DataWire.prototype.updateData = function(data){
	this.data = data;
};

DataWire.prototype.updatePosition = function(){
	this.x = this.source.getBBox().x+this.source.getBBox().width;
	this.y = this.source.getBBox().y+this.source.getBBox().height/2;
	var x = this.dest.getBBox().x;//+this.dest.getBBox().width;
	var y = this.dest.getBBox().y+this.dest.getBBox().height/2;
	this.wire.remove();
//	this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x+" "+y).toFront();
	
	if (Math.abs(this.x-x) < CanvasManager.x_padding*2 && Math.abs(this.y-y) < CanvasManager.y_padding*2){
		var xy = this.x+CanvasManager.visual_width*0.025+Math.random()*(CanvasManager.x_padding*0.5+Math.random());
		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+xy+" "+this.y+"L"+xy+" "+y+"L"+x+" "+y).toBack();
//			this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x+" "+y).toFront();
	}
	else{
		var x1 = this.x+CanvasManager.visual_width*0.025+Math.random()*(CanvasManager.x_padding*0.75+Math.random());
		var y1;
		if (y > this.y)
			y1 = this.destvisual.y-(CanvasManager.y_padding*0.5*Math.random()+Math.random());
		else
			y1 = this.source_visual.y-(CanvasManager.y_padding*0.5*Math.random()+Math.random());
		var x2 = this.destvisual.x-Math.random()*(CanvasManager.x_padding*0.75+Math.random());
		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x1+" "+this.y+"L"+x1+" "+y1+"L"+x2+" "+y1+"L"+x2+" "+y+"L"+x+" "+y).toBack();
	}
//	else
//		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x+" "+y).toFront();
	this.wire.attr({"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width});
	this.addListeners(this, this.wire);
};

DataWire.prototype.addDest = function(dest, visual, check){
	this.dest = dest;
	this.destvisual = visual;
	this.x = this.source.getBBox().x+this.source.getBBox().width;
	this.y = this.source.getBBox().y+this.source.getBBox().height/2;
	var x = this.dest.getBBox().x;//+this.dest.getBBox().width;
	var y = this.dest.getBBox().y+this.dest.getBBox().height/2;
	this.wire.remove();
	
	
	if (Math.abs(this.x-x) < CanvasManager.x_padding*2 && Math.abs(this.y-y) < CanvasManager.y_padding*2){
		var xy = this.x+CanvasManager.visual_width*0.025+Math.random()*(CanvasManager.x_padding*0.5+Math.random());
		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+xy+" "+this.y+"L"+xy+" "+y+"L"+x+" "+y).toBack();
//			this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x+" "+y).toFront();
	}
	else{
		var x1 = this.x+this.source_visual.width*0.025+Math.random()*(CanvasManager.x_padding*0.75+Math.random());
		var y1;
		if (y > this.y)
			y1 = this.destvisual.y-(CanvasManager.y_padding*0.5*Math.random()+Math.random());
		else
			y1 = this.source_visual.y-(CanvasManager.y_padding*0.5*Math.random()+Math.random());
		var x2 = this.destvisual.x-Math.random()*(CanvasManager.x_padding*0.75+Math.random());
		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x1+" "+this.y+"L"+x1+" "+y1+"L"+x2+" "+y1+"L"+x2+" "+y+"L"+x+" "+y).toBack();
	}
//	else
//		this.wire = this.canvas.path("M"+this.x+" "+this.y+"L"+x+" "+y).toFront();
	this.wire.attr({"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width});
	this.addListeners(this, this.dest);
	this.addListeners(this, this.wire);
};

DataWire.prototype.remove = function(){
	this.wire.remove();
	this.wire = this.canvas.path("M"+this.x+" "+this.y).toFront();
	this.wire.attr({"stroke":"brown", "title":this.label, "stroke-width":this.stroke_width});
	this.addListeners(this, this.wire);
};

DataWire.prototype.removeWire = function(){
	this.wire.remove();
	this.source_visual.removeWire(this);
};

DataWire.prototype.addListeners = function(wire, node){
	node.mouseover(function(){
		wire.wire.attr(wire.highlight_stroke);
	});
	node.mouseout(function(){
		wire.wire.attr(wire.stroke);
	});
	
	node.click(function(){
	});
};
