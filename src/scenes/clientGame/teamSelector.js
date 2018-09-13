
var teamSelector = function(){

	var soundsPath = "../../shared/minigames/sounds/"

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
				json: settings.BASE_PATH + "/images/teamSelector/atlas.json",
				image: settings.BASE_PATH + "/images/teamSelector/atlas.png",
			},
			{
				name: "atlas.loading",
				json: settings.BASE_PATH + "/images/loading/atlas.json",
				image: settings.BASE_PATH + "/images/loading/atlas.png",
			}
		],
		images: [
			{
				name: "tile",
				file: settings.BASE_PATH + "/images/yogoSelector/bgTile.png",
			}
		],
		sounds: [
			{	name: "shineSpell",
				file: settings.BASE_PATH +"/sounds/sounds/shineSpell.wav"},
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
			{	name: "lightUp",
				file: settings.BASE_PATH + "/sounds/sounds/lightUp.wav"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
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
			},
		],
		particles: [
			{
				name: 'horizontalLine',
				file: settings.BASE_PATH + '/particles/horizontalLine/intence_horison_ligth.json',
				texture: 'intence_horison_ligth.png'
			},
			{
				name: 'particlesHorizontal',
				file: settings.BASE_PATH + '/particles/particlesHorizontal/particle_horison_ligth.json',
				texture: 'particle_horison_ligth.png'
			}
		]
	}

	var TEAMS = {
		1: {
			name: "Equipo Alpha",
			side: 1,
			states: {yellow: 0, color: 1},
		},
		2: {
			name: "Equipo Bravo",
			side: -1,
			states: {yellow: 0, color: 2},
		},
	}

	var DEFAULT_NUMTEAM = 2
	var TEAM_COMPLETE = 3

	var STATES
	var SIDE
	var TEAM_NAME
	var TILE_MOVE

	var gameSong
	var sceneGroup
	var platformGroup
	var teamGroup
	var pullGroup
	var okButton
	var gameActive

	var teamBar
	var buttonsGroup

	var tile
	var bmd

	var loadingGroup
	var splashArtGroup
	var readyGroup
	var cliente

	var YOGOTARS_LIST = [
		{
			name:"tomiko",
			file:settings.BASE_PATH + "/spines/yogotars/client/tomiko/tomikoClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"luna",
			file:settings.BASE_PATH + "/spines/yogotars/client/luna/lunaClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"nao",
			file:settings.BASE_PATH + "/spines/yogotars/client/nao/naoClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"theffanie",
			file:settings.BASE_PATH + "/spines/yogotars/client/theffanie/theffanieClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"eagle",
			file:settings.BASE_PATH + "/spines/yogotars/client/eagle/eagleClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"dinamita",
			file:settings.BASE_PATH + "/spines/yogotars/client/dinamita/dinamitaClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"arthurius",
			file:settings.BASE_PATH + "/spines/yogotars/client/arthurius/arthuriusClient.json",
			scales: ["@0.5x"]
		},
		{
			name:"estrella",
			file:settings.BASE_PATH + "/spines/yogotars/client/estrella/estrellaClient.json",
			scales: ["@0.5x"]
		},
	]
	
	assets.spines = assets.spines.concat(YOGOTARS_LIST)

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#0D014D"

        cliente = parent.cliente || {}
        var numTeam = cliente.numTeam || DEFAULT_NUMTEAM
		var config = TEAMS[numTeam]
		gameActive = false

		STATES = config.states
		SIDE = config.side
		TEAM_NAME = config.name
		TILE_MOVE = SIDE * 0.4

		loadSounds()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
	}

	function createBackground(){

		bmd = game.add.bitmapData(game.world.width, game.world.height)
		bmd.back = bmd.addToWorld()

		var y = 0

		for (var i = 0; i < bmd.height; i++)
		{
			var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

			bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
			y += 2
		}

		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
		//tile.tint = 0x0099AA
		tile.alpha = 0.4
	}

	function update(){
		tile.tilePosition.y -= 0.4
		tile.tilePosition.x += TILE_MOVE
		//epicparticles.update()
	}

	function createPlatforms(){

		platformGroup = game.add.group()
		sceneGroup.add(platformGroup)

		var pivotX = 0.5

		for(var i = 0; i < 3; i++){

			var plat = platformGroup.create(game.world.centerX * pivotX, game.world.centerY + 30, "atlas.yogoSelector", "plat" + STATES.color)
			plat.anchor.setTo(0.5)
			plat.alpha = 0
			plat.apear = showPlat.bind(plat)
			plat.hide = hidePlat.bind(plat)

			pivotX += 0.5
		}

		platformGroup.children[1].y += 50

		function showPlat(){
			this.alpha = 1
			game.add.tween(this).from({y: -150}, 700, Phaser.Easing.Bounce.Out, true).onComplete.add(function(){
				gameActive = true
			})
		}

		function hidePlat(){
			game.add.tween(this).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true)
		}
	}

	function createTeam(){

		teamGroup = game.add.group()
		teamGroup.teamPivot = SIDE > 0 ? 0 : 2
		teamGroup.currentSelect = -1
		teamGroup.auxArray = [-1, -1, -1]
		teamGroup.slots = []
		teamGroup.color = STATES.color
		teamGroup.side = SIDE
		sceneGroup.add(teamGroup)

		var pivotX = SIDE < 0 ? 0.3 : 1.2

		for(var i = 0; i < 3; i++){

			var plat = platformGroup.children[i]
			var data = {x:plat.x, y: plat.y, yogo:null, check: false}
			teamGroup.slots.push(data)

			pivotX += 0.25
		}
		//teamGroup.slots[1].y += 100
	}

	function createPullGroup(){

		pullGroup = game.add.group()
		sceneGroup.add(pullGroup)

		for(var i = 0; i < YOGOTARS_LIST.length; i++){

			var player = spineLoader.createSpine(YOGOTARS_LIST[i].name, YOGOTARS_LIST[i].name + "1", "wait", 0, 0, true)//characterBattle.createCharacter(assets.spines[aux].name, assets.spines[aux].name + skinNum, "wait")
			player.x = 0
			player.y = -100
			player.name = YOGOTARS_LIST[i].name
			player.tag = i
			player.used = false
			player.setAlive(false)
			pullGroup.add(player)
		}
	}
	//pull group both skins
	// function createPullGroup(){

	// 	pullGroup = game.add.group()
	// 	sceneGroup.add(pullGroup)

	// 	var skinNum = 1
	// 	var aux = 0

	// 	for(var i = 0; i < YOGOTARS_LIST.length * 2; i++){

	// 		var player = spineLoader.createSpine(YOGOTARS_LIST[aux].name, YOGOTARS_LIST[aux].name + skinNum, "wait", 0, 0, true)//characterBattle.createCharacter(assets.spines[aux].name, assets.spines[aux].name + skinNum, "wait")
	// 		player.x = 0
	// 		player.y = -100
	// 		player.name = YOGOTARS_LIST[aux].name
	// 		player.tag = aux
	// 		player.used = false
	// 		player.skin = YOGOTARS_LIST[aux].name + skinNum
	// 		player.setAlive(false)
	// 		pullGroup.add(player)

	// 		aux = i - aux
	// 		skinNum = i % 2 ? 1 : 2
	// 	}
	// }

	function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var border = STATES.color - 1

		teamBar = sceneGroup.create(game.world.width * border, 30, "atlas.yogoSelector", "teamBar" + STATES.color)
		teamBar.anchor.setTo(border, 0)
		teamBar.scale.setTo(0.8)

		var text = new Phaser.Text(sceneGroup.game, 320, 25, TEAM_NAME, fontStyle)
		text.anchor.setTo(0.5, 0)
		text.stroke = "#000066"
		text.strokeThickness = 10
		text.alpha = 0
		text.x *= SIDE
		teamBar.addChild(text)
		teamBar.text = text
	}

	function createButtons(){

		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)

		// var pivotX = SIDE < 0 ? game.world.centerX * 1.45 : game.world.centerX * 0.25
		// var pivotY = 320
		var pivotX = 0.35
		var pivotY = 270
		var aux = 0
		var scale = SIDE

		for(var i = 0; i < 8; i++){

			var subGroup = game.add.group()
			// subGroup.x = pivotX
			// subGroup.y = pivotY
			subGroup.x = game.world.centerX * pivotX
			subGroup.y = game.world.height - pivotY
			subGroup.color = STATES.yellow
			buttonsGroup.add(subGroup)

			var token = subGroup.create(0, 0, "atlas.yogoSelector", "token" + 0)
			token.anchor.setTo(0.5)
			token.inputEnabled = true
			token.events.onInputDown.add(pressBtn, this)
			token.tag = i
			token.canClick = false
			subGroup.token = token

			var light = subGroup.create(0, 55, "atlas.yogoSelector", "light" + STATES.color)
			light.alpha = 0
			light.anchor.setTo(0.5, 1)
			subGroup.light = light

			var yogotar = subGroup.create(0, -40, "atlas.yogoSelector", "yogo" + i)
			yogotar.anchor.setTo(0.5)
			yogotar.scale.setTo(scale, 1)
			yogotar.rescale = scale
			yogotar.alpha = 0
			subGroup.yogotar = yogotar

			// pivotX += 210

			if(i % 2){
			// 	pivotY += 180
			// 	if(SIDE > 0)
			// 		pivotX = aux % 2 ? game.world.centerX * 0.25 : game.world.centerX * 0.4
			// 	else
			// 		pivotX = aux % 2 ? game.world.centerX * 1.45 : game.world.centerX * 1.3
			// 	aux++
				scale *= -1
			}

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

		}

		buttonsGroup.children[0].yogotar.x -= 30 * SIDE
		buttonsGroup.children[3].yogotar.x -= 10 * SIDE
		buttonsGroup.children[7].yogotar.x -= 10 * SIDE

		var btn = SIDE > 0 ? 0 : 3
		teamGroup.marker = buttonsGroup.children[btn]
	}

	function pressBtn(btn){

		if(btn.canClick && gameActive){

			btn.canClick = false

			teamGroup.marker = btn.parent

			if(btn.parent.color === STATES.yellow){
				if(teamGroup.teamPivot < 3){
					markYogotar(btn.parent)
					animateButton(btn.parent, STATES.color)
					okButton.activate()
				}
				else{
					btn.canClick = true
					teamGroup.marker = null
				}
			}
			else{
				removeCharacter(btn.parent, teamGroup)
				turnOff(btn.parent, STATES.yellow)
				animateButton(btn.parent, STATES.yellow)
				okButton.deActivate()
			}
		}
	}

	function animateButton(obj, color){

		obj.token.loadTexture("atlas.yogoSelector", "token" + color)
		game.add.tween(obj.token.scale).to({x: 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
			obj.token.canClick = true
		})
		game.add.tween(obj.yogotar.scale).to({x:obj.yogotar.rescale * 1.2, y:1.2}, 100, Phaser.Easing.linear, true, 0, 0, true)

		if(obj.light.alpha == 1){
			obj.light.loadTexture("atlas.yogoSelector", "light" + obj.color)
		}
	}

	function turnOff(obj, color){

		obj.light.alpha = 0
		obj.color = color
	}

	function markYogotar(obj){

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
		yogoNotUsed.setAnimation(["wait"], true)
		return yogoNotUsed
	}

	function removeCharacter(obj){

		gameActive = false
		var index = teamGroup.auxArray.indexOf(obj.token.tag)
		teamGroup.slots[index].check = false
		teamGroup.auxArray[index] = -1
		teamGroup.currentSelect = -1
		teamGroup.marker = null
		platformGroup.children[index].hide()

		if(teamGroup.side == 1)
			teamGroup.teamPivot = teamGroup.auxArray.indexOf(-1)
		else
			teamGroup.teamPivot = teamGroup.auxArray.lastIndexOf(-1)

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
			if(!slot.check) platformGroup.children[i].hide()
		}

		if(teamGroup.side == 1)
			var aux = teamGroup.auxArray.indexOf(-1)
		else
			var aux = teamGroup.auxArray.lastIndexOf(-1)
		game.time.events.add(600, platformGroup.children[aux].apear)
		
		restoreAll()
	}

	function restoreAll(){

		for(var i = 0; i < buttonsGroup.length; i++){

			var btn = buttonsGroup.children[i]

			if(btn != teamGroup.marker){
				if(btn.color === STATES.yellow){
					btn.token.loadTexture("atlas.yogoSelector", "token0")
					btn.light.alpha = 0
				}
				else{
					btn.token.loadTexture("atlas.yogoSelector", "token" + btn.color)
					btn.light.loadTexture("atlas.yogoSelector", "light" + btn.color)
				}
			}
		}
	}

	function createOk(){

		okButton = game.add.group()
		okButton.x = game.world.centerX
		okButton.y = game.world.height - 290
		okButton.scale.setTo(0.9)
		okButton.alpha = 0
		okButton.canClick = false
		sceneGroup.add(okButton)

		var okOff = okButton.create(0, 0, "atlas.yogoSelector", "okOff")
		okOff.anchor.setTo(0.5)
		okOff.inputEnabled = true
		okOff.events.onInputOver.add(function(btn){
			if(okButton.canClick){
				okButton.setAll("alpha", 0)
				btn.parent.over.alpha = 1
			}
		}, this)
		okOff.events.onInputOut.add(function(btn){
			if(okButton.canClick){
				okButton.setAll("alpha", 0)
				btn.alpha = 1
			}
		}, this)
		okOff.events.onInputDown.add(function(btn){
			if(okButton.canClick && teamGroup.currentSelect !== -1){
				okButton.canClick = false
				sound.play("lightUp")
				okButton.setAll("alpha", 0)
				okButton.onBtn.alpha = 1
				clickOk()
			}
		}, this)
		okOff.events.onInputUp.add(function(btn){
			okButton.setAll("alpha", 0)
			okButton.off.alpha = 1
		}, this)
		okButton.off = okOff

		var overBtn = okButton.create(0, - 40, "atlas.yogoSelector", "okOver")
		overBtn.anchor.setTo(0.5)
		overBtn.alpha = 0
		okButton.over = overBtn

		var onBtn = okButton.create(0, 0, "atlas.yogoSelector", "okOn")
		onBtn.anchor.setTo(0.5)
		onBtn.alpha = 0
		okButton.onBtn = onBtn

		okButton.activate = activate.bind(okButton)
		okButton.deActivate = deActivate.bind(okButton)

		function activate(){
			this.canClick = true
			this.setAll("tint", 0xFFFFFF)
		}
	
		function deActivate(){
			this.canClick = false
			this.setAll("tint", 0x888888)
		}
	}
	
	function getTeam() {
		var players = []
		for(var playerIndex = 0; playerIndex < teamGroup.slots.length; playerIndex++){
			var nickName = cliente.team.players[playerIndex].nickname
			var player = teamGroup.slots[playerIndex]
			var playerObj = {
				avatar:player.yogo ? player.yogo.name : false,
				nickname:nickName
			}
			players.push(playerObj)
		}

		return players
	}

	function clickOk(){

		if(teamGroup.currentSelect !== -1 && teamGroup.teamPivot < 3 && !teamGroup.auxArray.includes(teamGroup.currentSelect)){

			okButton.deActivate()
			buttonsGroup.children[teamGroup.currentSelect].color = STATES.color
			turnOn(buttonsGroup.children[teamGroup.currentSelect])

			teamGroup.auxArray[teamGroup.teamPivot] = teamGroup.currentSelect
			teamGroup.slots[teamGroup.teamPivot].check = true
			teamGroup.slots[teamGroup.teamPivot].yogo.setAnimation(["select", "ready"], true)
			teamGroup.marker = null
			showName(teamGroup.currentSelect)
			teamGroup.currentSelect = -1
			if(teamGroup.side == 1)
				var aux = teamGroup.auxArray.indexOf(-1)
			else
				var aux = teamGroup.auxArray.lastIndexOf(-1)
			
			aux === -1 ? teamGroup.teamPivot = TEAM_COMPLETE : teamGroup.teamPivot = aux

			if(teamGroup.teamPivot == TEAM_COMPLETE){
				gameActive = false
				buttonsGroup.setAll("token.canClick", false)
				okButton.deActivate()
				game.time.events.add(2000, getReady)
			}
			else platformGroup.children[aux].apear()

			var teamPlayers = getTeam()
			cliente.selectYogotar(teamPlayers)
		}
	}

	function createYogoNames(){

		namesGroup = game.add.group()
		sceneGroup.add(namesGroup)

		var light = namesGroup.create(game.world.centerX, game.world.height - 200, "atlas.yogoSelector", "pinkLight")
		light.anchor.setTo(0.5)
		light.scale.setTo(0)
		namesGroup.light = light

		var yogoName = namesGroup.create(light.x, light.y, "atlas.yogoSelector", "name0")
		yogoName.anchor.setTo(0.5)
		yogoName.alpha = 0
		namesGroup.yogoName = yogoName
	}

	function showName(tag){

		game.add.tween(namesGroup.light.scale).to({x: 1, y: 1}, 400, Phaser.Easing.linear, true, 0, 0, true)
		sound.play(YOGOTARS_LIST[tag].name)
		namesGroup.yogoName.loadTexture("atlas.yogoSelector", "name" + tag)
		namesGroup.yogoName.alpha = 1

		var fadeOut = game.add.tween(namesGroup.yogoName).to({alpha:0}, 400, Phaser.Easing.linear, false, 1000)
		//fadeOut.onComplete.add(okButton.activate)
		game.add.tween(namesGroup.yogoName.scale).from({y:0}, 100, Phaser.Easing.linear, true, 200).chain(fadeOut)
	}

	function setAliveSpine(obj, alive){
		obj.setAlive(alive)
	}

	function turnOn(btn){

		btn.light.loadTexture("atlas.yogoSelector", "light" + STATES.color)
		btn.light.alpha = 1
		game.add.tween(btn.light.scale).from({y:0}, 150, Phaser.Easing.linear, true)
	}

	function animateSelector(){

		game.add.tween(teamBar.scale).from({x: 0}, 500, Phaser.Easing.Cubic.Out, true, 500).chain(game.add.tween(teamBar.text).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 1000))

		buttonsGroup.forEach(function(btn){
			game.add.tween(btn).from({y: -150}, game.rnd.integerInRange(700, 1000), Phaser.Easing.Bounce.Out, true, 1000)
		},this)

		// platformGroup.forEach(function(plat){
		// 	game.add.tween(plat).from({y: game.world.height + 150}, game.rnd.integerInRange(700, 1000), Phaser.Easing.Bounce.Out, true, 1500)
		// },this)
		if(teamGroup.side == 1)
			var aux = teamGroup.auxArray.indexOf(-1)
		else
			var aux = teamGroup.auxArray.lastIndexOf(-1)
		game.time.events.add(1500, platformGroup.children[aux].apear)

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

			game.add.tween(okButton).to({alpha: 1}, 300, Phaser.Easing.linear, true, delay).onComplete.add(function(){
				buttonsGroup.setAll("token.canClick", true)
				pressBtn(teamGroup.marker.token, STATES.color)
				okButton.activate()
				gameActive = true
			})
		})
	}

	//···············ready screen···············//

	function createSplashArt(){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
		var pivotX = game.world.centerX * 0.8 * -SIDE
		var RISE_X = game.world.centerY * 0.6 * SIDE
		var delay = 0
		
		for(var i = 0; i < teamGroup.auxArray.length; i++){

			var lava = game.add.spine(pivotX, game.world.height * 1.3 * -SIDE, "lava")
			lava.setSkinByName("normal")
			lava.scale.setTo(1, SIDE)
			splashArtGroup.add(lava)

			var splash = game.add.sprite(0, 230, "atlas.loading", YOGOTARS_LIST[teamGroup.auxArray[i]].name)
			splash.anchor.setTo(0.5)
			splash.scale.setTo(1, SIDE)

			var slot = getSpineSlot(lava, "yogo")
			slot.add(splash)

			game.time.events.add(delay, function(lava){
				lava.setAnimationByName(0, "idle", true)
			},null, lava)

			delay += 300

			var text = new Phaser.Text(splashArtGroup.game, -75 * SIDE, 250, YOGOTARS_LIST[teamGroup.auxArray[i]].name.toUpperCase(), fontStyle)
			text.anchor.setTo(0, 0.5)
			text.scale.setTo(SIDE, 1)
			text.stroke = "#751375"
			text.strokeThickness = 20
			text.angle = -90
			lava.addChild(text)

			pivotX += RISE_X

			if(i === 1){
				lava.scale.setTo(-1, SIDE)
				text.scale.setTo(SIDE, -1)
				text.x *= -1
			}
		}
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

		var offsetX = SIDE > 0 ? 1.6 : 0.4

		splashArtGroup = game.add.group()
		splashArtGroup.x = game.world.centerX
		splashArtGroup.y = game.world.centerY
		loadingGroup.add(splashArtGroup)

		readyGroup = game.add.group()
		loadingGroup.add(readyGroup)

		var pinkLight = readyGroup.create(game.world.centerX, game.world.centerY, "atlas.yogoSelector", "pinkLight")
		pinkLight.alpha = 0
		pinkLight.anchor.setTo(0.5)
		pinkLight.scale.setTo(0, 1)
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

		var spiner = readyGroup.create(game.world.centerX * offsetX, game.world.centerY, "logoAtlas", "spiner")
		spiner.anchor.setTo(0.5)
		spiner.scale.setTo(1.2)
		spiner.alpha = 0
		readyGroup.spiner = spiner

		var VS = readyGroup.create(spiner.centerX, spiner.centerY, "atlas.loading", "vs")
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
		game.add.tween(readyGroup.pinkLight.scale).to({x: 1}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
			readyGroup.ready.alpha = 1
			sound.play("shineSpell")
			game.add.tween(readyGroup.ready.scale).from({x: 0, y:0}, 200, Phaser.Easing.linear, true)
		})

		game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
			teamGroup.forEach(setAliveSpine, this, false)
			createSplashArt()
			animateSplashArt()
		})
	}

	function animateSplashArt(){

		var delay = 500

		for(var i = 0; i < splashArtGroup.length; i++){

			var splashArt = splashArtGroup.children[i]
			var delay = game.rnd.integerInRange(4, 5) * 100
			var landing = game.add.tween(splashArt).to({y: -150 * SIDE}, delay, Phaser.Easing.Cubic.Out, true, 400)
		}

		pullGroup.destroy()
		landing.onComplete.add(function(){
			
			game.add.tween(readyGroup.ready).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
			readyGroup.VS.alpha = 1
			readyGroup.spiner.alpha = 1
			game.add.tween(readyGroup.VS.scale).from({x: 10, y: 10}, 400, Phaser.Easing.Cubic.Out, true)
			game.add.tween(readyGroup.spiner).to({angle: -360}, 2000, Phaser.Easing.linear, true).repeat(-1)
			game.add.tween(readyGroup.VS).to({x: readyGroup.VS.x + 10}, 500, function (k) {
				return shake(k, 45, 100)
			}, true, 500, -1)
		})
	}

	return {
		bootFiles:bootFiles,
		assets: assets,
		name: "teamSelector",
		update: update,
		preload:preload,
		render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){

			createBackground()

			sceneGroup = game.add.group()
			loadingGroup = game.add.group()

			initialize()
			cliente.startBattle = function () {
				sceneloader.show("questions")
			}
			gameSong = sound.play("gameSong", {loop:true, volume:0.6})

			createPlatforms()
			createTeam()
			createPullGroup()
			createTeamBar()
			createButtons()
			createOk()
			createYogoNames()
			animateSelector()
			createReady()

		},
		shutdown:function () {
			sceneGroup.destroy()
			bmd.destroy()
		}
	}
}()