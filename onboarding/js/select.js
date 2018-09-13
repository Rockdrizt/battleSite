var radioX = 1200
var radioY = 200
var originY = -230
if (window.innerWidth <= 575) {
  radioX = 350
  radioY = 80
  originY = -100
} else if (window.innerWidth <= 767) {
  radioX = 500
  radioY = 100
  originY = -160
} else if (window.innerWidth <= 991) {
  radioX = 650
  radioY = 100
  originY = -160
} else if (window.innerWidth <= 1199) {
  radioX = 900
  radioY = 100
  originY = -160
}
$('#carousel').Cloud9Carousel({
  yOrigin: originY,
  buttonLeft: $('#buttons > #left'),
  buttonRight: $('#buttons > #right'),
  autoPlay: 0,
  bringToFront: true,
  xRadius: radioX,
  yRadius: radioY,
  farScale: 0.2,
  itemClass: 'carousel__item',
  frontItemClass: 'active'
})
$(window).resize(function () {
  if (this.resizeTO) clearTimeout(this.resizeTO)
  this.resizeTO = setTimeout(function () {
    $(this).trigger('resizeEnd')
  }, 50)
})
$(window).bind('resizeEnd', function () {
  $('#carousel').Cloud9Carousel({
    yOrigin: originY,
    buttonLeft: $('#buttons > #left'),
    buttonRight: $('#buttons > #right'),
    autoPlay: 0,
    bringToFront: true,
    xRadius: radioX,
    yRadius: radioY,
    farScale: 0.2,
    itemClass: 'carousel__item',
    frontItemClass: 'active'
  })
})

var carouselItems = document.querySelectorAll('.carousel__item')
var btnOk = document.getElementById('btn-ok')
// var btnLeftRight = [document.getElementById('left'), document.getElementById('right')]
btnOk.addEventListener('click', function (e) {
  carouselItems.forEach(function (el) {
    if (el.classList.contains('active') && el.classList.contains('unlocked')) {
      btnOk.setAttribute('href', 'difficulty.html')
    }
  })
})
