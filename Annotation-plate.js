Annotation =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 100; 
	this.title = "Annotation";
	this.vis = this.canvas.set(); // set for visualization
	this.wire = new Array();
};

Annotation.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "khaki", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);

//	************************************************
	this.annotation = this.canvas.set();
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
};

Annotation.prototype.addListeners = function (visual, canvas, node){
	visual.current_point;
	visual.isDrag_inside = false;
	var path = "";
	var temp;
	node.drag(function(dx, dy, x, y, event){ // move function
		var point = canvas.plate.viewToLocal(x,y);
		if (visual.isDrag_inside){
			temp.remove();
			path = path+"L"+point[0]+" "+point[1];
			temp = canvas.path(path).attr({"stroke":Xplate.annotation_color, "stroke-width":1});;
//			var path = canvas.path("M"+visual.current_point[0]+" "+visual.current_point[1]+"L"+point[0]+" "+point[1]);
//			node.push(path);
//			visual.annotation.push(path);
		}
		visual.current_point = point;
        event.stop();
	}, function(x, y){ // drag start function
		visual.current_point = canvas.plate.viewToLocal(x,y);
		path = "M"+visual.current_point[0]+" "+visual.current_point[1];
		temp = canvas.path(path).attr({"stroke":Xplate.annotation_color, "stroke-width":1});
	}, function(){ // drag end function
		node.push(temp);
		visual.annotation.push(temp);
	}
	);
	
	node.mouseover(function(){
		visual.isDrag_inside = true;
		document.body.style.cursor='crosshair';
	});
	node.mouseout(function(event){
		visual.isDrag_inside = false;
		document.body.style.cursor='default';
	});
};


// ************************* Wire Snapping Code **************************

Annotation.prototype.addIt = function (wire){
	return false;
};

Annotation.prototype.update = function (){
	return true;
};

Annotation.prototype.removeData = function (wire){
};

