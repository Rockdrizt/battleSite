var bubbles = document.getElementById('bubbles')

setInterval(function() {
  bubbles.classList.toggle('bubbles-down')
  bubbles.classList.toggle('bubbles-up')
}, 10000)
