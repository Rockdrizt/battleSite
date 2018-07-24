var epicProjectiles = function(){
	var currentScene

	function removeProjectile() {
		var projectile = this
		if(projectile.particles) {
			for (var particleIndex = 0; particleIndex < projectile.particles.length; particleIndex++) {
				var particle = projectile.particles[particleIndex]
				particle.remove()
			}
		}

		projectile.destroy()
	}

	function stopProjectile(){
		var projectile = this

		if(projectile.particles) {
			for (var particleIndex = 0; particleIndex < projectile.particles.length; particleIndex++) {
				var particle = projectile.particles[particleIndex]
				particle.stop()
			}
		}

		if(projectile.spines){
			for(var spineIndex = 0; spineIndex < projectile.spines.length; spineIndex++){
				var spine = projectile.spines[spineIndex]
				spine.remove()
			}
		}
	}

	function hitEnemy(options) {
		var projectile = this
		var enemy = options.enemy
		var onImpact = options.onImpact

		var impactData = projectile.data.impact
		if (impactData) {
			var x = enemy.impactPoint.x
			var y = enemy.impactPoint.y

			if (impactData.particles) {
				var particleGroup = game.add.group()
				for (var particleIndex = 0; particleIndex < impactData.particles.length; particleIndex++) {
					var particleFile = impactData.particles[particleIndex]
					var particleName = particleFile.substr(particleFile.lastIndexOf('/') + 1);
					var index = particleName.indexOf(".");
					particleName = particleName.substring(0, index)

					var emitter = epicparticles.newEmitter(particleName)
					particleGroup.add(emitter)
				}

				particleGroup.x = x
				particleGroup.y = y
				projectile.parent.add(particleGroup)
			}

			if(impactData.spines){
				var spines = impactData.spines
				projectile.spines = []
				var spinesGroup = game.add.group()

				for(var spineIndex = 0; spineIndex < spines.length; spineIndex++){
					var spineData = spines[spineIndex]
					var file = spineData.file
					var spineSkeleton = file.substr(file.lastIndexOf('/') + 1);
					var index = spineSkeleton.indexOf(".");

					spineSkeleton = spineSkeleton.substring(0, index)
					var spineGroup = spineLoader.createSpine(spineSkeleton, spineData.skin, "idle")
					spineGroup.data = spineData

					var onShootAnimations = spineData.animations
					spineGroup.setAnimation(onShootAnimations, false, spineGroup.remove)

					spinesGroup.add(spineGroup)
				}

				spinesGroup.x = x
				spinesGroup.y = y
				projectile.parent.add(spinesGroup)
			}

			if (impactData.soundID)
				sound.play(impactData.soundID)
		}

		if(enemy.prevPoint)
			enemy.impactPoint = enemy.prevPoint
		enemy.takeDamage(projectile.type, projectile.element)

		if(typeof onImpact === "function")
			onImpact()
	}

	function setTarget(enemy, options) {
		var self = this
		var impactData = self.data.impact
		options = options || {}
		var onImpact = options.onImpact

		if((impactData)&&(impactData.forcePosition)){
			var x = enemy.impactPoint.x
			var y = enemy.impactPoint.y

			if (impactData.forcePosition.x) {
				x = impactData.forcePosition.x
				y = impactData.forcePosition.y
			}
			else if (impactData.forcePosition.offsetX) {
				x = enemy.x + impactData.forcePosition.offsetX * self.scale.x
				y = enemy.y + impactData.forcePosition.offsetY * self.scale.y
			}
			else if(impactData.forcePosition.attachment){
				var slot = enemy.getSlotByAttachment(impactData.forcePosition.attachment)
				x = enemy.x + slot.x * self.scale.x
				y = enemy.y + slot.y * self.scale.y
			}

			enemy.prevPoint = {
				x: enemy.impactPoint.x,
				y: enemy.impactPoint.y
			}
			enemy.impactPoint.x = x
			enemy.impactPoint.y = y
		}

		if(self.data.spines){
			var spines = self.data.spines
			self.spines = []

			for(var spineIndex = 0; spineIndex < spines.length; spineIndex++){
				var spineData = spines[spineIndex]
				var file = spineData.file
				var spineSkeleton = file.substr(file.lastIndexOf('/') + 1);
				var index = spineSkeleton.indexOf(".");

				spineSkeleton = spineSkeleton.substring(0, index)
				var spineGroup = spineLoader.createSpine(spineSkeleton, spineData.skin, "idle")
				spineGroup.data = spineData

				var onShootAnimations = spineData.animations
				spineGroup.setAnimation(onShootAnimations, false)

				self.add(spineGroup)
				self.spines.push(spineGroup)
			}
		}

		if(self.data.particles){
			var particles = self.data.particles
			self.particles = []

			for(var particleIndex = 0; particleIndex < particles.length; particleIndex++){
				var particleFile = particles[particleIndex]
				var particleName = particleFile.substr(particleFile.lastIndexOf('/') + 1);
				var index = particleName.indexOf(".");
				particleName = particleName.substring(0, index)

				var emitter = epicparticles.newEmitter(particleName, {group:self})
				self.particles.push(emitter)
			}
		}

		game.time.events.add(self.data.timing.removal, removeProjectile, self)
		game.time.events.add(self.data.timing.stop, stopProjectile, self)

		//TODO: here goes the damage
		var params = {
			enemy: enemy,
			onImpact: onImpact
		}

		if(self.hit)
			game.time.events.add(self.data.timing.hit, hitEnemy, self, params)

		if(self.data.onShoot)
			scripts.run(self.data.onShoot, {self:self, target:enemy})

		var stage = self.parent
		if ((self.data.stageParticles) && (self.data.stageParticles.length > 0)){
			for (var index = 0; index < self.data.stageParticles.length; index++){
				var stageData = self.data.stageParticles[index]

				game.time.events.add(stageData.delay, function(data){
					var particleGroup = game.add.group()

					for(var particleIndex = 0; particleIndex < data.length; particleIndex++) {
						var particleFile = particles[particleIndex]
						var particleName = particleFile.substr(particleFile.lastIndexOf('/') + 1);
						var index = particleName.indexOf(".");
						particleName = particleName.substring(0, index)

						var emitter = epicparticles.newEmitter(particleName)
						particleGroup.add(emitter)
					}

					particleGroup.y = data.y || 0

					if (data.position === "relative") {
						var diffX = self.x - enemy.x
						particleGroup.x = self.x - diffX * data.x
						particleGroup.y = self.y
					}
					else
						particleGroup.x = data.x || 0

					stage.add(particleGroup)
				}, stageData)
			}
		}

		if ((self.data.sounds) && (self.data.sounds > 0)){
			for (var index = 0; index < self.data.sounds.length; index++){
				var dataSound = self.data.sounds[index]

				game.time.events.add(dataSound.delay, function(data) {
					sound.play(data.soundID)
				}, null, dataSound)
			}
		}

		//return projectile
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

	function addSpine(spineInfo) {
		var assets = currentScene.assets

		assets.spines = assets.spines || []
		assets.spines.push({
			name:spineInfo.name,
			file:spineInfo.file,
			scales:spineInfo.scales
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
			addSpine(spine)
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

		if(projectileDat.impact.spines){
			extractSpines(projectileDat.spines)
		}

		if(projectileDat.impact.soundID){
			extractSound(projectileDat.impact.soundID)
		}
	}

	function loadProjectileData(id, currentLoader, loadingFiles, scene) {
		currentScene = scene
		currentLoader.json(id + "Data", "data/projectiles/" + id + ".json")
		loadingFiles[id + "Data"] = {onComplete:addProjectile.bind(null, id)}
	}

	return{
		new:function (projectileData, options) {
			var projectile = game.add.group()

			projectile.data = projectileData
			projectile.setTarget = setTarget.bind(projectile)
			projectile.element = options.element
			projectile.type = options.type
			projectile.hit = options.hit

			return projectile
		},
		load:loadProjectileData
	}
}()