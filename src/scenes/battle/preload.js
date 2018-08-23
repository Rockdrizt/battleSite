var preloaderIntro = function(){

	var assets = {
		atlases: [{
				name: "logoAtlas",
				json: settings.BASE_PATH + "/images/preload/atlas.json",
				image: settings.BASE_PATH + "/images/preload/atlas.png"
			}],
		
	}

    var spiner
    var pinkLight
    var sceneGroup
    
	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			
            if(spiner){
                var loadingAmount = loadedFiles / totalFiles
                var total = loadingAmount.toFixed(2).substr(2)
                spiner.text.setText(total)
            }
		},
        onComplete: function(scene){
            
            spiner.text.setText(100)
            
            var shutDown = game.add.tween(sceneGroup).to({alpha: 0}, 200, Phaser.Easing.Cubic.In, false)
            shutDown.onComplete.add(function(){
                sceneloader.show(scene)
            })
            
            game.add.tween(pinkLight.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Cubic.In, true, 0, 0, true).chain(shutDown)
        },

		create: function(event){
            
            var bmd = game.add.bitmapData(game.world.width, game.world.height)
            var back = bmd.addToWorld()

            var y = 0

            for (var i = 0; i < bmd.height; i++)
            {
                var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

                bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
                y += 2
            }
            
            sceneGroup = game.add.group()
            
            var particle = game.add.emitter(game.world.centerX, game.world.centerY, 100);
            particle.makeParticles("logoAtlas", "dot");
            particle.minParticleSpeed.setTo(-200, -200);
            particle.maxParticleSpeed.setTo(200, 200);
            particle.minParticleScale = 1;
            particle.maxParticleScale = 2;
            particle.setAlpha(0.35, 0, 1000, Phaser.Easing.Cubic.In)
            particle.width = 800
            sceneGroup.add(particle)
            particle.start(false, 3000, 50, 0)
            
            pinkLight = sceneGroup.create(game.world.centerX, game.world.centerY, "logoAtlas", "pink")
            pinkLight.anchor.setTo(0.5)
            pinkLight.scale.setTo(0)
            pinkLight.part = particle

            spiner = sceneGroup.create(game.world.centerX, game.world.centerY, 'logoAtlas', 'spiner')
			spiner.anchor.setTo(0.5)
            
            var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
            var text = new Phaser.Text(sceneGroup.game, spiner.x, spiner.y, "0", fontStyle)
            text.anchor.setTo(0.5)
            sceneGroup.add(text)
            spiner.text = text
            
            var spin = game.add.tween(spiner).to({angle: -360}, 2000, Phaser.Easing.linear, true)
            spin.repeat(-1)
		},
	}
}()