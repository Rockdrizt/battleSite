var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var game
	var projectilesData = {}

	function createProjectile(projectileData) {
		var projectile = game.add.group()

		if(projectileData.spines){
			var spines = projectileData.spines
			projectile.spines = []

			for(var spineIndex = 0; spineIndex < spines.length; spineIndex++){
				var spine = spines[spineIndex]
				var file = spine.file
				var spineSkeleton = file.substr(file.lastIndexOf('/') + 1);
				var index = spineSkeleton.indexOf(".");

				spineSkeleton = spineSkeleton.substring(0, index)
				var spineGroup = spineLoader.createSpine(spineSkeleton, spine.skin, "in_ultra")
				spineGroup.data = spine

				console.log(spineGroup.spine)
				projectile.add(spineGroup)

				projectile.spines.push(spineGroup)
			}
		}

		projectile.data = projectileData

		return projectile
	}

	function attackUltra(character) {
		var ultra = character.data.attacks.ultra[0]

		var ultraProjectile = projectilesData[ultra.id]
		var projectile = createProjectile(ultraProjectile)

		character.setAnimation(["attack_ultra"], false)
		game.time.events.add(ultra.delay, function () {
			projectile.alpha = 1
			projectile.x = slot.x + character.x
			projectile.y = slot.y + character.y

			if(projectile.spines) {
				for(var projectileIndex = 0; projectileIndex < projectile.spines.length; projectileIndex++){
					var spineGroup = projectile.spines[projectileIndex]
					var onShootAnimations = spineGroup.data.onShootAnimations

					spineGroup.setAnimation(onShootAnimations, true)
				}
			}
		})

		var slot = character.getSlotByAttachment(ultra.attachment)
		console.log("slot", slot.x, slot.y)
		projectile.alpha = 0

		return projectile
	}

	function createCharacter(charName, skin, animation) {

		return spineLoader.createSpine(charName, skin, animation, 0, 0, true)
	}

	function extractSound(soundID) {
		var soundsList = game.cache.getJSON('sounds')
		var assetsSounds = currentScene.assets.sounds

		assetsSounds.push({
			name:soundID,
			file: soundsList[soundID]
		})
	}

	function addParticle(particlePath){

		var particleName = particlePath.substr(particlePath.lastIndexOf('/') + 1);
		particleName = particleName.replace(".json/i", "");
		var index = particleName.indexOf(".");
		particleName = particleName.substring(0, index)

		var assets = currentScene.assets

		assets.particles = assets.particles || []
		assets.particles.push({
			name:particleName,
			file:particlePath,
			texture: particleName + ".png"
		})
	}

	function extractParticles(particles) {
		for(var particleIndex = 0; particleIndex < particles.length; particleIndex++){
			var particlePath = particles[particleIndex]
			addParticle(particlePath)
		}
	}

	function extractSpines(spines) {
		for(var spineIndex = 0; spineIndex < spines.length; spineIndex++){
			var spine = spines[spineIndex]
			var file = spine.file
			var name = file.substr(file.lastIndexOf('/') + 1);
			var index = name.indexOf(".");
			name = name.substring(0, index)

			spine.name = name
			spineLoader.loadSpine(currentLoader, spine, loadingFiles, currentScene)
		}
	}

	function addProjectile(id){
		var projectileDat = game.cache.getJSON(id + "Data")
		projectilesData[id] = projectileDat

		if(projectileDat.particles){
			extractParticles(projectileDat.particles)
		}

		if(projectileDat.impact.particles){
			extractParticles(projectileDat.impact.particles)
		}

		if(projectileDat.spines){
			extractSpines(projectileDat.spines)
		}

		if(projectileDat.impact.soundID){
			extractSound(projectileDat.impact.soundID)
		}
	}

	function addSpine(character, data) {
		var assets = currentScene.assets

		assets.spines = assets.spines || []
		assets.spines.push({
			name:character.name,
			file:data.directory,
			scales:character.scales,
			data:data
		})
	}

	function loadProjectileData(id) {
		currentLoader.json(id + "Data", "data/projectiles/" + id + ".json")
		loadingFiles[id + "Data"] = {onComplete:addProjectile.bind(null, id)}
	}

	function loadProjectilesData(characterName, characterData) {

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

	function loadCharacter(loader, character, battleScene, files, currentGame) {

		currentScene = battleScene
		currentLoader = loader
		loadingFiles = files
		game = currentGame

		loader.json(character.name + "Data", character.file)
		loadingFiles[character.name + "Data"] = {onComplete:function(){
				var characterData = game.cache.getJSON(character.name + "Data")
				addSpine(character, characterData)
				character.data = characterData
				loadProjectilesData(character.name, characterData)
			}}

	}

	return {
		loadCharacter:loadCharacter,
		createCharacter:createCharacter,
		getProjectiles:function () {
			return projectilesData
		},
		attackUltra:attackUltra
	}
}()