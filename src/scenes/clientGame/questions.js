
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
		questionGroup.teamName.setText(NAME)
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

		tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile")
		tile.anchor.setTo(0.5)
		tile.tint = 0x0099AA
		tile.angle = 45
		sceneGroup.add(tile)
	}

	function checkAnswer(){
		questionGroup.clearQuestion()
	}

	function showWinner(){

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
				
			// var obj = {
			// 	question: "En un cine había sesenta y cuatro personas y han entrado diecisiete más. ¿Cuántas personas hay ahora en el cine?",
			// 	existImage : false,
			// 	src: "../../images/questionDB/default.png",
			// 	image: "",
			// 	answers: ["Ochenta y uno", "Setenta y uno", "Cuarenta y siete", "Cincuenta y siete"],
			// 	grade: 2,
			// 	level: 5,
			// 	correctAnswer: 1,
			// }

			// var riddle = obj
			// questionGroup.showQuestion(riddle)

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