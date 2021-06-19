ComboBox = function(canvas, x, y, label, text_array, value_array, parent){
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = 200;
	this.height = 20;
	this.font_size = 20;
	this.arrow_width = 10;
	this.label = label;
	this.text_array = text_array;
	this.value_array = value_array;
	this.parent = parent;
	this.options = this.canvas.set();
	this.options_visible = false;
	
	this.visualize();
};

ComboBox.prototype.visualize = function(){
	this.vis = this.canvas.set();
	var label = this.canvas.text(0,0,this.label);
	label.attr({"x":this.x-label.getBBox().width, "y":this.y+label.getBBox().height, "font-size":this.font_size, "font-weight":"bold"});
	this.vis.push(label);
	this.area = this.canvas.rect(this.x, this.y, this.width, this.height).attr({"fill":"white"}).toFront();
	this.vis.push(this.area);
	this.vis.push(this.canvas.path("M"+(this.x+this.width-10-this.arrow_width)+" "+(this.y)+"L"+(this.x+this.width-10-this.arrow_width)+" "+(this.y+this.height)));
	this.arrow = this.canvas.path("M"+(this.x+this.width-5-this.arrow_width)+" "+(this.y+5)+"L"+(this.x+this.width-5)+" "+(this.y+5)+"L"+(this.x+this.width-(this.arrow_width/2)-5)+" "+(this.y+5+this.arrow_width)+"z");
	this.arrow.attr({"fill":"black"}).toFront();
	this.vis.push(this.arrow);
	var vis = this;
	this.arrow.click(function(){vis.showData();});
	this.text = this.canvas.text(0, 0, "select value ...");
	this.text.attr({"x":this.text.getBBox().width+this.x+5, "y":this.text.getBBox().height+this.y, "font-size":this.font_size});
	this.vis.push(this.text);
};

ComboBox.prototype.showData = function(){
//	if (this.options_visible){
//		this.options.remove();
//		this.options.clear();
//		this.options_visible = false;
//	}
	
	this.x = this.parent.x+this.parent.width/2-75; 
	this.y = this.parent.y+this.parent.anchr_y_padding/2;
	
	if (this.text_array){
		this.options_visible = true;
		for (var i=0; i<=this.text_array.length; i++){			
			var option;
			var value;		
			if (i==this.text_array.length){
				option = "None";
				value = -1;
			}
			else{
				option = this.text_array[i];
				value = this.value_array[i];
			}
			var area = this.canvas.rect(this.x, this.y+(i+1)*this.height, this.width-10-this.arrow_width, this.height).attr({"fill":"white"}).toFront();
			this.options.push(area);
			var text = this.canvas.text(0, 0, option).toFront();
			text.attr({"x":text.getBBox().width+this.x, "y":text.getBBox().height+this.y+(i+1)*this.height, "font-size":this.font_size});
			this.options.push(text);
			if (this.parent){
				this.addListeners(area, option, value, this.parent);
				this.addListeners(text, option, value, this.parent);
			}
		}
	}
	this.vis.push(this.options);
};

ComboBox.prototype.addListeners = function(node, label, value, parent){
	var options = this.options; 
	var text = this.text;
	node.click(function(){
		if(parent.comboCallBack(value)){
			text.attr({"text":label});
		}
		options.remove();
		options.clear();				
	});
};

ComboBox.prototype.updateData = function(){
	
};