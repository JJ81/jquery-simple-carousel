/**
	Copyright jcoporation, http://jcorporationtech.com
	Date : 2018.2.13
	Name : simple carousel
	Email : j.lee@jcorporationtech.com
	Author : Anybody can join us to enhance our code and review. Welcome.
	License: MIT
**/

(function($, window) {
	/**
	 * 사용자 생성자 SimpleCarousel
	 *
	 * @module SimpleCarousel
	 * @param {Object} options - 사용자 정의 옵션값
	 */
	$.fn.SimpleCarousel = function(options){
		
		var
			current_slide = 0
			,container_width = 0
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
			return current_slide; // TODO 현재 슬라이드를 알면 이전과 다음의 슬라이드 배치가 가능하다.
		};
		
		/**
		 * 슬라이드를 이동시키는 액션
		 *
		 * @method action
		 * @param {String} direction - 진행방향
		 * @param {Number} pos - 슬라이드 번호
		 */
		$.action = function(direction, pos){
			var
				slide = 0,
				currentSlide = 0,
				prevSlide = 0,
				nextSlide = 0;
			
			// 특정 위치로 이동을 시킬 경우는 아직 구현이 안됨
			if(pos === undefined){
				slide = $.count(direction);
			}else{
				slide = pos;
				current_slide = pos; // update position
			}

			if(settings.effect === ''){
				carouselSlide.css('display', 'none');
				carouselSlide.eq(slide).css('display', 'block');
			}else if(settings.effect === 'fade'){
				carouselSlide.css('display', 'none');
				carouselSlide.eq(slide).fadeIn(settings.speed);
			} else if(settings.effect === 'horizontal'){
				
				// 다음 버튼을 눌렀을 때의 연산
				if(direction === 'next'){
					currentSlide = (slide===0) ? total-1 : slide-1;
					nextSlide = (currentSlide===(total-1)) ? 0 : currentSlide+1;
					
					carouselSlide.eq(currentSlide).css({
						display: 'block'
					}).stop().animate({
						left : '-'+container_width+'px' // TODO 미처리; 로딩일 될 때 계산, 리사이즈가 될 때 재계산
					}, {
						duration : settings.speed,
						easing: settings.animateEffect
					});
					
					carouselSlide.eq(nextSlide).css({
						display: 'block'
					}).stop().animate({
						left : '0'
					}, {
						duration : settings.speed,
						easing: settings.animateEffect
					});
					
					
					setTimeout(function () {
						carouselSlide.css({
							'display' : 'none',
							'left' : '0'
						});
						
						// current after moved
						carouselSlide.eq(slide).css({
							'display': 'block'
						});
						
						// next
						carouselSlide.eq(((slide === (total-1)) ? 0 : slide+1)).css({
							'display': 'block',
							'left' : container_width + 'px'
						});
					},settings.speed);
					
				}else if(direction === 'prev'){
					
					currentSlide = (slide === (total-1)) ? 0 : slide+1;
					prevSlide = (currentSlide===0) ? total-1 : currentSlide-1;
					
					carouselSlide.eq(prevSlide).css({
						display: 'block',
						left : '-'+container_width+'px'
					}).stop().animate({
						left : '0'
					}, {
						duration : settings.speed,
						easing: settings.animateEffect
					});
					
					carouselSlide.eq(currentSlide).css({
						display: 'block',
						left: '0'
					}).stop().animate({
						left : container_width+'px'
					}, {
						duration : settings.speed,
						easing: settings.animateEffect
					});
					
					
					setTimeout(function () {
						carouselSlide.css({
							'display' : 'none',
							'left' : '0'
						});
						
						carouselSlide.eq(slide).css({
							'display': 'block'
						});
						
						// prev
						carouselSlide.eq(((slide === (total-1)) ? 0 : slide-1)).css({
							'display': 'block',
							'left' : container_width + 'px'
						});
					},settings.speed);
					
				}else{ // TODO 특정 위치로 이동을 시키게 될 경우
					console.log('no direction data');
					// 현재 위치에서 이동하고자 하는 위치의 슬라이드를 바로 뒤에 붙여서 조정하고 이동시키는 것으로 한다
					// 이 때도 위와 같이 좌측인지 우측인지에 따라서 재조정이 필요하다
					//
					
				}
				
				
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

			// TODO 이전버튼과 다음 버튼을 눌렀을 때 애니메이션이 겹치거나 하는 현상을 제거하기 위해서 별도의 설정이 필요하다
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
		 * @deprecated
		 * @method looping
		 * @param {Object} btnGroup - 버튼 객체
		 * @returns {number} - setInterval로 생성된 타이머 반환
		 */
		$.looping = function(btnGroup){ // 네이밍을 변경 => autoSlide
			return setInterval(function () {
				btnGroup.btnNext.click();
			}, settings.delay);
		};
		
		
		/**
		 * 슬라이드 자동 롤링 설정
		 *
		 * @method autoSlide
		 * @param {Object} btnGroup - 버튼 객체
		 * @returns {number} - setInterval로 생성된 타이머 반환
		 */
		$.autoSlide = function(btnGroup){
			return setInterval(function () {
				btnGroup.btnNext.click();
			}, settings.delay);
		};
		
		/**
		 * 슬라이더를 개시한다.
		 *
		 * @method initialize
		 * @param {Object} container - 슬라이드 컨테이너 객체
		 */
		$.initialize = function (container) {

			carouselSlide = $(container).find(settings.slide);
			total = carouselSlide.length;

			var btnGroup = null ,timer = null;

			if(settings.navigation){
				btnGroup = $.setNavigation(container);
			}

			if(settings.pagination){
				$.setPagination(container);	
			}
			
			
			if(settings.autoPlay){
				timer = $.autoSlide(btnGroup);
				
				if(settings.stopOnInterrupt){
					// TODO 별도의 메서드로 분리할 것.
					$(container).bind('mouseenter', function () {
						clearInterval(timer);
					});
					
					$(container).bind('mouseleave', function () {
						timer = $.autoSlide(btnGroup);
					});
				}
			}
			
			if(settings.clickableBullet){
				$.clickBullet();
			}
			
			
			if(settings.effect === 'horizontal'){
				// console.log('horizontal settings');
				
				container_width = $(container).width();
				$(window).bind('resize', function () {
					container_width = $(container).width();
				});
				
				carouselSlide.eq(1).css({
					display: 'block',
					left: container_width + 'px',
					top: '0'
				});
				
				
			}
			
			
		};

		this.each(function () {
			$.initialize(this);
		});
	};
	
	
	
	/**
	 * 기본값 설정
	 * @type {{slide: string, btnNext: string, btnPrev: string, navigation: boolean, pagination: boolean, bulletClassName: string, clickableBullet: boolean, effect: string, speed: number, loop: boolean, autoPlay: boolean, delay: number, stopOnMouseOver: boolean}}
	 */
	$.fn.SimpleCarousel.default = {
		// 선택자 설정
		slide : '.carousel-slide',
		btnNext : '.carousel-btn-next',
		btnPrev : '.carousel-btn-prev',
		
		// 네비게이션 출력 여부
		navigation: true,
		
		// 페이지네이션 출력 여부
		pagination : false,
		// 페이지네이션 내 블릿 네임 설정
		bulletClassName : 'bullet',
		
		// 페이지네이션 내의 블릿 클릭할 수 있는지 여부
		clickableBullet : false,
		
		// 페이지 전환 효과 설정
		effect : '',
		animateEffect : '',
		
		// TODO 자동으로 이동하는 방향을 설정할 수 있도록 한다
		autoAnimiateDirection : '',
		
		// 페이지가 전환되는 시간
		speed : 500,
		
		// 루프를 돌지 여부 설정
		// TODO 해당 로직은 아직 설정이 되지 않음
		// TODO 오토플레이가 되고 있을 때, loop를 false로 설정이 되어 있다면 버튼 작동에 대해서 어떤 로직을 설정해야 하는가?
		loop: true,
		
		// 자동 롤링 설정
		autoPlay : false,
		// 자동으로 롤링되는 시간, 인터벌
		delay : 3000,
		
		// autoplay 중단 설정
		stopOnInterrupt : false
		
		// TODO 페이지네이션에 숫자를 추가하는 설정
		
		// TODO 키보드로 작동이 될 수 있도록 설정
		
		// TODO Draggable 설정
		
		// TODO Mobile Swiper 설정
		
		// TODO easing 연결
		
		// TODO Lazy Loading연결
		
		
		// 애니메이션을 넣기 위해서는 매 슬라이드의 위치를 정리해야 한다
		// 이전 슬라이드와 다음 슬라이드의 위치를 잡는 로직을 어디서 처리할 것인가?
		
		
		
		
		
	};
	
}(jQuery, window));