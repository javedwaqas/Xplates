CanvasManager = function(){
//	CanvasManager.visualLists = new Array();
//	CanvasManager.availableSpaceList = new Array();
//	this.visual_width = 900;
//	this.visual_height = 900;
//	this.x_padding = 100;
//	this.y_padding = 100;
	
};
CanvasManager.visualLists = new Array();
CanvasManager.availableSpaceList = new Array();
CanvasManager.visual_width = 900;
CanvasManager.dp_width= 300;
CanvasManager.dp_height= 300;
CanvasManager.visual_height = 900;
CanvasManager.x_padding = 100;
CanvasManager.y_padding = 100;

CanvasManager.prototype.addVisual = function(visual){
	if (visual.branch < CanvasManager.visualLists.length){
		var pos = this.findBranchPos(visual, visual.branch);
		CanvasManager.visualLists[visual.branch].splice(pos, 0, visual);
		for (var kk=pos+1; kk<CanvasManager.visualLists[visual.branch].length; kk++){
			CanvasManager.visualLists[visual.branch][kk].translateTo(CanvasManager.visualLists[visual.branch][kk-1].x+CanvasManager.visualLists[visual.branch][kk-1].width+CanvasManager.x_padding, CanvasManager.visualLists[visual.branch][kk-1].y);
		}
	}
	else{
		CanvasManager.visualLists[CanvasManager.visualLists.length] = new Array();
		CanvasManager.visualLists[CanvasManager.visualLists.length-1][0] = visual;
	}
};

CanvasManager.prototype.removeVisual = function(visual){
	var init_branch = visual.branch;
	var init_pos = Xplate.findArrayIndex(CanvasManager.visualLists[init_branch], visual, 0);
	var init_list = CanvasManager.visualLists[init_branch];
	for (var i=init_pos+1; i<init_list.length; i++){
		init_list[i].translateTo(init_list[i].x-visual.width-CanvasManager.x_padding, init_list[i].y);
	}
	init_list.splice(init_pos, 1);
	
	if (init_list.length == 0){
		CanvasManager.visualLists.splice(init_branch, 1);
		for (i=init_branch; i<CanvasManager.visualLists.length; i++){
			temp = CanvasManager.visualLists[i];
			for (var j=0; j<temp.length; j++){
				temp[j].translateTo(temp[j].x, temp[j].y-CanvasManager.visual_height-CanvasManager.y_padding);
				temp[j].branch = temp[j].branch-1;
			}
		}
	}
};

CanvasManager.prototype.findBranchPos = function(visual, branch){
	for (var k=0; k<CanvasManager.visualLists[branch].length; k++){
		if (visual.x<=CanvasManager.visualLists[branch][k].x){
			break;
		}			
	}
	return k;
};

CanvasManager.prototype.updatePosition = function(visual){
	if(visual.glow)
		visual.glow.remove();
	var init_branch = visual.branch;
	var init_pos = Xplate.findArrayIndex(CanvasManager.visualLists[init_branch], visual, 0);
	var init_list = CanvasManager.visualLists[init_branch];
	for (var i=init_pos+1; i<init_list.length; i++){
		init_list[i].translateTo(init_list[i].x-visual.width-CanvasManager.x_padding, init_list[i].y);
	}
	init_list.splice(init_pos, 1);	
	
	var new_branch = Math.round((visual.y-CanvasManager.y_padding)/(CanvasManager.visual_height+CanvasManager.y_padding));
	var new_pos;
	if (new_branch < 0){
		new_branch = 0;
		CanvasManager.visualLists.splice(new_branch, 0, new Array());
		CanvasManager.visualLists[new_branch][0] = visual;
		visual.translateTo(CanvasManager.x_padding, CanvasManager.y_padding);
		visual.branch = new_branch;
		for (i=1; i<CanvasManager.visualLists.length; i++){
			var temp = CanvasManager.visualLists[i];
			for (var j=0; j<temp.length; j++){
				temp[j].translateTo(temp[j].x, temp[j].y+CanvasManager.visual_height+CanvasManager.y_padding);
				temp[j].branch = temp[j].branch+1;
			}
		}
	}
	else if (new_branch >= CanvasManager.visualLists.length){
		new_branch = CanvasManager.visualLists.length;
		CanvasManager.visualLists[new_branch] = new Array();
		CanvasManager.visualLists[new_branch][0] = visual;
		visual.translateTo(CanvasManager.x_padding,  CanvasManager.y_padding+new_branch*(CanvasManager.visual_height+CanvasManager.y_padding));
		visual.branch = new_branch;
	}
	else {
		new_pos = this.findBranchPos(visual, new_branch);
		var new_list = CanvasManager.visualLists[new_branch];
		if (new_pos == 0){
			visual.translateTo(CanvasManager.x_padding, CanvasManager.y_padding+new_branch*(CanvasManager.visual_height+CanvasManager.y_padding));
		}
		else if (new_pos == new_list.length){
			visual.translateTo(new_list[new_pos-1].x+new_list[new_pos-1].width+CanvasManager.x_padding, new_list[new_pos-1].y);
		}
		else {
			visual.translateTo(new_list[new_pos].x, new_list[new_pos].y);
		}
		for (i=new_pos; i<new_list.length; i++){
			new_list[i].translateTo(new_list[i].x+visual.width+CanvasManager.x_padding, new_list[i].y);
		}
		new_list.splice(new_pos, 0, visual);
		visual.branch = new_branch;
	}
	
	if (init_list.length == 0){
		CanvasManager.visualLists.splice(init_branch, 1);
		for (i=init_branch; i<CanvasManager.visualLists.length; i++){
			temp = CanvasManager.visualLists[i];
			for (j=0; j<temp.length; j++){
				temp[j].translateTo(temp[j].x, temp[j].y-CanvasManager.visual_height-CanvasManager.y_padding);
				temp[j].branch = temp[j].branch-1;
			}
		}
	}
	

};

