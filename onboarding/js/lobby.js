// Get battle configuration
var configBattle = {}
var paramstr = window.location.search.substr(1)
var paramArr = paramstr.split('&')
paramArr.forEach(function (el) {
  var conf = el.split('=')
  configBattle[conf[0]] = conf[1]
})

// Generate players
var playersContainer = document.getElementById('players-container')
function generatePlayer (players) {
  var playersName = [
    'player 1',
    'player 2',
    'player 3',
    'player 4',
    'player 5',
    'player 6'
  ]

  for (var index = 0; index < players; index++) {
    var templatePlayer = document.createElement('div')
    templatePlayer.classList.add('player')
    templatePlayer.setAttribute('draggable', true)
    var templateName = document.createTextNode(playersName[index])
    templatePlayer.appendChild(templateName)
    playersContainer.appendChild(templatePlayer)
  }
}

// hide unnecessary elements
function hideHitbox (selector) {
  var hitboxToHide = document.querySelectorAll(selector)
  hitboxToHide.forEach(function (el) {
    el.parentNode.removeChild(el)
  })
}

if (configBattle.mode === '1vs1') {
  hideHitbox('.one')
  generatePlayer(2)
} else if (configBattle.mode === '2vs2') {
  hideHitbox('.two')
  generatePlayer(4)
} else {
  generatePlayer(6)
}

// Drag and Drop
var players = document.querySelectorAll('.player')
var container = document.querySelectorAll('.players__container')
var from
var to

function dragstart (e) {
  from = e.target.parentNode
  e.target.classList.add('drop')
  playersContainer.classList.remove('full')
  container.forEach(function (el) {
    if (el.children.length === 0) {
      el.classList.remove('full')
    }
  })
}
function dragover (e) {
  e.preventDefault()
}
function dragenter (e) {
  e.preventDefault()
  to = e.target
}

function drop (e) {
  var drop = document.querySelector('.drop')
  if (to.parentNode.id === 'players-container') {
    this.append(drop)
  } else if (to.parentNode.classList.contains('players__container')) {
    from.append(to)
    this.append(drop)
  } else {
    this.append(drop)
  }
  drop.classList.remove('drop')
}
container.forEach(function (el) {
  el.addEventListener('dragstart', dragstart)
  el.addEventListener('dragover', dragover)
  el.addEventListener('dragenter', dragenter)
  el.addEventListener('drop', drop)
})

// function random
function randomPlayers (listChildren, listContainer) {
  var position = []
  while (position.length < listChildren.length) {
    var random = Math.floor(Math.random() * listChildren.length)
    if (!position.includes(random)) {
      position.push(random)
    }
  }
  for (var i = 0; i < listContainer.length; i++) {
    if (playersContainer.length > 2) {
      playersContainer.removeChild(listChildren[position[i]])
    } else if (playersContainer.length === 2) {
      listContainer[i].removeChild(listChildren[position[i]])
    }
    listContainer[i].append(listChildren[position[i]])
  }
}

// show modal
var okBtn = document.getElementById('btn-ok')
var modalReady = document.getElementById('modal-ready')
var modalWarning = document.getElementById('modal-warning')
var closeModal = document.querySelectorAll('.close')
okBtn.addEventListener('click', function () {
  var randomChild = []
  var randomContainer = []
  players.forEach(function (el, i) {
    if (i !== 0) {
      randomChild.push(el)
    }
  })
  container.forEach(function (el) {
    if (el.id !== 'players-container') {
      randomContainer.push(el)
    }
  })
  randomPlayers(randomChild, randomContainer)
})
closeModal.forEach(function (el) {
  el.addEventListener('click', function () {
    modalReady.classList.add('hidden')
    modalWarning.classList.add('hidden')
  })
})
