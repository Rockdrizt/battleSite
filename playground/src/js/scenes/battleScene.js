
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

	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
	var ORDER_POSITIONS = [POSITIONS.UP, POSITIONS.MID, POSITIONS.DOWN]
	var CHARACTER_CENTER_OFFSET = {x:-200, y: -200}

	var sceneGroup
	var clickLatch
	var teams = []
	var particles
	var mainSpine

	function loadSounds() {

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
	}

	function createButton(callback) {
		var buttonGroup = game.add.group()

		var rectBg = game.add.graphics()
		rectBg.beginFill(0x000000)
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

	function createMenuAnimations() {
		var animations = mainSpine.spine.skeletonData.animations

		function changeAnimation(name) {
			mainSpine.setAnimation([name], true)
		}

		for (var animationIndex = 0; animationIndex < animations.length; animationIndex++) {
			var animationName = animations[animationIndex].name
			var pivotY = Math.floor(animationIndex / 10)
			var pivotX = animationIndex % 10

			var button = createButton(changeAnimation.bind(null, animationName))
			button.x = pivotX * 200
			button.y = pivotY * 50
			button.label.text = animationName
		}

		//var buttonAttack = createButton(characterBattle)
	}

	function initialize() {
		particles = {}
		game.stage.backgroundColor = "#ffffff"
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

	function getSpineInfo(characterName) {
		for(var spineIndex = 0; spineIndex < assets.spines.length; spineIndex++){
			if(characterName === assets.spines[spineIndex].name)
				return assets.spines[spineIndex]
		}
	}

	function selectYogotar(obj) {
		mainSpine = obj.parent
	}

	function placeYogotars() {

		for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
			var teamCharacters = teams[teamIndex]
			var side = ORDER_SIDES[teamIndex]

			for(var charIndex = 0; charIndex < teamCharacters.length; charIndex++){
				var characterName = teamCharacters[charIndex]
				var character = getSpineInfo(characterName)

				var nameLowerCase = character.data.name.toLowerCase()
				var position = ORDER_POSITIONS[charIndex]

				var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + position.x * side.scale.x

				var character = characterBattle.createCharacter(character.name, nameLowerCase, "run")
				character.x = game.world.centerX * 0.5 * side.direction + xOffset
				character.y = CHARACTER_CENTER_OFFSET.y + game.world.centerY + position.y
				console.log("postion", character.position)
				character.scale.setTo(position.scale.x * side.scale.x, position.scale.y)
				character.data = character.data
				sceneGroup.add(character)
				console.log(character)

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

				if(charIndex === 1)
					mainSpine = character
			}
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
					var emitter = epicparticles.newEmitter("pickedEnergy")
					emitter.x = game.input.activePointer.x
					emitter.y = game.input.activePointer.y
				}

				clickLatch = true
			} else {
				clickLatch = false
			}
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

			placeYogotars()

			createMenuAnimations()

			//eagle.setAnimation(["run"], true)

			initialize()
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