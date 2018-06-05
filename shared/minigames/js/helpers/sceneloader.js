var sceneloader = function(){

	var sceneList = []
	var game = null
	var initialized = false
	var currentLoader = null
	var loadingFiles

	function init(gameObject){
		game = gameObject
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

			if((loadingFiles[cachekey])&&(typeof (loadingFiles[cachekey].onComplete)) === "function")
				loadingFiles[cachekey].onComplete()

			console.log(cachekey)
		})

		newLoader.onLoadComplete.add(function(){
			if(typeof(callbacks.onComplete) === "function"){
				callbacks.onComplete()
			}
		})

		return newLoader
	}

	function preload(scenes, callbacks, phase){
		phase = phase || "preload"

		var inputDevice = game.device.desktop ? "desktop" : "movil"

		currentLoader = createNewLoader(callbacks)
		buttons.getImages(currentLoader)
		loadingFiles = {}

		for(var indexScene = 0; indexScene < scenes.length; indexScene++){

			var currentScene = scenes[indexScene]
			var fileArray = phase === "preload" ? currentScene["assets"] : currentScene["preload"]

			var gameData = currentScene.getGameData ? currentScene.getGameData() : "none"
			if((typeof gameData === "object")&&(phase === "preload")){
				tutorialHelper.loadType(gameData, currentLoader)
			}

			if(typeof fileArray !== "undefined"){

				if(typeof fileArray.jsons == "object"){
					for(var indexJson = 0; indexJson < fileArray.jsons.length; indexJson++){
						var currentJson = fileArray.jsons[indexJson]
						currentLoader.json(currentJson.name, currentJson.file)
					}
				}

				if(typeof fileArray.characters == "object"){
					for(var indexPart = 0; indexPart < fileArray.particles.length; indexPart++){
						var currentCharacter = fileArray.characters[indexPart]
						characterBattle.loadCharacter(currentLoader, currentCharacter, fileArray, loadingFiles, game)
					}
				}

				if(typeof fileArray.spines == "object"){
					for(var indexSpine = 0; indexSpine < fileArray.spines.length; indexSpine++){
						var currentSpine = fileArray.spines[indexSpine]
						currentSpine.currentScene = currentScene
						// var spineLoader = new Phaser.Loader(game)
						// spineLoader.onFileComplete.add(getSoundsSpine)
						spineLoader.loadSpine(currentLoader, currentSpine, loadingFiles)
					}
				}

				if(typeof fileArray.images == "object"){
					for(var indexImage = 0; indexImage < fileArray.images.length; indexImage++){
						var currentImage = fileArray.images[indexImage]
						var file = currentImage.file
						if(file.includes("%input")) {
							var re = /%input/gi;
							file = file.replace(re, inputDevice);
							console.log("file", file)
						}
						currentLoader.image(currentImage.name, file)
					}
				}

				if(typeof fileArray.sounds == "object"){
					for(var indexSound = 0; indexSound < fileArray.sounds.length; indexSound++){
						var currentSound = fileArray.sounds[indexSound]
						currentLoader.audio(currentSound.name, currentSound.file)
					}
				}

				if(typeof fileArray.atlases == "object"){
					for(var indexAtlas = 0; indexAtlas < fileArray.atlases.length; indexAtlas++){
						var currentAtlas = fileArray.atlases[indexAtlas]
						currentLoader.atlas(currentAtlas.name, currentAtlas.image, currentAtlas.json, null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
					}
				}

				if(typeof fileArray.spritesheets == "object"){
					for(var indexSheet = 0; indexSheet < fileArray.spritesheets.length; indexSheet++){
						var currentSheet = fileArray.spritesheets[indexSheet]
						currentLoader.spritesheet(currentSheet.name, currentSheet.file, currentSheet.width, currentSheet.height, currentSheet.frames)
					}
				}

				if(typeof fileArray.particles == "object"){
					for(var indexPart = 0; indexPart < fileArray.particles.length; indexPart++){
						var currentPart = fileArray.particles[indexPart]
						epicparticles.loadEmitter(currentLoader, currentPart.name, currentPart.texture, currentPart.file)
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