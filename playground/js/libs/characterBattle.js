var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var currentGame

	function addParticle(particleName){
		var assets = currentScene.assets

		assets.particles = assets.particles || []
		assets.particles.push({
			name:particleName,
			file
		})
	}

	function addProjectile(id){
		var projectileDat = currentGame.cache.getJSON(id + "Data")

		if(projectileDat.particles){
			for(var particleIndex = 0; particleIndex < projectileDat.particles.length; particleIndex++){
				var particleName = p
			}
		}
	}

	function addSpine(character) {
		var assets = currentScene.assets

		assets.spines = assets.spines || []
		assets.spines.push({
			name:character,
			file:spineFile,
			data:data
		})
	}

	function loadProjectileData(id) {
		currentLoader.json(id + "Data", "data/projectiles/" + id + ".json")
		loadingFiles[id + "Data"] = {onComplete:addProjectile.bind(null, id)}
	}

	function loadProjectilesData(characterName, characterData) {
		var assets = currentScene.assets

		if(typeof characterData.attacks === "undefined")
			return

		for(var key in characterData.attacks){

			var attacks = characterData.attacks[key]

			for(var attackIndex = 0; attackIndex < attacks.length; attackIndex++){
				var id = attacks[attackIndex].id
				loadProjectileData(id)
			}
		}
	}

	function loadCharacter(loader, character, scene, files, game) {

		currentScene = scene
		currentLoader = loader
		loadingFiles = files
		currentGame = game

		loader.json(character.name + "Data", character.file)
		loadingFiles[character.name + "Data"] = {onComplete:function(){
			var characterData = game.cache.getJSON(character + "Data")
			addSpine(character.name, characterData)
			loadProjectilesData(character.name, characterData)
		}}

	}

	return {
		loadCharacter:loadCharacter
	}
}()