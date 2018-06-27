
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
                file: "images/yogoSelector/tomiko.png",
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
                file: "images/yogoSelector/dinamita.png",
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
            }
		],
		sounds: [
		],
        spritesheets: [
        ],
        spines:[
            {
				name:"eagle",
				file:"images/spines/eagle/eagle.json",
                scales: ["@0.5x"]
			},
            {
				name:"dinamita",
				file:"images/spines/dinamita/dinamita.json",
                scales: ["@0.5x"]
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
    var pullGroup
    var alphaGroup
    var bravoGroup
    var readyGroup
    var chosenOne
    var STATES = {yellow: 0, red: 1, blue: 2, bicolor: 3}
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        chosenOne = 1
        
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
        tile.angle = -45
        sceneGroup.add(tile)
    }

	function update(){
        tile.tilePosition.y -= 0.4
    }

    function createTeams(){
        
        alphaGroup = game.add.group()
        alphaGroup.teamPivot = 0
        alphaGroup.currentSelect = -1
        alphaGroup.auxArray = [-1, -1, -1]
        alphaGroup.color = STATES.red
        sceneGroup.add(alphaGroup)
        
        bravoGroup = game.add.group()
        bravoGroup.teamPivot = 2
        bravoGroup.currentSelect = -1
        bravoGroup.auxArray = [-1, -1, -1]
        bravoGroup.color = STATES.blue
        sceneGroup.add(bravoGroup)
        
        var pivotX = 0.3
        
        for(var i = 0; i < 3; i++){
            
            var player = alphaGroup.create(game.world.centerX * pivotX, game.world.centerY + 90, "atlas.yogoSelector", "star")
            player.anchor.setTo(0.5)
            player.check = false
            player.alpha = 0
            
            player = bravoGroup.create(game.world.centerX * pivotX + game.world.centerX, game.world.centerY + 90, "atlas.yogoSelector", "star")
            player.anchor.setTo(0.5)
            player.check = false
            player.alpha = 0
            
            pivotX += 0.2
        }
        alphaGroup.children[1].y += 150
        bravoGroup.children[1].y += 150
    }
    
    function createPullGroup(){
        
        pullGroup = game.add.group()
        sceneGroup.add(pullGroup)
        
        console.log(assets.spines.length)
        
        for(var i = 0; i < 3/*assets.spines.length*/; i++){
            
            var player = game.add.spine(alphaGroup.children[i].centerX, 0, assets.spines[0].name)
            player.setAnimationByName(0, "wait", true)
            player.setSkinByName(assets.spines[0].name)
            player.name = assets.spines[0].name
            pullGroup.add(player)
        }
        //wait   select     ready
        
        for(var i = 0; i < 3/*assets.spines.length*/; i++){
            
            var player = game.add.spine(bravoGroup.children[i].centerX, 0, assets.spines[1].name)
            player.setAnimationByName(0, "wait", true)
            player.setSkinByName(assets.spines[1].name)
            player.scale.setTo(-1, 1)
            player.name = assets.spines[1].name
            pullGroup.add(player)
        }
    }
    
    function createSpine(x, y, character, anim, skin){
        
        x = x || 0
		y = y || 0
        anim = anim || "idle"
        skin = skin || "normal"
        
        var player = game.add.spine(x, y, character)
        player.setAnimationByName(0, anim, true)
        player.setSkinByName(skin)
        sceneGroup.add(player)
        
        return player
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

        for(var i = 0; i < 8; i++){
            
            var subGroup = game.add.group()
            subGroup.x = game.world.centerX * pivotX
            subGroup.y = game.world.height - pivotY
            subGroup.color = STATES.yellow
            buttonsGroup.add(subGroup)
            
            var token = subGroup.create(0, 0, "atlas.yogoSelector", "token" + 0)
            token.anchor.setTo(0.5)
            token.inputEnabled = true
            token.events.onInputDown.add(function(btn){
                
                //chosenOne = catch team input
                pressBtn(btn, chosenOne)
            }, this)
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
    
    function pressBtn(btn, team){
        
        if(btn.canClick){
            
            btn.canClick = false
            
            var teamGroup
            team === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup
            
            if(btn.parent.color === STATES.yellow){        
                if(teamGroup.teamPivot < 3){
                    markYogotar(btn.parent, teamGroup)
                    animateButton(btn.parent, team, true)
                }
                else{
                    btn.canClick = true
                }
            }
            else{
                
                switch(btn.parent.color){
                        
                    case STATES.red:
                        if(team === STATES.red){
                            animateButton(btn.parent, STATES.yellow, false)
                            removeCharacter(btn.parent, alphaGroup)
                        }
                        else{
                            if(bravoGroup.teamPivot < 3){
                                markYogotar(btn.parent, bravoGroup)
                                animateButton(btn.parent, STATES.bicolor, true)
                            }
                            else{
                                btn.canClick = true
                            }
                        }
                    break
                    
                    case STATES.blue:
                        if(team === STATES.blue){
                            animateButton(btn.parent, STATES.yellow, false)
                            removeCharacter(btn.parent, bravoGroup)
                        }
                        else{
                            if(alphaGroup.teamPivot < 3){
                                markYogotar(btn.parent, alphaGroup)
                                animateButton(btn.parent, STATES.bicolor, true)
                            }
                            else{
                                btn.canClick = true
                            }
                        }
                    break
                    
                    case STATES.bicolor:
                        if(team === STATES.red){
                            btn.parent.color = STATES.blue
                            animateButton(btn.parent, STATES.blue, true)
                            removeCharacter(btn.parent, alphaGroup)
                        }
                        else{
                            btn.parent.color = STATES.red
                            animateButton(btn.parent, STATES.red, true)
                            removeCharacter(btn.parent, bravoGroup)
                        }
                    break
                }
            }
        }
        //getReady()
    }
    
    function animateButton(obj, color, turnOn){
        
        obj.token.loadTexture("atlas.yogoSelector", "token" + color)
        game.add.tween(obj.token.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
            obj.token.canClick = true
        })
        game.add.tween(obj.yogotar.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)
        
        if(turnOn){
            obj.light.loadTexture("atlas.yogoSelector", "light" + color)
            obj.light.alpha = 1
            game.add.tween(obj.light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
        }
        else{
            obj.light.alpha = 0
            obj.color = color
        }
    }
    
    function markYogotar(obj, teamGroup){
        
        restoreAll()

        teamGroup.currentSelect = obj.token.tag
        var slot = teamGroup.children[teamGroup.teamPivot]

        slot.loadTexture("player" + obj.token.tag)
        if(slot.alpha === 0){
            slot.alpha = 1
            game.add.tween(slot).from({y:0}, 100, Phaser.Easing.Cubic.Out, true)
        }
    }
    
    function selectYogotar(obj, teamGroup){
        
        teamGroup.currentSelect = obj.token.tag
        pullGroup.children[obj.token.tag - 4].x = teamGroup.children[teamGroup.teamPivot].centerX
        game.add.tween(pullGroup.children[obj.token.tag - 4]).to({y: teamGroup.children[teamGroup.teamPivot].y}, 100, Phaser.Easing.Cubic.Out, true)
    }
    
    function removeCharacter(obj, teamGroup){
       
        restoreAll()

        var index = teamGroup.auxArray.indexOf(obj.token.tag)
        teamGroup.children[index].check = false
        teamGroup.auxArray[index] = -1
        teamGroup.currentSelect = -1
        teamGroup.teamPivot = teamGroup.auxArray.indexOf(-1) //index
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
            
            var btn = buttonsGroup.children[i]
            
            if(btn.color === STATES.yellow){
                btn.token.loadTexture("atlas.yogoSelector", "token0")
                btn.light.alpha = 0
            }
            else{
                btn.token.loadTexture("atlas.yogoSelector", "token" + btn.color)
                btn.light.loadTexture("atlas.yogoSelector", "light" + btn.color)
            }
            
            /*if(!alphaGroup.auxArray.includes(btn.token.tag)){
                if(!bravoGroup.auxArray.includes(btn.token.tag)){
                    btn.token.loadTexture("atlas.yogoSelector", "token0")
                    btn.light.alpha = 0
                }
            }*/
        }
    }
    
    function createOk(){
        
        var ok = sceneGroup.create(game.world.centerX - 100, game.world.height - 300, "ok")
        ok.anchor.setTo(0.5)
        ok.tint = 0xff0000
        ok.tag = 1
        ok.inputEnabled = true
        ok.events.onInputDown.add(clickOk,this)
        
        var ok = sceneGroup.create(game.world.centerX + 100, game.world.height - 300, "ok")
        ok.anchor.setTo(0.5)
        ok.tint = 0x0000ff
        ok.tag = 2
        ok.inputEnabled = true
        ok.events.onInputDown.add(clickOk,this)
        
        var ok = sceneGroup.create(game.world.centerX, game.world.height - 300, "atlas.yogoSelector", "star")
        ok.anchor.setTo(0.5)
        ok.inputEnabled = true
        ok.events.onInputDown.add(function(){
            
            chosenOne === 1 ? chosenOne = 2 : chosenOne = 1
            
        },this)
    }
    
    function clickOk(btn){
        
        var teamGroup
        btn.tag === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup
        
        if(teamGroup.currentSelect !== -1 && teamGroup.teamPivot < 3 && !teamGroup.auxArray.includes(teamGroup.currentSelect)){

            game.add.tween(btn.scale).to({x: 0.5, y:0.5}, 100, Phaser.Easing.linear, true, 0, 0, true)

            buttonsGroup.children[teamGroup.currentSelect].color += teamGroup.color
            teamGroup.auxArray[teamGroup.teamPivot] = teamGroup.currentSelect
            teamGroup.children[teamGroup.teamPivot].check = true
            var aux = teamGroup.auxArray.indexOf(-1) 
            aux === -1 ? teamGroup.teamPivot = 3 : teamGroup.teamPivot = aux
            
            //pullGroup.children[0].remove()
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
            createPullGroup()
            createTeamsBars()
            createButtons()
            createReady()
            createOk()
            animateScene()
		}
	}
}()