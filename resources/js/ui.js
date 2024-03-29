var agent = navigator.userAgent.toLocaleLowerCase();
var html = document.getElementsByTagName('html')[0];
var htmlClass = html.getAttribute('class');
var device, deviceVer, ver = null;
if(agent.indexOf('mobile') > -1) {
	ver = 'mobile';
	if(agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
		device = agent.substring(agent.indexOf('os') + 3);
		deviceVer = device.substring(0, device.indexOf('like mac os x'));
		osVer = 'ios' + deviceVer;
	}
	if(agent.indexOf('android') > -1) {
		device = agent.substring(agent.indexOf('android') + 8);
		deviceVer = device.substring(0, device.indexOf(';'));
		andVer = deviceVer.replace(/[.]/gi,'_');
		osVer = 'android' + andVer;

		if(agent.indexOf('samsung') > -1) osVer += ' samsung'; 
	}
} else {
	ver = 'pc';
	if(agent.indexOf('msie') > -1) { 
		device = agent.substring(agent.indexOf('msie') + 4);
		deviceVer = Math.floor(device.substring(0, device.indexOf(';')));
		osVer = 'ie' + deviceVer;
	} else {
		osVer = '';
	};
}
if(agent.indexOf('naver') > -1) osVer += ' naver';
if(ver !== null) {
	(htmlClass !== null) ? html.setAttribute('class', htmlClass + ' ' + ver + ' ' + osVer) : html.setAttribute('class', ver + ' ' + osVer); //html �대옒�� 遺���
}

var objDefault = {
	'win': $(window),
	'doc': $('html'),
	'body': $('body'),
	'cont': $('#container')
}

