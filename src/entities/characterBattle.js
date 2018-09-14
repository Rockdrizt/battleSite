var characterBattle = function () {

	var currentScene
	var loadingFiles
	var currentLoader
	var game

	function updateImpactPoint() {
		this.spine.setToSetupPose()
		this.spine.updateTransform()

		var impactSlot = this.getSlotContainer(this.data.visuals.impactAttachment)
		this.impactPoint = {
			x:this.x + impactSlot.x * this.scale.x,
			y:this.y + impactSlot.y * this.scale.y
		}
	}

	function attack(enemy, type, onImpact) {
		var self = this

		var attackType = type || "normal"
		var attacks
		if(self.data.attacks.skins){
			if(!self.data.attacks.skins[self.skin]) {
				console.warn("Attack from skin " + self.skin + " not found")
				return
			}
			attacks = self.data.attacks.skins[self.skin][attackType]

		} else {
			attacks = self.data.attacks[attackType]
		}

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

				projectile.setTarget(enemy, {onImpact : onImpact, skin : self.skin})
			}, null, projectileInfo)
		}

	}

	function createCharacter(charName, skin, position) {
		var characterData = game.cache.getJSON(charName + "Data")
		var nameLowerCase = characterData.name.toLowerCase()

		var character = spineLoader.createSpine(charName, skin, "idle_normal", 0, 0, true)
		character.x = position.x; character.y = position.y
		character.data = characterData
		character.skin = skin

		character.takeDamage = takeDamage.bind(character)
		character.attack = attack.bind(character)
		character.updateImpactPoint = updateImpactPoint.bind(character)

		return character
	}

	function addSpine(character, data) {
		var assets = currentScene.assets

		assets.spines = assets.spines || []
		assets.spines.push({
			name:character.name,
			file:settings.BASE_PATH + data.directory,
			scales:character.scales,
			data:data
		})
	}

	function loadProjectilesData(character, characterData) {
		var characterName = character.name

		if(typeof characterData.attacks === "undefined")
			return

		var attacks
		if(characterData.attacks.skins){
			if(!characterData.attacks.skins[character.skin]) {
				console.warn("Attack from skin " + character.skin + " not found")
				return
			}
			attacks = characterData.attacks.skins[character.skin]

		} else {
			attacks = characterData.attacks
		}

		for(var type in attacks){
			var attacksInType = attacks[type]

			for(var attackIndex = 0; attackIndex < attacksInType.length; attackIndex++){
				var id = attacksInType[attackIndex].id
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
				loadProjectilesData(character, characterData)
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