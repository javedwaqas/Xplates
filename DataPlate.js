DataPlate = function (container, wire, x, y, w, h, parent){
	if (wire.data == null){
		alert("Input Data Error!!!");
	}
	else{
		this.canvas = container;
		this.i_wire = wire;
		this.data = wire.data;
		this.parent_visual = parent;
		this.start = parent.start+1;
		this.width = w; this.height = h;
		this.x = x; this.y = y;
		this.branch = this.parent_visual.branch;
		this.padding = this.width*0.125;
		this.select_glow = null;
		
		this.anchr_padding = this.width*0.025, this.anchr_y_padding = this.width*0.3, this.anchr_width = this.width*0.05;
		
//		****** Initialization *************************	
		this.vis = this.canvas.set(); // set for visualization
		this.visual = null;
		this.num_var = 0;
		this.num_input = 0;
		this.i_anchr = null;
		this.o_anchr_list = new Array(); // output anchor list
		this.o_wire_list = new Array(); // input anchor list
	//  ************************************************
		
		this.visualize(15, 15, this.width, this.height);
	}
};

DataPlate.prototype.visualize = function(x, y, width, height){

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "cyan", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	this.title = this.canvas.text(0,0,"Data Filter");
	this.title.attr({"x":(this.x+this.width/2), "y":(this.y+this.anchr_y_padding/4+this.title.getBBox().height/2), "font-size":20, "font-weight":"bold"});
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

	this.addInputDataConnection(this.data);
	this.addOutputDataConnections(this.data);
	
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

DataPlate.prototype.addSortComboBox = function(){
	this.sortCol = 0;
	this.ascendingOrder = true;
	var text = new Array();
	var value = new Array();
	for (var i=0; i<this.o_wire_list.length; i++){
		text[i] = this.o_wire_list[i].label;
		value[i] = i;
	}
	this.comboBox = new ComboBox(this.canvas, this.x+this.width/2-75, this.y+this.anchr_y_padding/2, "Sort: --", text, value, this);
	this.vis.push(this.comboBox.vis);
	this.comboBox1 = new ComboBox(this.canvas, this.x+this.width/2-75, this.y+22+this.anchr_y_padding/2, "Order: ", ["Ascending", "Descending"], [this.o_wire_list.length, this.o_wire_list.length+1], this);
	this.vis.push(this.comboBox1.vis);
};

DataPlate.prototype.comboCallBack = function(i){
//	if (this.o_anchr_list.length != 0) // No more changes when there is a child
//		return false;
	
	if (i>=0){
		
		if (i>=this.o_wire_list.length){
			if (i==this.o_wire_list.length)
				this.ascendingOrder = true;
			else
				this.ascendingOrder = false;
			i = this.sortCol;
		}
		else
			this.sortCol = i;
		
		var collection = this.o_wire_list[i].data[1];
		for(var j = 1; j < collection.length; j++) {
			var key = this.o_wire_list[i].data[1][j];
			var key_Array = new Array();
			for (var r=0; r<this.o_wire_list.length; r++){
				key_Array[key_Array.length] = this.o_wire_list[r].data[0][j];
				key_Array[key_Array.length] = this.o_wire_list[r].data[1][j];
			}
			var k = j - 1;
		 
			var condition = false;
			if (this.ascendingOrder)
				condition = (this.o_wire_list[i].data[1][k] > key) ? true:false;
			else
				condition = (this.o_wire_list[i].data[1][k] < key) ? true:false;
			
			while(k >= 0 && condition) {
//				collection[k+1] = collection[k];
				for(var m=0; m<this.o_wire_list.length; m++){
//					var temp1 = this.data[m];
					this.o_wire_list[m].data[0][k+1] = this.o_wire_list[m].data[0][k];
					this.o_wire_list[m].data[1][k+1] = this.o_wire_list[m].data[1][k];
				}
				
				k = k - 1;
				
				if (this.ascendingOrder)
					condition = (this.o_wire_list[i].data[1][k] > key) ? true:false;
				else
					condition = (this.o_wire_list[i].data[1][k] < key) ? true:false;
			}
//			collection[k+1] = key;
			for(var n=0; n<key_Array.length; n = n+2){
				var d = n/2;
				this.o_wire_list[d].data[0][k+1] = key_Array[n];
				this.o_wire_list[d].data[1][k+1] = key_Array[n+1];
			}
		}
//		this.o_wire_list[i].vis.attr({"stroke":"blue"});
		this.visual.update();
		return true;
	}
	else if (i==-1){
		i=0;
		collection = this.o_wire_list[i].data[0];
		for(j = 1; j < collection.length; j++) {
//			var key = collection[j];
			key = this.o_wire_list[i].data[0][j];
			key_Array = new Array();
			for (r=0; r<this.o_wire_list.length; r++){
				key_Array[key_Array.length] = this.o_wire_list[r].data[0][j];
				key_Array[key_Array.length] = this.o_wire_list[r].data[1][j];
			}
			k = j - 1;
		 
			while(k >= 0 && this.o_wire_list[i].data[0][k] > key) {
//				collection[k+1] = collection[k];
				for(m=0; m<this.o_wire_list.length; m++){
//					var temp1 = this.data[m];
					this.o_wire_list[m].data[0][k+1] = this.o_wire_list[m].data[0][k];
					this.o_wire_list[m].data[1][k+1] = this.o_wire_list[m].data[1][k];
				}
				
				k = k - 1;
			}
//			collection[k+1] = key;
			for(n=0; n<key_Array.length; n = n+2){
				d = n/2;
				this.o_wire_list[d].data[0][k+1] = key_Array[n];
				this.o_wire_list[d].data[1][k+1] = key_Array[n+1];
			}
		}
//		this.o_wire_list[i].vis.attr({"stroke":"blue"});
		this.visual.update();
		return true;
		
	}
	return false;
};

DataPlate.prototype.addListeners = function (visual, canvas, node){
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
	});
	this.vis_rect.mouseout(function(event){
		document.body.style.cursor='default';
	});
	
	node.mouseover(function(){
		visual.glow = visual.vis_rect.glow();
	});
	node.mouseout(function(event){
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

DataPlate.prototype.unSelect = function(){
	this.isparentvisual = false;
	if (this.select_glow)
		this.select_glow.remove();
};

DataPlate.prototype.translateTo = function(newX, newY) {
	this.vis.translate(newX-this.x, newY-this.y);
	this.x = newX;
	this.y = newY;
	
	this.i_wire.updatePosition();
	for (var i=0; i<this.o_wire_list.length; i++){
		this.o_wire_list[i].updatePosition();
	}
};

DataPlate.prototype.remove = function(){
	if (this.o_wire_list.length==0){
		this.vis.remove();
		this.canvas.plate.removeVisualization(this);
		this.i_wire.removeWire();
	}
};

DataPlate.prototype.getBBox = function(){
	var dimension = {};
	dimension.x = this.x;
	dimension.y = this.y;
	dimension.width = this.width;
	dimension.height = this.height;
	return dimension;
};

DataPlate.prototype.addVisual = function(visual){
	this.visual = visual;
};

DataPlate.prototype.showAnnotation = function(){
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

//***************** Output Data Code **********************************

DataPlate.prototype.addOutputDataConnections = function(data){
	var num_variables = data.length/2;
	this.num_var += num_variables; 
	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width;
	for (var i=this.num_var-num_variables, j=0; i<this.num_var; i++, j++){		
		// Draw Column anchor		
//		var anchor = this.canvas.path("M"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+this.width-padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//					.attr({"fill":"red", "stroke":null});
		var anchor = this.canvas.circle((this.x+this.width-padding/2-anchor_width/2), (this.y+i*(anchor_width+padding)+padding+y_padding), anchor_width/2)
					.attr({"fill":"red", "stroke":null});
		this.o_anchr_list[this.o_anchr_list.length] = anchor;
		anchor.visual = this;
		var anchor_text = this.canvas.text(0,0,data[j*2]);
		anchor_text.attr({"x":(this.x+this.width-padding/2-anchor_width-anchor_text.getBBox().width-5), "y": (this.y+i*(anchor_width+padding)+padding+y_padding+anchor_text.getBBox().height/4), "font-size":20, "font-weight":"bold"});
		this.addOutputAnchorListeners1(this, anchor, data[j*2+1], data[j*2], this.i_wire.dataBase, this.i_wire.pos);
		this.vis.push(anchor);
		this.vis.push(anchor_text);
	}
};

DataPlate.prototype.addOutputAnchorListeners1 = function (visual, node, data_in, label, dataBase, pos){
	var canvas = visual.canvas;
	var wire = canvas.plate.addWire(node, data_in, label, dataBase, pos, visual);
	node.drag(function(dx, dy, x, y, event){ // move function
        wire.update(x, y);        
	}, function(x, y){ 
		// drag start function		
	}, function(){ 
		// drag end function
		if (canvas.plate.snapWire(wire)){
			visual.o_wire_list[visual.o_wire_list.length] = wire;
			wire = canvas.plate.addWire(node, data_in, label, dataBase, pos, visual);
		}
		else {
			wire.remove();
		}
	}
	);
};

DataPlate.prototype.removeWire = function(wire){
	var i = Xplate.findArrayIndex(this.o_wire_list, wire, 0);
	this.o_wire_list.splice(i, 1);
};

DataPlate.prototype.addOutputDataWires = function(visual){
	this.visual = visual;
	for (var i=0; i<this.num_var; i++){
		var wire = this.canvas.plate.addWire(this.o_anchr_list[i], this.data[i*2+1], this.data[i*2], this.i_wire.dataBase, this.i_wire.pos, this);
		if (visual.addIt(wire))
			this.o_wire_list[i] = wire;
		
//		this.addOutputAnchorListeners2(this.o_anchr_list[i], this.canvas, this.visual);
	}
	this.addSortComboBox();
};

//DataPlate.prototype.addOutputAnchorListeners2 = function (node, canvas, child){
//	node.click(function(){
//		CanvasManager.animateView(canvas, child);
//	});
//};

// ***************** Input Data Code **********************************

DataPlate.prototype.addInputDataConnection = function(){
	var num_variables = 1;
	this.num_input += num_variables; 
	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width; 
	for (var i=this.num_input-num_variables; i<this.num_input; i++){		
		// Draw Column anchor		
//		var anchor = this.canvas.path("M"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//					.attr({"fill":"red", "stroke":null});
		var anchor = this.canvas.circle((this.x+padding/2+anchor_width/2), (this.y+i*(anchor_width+padding)+padding+y_padding), anchor_width/2)
					.attr({"fill":"red", "stroke":null});
		this.i_anchr = anchor;
		this.i_wire.addDest(this.i_anchr, this);
		this.addInputAnchorListeners(this, anchor);
		this.vis.push(anchor);		
	}

};

DataPlate.prototype.addInputAnchorListeners = function (vis, node){
	node.click(function(){
		CanvasManager.animateView(vis.canvas, vis.parent_visual);
	});
};
