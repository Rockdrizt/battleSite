
var soundsPath = "../../shared/minigames/sounds/"

var startScreen = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.startScreen",
                json: "images/startScreen/atlas.json",
                image: "images/startScreen/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: "images/startScreen/bgTile.png",
            },
            {
                name: "player6",
                file: "images/startScreen/dinamita.png",
            },
            {
                name: "player7",
                file: "images/startScreen/luna.png",
            },
            {
                name: "player0",
                file: "images/startScreen/nao.png",
            },
            {
                name: "player1",
                file: "images/startScreen/theffanie.png",
            },
            {
                name: "player3",
                file: "images/startScreen/eagle.png",
            },
            {
                name: "player5",
                file: "images/startScreen/tomiko.png",
            },
            {
                name: "player4",
                file: "images/startScreen/arthurius.png",
            },
            {
                name: "player2",
                file: "images/startScreen/estrella.png",
            },
		],
		sounds: [
		],
        spritesheets: [
            
        ],
        spines:[
		],
        particles: [
			{
				name: 'bubbles',
				file: 'particles/bubbles/Particles_hexagon.json',
				texture: 'Particles_hexagon.png'
			},
			{
				name: 'hexagonLigth',
				file: 'particles/hexagonLigth/ligth_bottom Hexagon.json',
				texture: 'ligth_bottom Hexagon.png'
			}
		]
    }
    
	var sceneGroup
    var tile
    var yogoGroup
    var logosGroup
    var startSong
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#0D014D"
        loadSounds()
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
    }
    
	function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height)
        var back = bmd.addToWorld()

        var y = 0

        for (var i = 0; i < bmd.height; i++)
        {
            var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

            bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
            y += 2
        }
        //sceneGroup.add(back)
        
        tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile")
        tile.anchor.setTo(0.5)
        tile.tint = 0x0099AA
        tile.angle = 45
        //sceneGroup.add(tile)
    }

	function update(){
        tile.tilePosition.y -= 0.4
        epicparticles.update()
    }
    
    function createYogotars(){
    
        yogoGroup = game.add.group()
        sceneGroup.add(yogoGroup)
        
        var pivotX = 200
        var pivotY = 0.35
        
        for(var i = 0; i < 8; i++){
            
            var player = yogoGroup.create(200 + pivotX, game.world.centerY * pivotY, "player" + i)
            player.anchor.setTo(0.5)
            player.scale.setTo(0.9)
            
            pivotY += 0.4
            
            if(i < 3)
                i % 2 == 0 ? pivotX = 0 : pivotX = 150
            else
                i % 2 == 0 ? pivotX = game.world.width - 370 : pivotX = game.world.width - 550
            
            if(i === 3){
                pivotY = 0.35
                player.y += 50
            }
        }
        player.y += 50
    }
    
    function createLogos(){
        
        logosGroup = game.add.group()
        sceneGroup.add(logosGroup)
        
        var cuantrix = logosGroup.create(game.world.centerX, 300, "atlas.startScreen", "cuantrix")
        cuantrix.anchor.setTo(0.5)
        logosGroup.cuantrix = cuantrix
        
        var board = logosGroup.create(game.world.centerX - 400, game.world.centerY + 145, "atlas.startScreen", "board")
        board.anchor.setTo(0, 0.5)
        logosGroup.board = board
        
        var playBtn = logosGroup.create(game.world.centerX - 300, game.world.centerY + 130, "atlas.startScreen", "playBtn")
        playBtn.anchor.setTo(0.5)
        playBtn.canClick = true
        playBtn.inputEnabled = true
        playBtn.events.onInputDown.add(initGame, this)
        logosGroup.playBtn = playBtn
        
        var televisa = logosGroup.create(game.world.centerX, game.world.height - 50, "atlas.startScreen", "televisa")
        televisa.anchor.setTo(0.5, 1)
        logosGroup.televisa = televisa
        
        logosGroup.setAll("alpha", 0)
        playBtn.inputEnabled = false
        
        var mask = game.add.graphics(board.x, board.y - board.height * 0.5)
        mask.beginFill(0xFF33ff)
        mask.drawRect(0, 0, board.width, board.height)
        logosGroup.add(mask)
        logosGroup.boardMask = mask        
        board.mask = mask
    }
    
    function startAnimation(){
        
        var delay = 500
        var lastTween
        
        for(var i = 0; i < 4; i++){
            
            lastTween = game.add.tween(yogoGroup.children[i]).from({x: - 250}, 200, Phaser.Easing.Cubic.Out, true, delay)
            game.add.tween(yogoGroup.children[i + 4]).from({x: game.world.width + 250}, 200, Phaser.Easing.Cubic.Out, true, delay)
            game.time.events.add(delay, function(){sound.play("cut")})
            delay += 250
        }
        
        lastTween.onComplete.add(function(){
            
            logosGroup.cuantrix.alpha = 1
            var logo1 = game.add.tween(logosGroup.cuantrix.scale).from({x:0, y:0}, 300, Phaser.Easing.Cubic.In, true)
            sound.play("swipe")
            var logo2 = game.add.tween(logosGroup.televisa).to({alpha:1}, 500, Phaser.Easing.Cubic.In, false)
            
            logo2.onComplete.add(function(){
                
                logosGroup.playBtn.alpha = 1
                game.add.tween(logosGroup.playBtn.scale).from({x:0, y: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                    
                    var emitter = epicparticles.newEmitter("hexagonLigth")
                    emitter.x = logosGroup.playBtn.x
                    emitter.y = logosGroup.playBtn.y
                    game.add.tween(emitter).to({x:game.world.centerX + 270}, 500, Phaser.Easing.Cubic.In, true)
                     
                    game.add.tween(logosGroup.playBtn).to({x:game.world.centerX + 270}, 500, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                        
                        emitter = epicparticles.newEmitter("bubbles")
                        emitter.x = logosGroup.playBtn.x
                        emitter.y = logosGroup.playBtn.y
                        
                        logosGroup.playBtn.inputEnabled = true
                    })
                    
                    logosGroup.board.alpha = 1
                    sound.play("brightTransition")
                    game.add.tween(logosGroup.boardMask.scale).from({x: 0}, 500, Phaser.Easing.Cubic.In, true)
                })
            })
            
            logo1.chain(logo2)
        })
    }
    
    function initGame(btn){
        
        if(btn.canClick){
            
            btn.canClick = false
            sound.play("pop")
            game.add.tween(btn.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
                sceneloader.show("yogoSelector")
                startSong.stop()
            })
        }
    }
    
	return {
		
		assets: assets,
		name: "startScreen",
		update: update,
        preload:preload,
		create: function(event){
            
            createBackground()	
            
			sceneGroup = game.add.group()
			
            initialize()
            
            startSong = sound.play("startSong", {loop:true, volume:0.6})
            
            createYogotars()
            createLogos()
            startAnimation()
		}
	}
}()