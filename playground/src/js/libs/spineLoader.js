var spineLoader = function () {

	var currentLoader
	var spines = {}
	var pullGroup

	function getGroupRef(ref, self) {
		switch (ref) {
			case "self" :
				return self
			case "stage" :
				return ref.parent
			default:
				return ref.parent
		}
	}

	function removeSpine() {
		pullGroup.add(this)
	}

	function setAnimation(animations, loop, onComplete, args) {
		var spineSkeleton = this
		var entry

		spineSkeleton.setToSetupPose()
		spineSkeleton.updateTransform()

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

		return entry
	}

	function setSkin(skin) {
		var spineSkeleton = this

		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setToSetupPose()
	}

	function playEvent(i, e) {
		var spineGroup = this
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
			particleBattle.drawParticleCharacter(spineGroup, functionData.params)
		}
		if (functionData.name === "STAGESPAWN") {
			// console.log(functionData.param)
			var ref = functionData.params[0]
			var group = getGroupRef(ref, spineGroup)
			var offsetX = functionData.params[1]
			var offsetY = functionData.params[2]
			var particleName = functionData.params[4]
			var zIndex = functionData.params[3]

			particleBattle.drawParticle(group, offsetX, offsetY, zIndex, particleName)
		}
		if (functionData.name === "DESPAWN") {
			// console.log(functionData.param)
			particleBattle.removeParticleCharacter(spineGroup, functionData.params)
		}
		if (functionData.name === "STAGEDESPAWN") {
			// console.log(functionData.param)
			particleBattle.removeParticle(functionData.params)
		}

	}

	function createSpine(skeleton, skin, idleAnimation, x, y, unlike) {
		if(spines[skeleton]) {
			return spines[skeleton]
		}

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


		spineGroup.setAnimation = setAnimation.bind(spineSkeleton)

		spineGroup.setSkinByName = setSkin.bind(spineSkeleton)

		spineGroup.setAlive = function (alive) {
			this.autoUpdate = alive
		}.bind(spineSkeleton)

		spineGroup.getSlotContainer = function (slotName) {
			var slotIndex
			for (var index = 0, n = this.skeletonData.slots.length; index < n; index++) {
				var slotData = this.skeletonData.slots[index]
				if (slotData.name === slotName) {
					slotIndex = index
				}
			}

			if (slotIndex) {
				return this.slotContainers[slotIndex]
			}
		}.bind(spineSkeleton)

		spineGroup.getSlotByAttachment = function (attachmentName) {
			var slotIndex
			for (var index = 0, n = this.skeletonData.slots.length; index < n; index++) {
				var slotData = this.skeletonData.slots[index]
				if (slotData.attachmentName === attachmentName) {
					slotIndex = index
				}
			}

			if (slotIndex) {
				return this.slotContainers[slotIndex]
			}
		}.bind(spineSkeleton)

		spineSkeleton.onEvent.add(playEvent.bind(spineGroup))

		spineGroup.spine = spineSkeleton

		spineGroup.remove = removeSpine.bind(spineGroup)

		if(!unlike)
			spines[skeleton] = spineGroup

		return spineGroup
	}

	function addSound(functionData, soundsList, assetsSounds){
		var name = functionData.params[0]

		var soundObj = {
			name:name,
			file:soundsList[name]
		}

		if(typeof soundObj.file === "undefined"){
			console.warn("sound " + name + " not found")
			return
		}

		assetsSounds.push(soundObj)
		currentLoader.audio(soundObj.name, soundObj.file);
	}

	function addParticle(name, assetsParticles, string){

		var particleObj = {
			name:name,
			file:typeof string === "string" ? "particles/characters/" + string
				: "particles/characters/" + name + "/" + name + ".json",
			texture:name + ".png"
		}

		console.log(particleObj)

		assetsParticles.push(particleObj)
		epicparticles.loadEmitter(currentLoader, particleObj.name, particleObj.texture, particleObj.file)
	}

	function getSpineEvents(cacheKey, currentScene) {

		var jsonFile = game.cache.getJSON(cacheKey)
		var animations = jsonFile.animations
		console.log(jsonFile, spine)

		var soundsList = game.cache.getJSON('sounds')
		var assetsSounds = currentScene.assets.sounds

		currentScene.assets.particles = currentScene.assets.particles || []
		var assetsParticles = currentScene.assets.particles

		console.log(animations)
		for(var animation in animations){
			console.log(animation)
			var events = animations[animation].events
			console.log("events", animations[animation])
			if(events) {
				for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
					var objContent = events[eventIndex]
					var key = objContent.name

					var functionData = getFunctionData(key)
					console.log(functionData.name)

					if ((functionData) && (functionData.name === "PLAY")) {
						addSound(functionData, soundsList, assetsSounds)
					}

					if ((functionData) && (functionData.name === "SPAWN")) {
						var name = functionData.params[1]
						addParticle(name, assetsParticles, objContent.string)
					}

					if ((functionData) && (functionData.name === "STAGESPAWN")) {
						var name = functionData.params[functionData.params.length - 1]
						addParticle(name, assetsParticles, objContent.string)
					}
				}
			}
		}
	}

	function getFunctionData(value) {
		var functionArrays = value.split(":")
		var functionName = functionArrays[0]
		var params = functionArrays.slice(1)


		return {name: functionName, params: params}
	}

	function loadSpine(loader, currentSpine, loadingFiles, currentScene) {
		currentLoader = loader
		loader.spine(currentSpine.name, currentSpine.file, currentSpine.scales)
		loadingFiles[currentSpine.name] = {onComplete:getSpineEvents.bind(null, currentSpine.name, currentScene)}
	}

	function init() {
		pullGroup = game.add.group()
		pullGroup.alpha = 0
		pullGroup.y = -game.world.height
	}

	return {
		loadSpine:loadSpine,
		createSpine:createSpine,
		init:init,
	}
}()