JoinPlate = function (container, option, x, y, w, h, b){
	this.canvas = container;
	this.option = option;
	this.width = w; this.height = h;
	this.x = x; this.y = y;
	this.branch = b;
	this.padding = this.width*0.125;
	this.select_glow = null;
	this.anchr_padding = this.width*0.025, this.anchr_y_padding = this.width*0.3, this.anchr_width = this.width*0.05;
	
//		****** Initialization *************************	
	this.vis = this.canvas.set(); // set for visualization
	this.visual = null;
	this.isJoined = false;
	this.i_anchr_list = new Array(); // input anchor list
	this.i_wire_list = new Array(); // input wire list
	this.o_wire_list = new Array(); // input wire list
	this.o_anchr_list = new Array(); // output anchor list
	this.o_data_list = new Array();
	this.o_visual_list = new Array(); // output wire list
	this.db_list = new Array();
	this.label_list = new Array();
	this.common_list = new Array();
//  ************************************************
	
	this.visualize(15, 15, this.width, this.height);
};

JoinPlate.prototype.visualize = function(x, y, width, height){

	this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "yellow", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	this.title = this.canvas.text(0,0,"Data Join");
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

//	this.addInputDataConnection(this.data);
//	this.addOutputDataConnections(this.data);
	
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

JoinPlate.prototype.addJoinComboBox = function(){
	if (this.comboBox)
		this.comboBox.vis.remove();	
	
//	if (this.db_list.length<=1)
//		return;
		
	this.common_list = new Array();
	
	var temp_list = this.label_list[0];
	for (var j=0; j<temp_list.length; j++){
		var isCommon = true;
		for (var f=1; f<this.label_list.length; f++){
			var sub_isCommon = false;
			var temp = this.label_list[f];
			for (var k=0; k<temp.length; k++){
				if (temp[k] == temp_list[j]){
					sub_isCommon = true;
					break;
				}
			}
			if (!sub_isCommon){
				isCommon = false;
				break;
			}
		}		
		if (isCommon && this.db_list.length>1){
			this.common_list[this.common_list.length] = temp_list[j];
		}
	}
	
//	if (this.common_list.length<1)
//		return;
	
	this.comboBox = new ComboBox(this.canvas, this.x+this.width/2-75, this.y+this.anchr_y_padding/2, "Join: --", this.common_list, this.common_list, this);
	this.vis.push(this.comboBox.vis);
};

JoinPlate.prototype.comboCallBack = function(value){
	if (this.isJoined)
		return false;
	if (value != -1){
		var db_cols = new Array();
		for (var k=0; k<this.label_list.length; k++){
			var temp = this.label_list[k];
			for (var i=0; i<temp.length; i++){
				if (temp[i] == value){
					db_cols[k] = i;
					break;
				}
			}
		}
		var temp_data_list = new Array();
		for (i=0; i<this.o_data_list.length; i++){
			temp_data_list[i] = new Array();
			for(k=0; k<this.o_data_list[i].length; k++){
				temp_data_list[i][k] = [new Array(), new Array()];
			}
		}
		var first_db_list = this.o_data_list[0][db_cols[0]][1];
		for (i=0; i<first_db_list.length; i++){
			var isCommon = true;
			var pos_list = new Array();
			pos_list[0] = i;
			for (var j=1; j<this.o_data_list.length; j++){
				var db_list = this.o_data_list[j][db_cols[j]];
				var pos = Xplate.findArrayIndex(db_list[1], first_db_list[i], 0);
				if (pos == -1){
					isCommon = false;
					break;
				}
				pos_list[pos_list.length] = pos; // positions for each dataBase
			}
			if (isCommon){
				// store join values
				for(k=0; k<temp_data_list.length; k++){
					temp = temp_data_list[k];
					for (var r=0; r<temp.length; r++){
						temp[r][0][temp[r][0].length] = this.o_data_list[k][r][0][pos_list[k]];
						temp[r][1][temp[r][1].length] = this.o_data_list[k][r][1][pos_list[k]];
					}
				}
			}
		}
		
		// Now remove old values and add new ones
		for (i=0; i<this.o_data_list.length; i++){
			for(k=0; k<this.o_data_list[i].length; k++){
				temp = this.o_data_list[i][k];
				var newValues = temp_data_list[i][k];
				temp[0].splice(0,temp[0].length);
				temp[1].splice(0,temp[1].length);
				for (j=0; j<newValues[1].length; j++){
					temp[0][j] = newValues[0][j];
					temp[1][j] = newValues[1][j];
				}
			}
		}
		this.isJoined = true;
	}
	return true;
};

JoinPlate.prototype.addListeners = function (visual, canvas, node){
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
		canvas.plate.updateActiveVisual(visual, true);
		visual.glow = visual.vis_rect.glow();
	});
	node.mouseout(function(event){
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

JoinPlate.prototype.unSelect = function(){
	this.isparentvisual = false;
	if (this.select_glow)
		this.select_glow.remove();
};

JoinPlate.prototype.translateTo = function(newX, newY) {
	this.vis.translate(newX-this.x, newY-this.y);
	this.x = newX;
	this.y = newY;
	for (var i=0; i<this.i_wire_list.length; i++){
		this.i_wire_list[i].updatePosition();
	}
	for (i=0; i<this.o_wire_list.length; i++){
		this.o_wire_list[i].updatePosition();
	}
};

JoinPlate.prototype.remove = function(){
	if (this.o_wire_list.length==0){
		this.vis.remove();
		this.canvas.plate.removeVisualization(this);
		for (var i=0; i<this.i_wire_list.length; i++)
			this.i_wire_list[i].removeWire();
	}
};

JoinPlate.prototype.getBBox = function(){
	var dimension = {};
	dimension.x = this.x;
	dimension.y = this.y;
	dimension.width = this.width;
	dimension.height = this.height;
	return dimension;
};

JoinPlate.prototype.addVisual = function(visual){
	this.visual = visual;
};

JoinPlate.prototype.showAnnotation = function(){
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

JoinPlate.prototype.addOutputDataConnections = function(wire, data){
	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width;
	var i = this.o_anchr_list.length;		
		// Draw Column anchor		
//	var anchor = this.canvas.path("M"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+this.width-padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+this.width-padding/2-anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//				.attr({"fill":"red", "stroke":null});
	var anchor = this.canvas.circle((this.x+this.width-padding/2-anchor_width/2), (this.y+i*(anchor_width+padding)+padding+y_padding), anchor_width/2)
				.attr({"fill":"red", "stroke":null});
	this.o_anchr_list[this.o_anchr_list.length] = anchor;
	var anchor_text = this.canvas.text(0,0,wire.label);
	anchor_text.attr({"x":(this.x+this.width-padding/2-anchor_width-anchor_text.getBBox().width-5), "y": (this.y+i*(anchor_width+padding)+padding+y_padding+anchor_text.getBBox().height/4), "font-size":20, "font-weight":"bold"});
	this.addOutputAnchorListeners1(this, anchor, wire, data);
	this.vis.push(anchor);
	this.vis.push(anchor_text);
};

JoinPlate.prototype.addOutputAnchorListeners1 = function (vis, node, wire_in, data_in){
	var canvas = vis.canvas;
	var wire = canvas.plate.addWire(node, data_in, wire_in.label, wire_in.dataBase, wire_in.pos, vis);
	node.drag(function(dx, dy, x, y, event){ // move function
        wire.update(x, y);        
	}, function(x, y){ 
		// drag start function		
	}, function(){ 
		// drag end function
		var visual = canvas.plate.activeVisual;
		if (canvas.plate.snapWire(wire)){
			vis.o_visual_list[vis.o_visual_list.length] = visual;
			vis.o_wire_list[vis.o_wire_list.length] = wire;
			wire = canvas.plate.addWire(node, data_in, wire_in.label, wire_in.dataBase, wire_in.pos, vis);
		}
		else {
			wire.remove();
		}
	}
	);
};

JoinPlate.prototype.removeWire = function(wire){
	var i = Xplate.findArrayIndex(this.o_wire_list, wire, 0);
	this.o_wire_list.splice(i, 1);
};

// ***************** Input Data Code **********************************

JoinPlate.prototype.addIt = function (wire){
	var padding = this.anchr_padding, y_padding = this.anchr_y_padding, anchor_width = this.anchr_width;
	var i = this.i_wire_list.length;
	// Draw Column anchor		
//	var anchor = this.canvas.path("M"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+y_padding)+"L"+(this.x+padding/2)+" "+(this.y+i*(anchor_width+padding)+padding+(anchor_width/2)+y_padding)+"L"+(this.x+padding/2+anchor_width)+" "+(this.y+i*(anchor_width+padding)+padding+anchor_width+y_padding)+"z")
//				.attr({"fill":"red", "stroke":null});
	var anchor = this.canvas.circle((this.x+padding/2+anchor_width/2), (this.y+i*(anchor_width+padding)+padding+y_padding), anchor_width/2)
				.attr({"fill":"red", "stroke":null});
	this.i_anchr_list[this.i_anchr_list.length] = anchor;
	wire.addDest(anchor, this);
	this.i_wire_list[this.i_wire_list.length] = wire;
	this.addInputAnchorListeners(this, anchor, wire.source.visual);
	this.vis.push(anchor);
	
	var temp = new Array(); var index = new Array();
	for(var j=0; j<wire.data[1].length; j++){
		index[j] = wire.data[0][j];
		temp[j] = wire.data[1][j];
	}
	
	var newData = new Array();
	newData = [index, temp];
	var isnew = Xplate.findArrayIndex(this.db_list, wire.dataBase, 0);
	if (isnew == -1){
		this.db_list[this.db_list.length] = wire.dataBase;
		var temp_array = new Array();
		this.o_data_list[this.o_data_list.length] = temp_array;
		this.o_data_list[this.o_data_list.length-1][0] = newData;
		this.label_list[this.label_list.length] = new Array();
		this.label_list[this.label_list.length-1][0] = wire.label;
	}
	else{
		var list = this.o_data_list[isnew];
		list[list.length] = newData;
		var label_list = this.label_list[isnew];
		label_list[label_list.length] = wire.label;
	}

	
	
	this.addOutputDataConnections(wire, newData);
	
	this.addJoinComboBox();
	
	return true;
};

JoinPlate.prototype.addInputAnchorListeners = function (vis, node, parent){
	node.click(function(){
		if(parent)
			CanvasManager.animateView(vis.canvas, vis.parent_visual);
	});
};
