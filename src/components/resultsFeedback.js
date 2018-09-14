var resultsFeedback = function(){

    var SIDES = {
        LEFT:{direction: -1, scale:{x:1}, anchor:0},
        RIGHT:{direction: 1, scale:{x:-1}, anchor:1},
    }

    var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]

    var OFFSET = {
        x: 70,
        y: -160
    }

    var MAX_TIME = 30000
    var OPTIONS_LETTER = ["A", "C", "B", "D"]
    
    var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}

    function createFeedback(){
        
        var posX = (game.world.centerX * 0.5) - OFFSET.x

        var feedbackGroup = game.add.group()
        feedbackGroup.x = game.world.centerX
        feedbackGroup.y = game.world.centerY
       
        var black = game.add.graphics()
        black.beginFill(0x000000, 0.5)
        black.drawRect(-game.world.centerX, -game.world.centerY, game.world.width, game.world.height)
        black.endFill()
        black.alpha = 0
        feedbackGroup.add(black)
        feedbackGroup.black = black
        
        var subGroup = game.add.group()
        subGroup.alpha = 0
        feedbackGroup.add(subGroup)
        feedbackGroup.score = subGroup
        
        for(var i = 0; i < 2; i++){
        
            var side = ORDER_SIDES[i]

            var roundInfo = game.add.group()
            roundInfo.x = posX * side.direction
            roundInfo.y = OFFSET.y
            roundInfo.time = 0
            roundInfo.twist = side.direction
            roundInfo.INDEX = i
            subGroup.add(roundInfo)

            var timeDif = new Phaser.Text(roundInfo.game, -70 * side.direction, 100, "+2 sec", fontStyle)
            timeDif.anchor.setTo(0.5)
            timeDif.fill = "#ffff54"
            timeDif.fontSize = 70
            timeDif.stroke = "#000066"
            timeDif.strokeThickness = 10
            timeDif.alpha = 0
            roundInfo.add(timeDif)
            roundInfo.timeDif = timeDif

            var timeContainer = roundInfo.create(0, 0, "atlas.feedback", "time_container")
            timeContainer.anchor.setTo(0.5)
            timeContainer.scale.setTo(side.scale.x, 1)
            
            var timeTxt = new Phaser.Text(roundInfo.game, -70 * side.direction, 7, "0:00.000", fontStyle)
            timeTxt.anchor.setTo(0.5)
            timeTxt.alpha = 0
            roundInfo.add(timeTxt)
            roundInfo.timeTxt = timeTxt

            var timeIcon = roundInfo.create(180 * side.direction, -10, "atlas.feedback", "time_icon")
            timeIcon.anchor.setTo(0.5)
            roundInfo.timeIcon = timeIcon
            
            var token = createToken()
            token.x = 120 * side.direction
            token.y = -125
            roundInfo.add(token)
            roundInfo.token = token
            
            var timeBar = createTimeBar()
            timeBar.x = 30 * side.direction
            timeBar.y = -150
            timeBar.scale.setTo(side.scale.x, 1)
            roundInfo.add(timeBar)
            roundInfo.timeBar = timeBar

            var particles = createParticles(180)
            particles.x = -90 * side.direction
            particles.y = -100
            roundInfo.add(particles)
            roundInfo.particles = particles
        }

        var blueAns = createCorrectAns()
        feedbackGroup.add(blueAns)
        feedbackGroup.blueAns = blueAns

        subGroup.leftTeam = subGroup.children[0]
        subGroup.rightTeam = subGroup.children[1]
        subGroup.setWiner = setWiner.bind(subGroup)
        subGroup.setLoser = setLoser.bind(subGroup)
        subGroup.clearInfo = clearInfo.bind(subGroup)

        var attackImg = feedbackGroup.create(0, 0, "atlas.feedback", "normal")
        attackImg.anchor.setTo(0.5)
        attackImg.alpha = 0
        feedbackGroup.attack = attackImg

        feedbackGroup.displayResults = displayResults.bind(subGroup)
        feedbackGroup.setWinLose = setWinLose.bind(subGroup)
        feedbackGroup.showAttack = showAttack.bind(feedbackGroup)

        return feedbackGroup  
    }

    function createToken(){

            var token = game.add.sprite(0, 0, "atlas.feedback", "token_neutral")
            token.anchor.setTo(0.5)

            var tokenBlue = game.add.sprite(0, 0, "atlas.feedback", "token_correct")
            tokenBlue.anchor.setTo(0.5)
            tokenBlue.alpha = 0
            token.addChild(tokenBlue)
            token.blue = tokenBlue

            var tokenTxt = new Phaser.Text(token.game, 0, -3, "A", fontStyle)
            tokenTxt.anchor.setTo(0.5)
            tokenTxt.fill = "#ffffff"
            tokenTxt.alpha = 0
            token.addChild(tokenTxt)
            token.text = tokenTxt

            var happy = game.add.sprite(0, 0, "atlas.feedback", "happy")
            happy.anchor.setTo(0.5)
            happy.alpha = 0
            token.addChild(happy)
            token.happy = happy

            var sad = game.add.sprite(0, 0, "atlas.feedback", "sad")
            sad.anchor.setTo(0.5)
            sad.alpha = 0
            token.addChild(sad)
            token.sad = sad

            var poker = game.add.sprite(0, 0, "atlas.feedback", "poker")
            poker.anchor.setTo(0.5)
            poker.alpha = 0
            token.addChild(poker)
            token.poker = poker

            token.restore = restore.bind(token)
            token.setInfo = setInfo.bind(token)

            function setInfo(index, winer, correct){
                
                var self = this
                var neutral = game.add.tween(this.scale).to({x:1.3, y:1.3}, 200, Phaser.Easing.Cubic.Out, false, 1000, 0, true)

                if(correct){
                    neutral.onStart.add(function(){
                        game.add.tween(self.blue).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, true)
                    },self)

                    if(winer){
                        var showCorrect = game.add.tween(self.happy).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false, 1100)
                    }
                    else{
                        var showCorrect = game.add.tween(self.poker).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false, 1100)
                    }
                }
                else{
                    var showCorrect = game.add.tween(self.sad).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, false, 1100)
                }

                neutral.chain(showCorrect)
                this.text.setText(OPTIONS_LETTER[index])
                game.add.tween(this.text).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, true, 300).chain(neutral)
            }

            function restore(){
                this.blue.alpha = 0
                this.text.alpha = 0
                this.happy.alpha = 0
                this.sad.alpha = 0
                this.poker.alpha = 0
            }

            return token
    }

    function createTimeBar(){

        var container = game.add.sprite(0, 0, "atlas.feedback", "bar_frame")

        var bar = game.add.graphics()
        bar.beginFill(0xFFE91A)
        bar.drawRoundedRect(0, 14, container.width, container.height * 0.6, 20)
        //bar.scale.setTo(0, 1)
        bar.endFill()
        
        var shine = game.add.graphics()
        shine.beginFill(0xFFFFFF, 0.4)
        shine.drawRoundedRect(0, 0, container.width, container.height, 20)
        shine.alpha = 0
        shine.endFill()
        
        var backCont = game.add.graphics()
        backCont.beginFill(0x242A4D)
        backCont.drawRect(0, 0, container.width, container.height * 0.9)
        backCont.endFill()
        backCont.addChild(bar)
        backCont.addChild(container)
        backCont.addChild(shine)
        backCont.bar = bar
        backCont.shine = shine

        backCont.restore = restore.bind(backCont)

        function restore(){
            this.shine.alpha = 0
            this.bar.scale.setTo(1)
        }

        return backCont
    }

    function createParticles(width){

        width = width || 0
        var particle = game.add.emitter(0, 0, 50)
        particle.makeParticles("atlas.feedback", "bubblePart")
        particle.gravity = -150
        particle.setAlpha(1, 0, 2500, Phaser.Easing.Cubic.In)
        particle.width = width
        //particle.start(true, 2000, null, 40)

        return particle
    }

    function createCorrectAns(){

        var blueBtn = game.add.sprite(0, 0, "atlas.question", "blueBtn")
        blueBtn.anchor.setTo(0.5)
        blueBtn.alpha = 0

        var txt = new Phaser.Text(blueBtn.game, -137, 0, "B", fontStyle)
        txt.anchor.setTo(0.5)
        txt.fill = "#ffffff"
        blueBtn.addChild(txt)
        blueBtn.text = txt
        
        var info = new Phaser.Text(blueBtn.game, 25, 5, "", fontStyle)
        info.anchor.setTo(0.5)
        info.wordWrap = true
        info.fontSize = 50
        info.wordWrapWidth = blueBtn.width * 0.5
        info.fill = "#ffffff"
        blueBtn.addChild(info)
        blueBtn.info = info

        blueBtn.setInfo = setInfo.bind(blueBtn)
        blueBtn.clearInfo = clearInfo.bind(blueBtn)
        
        function setInfo(index, info){
            console.log(index)
            this.text.setText(OPTIONS_LETTER[index])
            this.info.setText(info)
            game.add.tween(this).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true)
        }

        function clearInfo(){
            this.text.setText("")
            this.info.setText("")
            game.add.tween(this).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true)
        }

        return blueBtn
    }

    function displayResults(event, riddle){

        var event = event || {}
		var answers = event.answers || {}
		var numTeam = event.numTeam || -1
        
		var t1 = answers.t1 || {}
		var t2 = answers.t2 ||{}
		var tie = t1.value == t2.value
        var players = [t1, t2]
        
        var timeDifference = event.timeDifference || Math.abs(t1.time - t2.time) || 0
		var timeConvertedDifference = convertTime(timeDifference)

        var parent = this.parent

        game.add.tween(parent.black).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
        game.add.tween(this).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
        parent.blueAns.setInfo(riddle.correctAnswer, riddle.correctValue)

        for(var i = 0; i < this.length; i++){

			var newScale = convertScale(players[i].time)
            var ansTime = convertTimeFormat(players[i].time)
            var winer = numTeam == (i + 1) ? true : false //players[i].value == riddle.correctAnswer
            var correct = players[i].value == riddle.correctAnswer

			var score = this.children[i]
			score.timeTxt.setText(ansTime)
			score.timeDif.setText("+" + timeConvertedDifference)
            score.time = players[i].time
            score.token.setInfo(players[i].value, winer, correct)

            var showTime = game.add.tween(score.timeTxt).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, false)
            game.add.tween(score.timeBar.bar.scale).to({x: newScale}, 400, Phaser.Easing.Cubic.Out, true, 400).chain(showTime)
        }
        
        parent.setWinLose(numTeam, tie)
    }

    function setWinLose(numTeam, tie){

        var playerWin
        var playerLose

        if(numTeam !== -1){
            
            if(numTeam === 1){
                playerWin = this.leftTeam
                playerLose = this.rightTeam
            }
            else if(numTeam === 2) {
                playerWin = this.rightTeam
                playerLose = this.leftTeam
            }

            this.setWiner(playerWin)
            this.setLoser(playerLose, tie)
        }
        else{
            this.setLoser(this.leftTeam)
			this.setLoser(this.rightTeam)
			game.time.events.add(4500, this.tieCallback)
        }
    }

    function setWiner(winSide){

        var self = this
		var showShine = game.add.tween(winSide.timeBar.shine).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 3000)
		showShine.onStart.add(function(){
			winSide.particles.start(true, 2000, null, 40)
        })
        showShine.onComplete.add(function(){
            self.parent.showAttack(winSide)
        })
    }
    
    function showAttack(winSide){
        
        var self = this
        var attack = selectAttackType(winSide.time)
        var index = winSide.INDEX

        self.attack.loadTexture("atlas.feedback", attack)
        self.attack.x = winSide.x
        self.attack.y = winSide.y

        var apear = game.add.tween(self.attack.scale).from({x: 0,y: 0}, 300, Phaser.Easing.Elastic.Out, true, 2300)
        apear.onStart.add(function(){
            self.attack.alpha = 1
        })

        var fadeOut = game.add.tween(self.attack).to({alpha: 0}, 300, Phaser.Easing.Cubic.InOut, false, 800)
        fadeOut.onComplete.add(function(){
            self.winCallback(index, attack)
        })
        apear.chain(fadeOut)
    }

    function setLoser(loseSide, tie){
        
        var self = this
		if(tie) loseSide.timeDif.alpha = 1

		var fadeOut = game.add.tween(loseSide.parent).to({alpha: 0}, 1000, Phaser.Easing.Cubic.Out, false, 1500)
        fadeOut.onStart.add(function(){
            self.loserCallback()
            game.add.tween(loseSide.parent.parent.black).to({alpha: 0}, 1000, Phaser.Easing.Cubic.Out, true)
            self.parent.blueAns.clearInfo()
        })
        fadeOut.onComplete.add(self.clearInfo)
        
        var hangOff = game.add.tween(loseSide).to({angle: 50 * loseSide.twist}, 1000, Phaser.Easing.Bounce.Out, true, 3000)
        hangOff.chain(fadeOut)
        game.add.tween(loseSide.timeDif).from({y: 30}, 400, Phaser.Easing.Cubic.Out, true, 2500)
    }

    function selectAttackType(time){

        if(time > 0 && time <= 10000){
			return "ultra"
		}
		else if(time > 10000 && time <= 15000){
			return "super"
		}
		else{
 			return "normal"
		}
	}
    
    function convertScale(time){

        var scale = 1 - time/MAX_TIME
        if(scale < 0) scale = 0
		return scale
    }
    
    function convertTime(time) {

		var min = Math.floor(time / 60000)
		var sec = ((time % 60000) / 1000).toFixed(0)

		return min + ":" + (sec < 10 ? '0' : '') + sec
    }

    function convertTimeFormat(timeElapsed) {
		var seconds = Math.floor(timeElapsed * 0.001)
		var decimals = Math.floor(timeElapsed * 0.01) % 10
		var centimals = (Math.floor(timeElapsed / 10) % 10)
		// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
		var result = (seconds < 10) ? "0" + seconds : seconds;
		result += ":" + decimals + centimals

		return result
	}
    
    function clearInfo(){

		for(var i = 0; i < this.length; i++){

            var roundInfo = this.children[i]
            roundInfo.angle = 0
            roundInfo.timeDif.alpha = 0
            roundInfo.timeTxt.alpha = 0
            roundInfo.token.restore()
            roundInfo.timeBar.restore()
        }
    }
    
    return{ 
        createFeedback:createFeedback
    }
}()
