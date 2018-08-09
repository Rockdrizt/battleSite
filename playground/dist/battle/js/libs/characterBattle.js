var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var game

	function updatePosition() {
		this.spine.setToSetupPose()
		this.spine.updateTransform()

		var impactSlot = this.getSlotContainer(this.data.visuals.impactAttachment)
		this.impactPoint = {
			x:impactSlot.x + this.x * this.scale.x,
			y:impactSlot.y + this.y * this.scale.y
		}
	}

	function attack(enemy, type, onImpact) {
		var self = this

		var attackType = type || "normal"
		var attacks = self.data.attacks[attackType]
		var element = self.data.stats.element

		self.setAnimation(["attack_" + type, "idle_normal"], true)
		console.log(enemy.impactPoint)

		if(typeof attacks === "undefined") {
			console.warn("Attack " + attackType + " is not defined.")
			return
		}

		for(var projectileIndex = 0; projectileIndex < attacks.length; projectileIndex++){
			var projectileInfo = attacks[projectileIndex]

			game.time.events.add(projectileInfo.delay, function (info) {
				var projectileData = game.cache.getJSON(info.id + "Data")

				var options = {
					element:element,
					type:type,
					hit: typeof info.hit === "undefined" ? true : info.hit
				}
				var projectile = epicProjectiles.new(projectileData, options)
				var slot = self.getSlotByAttachment(info.attachment)
				projectile.x = self.x + slot.x * self.scale.x
				projectile.y = self.y + slot.y * self.scale.y
				projectile.scale.x *= self.scale.x
				self.parent.add(projectile)

				projectile.setTarget(enemy, {onImpact : onImpact})
			}, null, projectileInfo)
		}

	}

	function createCharacter(charName, skin, position) {
		var characterData = game.cache.getJSON(charName + "Data")
		var nameLowerCase = characterData.name.toLowerCase()

		var character = spineLoader.createSpine(charName, skin, "idle_normal", 0, 0, true)
		character.x = position.x; character.y = position.y
		character.data = characterData

		character.takeDamage = takeDamage.bind(character)
		character.attack = attack.bind(character)
		character.updatePosition = updatePosition.bind(character)
		character.updatePosition()

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

	function takeDamage(type, element) {
		var self = this

		var animationName = "hit_" + type
		if(type === "ultra")
			animationName = animationName + "_" + element

		self.setAnimation([animationName, "idle_normal"], true)
	}

	return {
		loadCharacter:loadCharacter,
		createCharacter:createCharacter
	}
}()