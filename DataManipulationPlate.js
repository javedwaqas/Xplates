DataManipulationPlate = function (container, option, x, y, w, h, b){
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
	this.i_anchr_list = new Array(); // input anchor list
	this.i_wire_list = new Array(); // input wire list
	this.o_wire_list = new Array(); // output wire list
	this.o_anchr_list = new Array(); // output anchor list
	this.o_data_list = new Array();
	this.o_visual_list = new Array(); // output wire list
//  ************************************************
	
	this.visualize(15, 15, this.width, this.height);
};

DataManipulationPlate.prototype.visualize = function(x, y, width, height){

	if (this.option == 0)
		this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "violet", "fill-opacity":1, "stroke":"black"});
	if (this.option == 1)
		this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "tomato", "fill-opacity":1, "stroke":"black"});
	if (this.option == 2)
		this.vis_rect = this.canvas.rect(this.x, this.y, width, height, width*0.1).attr({"fill": "RosyBrown", "fill-opacity":1, "stroke":"black"});
	this.vis.push(this.vis_rect);
	if (this.option == 0)
		this.title = this.canvas.text(0,0,"Data Intersection");
	if (this.option == 1)
		this.title = this.canvas.text(0,0,"Data Union");
	if (this.option == 2)
		this.title = this.canvas.text(0,0,"Data Sort");
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

DataManipulationPlate.prototype.addSortComboBox = function(){
	this.sortCol = 0;
	this.ascendingOrder = true;
	if (this.i_wire_list.length>1){
		this.comboBox.vis.remove();
		this.comboBox1.vis.remove();
	}
	
	var text = new Array();
	var value = new Array();
	for (var i=0; i<this.i_wire_list.length; i++){
		text[i] = this.i_wire_list[i].label;
		value[i] = i;
	}
	this.comboBox = new ComboBox(this.canvas, this.x+this.width/2-75, this.y+this.anchr_y_padding/2, "Sort: --", text, value, this);
	this.vis.push(this.comboBox.vis);
	this.comboBox1 = new ComboBox(this.canvas, this.x+this.width/2-75, this.y+22+this.anchr_y_padding/2, "Order: ", ["Ascending", "Descending"], [this.i_wire_list.length, this.i_wire_list.length+1], this);
	this.vis.push(this.comboBox1.vis);
};

DataManipulationPlate.prototype.comboCallBack = function(i){
	
	if (i>=0){
		if (i>=this.i_wire_list.length){
			if (i==this.i_wire_list.length)
				this.ascendingOrder = true;
			else
				this.ascendingOrder = false;
			i = this.sortCol;
		}
		else
			this.sortCol = i;
		var collection = this.o_data_list[i][1];
		for(var j = 1; j < collection.length; j++) {
			var key = this.o_data_list[i][1][j];
			var key_Array = new Array();
			for (var r=0; r<this.o_data_list.length; r++){
				key_Array[key_Array.length] = this.o_data_list[r][0][j];
				key_Array[key_Array.length] = this.o_data_list[r][1][j];
			}
			var k = j - 1;
			
			var condition = false;
			if (this.ascendingOrder)
				condition = (this.o_data_list[i][1][k] > key) ? true:false;
			else
				condition = (this.o_data_list[i][1][k] < key) ? true:false;
//			while(k >= 0 && this.o_data_list[i][1][k] > key) { //ascending order
//			while(k >= 0 && this.o_data_list[i][1][k] < key) { //descending order
			while(k >= 0 && condition) {
//				collection[k+1] = collection[k];
				for(var m=0; m<this.o_data_list.length; m++){
//					var temp1 = this.data[m];
					this.o_data_list[m][0][k+1] = this.o_data_list[m][0][k];
					this.o_data_list[m][1][k+1] = this.o_data_list[m][1][k];
				}
				
				k = k - 1;
				if (this.ascendingOrder)
					condition = (this.o_data_list[i][1][k] > key) ? true:false;
				else
					condition = (this.o_data_list[i][1][k] < key) ? true:false;
			}
//			collection[k+1] = key;
			for(var n=0; n<key_Array.length; n = n+2){
				var d = n/2;
				this.o_data_list[d][0][k+1] = key_Array[n];
				this.o_data_list[d][1][k+1] = key_Array[n+1];
			}
		}
		for (r=0; r<this.o_visual_list.length; r++){
			this.o_visual_list[r].update();
		}
		return true;
	}
	else if (i==-1){
		i=0;
		collection = this.o_data_list[i][0];
		for(j = 1; j < collection.length; j++) {
//			var key = collection[j];
			key = this.o_data_list[i][0][j];
			key_Array = new Array();
			for (r=0; r<this.o_data_list.length; r++){
				key_Array[key_Array.length] = this.o_data_list[r][0][j];
				key_Array[key_Array.length] = this.o_data_list[r][1][j];
			}
			k = j - 1;
		 
			while(k >= 0 && this.o_data_list[i][0][k] > key) {
//				collection[k+1] = collection[k];
				for(m=0; m<this.o_data_list.length; m++){
//					var temp1 = this.data[m];
					this.o_data_list[m][0][k+1] = this.o_data_list[m][0][k];
					this.o_data_list[m][1][k+1] = this.o_data_list[m][1][k];
				}
				
				k = k - 1;
			}
//			collection[k+1] = key;
			for(n=0; n<key_Array.length; n = n+2){
				d = n/2;
				this.o_data_list[d][0][k+1] = key_Array[n];
				this.o_data_list[d][1][k+1] = key_Array[n+1];
			}
		}
		for (r=0; r<this.o_visual_list.length; r++){
			this.o_visual_list[r].update();
		}
		return true;		
	}
//	this.vis_rect.attr({"fill":"yellow"});
	return false;
};

