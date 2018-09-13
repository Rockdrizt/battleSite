var btnLeft = document.getElementById('btn-left')
var btnRight = document.getElementById('btn-right')
var difficultyBtns = document.querySelectorAll('.difficulty__btn')
var diffForms = document.querySelectorAll('.diff-form')
var modals = document.querySelectorAll('.modal')
var closeModal = document.querySelectorAll('.close')

// change difficulty
btnLeft.addEventListener('click', function () {
  switch (btnLeft.parentNode.id) {
    case 'easy':
      btnRight.parentNode.children[1].innerText = 'Hard'
      btnRight.parentNode.id = 'hard'
      btnRight.parentNode.style.backgroundImage =
        'linear-gradient(90deg,  #e8522c, #c52752)'
      break
    case 'medium':
      btnLeft.parentNode.children[1].innerText = 'Easy'
      btnLeft.parentNode.id = 'easy'
      btnLeft.parentNode.style.backgroundImage =
        'linear-gradient(90deg, #bbd400, #129264)'
      break
    case 'hard':
      btnLeft.parentNode.children[1].innerText = 'Medium'
      btnLeft.parentNode.id = 'medium'
      btnLeft.parentNode.style.backgroundImage =
        'linear-gradient(90deg, #f8c22a, #ec6f32)'
      break
  }
})
btnRight.addEventListener('click', function () {
  switch (btnRight.parentNode.id) {
    case 'easy':
      btnRight.parentNode.children[1].innerText = 'Medium'
      btnRight.parentNode.id = 'medium'
      btnRight.parentNode.style.backgroundImage =
        'linear-gradient(90deg, #f8c22a, #ec6f32)'
      break
    case 'medium':
      btnRight.parentNode.children[1].innerText = 'Hard'
      btnRight.parentNode.id = 'hard'
      btnRight.parentNode.style.backgroundImage =
        'linear-gradient(90deg, #e8522c, #c52752)'
      break
    case 'hard':
      btnLeft.parentNode.children[1].innerText = 'Easy'
      btnLeft.parentNode.id = 'easy'
      btnLeft.parentNode.style.backgroundImage =
        'linear-gradient(90deg, #bbd400, #129264)'
      break
  }
})

// show modal
difficultyBtns.forEach(function (el) {
  el.addEventListener('click', function () {
    switch (el.previousElementSibling.innerText.toLowerCase()) {
      case 'addition':
        modals.forEach(function (el) {
          if (el.classList.contains('modal--addition')) {
            el.classList.remove('hidden')
          }
        })
        break
      case 'multiplication':
        modals.forEach(function (el) {
          if (el.classList.contains('modal--multiplication')) {
            el.classList.remove('hidden')
          }
        })
        break
      case 'substraction':
        modals.forEach(function (el) {
          if (el.classList.contains('modal--substraction')) {
            el.classList.remove('hidden')
          }
        })
        break
      case 'division':
        modals.forEach(function (el) {
          if (el.classList.contains('modal--division')) {
            el.classList.remove('hidden')
          }
        })
        break
    }
  })
})

closeModal.forEach(function (el) {
  el.addEventListener('click', function () {
    modals.forEach(function (elem) {
      elem.classList.add('hidden')
    })
  })
})

diffForms.forEach(function (el) {
  el.addEventListener('submit', function (e) {
    e.preventDefault()
    modals.forEach(function (elem) {
      elem.classList.add('hidden')
    })
  })
})

// Select all
var selectAll = document.querySelectorAll('.select-all')
selectAll.forEach(function (el, i) {
  el.addEventListener('change', function (e) {
    var inputs = diffForms[i].elements
    if (e.target.checked === true) {
      for (var j = 1; j < inputs.length - 1; j++) {
        inputs[j].checked = true
        inputs[j].addEventListener('change', function () {
          e.target.checked = false
        })
      }
    } else {
      for (var k = 1; k < inputs.length - 1; k++) {
        inputs[k].checked = false
      }
    }
  })
})

// show btn edit
var inputActive = document.querySelectorAll('.input-active')

inputActive.forEach(function (el) {
  el.addEventListener('change', function (e) {
    if (el.checked) {
      el.parentNode.nextElementSibling.style.display = 'inline'
    } else {
      el.parentNode.nextElementSibling.style.display = 'none'
    }
  })
})
