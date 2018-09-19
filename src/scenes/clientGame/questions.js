
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
		spritesheets: [

		],
		particles: [

		]
	}

	var DEFAULT_NUMTEAM = 1

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
		loadSounds()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
		game.load.bitmapFont('skwig', settings.BASE_PATH + '/images/fonts/font.png', settings.BASE_PATH + '/images/fonts/font.fnt')
	}

	function createQuestionOverlay(){

		var NAME = numTeam == 1 ? "Equipo Alpha" : "Equipo Bravo"

		questionGroup = questionHUD.createQuestionOverlay(true)
		questionGroup.callback = cliente.buttonOnClick
		// questionGroup.callback = function(){
		// 	questionGroup.timer.stop()
		// 	cliente.buttonOnClick()
		// }
		//questionGroup.teamName.setText(NAME)
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
		//tile.anchor.setTo(0.5)
		tile.tint = 0x0099AA
		//tile.angle = 45
		sceneGroup.add(tile)
	}

	function checkAnswer(){
		questionGroup.showFeedback()
	}

	function showWinner(){

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
		
		var obj = {
			question: "lorem ipsum dolor",
			existImage : false,
			src: settings.BASE_PATH + "/images/questionDB/default.png",
			image: "default",
			answers: ["a", "be", "ce", "de"],
			grade: 1,
			level: 1,
			correctAnswer: 2,
			//time:DIFFICULT_RULES[level].time
			index: 0,
			correctValue: "be"
			//correctIndex:
		}

		//var riddle = obj
		var riddle = riddles.getQuestion(5)
		questionGroup.showQuestion(riddle)
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
				cliente.addEventListener("onTurnEnds", checkAnswer)
				cliente.addEventListener("showEquation", questionGroup.showQuestion)
				cliente.addEventListener("onGameEnds", showWinner)

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