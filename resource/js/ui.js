var objDefault = {
	'win': $(window),
	'doc': $('html'),
	'body': $('body'),
	'cont': $('#container')
}
function pageLoad(page) {
	$.ajax({
		url: page + '.html',
		dataType: 'html',
		error: function(r,s,e){
			if(s == 'error') {
				console.log(s);
				return false;
			}
		},
		success: function(data){
			objDefault.doc.removeClass('ready').animate({scrollTop : 0}, 300, function(){
				$(this).addClass('ready');
			});
			if(page.indexOf('brands/') >= 0) {
				objDefault.body.addClass('brands');
				var brandName = page.split('/')[1];
				$('.brandMenu li').each(function(){
					var $this = $(this);
					if($this.data('brand') == brandName) $this.addClass('active').siblings().removeClass('active');
				})
			} else {
				objDefault.body.removeClass('brands');
			}

			objDefault.cont.html(data).find('img').on('load', function(){ objSet(); });
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
function roll(obj, dir) {
	var wrap = $('.'+ obj);
	var imgWrap = wrap.find('.movWrap');
	var img = imgWrap.find('img');
	var resetNum = 0;
	var pos = 0;
	var timer;
	var style = {};

	imgWrap.prepend(imgWrap.html());

	img.on('load', function(){
		clearInterval(timer);

		(dir === 'left' || dir === 'right') ? resetNum = this.width : resetNum = this.height;

		timer = setInterval(function(){
			pos--;
			if('-' + resetNum == pos) {
				style[dir] = 0;
				pos = 0;
			} else {
				style[dir] = pos + 'px';
			}

			imgWrap.css(style);

		},30);
	});
}

var movObj = {};
var fixedWrap = {};
var startObjPos = {};
var endObjPos = {};
function objSet() {
	objInfoArry.forEach(function(obj){
		var $this = $('.' + obj.name);
		if($this.length) {
			var start = $this.offset().top;
			var end = start + $this.height();
			movObj[obj.name] = $('.' + obj.name + ' .movObj');
			startObjPos[obj.name] = start;
			endObjPos[obj.name] = end; 
			if(obj.startCls) {fixedWrap[obj.name] = $('.' + obj.name + ' .fixedWrap')}
		}
	});
}
function scrollObj(obj, scrollTop, screenEnd) {
	var $this = $('.' + obj.name);
	var style = {};
	if($this.length) {
		if(obj.startCls) {
			if(obj.endCls) {
				(startObjPos[obj.name] < scrollTop && endObjPos[obj.name] > screenEnd) ? fixedWrap[obj.name].addClass(obj.startCls) : fixedWrap[obj.name].removeClass(obj.startCls);
				(endObjPos[obj.name] <= screenEnd) ? fixedWrap[obj.name].addClass(obj.endCls) : fixedWrap[obj.name].removeClass(obj.endCls);
			} else {
				(startObjPos[obj.name] < scrollTop) ? fixedWrap[obj.name].addClass(obj.startCls) : fixedWrap[obj.name].removeClass(obj.startCls);
			}
		} else {
			if(startObjPos[obj.name] < screenEnd && endObjPos[obj.name] > scrollTop) {
				if(obj.topStart == true) {
					var posY = ((scrollTop - startObjPos[obj.name]) / (endObjPos[obj.name] - startObjPos[obj.name]) * obj.y);
					var posX = ((scrollTop - startObjPos[obj.name]) / (endObjPos[obj.name] - startObjPos[obj.name]) * obj.x);
				} else {
					var posY = ((screenEnd - startObjPos[obj.name]) / (endObjPos[obj.name] - startObjPos[obj.name]) * obj.y) / 2;
					var posX = ((screenEnd - startObjPos[obj.name]) / (endObjPos[obj.name] - startObjPos[obj.name]) * obj.x) / 2;
				}
				style['top'] = posY + 'px';
				style['left'] = posX + 'px';
			} else if(startObjPos[obj.name] >= screenEnd) {
				style['top'] = 0;
				style['left'] = 0;
			}
			movObj[obj.name].css(style);
		}
	}
}
function scrollClsObj(screenEnd) {
	var obj = $('.scrollClsObj');
	var startPos =  screenEnd - 300;
	if(obj.length) {
		obj.each(function(){
			var $this = $(this);
			var thisPos = $this.offset().top;
			if(startPos > thisPos) {
				$this.addClass('active');
			} else {
				$this.removeClass('active');
			}
		});
	}
}
function scrollPos() {
	var scrollTop = objDefault.doc.scrollTop();
	var screenEnd = scrollTop + objDefault.win.height();
	scrollClsObj(screenEnd);
	
	// if(nowScroll < scrollTop) {
	// 	$('html, body').on('scroll', function(){
	// 		event.preventDefault();
	// 	});
	// 	var sum = nowScroll + objDefault.win.height();
		
	// 	$('html, body').animate({scrollTop : sum},300, function(){
	// 		if(sum !=  objDefault.win.height()) {
	// 			// console.log(scrollTop , objDefault.win.height());
	// 			// nowScroll = scrollTop;
	// 		}
	// 	});
	// } else {
	// 	console.log(2);
	// 	nowScroll = scrollTop;
	// }
	objInfoArry.forEach(function(obj){
		scrollObj(obj, scrollTop, screenEnd);
	});
}

var nowScroll = 0;
objDefault.win.on({
	'scroll': function() {
		scrollPos();
	}
});
