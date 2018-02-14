/**
	Copyright jcoporation, http://jcorporationtech.com
	Date : 2018.2.13
	Name : simple carousel
	Email : j.lee@jcorporationtech.com
	Author : Anybody can join us to enhance our code and review. Welcome.
	License: MIT
**/
(function($) {
	$.fn.SimpleCarousel = function(options){

		var settings = $.extend({}, $.fn.SimpleCarousel.default, options);		
		var current_slide = 0;
		var carouselSlide = null;
		var total = 0;
		var pagination = null;


		$.count = function (direction) {
			if(direction === 'prev'){
				current_slide--;
				if(current_slide < 0){
					current_slide = total-1;
				}
			}else if(direction === 'next'){
				current_slide++;
				if(total <= current_slide){
					current_slide = 0;
				}
			}

			return current_slide;
		};

		$.action = function(direction, pos){
			var slide = null;
			
			if(pos === '' || pos === undefined){
				slide = $.count(direction);
			}else{
				slide = pos;
				current_slide = pos; // update position
			}

			if(settings.effect === ''){
				carouselSlide.css('display', 'none');
				carouselSlide.eq(slide).css('display', 'block');
			}else if(settings.effect === 'fade'){

				// TODO animate을 분리할 것인가...
				carouselSlide.css('display', 'none');
				carouselSlide.eq(slide).fadeIn(settings.duration);
			}

			if(settings.pagination){
				$.moveBullet();	
			}			
		}


		$.moveBullet = function (pos) {
			var slide = null;

			if(pos){
				slide = pos;
			}else{
				slide = current_slide;
			}

			if(settings.pagination){
				pagination.find('.'+settings.bulletClassName).removeClass('active');
				pagination.find('.'+settings.bulletClassName).eq(slide).addClass('active');	
			}
		};

		$.clickBullet = function () {
			pagination.find('.'+settings.bulletClassName).bind('click', function (e) {
				e.preventDefault();
				var idx = $(this).index();
				$.action(null, idx);
				$.moveBullet(idx);
			});

		}

		$.setPagination = function (container) {
			// current_slide
			var paginationWrapper = $('<div class="pagination" />');

			for(var i=0;i<total;i++ ){
				if(i===0){
					paginationWrapper.append('<a href="#" class="'+settings.bulletClassName+' active" />');
				}else{
					paginationWrapper.append('<a href="#" class="'+settings.bulletClassName+'" />');
				}
			}

			$(container).append(paginationWrapper);
			pagination = $(container).find('.pagination');
		};

		$.setNavigation = function (container) {
			var btnPrev = $(container).find(settings.btnPrev);
			var btnNext = $(container).find(settings.btnNext);

			btnPrev.bind('click', function (e) {
				e.preventDefault();
				// 순서가 카운트Count -> 슬라이드액션Move -> Bullet불릿변경(선택)
				$.action('prev');
			});

			btnNext.bind('click', function (e) {
				e.preventDefault();
				$.action('next');
			});

			return {
				btnPrev : btnPrev,
				btnNext : btnNext
			};
		};

		// 타깃을 찾아서 해당 엘리먼트 객체를 리턴 
		// $.selectElement = function () {

		// };

		$.looping = function(btnGroup){

			var timer = setInterval(function () {
				btnGroup.btnNext.click();
			}, settings.autoSlide);

			return timer;
		}

		$.initialize = function (container) {
			/*
				이동 효과 추가에 대해서 easing + animate
			*/
			carouselSlide = $(container).find(settings.slide);
			total = carouselSlide.length;

			var btnGroup = null;
			var timer = null;

			if(settings.navigation){
				btnGroup = $.setNavigation(container);
			}

			if(settings.pagination){
				$.setPagination(container);	
			}

			if(settings.loop){
				timer = $.looping(btnGroup);

				$(container).bind('mouseenter', function () {
					clearInterval(timer);
				});

				$(container).bind('mouseleave', function () {
					timer = $.looping(btnGroup);
				});
			}

			$.clickBullet();
		}

		this.each(function () {
			$.initialize(this);
		});
	};

	$.fn.SimpleCarousel.default = {
		slide : '.carousel-slide',
		btnNext : '.carousel-btn-next',
		btnPrev : '.carousel-btn-prev',
		navigation: true,
		bulletClassName : 'bullet',
		effect : '',
		duration : 500,
		pagination : false,
		autoSlide : 3000,
		loop: false
	};

	
}(jQuery));