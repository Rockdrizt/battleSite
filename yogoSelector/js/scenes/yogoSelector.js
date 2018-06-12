
var soundsPath = "../../shared/minigames/sounds/"

var yogoSelector = function(){
    
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
                name: "atlas.yogoSelector",
                json: "images/yogoSelector/atlas.json",
                image: "images/yogoSelector/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: "images/yogoSelector/bgTile.png",
            },
            {
                name: "player0",
                file: "images/yogoSelector/player0.png",
            },
            {
                name: "player1",
                file: "images/yogoSelector/player1.png",
            },
            {
                name: "player2",
                file: "images/yogoSelector/player2.png",
            },
            {
                name: "player3",
                file: "images/yogoSelector/player3.png",
            },
            {
                name: "player4",
                file: "images/yogoSelector/player4.png",
            },
            {
                name: "player5",
                file: "images/yogoSelector/player5.png",
            },
            {
                name: "player6",
                file: "images/yogoSelector/player6.png",
            },
            {
                name: "player7",
                file: "images/yogoSelector/player7.png",
            },
            
		],
		sounds: [
		],
        spritesheets: [
            
        ],
        spines:[
			/*{
				name:"ardilla",
				file:"images/spines/skeleton.json"
			}*/
		]
    }

	var sceneGroup
    var teamsBarGroup
    var yogoGroup
    var alphaGroup
    var bravoGroup
    var readyGroup
    var counter
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        
        loadSounds()
        
        counter = 0
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
    }
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
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
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
        tile.tint = 0x0099AA
        sceneGroup.add(tile)
    }

	function update(){
        tile.tilePosition.y -= 0.2
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100)
        particle.makeParticles('atlas.yogoSelector',key)
        particle.minParticleSpeed.setTo(-200, -50)
        particle.maxParticleSpeed.setTo(200, -100)
        particle.minParticleScale = 0.3
        particle.maxParticleScale = .8
        particle.gravity = 150
        particle.angularDrag = 30
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(){
        
        /*particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)*/
    }
    
    function createYogotars(){
        
        alphaGroup = game.add.group()
        sceneGroup.add(alphaGroup)
        
        bravoGroup = game.add.group()
        sceneGroup.add(bravoGroup)
        
        var pivot = 0.2
        
        for(var i = 0; i < 3; i++){
            
            var player = alphaGroup.create(game.world.centerX * pivot, game.world.centerY - 170, "player" + i)
            player.anchor.setTo(0.5)
            player.alpha = 0
            
            player = bravoGroup.create(game.world.centerX * pivot + game.world.centerX, game.world.centerY - 170, "player" + i)
            player.anchor.setTo(0.5)
            player.alpha = 0
            
            pivot += 0.3
        }
        alphaGroup.children[1].y += 150
        bravoGroup.children[1].y += 150
    }
    
    function createTeamsBars(){
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        teamsBarGroup = game.add.group()
        sceneGroup.add(teamsBarGroup)
        
        for(var i = 0; i < 2; i++){
            
            var img = teamsBarGroup.create(game.world.width * i, 30, "atlas.yogoSelector", "teamBar" + i)
            img.anchor.setTo(i, 0)
            img.scale.setTo(0.8)
            
            var text = new Phaser.Text(sceneGroup.game, 320, 25, "Equipo Alpha", fontStyle)
            text.anchor.setTo(0.5, 0)
            text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15)
            img.addChild(text)
            img.text = text
        }
        text.x *= -1
        text.setText("Equipo Bravo")
    }
	
    function createSelector(){
        
        yogoGroup = game.add.group()
        sceneGroup.add(yogoGroup)
        
        var pivotX = 0.3
        var pivotY = 270
        var aux = 0
        var color = [2,2,1,0,1,0,1,2]

        for(var i = 0; i < 8; i++){
            
            var subGroup = game.add.group()
            subGroup.x = game.world.centerX * pivotX
            subGroup.y = game.world.height - pivotY
            subGroup.canClick = true
            yogoGroup.add(subGroup)
            
            var token = subGroup.create(0, 0, "atlas.yogoSelector", "token" + 0)
            token.anchor.setTo(0.5)
            token.inputEnabled = true
            token.events.onInputDown.add(pressBtn, this)
            token.tag = i
            subGroup.token = token
            
            var light = subGroup.create(0, 55, "atlas.yogoSelector", "light" + 1)
            light.alpha = 0
            light.anchor.setTo(0.5, 1)
            subGroup.light = light
            
            var yogotar = subGroup.create(0, -40, "atlas.yogoSelector", "yogo" + i)
            yogotar.anchor.setTo(0.5)
            subGroup.yogotar = yogotar
            
            if(i < 4)
                aux == 1 ? pivotX += 0.6 : pivotX += 0.4
            else
                aux == 1 ? pivotX += 0.3 : pivotX += 0.35
            
            aux++
            
            if(i === 3){
                pivotY = 130
                pivotX = 0.5
                aux = 0
            }
        }
        
        yogoGroup.children[3].yogotar.x += 10
        yogoGroup.children[5].yogotar.x -= 30
        yogoGroup.children[7].yogotar.x += 10
    }
    
    function createReady(){
        
        readyGroup = game.add.group()
        sceneGroup.add(readyGroup)
        
        var pinkLight = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "pinkLight")
        pinkLight.alpha = 0
        pinkLight.anchor.setTo(0.5)
        readyGroup.pinkLight = pinkLight
        
        var ready = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "ready")
        ready.alpha = 0
        ready.anchor.setTo(0.5)
        readyGroup.ready = ready
    }
    
    function pressBtn(btn){
        
        chooseCharacter(2, btn.tag)
        //getReady()
    }
    
    function chooseCharacter(team, tag){
        
        if(yogoGroup.children[tag].canClick && counter < 3){
            
            yogoGroup.children[tag].canClick = false
            
            yogoGroup.children[tag].token.loadTexture("atlas.yogoSelector", "token" + team)
            game.add.tween(yogoGroup.children[tag].token.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
                yogoGroup.children[tag].canClick = true
            })

            yogoGroup.children[tag].light.loadTexture("atlas.yogoSelector", "light" + team)
            yogoGroup.children[tag].light.alpha = 1
            game.add.tween(yogoGroup.children[tag].light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
            
            game.add.tween(yogoGroup.children[tag].yogotar.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)
            
            //if(counter < 3){
                var yogotar
                team === 1 ? yogotar = bravoGroup.children[counter] : yogotar = alphaGroup.children[counter]
                /*if(team === 1){
                    var yogotar = bravoGroup.children[counter]
                }
                else{
                    var yogotar = alphaGroup.children[counter]
                
                }*/
        
                yogotar.loadTexture("player" + tag)
                yogotar.alpha = 1
                game.add.tween(yogotar).from({y:0}, 100, Phaser.Easing.Cubic.Out, true)
                counter++
            //}
        }
    }
    
    function getReady(){
        
        readyGroup.pinkLight.alpha = 1
        game.add.tween(readyGroup.pinkLight.scale).from({x: 0}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
            readyGroup.ready.alpha = 1
            game.add.tween(readyGroup.ready.scale).from({x: 0, y:0}, 200, Phaser.Easing.linear, true)
            //game.add.tween(readyGroup.ready).from({y:readyGroup.ready.y - 30}, 500, Phaser.Easing.linear, true)
        })
    }
    
	return {
		
		assets: assets,
		name: "yogoSelector",
		//update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()	
            initialize()
            //createParticles()
            createYogotars()
            createTeamsBars()
            createSelector()
            createReady()
		}
	}
}()