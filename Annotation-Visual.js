Annotation_Visual = function (canvas, visual, x, y, w, h, parent_visual, branch, start){
	this.canvas=canvas;
	this.visual=visual;
	this.parent_visual = parent_visual;
	this.branch = branch;
	this.start = start;
	this.width = w; this.height = h;
	this.x = x; this.y = y;
	this.padding = this.width*0.07;
	this.select_glow = null;
	this.anchr_padding = this.width*0.025, this.anchr_y_padding = this.width*0.1, this.anchr_width = this.width*0.025;
	this.isparentvisual = false;
//	****** Initialization *************************	
	this.vis = this.canvas.set(); // set for visualization
	this.anchr_list = new Array();
	this.wire_list = new Array();
	this.o_anchr_list = new Array(); // output anchor list
	this.o_wire_list = new Array(); // input anchor list
//  ************************************************	
	this.visualize();
};

Annotation_Visual.prototype.visualize = function(){
	this.vis_rect = this.canvas.rect(this.x, this.y, this.width, this.height, this.width*0.1).attr({"fill": "white", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	this.visual.visualize(this, this.x+this.padding,this.y+this.padding,this.width-2*this.padding, this.height-2*this.padding);
	this.vis.push(this.visual.vis);
	this.title = this.canvas.text(0,0,this.visual.title);
	this.title.attr({"x":(this.x+this.width/2), "y":(this.y+this.padding/4+this.title.getBBox().height/2), "font-size":20, "font-weight":"bold"});
	this.vis.push(this.title);
	var time = new Date();
	var time_text = "Date: "+time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+"     Time: "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
	this.timeStamp = this.canvas.text(0,0,time_text);
	this.timeStamp.attr({"x":(this.x+this.width/2), "y":(this.y+this.height-this.anchr_y_padding/4-this.timeStamp.getBBox().height/2), "font-size":10, "font-weight":"bold"});
	this.vis.push(this.timeStamp);
	
	this.remove_sign = this.canvas.image("http://upload.wikimedia.org/wikipedia/commons/f/f5/Octagon_delete.svg", this.x+this.padding/4, this.y+this.padding/4, 30, 30);
	var visual_plate = this;
	this.remove_sign.click(function(){
		visual_plate.remove();
	});
	this.vis.push(this.remove_sign);
	
//	****************** Title Change **********************
	
	this.title.click(function(){
		visual_plate.canvas.plate.updateActiveVisual(visual_plate, false);
		if (visual_plate.glow)
			visual_plate.glow.remove();
		var text =  prompt("Enter Text!!!", ""+visual_plate.title_string);
		if (text != null){
			visual_plate.title.attr({"text":text});
			visual_plate.title_string = text;
		}			
		document.body.style.cursor='default';
	});
	this.title.mouseover(function(){
		document.body.style.cursor='text';
	});
	this.title.mouseout(function(){
		document.body.style.cursor='default';
	});
	
//	******************** Adding Annotation *********************************
	this.annotation = this.canvas.set();
	this.annotation_string = "Click to enter text!";
	this.annotation_text = this.canvas.text(0, 0, "Click to enter text!");
	this.annotation_text.attr({"text-anchor":'start', "x":(this.x+this.padding/4+40), "y":(this.y-this.annotation_text.getBBox().height-14), "font-size":25});
	this.annotation_rect = this.canvas.rect((this.x+this.padding/4+38), (this.y-this.annotation_text.getBBox().height-12), this.annotation_text.getBBox().width+5, this.annotation_text.getBBox().height+5, 5).attr({"fill":"yellow", "fill-opacity":1, "stroke":"yellowgreen", "stroke-width":3});
	
	this.annotation.push(this.annotation_rect);
	this.annotation.push(this.annotation_text);
	this.annotation_sign = this.canvas.image("http://upload.wikimedia.org/wikipedia/commons/2/20/Text-x-generic.svg", this.x+this.padding/4+30, this.y+this.padding/4, 30, 30);	
	this.annotation_sign.click(function(){
		visual_plate.showAnnotation();
	});
	this.annotation.click(function(){
		visual_plate.canvas.plate.updateActiveVisual(visual_plate, false);
		if (visual_plate.glow)
			visual_plate.glow.remove();
		var text =  prompt("Enter Text!!!", ""+visual_plate.annotation_string);
		if (text != null){
			visual_plate.annotation_text.attr({"text":text});
			visual_plate.annotation_rect.attr({"width":visual_plate.annotation_text.getBBox().width+3});
			visual_plate.annotation_string = text;
		}			
		document.body.style.cursor='default';
	});
	this.annotation.mouseover(function(){
		document.body.style.cursor='text';
	});
	this.annotation.mouseout(function(){
		document.body.style.cursor='default';
	});
	this.annotation.hide();
	this.isAnnotationVisible = false;
	this.vis.push(this.annotation);
	this.vis.push(this.annotation_sign);
	
//	**************************************************************************
	
	this.addListeners(this, this.canvas, this.vis);
};

Annotation_Visual.prototype.addListeners = function (visual, canvas, node){
	var sx=0, sy=0;
	visual.glow;
	var isDrag = false;
	visual.vis_rect.drag(function(dx, dy, x, y, event){ // move function
		isDrag = true;
		if (visual.visual.vis_name != 3) // handling map visual
			visual.vis.toFront();
        visual.translateTo(visual.x+(dx-sx)*canvas.viewScale, visual.y+(dy-sy)*canvas.viewScale);
        canvas.setViewBox(canvas.x, canvas.y, canvas.w, canvas.h, true);
        if (visual.glow)
        	visual.glow.remove();
	    sx = dx; sy = dy;
	}, function(x, y){ // drag start function
		if (visual.glow)
			visual.glow.remove();
		if (visual.select_glow)
			visual.select_glow.remove();
		sx = 0;
		sy = 0;
	}, function(){ // drag end function
		if (isDrag){
	        if (visual.glow)
	        	visual.glow.remove();
	        visual.glow = visual.vis_rect.glow();
	        visual.vis.push(visual.glow);
	        canvas.plate.canvasManager.updatePosition(visual);
	        if (visual.isparentvisual){
	        	visual.select_glow = visual.vis_rect.glow({"color":"red", "width":20});
	        	visual.vis.push(visual.select_glow);
	        }
	        canvas.setViewBox(canvas.x, canvas.y, canvas.w, canvas.h, true);
			sx = 0; sy = 0;
			isDrag = false;
		}
	}
	);	
	
	this.vis_rect.mouseover(function(){
		document.body.style.cursor='move';
	});
	
	this.vis_rect.mouseout(function(event){
		document.body.style.cursor='default';
	});
	
	node.mouseover(function(){
		canvas.plate.updateActiveVisual(visual, true);
		visual.glow = visual.vis_rect.glow();
		visual.vis.push(visual.glow);
	});
	node.mouseout(function(event){
		canvas.plate.updateActiveVisual(visual, false);
		if (visual.glow)
			visual.glow.remove();
	});
	
	this.vis_rect.click(function(){
		isDrag = false;
		if (!visual.isparentvisual){
			canvas.plate.setSelectedVisual(visual);
			visual.select_glow = visual.vis_rect.glow({"color":"red", "width":20});
			visual.vis.push(visual.select_glow);
			visual.isparentvisual = true;
		}
		else{
			canvas.plate.parentVisual = null;
			visual.isparentvisual = false;
			if (visual.select_glow)
				visual.select_glow.remove();
		}
	});
};

Annotation_Visual.prototype.unSelect = function(){
	this.isparentvisual = false;
	if (this.select_glow)
		this.select_glow.remove();
};

Annotation_Visual.prototype.getBBox = function(){
	var dimension = {};
	dimension.x = this.x;
	dimension.y = this.y;
	dimension.width = this.width;
	dimension.height = this.height;
	return dimension;
};

Annotation_Visual.prototype.translateTo = function(newX, newY){
	this.vis.translate(newX-this.x, newY-this.y);
	if (this.visual.vis_name == 3 || this.visual.vis_name == 6) // handling map visual
		this.visual.translate(newX-this.x, newY-this.y);
	this.x = newX;
	this.y = newY;
	this.visual.x = this.x+this.padding;
	this.visual.y = this.y+this.padding;
	for (var i=0; i<this.wire_list.length; i++){
		this.wire_list[i].updatePosition();
	}
	for (i=0; i<this.o_wire_list.length; i++){
		this.o_wire_list[i].updatePosition();
	}		
	if (this.visual.vis_name == 4 || this.visual.vis_name == 5) // handle Pie and Bar chart animation
		this.visual.update();
};

Annotation_Visual.prototype.update = function(){
	return this.visual.update();
};

Annotation_Visual.prototype.remove = function(){
	if (this.o_wire_list.length==0){
		for (var i=0; i<this.wire_list.length; i++)
			this.wire_list[i].removeWire();
		this.vis.remove();
		if (this.visual.vis_name == 3 || this.visual.vis_name == 6) // handling map visual
			this.visual.map.vis.remove();
		this.canvas.plate.removeVisualization(this);
		
	}
};

Annotation_Visual.prototype.showAnnotation = function(){
	this.annotation.toFront();
	if (!this.isAnnotationVisible){
		this.annotation.show();
		this.isAnnotationVisible = true;
	}
	else{
		this.annotation.hide();
		this.isAnnotationVisible = false;
	}
};

// ***************** Input Anchors Code ******************************

Annotation_Visual.prototype.addIt = function (wire){
	if (this.visual.addIt(wire)){
//		var anchor = this.canvas.path("M"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+this.anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2)+" "+(this.y+this.anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+this.anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z");
		var anchor = this.canvas.circle(this.x+this.anchr_padding/2+this.anchr_width/2, (this.y+this.anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding), this.anchr_width/2);
		anchor.attr({"fill":"red", "stroke":null});
		this.anchr_list[this.anchr_list.length] = anchor;
		this.wire_list[this.wire_list.length] = wire;
		wire.addDest(anchor, this);
//		this.addInputAnchorListeners(this.canvas, anchor, this.visual, wire, this.anchr_list, this.wire_list);
		this.addInputAnchorListeners(this, anchor, wire);
		this.vis.push(anchor);
		return true;
	}
	return false;		
};

//Visual.prototype.addInputAnchorListeners = function (canvas, anchor, visual, wire, anchr_list, wire_list){
Annotation_Visual.prototype.addInputAnchorListeners = function (vis, anchor, wire){
	var canvas = vis.canvas;
	var isDrag = false;
	anchor.drag(function(dx, dy, x, y, event){ // move function
		if (vis.o_anchr_list.length == 0){
			wire.update(x, y);
			isDrag = true;
		}
	}, function(x, y){ 
		// drag start function		
	}, function(){ 
		// drag end function
		if (vis.o_anchr_list.length == 0 && isDrag){
			var index = Xplate.findArrayIndex(vis.anchr_list, anchor, 0);
			if (index >=0){
				vis.anchr_list.splice(index, 1);
				vis.wire_list.splice(index, 1);
			}
			vis.visual.removeData(wire);
			anchor.remove();
			if (vis.canvas.plate.snapWire(wire)){
				vis.canvas.plate.addWire(wire.source, wire.data, wire.label, wire.dataBase, wire.pos, wire.source_visual);
			}
			else {
				wire.remove();
				wire.removeWire();
			}
			vis.updateInputAnchors();
		}
		isDrag = false;
	}
	);
	
	anchor.click(function(){
		if (vis.start != 0)
			CanvasManager.animateView(vis.canvas, vis.parent_visual);
		else
			CanvasManager.animateView(vis.canvas, wire.dataBase.visual);
	});
};

Annotation_Visual.prototype.updateInputAnchors = function(){
	for (var i=0; i < this.anchr_list.length; i++){
		var anchor = this.anchr_list[i];
		Visual.wire = this.wire_list[i];

//		anchor.animate({"path":"M"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z"}, 500);
		anchor.remove();
//		anchor = this.canvas.path("M"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.anchr_padding/2+this.anchr_width)+" "+(this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z");
		anchor = this.canvas.circle((this.x+this.anchr_padding/2+this.anchr_width/2), (this.y+i*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding), this.anchr_width/2);
		anchor.attr({"fill":"red", "stroke":null});
		this.anchr_list.splice(i, 1, anchor);
		this.wire_list[i].addDest(anchor, this);
//		this.addInputAnchorListeners(this.canvas, anchor, this.visual, wire, this.anchr_list, this.wire_list);
		this.addInputAnchorListeners(this, anchor, this.wire_list[i]);
		this.vis.push(anchor);
		
//		this.wire_list[i].addDest(anchor, this, true);
//		this.wire_list[i].updatePosition();
	}
//	setTimeout("Visual.w()", 600);
};

Annotation_Visual.prototype.updateInputWires = function(){
	for (var i=0; i < this.wire_list.length; i++){
		this.wire_list[i].updatePosition();
	}
};


//***************** Output Anchors Code ******************************

Annotation_Visual.prototype.addOutputAnchor = function (data){
//	var anchor = this.canvas.path("M"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z");
	var anchor = this.canvas.circle((this.x+this.width-this.anchr_padding/2-this.anchr_width/2), (this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding), this.anchr_width/2);
	anchor.attr({"fill":"red", "stroke":null});
	this.o_anchr_list[this.o_anchr_list.length] = anchor;
	var compoundDataBase = new Array();
	for (var i=0; i<this.wire_list.length; i++){
		compoundDataBase[i] = this.wire_list[i].dataBase;
	}
	var compoundDataPos = new Array();
	for (var j=0; j<this.wire_list.length; j++){
		compoundDataPos[j] = this.wire_list[j].pos;
	}
	var wire = this.canvas.plate.addWire(anchor, data, "_compound", compoundDataBase, compoundDataPos, this);
	this.o_wire_list[this.o_wire_list.length] = wire;
//	wire.addDest(anchor);
//	this.vis.push(wire);
//	this.addListeners(this, this.canvas, this.vis);
	var new_dataPlate = this.canvas.plate.addVisualization(this.visual.vis_name, this.branch, wire, this);
	this.addOutputAnchorListeners(this.visual, anchor, new_dataPlate, data);
	this.vis.push(anchor);
};

Annotation_Visual.prototype.addSpecialOutputAnchor = function (data1, data2, label1, label2){
	var wire1, wire2;
	if (this.o_anchr_list.length == 0){
//		var anchor = this.canvas.path("M"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z");
		var anchor = this.canvas.circle((this.x+this.width-this.anchr_padding/2-this.anchr_width/2), (this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding), this.anchr_width/2);
		anchor.attr({"fill":"red", "stroke":null});
		this.o_anchr_list[this.o_anchr_list.length] = anchor;
		wire1 = this.canvas.plate.addWire(anchor, data1, label1, this.wire_list[0].dataBase, this.wire_list[0].pos, this);
		this.addSpecialOutputAnchorListeners(this, anchor, wire1);
		this.vis.push(anchor);
		
//		anchor = this.canvas.path("M"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+(this.anchr_width/2)+this.anchr_y_padding)+"L"+(this.x+this.width-this.anchr_padding/2-this.anchr_width)+" "+(this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_width+this.anchr_y_padding)+"z");
		anchor = this.canvas.circle((this.x+this.width-this.anchr_padding/2-this.anchr_width/2), (this.y+this.o_anchr_list.length*(this.anchr_width+this.anchr_padding)+this.anchr_padding+this.anchr_y_padding), this.anchr_width/2);
		anchor.attr({"fill":"red", "stroke":null});
		this.o_anchr_list[this.o_anchr_list.length] = anchor;
		wire2 = this.canvas.plate.addWire(anchor, data2, label2, this.wire_list[1].dataBase, this.wire_list[1].pos, this);
		this.addSpecialOutputAnchorListeners(this, anchor, wire2);
		this.vis.push(anchor);
	}
	
	wire1.updateData(data1);
	wire1.updateData(data2);
};

Annotation_Visual.prototype.removeWire = function(wire){
	var i = Xplate.findArrayIndex(this.o_wire_list, wire, 0);
	this.o_wire_list.splice(i, 1);
};

Annotation_Visual.prototype.addOutputAnchorListeners = function (visual, node, child, data){
	node.mouseover(function (){
			visual.highlightData(true, data);
	});
	node.mouseout(function (){
		visual.highlightData(false);
	});
	node.click(function(){
		CanvasManager.animateView(visual.canvas, child);
	});
};

Annotation_Visual.prototype.addSpecialOutputAnchorListeners = function (visual, node, clone_wire){
	var canvas = visual.canvas;
	var wire = canvas.plate.addWire(node, clone_wire.data, clone_wire.label, clone_wire.dataBase, clone_wire.pos, visual);
	node.drag(function(dx, dy, x, y, event){ // move function
        wire.update(x, y);        
	}, function(x, y){ 
		// drag start function		
	}, function(){ 
		// drag end function
		if (canvas.plate.snapWire(wire)){
			visual.o_wire_list[visual.o_wire_list.length] = wire;
			wire = canvas.plate.addWire(node, clone_wire.data, clone_wire.label, clone_wire.dataBase, clone_wire.pos, visual);
		}
		else {
			wire.remove();
		}
	}
	);
};