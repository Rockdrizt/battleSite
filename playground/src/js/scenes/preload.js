var preloaderIntro = function(){

	var assets = {
		atlases: [{
				name: "logoAtlas",
				json: "images/preload/atlas.json",
				image: "images/preload/atlas.png"
			}],
		images: [            

        ],
		sounds: [

		]
	}

    var spiner
    var pinkLight
    
	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			
            if(spiner){
                var loadingAmount = loadedFiles / totalFiles
                var total = loadingAmount.toFixed(2).substr(2)
                spiner.text.setText(total)
                
                if(loadingAmount >= 0.5 && pinkLight.show){
                    pinkLight.show = false
                    game.add.tween(pinkLight.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Cubic.In, true, 0, 0, true)
                }
            }
		},

		create: function(event){

			var sceneGroup = game.add.group()
            
            var bmd = game.add.bitmapData(game.world.width, game.world.height)
            var back = bmd.addToWorld()

            var y = 0

            for (var i = 0; i < bmd.height; i++)
            {
                var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

                bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
                y += 2
            }
            sceneGroup.add(back)
            
            var particle = game.add.emitter(game.world.centerX, game.world.centerY - 100, 100);
            particle.makeParticles("logoAtlas", "star");
            particle.minParticleSpeed.setTo(-200, -50);
            particle.maxParticleSpeed.setTo(200, 300);
            particle.minParticleScale = 0.5;
            particle.maxParticleScale = 1;
            particle.gravity = 100;
            particle.angularDrag = 30;
            particle.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.In)
            particle.width = 500
            sceneGroup.add(particle)
            particle.start(false, 5000, 20, 100)
            
            pinkLight = sceneGroup.create(game.world.centerX, game.world.centerY, "logoAtlas", "pinkLight")
            pinkLight.anchor.setTo(0.5)
            pinkLight.scale.setTo(0)
            pinkLight.show = true

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