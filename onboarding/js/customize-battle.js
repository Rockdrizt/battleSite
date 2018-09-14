var less = document.querySelectorAll('.less')
var plus = document.querySelectorAll('.plus')
var customizeBattle = document.getElementById('customize-battle')
less.forEach(function (el) {
  el.addEventListener('click', function (ev) {
    ev.preventDefault()
    switch (el.classList[1]) {
      case 'less-min':
        el.nextElementSibling.value > '1'
          ? el.nextElementSibling.value--
          : el.nextElementSibling.value
        break
      case 'less-rounds':
        el.nextElementSibling.value > '1'
          ? (el.nextElementSibling.value -= 2)
          : el.nextElementSibling.value
        break
      case 'less-battle-mode':
        switch (el.nextElementSibling.value) {
          case '1vs1':
            break
          case '2vs2':
            el.nextElementSibling.value = '1vs1'
            break
          case '3vs3':
            el.nextElementSibling.value = '2vs2'
            break
        }
        break
    }
  })
})
plus.forEach(function(el) {
  el.addEventListener('click', function(ev) {
    ev.preventDefault()
    switch (el.classList[1]) {
      case 'plus-min':
        el.previousElementSibling.value < '5'
          ? el.previousElementSibling.value++
          : el.previousElementSibling.value
        break
      case 'plus-rounds':
        el.previousElementSibling.value < '5'
          ? (el.previousElementSibling.value =
              parseInt(el.previousElementSibling.value) + 2)
          : el.previousElementSibling.value
        break
      case 'plus-battle-mode':
        switch (el.previousElementSibling.value) {
          case '3vs3':
            break
          case '2vs2':
            el.previousElementSibling.value = '3vs3'
            break
          case '1vs1':
            el.previousElementSibling.value = '2vs2'
            break
        }
        break
    }
  })
})
customizeBattle.addEventListener('submit', function (ev) {
  ev.preventDefault()
  var config = {
    minutes: ev.target[1].value,
    rounds: ev.target[4].value,
    battleMode: ev.target[7].value
  }
  window.location.href =
    'lobby.html' +
    '?' +
    'min=' +
    config.minutes +
    '&' +
    'rounds=' +
    config.rounds +
    '&' +
    'mode=' +
    config.battleMode
  console.log(ev)
})
