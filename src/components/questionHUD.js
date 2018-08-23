
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
	
	function createQuestionOverlay(){

		var questionGroup = game.add.group()
		questionGroup.boxes = []

		var black = game.add.graphics()
		black.beginFill(0x000000)
		black.drawRect(0,0,game.world.width, game.world.height)
		black.endFill()
		black.alpha = 0.5
		questionGroup.add(black)

		var board = questionGroup.create(game.world.centerX, game.world.height - 20, "questionBoard")
		board.anchor.setTo(0, 1)
		board.x -= board.width * 0.47
		questionGroup.boxes[1] = board

		var box = questionGroup.create(board.centerX, board.y - board.height + 2, "atlas.question", "questionBox")
		box.anchor.setTo(1, 1)
		box.x += box.width * 0.42
		questionGroup.boxes[0] = box

		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "left", wordWrap: true, wordWrapWidth: box.width - 180}

		var text = new Phaser.Text(questionGroup.game, box.centerX + 70, box.centerY, "", fontStyle)
		text.anchor.setTo(0.5)
		text.alpha = 0
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

		var light = questionGroup.create(0,0, "pinkLight")
		light.anchor.setTo(0.5)
		light.scale.setTo(0)
		questionGroup.light = light

		var options = []//game.add.group()
		//questionGroup.add(options)
		var pivotX = 0.5
		var opt = ["A", "C", "B", "D"]

		var callInputAnswer = inputOption.bind(questionGroup)

		for(var i = 0; i < 4; i++){

			var btn = createButtons(board.centerX * pivotX, board.centerY + board.height * 0.17, opt[i], questionGroup)

			pivotX += 0.3

			if(i % 2 != 0){
				btn.y += 150
			}

			btn.spawn = {x: btn.x, y: btn.y}
			btn.inputEnabled = true
			btn.events.onInputDown.add(callInputAnswer)
			btn.inputEnabled = false
			options.push(btn)
		}

		questionGroup.question = text
		questionGroup.image = img
		questionGroup.options = options
		//questionGroup.options.setAll("inputEnabled", false)
		questionGroup.boxes.forEach(function(box){
			box.scale.setTo(0, 1)
		})
		questionGroup.timeElapsed = 0

        questionGroup.showQuestion = showQuestion.bind(questionGroup)
		questionGroup.setQuestion = setQuestion.bind(questionGroup)
		questionGroup.fixImage = fixImage.bind(questionGroup)
		questionGroup.removeImage = removeImage.bind(questionGroup)
		questionGroup.hide = hideOverlay.bind(questionGroup)
		questionGroup.update = update.bind(questionGroup)
        questionGroup.startTimer = startTimer.bind(questionGroup)
		questionGroup.stopTimer = stopTimer.bind(questionGroup)
		questionGroup.updateTimer = updateTimer.bind(questionGroup)
		questionGroup.alpha = 0

		return questionGroup
	}

	function createButtons(x, y, opt, group){

		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center", wordWrap: true}

		var btn = game.add.sprite(x, y, "atlas.question", "questionBtn")
		btn.anchor.setTo(0.5)
		btn.alpha = 0
		btn.correct = false

		var letter = new Phaser.Text(group.game, -btn.width * 0.30, -5, opt, fontStyle)
		letter.anchor.setTo(0.5)
		btn.addChild(letter)
		btn.letter = letter

		var info = new Phaser.Text(group.game, 0, 0, "", fontStyle)
		info.anchor.setTo(0.5)
        info.alpha = 0
		info.wordWrapWidth = btn.width
		btn.addChild(info)
		btn.info = info

		return btn
	}

	function showQuestion(riddle){

		var delay = 200
		this.timeElapsed = 0

		this.riddle = riddle
		//if(riddle.existImage) {
		//game.load.image(riddle.image, riddle.src)
		//game.load.onLoadComplete.add(function(){
			this.image.loadTexture(this.riddle.image)
			var scaleImg = this.fixImage(1)
			this.image.key = this.riddle.image
			

			game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)

			this.boxes.forEach(function(box){
				game.add.tween(box.scale).to({x: 1}, 400, Phaser.Easing.Cubic.Out, true, delay)
				delay += 400
			})

			this.options.forEach(function(opt){
				opt.info.alpha = 0
				game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay)
				delay += 200
			})

			var lastTween = game.add.tween(this.image.scale).to({x:scaleImg, y:scaleImg}, 300, Phaser.Easing.Cubic.InOut, true, delay)
			lastTween.onComplete.add(this.setQuestion)
		//}.bind(this))
		//game.load.start()

		//}

		

		//if(riddle.existImage)
	}
    
    function setQuestion(){
		
		var riddle = this.riddle
        this.question.setText(riddle.question)
        
        for(var i = 0; i < riddle.answers.length; i++){
			var opt = this.options[i]
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

	function hideOverlay(){
		var fadeOut = game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.linear, true)
		var group = this
		fadeOut.onComplete.add(function(){
			console.log(this)
			this.question.alpha = 0

			for(var i = 0; i < this.options.length; i++){
			//this.options.forEach(function(opt){
				var opt = this.options[i]
				console.log(opt)
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

			//if(group.existImage){
				this.image.scale.setTo(0)
				this.image.alpha = 0
				//this.removeImage()
			//}
			console.log(this)
		},group)
	}

	function inputOption(btn){

		//this.options.setAll("inputEnabled", false)

		this.options.forEach(function(opt){
			opt.inputEnabled = false
			if(opt != btn){
				game.add.tween(opt).to({alpha:0.5}, 300, Phaser.Easing.linear, true)
			}
		})

		this.light.x = btn.x - 100
		this.light.y = btn.y
		var shine = game.add.tween(this.light.scale).to({x: 0.5, y:0.5}, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true)

		//var newY = this.boxes[1].y - 180
		//var choise = game.add.tween(btn).to({x: game.world.centerX, y:newY}, 500, Phaser.Easing.Cubic.Out, false)

		//shine.chain(choise)
		var event = {time : this.timeElapsed, value : btn.value}
		if(this.callback) this.callback(event)
		//choise.chain(fadeOut)
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
    
        var MAX_TIME = 30000
		if(this.timer)
			this.timer.destroy()

        this.timer = game.time.create()
		this.timerEvent = this.timer.add(MAX_TIME, this.stopTimer, this)
		this.timer.loop(1000, updateTimer, this)
        this.timer.start()
		console.log("time start")
	}
	
	function updateTimer(){

		var text = convertTime(this.timerEvent.delay - this.timer.ms)
		console.log(text)
	}
    
    function stopTimer(){
		this.timer.destroy()
		this.hide()
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
