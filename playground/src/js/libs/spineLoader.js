var spineLoader = function () {

	var currentLoader

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

	function drawParticle(group, offsetX, offsetY, zindex, particleName) {
		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		emitter.x = offsetX
		emitter.y = offsetY
		group.add(emitter)
		if (zindex === "back")
			group.sendToBack(emitter)

		if(typeof group.particles === "undefined")
			group.particles = {}

		group.particles[particleName] = emitter
	}

	function drawParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		var slot = character.getSlotByAttachment(attachmentName)
		if(typeof slot === "undefined"){
			console.warn(attachmentName + " attachment not found")
			return
		}

		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		if(emitter.absolute) {
			emitter.x = slot.x
			emitter.y = slot.y
			console.log("cord", slot.x, slot.y)
			character.add(emitter)
		}
		else
			slot.add(emitter)
		//character.spine.setToSetupPose()
		if(typeof slot.particles === "undefined")
			slot.particles = {}

		slot.particles[particleName] = emitter
	}

	function removeParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		var slot = character.getSlotByAttachment(attachmentName)
		var emitter = slot.particles[particleName]
		epicparticles.removeEmitter(emitter)
	}

	function removeParticle(character, particleName) {
		var emitter = character.particles[particleName]
		epicparticles.removeEmitter(emitter)
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
				drawParticleCharacter(spineGroup, functionData.params)
			}
			if (functionData.name === "STAGESPAWN") {
				// console.log(functionData.param)
				var ref = functionData.params[0]
				var group = getGroupRef(ref, spineGroup)
				var offsetX = functionData.params[1]
				var offsetY = functionData.params[2]
				var particleName = functionData.params[4]
				var zIndex = functionData.params[3]

				drawParticle(group, offsetX, offsetY, zIndex, particleName)
			}
			if (functionData.name === "DESPAWN") {
				// console.log(functionData.param)
				removeParticleCharacter(spineGroup, functionData.params)
			}
			if (functionData.name === "STAGEDESPAWN") {
				// console.log(functionData.param)
				removeParticle(spineGroup, functionData.params)
			}

		})

		spineGroup.spine = spineSkeleton

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

	return {
		loadSpine:loadSpine,
		createSpine:createSpine
	}
}()