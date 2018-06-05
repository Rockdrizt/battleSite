var spineLoader = function () {
	function getSpineEvents(cacheKey, currentLoader, currentScene) {
		var jsonFile = game.cache.getJSON(cacheKey)
		console.log(cacheKey)
		var events = jsonFile.events
		// console.log(events, spine)
		var soundsAdded = {}
		var soundsList = game.cache.getJSON('sounds')
		var assetsSounds = currentScene.assets.sounds

		for(var key in events){
			// var event = events[key]
			var functionData = getFunctionData(key)

			if((functionData)&&(functionData.name === "PLAY")){
				var soundObj = {
					name:functionData.param,
					file:soundsList[functionData.param]
				}
				if(!soundsAdded[soundObj.name]){
					assetsSounds.push(soundObj)
					currentLoader.audio(soundObj.name, soundObj.file);
					soundsAdded[soundObj.name] = soundObj.name
				}
			}
		}
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

	function loadSpine(loader, currentSpine, loadingFiles) {
		loader.spine(currentSpine.name, currentSpine.file)
		loadingFiles[currentSpine.name] = {onComplete:getSpineEvents.bind(null, currentSpine.name, currentLoader, currentScene)}
	}

	return {
		loadSpine:loadSpine
	}
}()