var spineLoader = function () {

	var currentLoader

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
			file:string ? "particles/characters/" + string : "particles/characters/" + name + "/" + name + ".json",
			texture:name + ".png"
		}

		console.log("particle", particleObj)

		assetsParticles.push(particleObj)
		epicparticles.loadEmitter(currentLoader, particleObj.name, particleObj.texture, particleObj.file)
	}

	function getSpineEvents(cacheKey, currentScene) {

		var jsonFile = game.cache.getJSON(cacheKey)
		var events = jsonFile.events
		console.log(events, spine)

		var soundsList = game.cache.getJSON('sounds')
		var assetsSounds = currentScene.assets.sounds

		currentScene.assets.particles = currentScene.assets.particles || []
		var assetsParticles = currentScene.assets.particles

		console.log(events)
		for(var key in events){
			var functionData = getFunctionData(key)
			console.log(functionData.name)

			var objContent = events[key]

			if((functionData)&&(functionData.name === "PLAY")){
				addSound(functionData, soundsList, assetsSounds)
			}

			if((functionData)&&(functionData.name === "SPAWN")){
				var name = functionData.params[1]
				addParticle(name, assetsParticles, objContent.string)
			}

			if((functionData)&&(functionData.name === "STAGESPAWN")){
				var name = functionData.params[functionData.params.length - 1]
				addParticle(name, assetsParticles, objContent.string)
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
		loadSpine:loadSpine
	}
}()