//Annotation = function (container, option, x, y, w, h, b){
//	this.canvas = container;
//	this.option = option;
//	this.width = w; this.height = h;
//	this.x = x; this.y = y;
//	this.branch = b;
//	this.padding = this.width*0.125;
//	this.select_glow = null;
//	this.anchr_padding = this.width*0.025, this.anchr_y_padding = this.width*0.3, this.anchr_width = this.width*0.05;
//	
////		****** Initialization *************************	
//	this.vis = this.canvas.set(); // set for visualization
//	this.visual = null;
//	this.i_anchr_list = new Array(); // input anchor list
//	this.i_wire_list = new Array(); // input wire list
//	this.o_wire_list = new Array(); // input wire list
//	this.o_anchr_list = new Array(); // output anchor list
//	this.o_data_list = new Array();
//	this.o_visual_list = new Array(); // output wire list
//	this.db_list = new Array();
//	this.label_list = new Array();
//	this.common_list = new Array();
////  ************************************************
//	
//	this.visualize(this.x, this.y, this.width, this.height);
//};
//
//Annotation.prototype.visualize = function(x, y, width, height){
//
//	this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "khaki", "fill-opacity":1, "stroke":"black"});
//	this.vis.push(this.vis_rect);
//	this.title = this.canvas.text(0,0,"Annotation");
//	this.title.attr({"x":(this.x+this.width/2), "y":(this.y+this.anchr_y_padding/4+this.title.getBBox().height/2), "font-size":20, "font-weight":"bold"});
//	this.vis.push(this.title);
//	var time = new Date();
//	var time_text = "Date: "+time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+"     Time: "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
//	this.timeStamp = this.canvas.text(0,0,time_text);
//	this.timeStamp.attr({"x":(this.x+this.width/2), "y":(this.y+this.height-this.anchr_y_padding/4-this.timeStamp.getBBox().height/2), "font-size":10, "font-weight":"bold"});
//	this.vis.push(this.timeStamp);
//	
//	this.remove_sign = this.canvas.image("http://upload.wikimedia.org/wikipedia/commons/f/f5/Octagon_delete.svg", this.x+this.padding, this.y+this.padding/4, 30, 30);
//	var visual_plate = this;
//	this.remove_sign.click(function(){
//		visual_plate.remove();
//	});
//	this.vis.push(this.remove_sign);
//	
////	************************************************
//
////	this.addInputDataConnection(this.data);
////	this.addOutputDataConnections(this.data);
//	
////  ************************************************
//	// Add listeners
//	this.addListeners(this, this.canvas, this.vis);
//};
//
//
//Annotation.prototype.addListeners = function (visual, canvas, node){
//	var sx=0, sy=0;
//	visual.glow;
//	var isDrag = false;
//	visual.vis_rect.drag(function(dx, dy, x, y, event){ // move function
//		isDrag = true;
//		visual.vis.toFront();
//        visual.translateTo(visual.x+(dx-sx)*canvas.viewScale, visual.y+(dy-sy)*canvas.viewScale);
//        canvas.setViewBox(canvas.x, canvas.y, canvas.w, canvas.h, true);
//        if (visual.glow)
//        	visual.glow.remove();
//	    sx = dx; sy = dy;
//	}, function(x, y){ // drag start function
//		if (visual.glow)
//			visual.glow.remove();
//		if (visual.select_glow)
//			visual.select_glow.remove();
//		sx = 0;
//		sy = 0;
//	}, function(){ // drag end function
//		if (isDrag){
//	        if (visual.glow)
//	        	visual.glow.remove();
//	        visual.glow = visual.vis_rect.glow();
//	        visual.vis.push(visual.glow);
//	        canvas.plate.canvasManager.updatePosition(visual);
//	        if (visual.isparentvisual){
//	        	visual.select_glow = visual.vis_rect.glow({"color":"red", "width":20});
//	        	visual.vis.push(visual.select_glow);
//	        }
//	        canvas.setViewBox(canvas.x, canvas.y, canvas.w, canvas.h, true);
//			sx = 0; sy = 0;
//			isDrag = false;
//		}
//	}
//	);	
//	
//	this.vis_rect.mouseover(function(){
//		document.body.style.cursor='move';
//	});
//	
//	this.vis_rect.mouseout(function(event){
//		document.body.style.cursor='default';
//	});
//	node.mouseover(function(){
//		canvas.plate.updateActiveVisual(visual, true);
//		visual.glow = visual.vis_rect.glow();
//	});
//	node.mouseout(function(event){
//		canvas.plate.updateActiveVisual(visual, false);
//		if (visual.glow)
//			visual.glow.remove();
//	});
//	visual.current_point;
//	visual.isDrag_inside = false;
//	node.drag(function(dx, dy, x, y, event){ // move function
//		var point = canvas.plate.viewToLocal(x,y);
//		if (visual.isDrag_inside){
//			var path = canvas.path("M"+visual.current_point[0]+" "+visual.current_point[1]+"L"+point[0]+" "+point[1]) 
//			node.push(path);
//			visual.annotation.push(path);
//		}
//		visual.current_point = point;
//        event.stop();
//	}, function(x, y){ // drag start function
//		visual.current_point = canvas.plate.viewToLocal(x,y);
//	}, function(){ // drag end function
//	}
//	);
//	
//	this.vis_rect.click(function(){
//		if (!visual.isparentvisual){
//			canvas.plate.setSelectedVisual(visual);
//			visual.select_glow = visual.vis_rect.glow({"color":"red", "width":20});
//			visual.vis.push(visual.select_glow);
//			visual.isparentvisual = true;
//		}
//		else{
//			canvas.plate.parentVisual = null;
//			visual.isparentvisual = false;
//			if (visual.select_glow)
//				visual.select_glow.remove();
//		}
//	});
//};
//
//Annotation.prototype.unSelect = function(){
//	this.isparentvisual = false;
//	if (this.select_glow)
//		this.select_glow.remove();
//};
//
//Annotation.prototype.translateTo = function(newX, newY) {
//	this.vis.translate(newX-this.x, newY-this.y);
//	this.x = newX;
//	this.y = newY;
//	for (var i=0; i<this.i_wire_list.length; i++){
//		this.i_wire_list[i].updatePosition();
//	}
//	for (i=0; i<this.o_wire_list.length; i++){
//		this.o_wire_list[i].updatePosition();
//	}
//};
//
//Annotation.prototype.remove = function(){
//	if (this.o_wire_list.length==0){
//		this.vis.remove();
//		this.canvas.plate.removeVisualization(this);
//		for (var i=0; i<this.i_wire_list.length; i++)
//			this.i_wire_list[i].removeWire();
//	}
//};
//
//Annotation.prototype.getBBox = function(){
//	var dimension = {};
//	dimension.x = this.x;
//	dimension.y = this.y;
//	dimension.width = this.width;
//	dimension.height = this.height;
//	return dimension;
//};
//
//Annotation.prototype.addVisual = function(visual){
//	this.visual = visual;
//};
//
////***************** Output Data Code **********************************
//
//Annotation.prototype.addOutputDataConnections = function(wire, data){
//	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width;
//	var i = this.o_anchr_list.length;		
//		// Draw Column anchor		
//	var anchor = this.canvas.path("M"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+this.width-padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//				.attr({"fill":"red", "stroke":null});
//	this.o_anchr_list[this.o_anchr_list.length] = anchor;
//	var anchor_text = this.canvas.text(0,0,wire.label);
//	anchor_text.attr({"x":(this.x+this.width-padding/2-anchor_width-anchor_text.getBBox().width-5), "y": (this.y+i*(anchor_width+padding)+padding+y_padding+anchor_text.getBBox().height), "font-size":20, "font-weight":"bold"});
//	this.addOutputAnchorListeners1(this, anchor, wire, data);
//	this.vis.push(anchor);
//	this.vis.push(anchor_text);
//};
//
//Annotation.prototype.addOutputAnchorListeners1 = function (vis, node, wire_in, data_in){
//	var canvas = vis.canvas;
//	var wire = canvas.plate.addWire(node, data_in, wire_in.label, wire_in.dataBase, wire_in.pos, vis);
//	node.drag(function(dx, dy, x, y, event){ // move function
//        wire.update(x, y);        
//	}, function(x, y){ 
//		// drag start function		
//	}, function(){ 
//		// drag end function
//		var visual = canvas.plate.activeVisual;
//		if (canvas.plate.snapWire(wire)){
//			vis.o_visual_list[vis.o_visual_list.length] = visual;
//			vis.o_wire_list[vis.o_wire_list.length] = wire;
//			wire = canvas.plate.addWire(node, data_in, wire_in.label, wire_in.dataBase, wire_in.pos, vis);
//		}
//		else {
//			wire.remove();
//		}
//	}
//	);
//};
//
//Annotation.prototype.removeWire = function(wire){
//	var i = Xplate.findArrayIndex(this.o_wire_list, wire, 0);
//	this.o_wire_list.splice(i, 1);
//};
//
//// ***************** Input Data Code **********************************
//
//Annotation.prototype.addIt = function (wire){
//	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width;
//	var i = this.i_wire_list.length;
//	// Draw Column anchor		
//	var anchor = this.canvas.path("M"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//				.attr({"fill":"red", "stroke":null});
//	this.i_anchr_list[this.i_anchr_list.length] = anchor;
//	wire.addDest(anchor, this);
//	this.i_wire_list[this.i_wire_list.length] = wire;
//	this.addInputAnchorListeners(this, anchor, wire.source.visual);
//	this.vis.push(anchor);
//	
//	var temp = new Array(); var index = new Array();
//	for(var j=0; j<wire.data[1].length; j++){
//		index[j] = wire.data[0][j];
//		temp[j] = wire.data[1][j];
//	}
//	
//	var newData = new Array();
//	newData = [index, temp];
//	var isnew = Xplate.findArrayIndex(this.db_list, wire.dataBase, 0);
//	if (isnew == -1){
//		this.db_list[this.db_list.length] = wire.dataBase;
//		var temp_array = new Array();
//		this.o_data_list[this.o_data_list.length] = temp_array;
//		this.o_data_list[this.o_data_list.length-1][0] = newData;
//		this.label_list[this.label_list.length] = new Array();
//		this.label_list[this.label_list.length-1][0] = wire.label;
//	}
//	else{
//		var list = this.o_data_list[isnew];
//		list[list.length] = newData;
//		var label_list = this.label_list[isnew];
//		label_list[label_list.length] = wire.label;
//	}
//
//	
//	
//	this.addOutputDataConnections(wire, newData);
//	
//	return true;
//};
//
//Annotation.prototype.addInputAnchorListeners = function (vis, node, parent){
//	node.click(function(){
//		if(parent)
//			CanvasManager.animateView(vis.canvas, vis.parent_visual);
//	});
//};