/* 페이지 로드 */
function pageLoad(page) {
	if(ver == 'mobile') page = page + '_m';
	$.ajax({
		url: page + '.html',
		dataType: 'html',
		error: function(r,s,e){
			if(s == 'error') {
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

/* 메뉴 */
function listOpen(_this) {
	var $this = $(_this);
	var list = $this.next('.list');
	var link = list.find('a');
	$this.toggleClass('open');
	list.stop().slideToggle(300);
	
	event.stopPropagation();
	list.on('click', function(){
		event.stopPropagation();
	});

	function listClose() {
		$this.removeClass('open');
		list.slideUp(300);
		objDefault.doc.off();
	}
	link.off().on('click', function(){
		listClose();
	});
	objDefault.doc.on('click', function(){
		listClose();
	});
}

/* 비디오 플레이 */
function videoPlay(_this) {
	var $this = $(_this);
	if(!$this.hasClass('play')) {
		$this.addClass('play').find('video')[0].play();
	}
}

/* 레이어 템플릿 함수 */
function layerOpen(layerCont) {
	var layerTemplate = '';
	layerTemplate += '<div class="layerPop">';
	layerTemplate += '<div class="layerContents">';
	layerTemplate += layerCont;
	layerTemplate += '</div>';
	layerTemplate += '<button type="button" class="layerClose" onclick="layerClose();"><span>close</span></button>';
	layerTemplate += '</div>';
	objDefault.body.append(layerTemplate);
}
function layerClose() {
	var layer = $('.layerPop');
	layer.remove();
}

/* 이미지 확대보기 함수 */
function layerShow(_this) {
	var $this = $(_this);
	var idx = $this.parent().index();
	var list = $this.closest('ul').find('button');
	var img = '';
	var slideTemplate = '';
	list.each(function(){
		var item = $(this);
		var itemSrc = item.data('img');
		var itemTxt = item.data('txt');
		img += '<li class="swiper-slide"><span class="itemWrap"><img src="'+itemSrc+'" alt=""> <strong class="txt">'+itemTxt+'</strong></span></li>';
	});
	slideTemplate += '<div class="showSwiper">';
	slideTemplate += '<ul class="swiper-wrapper">';
	slideTemplate += img;
	slideTemplate += '</ul>';
	slideTemplate += '<div class="control">';
	slideTemplate += '<button type="button" class="swiperPrev"><svg fill="#E8DFDF" stroke="none" width="15" height="27" viewBox="0 0 15 27"><g fill-rule="evenodd"><path fill-rule="nonzero" d="M.198 25.926l1.06 1.06 13.259-13.258L1.258.47.198 1.53l12.197 12.198z"></path></g></svg></button>';
	slideTemplate += '<button type="button" class="swiperNext"><svg fill="#E8DFDF" stroke="none" width="15" height="27" viewBox="0 0 15 27"><g fill-rule="evenodd"><path fill-rule="nonzero" d="M14.258 1.53L13.198.47-.061 13.728l13.259 13.258 1.06-1.06L2.061 13.728z"></path></g></svg></button>';
	slideTemplate += '</div>';
	slideTemplate += '</div>';
	layerOpen(slideTemplate);
	showSwiper(idx);
}

/* 슬라이드 오브젝트 */
var swiperObj = {};

/* 이미지 확대보기 슬라이드 */
function showSwiper(idx) {
	var el = 'showSwiper';
	var showSwiper = new Swiper('.' + el, {
		loop: true,
		initialSlide: idx,
		navigation: {
			prevEl: '.' + el +' .swiperPrev',
			nextEl: '.' + el +' .swiperNext',
		}
	});
	swiperObj[el] = showSwiper;
}

/* 연혁 슬라이드 */
function historySwiper() {
	var el = 'historySection';
	var historyList = new Swiper('.' + el + ' .historyList', {
		loop: true,
		navigation: {
			prevEl: '.' + el +' .btnPrev',
			nextEl: '.' + el +' .btnNext',
		},
		on: {
			slideChangeTransitionEnd : function() {
				var year = $('.swiper-slide-active').data('year')
				if(year) {
					$('.' + el).find('.year' + year).addClass('current').siblings().removeClass('current');
				}
				
			}
		}
	});
	swiperObj[el] = historyList;
}

/* 롤링 함수 */
function roll(obj, dir) {
	var wrap = $('.'+ obj);
	var relWrap = wrap.find('.relWrap');
	var imgWrap = wrap.find('.movWrap');
	var img = imgWrap.find('img');
	var resetNum = 0;
	var pos = 0;
	var timer;
	var style = {};

	imgWrap.prepend(imgWrap.html());

	img.on('load', function(){
		clearInterval(timer);

		if(dir === 'left' || dir === 'right') {
			resetNum = this.width;
			relWrap.css('margin-left', '-' + resetNum + 'px');
		} else {
			resetNum = this.height;
			relWrap.css('margin-top', '-' + resetNum + 'px');
		}

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

/* 스크롤 대응 오브젝트 */
var movObj = {};
var fixedWrap = {};
var startObjPos = {};
var endObjPos = {};

/* 스크롤 대응 오브젝트 세팅 */
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

/* 스크롤 시 실행 함수 */
function scrollObj(obj, scrollTop, screenEnd, winH) {
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
			var posY = 0;
			var posX = 0;
			var start;
			var endNum = endObjPos[obj.name] - startObjPos[obj.name];

			if(obj.topStart == true) {
				start = scrollTop;
			} else {
				start = screenEnd;
				endNum = endNum + winH;
			}
			var startNum = start - startObjPos[obj.name];
			var calNum = startNum / endNum;
			
			if(startObjPos[obj.name] < start && endObjPos[obj.name] > scrollTop) {
				posY = calNum * obj.y;
				posX = calNum * obj.x;
				style['top'] = posY + 'px';
				style['left'] = posX + 'px';
			} else if(startObjPos[obj.name] >= scrollTop) {
				style['top'] = 0;
				style['left'] = 0;
			}
			movObj[obj.name].css(style);
		}
	}
}

function scrollClsObj(screenEnd) {
	var obj = $('.scrollClsObj');
	var startPos = screenEnd - 300;
	if(obj.length) {
		obj.each(function(){
			var $this = $(this);
			var thisPos = $this.offset().top;
			(startPos > thisPos) ? $this.addClass('active') : $this.removeClass('active');
		});
	}
}

function scrollPos(scrollTop) {
	var winH = objDefault.win.height();
	var screenEnd = scrollTop + winH;
	scrollClsObj(screenEnd);
	
	objInfoArry.forEach(function(obj){
		scrollObj(obj, scrollTop, screenEnd, winH);
	});
}

objDefault.win.on({
	'scroll': function() {
		var scrollTop = objDefault.doc.scrollTop();
		(scrollTop > 0) ? objDefault.doc.addClass('scroll') : objDefault.doc.removeClass('scroll');
		scrollPos(scrollTop);
	}
});