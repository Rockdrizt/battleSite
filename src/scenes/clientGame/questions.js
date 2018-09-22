
var soundsPath = "../../shared/minigames/sounds/"

var questions = function(){

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
				name: "atlas.question",
				json: settings.BASE_PATH + "/images/questionOverlayCliente/atlas.json",
				image: settings.BASE_PATH + "/images/questionOverlayCliente/atlas.png",
			},
		],
		images: [
			{
				name: "tile",
				file: settings.BASE_PATH + "/images/yogoSelector/bgTile.png",
			},
			{
				name: "questionBoard",
				file: settings.BASE_PATH + "/images/questionOverlayCliente/questionBoard.png",
			},
			{
				name: "pinkLight",
				file: settings.BASE_PATH + "/images/yogoSelector/pinkLight.png",
			},
			{
				name: "default",
				file: settings.BASE_PATH + "/images/questionDB/default.png",
			}
		],
		sounds: [
		],
		spines:[
			{
				name:"banner",
				file:settings.BASE_PATH + "/spines/selector/banners.json",
			},
		],
		spritesheets: [

		],
		particles: [

		]
	}

	var DEFAULT_NUMTEAM = 1

	var TEAMS = {
		1: {
			name: "Equipo Alfa",
			side: 1,
			states: {yellow: 0, color: 1},
			animSkin: "alfa"
		},
		2: {
			name: "Equipo Bravo",
			side: -1,
			states: {yellow: 0, color: 2},
			animSkin: "bravo"
		},
	}
	var DATA 

	var sceneGroup
	var tile
	var cliente
	var numTeam
	var questionGroup

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#0D014D"

		cliente = parent.cliente || {}
		numTeam = cliente.numTeam || DEFAULT_NUMTEAM
		DATA = TEAMS[numTeam]
		loadSounds()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
		game.load.bitmapFont('skwig', settings.BASE_PATH + '/images/fonts/font.png', settings.BASE_PATH + '/images/fonts/font.fnt')
	}

	function createQuestionOverlay(){

		questionGroup = questionHUD.createQuestionOverlay(true)
		questionGroup.callback = cliente.buttonOnClick
		// questionGroup.callback = function(){
		// 	questionGroup.timer.stop()
		// 	cliente.buttonOnClick()
		// }
		sceneGroup.add(questionGroup)
	}

	function createBackground(){

		var bmd = game.add.bitmapData(game.world.width, game.world.height)
		var back = bmd.addToWorld()
		sceneGroup.add(back)

		var y = 0

		for (var i = 0; i < bmd.height; i++)
		{
			var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

			bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
			y += 2
		}

		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
		tile.alpha = 0.4
		sceneGroup.add(tile)
	}

	function checkAnswer(){
		questionGroup.showFeedback()
	}

	function showWinner(data){
		var teams = data.teams
		var winner = data.winner

		rewardClient.setTeams(teams)
		rewardClient.setWinner(winner)
		game.time.events.add(2000, function () {
			sceneloader.show("rewardClient")
		})
	}

	function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var border = DATA.states.color - 1
        
        var teamBar = game.add.spine(game.world.width * border, 160, "banner")
		teamBar.setSkinByName(DATA.animSkin)
		teamBar.setAnimationByName(0, "idle", true)
		teamBar.scale.setTo(DATA.side, 1)
		teamBar.x += 390 * DATA.side
		sceneGroup.add(teamBar)

		var text = new Phaser.Text(sceneGroup.game, -100, -70, DATA.name, fontStyle)
		text.anchor.setTo(0.5)
		text.scale.setTo(DATA.side, 1)
		text.stroke = "#000066"
		text.strokeThickness = 10
		teamBar.addChild(text)
		teamBar.text = text
    }

	function createButton(callback, color) {
		color = color || 0x000000

		var buttonGroup = game.add.group()

		var rectBg = game.add.graphics()
		rectBg.beginFill(color)
		rectBg.lineStyle(5, 0xffffff, 1)
		rectBg.drawRect(0, 0, 200, 50)
		rectBg.endFill()
		buttonGroup.add(rectBg)

		rectBg.inputEnabled = true
		rectBg.events.onInputDown.add(callback)

		var fontStyle = {font: "24px Arial", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var text = game.add.text(10, 10, "", fontStyle)
		buttonGroup.add(text)
		buttonGroup.label = text

		return buttonGroup
	}

	function setReadyGo(){

		var TIMES = {
            ultra : 800,
            super : 15000,
            normal : 30000
		}
		
		var obj = {
			question: "Estrella resolvió las siguientes dos operaciones y tapó algunos números con figuras. Cada figura, representa un número diferente. ¿Qué número está abajo de la figura de corazón?",
			existImage : false,
			src: settings.BASE_PATH + "/images/questionDB/default.png",
			image: "default",
			answers: ["a", "be", "ce", "de"],
			grade: 1,
			level: 1,
			correctAnswer: 1,
			timers: TIMES,
			index: 0,
			correctValue: "be"
			//correctIndex:
		}

		var riddle = obj
		//var riddle = riddles.getQuestion(2)
		questionGroup.showQuestion(riddle)
	}
	
	function setQuestionTimeOut() {
		console.log("timeOut")
		//questionGroup.stopTimer()
		cliente.buttonOnClick({time : 0, value : -1})

		game.time.events.add(3000, questionGroup.clearQuestion)
	}

	return {

		assets: assets,
		name: "questions",
		preload:preload,
		create: function(event){

			sceneGroup = game.add.group()

			initialize()
			createBackground()
			createQuestionOverlay()
			createTeamBar()

			//riddles.initialize()

			// var quest = createButton(setReadyGo, 0x00ffff)
			// quest.x = game.world.centerX
			// quest.y = game.world.height - 50
			// quest.label.text = "questions"

			// var quest = createButton(checkAnswer, 0x00ffff)
			// quest.x = game.world.centerX + 200
			// quest.y = game.world.height - 50
			// quest.label.text = "clear"

			if(cliente){
				cliente.removeEventListener("onTurnEnds", checkAnswer)
				cliente.removeEventListener("onGameEnds", showWinner)
				cliente.removeEventListener("showEquation", questionGroup.showQuestion)
				cliente.removeEventListener("questionTimeOut", setQuestionTimeOut)
				cliente.addEventListener("onTurnEnds", checkAnswer)
				cliente.addEventListener("showEquation", questionGroup.showQuestion)
				cliente.addEventListener("onGameEnds", showWinner)
				cliente.addEventListener("questionTimeOut", setQuestionTimeOut)

				//cliente.timeOutCallback = setTimeOut
				// clientData.setReady(true)
			}else{
				game.time.events.add(1000, questionGroup.setQuestion)
			}
		},
		shutdown: function () {
			sceneGroup.destroy()
		}
	}
}()