var btnLeft = document.getElementById('btn-left')
var btnRight = document.getElementById('btn-right')
var difficultyBtns = document.querySelectorAll('.difficulty__btn')
var diffForms = document.querySelectorAll('.diff-form')
var modals = document.querySelectorAll('.modal')
var closeModal = document.querySelectorAll('.close')

// change difficulty
;[btnLeft, btnRight].forEach(function (el) {
  el.addEventListener('click', function (e) {
    if (e.target === btnLeft) {
      console.log('left');
    }
  })
})
// btnLeft.addEventListener('click', function () {
//   switch (btnLeft.parentNode.id) {
//     case 'easy':
//       btnRight.parentNode.children[1].innerText = 'Hard'
//       btnRight.parentNode.id = 'hard'
//       btnRight.parentNode.classList.add('hard')
//       btnRight.parentNode.classList.remove('easy')
//       break
//     case 'medium':
//       btnLeft.parentNode.children[1].innerText = 'Easy'
//       btnLeft.parentNode.id = 'easy'
//       btnRight.parentNode.classList.add('medium')
//       btnRight.parentNode.classList.remove('hard')
//       break
//     case 'hard':
//       btnLeft.parentNode.children[1].innerText = 'Medium'
//       btnLeft.parentNode.id = 'medium'
//       btnRight.parentNode.classList.add('easy')
//       btnRight.parentNode.classList.remove('medium')
//   }
// })
// btnRight.addEventListener('click', function () {
//   switch (btnRight.parentNode.id) {
//     case 'easy':
//       btnRight.parentNode.children[1].innerText = 'Medium'
//       btnRight.parentNode.id = 'medium'
//       btnRight.parentNode.classList.add('medium')
//       btnRight.parentNode.classList.remove('easy')
//       break
//     case 'medium':
//       btnRight.parentNode.children[1].innerText = 'Hard'
//       btnRight.parentNode.id = 'hard'
//       btnRight.parentNode.classList.add('hard')
//       btnRight.parentNode.classList.remove('medium')
//       break
//     case 'hard':
//       btnLeft.parentNode.children[1].innerText = 'Easy'
//       btnLeft.parentNode.id = 'easy'
//       btnRight.parentNode.classList.add('easy')
//       btnRight.parentNode.classList.remove('medium')
//       break
//   }
// })

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
function showEditBtn (form) {
  if (diffForms[0] === form) {
    for (var index = 1; index < form.elements.length; index++) {
      if (form.elements[index].checked) {
        form.elements[index].parentNode.nextElementSibling.classList.remove('hidden')
      } else {
        form.elements[index].parentNode.nextElementSibling.classList.add('hidden')
      }
    }
  }
}
function autoSelectAll (form) {
  var autoSelect = true
  for (var index = 1; index < form.elements.length; index++) {
    if (form.elements[index].nodeName !== 'BUTTON' && !form.elements[index].checked) {
      autoSelect = false
      break
    }
  }
  if (autoSelect) {
    form.elements[0].checked = true
  }
}
function selectAndUnselectAll (form, bool) {
  for (var index = 1; index < form.elements.length; index++) {
    if (form.elements[index].nodeName !== 'BUTTON') {
      form.elements[index].checked = bool
    }
  }
}
function unselectAll (form) {
  for (var index = 1; index < form.elements.length; index++) {
    if (form.elements[index].nodeName !== 'BUTTON') {
      form.elements[index].addEventListener('change', function (e) {
        showEditBtn(form)
        autoSelectAll(form)
        if (!e.target.checked) {
          form.elements[0].checked = false
        }
      })
    }
  }
}
function selectAll (form) {
  Object.values(form.elements).forEach(function (input, j) {
    if (input === Object.values(form.elements)[0] && input.nodeName !== 'BUTTON') {
      if (input === form[0]) {
        input.addEventListener('click', function (e) {
          if (e.target.checked) {
            selectAndUnselectAll(form, true)
            showEditBtn(form)
            autoSelectAll(form)
          } else {
            selectAndUnselectAll(form, false)
            showEditBtn(form)
            autoSelectAll(form)
          }
        })
      }
    } else if (input !== Object.values(form.elements)[0] && input.nodeName !== 'BUTTON') {
    }
  })
}
diffForms.forEach(function (form) {
  selectAll(form)
  unselectAll(form)
})
