ViewData = function (container, data, datasource, x, y, w, h, dataBase_num, branch){
	if (data == null){
		alert("Input Data Error!!!");
	}
	else{
		this.canvas = container;
		this.data = data;
		this.data.visual = this;
		this.source = datasource;
		this.dataBase_num = dataBase_num;
		this.w = w; this.h = h;
		this.x = x; this.y = y;
		this.width = w, this.height = h;
		this.branch = branch;
		this.padding = this.w*0.125;
		this.select_glow = null;
		this.anchr_padding = this.w*0.025, this.anchr_y_padding = this.w*0.1, this.anchr_width = this.w*0.05;
		
		this.isDrag = true;
		
//		****** Initialization *************************	
		this.vis = this.canvas.set(); // set for visualization
		this.wire_list = new Array();
	//  ************************************************
		
		this.visualize(this.x, this.y, this.w, this.h);
	}
};

ViewData.prototype.visualize = function(x, y, width, height){

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "lightgreen", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	this.title = this.canvas.text(0,0,"Database");
	this.title.attr({"x":(this.x+this.width/2), "y":(this.y+this.anchr_y_padding/4+this.title.getBBox().height/2), "font-size":25, "font-weight":"bold"});
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
	
//	************************************************

	this.addDataConnections(this.data);
	
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
	
	
	
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
}; 

ViewData.prototype.addListeners = function (visual, canvas, node){	
	var sx=0, sy=0;
	visual.glow;
	var isDrag = false;
	visual.vis_rect.drag(function(dx, dy, x, y, event){ // move function
		isDrag = true;
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
		canvas.plate.updateActiveVisual(visual, true);
		visual.glow = visual.vis_rect.glow();
	});
	this.vis_rect.mouseout(function(event){
		document.body.style.cursor='default';
		canvas.plate.updateActiveVisual(visual, false);
		if (visual.glow)
			visual.glow.remove();
	});
	
	this.vis_rect.click(function(){
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


ViewData.prototype.unSelect = function(){
	this.isparentvisual = false;
	if (this.select_glow)
		this.select_glow.remove();
};

ViewData.prototype.translateTo = function(newX, newY) {
	this.vis.translate(newX-this.x, newY-this.y);
	this.x = newX;
	this.y = newY;
	for (var i=0; i<this.wire_list.length; i++){
		this.wire_list[i].updatePosition();
	}
};

ViewData.prototype.remove = function(){
	if (this.wire_list.length==0){
		this.vis.remove();
		this.canvas.plate.removeVisualization(this);
		this.canvas.plate.dataPlates.splice(Xplate.findArrayIndex(this.canvas.plate.dataPlates, this, 0));
	}
};

ViewData.prototype.getBBox = function(){
	var dimension = {};
	dimension.x = this.x;
	dimension.y = this.y;
	dimension.width = this.width;
	dimension.height = this.height;
	return dimension;
};

ViewData.prototype.showAnnotation = function(){
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

//*********** Add Output Connections ***********************

ViewData.prototype.addDataConnections = function(data){
	var num_variables = data.getNumberOfColumns();
	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width; 
	for (var i=0; i<num_variables; i++){		
		// Draw Column anchor		
//		var anchor = this.canvas.path("M"+(this.x+this.w-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+this.w-padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+this.w-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//					.attr({"fill":"red", "stroke":null});
		var anchor = this.canvas.circle((this.x+this.w-padding/2-anchor_width/2), (this.y+i*(anchor_width+padding)+padding+y_padding), anchor_width/2)
					.attr({"fill":"red", "stroke":null});
		this.addAnchorListeners(this, this.canvas, anchor, this.data, i);
		this.vis.push(anchor);
		
		// Write column name
		var text = this.canvas.text(0,0,data.getColumnLabel(i)).attr({"font-size":19});
		var w = text.getBBox().width;
		var h = text.getBBox().height;
		var anc = anchor.getBBox();
		text.attr({"x":anc.x-w/2-5, "y":anc.y+h/4});
//		text.attr({"x":this.w-w/2-padding-anchor_width*1.5, "y":i*(h/2+padding)+padding+y_padding});
		this.vis.push(text);
		
	}
};

ViewData.prototype.addAnchorListeners = function (visual, canvas, node, data, i){
//	var subdata = new Array();
	var temp1 = new Array();
	var temp0 = new Array();
	for (var j=0; j<data.getNumberOfRows(); j++){
		temp1[j] = data.getValue(j,i);
		temp0[j] = j;
	}	
	var subdata = [temp0, temp1];
//	subdata[1] temp2;
	var wire = canvas.plate.addWire(node, subdata, data.getColumnLabel(i), this.data, i, visual);
	node.drag(function(dx, dy, x, y, event){ // move function
		visual.isDrag = false;
        wire.update(x, y);        
	}, function(x, y){ 
		// drag start function	
		visual.isDrag = false;
	}, function(){ 
		// drag end function
		if (canvas.plate.snapWire(wire)){
			visual.wire_list[visual.wire_list.length] = wire;
			wire = canvas.plate.addWire(node, subdata, data.getColumnLabel(i), this.data, i, visual);
		}
		else {
			wire.remove();
		}
		visual.isDrag = true;
	}
	);	
	node.mouseover(function(){
		visual.isDrag = false;
	});
	node.mouseout(function(){
		visual.isDrag = true;
	});	
	
	node.click(function(){
//		node.attr({"fill":"blue"});
//		var subdata = new Array();
//		for (var j=0; j<data.getNumberOfRows(); j++){
//			subdata[j] = data.getValue(j,i);
//		}	
//		canvas.plate.addWire(node, subdata, data.getColumnLabel(i));
	});
};

ViewData.prototype.removeWire = function(wire){
	var i = Xplate.findArrayIndex(this.wire_list, wire, 0);
	this.wire_list.splice(i, 1);
};
