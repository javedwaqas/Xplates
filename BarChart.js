BarChart =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 5; 
	this.title = "Bar Chart";
	this.vis = this.canvas.set(); // set for visualization
	this.plot = this.canvas.set();
	this.wire = new Array();
	this.colors = ["blue", "green", "cyan", "brown", "yellow", "red", "black"];
};

BarChart.prototype.visualize = function(visual, x, y, width, height){
	this.visual = visual;
	this.x = x; this.y = y;
	this.width = width;
	this.height = height;
	
	this.vis_rect = this.canvas.rect(this.x, this.y, width, height).attr({"fill": "white", "fill-opacity":0, "stroke":"black"});
	this.vis.push(this.vis_rect);
	
	// Add listeners
	this.addListeners(this, this.canvas, this.vis);
	this.vis.toFront();
};

BarChart.prototype.addListeners = function (visual, canvas, node){
////	var highlight;
//	node.drag(function(dx, dy, x, y, event){ // move function
//		this.highlight.attr({"width":(dx)*canvas.viewScale, "height":(dy)*canvas.viewScale});
//		if (visual.wire.length != 0)
//			visual.highlightSelectData(this.highlight);
//        event.stop();
//	}, function(x, y){ // drag start function
//		var point = canvas.plate.viewToLocal(x,y);
//		this.highlight = canvas.rect(point[0], point[1],0.0001,0.0001).attr({"fill":"white", "fill-opacity":0.2}).toFront();
//		this.highlight.attr({"stroke": "red", "stroke-dasharray":"-"});
//	}, function(){ // drag end function
//		if (visual.wire.length!=0){
//			visual.selectData(this.highlight);
//			visual.tagCloud.attr({"fill": "green"});
//		}
//		this.highlight.remove();
//	}
//	);	
//	
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

BarChart.prototype.highlightSelectData = function(rect){
//	// Local Method
//	var bounds = rect.getBBox();
//	for (var j=0; j<this.tagCloud.length; j++){
//		var point = this.tagCloud[j].getBBox();
//		if (point.x>=bounds.x && point.x+point.width<=bounds.x+bounds.width && point.y>=bounds.y && point.y+point.height<=bounds.y+bounds.height){
//			this.tagCloud[j].attr({"fill":"blue"});
//		}
//		else
//			this.tagCloud[j].attr({"fill":"green"});
//	}
};

BarChart.prototype.selectData = function(rect){
//	// o/p = [label1, data1, index2, data2, ...]
//	var bounds = rect.getBBox();
//	var selectData = new Array();
//	var subdata1 = new Array(); 
//	var temp1 = new Array(); var index1 = new Array();
//	
//	for (var j=0; j<this.tagCloud.length; j++){
//		var point = this.tagCloud[j].getBBox();
//		if (point.x>=bounds.x && point.x+point.width<=bounds.x+bounds.width && point.y>=bounds.y && point.y+point.height<=bounds.y+bounds.height){
//			temp1[temp1.length] = this.wire[0].data[1][j]; index1[index1.length] = this.wire[0].data[0][j];
//		}
//	}
//	subdata1 = [index1, temp1];
//	selectData = [this.wire[0].label, subdata1];
//	
//	if (temp1.length>0)
//		this.visual.addOutputAnchor(selectData);
};

BarChart.prototype.highlightData = function(ishighlight, data){
//	if (!ishighlight){
//		this.tagCloud.attr({"fill":"green"});
////		this.highlight.remove();
//		return;
//	}
//	var temp = data[1];
//	var text = temp[1];
//	this.vis_rect.attr({"fill":"yellow"});
//	for (var j=0; j<this.wire[0][1].length; j++){
//		for (var i=0; i<text.length; i++){
//			if (text[i] == this.wire[0][1][j]){
//				this.tagCloud[j].attr({"fill":"blue"});
//				break;
//			}
//		}
//	}
};

//************************* Wire Snapping Code **************************

BarChart.prototype.addIt = function (wire){
	if (this.wire.length < 2){
		this.wire[this.wire.length] = wire;
		this.addData();
		return true;
	}
	return false;
};

BarChart.prototype.addData = function (){	
	if (this.wire.length < 2)
		return;
	
	if (this.wire.length>2){
		this.plot.remove();
		this.plot = this.canvas.set();
	}
		
	
	// Add code here
	this.uniqueData = new Array();
	this.data_count = new Array();
	for (var j=0; j<this.wire.length; j=j+2){
		this.uniqueData[this.uniqueData.length] = new Array();
		this.data_count[this.data_count.length] = new Array();
		for (var i=0; i<Math.min(this.wire[j].data[1].length, 10); i++){
//			if(Xplate.findArrayIndex(this.uniqueData[j], this.wire[j].data[1][i], 0) != -1){
//				this.data_count[j][Xplate.findArrayIndex(this.uniqueData[j], this.wire[j].data[1][i], 0)]++;
//			}
//			else{
//				this.uniqueData[j][this.uniqueData[j].length] = this.wire[j].data[1][i];
//				this.data_count[j][this.data_count[j].length] = 1;
//			}
			this.uniqueData[j][this.uniqueData[j].length] = this.wire[j].data[1][i];
			this.data_count[j][this.data_count[j].length] = this.wire[j+1].data[1][i];
		}
	}
	
	var canvas = this.canvas;
	var visual = this;
	var fin = function () {
        this.flag = canvas.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    },
    fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    };
	
//    var bar =  this.canvas.barchart(this.x, this.y, this.width, this.height, [[55, 20, 13]]).hover(fin, fout);
    
	var bar = this.canvas.barchart(this.x, this.y, this.width, this.height, this.data_count).hover(fin, fout);//.label(this.uniqueData[0], true);
	
	this.plot.push(bar);
	
	for (i=0; i<bar.bars[0].length; i++){
		bar.bars[0][i].attr({"title":bar.bars[0][i].value});
		this.plot.push(this.canvas.text(bar.bars[0][i].x, this.y + this.height - 10, this.uniqueData[0][i]).toFront().attr({"font-size":20, "font-weight":"bold", "title":this.uniqueData[0][i]}));
	}
	
	this.vis.push(this.plot);
};

BarChart.prototype.update = function(){
	if (this.wire.length > 1){
		this.plot.remove();
		this.plot = this.canvas.set();
		this.addData();
		return true;
	}
	return false;
};

BarChart.prototype.removeData = function (wire){
	if (this.wire.length>1){
		this.plot.remove();
		this.plot = this.canvas.set();		
	}
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
//	this.wire = new Array();
	this.addData();
};