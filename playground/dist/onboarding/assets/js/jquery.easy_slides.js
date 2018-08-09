/*
EasySlides - слидер
Autor 2017 Shabanov Ivan (Шабанов Иван)
Usage:
   

   $('.slider').EasySlides({
      'autoplay': true, 
      'timeout': 3000,
      'show': 5, //Сколь-ко позывать слайдов (по умолчанию 5: 1-активный, 2-предыдущих и 2-следующих)
      'vertical': false,  //Если True то слайдер вертикальный, слайды листаются движением вверх/вниз
      'reverse': false, //Перевернутый слайдер
      'touchevents': true, //Вкючено ли события на прикосновения к сладеру (листания и т.п) 
      'delayaftershow': 300, //Задержка после смены слайдера, в это время слайдер нельзя листать
      'stepbystep': true, //При клике на далекий слайд перейти к нему последовательно, а не сразу
      'startslide': 0,  //Стартовый слайд 
      'beforeshow': function () {},
      'aftershow': function () {},      
      });

*/
var popSound = new Audio('sounds/pop.mp3');
(function( $ ){

  $.fn.EasySlides = function( options ) {  
    var settings = $.extend( {
      'autoplay': false,
      'timeout': 3000,
      'show': 5,
      'vertical': false,
      'reverse': false,
      'touchevents': true,
      'delayaftershow': 300,
      'stepbystep': true,
      'startslide': 0,
      'distancetochange': 10,
      'beforeshow': function () {},
      'aftershow': function () {},
      
    }, options);
    return this.each(function() {        
      var this_slider = this;
      var EasySlidesTimer;
      var EasySlidesCanChange = true;
      
      var count = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)').length;
      var cur_slide = 0;
      var mousedowned = false;
      var need_slide = 0;
      var slides;
      if (count > 0) {

        while (count < settings['show']) {
          var html = $(this_slider).html();
          $(html).appendTo(this_slider);
          $(this_slider).children('.next_button:eq(0), .prev_button:eq(0), .nav_indicators:eq(0)').remove();
          slides = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)');

          count = $(slides).length;
        }
        slides = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)');

        if ($(this_slider).children('.nav_indicators').length > 0) {
          var nav_indicators = '<ul>';
          while (need_slide < count) {
            need_slide ++;
            nav_indicators = nav_indicators + '<li>' + need_slide + '</li>';
          }
          nav_indicators = nav_indicators + '</ul>';
          $(this_slider).children('.nav_indicators').html(nav_indicators);
          need_slide = 0
        }
        var EasySlidesLoopToNeeded = function() {
          var next;
          var left = need_slide - cur_slide;
          var right = cur_slide - need_slide
          if (left < 0) {left = left + count;}
          if (right < 0) {right = right + count;}
          if (cur_slide != need_slide) {
            if ((left) < (right)) {
              console.log('+');
              next = cur_slide + 1;
            } else {
              console.log('-');
              next = cur_slide - 1;
            }
            EasySlidesNext(next);
            setTimeout(EasySlidesLoopToNeeded, settings['delayaftershow']);
          };
        }
        var EasySlidesNext = function (nextslide) {
          if (EasySlidesCanChange) {
            EasySlidesCanChange = false;
            setTimeout(function() {EasySlidesCanChange = true;}, settings['delayaftershow']);
            clearTimeout(EasySlidesTimer);
            if (typeof settings['beforeshow'] == 'function') {
              settings['beforeshow'];
            };
            var i = 0;
            if (count > 0) {
              if (typeof nextslide == 'number') {
                cur_slide = nextslide;
              } else {
                cur_slide ++;
                nextslide = cur_slide;
              }
              while (cur_slide < 0) {cur_slide = cur_slide + count;}
              while (cur_slide >= count) {cur_slide = cur_slide - count;}
              while (nextslide < 0) {nextslide = nextslide + count;}
              while (nextslide >= count) {nextslide = nextslide - count;}
              $(this_slider).children('.nav_indicators').find('ul').find('li').removeClass('active');
              
              $(this_slider).find('.nav_indicators ul li:nth-child(' + (nextslide + 1) + ')').addClass('active');
              i = 0;
              /*
              $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)').each(function() {
              */
              $(slides).each(function() {

              
                var cssclass = '';
                var icount = 0;
                icount = i - nextslide ;
                while (icount < 0) {
                  icount = icount + count;
                    
                };
                
                while (icount > count) {
                  icount = icount - count;
                };
                  

                  
                  
                  switch(nextslide % 7){
                      case 0:
                          $(".textSubject").text("MATH");
                          $("#nextButton1").css("opacity",1);
                          $("#nextButton1").click(function(){
                              
		$("#section3").css("display","block");
		$("#section2").css("display","none");
                          })
                          break;
                      case 1:
                          $(".textSubject").text("CODING")
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                      case 2:
                          $(".textSubject").text("CREATIVITY");
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                      case 3:
                          $(".textSubject").text("GEOGRAPHY");
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                      case 4:
                          $(".textSubject").text("HEALTH");
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                      case 5:
                          $(".textSubject").text("SCIENCE");
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                      case 6:
                          $(".textSubject").text("LANGUAGE");
                          $("#nextButton1").css("opacity",0.5);
                          $("#nextButton1").off( "click" );
                          break;
                  }
                  
                  
                  
                
                if (icount == 0) {
                  cssclass = 'active';
                  $(this_slider).find('.' + cssclass+ ':not(.nav_indicators ul li)').removeClass(cssclass);
                  $(this).removeClass('hidden');
                  $(this).addClass(cssclass);
                } else if (icount < settings['show'] / 2) {
                  cssclass = 'next' + icount;
                  $(this_slider).find('.' + cssclass).removeClass(cssclass);
                  $(this).removeClass('hidden');
                  $(this).addClass(cssclass);
                } else if (icount > count - (settings['show'] / 2)) {
                  cssclass = 'prev' + (count - icount);
                  $(this_slider).find('.' + cssclass).removeClass(cssclass);        
                  $(this).removeClass('hidden');
                  $(this).addClass(cssclass);
                } else {
                  $(this).addClass('hidden');
                }
                i++;
              });
              if (settings['autoplay']) {
                clearTimeout(EasySlidesTimer);
                EasySlidesTimer = setTimeout(function() {
                  EasySlidesNext();
                }, settings['timeout']);
              }
            }
            if (typeof settings['aftershow'] == 'function') {
              settings['aftershow'];
            };
            
          };
        };
        EasySlidesNext(settings['startslide']);
        /*
        $(this_slider).children(':not(.next_button, .prev_button, .nav_indicators)').click(function () {
        */
        $(slides).click(function () {
          need_slide = $(this_slider).children().index(this);
          if (settings['stepbystep']) {
            EasySlidesLoopToNeeded()
          } else {
            EasySlidesNext( need_slide );
          }
        });
        $(this_slider).children('.nav_indicators').find('ul').find('li').click(function () {
          need_slide = $(this_slider).find('.nav_indicators ul li').index(this);
          if (settings['stepbystep']) {
            EasySlidesLoopToNeeded()
          } else {
            EasySlidesNext( need_slide );
          }
        });
  
        $(this_slider).find('.next_button').click(function() {
            popSound.play();
          EasySlidesCanChange = true;
          EasySlidesNext();
             TweenMax.fromTo($(this).find("img"),0.3,{scale:1.5},{scale:1});
            
        });
        $(this_slider).find('.prev_button').click(function() {
            popSound.play();
             TweenMax.fromTo($(this).find("img"),0.3,{scale:1.5},{scale:1});
          EasySlidesCanChange = true;
          cur_slide --;
          EasySlidesNext(cur_slide);
        });
        if (settings['touchevents']) {
          var EasySliderMoved = function (xcur, ycur) {
                  var offset = $(slides).find('.active').offset();
                  var left = 0;
                  var top = 0;
                  if (typeof offset !== 'undefined') {
                    left = offset.left;
                    top = offset.top;
                  }
                  
                  var p0 = $(this_slider).data('posstart'),
                      p1 = {    x: xcur, 
                                y: ycur,
                                l: left,
                                t: top,
                           },
                      d = 0;
                  if (typeof p0 === 'undefined') {
                    p0 = p1;
                    $(this_slider).data('posstart', p1);
                  }
                  
                  if (settings['vertical']) {
                    d = p1.y - p0.y;
                    top = p0.t  +  d;
                    //$(this_slider).find('.active:not(.nav_indicators ul li)').offset({'top': top});
                  } else {
                    d = p1.x - p0.x;
                    left = p0.l + d;
                    //$(this_slider).find('.active:not(.nav_indicators ul li)').offset({'left': left});
                  }
                  if (settings['reverse']) {
                    d = -d;
                  }    
                  if ((Math.abs(d) > settings['distancetochange']) && (EasySlidesCanChange)) {
                    $(this_slider).data('posstart' , p1);
                    
                    if (d > 0) {
                      cur_slide --;
                    } else {
                      cur_slide ++;
                    }
                    EasySlidesNext(cur_slide);
                  }              
          } 
          /*События*/
          $(this_slider).bind('mousemove', function(e) {
            e.preventDefault();
            if (e.buttons > 0) {
              EasySliderMoved(e.pageX , e.pageY);
              mousedowned = true;
            } else {
              if (mousedowned) {
                EasySliderMoved(e.pageX , e.pageY);
                $(this_slider).removeData('posstart');   
                mousedowned = false;
              }
            }
          });
          $(this_slider).bind('mouseup', function(e) {
              e.preventDefault();
              if (mousedowned) {
                EasySliderMoved(e.pageX , e.pageY);
                $(this_slider).removeData('posstart');   
                mousedowned = false;
              }
          })
    
          $(this_slider).bind('touchmove', function(e) {
            e.preventDefault();
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            EasySliderMoved(touch.pageX , touch.pageY);
          });
          $(this_slider).bind('touchend', function(e) {
            e.preventDefault(); 
            $(this_slider).removeData('posstart');         
          });
          
        } 
      }      
    });
  }
})( jQuery );

