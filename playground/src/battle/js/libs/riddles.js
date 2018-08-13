
var riddles = function(){
    
    var questions = [
        /*{
            question: `Eagle tiene dos amigos, Nao y Oona. ¿Cuántos dedos en pies y manos tienen los tres amigos en total?`,
            src: "images/questions/imagen.png",
            image: `imagen.png`,
            answers: [{text:1, correct:false}, {text:5, correct:false}, {text:2, correct:true}, {text:3, correct:false}],
            index: 0,
            grade: 1,
        }*/
    ]
    var usedQuestions = []
    var newQuestion
    //var questionGroup
    
    function createQuestionOverlay(callback){
        
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
        
        for(var i = 0; i < 4; i++){

            var btn = options.create(board.centerX * pivotX, board.centerY + board.height * 0.17, "atlas.question", "questionBtn")
            btn.anchor.setTo(0.5)
            btn.alpha = 0
            btn.correct = false
            btn.inputEnabled = true
            btn.events.onInputDown.add(callback,this)

            var letter = new Phaser.Text(questionGroup.game, -btn.width * 0.30, -5, "A", fontStyle)
            letter.anchor.setTo(0.5)
            btn.addChild(letter)
            btn.letter = letter

            var info = new Phaser.Text(questionGroup.game, 0, 0, "", fontStyle)
            info.anchor.setTo(0.5)
            info.wordWrapWidth = btn.width
            info.align = "center"
            btn.addChild(info)
            btn.info = info

            pivotX += 0.3

            if(i % 2 != 0){
                btn.y += 150
            }
            btn.spawn = {x: btn.x, y: btn.y}
        }

        options.children[1].letter.setText("B")
        options.children[2].letter.setText("C")
        options.children[3].letter.setText("D")

        questionGroup.question = text
        questionGroup.image = img
        questionGroup.options = options
        questionGroup.options.setAll("inputEnabled", false)
        questionGroup.boxes.forEach(function(box){
            box.scale.setTo(0,1)
        })
        
        return questionGroup
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
    
    function onLoadComplete(questionGroup, callback){
        
        game.load.image(newQuestion.image, newQuestion.src + ".jpg")
        game.load.onLoadComplete.add(function(){
            
            questionGroup.question.setText(newQuestion.question)
            questionGroup.image.loadTexture(newQuestion.image)
            questionGroup.image.key = newQuestion.image

            Phaser.ArrayUtils.shuffle(newQuestion.answers)

            for(var i = 0; i < newQuestion.answers.length; i++){

                var opt = questionGroup.options.children[i]
                opt.info.setText(newQuestion.answers[i].text)
                opt.correct = newQuestion.answers[i].correct
            }
            
            callback()
        })
        game.load.start()
    }
    
    return{
        loadQuestions:loadQuestions,
        selectQuestion:selectQuestion,
        onLoadComplete:onLoadComplete,
        createQuestionOverlay:createQuestionOverlay
    }
    
}()
