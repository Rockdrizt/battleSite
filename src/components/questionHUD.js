
var questionHUD = function(){

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
	
	function createQuestionOverlay(client){

		var questionGroup = game.add.group()
		questionGroup.boxes = []

		var black = game.add.graphics()
		black.beginFill(0x000000)
		black.drawRect(0,0,game.world.width, game.world.height)
		black.endFill()
		black.alpha = 0.5
		questionGroup.add(black)
		questionGroup.black = black

		var board = questionGroup.create(game.world.centerX, game.world.height - 50, "questionBoard")
		board.anchor.setTo(0, 1)
		board.x -= board.width * 0.47
		questionGroup.boxes[1] = board

		var box = questionGroup.create(board.centerX, board.y - board.height + 2, "atlas.question", "questionBox")
		box.anchor.setTo(1, 1)
		box.x += box.width * 0.43
		questionGroup.boxes[0] = box
		questionGroup.questionBox = box

		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "left", wordWrap: true}

		var text = new Phaser.Text(questionGroup.game, box.centerX + 60, box.centerY, "", fontStyle)
		text.anchor.setTo(0.5)
		text.alpha = 0
		text.wordWrapWidth = box.width * 0.8
		questionGroup.add(text)

		var container = questionGroup.create(board.centerX, board.centerY - board.height * 0.2, "atlas.question", "questionImage")
		container.anchor.setTo(1, 0.5)
		container.x += container.width * 0.43
		questionGroup.container = container
		questionGroup.boxes[2] = container

		var img = questionGroup.create(-container.width * 0.5, 0, "default")
		img.anchor.setTo(0.5)
		img.scale.setTo(0)
		img.alpha = 0
		img.key = ""
		container.addChild(img)
		questionGroup.image = img

		var options = game.add.group()//[]
		questionGroup.add(options)
		var INITIAL_X = board.centerX * 0.45
		var INITIAL_Y = board.centerY + board.height * 0.17
		var offsetX = 0.7
		var OPTIONS_LETTER = ["A", "C", "B", "D"]

		var callInputAnswer = inputOption.bind(questionGroup)

		//if(client){
			INITIAL_X = board.centerX * 0.85
			offsetX = 0.9
		//}

		for(var i = 0; i < 4; i++){

			var btn = createButtons(INITIAL_X, INITIAL_Y, OPTIONS_LETTER[i], options)

			//
				btn.x += i % 2 != 0 ? btn.width * offsetX : 0
				if(i > 1){
					btn.y += 150
				}
			if(client){
				btn.inputEnabled = true
				btn.events.onInputDown.add(callInputAnswer)
			}
			// else{
			// 	btn.x += btn.width * offsetX * i
			// 	if(i % 2 != 0){
			// 		btn.y += 150
			// 	}
			// }

			btn.spawn = {x: btn.x, y: btn.y}
			btn.groupPos = i
			options.add(btn)
		}

		questionGroup.client = false
		questionGroup.question = text
		questionGroup.image = img
		questionGroup.options = options
		questionGroup.options.btnPressed = null
		questionGroup.options.setAll("inputEnabled", false)
		questionGroup.boxes.forEach(function(box){
			box.scale.setTo(0, 1)
		})
		questionGroup.timeElapsed = 0

        questionGroup.showQuestion = showQuestion.bind(questionGroup)
		questionGroup.setQuestion = setQuestion.bind(questionGroup)
		questionGroup.fixImage = fixImage.bind(questionGroup)
		questionGroup.fixText = fixText.bind(questionGroup)
		questionGroup.removeImage = removeImage.bind(questionGroup)
		questionGroup.hide = hideOverlay.bind(questionGroup)
		questionGroup.update = update.bind(questionGroup)
        questionGroup.startTimer = startTimer.bind(questionGroup)
		questionGroup.stopTimer = stopTimer.bind(questionGroup)
		questionGroup.updateTimer = updateTimer.bind(questionGroup)
		questionGroup.startTweens = startTweens.bind(questionGroup)
		questionGroup.clearQuestion = clearQuestion.bind(questionGroup)
		createChrono(questionGroup)
		questionGroup.alpha = 0

		if(client){
			questionGroup.bringToTop(black)
			black.alpha = 0
			createTeamName(questionGroup)
			createWaiting(questionGroup)
			createFeedback(questionGroup)
			createUsedGroup(questionGroup)
			questionGroup.client = true
			questionGroup.showFeedback = showFeedback.bind(questionGroup)
			questionGroup.getCorrectAns = getCorrectAns.bind(questionGroup)
		}

		return questionGroup
	}

	function createTeamName(hud){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var board = hud.boxes[0]
		var teamName = new Phaser.Text(hud.game, board.x, board.y - board.height - 30, "", fontStyle)
		teamName.anchor.setTo(1, 0.5)
		teamName.stroke = "#000066"
		teamName.strokeThickness = 10
		hud.add(teamName)
		hud.teamName = teamName
	}

	function createChrono(hud){

		var fontStyle = {font: "75px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
		var box = hud.boxes[1]

		var chronoGroup = game.add.group()
		chronoGroup.x = box.centerX * 1.5
		chronoGroup.y = box.centerY * 1.3
		chronoGroup.maxTime = 20000
		hud.add(chronoGroup)
		hud.chrono = chronoGroup

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
		//circle.beginFill(0xFF0000, 0.5)
		circle.lineSize = timeGauge.width * 0.45
		circle.arc(0, 0, circle.lineSize, game.math.degToRad(-10), game.math.degToRad(280), false)
		circle.endFill()
		chronoGroup.add(circle)
		chronoGroup.circle = circle
		timeGauge.mask = circle

		chronoGroup.restore = restore.bind(chronoGroup)

		function restore(){
			this.circle.clear()
			this.circle.lineStyle(40, 0xFF0000, 0.5)
			this.circle.arc(0, 0, this.circle.lineSize, game.math.degToRad(-10), game.math.degToRad(280), false)
			this.circle.endFill()
		}
	}

	function createWaiting(hud){

		var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var waitGroup = game.add.group()
		waitGroup.alpha = 0
		hud.add(waitGroup)
		hud.waiting = waitGroup

		var spiner = game.add.sprite(game.world.centerX, game.world.centerY - 130, "logoAtlas", "spiner")
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

	function createUsedGroup(hud){

		var usedOptions = game.add.group()
		hud.add(usedOptions)
		hud.usedOptions = usedOptions
	}

	function createButtons(x, y, opt, group){

		var fontStyle = {font: "50px VAGRounded", fill: "#FFFFFF", align: "center", wordWrap: true}

		var btn = game.add.sprite(x, y, "atlas.question", "questionBtn")
		btn.anchor.setTo(0.5)
		btn.alpha = 0
		btn.correct = false

		var blue = game.add.sprite(-8, -3, "atlas.question", "blueBtn")
		blue.anchor.setTo(0.5)
		blue.alpha = 0
		btn.addChild(blue)
		btn.blue = blue

		var letter = new Phaser.Text(group.game, -btn.width * 0.30, -5, opt, fontStyle)
		letter.anchor.setTo(0.5)
		btn.addChild(letter)
		btn.letter = letter

		var info = new Phaser.Text(group.game, 25, 5, "", fontStyle)
		info.anchor.setTo(0.5)
        info.alpha = 0
		info.wordWrapWidth = btn.width * 0.5
		btn.addChild(info)
		btn.info = info

		return btn
	}

	function createFeedback(hud){

		var feedImg = hud.create(game.world.centerX, game.world.centerY - 100, "atlas.question", "correct")
		feedImg.anchor.setTo(0.5)
		feedImg.alpha = 0
		hud.feedBackImg = feedImg
	}

	function showQuestion(riddle){

		var hud = this
		hud.timeElapsed = 0
		hud.riddle = riddle

		if(riddle.existImage){
			game.load.image(hud.riddle.image, hud.riddle.src)
			game.load.onLoadComplete.add(hud.startTweens)
			game.load.start()
		}
		else{
			hud.startTweens()
		}
	}

	function startTweens(){

		if(!this.client) return

		var delay = 200
		this.image.loadTexture(this.riddle.image)
		var scaleImg = this.fixImage(1)
		this.image.key = this.riddle.image
		this.chrono.maxTime = this.riddle.timers.normal
		var maxTime = convertTime(this.chrono.maxTime)
		this.chrono.timeText.setText(maxTime)

		game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)

		this.boxes.forEach(function(box){
			game.add.tween(box.scale).to({x: 1}, 400, Phaser.Easing.Cubic.Out, true, delay)
			delay += 400
		})

		//if(this.client){
			game.add.tween(this.chrono).from({x: -400}, 300, Phaser.Easing.Cubic.Out, true, delay)
		//}

		this.options.forEach(function(opt){
			opt.info.alpha = 0
			game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
			delay += 200
		})

		if(!this.riddle.existImage){
			this.image.alpha = 0
		}

		var lastTween = game.add.tween(this.image.scale).to({x:scaleImg, y:scaleImg}, 300, Phaser.Easing.Cubic.InOut, true, delay)
		lastTween.onComplete.add(this.setQuestion)
	}
    
    function setQuestion(){
		
		var riddle = this.riddle
		this.question.setText(riddle.question)
		this.question.wordWrapWidth = this.questionBox.width * 0.8
		this.fixText(1)
        
        for(var i = 0; i < riddle.answers.length; i++){
			var opt = this.options.children[i]
			opt.value = riddle.answers[i]
			opt.info.text = riddle.answers[i]
			opt.correct = riddle.correctAnswer == riddle.answers[i]
            opt.inputEnabled = true
            game.add.tween(opt.info).to({alpha:1}, 300, Phaser.Easing.linear, true)
		}
        
        game.add.tween(this.question).to({alpha:1}, 300, Phaser.Easing.linear, true)
        
        //this.startTimer()
    }

	function fixImage(scale){

		this.image.scale.setTo(scale)
		if(this.image.height > this.container.height){
			return this.fixImage(scale - 0.1)
		}
		else{
			this.image.scale.setTo(0)
			this.image.alpha = 1
			return scale
		}
	}

	function fixText(scale){

		this.question.scale.setTo(scale)
		if(this.question.height > this.questionBox.height){
			this.question.wordWrapWidth += this.questionBox.width * 0.15
			return this.fixText(scale - 0.1)
		}
		else{
			return
		}
	}

	function hideOverlay(){
		var fadeOut = game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.linear, true)
		var group = this
		fadeOut.onComplete.add(function(){
			this.question.alpha = 0

			for(var i = 0; i < this.options.length; i++){
				var opt = this.options.children[i]
				opt.alpha = 0
				opt.x = opt.spawn.x
				opt.y = opt.spawn.y
				opt.info.alpha = 0
				opt.info.text = ""
				opt.correct = false
			}

			this.boxes.forEach(function(box){
				box.scale.setTo(0, 1)
			})

			this.chrono.restore()
			this.image.scale.setTo(0)
			this.image.alpha = 0
			if(group.existImage) this.removeImage()
		},group)
	}

	function inputOption(btn){

		sound.play("shineSpell")
		this.options.btnPressed = btn
		this.options.setAll("inputEnabled", false)
		this.options.remove(btn)
		this.usedOptions.add(btn)

		this.waiting.spin = game.add.tween(this.waiting.spiner).to({angle: -360}, 2000, Phaser.Easing.linear, true)
		this.waiting.spin.repeat(-1)
		game.add.tween(this.black).to({alpha:0.5}, 300, Phaser.Easing.linear, true)
		game.add.tween(this.waiting).to({alpha:1}, 300, Phaser.Easing.linear, true)

		var event = {time : this.timeElapsed, value : btn.groupPos}
		if(this.callback) this.callback(event)
	}

	function showFeedback(){
		
		var self = this
		if(this.waiting.spin){
			this.waiting.spin.stop()
		}

		var riddle = this.riddle
		var correctBtn = this.getCorrectAns()
		var btn = this.options.btnPressed
		var ans = btn.groupPos == riddle.correctAnswer
		var texture = ans ? "correct" : "wrong"

		this.feedBackImg.loadTexture("atlas.question", texture)
		var apearMsg = game.add.tween(this.feedBackImg).to({alpha:1}, 300, Phaser.Easing.linear, false)

		apearMsg.onComplete.add(function(){

			self.waiting.spiner.angle = 0

			if(ans){
				var endTween = game.add.tween(btn.blue).to({alpha:1}, 200, Phaser.Easing.linear, true)
			}
			else{
				game.add.tween(correctBtn.blue).to({alpha:1}, 200, Phaser.Easing.linear, true, 700).onStart.add(function(){
					self.options.remove(correctBtn)
					self.usedOptions.addAt(correctBtn, self.usedOptions.length)
				})
				var endTween = game.add.tween(btn).to({angle: -30}, 800, Phaser.Easing.Bounce.Out, true, 800)
			}

			endTween.onComplete.add(function(){
				game.time.events.add(3000, self.clearQuestion)
			})
		})

		game.add.tween(this.waiting).to({alpha:0}, 300, Phaser.Easing.linear, true).chain(apearMsg)
	}

	function getCorrectAns(){

		for(var i = 0 ; i < this.options.length; i++){
			var opt = this.options.children[i]
			if(opt.value == this.riddle.correctValue)
				return opt
		}
	}

	function clearQuestion(blueBtn){

		var self = this

		var fadeOut = game.add.tween(self.black).to({alpha:0}, 300, Phaser.Easing.linear, true)
		
		fadeOut.onComplete.add(function(){

			game.add.tween(self.feedBackImg).to({alpha:0}, 300, Phaser.Easing.linear, true)
			game.add.tween(self.image).to({alpha:0}, 300, Phaser.Easing.linear, true)
			game.add.tween(self.question).to({alpha:0}, 300, Phaser.Easing.linear, true)

			var totalUsed = self.usedOptions.length

			for(var i = 0; i < totalUsed; i++){
				var used = self.usedOptions.children[0]
				self.usedOptions.remove(used)
				self.options.add(used)
			}

			self.options.sort("groupPos", Phaser.Group.SORT_ASCENDING)

			for(var i = 0; i < self.options.length; i++){
				var opt = self.options.children[i]
				game.add.tween(opt).to({alpha:0}, 300, Phaser.Easing.linear, true).onComplete.add(function(opt){
					opt.info.alpha = 0
					opt.info.text = ""
					opt.angle = 0
					opt.blue.alpha = 0
				},this, opt)
			}

			self.options.btnPressed = null
		})
	}

	function removeImage(){
		//console.log(game.cache.checkImageKey(image))
		var image = this.image.key
		if(game.cache.checkImageKey(image)){
			console.log(image)
			game.cache.removeImage(image, false)
		}
		//console.log(game.cache.checkImageKey(image))
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
		this.chrono.timeText.setText("0:00")
		this.timer.destroy()
		//this.hide()
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
