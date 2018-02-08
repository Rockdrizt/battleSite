
var soundsPath = "../../shared/minigames/sounds/"
var operations = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"ready":"Ready",
			"reviewingAnswers": "Reviewing Answers",
			"youWin":"You Win!",
			"bestLuck":"Better luck next time!"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"ready":"Listos",
			"reviewingAnswers": "Revisando Respuestas",
			"youWin":"¡Ganaste!",
			"bestLuck":"¡Mejor suerte la próxima!"
		}
	}


	var assets = {
		atlases: [
			{
				name: "atlas.operations",
				json: "images/operations/atlas.json",
				image: "images/operations/atlas.png"
			}
		],
		images: [

		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "flip",
				file: soundsPath + "flipCard.mp3"},
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"}
		]
	}

	var NUM_LIFES = 3
	var MAX_OPTIONS = 8

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var lives
	var sceneGroup = null
	var gameIndex = 33
	// var operationsSong
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var roundCounter
	var buttonList
	var equationGroup
	var startTimer
	var timeElapsed
	var correctButton
	var clientData
	var options
	var buttonSelected
	var timerText
	var differenceTimeText
	var correctParticle
	var wrongParticle
	var missingOperand
	var isReady = null
	var waitingGroup
	var optionsGroup
	var readyString
	var skyBg
	var ground
	var miniEagle
	var scoreText
	var totalScore
	var bonusText1
	var bonusText2

	function tweenTint(obj, startColor, endColor, time, delay, callback) {
		// check if is valid object
		time = time || 250
		delay = delay || 0

		if (obj) {
			// create a step object
			var colorBlend = { step: 0 };
			// create a tween to increment that step from 0 to 100.
			obj.colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
			// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
			obj.colorTween.onUpdateCallback(function () {
				obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
			})
			// set object to the starting colour
			obj.tint = startColor;
			// if you passed a callback, add it to the tween on complete
			if (callback) {
				obj.colorTween.onComplete.add(callback, this);
			}
			// finally, start the tween
			obj.colorTween.start();
		}
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 7
		quantNumber = 2
		roundCounter = 0

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false
		buttonList = []
		timeElapsed = 0
		isReady = false
		totalScore = 0

		loadSounds()

		if(server){
			server.restartGame = stopGame
		}

	}
	
	function addButtons() {
		var startY = game.world.height - 200
		for(var optionIndex = 0, numOptions = options.length; optionIndex < numOptions; optionIndex++){
			var button = buttonList[optionIndex]
			var value = options[optionIndex]
			button.value = value
			console.log(button.value)
			button.text.text = value
			optionsGroup.add(button)
			button.y = startY - optionIndex * 180
			button.x = game.world.centerX
			button.img.inputEnabled = true
			button.alpha = 0
			button.scale.x = 0.4; button.scale.y = 0.4
			button.img.tint = 0xffffff

			game.add.tween(button).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 300 * (numOptions - optionIndex))
			game.add.tween(button.scale).to({x:1, y:1}, 300, Phaser.Easing.Back.Out, true, 300 * (numOptions - optionIndex))
		}
	}
	
	function showPoints(text1, text2, callback) {
		bonusText1.scale.x = 0.4; bonusText1.scale.y = 0.4
		// bonusText2.scale.x = 0.4; bonusText2.scale.y = 0.4

		bonusText1.text = text1
		bonusText2.text = text2

		correctParticle.x = bonusText1.x; correctParticle.y = bonusText2.y
		correctParticle.start(true, 1000, null, 5);
		var btween1 = game.add.tween(bonusText1.scale).to({x:1.2, y:1.1}, 250, Phaser.Easing.Cubic.Out, true)
		game.add.tween(bonusText1).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		var btween2 = game.add.tween(bonusText1.scale).to({x:1, y:1}, 250, Phaser.Easing.Cubic.In)
		btween1.chain(btween2)

		// var botTween1 = game.add.tween(bonusText2.scale).to({x:1, y:1}, 300, Phaser.Easing.Cubic.In, true, 200)
		game.add.tween(bonusText2).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		// var botTween2 = game.add.tween(bonusText2.scale).to({x:1, y:1}, 150, Phaser.Easing.Cubic.In)
		// botTween1.chain(botTween2)
		btween2.onComplete.add(function () {
			// game.add.tween(bonusText1.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Cubic.Out, true, 500)
			game.add.tween(bonusText1).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 500)
			var btween3 = game.add.tween(bonusText2).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 500)
			if(callback){
				btween3.onComplete.add(callback)
			}
		})

	}

	function onClickButton(obj) {
		startTimer = false

		var button = obj.parent
		game.add.tween(button.scale).to({x:1.2, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		for(var indexButton = 0; indexButton < buttonList.length; indexButton++){
			var buttonToTween = buttonList[indexButton]
			buttonToTween.img.inputEnabled = false
			if(buttonToTween !== button)
				game.add.tween(buttonToTween).to({alpha:0.5}, 300, Phaser.Easing.Cubic.Out, true)
		}
		buttonSelected = button
		game.add.tween(timerText.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		if(server)
			server.setAnswer(button.value)
		waitingGroup.tween = game.add.tween(waitingGroup).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)

		timeElapsed = 0

		//TODO sumScore test
		showPoints("Bien!", "+10000 x 3", function () {
			showPoints("Time Bonus", "+5000")
		})
		sumScore(10000)
	}
	
	function createGameObjects(){
		optionsGroup = game.add.group()
		sceneGroup.add(optionsGroup)

		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		for(var optionIndex = 0; optionIndex < MAX_OPTIONS; optionIndex++){
			var button = game.add.group()
			pullGroup.add(button)

			var buttonImg = button.create(0, 0, "atlas.operations", "button2")
			buttonImg.anchor.setTo(0.5, 0.5)
			var fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var buttonText = game.add.text(0,0,"0", fontStyle)
			buttonText.anchor.setTo(0.5, 0.5)
			button.add(buttonText)
			button.text = buttonText

			buttonImg.inputEnabled = false
			buttonImg.events.onInputDown.add(onClickButton)
			button.img = buttonImg

			buttonList.push(button)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.operations',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)

		return particle

	}

	function stopGame(win){

		//objectsGroup.timer.pause()
		//timer.pause()
		// operationsSong.stop()
		// clock.tween.stop()
		inputsEnabled = false
		server.removeEventListener("onTurnEnds", checkAnswer)
		server.removeEventListener("onGameEnds", showWinner)
		server.removeEventListener("showPossibleAnswers", startRound)

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){

			window.open("../mathClient/index.html", "_self")
			// var resultScreen = sceneloader.getScene("result")
			// resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number)
			// sceneloader.show("operations")
			// sound.play("gameLose")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = true;
		// game.load.audio('operationsSong', soundsPath + 'songs/wormwood.mp3');

		// game.load.image('introscreen',"images/operations/introscreen.png")
		// game.load.image('howTo',"images/operations/how" + localization.getLanguage() + ".png")
		// game.load.image('buttonText',"images/operations/play" + localization.getLanguage() + ".png")
		game.load.spine("loading", "images/spine/loading/skeleton.json")
		game.load.spine("miniEagle", "images/spine/miniYogotar/eagle.json")
		game.load.bitmapFont('WAG', 'fonts/WAG.png', 'fonts/WAG.xml');

		buttons.getImages(game)

	}

	function addNumberPart(obj,number){

		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world.x
		pointsText.y = obj.world.y
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

	function startRound() {
		isReady = true;

		timeElapsed = 0
		var currentOperation = server ? server.getCurrentOperation() : null;
		console.log(currentOperation)
		options = currentOperation && currentOperation.operation ?
			currentOperation.operation.possibleAnswers : [120, 200, 0]

		clientData = currentOperation ? currentOperation.operation : {
			operand1 : 88,
			operand2 : 8,
			operator : "/",
			result:10,
			correctAnswer : 10,
			type :"yei"
		}

		addButtons()
		generateEquation()
		equationGroup.alpha = 0
		equationGroup.scale.x = 0.4; equationGroup.scale.y = 0.4
		game.add.tween(equationGroup.scale).to({x:1, y:1}, 500, Phaser.Easing.Back.Out, true)
		game.add.tween(equationGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true)

		game.add.tween(differenceTimeText).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
		startTimer = true
	}
	
	function addToPull(obj) {
		pullGroup.add(obj)
	}
	
	function clearStage() {
		for(var buttonIndex = 0; buttonIndex < options.length; buttonIndex++){
			var button = buttonList[buttonIndex]
			var dissapear = game.add.tween(button).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
			dissapear.onComplete.add(addToPull)
			game.add.tween(button.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)
		}

		game.add.tween(equationGroup).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
		game.add.tween(equationGroup.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)

		game.add.tween(differenceTimeText).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
		game.add.tween(differenceTimeText.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)
		var resetTimer = game.add.tween(timerText).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
		resetTimer.onComplete.add(function () {
			timerText.text = "00:00"
			game.add.tween(timerText).to({alpha:1}, 200, Phaser.Easing.Cubic.In, true)
			game.add.tween(differenceTimeText.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		})
	}

	function generateEquation(){
		if(clientData.operator === "/"){
			equationGroup.equationText.text = clientData.operand2 + "ƒ" + clientData.operand1 + " =" + clientData.result
		}else{
			equationGroup.equationText.text = clientData.operand1 + clientData.operator + clientData.operand2 + "=" + clientData.result
		}

	}
	
	function checkAnswer(event) {
		for(var optionIndex = 0, numOptions = options.length; optionIndex < numOptions; optionIndex++) {
			var button = buttonList[optionIndex]
			console.log(clientData.correctAnswer, button.value)
			if (clientData.correctAnswer === button.value) {
				correctButton = button
			}
		}

		if(waitingGroup.tween)
			waitingGroup.tween.stop()
		game.add.tween(waitingGroup).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)

		switch ("?"){
			case clientData.operand1:
				clientData.operand1 = clientData.correctAnswer
				break
			case clientData.operand2:
				clientData.operand2 = clientData.correctAnswer
				break
			case clientData.result:
				clientData.result = clientData.correctAnswer
				break

		}
		generateEquation()
		game.add.tween(equationGroup.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		console.log(correctButton.value)
		if(correctButton.value !== buttonSelected.value){
			// tweenTint(buttonSelected.img, 0xffffff, 0xbc0a00, 200)
			buttonSelected.img.tint = 0xbc0a00
		}
		correctButton.img.tint = 0x00f414
		// tweenTint(correctButton.img, 0xffffff, 0x00f414, 200)

		console.log(event.timeDifference)
		if(event.timeDifference){
			var seconds = Math.floor(event.timeDifference * 0.001)
			var decimals = Math.floor(event.timeDifference * 0.01) % 10
			var centimals = (Math.floor(event.timeDifference / 10) % 10)
			// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
			var result = (seconds < 10) ? "0" + seconds : seconds;
			result += ":" + decimals + centimals

			if(server.numPlayer === event.numPlayer){
				differenceTimeText.text = "-" + result
				differenceTimeText.fill = "#00a413"
			}else{
				differenceTimeText.text = "+" + result
				differenceTimeText.fill = "#bc0a00"
			}

			game.add.tween(differenceTimeText).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
			game.add.tween(differenceTimeText.scale).to({x:1, y:1}, 300, Phaser.Easing.Back.Out, true)

			correctParticle.x = differenceTimeText.world.x
			correctParticle.y = differenceTimeText.world.y
			wrongParticle.x = differenceTimeText.world.x
			wrongParticle.y = differenceTimeText.world.y
		}else{
			correctParticle.x = buttonSelected.centerX
			correctParticle.y = buttonSelected.centerY
			wrongParticle.x = buttonSelected.centerX
			wrongParticle.y = buttonSelected.centerY
		}

		if(event.isCorrect){
			sound.play("magic")
			correctParticle.start(true, 1000, null, 5);
		}else{
			sound.play("wrong")
			wrongParticle.start(true, 1000, null, 5);
		}

		game.time.events.add(1000, startRound)

	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "IDLE"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
		// spineSkeleton.scale.setTo(0.8,0.8)
		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setAnimationByName(0, idleAnimation, true)
		spineSkeleton.autoUpdateTransform ()
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var loop = index === animations.length - 1
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, loop)
				else
					spineSkeleton.addAnimationByName(0, animation, loop)

			}

			if (args)
				entry.args = args

			if(onComplete){
				entry.onComplete = onComplete
			}

			return entry
		}

		spineGroup.setSkinByName = function (skin) {
			spineSkeleton.setSkinByName(skin)
			spineSkeleton.setToSetupPose()
		}

		spineGroup.setAlive = function (alive) {
			spineSkeleton.autoUpdate = alive
		}

		spineGroup.getSlotContainer = function (slotName) {
			var slotIndex
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.name === slotName){
					slotIndex = index
				}
			}

			if (slotIndex){
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineGroup.spine = spineSkeleton

		return spineGroup
	}
	
	function showWinner(event) {
		clearStage()
		var winnerNum = event.winner
		waitingGroup.loading.alpha = 0

		if(winnerNum === server.numPlayer){
			waitingGroup.waitText.text = localization.getString(localizationData, "youWin")
			waitingGroup.waitText.tint = 0x00A413
		}else{
			waitingGroup.waitText.text = localization.getString(localizationData, "bestLuck")
			waitingGroup.waitText.tint = 0xA40101
		}
		game.add.tween(waitingGroup).to({alpha:1},300, Phaser.Easing.Cubic.Out,true)
	}

	function sumScore(points) {
		var toX = skyBg.tilePosition.x - points * 0.05
		game.add.tween(skyBg.tilePosition).to({x:toX * 0.5}, 3000, null, true)
		var moveGround = game.add.tween(ground.tilePosition).to({x:toX}, 3000, null, true)
		miniEagle.setAnimation(["RUN"])
		moveGround.onComplete.add(function () {
			miniEagle.setAnimation(["IDLE"])
			var sumPoints = totalScore + points
			scoreText.text = sumPoints
		})

		moveGround.onUpdateCallback(function (tween, percent) {
			console.log(percent)
			var sumPoints = totalScore + Math.round(points * percent)
			scoreText.text = sumPoints
		})
	}

	return {
		assets: assets,
		name: "operations",
		preload:preload,
		update:function () {
			timeElapsed += game.time.elapsedMS
			if(startTimer){
				var seconds = Math.floor(timeElapsed * 0.001)
				var decimals = Math.floor(timeElapsed * 0.01) % 10
				var centimals = (Math.floor(timeElapsed / 10) % 10)
				// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
				var result = (seconds < 10) ? "0" + seconds : seconds;
				result += ":" + decimals + centimals
				timerText.text = result
			}else if(!isReady){
				if(timeElapsed > 500){
					timeElapsed = 0
					var equationText = equationGroup.equationText
					switch (equationText.text){
						case readyString:
							equationText.text = readyString+"."
							break
						case readyString+".":
							equationText.text = readyString+".."
							break
						case readyString+"..":
							equationText.text = readyString+"..."
							break
						case readyString+"...":
							equationText.text = readyString
							break
					}
				}
			}
		},
		create: function(event){

			sceneGroup = game.add.group()

			var background = game.add.graphics()
			background.beginFill(0xFF4560)
			background.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
			background.endFill()
			sceneGroup.add(background)

			initialize()

			// var playerData = server ? server.player : {nickname:"Nickname"}
			// var numPlayer = server ? server.numPlayer : 1
			// var textInfo = playerData.nickname + " " + numPlayer
			// var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			// var playerInfo = game.add.text(game.world.centerX,50,textInfo, fontStyle)
			// playerInfo.anchor.setTo(0.5, 0.5)
			// sceneGroup.add(playerInfo)

			equationGroup = game.add.group()
			equationGroup.x = game.world.centerX
			equationGroup.y = 80
			sceneGroup.add(equationGroup)

			readyString = localization.getString(localizationData, "ready")
			var fontStyle2 = {font: "72px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 480}
			var equationText = game.add.bitmapText(0,0,"WAG", readyString, 72)
			equationText.anchor.setTo(0.5, 0.5)
			equationGroup.add(equationText)
			equationGroup.equationText = equationText

			var fontStyle3 = {font: "52px Arial", fontWeight: "bold", fill: "#ffffff", align: "center"}
			timerText = game.add.text(game.world.centerX - 30,game.world.height - 80,"0:00", fontStyle3)
			timerText.anchor.setTo(0.5, 0.5)
			sceneGroup.add(timerText)

			var stopWatch = sceneGroup.create(0, 245, "atlas.operations", "stopwatch")
			stopWatch.x = game.world.centerX - 140
			stopWatch.y = game.world.height - 80
			stopWatch.anchor.setTo(0.5, 0.5)

			var fontStyle4 = {font: "42px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "left"}
			differenceTimeText = game.add.text(game.world.centerX + 110,250,"+0:00", fontStyle4)
			differenceTimeText.anchor.setTo(0.5, 0.5)
			differenceTimeText.fill = "#bc0a00"
			differenceTimeText.stroke = '#FFFFFF';
			differenceTimeText.strokeThickness = 6;
			differenceTimeText.alpha = 0
			sceneGroup.add(differenceTimeText)

			skyBg = game.add.tileSprite(0, 150, game.world.width, 128, "atlas.operations", "sky")
			sceneGroup.add(skyBg)
			ground = game.add.tileSprite(0, 278, game.world.width, 36, "atlas.operations", "ground")
			sceneGroup.add(ground)
			miniEagle = createSpine("miniEagle", "normal")
			sceneGroup.add(miniEagle)
			miniEagle.y = 278
			miniEagle.x = game.world.centerX - 180

			createGameObjects()
			// startRound(true)

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			var scoreFontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffd117", align: "left"}
			var scoreLabel = game.add.text(game.world.centerX - 65, 175, "Score:", scoreFontStyle)
			sceneGroup.add(scoreLabel)
			scoreLabel.anchor.setTo(0.5, 0.5)
			scoreLabel.stroke = '#FFFFFF';
			scoreLabel.strokeThickness = 5;

			scoreText = game.add.text(game.world.centerX + 50, 175, "0", scoreFontStyle)
			sceneGroup.add(scoreText)
			scoreText.anchor.setTo(0.5, 0.5)
			scoreText.stroke = '#FFFFFF';
			scoreText.strokeThickness = 5;

			var bonusFontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ff82f8", align: "center"}
			bonusText1 = game.add.text(game.world.centerX, 220, "¡Trio Perfecto!", bonusFontStyle)
			sceneGroup.add(bonusText1)
			bonusText1.anchor.setTo(0.5, 0.5)
			bonusText1.stroke = '#FFFFFF';
			bonusText1.strokeThickness = 5;
			bonusText1.alpha = 0

			var bonusFontStyle2 = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffd117", align: "center"}
			bonusText2 = game.add.text(game.world.centerX, 270, "+10000 x 3", bonusFontStyle2)
			sceneGroup.add(bonusText2)
			bonusText2.anchor.setTo(0.5, 0.5)
			bonusText2.stroke = '#FFFFFF';
			bonusText2.strokeThickness = 5;
			bonusText2.alpha = 0

			waitingGroup = game.add.group()
			waitingGroup.x = game.world.centerX
			waitingGroup.y = game.world.centerY
			sceneGroup.add(waitingGroup)

			var alphaRect = game.add.graphics()
			alphaRect.beginFill(0x000000)
			alphaRect.drawRect(-2, -2, game.world.width + 2, game.world.height + 2)
			alphaRect.endFill()
			alphaRect.x = -game.world.centerX - 1
			alphaRect.y = -game.world.centerY - 1
			alphaRect.alpha = 0.7
			waitingGroup.add(alphaRect)

			var stringWait = localization.getString(localizationData, "reviewingAnswers")
			// var fontStyle2 = {font: "72px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var waitText = game.add.text(0, -140, stringWait, fontStyle2)
			waitText.anchor.setTo(0.5, 0.5)
			waitingGroup.add(waitText)
			waitingGroup.alpha = 0
			waitingGroup.waitText = waitText

			var loading = createSpine("loading", "normal")
			console.log(loading.spine)
			loading.scale.setTo(0.6, 0.6)
			waitingGroup.add(loading)
			// console.log("width", player.width)
			loading.y = 100
			waitingGroup.loading = loading

			if(server){
				server.removeEventListener("onCompletedOperation", checkAnswer)
				// server.removeEventListener("onGameEnds", showWinner)
				// server.removeEventListener("showPossibleAnswers", startRound)
				server.addEventListener("onCompletedOperation", checkAnswer)
				// server.addEventListener("showPossibleAnswers", startRound)
				// server.addEventListener("onGameEnds", showWinner)
				// clientData.setReady(true)
				startRound()
			}else{
				game.time.events.add(1000, startRound)
			}

			// buttons.getButton(operationsSong,sceneGroup)
		}
	}
}()