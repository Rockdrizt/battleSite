
var soundsPath = "../../shared/minigames/sounds/"
var spineScene = function(){

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
		]
	}

    var assets = {
        sounds: [
		],
		spines: [
			{
				name:"yogotarEagle",
				file:"images/spines/Eagle/eagle.json"
			},
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

    function loadSounds(){

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
    }

    function initialize(){
        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        loadSounds()

    }


	function preload(){

		game.stage.disableVisibilityChange = true;
	}

	function getFunctionData(value) {
		var indexOfFunc = value.indexOf(":")
		var functionName = null
		var param = null

		if(indexOfFunc > -1){
			functionName = value.substr(0, indexOfFunc)
			param = value.substr(indexOfFunc + 1)
		}
		// console.log(functionName, param)

		return {name: functionName, param: param}
	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
		// spineSkeleton.scale.setTo(0.8,0.8)
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

		spineSkeleton.onEvent.add(function (i,e) {
			var eventName = e.data.name

			if((!eventName)&&(typeof eventName !== 'string'))
				return

			var functionData = getFunctionData(eventName)
			if((!functionData)||(!functionData.name)){return}

			if(functionData.name === "PLAY"){
				// console.log(functionData.param)
				sound.play(functionData.param)
			}
		})

		spineGroup.spine = spineSkeleton

		return spineGroup
	}


    return {
        assets: assets,
		bootFiles:bootFiles,
        name: "spineScene",
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

			var eagle = createSpine("yogotarEagle", "normal", "idle")
			eagle.x = game.world.centerX
			eagle.y = game.world.height
			sceneGroup.add(eagle)

			eagle.setAnimation(["run"], true)

			initialize()
        }
    }
}()