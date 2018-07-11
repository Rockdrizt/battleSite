
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
            },
            {   
                name: "atlas.loading",
                json: "images/loading/atlas.json",
                image: "images/loading/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: "images/yogoSelector/bgTile.png",
            },
            {
                name: "ok",
                file: "images/yogoSelector/ok.png",
            }
		],
		sounds: [
            {	name: "swordSmash",
				file: soundsPath + "swordSmash.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "winBattle1",
				file: soundsPath + "winBattle1.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "gameSong",
				file: soundsPath + "songs/weLoveElectricCars.mp3"},
            {	name: "startSong",
				file: soundsPath + "songs/battleLoop.mp3"},
		],
        spritesheets: [
        ],
        spines:[
            {
				name:"tomiko",
				file:"images/spines/tomiko/tomikoSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"luna",
				file:"images/spines/luna/lunaSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"nao",
				file:"images/spines/nao/naoSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"theffanie",
				file:"images/spines/theffanie/theffanieSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"eagle",
				file:"images/spines/eagle/eagleSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"dinamita",
				file:"images/spines/dinamita/dinamitaSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"arthurius",
				file:"images/spines/arthurius/arthuriusSelector.json",
                scales: ["@0.5x"]
			},
            {
				name:"estrella",
				file:"images/spines/estrella/estrellaSelector.json",
                scales: ["@0.5x"]
			},
		],
        jsons: [
			{
				name: "sounds",
				file: "sounds/tournament.json"
			},
		],
        particles: [
			{
				name: 'horizontalLine',
				file: 'particles/horizontalLine/intence_horison_ligth.json',
				texture: 'intence_horison_ligth.png'
			},
			{
				name: 'particlesHorizontal',
				file: 'particles/particlesHorizontal/particle_horison_ligth.json',
				texture: 'particle_horison_ligth.png'
			}
		]
    }

    var gameSong
	var sceneGroup
    var teamsBarGroup
    var buttonsGroup
    var pullGroup
    var alphaGroup
    var bravoGroup
    var marker
    
    var chosenOne
    var tile
    var STATES = {yellow: 0, red: 1, blue: 2, bicolor: 3}
    var SIDE = {left: 1, rigth: -1}
    
    var loadingGroup
    var splashArtGroup
    var readyGroup
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#0D014D"
        chosenOne = 1
        
        loadSounds()
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
        game.load.bitmapFont('skwig', 'images/fonts/font.png', 'images/fonts/font.fnt')
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
    }

	function update(){
        tile.tilePosition.y -= 0.4
        tile.tilePosition.x -= 0.4
        epicparticles.update()
    }

    function createTeams(){
        
        alphaGroup = game.add.group()
        alphaGroup.teamPivot = 0
        alphaGroup.currentSelect = -1
        alphaGroup.auxArray = [-1, -1, -1]
        alphaGroup.color = STATES.red
        alphaGroup.side = SIDE.left
        sceneGroup.add(alphaGroup)
        
        bravoGroup = game.add.group()
        bravoGroup.teamPivot = 2
        bravoGroup.currentSelect = -1
        bravoGroup.auxArray = [-1, -1, -1]
        bravoGroup.color = STATES.blue
        bravoGroup.side = SIDE.rigth
        sceneGroup.add(bravoGroup)
        
        var pivotX = 0.25
        
        for(var i = 0; i < 3; i++){
            
            var player = alphaGroup.create(game.world.centerX * pivotX, game.world.centerY + 50, "atlas.yogoSelector", "star")
            player.anchor.setTo(0.5)
            player.check = false
            player.alpha = 0
            player.yogo = null
            
            player = bravoGroup.create(game.world.centerX * pivotX + game.world.centerX, game.world.centerY + 50, "atlas.yogoSelector", "star")
            player.anchor.setTo(0.5)
            player.check = false
            player.alpha = 0
            player.yogo = null
            
            pivotX += 0.25
        }
        alphaGroup.children[1].y += 120
        bravoGroup.children[1].y += 120
    }
    
    function createPullGroup(){
        
        pullGroup = game.add.group()
        sceneGroup.add(pullGroup)
        
        var aux = 0

        for(var i = 0; i < assets.spines.length * 2; i++){
            
            if(i > 0 && i % 2 == 0)
                aux++
            
            //var player = characterBattle.createCharacter(assets.spines[aux].name, assets.spines[aux].name + "1", "wait")
            var player = characterBattle.createCharacter(assets.spines[aux].name, assets.spines[aux].name + "1", "")
            player.x = 0
            player.y = -100
            player.name = assets.spines[aux].name
            player.tag = aux
            player.used = false
            pullGroup.add(player)
        }
    }
    
    function createTeamsBars(){
        
        var fontStyle = {font: "65px skwig", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        teamsBarGroup = game.add.group()
        sceneGroup.add(teamsBarGroup)
        
        for(var i = 0; i < 2; i++){
            
            var img = teamsBarGroup.create(game.world.width * i, 30, "atlas.yogoSelector", "teamBar" + i)
            img.anchor.setTo(i, 0)
            img.scale.setTo(0.8)
            
            var text = game.add.bitmapText(320, 25, 'skwig', "Equipo Alpha",75)
            
            text.anchor.setTo(0.5, 0)
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
        
        alphaGroup.marker = buttonsGroup.children[0]
        bravoGroup.marker = buttonsGroup.children[3]
    }
    
    function pressBtn(btn, team){
        
        if(btn.canClick){
            
            btn.canClick = false
            
            var teamGroup
            team === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup
            
            if(btn.parent.color === STATES.yellow){
                if(teamGroup.teamPivot < 3){
                    
                    teamGroup.marker = btn.parent
                    markYogotar(btn.parent, teamGroup)
                    
                    if(alphaGroup.marker == bravoGroup.marker){
                        animateButton(btn.parent, STATES.bicolor, true)
                    }
                    else{
                        animateButton(btn.parent, team, true)
                        team === 1 ? changeColor(bravoGroup.marker, bravoGroup.color) : changeColor(alphaGroup.marker, alphaGroup.color)
                    }
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
    
    function changeColor(obj, color){
        
        obj.token.loadTexture("atlas.yogoSelector", "token" + color)
        if(color !== 0)
            obj.light.loadTexture("atlas.yogoSelector", "light" + color)
        else{
            obj.light.alpha = 0
        }
    }
    
    function markYogotar(obj, teamGroup){
        
        restoreAll()

        var slot = teamGroup.children[teamGroup.teamPivot]
        
        if(slot.yogo == null){
            
            teamGroup.currentSelect = obj.token.tag
        
            var yogo = getYogotar(obj.token.tag)

            if(yogo){
                yogo.used = true
                yogo.x = slot.x
                yogo.y = slot.y
                yogo.scale.setTo(teamGroup.side, 1)
                slot.yogo = yogo
                game.add.tween(yogo).from({y: -100}, 200, Phaser.Easing.Cubic.Out, true)
                sound.play("swipe")
            }
        }
        else{
            slot.yogo.used = false
            if(slot.yogo.tag == 0 || slot.yogo.tag == 2) 
                slot.yogo.setAnimation(["wait"], false)
            else
                slot.yogo.setAnimation(["ready"], false)
            game.add.tween(slot.yogo).to({y: -100}, 200, Phaser.Easing.Cubic.In, true)
            slot.yogo = null
            markYogotar(obj, teamGroup)
        }
    }
    
    function getYogotar(tag){
        
        var list = []
        
        for(var i = 0; i < pullGroup.length; i++){
            
            var yogo = pullGroup.children[i]
            if(yogo.tag == tag){
                list.push(yogo)
            }
        }
        
        for(var j = 0; j < list.length; j++){
            
            if(!list[j].used){
                list[j].setAnimation(["wait"], true)
                list[j].setSkinByName(list[j].name + (j+1))
                pullGroup.bringToTop(list[j])
                return list[j]
            }
        }
    }
    
    function removeCharacter(obj, teamGroup){
       
        restoreAll()

        var index = teamGroup.auxArray.indexOf(obj.token.tag)
        teamGroup.children[index].check = false
        teamGroup.auxArray[index] = -1
        teamGroup.currentSelect = -1
        if(teamGroup == alphaGroup)
            teamGroup.teamPivot = teamGroup.auxArray.indexOf(-1) //index
        else
            teamGroup.teamPivot = teamGroup.auxArray.lastIndexOf(-1) //index
        teamGroup.forEach(takeOff ,this)
        sound.play("robotBeep")
    }
    
    function takeOff(obj){
        
        if(!obj.check){
            
            game.add.tween(obj.yogo).to({y: -100}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                obj.yogo.used = false
                if(slot.yogo.tag == 0 || slot.yogo.tag == 2) 
                    slot.yogo.setAnimation(["wait"], false)
                else
                    slot.yogo.setAnimation(["ready"], false)
                //obj.yogo.setAnimation(["wait"], false)
                obj.yogo = null
            })
        }
    }
    
    function restoreAll(){
    
        for(var i = 0; i < buttonsGroup.length; i++){
            
            var btn = buttonsGroup.children[i]
            
            if(btn != alphaGroup.marker && btn != bravoGroup.marker){
                if(btn.color === STATES.yellow){
                    btn.token.loadTexture("atlas.yogoSelector", "token0")
                    btn.light.alpha = 0
                }
                else{
                    btn.token.loadTexture("atlas.yogoSelector", "token" + btn.color)
                    btn.light.loadTexture("atlas.yogoSelector", "light" + btn.color)
                }
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
            teamGroup.children[teamGroup.teamPivot].yogo.setAnimation(["select", "ready"], true)
            if(teamGroup == alphaGroup)
                var aux = teamGroup.auxArray.indexOf(-1) //index
            else
                var aux = teamGroup.auxArray.lastIndexOf(-1) //index
            //var aux = teamGroup.auxArray.indexOf(-1) 
            aux === -1 ? teamGroup.teamPivot = 3 : teamGroup.teamPivot = aux
            
            if(alphaGroup.teamPivot == 3 && bravoGroup.teamPivot == 3){
                buttonsGroup.setAll("token.canClick", false)
                game.time.events.add(2000, getReady)
            }
        }            
    }
    
    function animateSelector(){
        
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
                game.time.events.add(delay, function(){sound.play("pop")})
                
                
                i === 2 ? i = 7 : i--
                delay += 300
            }
            
            game.time.events.add(delay, function(){
                buttonsGroup.setAll("token.canClick", true)
                //getReady()
                pressBtn(alphaGroup.marker.token, 1)
                pressBtn(bravoGroup.marker.token, 2)
            })
        })
    }    
    
    
    //···············loading screen···············//
    
    function createSplashArt(){
    
        var pivotX = 0.25
        var aux = 1
        var pivotS = 1
        var offsetY = 400
        
        var images = []
        
        for(var x = 0; x < alphaGroup.auxArray.length; x++){
            
            images[x] = alphaGroup.auxArray[x]
            images[x + 3] = bravoGroup.auxArray[x]
        }
        
        //images[0] = 0
        
        for(var i = 0; i < 6; i++){
            
            var container = game.add.sprite(0, 100 * aux, "atlas.loading", "container" + aux)
            var splash = game.add.sprite(0, offsetY, "atlas.loading", assets.spines[images[i]].name)
            
            var bmd = game.make.bitmapData(splash.width, container.height + 100)
            bmd.alphaMask(splash, container)
            
            var splashArt = game.add.image(game.world.centerX * pivotX, game.world.height * aux, bmd)
            splashArt.anchor.setTo(0.5, aux)
            splashArt.scale.setTo(0.9)
            splashArt.alpha = 0
            splashArtGroup.add(splashArt)
            
            if(i === 2){
                aux = 0
                offsetY = 150
            }
           
            i === 2 ? pivotX += 0.5 : pivotX += 0.25
            
            if(pivotS === i){
                pivotS += 2
                splashArt.scale.setTo(-0.9, 0.9)
            }
            
            container.destroy()
            splash.destroy()
        }
    }
    
    function createReady(){
        
        splashArtGroup = game.add.group()
        loadingGroup.add(splashArtGroup)
        
        readyGroup = game.add.group()
        loadingGroup.add(readyGroup)
        
        var pinkLight = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "pinkLight")
        pinkLight.alpha = 0
        pinkLight.anchor.setTo(0.5)
        readyGroup.pinkLight = pinkLight
        
        var emitter = epicparticles.newEmitter("horizontalLine")
        emitter.x = game.world.centerX
        emitter.y = game.world.centerY
        emitter.alpha = 0
        readyGroup.add(emitter)
        readyGroup.emitter = emitter
        
        var ready = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "ready")
        ready.alpha = 0
        ready.anchor.setTo(0.5)
        readyGroup.ready = ready
        
        VS = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.loading", "vs")
        VS.anchor.setTo(0.5)
        VS.alpha = 0
        readyGroup.VS = VS
    }
    
    function shake(position, periodA, periodB) {
        var x = position * Math.PI * 2 * periodA
        var y = position * (Math.PI * 2 * periodB + Math.PI / 2)

        return Math.sin(x) * Math.cos(y)
    }
    
    function getReady(){
        
        var dots = epicparticles.newEmitter("particlesHorizontal")
        dots.x = game.world.centerX
        dots.y = game.world.centerY
        
        gameSong.stop()
        readyGroup.pinkLight.alpha = 1
        readyGroup.emitter.alpha = 1
        game.add.tween(readyGroup.pinkLight.scale).from({x: 0}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
            readyGroup.ready.alpha = 1
            sound.play("swordSmash")
            game.add.tween(readyGroup.ready.scale).from({x: 0, y:0}, 200, Phaser.Easing.linear, true)
        })
        
        game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            createSplashArt()
            animateSplashArt()
        })
    }
    
    function animateSplashArt(){
        
        var delay = 500
        var aux = 0
        
        sound.play("winBattle1")
        
        for(var i = 0; i < splashArtGroup.length; i++){
            
            splashArtGroup.children[i].alpha = 1
            var landing = game.add.tween(splashArtGroup.children[i]).from({y: game.world.height * aux}, game.rnd.integerInRange(300, 400), Phaser.Easing.Cubic.Out, true, 400)
            
            if(i === 2)
                aux = 1
        }
        
        landing.onComplete.add(function(){
            game.add.tween(readyGroup.ready).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
            VS.alpha = 1 
            game.add.tween(VS.scale).from({x: 10, y: 10}, 400, Phaser.Easing.Cubic.Out, true)
            game.add.tween(VS).to({x: VS.x + 10}, 500, function (k) {
                return shake(k, 45, 100)
            }, true, 500, -1)
        })
    }
    
    function loadYogotars(){
        
        //var characters = ["tomiko", "luna", "nao", "thefannie", "eagle", "dinamita", "arthurius", "estrella"]
        var characters = ["dinamita"]
        characters.forEach(setCharacter, this)
    }
    
    function setCharacter(character) {

		var charObj = {
			name: character,
			file: "images/spines/" + character + "/" + character + "Selector.json",
			scales: ["@0.5x"]
		}
        assets.spines.push(charObj)
	}
    
	return {
		
		assets: assets,
		name: "yogoSelector",
		update: update,
        preload:preload,
		create: function(event){
            
            createBackground()
            
			sceneGroup = game.add.group()
			loadingGroup = game.add.group()
            
            initialize()
            
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
        
            createTeams()
            createPullGroup()
            createTeamsBars()
            createButtons()
            createOk()
            animateSelector()
            
            createReady()
		}
	}
}()