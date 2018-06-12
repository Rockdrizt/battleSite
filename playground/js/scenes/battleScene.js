
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var battleScene = function(){

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"question":"Question ",
			"winner":"WINNER",
			"victory":"VICTORY",
			"newCard":"New Card",
			"perfect":"PERFECT",
			"good":"GOOD",
			"weak":"WEAK",
			"dontgiveup":"DON'T GIVE UP"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?",
			"question":"Pregunta ",
			"winner":"GANADOR",
			"victory":"VICTORIA",
			"newCard":"Nueva Carta",
			"perfect":"PERFECTO",
			"good":"BIEN",
			"weak":"DEBIL",
			"dontgiveup":"NO TE RINDAS"
        }
    }
	var bootFiles = {
		jsons: [
			{
				name:"sounds",
				file:"data/sounds/general.json"
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
        sounds: [
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
		particles:[
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

    var sceneGroup
	var clickLatch
	var teams

    function loadSounds(){

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
    }

    function initialize(){
        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        loadSounds()

    }
	
    function addParticle(character, params) {
		console.log(character)

    	var attachmentName = params[0]
		var particleName = params[1]

    	var slot = character.getSlotByAttachment(attachmentName)
		var emitter = epicparticles.newEmitter(particleName) //particleName
		slot.add(emitter)
		character.spine.setToSetupPose()

		console.log(particleName)
	}

	function preload(){

		game.stage.disableVisibilityChange = true;
	}

	function getFunctionData(value) {
		var functionArrays = value.split(":")
		var functionName = functionArrays[0]
		var params = functionArrays.slice(1)

		return {name: functionName, params: params}
	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
		//spineSkeleton.scale.setTo(0.8,0.8)
		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setAnimationByName(0, idleAnimation, true)
		// spineSkeleton.autoUpdateTransform ()
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, loop, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var isLoop = (index === animations.length - 1) && loop
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, isLoop)
				else
					spineSkeleton.addAnimationByName(0, animation, isLoop)

			}

			if (args)
				entry.args = args

			if(onComplete){
				entry.onComplete = onComplete
			}

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
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.name === slotName){
					slotIndex = index
				}
			}

			if (slotIndex){
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineGroup.getSlotByAttachment = function (attachmentName) {
			var slotIndex
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.attachmentName === attachmentName){
					slotIndex = index
				}
			}

			if (slotIndex){
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineSkeleton.onEvent.add(function (i,e) {
			console.log(i, e)
			var eventName = e.data.name

			if((!eventName)&&(typeof eventName !== 'string'))
				return

			var functionData = getFunctionData(eventName)
			if((!functionData)||(!functionData.name)){return}

			if(functionData.name === "PLAY"){
				// console.log(functionData.param)
				sound.play(functionData.params[0])
			}
			if(functionData.name === "SPAWN"){
				// console.log(functionData.param)
				addParticle(spineGroup, functionData.params)
			}
		})

		spineGroup.spine = spineSkeleton

		return spineGroup
	}

	function setCharacter(character) {

    	var charObj = {
    		name: character,
			file: "data/characters/" + character + ".json",
			scales: ["@0.5x"]
		}
		bootFiles.characters.push(charObj)
		//TODO: this is a placeholder remove this later
		//teams = []
		//var team1 = [bootFiles.characters[bootFiles.characters.length - 1]]
		//teams.push(team1)
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

			var background = game.add.graphics()
			background.beginFill(0xffffff)
			background.drawRect(-2, -2, game.world.width + 2, game.world.height + 2)
			background.endFill()
			sceneGroup.add(background)

			var char1 = assets.spines[0]
			var nameLowerCase = char1.data.name.toLowerCase()

			console.log(assets.spines)
			var eagle = createSpine(char1.name, nameLowerCase, "hit_super")
			eagle.x = game.world.centerX
			eagle.y = game.world.height
			sceneGroup.add(eagle)
			console.log(eagle)

			//eagle.setAnimation(["run"], true)

			initialize()
        },
		setCharacter:setCharacter,
		setTeams: function (teams) {
			for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
				var team = teams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character)
				}
			}
		}
    }
}()