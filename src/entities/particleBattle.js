var particleBattle = function () {

	var particles = {}

	function drawParticle(group, offsetX, offsetY, zindex, particleName) {
		if((particles[particleName])&&(particles[particleName].duration < 0)) {
			return
		}

		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		emitter.x = offsetX//group.scale.x > 0 ? offsetX : offsetX * -1
		emitter.y = offsetY
		emitter.scale.x = group.scale.x
		if (zindex === "back")
			group.add(emitter, false, 0)
		else
			group.add(emitter)

		particles[particleName] = emitter
	}

	function drawParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		if((particles[particleName])&&(particles[particleName].duration < 0)) {
			return
		}

		var slot = character.getSlotByAttachment(attachmentName)
		if(typeof slot === "undefined"){
			console.warn(attachmentName + " attachment not found")
			return
		}

		var emitter = epicparticles.newEmitter(particleName)
		if (!emitter)
			return

		if(emitter.absolute) {
			emitter.x = character.scale.x > 0 ? slot.x : slot.x * -1
			emitter.y = slot.y
			console.log("cord", slot.x, slot.y)
			character.add(emitter)
		}
		else {
			slot.add(emitter)
		}
		emitter.scale.x = character.scale.x

		particles[particleName] = emitter
		console.log(emitter.duration)
	}

	function removeParticleCharacter(character, params) {
		var attachmentName = params[0]
		var particleName = params[1]

		//var slot = character.getSlotByAttachment(attachmentName)
		console.log(particles)
		var emitter = particles[particleName]
		if(!emitter)
			return

		emitter.remove()
	}

	function removeParticle(particleName) {
		var emitter = particles[particleName]
		delete particles[particleName]
		if(!emitter)
			return

		emitter.remove()
	}

	return {
		drawParticle:drawParticle,
		drawParticleCharacter:drawParticleCharacter,
		removeParticle:removeParticle,
		removeParticleCharacter:removeParticleCharacter
	}
}()