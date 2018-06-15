
var soundsPath = "../../shared/minigames/sounds/"

var loading = function(){
    
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
                name: "atlas.loading",
                json: "images/loading/atlas.json",
                image: "images/loading/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: "images/loading/bgTile.png",
            },
            {
                name: "player0",
                file: "images/loading/dinamita.png",
            },
            {
                name: "player1",
                file: "images/loading/luna.png",
            },
            {
                name: "player2",
                file: "images/loading/nao.png",
            },
            {
                name: "player3",
                file: "images/loading/theffanie.png",
            },
            {
                name: "player4",
                file: "images/loading/eagle.png",
            },
            {
                name: "player5",
                file: "images/loading/tomiko.png",
            },
            {
                name: "player6",
                file: "images/loading/arthurius.png",
            },
            {
                name: "player7",
                file: "images/loading/estrella.png",
            },
		],
		sounds: [
		],
        spritesheets: [
            
        ],
        spines:[
		]
    }
    
	var sceneGroup
    var tile
    var VS
    var splashArtGroup
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
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
        sceneGroup.add(back)
        
        tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile")
        tile.anchor.setTo(0.5)
        tile.tint = 0x0099AA
        tile.angle = 45
        sceneGroup.add(tile)
    }

	function update(){
        tile.tilePosition.x -= 0.4
        tile.tilePosition.y -= 0.4
    }
    
    function createSplashArt(){
    
        splashArtGroup = game.add.group()
        sceneGroup.add(splashArtGroup)
        
        var pivotX = 0.25
        var aux = 1
        var pivotS = 1
        
        for(var i = 0; i < 6; i++){
            
            var container = splashArtGroup.create(game.world.centerX * pivotX, game.world.height * aux, "atlas.loading", "container" + aux)
            container.scale.setTo(0.9)
            container.anchor.setTo(0.5, aux)
            
            var splashArt = game.add.sprite(0, 0, "player" + i)
            splashArt.anchor.setTo(0.5, aux)
            container.addChild(splashArt)
            splashArtGroup.splashArt = splashArt
            
            if(i === 2){
                aux = 0
            }
           
            i === 2 ? pivotX += 0.5 : pivotX += 0.25
            
            if(pivotS === i){
                pivotS += 2
                container.scale.setTo(-0.9, 0.9)
            }
        }
        
        VS = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.loading", "vs")
        VS.anchor.setTo(0.5)
        VS.alpha = 0
    }
    
    function shake(position, periodA, periodB) {
        var x = position * Math.PI * 2 * periodA
        var y = position * (Math.PI * 2 * periodB + Math.PI / 2)

        return Math.sin(x) * Math.cos(y)
    }
    
    function startAnimation(){
        
        var delay = 500
        var aux = 0
        
        for(var i = 0; i < splashArtGroup.length; i++){
            
            var landing = game.add.tween(splashArtGroup.children[i]).from({y: game.world.height * aux}, game.rnd.integerInRange(300, 400), Phaser.Easing.Cubic.Out, true, 400)
            
            if(i === 2)
                aux = 1
        }
        
        landing.onComplete.add(function(){
            VS.alpha = 1 
            game.add.tween(VS.scale).from({x: 10, y: 10}, 400, Phaser.Easing.Cubic.Out, true)
            game.add.tween(VS).to({x: VS.x + 10}, 500, function (k) {
                return shake(k, 45, 100)
            }, true, 500, -1)
        })
    }
    
	return {
		
		assets: assets,
		name: "loading",
		//update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()	
            initialize()
            createSplashArt()
            startAnimation()
		}
	}
}()