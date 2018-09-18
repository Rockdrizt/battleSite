
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
	var bootFiles = {
		jsons: [
			{
				name: "sounds",
				file: settings.BASE_PATH + "/data/sounds/tournament.json"
			},
		],
	}

	var assets = {
		atlases: [
			{
				name: "atlas.yogoSelector",
				json: settings.BASE_PATH + "/images/yogoSelector/atlas.json",
				image: settings.BASE_PATH + "/images/yogoSelector/atlas.png",
			}
		],
		images: [
			{
				name: "tile",
				file: settings.BASE_PATH + "/images/yogoSelector/bgTile.png",
			},
			{
				name: "ok",
				file: settings.BASE_PATH + "/images/yogoSelector/ok.png",
			},
			{
				name: "vs",
				file: settings.BASE_PATH + "/images/loading/vs.png",
			}
		],
		sounds: [
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
			{	name: "shineSpell",
				file: settings.BASE_PATH + "/sounds/sounds/shineSpell.wav"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "lightUp",
				file: settings.BASE_PATH + "/sounds/sounds/lightUp.wav"},
			{	name: "gameSong", 
				file: settings.BASE_PATH + "/sounds/songs/selector.mp3"},
            {	name: "tomiko",
				file: settings.BASE_PATH + "/sounds/selectorNames/tomiko.mp3"},
            {	name: "luna",
				file: settings.BASE_PATH + "/sounds/selectorNames/luna.mp3"},
            {	name: "nao",
				file: settings.BASE_PATH + "/sounds/selectorNames/nao.mp3"},
            {	name: "theffanie",
				file: settings.BASE_PATH + "/sounds/selectorNames/theffanie.mp3"},
            {	name: "eagle",
				file: settings.BASE_PATH + "/sounds/selectorNames/eagle.mp3"},
            {	name: "dinamita",
				file: settings.BASE_PATH + "/sounds/selectorNames/dinamita.mp3"},
            {	name: "arthurius",
				file: settings.BASE_PATH + "/sounds/selectorNames/arthurius.mp3"},
            {	name: "estrella",
				file: settings.BASE_PATH + "/sounds/selectorNames/estrella.mp3"},
		],
		spritesheets: [
		],
		spines:[
			{
				name:"lava",
				file:settings.BASE_PATH + "/spines/yogotars/selector/lava/skeleton.json",
				//scales: ["@0.5x"]
			}
		],
		particles: [
			{
				name: 'horizontalLine',
				file: settings.BASE_PATH + '/particles/startScreen/horizontalLine/intence_horison_ligth.json',
				texture: 'intence_horison_ligth.png'
			},
			{
				name: 'particlesHorizontal',
				file: settings.BASE_PATH + '/particles/startScreen/particlesHorizontal/particle_horison_ligth.json',
				texture: 'particle_horison_ligth.png'
			}
		]
	}

	var YOGOTARS_LIST = [
		{
			name:"tomiko",
			file:settings.BASE_PATH + "/spines/yogotars/selector/tomiko/tomikoSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"luna",
			file:settings.BASE_PATH + "/spines/yogotars/selector/luna/lunaSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"nao",
			file:settings.BASE_PATH + "/spines/yogotars/selector/nao/naoSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"theffanie",
			file:settings.BASE_PATH + "/spines/yogotars/selector/theffanie/theffanieSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"eagle",
			file:settings.BASE_PATH + "/spines/yogotars/selector/eagle/eagleSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"dinamita",
			file:settings.BASE_PATH + "/spines/yogotars/selector/dinamita/dinamitaSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"arthurius",
			file:settings.BASE_PATH + "/spines/yogotars/selector/arthurius/arthuriusSelector.json",
			scales: ["@0.5x"]
		},
		{
			name:"estrella",
			file:settings.BASE_PATH + "/spines/yogotars/selector/estrella/estrellaSelector.json",
			scales: ["@0.5x"]
		},
	]
	
	assets.spines = assets.spines.concat(YOGOTARS_LIST)

	var gameSong
	var sceneGroup
	var teamsBarGroup
    var platformGroup
	var buttonsGroup
	var pullGroup
	var alphaGroup
	var bravoGroup
	var barCompleteFlag
	var timerFlag

	var chosenOne
	var tile
	var STATES = {yellow: 0, red: 1, blue: 2, bicolor: 3}
	var SIDE = {left: 1, rigth: -1}
	var NUM_PLAYERS_EACH = 3

	var SIDES = {
		LEFT:{direction: -1, scale:{x:1}},
		RIGHT:{direction: 1, scale:{x:-1}},
	}
	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]

	var loadingGroup
	var splashArtGroup
	var selectorGroup
	var readyGroup
	var playersSelected
	var bmd
	var tokens

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
        
		game.stage.backgroundColor = "#0D014D"
		chosenOne = 1
		playersSelected = []
		tokens = {}

		loadSounds()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
		game.load.bitmapFont('skwig', settings.BASE_PATH + '/fonts/font.png', settings.BASE_PATH + '/fonts/font.fnt')
	}

	function createBackground(){

		bmd = game.add.bitmapData(game.world.width, game.world.height)
		
		var back = bmd.addToWorld()
		//sceneGroup.add(back)

		var y = 0

		for (var i = 0; i < bmd.height; i++)
		{
			var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

			bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
			y += 2
		}

		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
		tile.tint = 0x0099AA
        tile.alpha = 0
		//sceneGroup.add(tile)
	}

	function update(){
		tile.tilePosition.y -= 0.4
		epicparticles.update()
	}
    
    function createPlatforms(){
        
        platformGroup = game.add.group()
        selectorGroup.add(platformGroup)
        
        var pivotX = 0.25
        
        for(var i = 0; i < 3; i++){
            
            var plat = platformGroup.create(game.world.centerX * pivotX, game.world.centerY + 50, "atlas.yogoSelector", "plat1")
            plat.anchor.setTo(0.5)
            
            var plat = platformGroup.create(game.world.centerX * pivotX  + game.world.centerX, game.world.centerY + 50, "atlas.yogoSelector", "plat2")
            plat.anchor.setTo(0.5)
            
            pivotX += 0.25
        }
        
        platformGroup.children[2].y += 100
        platformGroup.children[3].y += 100
    }

	function createTeams(){

		alphaGroup = game.add.group()
		alphaGroup.teamPivot = 0
		alphaGroup.currentSelect = -1
		alphaGroup.auxArray = [-1, -1, -1]
		alphaGroup.slots = [{x:0, y:0, yogo:null, check: false},
			{x:0, y:0, yogo:null, check: false},
			{x:0, y:0, yogo:null, check: false}]
		alphaGroup.color = STATES.red
		alphaGroup.side = SIDE.left
		selectorGroup.add(alphaGroup)

		bravoGroup = game.add.group()
		bravoGroup.teamPivot = 2
		bravoGroup.currentSelect = -1
		bravoGroup.auxArray = [-1, -1, -1]
		bravoGroup.slots = [{x:0, y:0, yogo:null, check: false},
			{x:0, y:0, yogo:null, check: false},
			{x:0, y:0, yogo:null, check: false}]
		bravoGroup.color = STATES.blue
		bravoGroup.side = SIDE.rigth
		selectorGroup.add(bravoGroup)

		var pivotX = 0.25

		for(var i = 0; i < 3; i++){

			alphaGroup.slots[i].x = game.world.centerX * pivotX
			alphaGroup.slots[i].y = game.world.centerY + 50
			alphaGroup.slots[i].yogo = null

			bravoGroup.slots[i].x = game.world.centerX * pivotX + game.world.centerX
			bravoGroup.slots[i].y = game.world.centerY + 50
			bravoGroup.slots[i].yogo = null

			pivotX += 0.25
		}
		alphaGroup.slots[1].y += 100
		bravoGroup.slots[1].y += 100
	}

	function createPullGroup(){

		pullGroup = game.add.group()
		sceneGroup.add(pullGroup)

		var aux = 0
		var skinNum = 1

		for(var i = 0; i < YOGOTARS_LIST.length * 2; i++){

			var player = spineLoader.createSpine(YOGOTARS_LIST[aux].name, YOGOTARS_LIST[aux].name + skinNum, "wait", 0, 0, true)
			player.x = 0
			player.y = -100
			player.name = YOGOTARS_LIST[aux].name
			player.tag = aux
			player.used = false
			player.skin = YOGOTARS_LIST[aux].name + skinNum
			player.setAlive(false)
			pullGroup.add(player)

			aux = i - aux
			skinNum = i % 2 ? 1 : 2
		}
	}

	function createTeamsBars(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		teamsBarGroup = game.add.group()
		selectorGroup.add(teamsBarGroup)

		for(var i = 0; i < 2; i++){

			var img = teamsBarGroup.create(game.world.width * i, 30, "atlas.yogoSelector", "teamBar" + (i+1))
			img.anchor.setTo(i, 0)
			img.scale.setTo(0.8)

			var teamName = new Phaser.Text(teamsBarGroup.game, 320, 25, "Equipo Alpha", fontStyle)
            teamName.anchor.setTo(0.5, 0)
            teamName.stroke = "#000066"
			teamName.strokeThickness = 10
			teamName.alpha = 0
			img.addChild(teamName)
			img.text = teamName

		}
		teamName.x *= -1
		teamName.setText("Equipo Bravo")
	}

	/*NOTES:
		function could be a little bit shorter but is ok
		positions are hardcoded, what happen if you have more of 8 positions?
		8 need to be a constant named NUM_YOGOTARS
		not a big issue because probably with more yogotars is going to change positions
		if that is the case you should use positions as constants as well
	*/
	function createButtons(){

		buttonsGroup = game.add.group()
		selectorGroup.add(buttonsGroup)

		var pivotX = 0.35
		var pivotY = 270
		var aux = 0

		for(var i = 0; i < YOGOTARS_LIST.length; i++){

			var subGroup = game.add.group()
			subGroup.x = game.world.centerX * pivotX
			subGroup.y = game.world.height - pivotY
			subGroup.color = STATES.yellow
			buttonsGroup.add(subGroup)

			var token = subGroup.create(0, 0, "atlas.yogoSelector", "token" + 0)
			token.anchor.setTo(0.5)
			// token.inputEnabled = true
			// token.events.onInputDown.add(function(btn){

			// 	//chosenOne = catch team input
			// 	pressBtn(btn, chosenOne)
			// }, this)
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
				aux == 1 ? pivotX += 0.7 : pivotX += 0.3
			else
				aux == 1 ? pivotX += 0.4 : pivotX += 0.3

			aux++

			if(i === 3){
				pivotY = 130
				pivotX = 0.5
				aux = 0
			}

			var yogotarName = YOGOTARS_LIST[i].name
			tokens[yogotarName] = token
		}

		buttonsGroup.children[0].yogotar.x -= 30
		buttonsGroup.children[3].yogotar.x += 10
		buttonsGroup.children[7].yogotar.x += 10

		alphaGroup.marker = buttonsGroup.children[0]
		bravoGroup.marker = buttonsGroup.children[3]
	}
    
    function createYogoNames(){
        
        namesGroup = game.add.group()
        selectorGroup.add(namesGroup)
        
        var light = namesGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "pinkLight")
        light.anchor.setTo(0.5)
        light.scale.setTo(0)
        namesGroup.light = light
        
        var yogoName = namesGroup.create(light.x, light.y, "atlas.yogoSelector", "name0")
        yogoName.anchor.setTo(0.5)
        yogoName.alpha = 0
        namesGroup.yogoName = yogoName
    }

	function pressBtn(btn, team){
		if(btn.canClick){

			btn.canClick = false

			var teamGroup
			team === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup
			teamGroup.marker = btn.parent

			if(btn.parent.color === STATES.yellow){
				if(teamGroup.teamPivot < 3){

					markYogotar(btn.parent, teamGroup)

					if(alphaGroup.marker == bravoGroup.marker){
						animateButton(btn.parent, STATES.bicolor)
					}
					else{
						animateButton(btn.parent, team)
						changeColor()
					}
				}
				else{
					btn.canClick = true
                    teamGroup.marker = null
				}
			}
			else{

				switch(btn.parent.color){

					case STATES.red:
						if(team === STATES.red){
							removeCharacter(btn.parent, alphaGroup)
							changeButton(btn.parent, STATES.yellow)
							animateButton(btn.parent, STATES.yellow)
							changeColor()
						}
						else{
							if(bravoGroup.teamPivot < 3){
								markYogotar(btn.parent, bravoGroup)
								animateButton(btn.parent, STATES.bicolor)
							}
							else{
								btn.canClick = true
							}
						}
						break

					case STATES.blue:
						if(team === STATES.blue){
							removeCharacter(btn.parent, bravoGroup)
							changeButton(btn.parent, STATES.yellow)
							animateButton(btn.parent, STATES.yellow)
							changeColor()
						}
						else{
							if(alphaGroup.teamPivot < 3){
								markYogotar(btn.parent, alphaGroup)
								animateButton(btn.parent, STATES.bicolor)
							}
							else{
								btn.canClick = true
							}
						}
						break

					case STATES.bicolor:

						if(team === STATES.red){
							btn.parent.color = STATES.blue
							animateButton(btn.parent, STATES.blue)
							removeCharacter(btn.parent, alphaGroup)
						}
						else{
							btn.parent.color = STATES.red
							animateButton(btn.parent, STATES.red)
							removeCharacter(btn.parent, bravoGroup)
						}
						break
				}
			}
		}
	}

	function animateButton(obj, color){

		obj.token.loadTexture("atlas.yogoSelector", "token" + color)
		game.add.tween(obj.token.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
			obj.token.canClick = true
		})
		game.add.tween(obj.yogotar.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)

		if(obj.light.alpha == 1){
			obj.light.loadTexture("atlas.yogoSelector", "light" + obj.color)
		}

		/*if(turnOn){
			obj.light.loadTexture("atlas.yogoSelector", "light" + color)
			obj.light.alpha = 1
			game.add.tween(obj.light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
		}
		else{
			obj.light.alpha = 0
			obj.color = color
		}*/
	}

	function changeButton(btn, numTeam){
		if(btn.color === STATES.bicolor){
			if(numTeam === STATES.red) {
				btn.color = STATES.blue
				animateButton(btn, STATES.blue)
			}else{
				btn.color = STATES.red
				animateButton(btn, STATES.red)
			}
		}else{
			btn.light.alpha = 0
			btn.color = STATES.yellow
		}
	}

	function changeColor(){

		if(bravoGroup.marker != null){
			if(bravoGroup.marker.color == STATES.yellow)
				bravoGroup.marker.token.loadTexture("atlas.yogoSelector", "token" + bravoGroup.color)
			else
				bravoGroup.marker.token.loadTexture("atlas.yogoSelector", "token" + STATES.bicolor)
		}

		if(alphaGroup.marker != null){
			if(alphaGroup.marker.color == STATES.yellow)
				alphaGroup.marker.token.loadTexture("atlas.yogoSelector", "token" + alphaGroup.color)
			else
				alphaGroup.marker.token.loadTexture("atlas.yogoSelector", "token" + STATES.bicolor)
		}
	}

	function markYogotar(obj, teamGroup){

		var slot = teamGroup.slots[teamGroup.teamPivot]

		if(slot.yogo == null){
			restoreAll()
			teamGroup.currentSelect = obj.token.tag

			var yogo = getYogotar(obj.token.tag)

			if(yogo){
				pullGroup.remove(yogo)
				teamGroup.add(yogo)
				teamGroup.teamPivot == 1 ? teamGroup.bringToTop(yogo) : teamGroup.sendToBack(yogo)
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
			game.add.tween(slot.yogo).to({y: -100}, 200, Phaser.Easing.Cubic.In, true)
			slot.yogo.setAlive(false)
			slot.yogo.used = false
			teamGroup.remove(slot.yogo)
			pullGroup.add(slot.yogo)
			slot.yogo = null
			markYogotar(obj, teamGroup)
		}
	}

	function getYogotar(tag){

		var yogoNotUsed

		for(var i = 0; i < pullGroup.length; i++){

			var yogo = pullGroup.children[i]
			if(yogo.tag == tag && !yogo.used){
				yogoNotUsed = yogo
				break
			}
		}

		yogoNotUsed.setAlive(true)
		//yogoNotUsed.setAnimation(["wait"], true)
		return yogoNotUsed
	}

	function removeCharacter(obj, teamGroup){

		var index = teamGroup.auxArray.indexOf(obj.tag)
		if(index < 0)
			return

		teamGroup.slots[index].check = false
		teamGroup.auxArray[index] = -1
		teamGroup.currentSelect = -1
		teamGroup.marker = null

		if(teamGroup == alphaGroup)
			teamGroup.teamPivot = teamGroup.auxArray.indexOf(-1) //index
		else
			teamGroup.teamPivot = teamGroup.auxArray.lastIndexOf(-1) //index

		sound.play("robotBeep")

		for(var i = 0; i < teamGroup.slots.length; i++){

			var slot = teamGroup.slots[i]

			if(slot.yogo !== null && !slot.check){
				game.add.tween(slot.yogo).to({y: -100}, 200, Phaser.Easing.Cubic.In, true)
				slot.yogo.setAlive(false)
				slot.yogo.used = false
				teamGroup.remove(slot.yogo)
				pullGroup.add(slot.yogo)
				slot.yogo = null
			}
		}
		restoreAll()
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
        
        inputsGroup = game.add.group()
        sceneGroup.add(inputsGroup)

		var ok = inputsGroup.create(game.world.centerX - 100, game.world.height - 300, "ok")
		ok.anchor.setTo(0.5)
		ok.tint = 0xff0000
		ok.tag = 1
		ok.inputEnabled = true
		ok.events.onInputDown.add(clickOk,this)

		var ok = inputsGroup.create(game.world.centerX + 100, game.world.height - 300, "ok")
		ok.anchor.setTo(0.5)
		ok.tint = 0x0000ff
		ok.tag = 2
		ok.inputEnabled = true
		ok.events.onInputDown.add(clickOk,this)

		var ok = inputsGroup.create(game.world.centerX, game.world.height - 300, "atlas.yogoSelector", "star")
		ok.anchor.setTo(0.5)
		ok.inputEnabled = true
		ok.events.onInputDown.add(function(btn){

            game.add.tween(btn.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)
			chosenOne === 1 ? chosenOne = 2 : chosenOne = 1

		},this)
	}

	function clickOk(numTeam){

		var teamGroup
		numTeam === 1 ? teamGroup = alphaGroup : teamGroup = bravoGroup

		if(teamGroup.currentSelect !== -1 && teamGroup.teamPivot < 3 && !teamGroup.auxArray.includes(teamGroup.currentSelect)){

			//game.add.tween(btn.scale).to({x: 0.5, y:0.5}, 100, Phaser.Easing.linear, true, 0, 0, true)

			buttonsGroup.children[teamGroup.currentSelect].color += teamGroup.color
			turnOn(buttonsGroup.children[teamGroup.currentSelect])

			teamGroup.auxArray[teamGroup.teamPivot] = teamGroup.currentSelect
			teamGroup.slots[teamGroup.teamPivot].check = true
			teamGroup.slots[teamGroup.teamPivot].yogo.setAnimation(["select", "ready"], true)
			teamGroup.marker = null
            showName(teamGroup.currentSelect)
                
			if(teamGroup == alphaGroup)
				var aux = teamGroup.auxArray.indexOf(-1) //index
			else
				var aux = teamGroup.auxArray.lastIndexOf(-1) //index
			
			aux === -1 ? teamGroup.teamPivot = 3 : teamGroup.teamPivot = aux

			if(alphaGroup.teamPivot == 3 && bravoGroup.teamPivot == 3){
				buttonsGroup.setAll("token.canClick", false)
				game.time.events.add(2000, getReady)
			}
		}
	}
    
    function showName(tag){
        
        game.add.tween(namesGroup.light.scale).to({x: 1, y: 1}, 200, Phaser.Easing.linear, true, 0, 0, true)
        sound.play(YOGOTARS_LIST[tag].name)
        namesGroup.yogoName.loadTexture("atlas.yogoSelector", "name" + tag)
        namesGroup.yogoName.alpha = 1

        var fadeOut = game.add.tween(namesGroup.yogoName).to({alpha:0}, 400, Phaser.Easing.linear, false, 500)
        game.add.tween(namesGroup.yogoName.scale).from({y:0}, 100, Phaser.Easing.linear, true, 200).chain(fadeOut)    
    }

	function setAliveSpine(obj, alive){
		console.log(alive)
		obj.setAlive(alive)
	}

	function turnOn(btn){

		btn.light.loadTexture("atlas.yogoSelector", "light" + btn.color)
		btn.light.alpha = 1
		game.add.tween(btn.light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
	}

	function animateSelector(){

        sceneGroup.alpha = 1
		teamsBarGroup.forEach(function(bar){
			game.add.tween(bar.scale).from({x: 0}, 500, Phaser.Easing.Cubic.Out, true, 500).onComplete.add(function(){
				game.add.tween(bar.text).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 1000)
			})
		},this)

		buttonsGroup.forEach(function(btn){
			game.add.tween(btn).from({y: -150}, game.rnd.integerInRange(700, 1000), Phaser.Easing.Bounce.Out, true)
		},this)
        
        platformGroup.forEach(function(plat){
			game.add.tween(plat).from({y: game.world.height + 150}, game.rnd.integerInRange(700, 1000), Phaser.Easing.Bounce.Out, true, 1000)
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
				game.time.events.add(delay, function(){sound.play("lightUp")})


				i === 2 ? i = 7 : i--
				delay += 300
			}

			game.time.events.add(delay, function(){
				buttonsGroup.setAll("token.canClick", true)
				pressBtn(alphaGroup.marker.token, STATES.red)
				pressBtn(bravoGroup.marker.token, STATES.blue)
			})
		})
	}

	//···············ready screen···············//

	function createSplashArt(){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
		var delay = 0
		var images = [alphaGroup.auxArray, bravoGroup.auxArray]
		
		for(var j = 0; j < images.length; j++){

			var side = ORDER_SIDES[j]
			var pivotX = game.world.centerX * 0.82 * side.direction
			var RISE_X = game.world.centerY * 0.5 * -side.direction
			var team = images[j]

			for(var i = 0; i < team.length; i++){

				var lava = game.add.spine(pivotX, game.world.height * 1.3 * side.direction, "lava")
				lava.setSkinByName("normal")
				lava.scale.setTo(1, side.scale.x)
				lava.dir = 150 * side.direction
				splashArtGroup.add(lava)

				game.time.events.add(delay, function(lava){
					lava.setAnimationByName(0, "idle", true)
				},null, lava)

				var splash = game.add.sprite(0, 230, YOGOTARS_LIST[team[i]].name + (j+1))
				splash.anchor.setTo(0.5)
				splash.scale.setTo(1, side.scale.x)

				var slot = getSpineSlot(lava, "yogo")
				slot.add(splash)

				var text = new Phaser.Text(splashArtGroup.game, 75 * side.direction, 240, YOGOTARS_LIST[team[i]].name.toUpperCase(), fontStyle)
				text.anchor.setTo(0, 0.5)
				text.scale.setTo(1, side.scale.x)
				text.stroke = "#751375"
				text.strokeThickness = 20
				text.angle = 90 * side.direction
				lava.addChild(text)

				delay += 300
				pivotX += RISE_X
			}
		}
		game.load.onLoadComplete.remove(createSplashArt)
		game.load.reset()
	}

	function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}

	function createReady(){

		splashArtGroup = game.add.group()
		splashArtGroup.x = game.world.centerX
		splashArtGroup.y = game.world.centerY
		loadingGroup.add(splashArtGroup)

		readyGroup = game.add.group()
		loadingGroup.add(readyGroup)

		var pinkLight = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "pinkLight")
		pinkLight.anchor.setTo(0.5)
		pinkLight.scale.setTo(0)
		readyGroup.pinkLight = pinkLight

		var ready = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "ready")
		ready.alpha = 0
		ready.anchor.setTo(0.5)
		readyGroup.ready = ready
        
        var spiner = readyGroup.create(game.world.centerX, game.world.centerY, 'logoAtlas', 'spiner')
        spiner.anchor.setTo(0.5)
        spiner.alpha = 0
        readyGroup.spiner = spiner

		var VS = readyGroup.create(game.world.centerX, game.world.centerY, "vs")
		VS.anchor.setTo(0.5)
		VS.alpha = 0
		readyGroup.VS = VS

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
		var text = new Phaser.Text(readyGroup.game, spiner.x, spiner.y + 150, "0%", fontStyle)
		text.anchor.setTo(0.5)
		text.alpha = 0
		readyGroup.add(text)
		readyGroup.text = text
	}

	function shake(position, periodA, periodB) {
		var x = position * Math.PI * 2 * periodA
		var y = position * (Math.PI * 2 * periodB + Math.PI / 2)

		return Math.sin(x) * Math.cos(y)
	}

	function showBattle() {
		
		readyGroup.text.setText("100%")
        game.add.tween(white).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true)
		var fadeTween = game.add.tween(sceneGroup).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
		fadeTween.onComplete.add(function () {
			//bmd.destroy()
			sceneloader.show("battle")
		})
	}

	function getTeams(){
		var teams = []
		teams[0] = []
		teams[1] = []
		for(var alphaIndex = 0; alphaIndex < alphaGroup.length; alphaIndex++){
			var char = alphaGroup.children[alphaIndex]
			var name = "yogotar" + char.name.charAt(0).toUpperCase() + char.name.slice(1)
			var obj = {
				name:name,
				skin:char.skin
			}
			teams[0].push(obj)
		}

		for(var bravoIndex = 0; bravoIndex < bravoGroup.length; bravoIndex++){
			var char = bravoGroup.children[bravoIndex]
			var name = "yogotar" + char.name.charAt(0).toUpperCase() + char.name.slice(1)
			var obj = {
				name:name,
				skin:char.skin
			}
			teams[1].push(obj)
		}

		return teams
	}

	function getReady(){

		var dots = epicparticles.newEmitter("particlesHorizontal")
		dots.x = game.world.centerX
		dots.y = game.world.centerY
        readyGroup.addAt(dots,0)
        
        var emitter = epicparticles.newEmitter("horizontalLine")
		emitter.x = game.world.centerX
		emitter.y = game.world.centerY
		readyGroup.addAt(emitter,0)

		var teams = getTeams()

		gameSong.stop()
        //inputsGroup.alpha = 0

		game.add.tween(readyGroup.pinkLight.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Cubic.InOut, true, 0, 0, true).onComplete.add(function(){
			readyGroup.ready.alpha = 1
			sound.play("shineSpell")
			game.add.tween(readyGroup.ready.scale).from({x: 0, y:0}, 200, Phaser.Easing.linear, true).onComplete.add(function () {
				battleMain.init(teams)
				battleMain.create()
				game.add.tween(readyGroup.text).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
				game.time.events.add(6000, function () {
					timerFlag = true
					if(barCompleteFlag){
						showBattle()
					}
				})
			})
		})

        loadSplashArt()
		game.add.tween(selectorGroup).to({alpha: 0}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
			alphaGroup.forEach(setAliveSpine, this, false)
			bravoGroup.forEach(setAliveSpine, this, false)
			animateSplashArt()
		})
	}

	function animateSplashArt(){

		for(var i = 0; i < splashArtGroup.length; i++){

			var splashArt = splashArtGroup.children[i]
			var delay = game.rnd.integerInRange(300, 400)
			var landing = game.add.tween(splashArt).to({y: splashArt.dir}, delay, Phaser.Easing.Cubic.Out, true, 400)
		}

		pullGroup.destroy()
		landing.onComplete.add(function(){
			game.add.tween(readyGroup.ready).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 500).onComplete.add(function(){
                readyGroup.spiner.alpha = 1
                game.add.tween(readyGroup.spiner).to({angle: -360}, 2000, Phaser.Easing.linear, true).repeat(-1)
                readyGroup.VS.alpha = 1
                game.add.tween(readyGroup.VS.scale).from({x: 10, y: 10}, 400, Phaser.Easing.Cubic.Out, true)
                game.add.tween(readyGroup.VS).to({x: readyGroup.VS.x + 10}, 500, function (k) {
                    return shake(k, 45, 100)
                }, true, 500, -1)
            })
		})
	}
    
    function createWhite(){
        
        white = game.add.graphics()
        white.beginFill(0xffffff)
        white.drawRect(0, 0, game.world.width, game.world.height)
        white.endFill()
        white.alpha = 0
    }

    function onPlayersChange(data){
		var numTeam = data.numTeam
		var players = data.players
		var teamGroup = numTeam == 1 ? alphaGroup : bravoGroup

		for(var pIndex = 0; pIndex < players.length; pIndex++){
			var player = players[pIndex]
			var yogotar = player.avatar
			var slot = teamGroup.slots[pIndex]

			if((slot.yogo)&&(slot.yogo.name !== yogotar)){
				//removeCharacter(tokens[slot.yogo.name], teamGroup)
				changeButton(tokens[slot.yogo.name].parent, numTeam)
				removeCharacter(tokens[slot.yogo.name], teamGroup)
				if(yogotar){
					pressBtn(tokens[yogotar], numTeam)
					clickOk(numTeam)
				}

			}else if(!slot.yogo && yogotar){
				pressBtn(tokens[yogotar], numTeam)
				clickOk(numTeam)
			}else if(!slot.check && yogotar){
				clickOk(numTeam)
			}

			if(slot.yogo)
				player.skin = slot.yogo.skin
		}

		server.updateTeam(numTeam, {players:players})
	}

	function updateLoadingBar(loadedFiles, totalFiles) {

		if (readyGroup.spiner) {
		    var loadingAmount = loadedFiles / totalFiles
			var total = loadingAmount.toFixed(2).substr(2)
			readyGroup.text.setText(total + "%")
		}
	}

	function loadSplashArt(){

		game.load.onLoadComplete.add(createSplashArt)
		var images = [alphaGroup.auxArray, bravoGroup.auxArray]
		
		for(var j = 0; j < images.length; j++){
			var team = images[j]
			for (let i = 0; i < team.length; i++) {

				var name = YOGOTARS_LIST[team[i]].name + (j+1)
				var src = settings.BASE_PATH + "/images/loading/" + name + ".png"

				game.load.image(name, src)
			}
		}
		game.load.start()
	}

	return {
		bootFiles:bootFiles,
		assets: assets,
		name: "yogoSelector",
		update: update,
		preload:preload,
		updateLoadingBar:updateLoadingBar,
		showBattle:function () {
			barCompleteFlag = true
			if(timerFlag){
				showBattle()
			}
		},
		render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){
            
            createBackground()
            
			sceneGroup = game.add.group()
			sceneGroup.alpha = 0

			selectorGroup = game.add.group()
			sceneGroup.add(selectorGroup)
			loadingGroup = game.add.group()
			sceneGroup.add(loadingGroup)

			initialize()

			gameSong = sound.play("gameSong", {loop:true, volume:0.6})

            createPlatforms()
			createTeams()
			createPullGroup()
			createTeamsBars()
            createYogoNames()
			createButtons()
			//createOk()
            
			game.add.tween(tile).to({alpha:1}, 1000, Phaser.Easing.Cubic.Out, true).onComplete.add(animateSelector)

			createReady()
			createWhite()

			if(server)
				server.addEventListener("onPlayersChange", onPlayersChange)
			// game.time.events.add(6000, function () {
			// 	var data = {
			// 		numTeam:1,
			// 		players:[
			// 			{avatar:"eagle"},
			// 			{avatar:false},
			// 			{avatar:false}
			// 		]
			// 	}
			// 	onPlayersChange(data)
			// })
			game.onPause.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = false
			})
			game.onResume.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = true
			})
		},
		shutdown: function () {
			sceneGroup.destroy()
		}
	}
}()