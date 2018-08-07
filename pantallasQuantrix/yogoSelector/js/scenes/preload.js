var preloaderIntro = function(){

	var assets = {
		atlases: [{
				name: "logoAtlas",
				json: "images/preload/atlas.json",
				image: "images/preload/atlas.png"
			}],
		images: [            
            { 
                name:'tile',
                file: "images/preload/bgTile.png"},
            { 
                name:'spiner',
                file: "images/preload/spiner.png"}
        ],
		sounds: [

		],
	}

	var loadingBar = null
    var spiner

	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			
            if(spiner){
                var loadingAmount = loadedFiles / totalFiles
                spiner.text.setText(loadingAmount.toPrecision() * 100)
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
            
            var tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile")
            tile.anchor.setTo(0.5)
            tile.tint = 0x0099AA
            tile.angle = 45
            sceneGroup.add(tile)

            spiner = sceneGroup.create(game.world.centerX, game.world.centerY, 'logoAtlas', 'spiner')
			spiner.anchor.setTo(0.5)
            
            var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
            var text = new Phaser.Text(sceneGroup.game, spiner.x, spiner.y, "0", fontStyle)
            text.anchor.setTo(0.5)
            sceneGroup.add(text)
            spiner.text = text
            
            var spin = game.add.tween(spiner).to({angle: -360}, 1000, Phaser.Easing.linear, true)
            spin.repeat(-1)
		},
	}
}()