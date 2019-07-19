var objDefault = {
	'win' : $(window),
	'doc' : $('html'),
	'body' : $('body'),
	'cont' : $('#container')
}
function pageLoad(page){
	$.ajax({
		url : page + '.html',
		dataType: 'html',
		success : function(data){
			// var hashtag = location.hash.substring(1, location.hash.length).replace(/ /gi, '%20');
			// history.replaceState({}, null, location.href.replace(location.hash,hashtag));
			objDefault.cont.html(data);
			var imgLeng = 0;
			var leng = objDefault.cont.find('img').length;
			objDefault.cont.find('img').on('load', function(){
				imgLeng++;
				if(imgLeng == leng) {
					objSet();
				}
			});
		}
	});
}

function listOpen(_this) {
	var $this = $(_this);
	$this.toggleClass('open').next().slideToggle(300);
}

function layerShow(_this) {
	var $this = $(_this);
	var img = $this.data('img');
	var src = 'resource/images/'
	var layerTemplate = '';
	layerTemplate += '<div class="layerPop">';
	layerTemplate += '<div class="layerContents">';
	layerTemplate += '<img src='+src+img+'>';
	layerTemplate += '</div>';
	// layerTemplate += '<button type="button" class="prevImg" onclick="prevImg();"><span>prev</span></button>';
	// layerTemplate += '<button type="button" class="nextImg" onclick="nextImg();"><span>next</span></button>';
	layerTemplate += '<button type="button" class="layerClose" onclick="layerClose();"><span>close</span></button>';
	layerTemplate += '</div>';
	objDefault.body.append(layerTemplate);
}

function layerClose() {
	var layer = $('.layerPop');
	layer.remove();
}

var movObj = {};
var fixedWrap = {};
var startObjPos = {};
var endObjPos = {};

function objSet() {
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
		movObj[idx.name].css(style);
	}
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
function scrollPos() {
	var scrollTop = objDefault.doc.scrollTop();
	var startPos = scrollTop + objDefault.win.height();
	scrollClsObj(startPos);
	objInfoArry.forEach(function(idx){
		scrollObj(idx, scrollTop, startPos);
	});
}
objDefault.win.on({
	'scroll': function() {
		scrollPos();
	}
});