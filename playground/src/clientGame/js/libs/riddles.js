
var riddles = function(){
    
    var questions
    var usedQuestions
    var newQuestion
    
    function initialize(){
        
        questions = [
        /*{
            question: `Eagle tiene dos amigos, Nao y Oona. ¿Cuántos dedos en pies y manos tienen los tres amigos en total?`,
            src: "images/questions/imagen.png",
            image: `imagen.png`,
            answers: [{text:1, correct:false}, {text:5, correct:false}, {text:2, correct:true}, {text:3, correct:false}],
            index: 0,
            grade: 1,
        }*/
    ]
        usedQuestions = []
        loadQuestions()
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
        
        var board = questionGroup.create(180, game.world.height - 20, "questionBoard")
        board.anchor.setTo(0, 1)
        questionGroup.boxes[1] = board
        
        var box = questionGroup.create(board.width + 30, board.y - board.height + 2, "atlas.question", "questionBox")
        box.anchor.setTo(1, 1)
        questionGroup.boxes[0] = box
      
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "left", wordWrap: true, wordWrapWidth: box.width - 180}
        
        var text = new Phaser.Text(questionGroup.game, box.centerX + 70, box.centerY, "", fontStyle)
        text.anchor.setTo(0.5)
        text.alpha = 0
        questionGroup.add(text)
        
        var container = questionGroup.create(box.x - 40, board.centerY - board.height * 0.2, "atlas.question", "questionImage")
        container.anchor.setTo(1, 0.5)
        questionGroup.container = container
        questionGroup.boxes[2] = container
        
        var img = questionGroup.create(-container.width * 0.5, 0, "ya")
        img.anchor.setTo(0.5)
        img.scale.setTo(0)
        img.alpha = 0
        img.key = ""
        container.addChild(img)
        
        var light = questionGroup.create(0,0, "pinkLight")
        light.anchor.setTo(0.5)
        light.scale.setTo(0)
        questionGroup.light = light
        
        var options = game.add.group()
        questionGroup.add(options)
        var pivotX = 0.5
        var opt = ["A", "C", "B", "D"]
        
        questionGroup.hideQuestion = hideQuestionOverlay.bind(questionGroup)
        
        for(var i = 0; i < 4; i++){
      
            var btn = createButtons(board.centerX * pivotX, board.centerY + board.height * 0.17, opt[i], options)
            
            pivotX += 0.3

            if(i % 2 != 0){
                btn.y += 150
            }
            
            btn.spawn = {x: btn.x, y: btn.y}
            btn.inputEnabled = true
            btn.events.onInputDown.add(questionGroup.hideQuestion)
            options.add(btn)
        }

        questionGroup.question = text
        questionGroup.image = img
        questionGroup.options = options
        questionGroup.options.setAll("inputEnabled", false)
        questionGroup.boxes.forEach(function(box){
            box.scale.setTo(0, 1)
        })
        
        
        questionGroup.setQuestion = setQuestion.bind(questionGroup)
        questionGroup.fixImage = fixImage.bind(questionGroup)
        questionGroup.removeImage = removeImage.bind(questionGroup)
        
        
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
        info.wordWrapWidth = btn.width
        btn.addChild(info)
        btn.info = info
        
        return btn
    }
    
    function loadQuestions(){
        
        var list = rawList
        
        for(var i = 0; i < list.length; i++){
            
            var element = list[i]
            
            var obj = {
                question: element[0],
                src: "images/questions/" + element[1],
                image: element[1],
                answers: [],
                grade: element[7],
                index: i,
            }
            
            for(var k = 0; k < 4; k++){
                
                var option = {
                    text: element[k+2],
                    correct: element[k+2] == element[6] ? true : false
                }
                obj.answers.push(option)
            }
            questions.push(obj)
        }
        console.log("questions loaded")
    }
    
    function selectQuestion(){
        
        if(usedQuestions.length == questions.length){
            usedQuestions = []
            selectQuestion()
        }
        else{
            do{
                var rand = Math.floor(Math.random() * questions.length)
            }while(usedQuestions.includes(rand))
        
            usedQuestions.push(rand)
            newQuestion = questions[rand]
        }
    }
    
    function setQuestion(riddle){

        console.log("show question")
		var delay = 200

		this.question.setText(riddle.question)

		if(riddle.image) {
			this.image.loadTexture(riddle.image)
			var scaleImg = this.fixImage(1)
			this.image.key = riddle.image
		}

		for(var i = 0; i < riddle.answers.length; i++){

			var opt = this.options.children[i]
			opt.info.text = riddle.answers[i]
			opt.correct = riddle.answers[i] == riddle.correctAnswer
		}

		game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)

		this.boxes.forEach(function(box){
			game.add.tween(box.scale).to({x: 1}, 400, Phaser.Easing.Cubic.Out, true, delay)
			delay += 400
		})

		this.options.forEach(function(opt){
			game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay).onComplete.add(function(){
				opt.inputEnabled = true
			})
			delay += 200
		})

		delay += 200
		game.add.tween(this.question).to({alpha:1}, 300, Phaser.Easing.linear, true, delay)
		if(riddle.image)
            game.add.tween(this.image.scale).to({x:scaleImg, y:scaleImg}, 300, Phaser.Easing.Cubic.InOut, true, delay)
	}
    
    function fixImage(scale){

		this.image.scale.setTo(scale)
		if(this.image.height > this.container.height){
			return fixImage(scale - 0.1)
		}
		else{
			this.image.scale.setTo(0)
			this.image.alpha = 1
			return scale
		}
	}
    
    function hideQuestionOverlay(btn){

        this.options.setAll("inputEnabled", false)

        this.options.forEach(function(opt){
            if(opt != btn){
                game.add.tween(opt).to({alpha:0}, 300, Phaser.Easing.linear, true)
            }
        })

        this.light.x = btn.x - 100
        this.light.y = btn.y
        var shine = game.add.tween(this.light.scale).to({x: 0.5, y:0.5}, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true)

        var newY = this.boxes[1].y - 180
        var choise = game.add.tween(btn).to({x: game.world.centerX, y:newY}, 500, Phaser.Easing.Cubic.Out, false)

        var fadeOut = game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.linear, false, 1000)
        var group = this
        fadeOut.onComplete.add(function(){
            group.question.alpha = 0
            group.options.forEach(function(opt){
                opt.alpha = 0
                opt.x = opt.spawn.x
                opt.y = opt.spawn.y
            })
            group.boxes.forEach(function(box){
                box.scale.setTo(0, 1)
            }) 
            if(group.image){
                group.image.scale.setTo(0)
                group.image.alpha = 0
            }
            
            game.time.events.add(1000, group.callback)
        })
        shine.chain(choise)
        choise.chain(fadeOut)

        this.removeImage()
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
    
    function onLoadComplete(callback){
        
        game.load.image(newQuestion.image, newQuestion.src + ".jpg")
        game.load.onLoadComplete.add(callback)
        game.load.start()
    }
    
    return{
        initialize:initialize,
        //selectQuestion:selectQuestion,
        //onLoadComplete:onLoadComplete,
        createQuestionOverlay:createQuestionOverlay
    }
    
}()