DataManipulationPlate.prototype.addListeners = function (visual, canvas, node){
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

DataManipulationPlate.prototype.unSelect = function(){
	this.isparentvisual = false;
	if (this.select_glow)
		this.select_glow.remove();
};

DataManipulationPlate.prototype.translateTo = function(newX, newY) {
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

DataManipulationPlate.prototype.remove = function(){
	if (this.o_wire_list.length==0){
		this.vis.remove();
		this.canvas.plate.removeVisualization(this);
		for (var i=0; i<this.i_wire_list.length; i++)
			this.i_wire_list[i].removeWire();
	}
};

DataManipulationPlate.prototype.getBBox = function(){
	var dimension = {};
	dimension.x = this.x;
	dimension.y = this.y;
	dimension.width = this.width;
	dimension.height = this.height;
	return dimension;
};

DataManipulationPlate.prototype.addVisual = function(visual){
	this.visual = visual;
};

DataManipulationPlate.prototype.showAnnotation = function(){
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

// *******************************************************************

DataManipulationPlate.prototype.intersection = function(){
	if (this.o_data_list.length<=1)
		return;
	
	var data = this.o_data_list[this.o_data_list.length-1];
	for (var i=0; i<data[0].length; i++){
		var value = data[0][i];
		for (var j=0; j<this.o_data_list.length-1; j++){
			if (Xplate.findArrayIndex(this.o_data_list[j][0], value, 0) == -1){
				for (var k=0; k<this.o_data_list.length; k++){
					var t = Xplate.findArrayIndex(this.o_data_list[k][0], value, 0);
					if (t != -1){
						this.o_data_list[k][0].splice(t,1);
						this.o_data_list[k][1].splice(t,1);			
						if (k==this.o_data_list.length-1)
							i--;
					}
				}
				break;
			}
		}
	}

	data = this.o_data_list[0];
	for (i=0; i<data[0].length; i++){
		value = data[0][i];
		for (j=1; j<this.o_data_list.length; j++){
			if (Xplate.findArrayIndex(this.o_data_list[j][0], value, 0) == -1){
				for (k=0; k<this.o_data_list.length; k++){
					t = Xplate.findArrayIndex(this.o_data_list[k][0], value, 0);
					if (t != -1){
						this.o_data_list[k][0].splice(t,1);
						this.o_data_list[k][1].splice(t,1);			
						if (k==0)
							i--;
					}
				}
				break;
			}
		}
	}
	
//	************************* Sort ********************************
	for (i=0; i<this.o_data_list.length; i++){
	var collection = this.o_data_list[i];
		for(j = 1; j < collection[0].length; j++) {

			var key = collection[0][j];
			collection[0].splice(j,1);
			var val = collection[1][j];
			collection[1].splice(j,1);
			k = j - 1;
		 
			while(k >= 0 && collection[0][k] > key) {
	//			collection[k+1] = collection[k];				
				k = k - 1;
			}
			collection[0].splice(k+1,0,key);
			collection[1].splice(k+1,0,val);
	//		collection[k+1] = key;
			
		}
	}
	
//	***************************************************************
	
	for (var r=0;r<this.o_visual_list.length; r++){
		this.o_visual_list[r].update();
	}
};

DataManipulationPlate.prototype.union = function(){
	if (this.o_data_list.length<=1)
		return;
	
	var data = this.o_data_list[this.o_data_list.length-1];
	for (var i=0; i<data[0].length; i++){
		var value = data[0][i];
		for (var j=0; j<1; j++){
			if (Xplate.findArrayIndex(this.o_data_list[j][0], value, 0) == -1){
				for (var k=0; k<this.o_data_list.length-1; k++){
					var t = Xplate.findArrayIndex(this.o_data_list[k][0], value, 0);
					if (t == -1){
						var dataBase = this.i_wire_list[k].dataBase;
						var val = dataBase.getValue(value,this.i_wire_list[k].pos);
						this.o_data_list[k][0][this.o_data_list[k][0].length] = value;
						this.o_data_list[k][1][this.o_data_list[k][1].length] = val;			
					}
				}
				break;
			}
		}
	}

	data = this.o_data_list[0];
	for (i=0; i<data[0].length; i++){
		value = data[0][i];
		for (j=1; j<this.o_data_list.length; j++){
			if (Xplate.findArrayIndex(this.o_data_list[j][0], value, 0) == -1){
				for (k=this.o_data_list.length-1; k<this.o_data_list.length; k++){
					t = Xplate.findArrayIndex(this.o_data_list[k][0], value, 0);
					if (t == -1){
						dataBase = this.i_wire_list[k].dataBase;
						val = dataBase.getValue(value,this.i_wire_list[k].pos);
						this.o_data_list[k][0][this.o_data_list[k][0].length] = value;
						this.o_data_list[k][1][this.o_data_list[k][1].length] = val;			
					}
				}
				break;
			}
		}
	}
	
//	************************* Sort ********************************
	for (i=0; i<this.o_data_list.length; i++){
	var collection = this.o_data_list[i];
		for(j = 1; j < collection[0].length; j++) {

			var key = collection[0][j];
			collection[0].splice(j,1);
			val = collection[1][j];
			collection[1].splice(j,1);
			k = j - 1;
		 
			while(k >= 0 && collection[0][k] > key) {
	//			collection[k+1] = collection[k];				
				k = k - 1;
			}
			collection[0].splice(k+1,0,key);
			collection[1].splice(k+1,0,val);
	//		collection[k+1] = key;
			
		}
	}
	
//	***************************************************************
	
	for (var r=0;r<this.o_visual_list.length; r++){
		this.o_visual_list[r].update();
	}
};

//***************** Output Data Code **********************************

DataManipulationPlate.prototype.addOutputDataConnections = function(wire, data){
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

DataManipulationPlate.prototype.addOutputAnchorListeners1 = function (vis, node, wire_in, data_in){
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
			vis.o_wire_list[vis.o_wire_list.length] = wire;
			vis.o_visual_list[vis.o_visual_list.length] = visual;
			wire = canvas.plate.addWire(node, data_in, wire_in.label, wire_in.dataBase, wire_in.pos, vis);
		}
		else {
			wire.remove();
		}
	}
	);
};


DataManipulationPlate.prototype.removeWire = function(wire){
	var i = Xplate.findArrayIndex(this.o_wire_list, wire, 0);
	this.o_wire_list.splice(i, 1);
};

// ***************** Input Data Code **********************************

DataManipulationPlate.prototype.addIt = function (wire){
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
	this.o_data_list[this.o_data_list.length] = newData;

	this.addOutputDataConnections(wire, newData);
	
	if (this.option == 0)
		this.intersection();
	if (this.option == 1)
		this.union();
	
	this.addSortComboBox();
	
	return true;
};

DataManipulationPlate.prototype.addInputAnchorListeners = function (vis, node, parent){
	node.click(function(){
		if(parent)
			CanvasManager.animateView(vis.canvas, vis.parent_visual);
	});
};
