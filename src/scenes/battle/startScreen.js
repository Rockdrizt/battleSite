
var soundsPath = "../../../shared/minigames/sounds/"

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
    

	var assets = {
        atlases: [
            {   
                name: "atlas.startScreen",
                json: settings.BASE_PATH + "/images/startScreen/atlas.json",
                image: settings.BASE_PATH + "/images/startScreen/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: settings.BASE_PATH + "/images/startScreen/bgTile.png",
            },
            {
                name: "player6",
                file: settings.BASE_PATH + "/images/startScreen/dinamita.png",
            },
            {
                name: "player7",
                file: settings.BASE_PATH + "/images/startScreen/luna.png",
            },
            {
                name: "player0",
                file: settings.BASE_PATH + "/images/startScreen/nao.png",
            },
            {
                name: "player1",
                file: settings.BASE_PATH + "/images/startScreen/theffanie.png",
            },
            {
                name: "player3",
                file: settings.BASE_PATH + "/images/startScreen/eagle.png",
            },
            {
                name: "player5",
                file: settings.BASE_PATH + "/images/startScreen/tomiko.png",
            },
            {
                name: "player4",
                file: settings.BASE_PATH + "/images/startScreen/arthurius.png",
            },
            {
                name: "player2",
                file: settings.BASE_PATH + "/images/startScreen/estrella.png",
            },
		],
		sounds: [
            {	name: "startSong",
				file: soundsPath + "songs/battleLoop.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
            {	name: "brightTransition",
                file: soundsPath + "brightTransition.mp3"},
            {	name: "cut",
                file: soundsPath + "cut.mp3"},
		],
        spritesheets: [
            
        ],
        spines:[
		],
        particles: [
			{
				name: 'bubbles',
				file: 'particles/startScreen/bubbles/Particles_hexagon.json',
				texture: 'Particles_hexagon.png'
			},
			{
				name: 'hexagonLigth',
				file: 'particles/startScreen/hexagonLigth/ligth_bottom Hexagon.json',
				texture: 'ligth_bottom Hexagon.png'
			}
		]
    }
    
	var sceneGroup
    var tile
    var yogoGroup
    var logosGroup
    var startSong
    var playBtn
    
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
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
        //tile.anchor.setTo(0.5)
        tile.tint = 0x0099AA
        //tile.angle = 45
        tile.alpha = 0
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
        
        createOkBtn()
        
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
    
    function createWhite(){
        
        white = game.add.graphics()
        white.beginFill(0xffffff)
        white.drawRect(0, 0, game.world.width, game.world.height)
        white.endFill()
        white.alpha = 0
    }
    
    function createOkBtn(){
        
        playBtn = game.add.group()
        playBtn.x = game.world.centerX - 300
        playBtn.y = game.world.centerY + 130
        logosGroup.add(playBtn)
        logosGroup.playBtn = playBtn
        
        var offBtn = playBtn.create(0, 0, "atlas.startScreen", "playBtn")
        offBtn.anchor.setTo(0.5)
        offBtn.canClick = true
        offBtn.inputEnabled = true
        offBtn.events.onInputOver.add(function(btn){
            if(btn.canClick){
                btn.alpha = 0
                btn.parent.over.alpha = 1
            }
        }, this)
        offBtn.events.onInputOut.add(function(btn){
            if(btn.canClick){
                btn.alpha = 1
                btn.parent.over.alpha = 0
            }
        }, this)
        offBtn.events.onInputDown.add(function(btn){
            if(btn.canClick){
                btn.canClick = false
                playBtn.setAll("alpha", 0)
                playBtn.onBtn.alpha = 1
            }
        }, this)
        offBtn.events.onInputUp.add(function(btn){
            sound.play("pop")
            playBtn.setAll("alpha", 0)
            playBtn.off.alpha = 1
            game.time.events.add(100, initGame)
        }, this)
        playBtn.off = offBtn
        
        var overBtn = playBtn.create(0, - 40, "atlas.startScreen", "playBtnOver")
        overBtn.anchor.setTo(0.5)
        overBtn.alpha = 0
        playBtn.over = overBtn
        
        var onBtn = playBtn.create(0, 0, "atlas.startScreen", "playBtnDown")
        onBtn.anchor.setTo(0.5)
        onBtn.alpha = 0
        playBtn.onBtn = onBtn
    }
    
    function startAnimation(){
        
        var delay = 1000
        var lastTween
        
        game.add.tween(tile).to({alpha: 1}, 500, Phaser.Easing.linear, true)
        
        for(var i = 0; i < 4; i++){
            
            lastTween = game.add.tween(yogoGroup.children[i]).from({x: - 250}, 200, Phaser.Easing.Cubic.Out, true, delay)
            game.add.tween(yogoGroup.children[i + 4]).from({x: game.world.width + 250}, 200, Phaser.Easing.Cubic.Out, true, delay)
            game.time.events.add(delay, function(){sound.play("cut")})
            delay += 250
        }
        
        lastTween.onComplete.add(function(){
            
            logosGroup.playBtn.alpha = 1
            game.add.tween(logosGroup.playBtn.scale).from({x:0, y: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){

                game.add.tween(white).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true, 0, 0, true).onComplete.add(function(){
                    logosGroup.cuantrix.alpha = 1
                    logosGroup.televisa.alpha = 1
                
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
        })
    }
    
    function initGame(){
        
        game.add.tween(sceneGroup).to({alpha: 0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
            startSong.stop()
            sceneloader.show("yogoSelector")
        })
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
            createWhite()
            startAnimation()
		},
        shutdown: function () {
            sceneGroup.destroy()
		}
	}
}()