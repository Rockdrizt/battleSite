var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var game

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
				var spineGroup = spineLoader.createSpine(spineSkeleton, spine.skin, "idle")
				spineGroup.data = spine

				projectile.add(spineGroup)
				projectile.spines.push(spineGroup)
			}
		}

		if(projectileData.particles){
			var particles = projectileData.particles
			projectile.particles = []

			for(var particleIndex = 0; particleIndex < particles.length; particleIndex++){
				var particleFile = particles[particleIndex]
				var particleName = particleFile.substr(particleFile.lastIndexOf('/') + 1);
				var index = particleName.indexOf(".");
				particleName = particleName.substring(0, index)

				particleBattle.drawParticle(projectile, 0, 0, null, particleName)

				projectile.particles.push(particleName)
			}
		}
		
		game.time.events.add(projectileData.timing.removal, function () {
			if(projectile.particles){
				for(var particleIndex = 0; particleIndex < projectile.particles.length; particleIndex++){
					var particleName = projectile.particles[particleIndex]
					particleBattle.removeParticle(particleName)
				}
			}

			if(projectile.spines){
				for(var spineIndex = 0; spineIndex < projectile.particles.length; spineIndex++){
					var spine = projectile.spines[particleIndex]

					projectile.remove(spine)
				}
			}

		})

		projectile.data = projectileData

		return projectile
	}

	function attack(character, enemy, type) {
		var attackType = type || "normal"
		var attacks = character.data.attacks[attackType]
		character.setAnimation(["attack_normal", "idle_normal"], true)
		console.log(enemy.impactPoint)

		for(var projectileIndex = 0; projectileIndex < attacks.length; projectileIndex++){
			var projectileInfo = attacks[projectileIndex]
			var projectileData = game.cache.getJSON(projectileInfo.id + "Data")

			game.time.events.add(projectileInfo.delay, function () {
				var projectile = createProjectile(projectileData)

				var slot = character.getSlotByAttachment(projectileInfo.attachment)
				projectile.x = character.x + slot.x
				projectile.y = character.y + slot.y
				character.parent.add(projectile)

				if(projectile.spines) {
					for(var projectileIndex = 0; projectileIndex < projectile.spines.length; projectileIndex++){
						var spineGroup = projectile.spines[projectileIndex]
						var onShootAnimations = spineGroup.data.onShootAnimations

						spineGroup.setAnimation(onShootAnimations, true)
					}
				}

				scripts.run(projectile.data.onShoot, {self:projectile, target:enemy})
			})
		}


		//return projectile
	}

	function createCharacter(charName, position) {
		var characterData = game.cache.getJSON(charName + "Data")
		var nameLowerCase = characterData.name.toLowerCase()

		var character = spineLoader.createSpine(charName, nameLowerCase + "1", "run", 0, 0, true)
		character.x = position.x; character.y = position.y
		character.data = characterData
		var impactSlot = character.getSlotByAttachment(characterData.visuals.impactAttachment)
		character.impactPoint = {
			x:impactSlot.x + character.x,
			y:impactSlot.y + character.y
		}

		return character
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
		attack:attack
	}
}()