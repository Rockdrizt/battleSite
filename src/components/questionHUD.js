
var questionHUD = function(){

	var OPTIONS_LETTER = ["A", "B", "C", "D"]

	function convertTimeFormat(timeElapsed) {
		var seconds = Math.floor(timeElapsed * 0.001)
		var decimals = Math.floor(timeElapsed * 0.01) % 10
		var centimals = (Math.floor(timeElapsed / 10) % 10)
		// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
		var result = (seconds < 10) ? "0" + seconds : seconds;
		result += ":" + decimals + centimals

		return result
	}

	function update() {
		this.timeElapsed += game.time.elapsedMS
		//this.time = convertTimeFormat(this.timeElapsed)
	}

	function initialize(){

	}
	
	function createQuestionOverlay(clientConfig){

		var questionGroup = game.add.group()

		var black = game.add.graphics()
		black.beginFill(0x000000)
		black.drawRect(0,0,game.world.width, game.world.height)
		black.endFill()
		black.alpha = 0.5
		questionGroup.add(black)
		questionGroup.black = black

		var board = questionGroup.create(game.world.centerX, game.world.centerY - 20, "questionBoard")
		board.anchor.setTo(0.5)
		questionGroup.mainBoard = board

		var questionText = createQuestionText(board)
		questionText.x = board.x - board.width * 0.44
		questionText.y = board.y - board.height * 0.39
		questionGroup.add(questionText)
		questionGroup.question = questionText

		var questionImage = createQuesitonImage()
		questionImage.x = board.x - board.width * 0.175
		questionImage.y = board.y + board.height * 0.285
		questionGroup.add(questionImage)
		questionGroup.image = questionImage

		var buttonsGroup = createButtonsGroup()
		buttonsGroup.x = board.x + board.width * 0.3
		buttonsGroup.y = board.y + 30
		questionGroup.add(buttonsGroup)
		questionGroup.buttons = buttonsGroup

		if(clientConfig){

			var callInputAnswer = inputOption.bind(questionGroup)

			buttonsGroup.options.forEach(function(btn){
				btn.inputEnabled = true
				btn.events.onInputDown.add(callInputAnswer)
			})
		}
		buttonsGroup.options.setAll("inputEnabled", false)
		buttonsGroup.options.btnPressed = null

		chronoGroup = createChrono()
		chronoGroup.x = board.x - board.width * 0.35
		chronoGroup.y = game.world.height - chronoGroup.height * 0.5//board.y + board.height * 0.6
		questionGroup.add(chronoGroup)
		questionGroup.chrono = chronoGroup

		questionGroup.client = false
		questionGroup.timeElapsed = 0

		questionGroup.showQuestion = showQuestion.bind(questionGroup)
		questionGroup.showYesImage = showYesImage.bind(questionGroup)
		questionGroup.showNoImage = showNoImage.bind(questionGroup)
		questionGroup.setQuestion = setQuestion.bind(questionGroup)
		questionGroup.hide = hideOverlay.bind(questionGroup)
		questionGroup.removeImage = removeImage.bind(questionGroup)
		questionGroup.update = update.bind(questionGroup)
        questionGroup.startTimer = startTimer.bind(questionGroup)
		questionGroup.stopTimer = stopTimer.bind(questionGroup)
		questionGroup.updateTimer = updateTimer.bind(questionGroup)
		questionGroup.clearQuestion = clearQuestion.bind(questionGroup)
		questionGroup.alpha = 0
		questionGroup.totalDelay = 0

		if(clientConfig){
			questionGroup.client = true
			questionGroup.bringToTop(black)
			black.alpha = 0

			var usedOptions = game.add.group()
			usedOptions.x = buttonsGroup.x
			usedOptions.y = buttonsGroup.y
			questionGroup.add(usedOptions)
			questionGroup.usedOptions = usedOptions

			createWaiting(questionGroup)
			createFeedback(questionGroup)
			
			questionGroup.showFeedback = showFeedback.bind(questionGroup)
			questionGroup.getCorrectAns = getCorrectAns.bind(questionGroup)
		}

		return questionGroup
	}

	function createQuestionText(board){

		var fontStyle = {font: "100px VAGRounded", 
							fill: "#FFFFFF", 
							boundsAlignH: "center", 
							boundsAlignV: "middle", 
							align: 'left', 
							wordWrap: true
						}

		var textGroup = game.add.group()
		textGroup.minSize = 55
		textGroup.maxSize = 100
		textGroup.alpha = 0

		var textBox = game.add.graphics()
		textBox.beginFill(0x000000, 0)
		textBox.drawRect(0, 0, board.width * 0.53, board.height - 90)
		textBox.endFill()
		textGroup.add(textBox)
		textGroup.textBox = textBox

		var smallBox = game.add.graphics()
		smallBox.beginFill(0x000000, 0)
		smallBox.drawRect(0, 0, board.width * 0.53, board.height * 0.47)
		smallBox.endFill()
		textGroup.add(smallBox)
		textGroup.smallBox = smallBox

		var text = new Phaser.Text(textGroup.game, textBox.centerX, 0, "", fontStyle)
		text.anchor.setTo(0.5, 0)
		text.wordWrapWidth = textBox.width
		text.stroke = "#000066"
		text.lineSpacing = -17
		text.strokeThickness = 6
		textGroup.add(text)
		textGroup.text = text
	
		textGroup.restore = restore.bind(textGroup)
		textGroup.fixText = fixText.bind(textGroup)

		function restore(){
			this.alpha = 0
			this.text.fontSize = this.maxSize
		}

		function fixText(image){

			var box = image ? this.smallBox : this.textBox

			if(this.text.height > box.height){
				this.text.fontSize--
				return this.fixText(image)
			}
			else{
				return
			}
		}
		
		return textGroup
	}

	function createQuesitonImage(){

		var imageGroup = game.add.group()
		
		var container = imageGroup.create(0, 0, "atlas.question", "questionImage")
		container.anchor.setTo(0.5)
		container.scale.setTo(1,0)
		imageGroup.container = container

		var img = imageGroup.create(container.x, container.y, "default")
		img.anchor.setTo(0.5)
		img.scale.setTo(1.3)
		img.alpha = 0
		img.key = ""
		imageGroup.image = img

		imageGroup.restore = restore.bind(imageGroup)

		function restore(){
			this.image.alpha = 0
			this.container.scale.setTo(1,0)
		}
		
		return imageGroup
	}

	function createButtonsGroup(){

		var buttonsGroup = game.add.group()
		//buttonsGroup.alpha = 0

		var btnBoard = buttonsGroup.create(0, 0, "atlas.question", "btnBoard")
		btnBoard.anchor.setTo(0.5)
		buttonsGroup.board = btnBoard

		var options = game.add.group()
		buttonsGroup.add(options)
		buttonsGroup.options = options

		var pivotY = -btnBoard.height * 0.35

		for(var i = 0; i < 4; i++){

			var btn = createButton(OPTIONS_LETTER[i], options)
			btn.x = btnBoard.x
			btn.y = pivotY

			btn.spawn = {x: btn.x, y: btn.y}
			btn.groupPos = i
			options.add(btn)

			pivotY += btnBoard.height / 4.2
		}

		buttonsGroup.restore = restore.bind(buttonsGroup)	

		function restore(){

			this.alpha = 0
			this.options.btnPressed = null

			for(var i = 0; i < this.options.length; i++){
				var opt = this.options.children[i]
				opt.alpha = 0
				opt.correct = false
				opt.angle = 0
				opt.blue.alpha = 0
				opt.info.alpha = 0
				opt.info.text = ""
				opt.info.fontSize = opt.maxSize
			}
		}

		return buttonsGroup
	}

	function createButton(opt, group){

		var fontStyle = {font: "65px VAGRounded", fill: "#FFFFFF", align: "center", wordWrap: true}

		var btn = game.add.sprite(0, 0, "atlas.question", "questionBtn")
		btn.anchor.setTo(0.5)
		btn.alpha = 0
		btn.maxSize = 70
		btn.correct = false

		var textBox = game.add.graphics(-110, -55)
		textBox.beginFill(0x000000, 0)
		textBox.drawRect(0, 0, btn.width * 0.6, btn.height - 60)
		textBox.endFill()
		btn.addChild(textBox)
		btn.textBox = textBox

		var blue = game.add.sprite(-8, -3, "atlas.question", "blueBtn")
		blue.anchor.setTo(0.5)
		blue.alpha = 0
		btn.addChild(blue)
		btn.blue = blue

		var letter = new Phaser.Text(group.game, -btn.width * 0.355, 0, opt, fontStyle)
		letter.anchor.setTo(0.5)
		btn.addChild(letter)
		btn.letter = letter

		var info = new Phaser.Text(group.game, 40, 5, "", fontStyle)
		info.anchor.setTo(0.5)
        info.alpha = 0
		info.wordWrapWidth = textBox.width
		info.lineSpacing = -20
		btn.addChild(info)
		btn.info = info

		btn.fixText = fixText.bind(btn)

		function fixText(){

			if(this.info.height > this.textBox.height){
				this.info.fontSize -= 2
				return this.fixText()
			}
			else{
				return
			}
		}
		
		return btn
	}

	function createChrono(){

		var fontStyle = {font: "75px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}

		var chronoGroup = game.add.group()
		chronoGroup.alpha = 0
		chronoGroup.scale.setTo(0.9)
		chronoGroup.maxTime = 20000

		var cont = chronoGroup.create(0, 0, "atlas.question", "yellowCircle")
		cont.anchor.setTo(0.5)

		var timeGauge = chronoGroup.create(50, 0, "atlas.question", "timeGauge")
		timeGauge.anchor.setTo(0.5)
		chronoGroup.timeGauge = timeGauge

		var timeText = new Phaser.Text(chronoGroup.game, 50, 0, "0:20", fontStyle)
		timeText.anchor.setTo(0.5)
		chronoGroup.add(timeText)
		chronoGroup.timeText = timeText

		var circle = game.add.graphics(50, 0)
		circle.beginFill(0xFF0000, 0.5)
		circle.lineSize = timeGauge.width * 0.55
		circle.arc(0, 0, circle.lineSize, game.math.degToRad(290), game.math.degToRad(-10), true)
		circle.endFill()
		chronoGroup.add(circle)
		chronoGroup.circle = circle
		timeGauge.mask = circle

		chronoGroup.restore = restore.bind(chronoGroup)

		function restore(){
			this.alpha = 0
			this.timeText.setText("0:20")
			this.circle.clear()
			this.circle.beginFill(0xFF0000, 0.5)
			this.circle.arc(0, 0, this.circle.lineSize, game.math.degToRad(290), game.math.degToRad(-10), true)
			this.circle.endFill()
		}

		return chronoGroup
	}

	function createWaiting(hud){

		var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var waitGroup = game.add.group()
		waitGroup.alpha = 0
		hud.add(waitGroup)
		hud.waiting = waitGroup

		var spiner = game.add.sprite(game.world.centerX, game.world.centerY - 230, "logoAtlas", "spiner")
		spiner.anchor.setTo(0.5)
		spiner.scale.setTo(1.2)
		waitGroup.add(spiner)
		waitGroup.spiner = spiner

		var text = new Phaser.Text(waitGroup.game, spiner.x, spiner.y + 220, "  Esperando...", fontStyle)
		text.anchor.setTo(0.5)
		text.stroke = "#000000"
		text.strokeThickness = 5
		waitGroup.add(text)
	}

	function createFeedback(hud){

		var feedImg = hud.create(game.world.centerX, game.world.centerY - 100, "atlas.question", "correct")
		feedImg.anchor.setTo(0.5)
		feedImg.alpha = 0
		hud.feedBackImg = feedImg
	}
	//

	function showQuestion(riddle){

		this.timeElapsed = 0
		this.riddle = riddle
		this.answered = false
		//this.chrono.date = riddle.date

		this.chrono.maxTime = this.riddle.timers.normal
		var maxTime = convertTime(this.chrono.maxTime)
		this.chrono.timeText.setText(maxTime)

		this.question.text.setText(this.riddle.question)
		this.question.fixText(this.riddle.existImage)
        
        this.setQuestion()

		for(var i = 0; i < riddle.answers.length; i++){
			var opt = this.buttons.options.children[i]
			opt.value = riddle.answers[i]
			opt.info.text = riddle.answers[i]
			opt.fixText()
			opt.correct = riddle.correctAnswer == riddle.answers[i]
		}

		if(riddle.existImage){
			game.load.image(this.riddle.image, this.riddle.src)
			game.load.onLoadComplete.add(this.showYesImage)
			game.load.start()
		}
		else{
			this.showNoImage()
		}
	}

	function showNoImage(){

		var toAlpha = 1//this.client ? 1 : 0
		var apearOverlay = game.add.tween(this).to({alpha: toAlpha}, 100, Phaser.Easing.Cubic.Out, true)
		var apearButtons = game.add.tween(this.buttons).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false)
		var apearChrono = game.add.tween(this.chrono).from({x: -400}, 300, Phaser.Easing.Cubic.Out, false)
		apearOverlay.chain(apearButtons)
		apearButtons.chain(apearChrono)

		apearChrono.onStart.add(function(){
			this.chrono.alpha = 1
		},this)
		
		apearButtons.onComplete.add(function(){
			
			this.chrono.alpha = 1
			var delay = 200
			var lasTween

			for (var i = 0; i < this.buttons.options.length; i++) {
				const opt = this.buttons.options.children[i]
				opt.info.alpha = 0
				lasTween = game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
				delay += 200
			}

			//lasTween.onComplete.add(this.setQuestion)
			this.totalDelay += 2500
		},this)
	}

	function showYesImage(){

		var toAlpha = 1//this.client ? 1 : 0
		this.image.image.loadTexture(this.riddle.image)
		this.image.image.key = this.riddle.image

		var apearOverlay = game.add.tween(this).to({alpha: toAlpha}, 100, Phaser.Easing.Cubic.Out, true)
		var apearButtons = game.add.tween(this.buttons).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false)
		var apearChrono = game.add.tween(this.chrono).from({x: -400}, 300, Phaser.Easing.Cubic.Out, false)
		var scaleContainer = game.add.tween(this.image.container.scale).to({y: 1}, 300, Phaser.Easing.Cubic.Out, false)
		apearOverlay.chain(apearButtons)
		apearButtons.chain(apearChrono)
		apearChrono.chain(scaleContainer)

		apearChrono.onStart.add(function(){
			this.chrono.alpha = 1
		},this)
		
		apearButtons.onComplete.add(function(){
            
			this.chrono.alpha = 1
			var delay = 200
			var lasTween

			for (var i = 0; i < this.buttons.options.length; i++) {
				const opt = this.buttons.options.children[i]
				opt.info.alpha = 0
				lasTween = game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
				delay += 200
			}

			var scaleImage = game.add.tween(this.image.image).to({alpha: 1}, 300, Phaser.Easing.Cubic.InOut, false)
			//scaleImage.onStart.add(this.setQuestion)
			lasTween.chain(scaleImage)

			this.totalDelay += 3100
		},this)
	}
    
    function setQuestion(){
			
//        for(var i = 0; i < this.buttons.options.length; i++){
//			var opt = this.buttons.options.children[i]
//			game.add.tween(opt.info).to({alpha:1}, 300, Phaser.Easing.linear, true)
//			opt.inputEnabled = true
//		}

		game.add.tween(this.question).to({alpha:1}, 300, Phaser.Easing.linear, true, 300)
		this.totalDelay += 600

		// if(!this.client) {
		// 	server.setDate()
		// }
        //this.startTimer()
    }

	function hideOverlay(){

		var fadeOut = game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.linear, true)
	
		fadeOut.onComplete.add(function(){

			this.question.restore()
			this.image.restore()
			this.buttons.restore()
			this.chrono.restore()

		},this)
	}

	function removeImage(){
		//console.log(game.cache.checkImageKey(image))
		var image = this.image.image.key
		if(game.cache.checkImageKey(image)){
			console.log(image)
			game.cache.removeImage(image, false)
		}
		//console.log(game.cache.checkImageKey(image))
	}

	function inputOption(btn){
		if(this.answered)
			return

		if(this.timer){
			this.timer.stop(true)
			this.timer.destroy()
		}
		else
			return

		this.answered = true
		sound.play("shineSpell")
		this.buttons.options.btnPressed = btn
		this.buttons.options.setAll("inputEnabled", false)
		this.buttons.options.remove(btn)
		this.usedOptions.add(btn)

		this.waiting.spin = game.add.tween(this.waiting.spiner).to({angle: -360}, 2000, Phaser.Easing.linear, true)
		this.waiting.spin.repeat(-1)
		game.add.tween(this.black).to({alpha:0.5}, 300, Phaser.Easing.linear, true)
		game.add.tween(this.waiting).to({alpha:1}, 300, Phaser.Easing.linear, true)

		var event = {time : this.timeElapsed, value : btn.groupPos}
		if(this.callback) this.callback(event)
	}

	function showFeedback(){
		
		if(this.waiting.spin){
			this.waiting.spin.stop()
		}

		if(this.timer){
			this.timer.stop(true)
			this.timer.destroy()
		}

		var riddle = this.riddle
		var correctBtn = this.getCorrectAns()
		var btn = this.buttons.options.btnPressed
		if(!btn)
			return

		var ans = btn.groupPos == riddle.correctAnswer
		var texture = ans ? "correct" : "wrong"

		this.feedBackImg.loadTexture("atlas.question", texture)
		var apearMsg = game.add.tween(this.feedBackImg).to({alpha:1}, 300, Phaser.Easing.linear, false)

		apearMsg.onComplete.add(function(){

			var self = this
			self.waiting.spiner.angle = 0

			if(ans){
				var endTween = game.add.tween(btn.blue).to({alpha:1}, 200, Phaser.Easing.linear, true)
			}
			else{
				game.add.tween(correctBtn.blue).to({alpha:1}, 200, Phaser.Easing.linear, true, 700).onStart.add(function(){
					self.buttons.options.remove(correctBtn)
					self.usedOptions.addAt(correctBtn, self.usedOptions.length)
				})
				var endTween = game.add.tween(btn).to({angle: -30}, 800, Phaser.Easing.Bounce.Out, true, 800)
			}

			endTween.onComplete.add(function(){
				game.time.events.add(3000, self.clearQuestion)
			})
		}, this)

		game.add.tween(this.waiting).to({alpha:0}, 300, Phaser.Easing.linear, true).chain(apearMsg)
	}

	function showTimeUp(){

		this.feedBackImg.loadTexture("atlas.question", texture)
		var apearMsg = game.add.tween(this.feedBackImg).to({alpha:1}, 300, Phaser.Easing.linear, false)
	}

	function getCorrectAns(){

		for(var i = 0 ; i < this.buttons.options.length; i++){
			var opt = this.buttons.options.children[i]
			if(opt.value == this.riddle.correctValue)
				return opt
		}
	}

	function clearQuestion(){

		var fadeOut = game.add.tween(this.black).to({alpha:0}, 300, Phaser.Easing.linear, true)
		
		this.totalDelay = 0
		fadeOut.onComplete.add(function(){

			game.add.tween(this.feedBackImg).to({alpha:0}, 300, Phaser.Easing.linear, true)

			var totalUsed = this.usedOptions.length

			for(var i = 0; i < totalUsed; i++){
				var used = this.usedOptions.children[0]
				this.usedOptions.remove(used)
				this.buttons.options.add(used)
			}

			this.buttons.options.sort("groupPos", Phaser.Group.SORT_ASCENDING)
			if(this.riddle.existImage) this.removeImage()
			this.hide()

		},this)
	}
    
    function startTimer(serverTimer){

		var currDate = new Date()
		var currTime = currDate.getTime()
		var timeDiff = serverTimer - currTime
		var maxTime = this.chrono.maxTime - timeDiff
		this.timeElapsed = 0
        
        for(var i = 0; i < this.buttons.options.length; i++){
			var opt = this.buttons.options.children[i]
			game.add.tween(opt.info).to({alpha:1}, 300, Phaser.Easing.linear, true)
			opt.inputEnabled = true
		}

		if(this.timer) {
        	this.timer.stop(true)
			this.timer.destroy()
		}

        this.timer = game.time.create()
		this.timerEvent = this.timer.add(maxTime, this.stopTimer, this)
		this.timer.loop(1000, updateTimer, this)
        this.timer.start()
		console.log("time start")
	}
	
	function updateTimer(){

		var time = this.timerEvent.delay - this.timer.ms
		time = Phaser.Math.clamp(time, 0, this.chrono.maxTime)
		var text = convertTime(time)
		this.chrono.timeText.setText(text)

		var size = game.math.degToRad((290/this.timerEvent.delay)*(time))
		this.chrono.circle.clear()
        this.chrono.circle.beginFill(0xFF0000, 0.5)
        this.chrono.circle.arc(0, 0, this.chrono.circle.lineSize, size, this.game.math.degToRad(-10), true)
		this.chrono.circle.endFill()
	}
    
    function stopTimer(){
		this.timer.stop(true)
		this.timer.destroy()
		this.chrono.timeText.setText("0:00")
		if(this.timeOutCallback) this.timeOutCallback()

		if(this.client){
			this.buttons.options.setAll("inputEnabled", false)
			this.feedBackImg.loadTexture("atlas.question", "timeOut")
			game.add.tween(this.black).to({alpha:0.5}, 300, Phaser.Easing.linear, true)
			game.add.tween(this.feedBackImg).to({alpha:1}, 300, Phaser.Easing.linear, true)
		}
	}
	
	function convertTime(time) {

		var min = Math.floor(time / 60000)
		var sec = Math.round((time % 60000) / 1000)

		return min + ":" + (sec < 10 ? '0' : '') + sec
	}

	return{
		initialize:initialize,
		createQuestionOverlay:createQuestionOverlay,
	}

}()
