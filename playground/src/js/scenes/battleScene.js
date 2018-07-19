
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var battleScene = function() {

	var localizationData = {
		"EN": {
			"howTo": "How to Play?",
			"moves": "Moves left",
			"question": "Question ",
			"winner": "WINNER",
			"victory": "VICTORY",
			"newCard": "New Card",
			"perfect": "PERFECT",
			"good": "GOOD",
			"weak": "WEAK",
			"dontgiveup": "DON'T GIVE UP"
		},

		"ES": {
			"moves": "Movimientos extra",
			"howTo": "�C�mo jugar?",
			"question": "Pregunta ",
			"winner": "GANADOR",
			"victory": "VICTORIA",
			"newCard": "Nueva Carta",
			"perfect": "PERFECTO",
			"good": "BIEN",
			"weak": "DEBIL",
			"dontgiveup": "NO TE RINDAS"
		}
	}
	var bootFiles = {
		jsons: [
			{
				name: "sounds",
				file: "data/sounds/tournament.json"
			},
		],
		characters: [
			// {
			// 	name:"yogotarLuna",
			// 	file:"data/characters/yogotarLuna.json",
			// 	scales:['@0.5x']
			// }
		]
	}

	var assets = {
		sounds: [],
		images: [
			{
				name: "stage",
				file: "images/battle/stage.png"
			}
		],
		spines: [
			// {
			// 	name:"yogotarEagle",
			// 	file:"spines/Eagle/eagle.json"
			// },
			// {
			// 	name:"yogotarEagle",
			// 	file:"images/spines/Eagle/eagle.json"
			// }
		],
		particles: [
			{
				name: 'pickedEnergy',
				file: 'particles/battle/pickedEnergy/specialBar1.json',
				texture: 'specialBar1.png'
			},
			{
				name: 'fireFloor',
				file: 'particles/battle/fireFloor/fireFloor1.json',
				texture: 'fireFloor1.png'
			}
		]
	}

	var SIDES = {
		LEFT:{direction: -1, scale:{x:1}},
		RIGHT:{direction: 1, scale:{x:-1}},
	}

	var POSITIONS = {
		UP:{x:130, y: -200, scale:{x:0.8, y:0.8}},
		MID:{x:350, y: 0, scale:{x:0.9, y:0.9}},
		DOWN:{x:-70, y: 120, scale:{x:1, y:1}},
	}

	var ATTACKS = ["normal", "super", "ultra"]

	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
	var ORDER_POSITIONS = [POSITIONS.UP, POSITIONS.MID, POSITIONS.DOWN]
	var CHARACTER_CENTER_OFFSET = {x:-200, y: -200}

	var sceneGroup
	var clickLatch
	var teams = []
	var particles
	var mainSpine
	var mainYogotorars
	var attackCounter

	function loadSounds() {

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
	}

	function rotateTeam(teamIndex){
		var team = teams[teamIndex]
		var side = ORDER_SIDES[teamIndex]
		var copyPositions = []

		function returnNormal(obj) {
			obj.setAnimation(["idle_normal"], true)
			obj.scale.x = obj.prevScale
			obj.updatePosition()
		}

		for (var playerIndex = 0; playerIndex < team.length; playerIndex++) {
			var character = team[playerIndex]

			var playerPos = playerIndex - 1 < 0 ? ORDER_POSITIONS.length - 1 : playerIndex - 1
			var newPosition = ORDER_POSITIONS[playerPos]
			copyPositions[playerIndex] = newPosition

			var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + newPosition.x * side.scale.x

			var characterPos = {
				x : game.world.centerX * 0.5 * side.direction + xOffset,
				y : CHARACTER_CENTER_OFFSET.y + game.world.centerY + newPosition.y
			}

			character.setAnimation(["run"], true)

			character.prevScale = newPosition.scale.x
			var toScaleX = newPosition.scale.x //facing direction
			if(character.x > characterPos.x) { //check facing direction
				character.scale.x *= -1
				toScaleX *= -1
			}

			game.add.tween(character.scale).to({x:toScaleX, y:newPosition.scale.y}, 490, null, true)
			var moveTween = game.add.tween(character).to({x:characterPos.x, y:characterPos.y}, 500, null, true)
			moveTween.onComplete.add(returnNormal)

			if(ORDER_POSITIONS[playerPos] === POSITIONS.MID)
				mainYogotorars[teamIndex] = character
		}

		sceneGroup.sort('y', Phaser.Group.SORT_ASCENDING)
		ORDER_POSITIONS = copyPositions
	}

	function createButton(callback, color) {
		color = color || 0x000000

		var buttonGroup = game.add.group()

		var rectBg = game.add.graphics()
		rectBg.beginFill(color)
		rectBg.lineStyle(5, 0xffffff, 1)
		rectBg.drawRect(0, 0, 200, 50)
		rectBg.endFill()
		buttonGroup.add(rectBg)

		rectBg.inputEnabled = true
		rectBg.events.onInputDown.add(callback)

		var fontStyle = {font: "24px Arial", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var text = game.add.text(10, 10, "", fontStyle)
		buttonGroup.add(text)
		buttonGroup.label = text

		return buttonGroup
	}

	function attack(obj) {
		var type = obj.parent.tag
		console.log(mainSpine)
		var charAttacking = mainYogotorars[attackCounter % 2]
		attackCounter++
		var target = type === "ultra" ? teams[attackCounter % 2].groupPoint : mainYogotorars[attackCounter % 2]
		charAttacking.attack(target, type)
		//sceneGroup.add(projectile)
	}

	function changeAnimation(name) {
		mainSpine.setAnimation([name], true)
	}

	function createMenuAnimations() {
		var animations = mainSpine.spine.skeletonData.animations

		var pivotY, pivotX
		for (var animationIndex = 0; animationIndex < animations.length; animationIndex++) {
			var animationName = animations[animationIndex].name
			pivotY = Math.floor(animationIndex / 9)
			pivotX = animationIndex % 9

			var button = createButton(changeAnimation.bind(null, animationName))
			button.x = pivotX * 200
			button.y = pivotY * 50
			button.label.text = animationName
		}

		for(var attackIndex = 0; attackIndex < ATTACKS.length; attackIndex++){
			var buttonAttack = createButton(attack, 0xff0000)
			buttonAttack.tag = ATTACKS[attackIndex]
			buttonAttack.x = attackIndex * 200
			buttonAttack.y = (pivotY + 1) * 50
			buttonAttack.label.text = ATTACKS[attackIndex]
		}

		var rotateButton = createButton(rotateTeam.bind(null, 0), 0xffff00)
		rotateButton.x = attackIndex * 200
		rotateButton.y = (pivotY + 1) * 50
		rotateButton.label.text = "rotate"
	}

	function initialize() {
		particles = {}
		game.stage.backgroundColor = "#ffffff"
		mainYogotorars = []
		attackCounter = 0
		//gameActive = true
		loadSounds()

	}

	function preload() {

		game.stage.disableVisibilityChange = true;
	}

	function setCharacter(character, teamIndex) {

		var charObj = {
			name: character,
			file: "data/characters/" + character + ".json",
			scales: ["@0.5x"],
			teamNum:teamIndex
		}
		bootFiles.characters.push(charObj)
	}

	function selectYogotar(obj) {
		mainSpine = obj.parent
	}

	function takeGroupDamage(type, element) {
		var team = this.characters

		for(var teamIndex = 0; teamIndex < team.length; teamIndex++){
			var character = team[teamIndex]

			character.takeDamage(type, element)
		}
	}

	function placeYogotars() {

		for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
			var teamCharacters = teams[teamIndex]
			var side = ORDER_SIDES[teamIndex]

			for(var charIndex = 0; charIndex < teamCharacters.length; charIndex++){
				var characterName = teamCharacters[charIndex]
				var position = ORDER_POSITIONS[charIndex]
				var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + position.x * side.scale.x

				var characterPos = {
					x : game.world.centerX * 0.5 * side.direction + xOffset,
					y : CHARACTER_CENTER_OFFSET.y + game.world.centerY + position.y
				}
				var character = characterBattle.createCharacter(characterName, characterPos)
				console.log("postion", character.position)
				character.scale.setTo(position.scale.x * side.scale.x, position.scale.y)
				character.teamIndex = teamIndex
				sceneGroup.add(character)

				var rect = game.add.graphics()
				rect.beginFill(0xffffff)
				rect.drawRect(0, 0, 200, 400)
				rect.endFill()
				rect.x = -100
				rect.y = -400
				rect.alpha = 0
				character.add(rect)
				rect.inputEnabled = true
				rect.events.onInputDown.add(selectYogotar)

				teams[teamIndex][charIndex] = character

				if(charIndex === 1)
					mainSpine = character

				if(ORDER_POSITIONS[charIndex] === POSITIONS.MID){
					mainYogotorars[teamIndex] = character
				}
			}

			var groupPoint = game.add.graphics()
			groupPoint.beginFill(0xffffff)
			groupPoint.drawRect(0, 0, 50, 10)
			groupPoint.endFill()
			groupPoint.x = game.world.centerX * 0.5 * side.direction + 100 * side.direction
			groupPoint.y = CHARACTER_CENTER_OFFSET.y + game.world.centerY + POSITIONS.MID.y
			groupPoint.characters = teamCharacters
			groupPoint.impactPoint = {x:groupPoint.x, y:groupPoint.y}
			groupPoint.takeDamage = takeGroupDamage.bind(groupPoint)
			groupPoint.side = side.direction
			teamCharacters.groupPoint = groupPoint

			sceneGroup.add(groupPoint)

		}

	}

	return {
		assets: assets,
		bootFiles:bootFiles,
		name: "battleScene",
		preload:preload,
		update:function () {
			epicparticles.update()
			if (game.input.activePointer.isDown){
				if (!clickLatch) {
					var emitter = epicparticles.newEmitter("pickedEnergy", {x:game.input.activePointer.x, y:game.input.activePointer.y})
					emitter.x = game.input.activePointer.x
					emitter.y = game.input.activePointer.y
				}

				clickLatch = true
			} else {
				clickLatch = false
			}
		},
		render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){

			sceneGroup = game.add.group()
			sceneGroup.x = game.world.centerX
			sceneGroup.y = game.world.centerY

			var background = game.add.graphics()
			background.beginFill(0xffff00)
			background.drawRect(game.world.centerX - 2, game.world.centerY - 2, game.world.centerX + 2, game.world.centerY + 2)
			background.endFill()
			sceneGroup.add(background)

			var stage = sceneGroup.create(0, 0, "stage")
			stage.scale.setTo(1.12, 1.12)
			stage.anchor.setTo(0.5, 0.5)

			initialize()

			placeYogotars()

			createMenuAnimations()

			//eagle.setAnimation(["run"], true)

		},
		setCharacter:setCharacter,
		setTeams: function (myTeams) {
			teams = myTeams
			for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
				var team = myTeams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character, teamIndex)
				}
			}
		}
	}
}()