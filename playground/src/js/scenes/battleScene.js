
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
	}

	function initialize() {
		particles = {}
		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		loadSounds()

	}

	function addParticle(group, offsetX, offsetY, zindex, particleName) {
		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		emitter.x = offsetX
		emitter.y = offsetY
		group.add(emitter)
		if (zindex === "back")
			group.sendToBack(emitter)

		particles[particleName] = emitter
	}

	function addParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		var slot = character.getSlotByAttachment(attachmentName)
		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		if(emitter.absolute) {
			emitter.x = slot.x
			emitter.y = slot.y
			sceneGroup.add(emitter)
		}
		else
			slot.add(emitter)
		//character.spine.setToSetupPose()
		slot[particleName] = emitter
	}

	function removeParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		var slot = character.getSlotByAttachment(attachmentName)
		var emitter = slot[particleName]
		epicparticles.removeEmitter(emitter)
	}

	function removeParticle(particleName) {
		var emitter = particles[particleName]
		epicparticles.removeEmitter(emitter)
	}

	function preload() {

		game.stage.disableVisibilityChange = true;
	}

	function getFunctionData(value) {
		var functionArrays = value.split(":")
		var functionName = functionArrays[0]
		var params = functionArrays.slice(1)

		return {name: functionName, params: params}
	}

	function getGroupRef(ref, self) {
		switch (ref) {
			case "self" :
				return self
			case "stage" :
				return sceneGroup
			default:
				return sceneGroup
		}
	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x;
		spineSkeleton.y = y
		//spineSkeleton.scale.setTo(0.8,0.8)
		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setAnimationByName(0, idleAnimation, true)
		// spineSkeleton.autoUpdateTransform ()
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, loop, onComplete, args) {
			var entry
			for (var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var isLoop = (index === animations.length - 1) && loop
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, isLoop)
				else
					spineSkeleton.addAnimationByName(0, animation, isLoop)

			}

			if (args)
				entry.args = args

			if (onComplete) {
				entry.onComplete = onComplete
			}

			spineSkeleton.setToSetupPose()
			return entry
		}

		spineGroup.setSkinByName = function (skin) {
			spineSkeleton.setSkinByName(skin)
			spineSkeleton.setToSetupPose()
		}

		spineGroup.setAlive = function (alive) {
			spineSkeleton.autoUpdate = alive
		}

		spineGroup.getSlotContainer = function (slotName) {
			var slotIndex
			for (var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++) {
				var slotData = spineSkeleton.skeletonData.slots[index]
				if (slotData.name === slotName) {
					slotIndex = index
				}
			}

			if (slotIndex) {
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineGroup.getSlotByAttachment = function (attachmentName) {
			var slotIndex
			for (var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++) {
				var slotData = spineSkeleton.skeletonData.slots[index]
				if (slotData.attachmentName === attachmentName) {
					slotIndex = index
				}
			}

			if (slotIndex) {
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineSkeleton.onEvent.add(function (i, e) {
			var eventName = e.data.name
			console.log(eventName)

			if ((!eventName) && (typeof eventName !== 'string'))
				return

			var functionData = getFunctionData(eventName)
			if ((!functionData) || (!functionData.name)) {
				return
			}

			if (functionData.name === "PLAY") {
				// console.log(functionData.param)
				sound.play(functionData.params[0])
			}
			if (functionData.name === "SPAWN") {
				// console.log(functionData.param)
				addParticleCharacter(spineGroup, functionData.params)
			}
			if (functionData.name === "STAGESPAWN") {
				// console.log(functionData.param)
				var ref = functionData.params[0]
				var group = getGroupRef(ref, spineGroup)
				var offsetX = functionData.params[1]
				var offsetY = functionData.params[2]
				var particleName = functionData.params[4]
				var zIndex = functionData.params[3]

				addParticle(group, offsetX, offsetY, zIndex, particleName)
			}
			if (functionData.name === "DESPAWN") {
				// console.log(functionData.param)
				removeParticleCharacter(spineGroup, functionData.params)
			}
			if (functionData.name === "STAGEDESPAWN") {
				// console.log(functionData.param)
				removeParticle(functionData.params)
			}

		})

		spineGroup.spine = spineSkeleton

		return spineGroup
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

				var spineGroup = createSpine(character.name, nameLowerCase, "run")
				spineGroup.x = game.world.centerX * 0.5 * side.direction + xOffset
				spineGroup.y = CHARACTER_CENTER_OFFSET.y + game.world.centerY + position.y
				console.log("postion", spineGroup.position)
				spineGroup.scale.setTo(position.scale.x * side.scale.x, position.scale.y)
				spineGroup.data = character.data
				sceneGroup.add(spineGroup)
				console.log(spineGroup)

				var rect = game.add.graphics()
				rect.beginFill(0xffffff)
				rect.drawRect(0, 0, 200, 400)
				rect.endFill()
				rect.x = -100
				rect.y = -400
				rect.alpha = 0
				spineGroup.add(rect)
				rect.inputEnabled = true
				rect.events.onInputDown.add(selectYogotar)

				if(charIndex === 1)
					mainSpine = spineGroup
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