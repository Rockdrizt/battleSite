var textbox = document.getElementById('textbox')
var points = document.getElementById('points')
setInterval(function () {
  textbox.children[0].classList.toggle('hide')
  textbox.children[1].classList.toggle('hide')
  points.children[0].classList.toggle('point--active')
  points.children[1].classList.toggle('point--active')
}, 5000)