CanvasManager.prototype.getCanvasPosition = function(type, opt_parent){
	var pos = new Array();
	if(opt_parent && opt_parent!= null){
		pos[0] = opt_parent.x+opt_parent.width+CanvasManager.x_padding;
		pos[1] = opt_parent.y;
		pos[2] = opt_parent.branch;
	}
	else{
		pos[0] = CanvasManager.x_padding;
		pos[1] = CanvasManager.y_padding+CanvasManager.visualLists.length*(CanvasManager.visual_height+CanvasManager.y_padding);
		pos[2] = CanvasManager.visualLists.length;
	}
	return pos;
};



//************************ View Animation ************************

CanvasManager.startTime=0;
CanvasManager.endTime = 0;
CanvasManager.duration = 1000;
CanvasManager.canvas = null;
CanvasManager.node = null;
CanvasManager.scale = 1;

CanvasManager.animateView = function (canvas, node){
	
	if (canvas != null && node != null){
		CanvasManager.canvas = canvas;
		CanvasManager.node = node;
		CanvasManager.startTime = new Date().getTime();
		CanvasManager.endTime = CanvasManager.startTime + CanvasManager.duration;
		CanvasManager.scale = 1;
		CanvasManager.animate();
	}

};

CanvasManager.animate = function (){

	var canvas = CanvasManager.canvas;
	var node = CanvasManager.node;
	var animation_step = 100;
	var now = new Date().getTime();
	var elapsed = now - CanvasManager.startTime;
	var completeness = (now >= CanvasManager.endTime) ? 1 : (elapsed / CanvasManager.duration);
	canvas.setViewBox(
			canvas.x + ((node.x - canvas.x) * completeness),
			canvas.y + ((node.y - CanvasManager.y_padding - canvas.y) * completeness),
			canvas.w + (((canvas.w*CanvasManager.scale/canvas.viewScale)- canvas.w) * completeness),
			canvas.h + (((canvas.h*CanvasManager.scale/canvas.viewScale) - canvas.h) * completeness)
//			canvas.w + ((node.width - canvas.w) * completeness),
//			canvas.h + ((node.height - canvas.h) * completeness)
	);
	if (completeness != 1){
		setTimeout("CanvasManager.animate()", animation_step);
	}
	else{
		canvas.setViewBox(node.x, node.y-CanvasManager.y_padding, canvas.w*CanvasManager.scale/canvas.viewScale, canvas.h*CanvasManager.scale/canvas.viewScale, true);
		canvas.x = node.x; canvas.y = node.y-CanvasManager.y_padding; canvas.w = canvas.w*CanvasManager.scale/canvas.viewScale; canvas.h = canvas.h*CanvasManager.scale/canvas.viewScale; canvas.viewScale = 1*CanvasManager.scale;
	}
};

CanvasManager.showAll = function(canvas){
	CanvasManager.canvas = canvas;
	var xmax = Number.MIN_VALUE;
	var ymax = Number.MIN_VALUE;
	var xmin = Number.MAX_VALUE;
	var ymin = Number.MAX_VALUE;
//	for (var i=0; i<CanvasManager.availableSpaceList.length; i++){
	for (var i=0; i<CanvasManager.visualLists.length; i++){
		var list = CanvasManager.visualLists[i];
		for (var j=0; j<list.length; j++){
			var temp = list[j];
			if (xmax<temp.x+temp.width) xmax = temp.x+temp.width;
			if (ymax<temp.y+temp.height) ymax = temp.y+temp.height;
			if (xmin>temp.x) xmin = temp.x;
			if (ymin>temp.y) ymin = temp.y;
		}
	}
//	var max = Math.max(xmax+CanvasManager.dp_width, ymax);
//	var canmin = Math.min(canvas.w, canvas.h);
//	CanvasManager.scale = max*canvas.viewScale/canmin;
	
	if (Math.abs(xmax-canvas.w/canvas.viewScale)>Math.abs(ymax-canvas.h/canvas.viewScale)) 
		CanvasManager.scale = (xmax+CanvasManager.dp_width)*canvas.viewScale/canvas.w;
	else CanvasManager.scale = ymax*canvas.viewScale/canvas.h;
	
	
	CanvasManager.node = {x: xmin, y: ymin};
	CanvasManager.startTime = new Date().getTime();
	CanvasManager.endTime = CanvasManager.startTime + CanvasManager.duration;
	CanvasManager.animate();
	
};