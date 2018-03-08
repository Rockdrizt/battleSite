var sceneloader = function(){

	var sceneList = []
	var game = null
	var initialized = false
	var currentLoader = null
	var spines
	var files

	function init(gameObject){
		game = gameObject
	}

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

	function createNewLoader(callbacks){
		
		callbacks = callbacks || {}

		var newLoader = new Phaser.Loader(game)

		newLoader.onLoadStart.add(function(){
			//console.log("Preloading scenes")
			if(typeof(callbacks.onStart) === "function"){
				callbacks.onStart()
			}
		})

		newLoader.onFileComplete.add(function(progress, cachekey, success, totalLoaded, totalFiles){
			//console.log("[Resource Loader]:"+cachekey+"("+totalLoaded+"/"+totalFiles+")")
			var eventParams = {
				progress: progress, 
				cachekey: cachekey,
				success: success, 
				totalLoaded: totalLoaded, 
				totalFiles: totalFiles
			}

			if(typeof(callbacks.onLoadFile) === "function"){
				callbacks.onLoadFile(eventParams)
			}

			if((files[cachekey])&&(typeof (files[cachekey].onComplete)) === "function")
				files[cachekey].onComplete()

			console.log(cachekey)
		})

		newLoader.onLoadComplete.add(function(){
			if(typeof(callbacks.onComplete) === "function"){
				callbacks.onComplete()
			}
		})

		return newLoader
	}

	function preload(scenes, callbacks){
		var inputDevice = game.device.desktop ? "desktop" : "movil"

		currentLoader = createNewLoader(callbacks)
		buttons.getImages(currentLoader)
		spines = []
		files = {}

		for(var indexScene = 0; indexScene < scenes.length; indexScene++){

			var currentScene = scenes[indexScene]

			var gameData = currentScene.getGameData ? currentScene.getGameData() : "none"
			if(typeof gameData === "object"){
				tutorialHelper.loadType(gameData, currentLoader)
			}

			if(currentScene.assets !== "undefined"){
				var assets = currentScene.assets

				if(typeof assets.jsons == "object"){
					for(var indexJson = 0; indexJson < assets.jsons.length; indexJson++){
						var currentJson = assets.jsons[indexJson]
						currentLoader.json(currentJson.name, currentJson.file)
					}
				}

				if(typeof assets.spines == "object"){
					for(var indexSpine = 0; indexSpine < assets.spines.length; indexSpine++){
						var currentSpine = assets.spines[indexSpine]
						currentSpine.currentScene = currentScene
						// var spineLoader = new Phaser.Loader(game)
						currentLoader.spine(currentSpine.name, currentSpine.file)
						files[currentSpine.name] = {onComplete:getSpineEvents.bind(null, currentSpine.name, currentLoader, currentScene)}
						// spineLoader.onFileComplete.add(getSoundsSpine)
					}
				}

				if(typeof assets.images == "object"){
					for(var indexImage = 0; indexImage < assets.images.length; indexImage++){
						var currentImage = assets.images[indexImage]
						var file = currentImage.file
						if(file.includes("%input")) {
							var re = /%input/gi;
							file = file.replace(re, inputDevice);
							console.log("file", file)
						}
						currentLoader.image(currentImage.name, file)
					}
				}

				if(typeof assets.sounds == "object"){
					for(var indexSound = 0; indexSound < assets.sounds.length; indexSound++){
						var currentSound = assets.sounds[indexSound]
						currentLoader.audio(currentSound.name, currentSound.file)
					}
				}

				if(typeof assets.atlases == "object"){
					for(var indexAtlas = 0; indexAtlas < assets.atlases.length; indexAtlas++){
						var currentAtlas = assets.atlases[indexAtlas]
						currentLoader.atlas(currentAtlas.name, currentAtlas.image, currentAtlas.json, null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
					}
				}

				if(typeof assets.spritesheets == "object"){
					for(var indexSheet = 0; indexSheet < assets.spritesheets.length; indexSheet++){
						var currentSheet = assets.spritesheets[indexSheet]
						currentLoader.spritesheet(currentSheet.name, currentSheet.file, currentSheet.width, currentSheet.height, currentSheet.frames)
					}
				}
			}

			else{
				console.warn("Scene with no Assets to preload")
			}

			saveScene(currentScene)
		}

		currentLoader.start()
	}

	function saveScene(scene){
		scene.name = scene.name || "unamedScene_"+sceneList.length
		var state = game.state.add(scene.name, scene)
		sceneList.push(scene)

		console.log("Preloaded scene: "+scene.name)
	}

	function searchSceneByName(sceneName){
		for(var indexScene = 0; indexScene < sceneList.length; indexScene++){
			var currentScene = sceneList[indexScene]
			if(currentScene.name === sceneName){
				//console.log("Found scene: "+sceneName)
				return currentScene
			}
		}
		console.log("Cannot find scene: "+sceneName)
		return null
	}

	function getScene(sceneName){
		return searchSceneByName(sceneName)
	}

	function show(sceneName){
		var sceneToShow = searchSceneByName(sceneName)

		if(sceneToShow != null){

			//console.log(game.state.states[sceneName])

			game.state.start(sceneToShow.name)

			// var currentState = game.state.getCurrentState()
			// var stage = currentState.stage

			// var texture = new Phaser.RenderTexture(game, game.world.width, game.world.height)
			
		}	

		return sceneToShow	
	}

	return {
		preload: preload,
		show: show,
		init: init,
		getScene: getScene,
	}
}()