
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
				json: "images/questionOverlay/atlas.json",
				image: "images/questionOverlay/atlas.png",
			},
		],
		images: [
			{
				name: "tile",
				file: "images/yogoSelector/bgTile.png",
			},
			{
				name: "questionBoard",
				file: "images/questionOverlay/questionBoard.png",
			},
			{
				name: "pinkLight",
				file: "images/yogoSelector/pinkLight.png",
			},
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
		game.load.bitmapFont('skwig', 'images/fonts/font.png', 'images/fonts/font.fnt')
	}

	function createQuestionOverlay(){

		questionGroup = riddles.createQuestionOverlay()
		questionGroup.callback = cliente.buttonOnClick
		questionGroup.alpha = 0
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

	function checkAnswer() {

	}

	function showWinner() {

	}

	return {

		assets: assets,
		name: "teamSelector",
		preload:preload,
		create: function(event){

			sceneGroup = game.add.group()

			initialize()
			createBackground()
			createQuestionOverlay()

			if(cliente){
				cliente.removeEventListener("onTurnEnds", checkAnswer)
				cliente.removeEventListener("onGameEnds", showWinner)
				cliente.removeEventListener("showEquation", questionGroup.setQuestion)
				cliente.addEventListener("onTurnEnds", checkAnswer)
				cliente.addEventListener("showEquation", questionGroup.setQuestion)
				cliente.addEventListener("onGameEnds", showWinner)

				//cliente.timeOutCallback = setTimeOut
				// clientData.setReady(true)
			}else{
				game.time.events.add(1000, questionGroup.setQuestion)
			}
		},
	}
}()