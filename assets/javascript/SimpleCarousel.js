/**
	Copyright jcoporation, http://jcorporationtech.com
	Date : 2018.2.13
	Name : simple carousel
	Email : j.lee@jcorporationtech.com
	Author : Anybody can join us to enhance our code and review. Welcome.
	License: MIT
**/

(function($) {
	/**
	 * 사용자 생성자 SimpleCarousel
	 *
	 * @module SimpleCarousel
	 * @param {Object} options - 사용자 정의 옵션값
	 */
	$.fn.SimpleCarousel = function(options){
		
		var
			current_slide = 0
			,carouselSlide = null
			,total = 0
			,pagination = null
			,settings = $.extend({}, $.fn.SimpleCarousel.default, options);
		
		/**
		 * 다음 슬라이드 위치를 계산한다.
		 *
		 * @method count
		 * @param {String} direction - 진행방향
		 * @returns {number} current_slide - 현재 슬라이드 번호를 리턴한다
		 */
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
		
		/**
		 * 슬라이드를 이동시키는 액션
		 *
		 * @method action
		 * @param {String} direction - 진행방향
		 * @param {Number} pos - 슬라이드 번호
		 */
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
		};
		
		
		/**
		 * 슬라이드 위치에 따라서 페이지네이션을 이동시킨다.
		 *
		 * @method moveBullet - 페이지네이션 블릿 활성화
		 * @param {Number} pos - 블릿 위치
		 */
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
		
		/**
		 * 페이지네이션 블릿을 클릭했을 경우 이벤트 바인딩
		 *
		 * @method clickBullet
		 */
		$.clickBullet = function () {
			pagination.find('.'+settings.bulletClassName).bind('click', function (e) {
				e.preventDefault();
				var idx = $(this).index();
				$.action(null, idx);
				$.moveBullet(idx);
			});
		};
		
		/**
		 * 페이지네이션을 설정한다.
		 *
		 * @method setPagination
		 * @param {Object} container - 슬라이드 컨테이너 객체
		 */
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
		
		
		/**
		 * 네비게이션을 출력한다.
		 *
		 * @method setNavigation
		 * @param {Object} container - 슬라이드 컨테이너 객체
		 * @returns {{btnPrev: *, btnNext: *}} - 이벤트 바인딩이 된 버튼 객체 반환
		 */
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
		
		/**
		 * 슬라이드 자동 롤링 설정
		 *
		 * @method looping
		 * @param {Object} btnGroup - 버튼 객체
		 * @returns {number} - setInterval로 생성된 타이머 반환
		 */
		$.looping = function(btnGroup){
			return setInterval(function () {
				btnGroup.btnNext.click();
			}, settings.autoSlide);
		};
		
		/**
		 * 슬라이더를 개시한다.
		 *
		 * @method initialize
		 * @param {Object} container - 슬라이드 컨테이너 객체
		 */
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
		};

		this.each(function () {
			$.initialize(this);
		});
	};
	
	/**
	 * 슬라이더의 기본 값을 설정한다.
	 *
	 * @type {{slide: string, btnNext: string, btnPrev: string, navigation: boolean, bulletClassName: string, effect: string, duration: number, pagination: boolean, autoSlide: number, loop: boolean}}
	 */
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