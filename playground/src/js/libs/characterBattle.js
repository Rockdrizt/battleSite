var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var game

	function attack(character, enemy, type) {
		var attackType = type || "normal"
		var attacks = character.data.attacks[attackType]
		character.setAnimation(["attack_normal", "idle_normal"], true)
		console.log(enemy.impactPoint)

		for(var projectileIndex = 0; projectileIndex < attacks.length; projectileIndex++){
			var projectileInfo = attacks[projectileIndex]

			game.time.events.add(projectileInfo.delay, function () {
				var projectileData = game.cache.getJSON(projectileInfo.id + "Data")

				var projectile = epicProjectiles.new(projectileData)
				var slot = character.getSlotByAttachment(projectileInfo.attachment)
				projectile.x = character.x + slot.x * character.scale.x
				projectile.y = character.y + slot.y * character.scale.y
				character.parent.add(projectile)

				projectile.setTarget(enemy)
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

	function loadProjectilesData(characterName, characterData) {

		if(typeof characterData.attacks === "undefined")
			return

		for(var key in characterData.attacks){

			var attacks = characterData.attacks[key]

			for(var attackIndex = 0; attackIndex < attacks.length; attackIndex++){
				var id = attacks[attackIndex].id
				epicProjectiles.load(id, currentLoader, loadingFiles, currentScene)
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