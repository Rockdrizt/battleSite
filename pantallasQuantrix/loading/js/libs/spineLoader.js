var spineLoader = function () {

	var currentLoader

	function addSound(functionData, soundsList, assetsSounds){
		var soundObj = {
			name:functionData.param,
			file:soundsList[functionData.param]
		}

		assetsSounds.push(soundObj)
		currentLoader.audio(soundObj.name, soundObj.file);
	}

	function getSpineEvents(cacheKey, currentScene) {
		var jsonFile = game.cache.getJSON(cacheKey)
		console.log(cacheKey)
		var events = jsonFile.events
		// console.log(events, spine)

		var soundsList = game.cache.getJSON('sounds')
		var assetsSounds = currentScene.assets.sounds

		currentScene.assets.particles = currentScene.assets.particles || []
		var assetsParticles = currentScene.assets.particles

		for(var key in events){
			// var event = events[key]
			var functionData = getFunctionData(key)

			if((functionData)&&(functionData.name === "PLAY")){
				addSound(functionData, soundsList, assetsSounds)
			}

			if((functionData)&&(functionData.name === "SPAWN")){
				addParticle(functionData, assetsParticles)
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
		currentLoader = currentLoader
		loader.spine(currentSpine.name, currentSpine.file, currentSpine.scales)
		loadingFiles[currentSpine.name] = {onComplete:getSpineEvents.bind(null, currentSpine.name, currentScene)}
	}

	return {
		loadSpine:loadSpine
	}
}()