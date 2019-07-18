var objDefault = {
	'win' : $(window),
	'doc' : $('html, body')
}
var objInfoArry = [
	{name : 'obj1', y : 300},
	{name : 'obj2', y : -500},
	{name : 'obj3', y : 300},
	{name : 'obj4', y : -500},
	{name : 'obj5', y : 300},
	{name : 'obj6', y : 300},
	{name : 'obj7', y : 300},
	{name : 'obj8', y : -500},
	{name : 'obj9', x : 500},
	{name : 'obj10', x : -500},
	{name : 'obj11', x : -500},
	{name : 'obj12', y : -500},
	{name : 'imgSetWrap', cls : 'fixed'},
];
var movObj = {};
var fixedWrap = {};
var startObjPos = {};
var endObjPos = {};

function init() {
	var start = 0;
	var end = 0;
	objInfoArry.forEach(function(idx){
		var $this = $('.' + idx.name);
		start = $this.offset().top;
		end = start + $this.height();
		movObj[idx.name] = $('.' + idx.name + ' .movObj');
		startObjPos[idx.name] = start;
		endObjPos[idx.name] = end; 
		if(idx.cls) {fixedWrap[idx.name] = $('.' + idx.name + ' .fixedWrap')}
	});
}
function scrollObj(idx, scroll, start) {
	var style = {};
	if(idx.cls) {
		(startObjPos[idx.name] < scroll && endObjPos[idx.name] > start) ? fixedWrap[idx.name].addClass(idx.cls) : fixedWrap[idx.name].removeClass(idx.cls);
		(endObjPos[idx.name] <= start) ? fixedWrap[idx.name].addClass('end') : fixedWrap[idx.name].removeClass('end')
	} else {
		if(startObjPos[idx.name] < start && endObjPos[idx.name] > scroll) {
			var posY = ((start - startObjPos[idx.name]) / (endObjPos[idx.name] - startObjPos[idx.name]) * idx.y) / 2;
			var posX = ((start - startObjPos[idx.name]) / (endObjPos[idx.name] - startObjPos[idx.name]) * idx.x) / 2;
			style['top'] = posY + 'px';
			style['left'] = posX + 'px';
		} else if(startObjPos[idx.name] >= start) {
			style['top'] = 0;
			style['left'] = 0;
		}
	}
	movObj[idx.name].css(style);
}
function scrollClsObj(start) {
	var obj = $('.scrollClsObj');
	var startPos =  start - 300;
	if(obj.length) {
		obj.each(function(){
			var $this = $(this);
			var thisPos = $this.offset().top;
			if(startPos > thisPos) {
				$this.addClass('active');
			}
		});
	}
}
objDefault.win.on({
	'load' : function() {
		init();
	},
	'scroll': function() {
		var scrollTop = objDefault.doc.scrollTop();
		var startPos = scrollTop + objDefault.win.height();
		scrollClsObj(startPos);
		objInfoArry.forEach(function(idx){
			scrollObj(idx, scrollTop, startPos);
		});
		
	}
});