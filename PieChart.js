PieChart =  function(container){
	this.canvas = container;
	
//	****** Initialization *************************	
	this.vis_name = 4; 
	this.title = "Pie Chart";
	this.vis = this.canvas.set(); // set for visualization
	this.plot = this.canvas.set();
	this.wire = new Array();
	this.colors = ["blue", "green", "cyan", "brown", "yellow", "red", "black"];
};

PieChart.prototype.visualize = function(visual, x, y, width, height){
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

PieChart.prototype.addListeners = function (visual, canvas, node){
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

PieChart.prototype.highlightSelectData = function(rect){
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

PieChart.prototype.selectData = function(rect){
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

PieChart.prototype.highlightData = function(ishighlight, data){
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

PieChart.prototype.addIt = function (wire){
	if (this.wire.length < 2){
		this.wire[this.wire.length] = wire;
		this.addData();
		return true;
	}
	return false;
};

PieChart.prototype.addData = function (){	
	if (this.wire.length < 2)
		return;

//	this.uniqueData = this.wire[0].data[1];
//	this.data_count = this.wire[1].data[1];
	this.uniqueData = new Array();
	this.data_count = new Array();
	for (var i=0; i<this.wire[0].data[1].length; i++){
		this.uniqueData[this.uniqueData.length] = this.wire[0].data[1][i];
		this.data_count[this.data_count.length] = this.wire[1].data[1][i];
//		if(Xplate.findArrayIndex(this.uniqueData, this.wire[0].data[1][i], 0) != -1){
//			this.data_count[Xplate.findArrayIndex(this.uniqueData, this.wire[0].data[1][i], 0)]++;
//		}
//		else{
//			this.uniqueData[this.uniqueData.length] = this.wire[0].data[1][i];
//			this.data_count[this.data_count.length] = 1;
//		}
	}
	
//	var pie = this.canvas.piechart(this.x+this.width/2, this.y+this.height/2, this.width/3, this.data_count, { legend: this.uniqueData, legendpos: "east"});
	var pie = this.canvas.piechart(this.x+this.width/2-130, this.y+this.height/2, 50+this.width/4, this.data_count, { legend: this.uniqueData, legendpos: "east"});

	var canvas = this.canvas;
	 pie.hover(function () {
         this.sector.stop();
         this.sector.scale(1.1, 1.1, this.cx, this.cy);

         if (this.label) {
             this.label[0].stop();
             this.label[0].attr({ r: 7.5 });
             this.label[1].attr({ "font-weight": 800 });
         }
         
         (this.blob = this.blob || canvas.blob(this.mx, this.my, this.value+"")).show(); 
         
     }, function () {
         this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

         if (this.label) {
             this.label[0].animate({ r: 5 }, 500, "bounce");
             this.label[1].attr({ "font-weight": 400 });
         }
         
         this.blob && this.blob.hide();
     });	
	this.plot.push(pie);
	this.vis.push(this.plot);
	
};

PieChart.prototype.update = function(){
	if (this.wire.length > 1){
		this.plot.remove();
		this.plot = this.canvas.set();
		this.addData();
		return true;
	}
	return false;
};

PieChart.prototype.removeData = function (wire){
	if (this.wire.length > 1){
		this.plot.remove();
		this.plot = this.canvas.set();		
	}
	var index = Xplate.findArrayIndex(this.wire, wire, 0);
	this.wire.splice(index, 1);
	
//	this.wire = new Array();
	this.addData();
};