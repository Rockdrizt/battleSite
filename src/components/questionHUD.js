
var questionHUD = function(){

	var OPTIONS_LETTER = ["A", "C", "B", "D"]

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
		this.time = convertTimeFormat(this.timeElapsed)
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

		var board = questionGroup.create(game.world.centerX, game.world.centerY + 30, "questionBoard")
		board.anchor.setTo(0.5)
		board.scale.setTo(1, 0.7)
		board.DEFAULT_SCALE = 0.7
		board.SECOND_SCALE = 1
		questionGroup.mainBoard = board

		var top = questionGroup.create(board.centerX - 28, board.y - board.height * 0.5, "atlas.question", "questionBox")
		top.anchor.setTo(0.5, 0)
		top.y -= 85
		top.DEFAULT_Y = top.y
		top.SECOND_Y = 0
		questionGroup.topBoard = top

		var questionText = createQuestionText(board)
		questionText.x = board.x - board.width * 0.5
		questionText.y = (board.y - board.height * 0.5) - 15
		questionText.DEFAULT_Y = questionText.y
		questionText.SECOND_Y = 75
		questionGroup.add(questionText)
		questionGroup.question = questionText

		var questionImage = createQuesitonImage()
		questionImage.x = board.x
		questionImage.y = board.y - 50
		questionGroup.add(questionImage)
		questionGroup.image = questionImage

		var buttonsGroup = createButtonsGroup(questionGroup)
		buttonsGroup.x = board.x
		buttonsGroup.y = board.y - 30
		buttonsGroup.DEFAULT_Y = buttonsGroup.y
		buttonsGroup.SECOND_Y = board.y + 130
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
		chronoGroup.x = board.x - board.width * 0.57
		chronoGroup.y = board.y * 1.5
		questionGroup.add(chronoGroup)
		questionGroup.chrono = chronoGroup

		questionGroup.client = false
		questionGroup.timeElapsed = 0

		questionGroup.showQuestion = showQuestion.bind(questionGroup)
		questionGroup.showSecondOverlay = showSecondOverlay.bind(questionGroup)
		questionGroup.showFirstOverlay = showFirstOverlay.bind(questionGroup)
		questionGroup.setQuestion = setQuestion.bind(questionGroup)
		questionGroup.hide = hideOverlay.bind(questionGroup)
		questionGroup.removeImage = removeImage.bind(questionGroup)
		questionGroup.update = update.bind(questionGroup)
        questionGroup.startTimer = startTimer.bind(questionGroup)
		questionGroup.stopTimer = stopTimer.bind(questionGroup)
		questionGroup.updateTimer = updateTimer.bind(questionGroup)
		questionGroup.clearQuestion = clearQuestion.bind(questionGroup)
		questionGroup.alpha = 0

		if(clientConfig){
			questionGroup.client = true
			questionGroup.x += 50
			questionGroup.bringToTop(black)
			black.alpha = 0
			black.x -= 50
			//createTeamName(questionGroup)
			createWaiting(questionGroup)
			createFeedback(questionGroup)
			
			var usedOptions = game.add.group()
			usedOptions.x = buttonsGroup.x
			usedOptions.y = buttonsGroup.y
			usedOptions.DEFAULT_Y = usedOptions.y
			questionGroup.add(usedOptions)
			questionGroup.usedOptions = usedOptions
			
			questionGroup.showFeedback = showFeedback.bind(questionGroup)
			questionGroup.getCorrectAns = getCorrectAns.bind(questionGroup)
		}

		return questionGroup
	}

	function createTeamName(hud){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var board = hud.board
		var teamName = new Phaser.Text(hud.game, board.x, board.y, "", fontStyle)
		teamName.anchor.setTo(0, 0.5)
		teamName.stroke = "#000066"
		teamName.strokeThickness = 10
		hud.add(teamName)
		hud.teamName = teamName
	}

	function createQuestionText(board){

		var fontStyle = {font: "60px VAGRounded", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true}

		var textGroup = game.add.group()
		textGroup.alpha = 0

		var textBox = game.add.graphics()
		textBox.beginFill(0x000000, 0)
		textBox.drawRect(15, 5, board.width - 30, (board.height * 0.4) - 20)
		textBox.endFill()
		textGroup.add(textBox)
		textGroup.textBox = textBox

		var text = new Phaser.Text(textGroup.game, textBox.centerX, textBox.centerY + 10, "", fontStyle)
		text.anchor.setTo(0.5)
		text.wordWrapWidth = textBox.width * 0.9
		text.stroke = "#000066"
		text.lineSpacing = -17
		text.strokeThickness = 5
		textGroup.add(text)
		textGroup.text = text
		text.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")

		textGroup.restore = restore.bind(textGroup)

		function restore(){
			this.alpha = 0
			this.y = this.DEFAULT_Y
			this.text.scale.setTo(1)
			this.text.wordWrapWidth = this.textBox.width * 0.9
		}

		return textGroup
	}

	function createQuesitonImage(){

		var imageGroup = game.add.group()
		imageGroup.big = 1.5
		
		var container = imageGroup.create(0, 0, "atlas.question", "questionImage")
		container.anchor.setTo(0.5)
		container.scale.setTo(1,0)
		container.DEFAULT_SCALE = 0
		container.SECOND_SCALE = 1
		imageGroup.container = container

		var img = imageGroup.create(container.x, container.y, "default")
		img.anchor.setTo(0.5)
		img.scale.setTo(0)
		img.DEFAULT_SCALE = 0
		img.key = ""
		imageGroup.image = img

		imageGroup.restore = restore.bind(imageGroup)

		function restore(){

			this.image.scale.setTo(0)
			this.container.scale.setTo(1,0)
		}
		
		return imageGroup
	}

	function createButtonsGroup(questionGroup){

		var buttonsGroup = game.add.group()
		buttonsGroup.alpha = 0

		var btnBoard = buttonsGroup.create(0, 0, "atlas.question", "btnBoard")
		btnBoard.anchor.setTo(0.5, 0)
		buttonsGroup.board = btnBoard

		var options = game.add.group()
		buttonsGroup.add(options)
		buttonsGroup.options = options

		var pivotX = btnBoard.x - btnBoard.width * 0.2
		var pivotY = btnBoard.y + 100
		var rise = btnBoard.width * 0.45

		for(var i = 0; i < 4; i++){

			var btn = createButton(OPTIONS_LETTER[i], options)

			btn.x = i % 2 == 0 ? pivotX : pivotX + rise
			btn.y = pivotY
			if(i > 1){
				btn.y += 150
			}

			btn.spawn = {x: btn.x, y: btn.y}
			btn.groupPos = i
			options.add(btn)
		}

		buttonsGroup.restore = restore.bind(buttonsGroup)	

		function restore(){

			this.alpha = 0
			this.y = this.DEFAULT_Y
			this.options.btnPressed = null

			for(var i = 0; i < this.options.length; i++){
				var opt = this.options.children[i]
				opt.alpha = 0
				opt.correct = false
				opt.angle = 0
				opt.blue.alpha = 0
				opt.info.alpha = 0
				opt.info.text = ""
				opt.info.wordWrapWidth = opt.width * 0.5
			}
		}

		return buttonsGroup
	}

	function createButton(opt, group){

		var fontStyle = {font: "60px VAGRounded", fill: "#FFFFFF", align: "center", wordWrap: true}

		var btn = game.add.sprite(0, 0, "atlas.question", "questionBtn")
		btn.anchor.setTo(0.5)
		btn.alpha = 0
		btn.correct = false

		var blue = game.add.sprite(-8, -3, "atlas.question", "blueBtn")
		blue.anchor.setTo(0.5)
		blue.alpha = 0
		btn.addChild(blue)
		btn.blue = blue

		var letter = new Phaser.Text(group.game, -btn.width * 0.355, 0, opt, fontStyle)
		letter.anchor.setTo(0.5)
		btn.addChild(letter)
		btn.letter = letter

		var info = new Phaser.Text(group.game, 25, 5, "", fontStyle)
		info.anchor.setTo(0.5)
        info.alpha = 0
		info.wordWrapWidth = btn.width * 0.5
		info.lineSpacing = -15
		btn.addChild(info)
		btn.info = info

		return btn
	}

	function createChrono(){

		var fontStyle = {font: "75px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}

		var chronoGroup = game.add.group()
		chronoGroup.alpha = 0
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
		circle.lineStyle(40, 0xFF0000, 0.5)
		circle.lineSize = timeGauge.width * 0.45
		circle.arc(0, 0, circle.lineSize, game.math.degToRad(-10), game.math.degToRad(280), false)
		circle.endFill()
		chronoGroup.add(circle)
		chronoGroup.circle = circle
		timeGauge.mask = circle

		chronoGroup.restore = restore.bind(chronoGroup)

		function restore(){
			this.alpha = 0
			this.timeText.setText("0:20")
			this.circle.clear()
			this.circle.lineStyle(40, 0xFF0000, 0.5)
			this.circle.arc(0, 0, this.circle.lineSize, game.math.degToRad(-10), game.math.degToRad(280), false)
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

		if(!this.client) return

		if(riddle.existImage){
			game.load.image(this.riddle.image, this.riddle.src)
			game.load.onLoadComplete.add(this.showSecondOverlay)
			game.load.start()
		}
		else{
			this.showFirstOverlay()
		}
	}

	function showFirstOverlay(){

		this.chrono.maxTime = this.riddle.timers.normal
		var maxTime = convertTime(this.chrono.maxTime)
		this.chrono.timeText.setText(maxTime)

		var apearOverlay = game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)
		var apearButtons = game.add.tween(this.buttons).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false)
		var apearChrono = game.add.tween(this.chrono).from({x: -400}, 300, Phaser.Easing.Cubic.Out, false)
		apearOverlay.chain(apearButtons)
		apearButtons.chain(apearChrono)

		apearButtons.onComplete.add(function(){
			
			this.chrono.alpha = 1
			var delay = 200
			var lasTween

			for (let i = 0; i < this.buttons.options.length; i++) {
				const opt = this.buttons.options.children[i]
				opt.info.alpha = 0
				lasTween = game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
				delay += 200
			}

			lasTween.onComplete.add(this.setQuestion)
		},this)
	}

	function showSecondOverlay(){
		
		this.image.image.loadTexture(this.riddle.image)
		this.image.image.key = this.riddle.image

		this.chrono.maxTime = this.riddle.timers.normal
		var maxTime = convertTime(this.chrono.maxTime)
		this.chrono.timeText.setText(maxTime)

		this.buttons.y = this.buttons.SECOND_Y
		this.question.y = this.question.SECOND_Y
		this.usedOptions.y = this.buttons.y

		var apearOverlay = game.add.tween(this).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, true)
		var scaleBoard = game.add.tween(this.mainBoard.scale).to({y: 1}, 300, Phaser.Easing.Cubic.Out, false)
		var moveTop = game.add.tween(this.topBoard).to({y: this.topBoard.SECOND_Y}, 300, Phaser.Easing.Cubic.Out, false)
		var scaleContainer = game.add.tween(this.image.container.scale).to({y: this.image.container.SECOND_SCALE}, 300, Phaser.Easing.Cubic.Out, false)
		var apearButtons = game.add.tween(this.buttons).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false)
		var apearChrono = game.add.tween(this.chrono).from({x: -400}, 300, Phaser.Easing.Cubic.Out, false)

		apearOverlay.chain(scaleBoard)
		scaleBoard.onStart.add(function(){
			moveTop.start()
			scaleContainer.start()
		})
	
		scaleContainer.chain(apearButtons)
		apearButtons.chain(apearChrono)

		apearButtons.onComplete.add(function(){
			
			this.chrono.alpha = 1
			var delay = 200
			var lasTween

			for (let i = 0; i < this.buttons.options.length; i++) {
				const opt = this.buttons.options.children[i]
				opt.info.alpha = 0
				lasTween = game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
				delay += 200
			}

			var scaleImage = game.add.tween(this.image.image.scale).to({x: this.image.big, y: this.image.big}, 300, Phaser.Easing.Cubic.InOut, true, delay)
			scaleImage.onComplete.add(this.setQuestion)
		},this)
	}
    
    function setQuestion(){
		
		var riddle = this.riddle
		this.question.text.setText(riddle.question)
		fixText(this.question.text, this.question.textBox, 1)
        
        for(var i = 0; i < riddle.answers.length; i++){
			var opt = this.buttons.options.children[i]
			opt.value = riddle.answers[i]
			opt.info.text = riddle.answers[i]
			opt.correct = riddle.correctAnswer == riddle.answers[i]
			game.add.tween(opt.info).to({alpha:1}, 300, Phaser.Easing.linear, true)
			opt.inputEnabled = true
		}

        game.add.tween(this.question).to({alpha:1}, 300, Phaser.Easing.linear, true)
        
        this.startTimer()
    }

	function fixImage(image, container, scale){
		image.scale.setTo(scale)
		if(image.height > container.height){
			return fixImage(image, container, scale - 0.1)
		}
		else{
			image.scale.setTo(0)
			image.alpha = 1
			return scale
		}
	}

	function fixText(text, warp, scale){

		text.scale.setTo(scale)
		if(text.height > warp.height){
			text.wordWrapWidth += warp.width * 0.09
			return fixText(text, warp, scale - 0.05)
		}
		else{
			return
		}
	}

	function hideOverlay(){

		var fadeOut = game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.linear, true)
	
		fadeOut.onComplete.add(function(){

			this.mainBoard.scale.setTo(1, this.mainBoard.DEFAULT_SCALE)
			this.topBoard.y = this.topBoard.DEFAULT_Y
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

		if(this.timer){
			this.timer.stop()
			this.timer.destroy()
		}

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

		var riddle = this.riddle
		var correctBtn = this.getCorrectAns()
		var btn = this.buttons.options.btnPressed
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
		
		fadeOut.onComplete.add(function(){

			game.add.tween(this.feedBackImg).to({alpha:0}, 300, Phaser.Easing.linear, true)
			//game.add.tween(this.image).to({alpha:0}, 300, Phaser.Easing.linear, true)
			//game.add.tween(this.question).to({alpha:0}, 300, Phaser.Easing.linear, true)

			var totalUsed = this.usedOptions.length

			for(var i = 0; i < totalUsed; i++){
				var used = this.usedOptions.children[0]
				this.usedOptions.remove(used)
				this.buttons.options.add(used)
			}

			this.buttons.options.sort("groupPos", Phaser.Group.SORT_ASCENDING)
			this.usedOptions.y = this.usedOptions.DEFAULT_Y
			if(this.riddle.existImage) this.removeImage()
			this.hide()

		},this)
	}
    
    function startTimer(){
	
        var maxTime = this.chrono.maxTime
		if(this.timer)
			this.timer.destroy()

        this.timer = game.time.create()
		this.timerEvent = this.timer.add(maxTime, this.stopTimer, this)
		this.timer.loop(1000, updateTimer, this)
        this.timer.start()
		console.log("time start")
	}
	
	function updateTimer(){

		var text = convertTime(this.timerEvent.delay - this.timer.ms)
		this.chrono.timeText.setText(text)

		this.chrono.circle.clear()
        this.chrono.circle.lineStyle(40, 0xFF0000, 0.5)

		var size = game.math.degToRad((270/this.timerEvent.delay)*(this.timerEvent.delay - this.timer.ms))
        this.chrono.circle.arc(0, 0, this.chrono.circle.lineSize, this.game.math.degToRad(-10), size, false)
        this.chrono.circle.endFill()
	}
    
    function stopTimer(){
		this.timer.stop()
		this.timer.destroy()
		this.chrono.timeText.setText("0:00")

		// this.buttons.options.setAll("inputEnabled", false)
		// this.feedBackImg.loadTexture("atlas.question", "timeOut")
		// game.add.tween(this.black).to({alpha:0.5}, 300, Phaser.Easing.linear, true)
		// game.add.tween(this.feedBackImg).to({alpha:1}, 300, Phaser.Easing.linear, true)
		// game.time.events.add(3000, this.clearQuestion)
	}
	
	function convertTime(time) {

		var min = Math.floor(time / 60000)
		var sec = ((time % 60000) / 1000).toFixed(0)

		return min + ":" + (sec < 10 ? '0' : '') + sec
	}

	return{
		initialize:initialize,
		createQuestionOverlay:createQuestionOverlay,
	}

}()
