
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
                file: "images/yogoSelector/dinamita.png",
            },
            {
                name: "player1",
                file: "images/yogoSelector/luna.png",
            },
            {
                name: "player2",
                file: "images/yogoSelector/nao.png",
            },
            {
                name: "player3",
                file: "images/yogoSelector/theffanie.png",
            },
            {
                name: "player4",
                file: "images/yogoSelector/eagle.png",
            },
            {
                name: "player5",
                file: "images/yogoSelector/tomiko.png",
            },
            {
                name: "player6",
                file: "images/yogoSelector/arthurius.png",
            },
            {
                name: "player7",
                file: "images/yogoSelector/estrella.png",
            },
            {
                name: "ok",
                file: "images/yogoSelector/ok.png",
            },
		],
		sounds: [
		],
        spritesheets: [
        ],
        spines:[
            {
				name:"player0",
				file:"images/spines/dinamita/dinamita.json",
                scales: ["@0.5x"],
			},
            {
				name:"player4",
				file:"images/spines/eagle/eagle.json"
			},
			/*
            {
				name:"player1",
				file:"images/spines/luna/oof.json"
			},
            {
				name:"player2",
				file:"images/spines/nao/nao.json"
			},
            {
				name:"player3",
				file:"images/spines/theffanie/normal.json"
			},
            
            {
				name:"player5",
				file:"images/spines/tomiko/tomiko.json"
			},
            {
				name:"player6",
				file:"images/spines/arthurius/arthurius.json"
			},
            {
				name:"player7",
				file:"images/spines/estrella/estrella.json"
			},*/
		]
    }

	var sceneGroup
    var tile
    var teamsBarGroup
    var buttonsGroup
    var alphaGroup
    var bravoGroup
    var readyGroup
    var currentSelect
    var team
    var auxArray = [-1, -1, -1]
    var teamPivot
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        
        loadSounds()
        currentSelect = -1
        team = 1
        teamPivot = 0
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
        tile.angle = -45
        sceneGroup.add(tile)
    }

	function update(){
        tile.tilePosition.y -= 0.2
    }

    function createTeams(){
        
        alphaGroup = game.add.group()
        sceneGroup.add(alphaGroup)
        
        bravoGroup = game.add.group()
        sceneGroup.add(bravoGroup)
        
        var pivot = 0.2
        
        for(var i = 0; i < 3; i++){
            
            var player = alphaGroup.create(game.world.centerX * pivot, game.world.centerY - 170, "player" + i)
            player.anchor.setTo(0.5)
            player.check = false
            player.alpha = 0
            
            player = bravoGroup.create(game.world.centerX * pivot + game.world.centerX, game.world.centerY - 170, "player" + i)
            player.anchor.setTo(0.5)
            player.check = false
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
            text.alpha = 0
            img.addChild(text)
            img.text = text
        }
        text.x *= -1
        text.setText("Equipo Bravo")
    }
	
    function createButtons(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivotX = 0.3
        var pivotY = 270
        var aux = 0
        var color = [2,2,1,0,1,0,1,2]

        for(var i = 0; i < 8; i++){
            
            var subGroup = game.add.group()
            subGroup.x = game.world.centerX * pivotX
            subGroup.y = game.world.height - pivotY
            subGroup.isSelected = false
            buttonsGroup.add(subGroup)
            
            var token = subGroup.create(0, 0, "atlas.yogoSelector", "token" + 0)
            token.anchor.setTo(0.5)
            token.inputEnabled = true
            token.events.onInputDown.add(pressBtn, this)
            token.tag = i
            token.canClick = false
            subGroup.token = token
            
            var light = subGroup.create(0, 55, "atlas.yogoSelector", "light" + 1)
            light.alpha = 0
            light.anchor.setTo(0.5, 1)
            subGroup.light = light
            
            var yogotar = subGroup.create(0, -40, "atlas.yogoSelector", "yogo" + i)
            yogotar.anchor.setTo(0.5)
            yogotar.alpha = 0
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
        
        buttonsGroup.children[0].yogotar.x -= 30
        buttonsGroup.children[3].yogotar.x += 10
        buttonsGroup.children[7].yogotar.x += 10
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
        
        if(btn.canClick){
            
            btn.canClick = false
            
            if(!btn.parent.isSelected){
                if(teamPivot < 3){
                    markYogotar(btn.parent, team)
                    animateButton(btn.parent, team, true)
                }
                else{
                    btn.canClick = true
                }
            }
            else{
                btn.parent.isSelected = false
                animateButton(btn.parent, 0, false)
                removeCharacter(btn.parent, team)
            }
        }
        //getReady()
    }
    
    function animateButton(obj, team, turnOn){
        
        obj.token.loadTexture("atlas.yogoSelector", "token" + team)
        game.add.tween(obj.token.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
            obj.token.canClick = true
        })
        game.add.tween(obj.yogotar.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)
        
        if(turnOn){
            obj.light.loadTexture("atlas.yogoSelector", "light" + team)
            obj.light.alpha = 1
            game.add.tween(obj.light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
        }
        else{
            obj.light.alpha = 0
            obj.isSelected = false
        }
    }
    
    function markYogotar(obj, team){
        
        restoreAll()

        currentSelect = obj.token.tag
        var currentTeam
        team === 1 ? slot = alphaGroup.children[teamPivot] : currentTeam = bravoGroup.children[teamPivot]
        //createSpine(slot.centerX, slot.centerY, "player" + obj.token.tag)

        slot.loadTexture("player" + obj.token.tag)
        if(slot.alpha === 0){
            slot.alpha = 1
            game.add.tween(slot).from({y:0}, 100, Phaser.Easing.Cubic.Out, true)
        }
    }
    
    function createSpine(x, y, character){
        
        var anim = game.add.spine(x, y, character)
        anim.setAnimationByName(0, "ready", true)
        anim.setSkinByName("dinamita")
        sceneGroup.add(anim)
        
        return anim
    }
    
    function removeCharacter(obj, team){
       
        restoreAll()

        var teamGroup
        team === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup

        var index = auxArray.indexOf(obj.token.tag)
        teamGroup.children[index].check = false
        auxArray[index] = -1
        teamPivot = auxArray.indexOf(-1) //index
        teamGroup.forEach(takeOff ,this)
    }
    
    function takeOff(obj){
        
        if(!obj.check){
            var aux = obj.y
            game.add.tween(obj).to({y: -200}, 100, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                obj.alpha = 0
                obj.y = aux
            })
        }
    }
    
    function restoreAll(){

        for(var i = 0; i < buttonsGroup.length; i++){
            
            if(!buttonsGroup.children[i].isSelected){
                buttonsGroup.children[i].token.loadTexture("atlas.yogoSelector", "token0")
                buttonsGroup.children[i].light.alpha = 0
            }
        }
        currentSelect = -1
    }
    
    function createOk(){
        
        ok = sceneGroup.create(game.world.centerX, game.world.height - 300, "ok")
        ok.anchor.setTo(0.5)
        ok.inputEnabled = true
        ok.events.onInputDown.add(clickOk,this)
    }
    
    function clickOk(btn){
        
        if(currentSelect !== -1 && teamPivot < 3 && !auxArray.includes(currentSelect)){

            game.add.tween(btn.scale).to({x: 0.5, y:0.5}, 100, Phaser.Easing.linear, true, 0, 0, true)

            buttonsGroup.children[currentSelect].isSelected = true
            auxArray[teamPivot] = currentSelect
            team === 1 ? alphaGroup.children[teamPivot].check = true : bravoGroup.children[teamPivot].check = true
            var aux = auxArray.indexOf(-1) 
            aux === -1 ? teamPivot = 3 : teamPivot = aux
            /*for(var i = 0; i < auxArray.length; i++){
                if(auxArray[i] === -1)
                    break
            }
            i < auxArray.length ? teamPivot = i : teamPivot = 2*/
        }            
    }
    
    function getReady(){
        
        readyGroup.pinkLight.alpha = 1
        game.add.tween(readyGroup.pinkLight.scale).from({x: 0}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
            readyGroup.ready.alpha = 1
            game.add.tween(readyGroup.ready.scale).from({x: 0, y:0}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function animateScene(){
        
        teamsBarGroup.forEach(function(bar){
            game.add.tween(bar.scale).from({x: 0}, 500, Phaser.Easing.Cubic.Out, true, 500).onComplete.add(function(){
                game.add.tween(bar.text).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 1000)
            })
        },this)
        
        buttonsGroup.forEach(function(btn){
            game.add.tween(btn).from({y: -150}, game.rnd.integerInRange(700, 1000), Phaser.Easing.Bounce.Out, true, 1000)
        },this)
        
        game.time.events.add(1800, function(){
            var i = 0
            var delay = 200
            while(i < 6){
                buttonsGroup.children[i].yogotar.alpha = 1
                game.add.tween(buttonsGroup.children[i].yogotar.scale).from({x: 0,y: 0}, 500, Phaser.Easing.Cubic.Out, true, delay)
                i === 1 ? i = 4 : i++
                delay += 300
            }
            
            i = 3
            delay = 200
            while(i !== 5){
                buttonsGroup.children[i].yogotar.alpha = 1
                game.add.tween(buttonsGroup.children[i].yogotar.scale).from({x: 0,y: 0}, 500, Phaser.Easing.Cubic.Out, true, delay)
                i === 2 ? i = 7 : i--
                delay += 300
            }
            
            game.time.events.add(delay, function(){
                buttonsGroup.setAll("token.canClick", true)
            })
        })
    }
    
	return {
		
		assets: assets,
		name: "yogoSelector",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()	
            initialize()
            createTeams()
            createTeamsBars()
            createButtons()
            createReady()
            createOk()
            animateScene()
            
            createSpine(game.world.centerX, game.world.centerY, "player0")
		}
	}
}()