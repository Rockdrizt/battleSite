
var HUD = function(){

    var MAX_LIFE
    var MIN_LIFE = 0

    function loadNames(teams){

        var nameList = []

        for(var i = 0; i < teams.length; i++){
            for(var j = 0; j < teams[i].length; j++){
                var character = teams[i][j].skin//.name.substr(7).toLowerCase()
                nameList.push(character)
            }
        }

        for(var i = 0; i < 4; i+=3){
            var aux = nameList[i]
            nameList[i] = nameList[i+1]
            nameList [i+1] = aux
        }

        return nameList
    }
	
	function createHUD(SIDES, teams){

        var listName = loadNames(teams)

        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var HUDGroup = game.add.group()
        HUDGroup.fixedToCamera = true
        HUDGroup.cameraOffset.setTo(0, 0)
        HUDGroup.teams = []
        
        var pivotX = 0.25
        var index = 0
        
        for(var i = 0; i < 2; i++){
            
            var side = SIDES[i].scale.x
            
            var teamSide = game.add.group()
            HUDGroup.add(teamSide)
            HUDGroup.teams.push(teamSide)
            
            var lifeBox = teamSide.create(game.world.centerX * pivotX, 150, "atlas.battle", "lifeContainer" + i)
            lifeBox.x += 15 * side
            lifeBox.anchor.setTo(i, 0.5)
            lifeBox.scale.setTo(0.95)

            var teamName = new Phaser.Text(teamSide.game, lifeBox.x, lifeBox.y - 95, "Equipo Alpha", fontStyle)
            teamName.anchor.setTo(i, 0.5)
            teamName.fontSize = 65
            teamName.stroke = "#000066"
            teamName.strokeThickness = 10
            teamSide.add(teamName)
            
            var life = teamSide.create(lifeBox.x + (23 * side), lifeBox.y - 5, "atlas.battle", "lifeGauge")
            life.anchor.setTo(0, 0.5)
            life.scale.setTo(side, 1)
            teamSide.life = life

            var lifeText = "100/100".split("").join(String.fromCharCode(8202))

            var lifePoints = new Phaser.Text(teamSide.game, life.x + 20 * side, life.y + 5, lifeText, fontStyle)
            lifePoints.anchor.setTo(i, 0.5)
            lifePoints.fontSize = 45
            lifePoints.stroke = "#000066"
            lifePoints.strokeThickness = 10
            teamSide.add(lifePoints)
            life.points = lifePoints
            life.amount = 100
            
            var teamScore = teamSide.create(lifeBox.x - 80 * side, lifeBox.y * 2.4, "atlas.battle", "score")
            teamScore.anchor.setTo(0.5)
            teamScore.scale.setTo(0.5 * side, 0.5)
            teamScore.side = side
            teamScore.points = 0
            teamSide.teamScore = teamScore
            
                var score = new Phaser.Text(teamSide.game, -30, 30, "0", fontStyle)
                score.anchor.setTo(0.5)
                score.scale.setTo(1.1 * side, 1.1)
                score.fontSize = 100
                score.stroke = "#000066"
                score.strokeThickness = 10
                teamScore.addChild(score)
                teamScore.text = score
            
            var tokenGroup = game.add.group()
			tokenGroup.side = side
			teamSide.add(tokenGroup)
            teamSide.tokenGroup = tokenGroup
            
                var token = tokenGroup.create(lifeBox.x, lifeBox.y, "atlas.battle", "token" + i)
                token.anchor.setTo(0.5)
                token.scale.setTo(side, 1)
                token.x -= 78 * side

                var pic = game.add.sprite(0, - 10, "atlas.pics", listName[index])
                pic.anchor.setTo(0.5)
                pic.scale.setTo(0.8, 0.8)
                token.addChild(pic)
                
                index++
                
                for(var j = 0; j < 2; j++){
                    
                    var token = tokenGroup.create(lifeBox.x, lifeBox.y + 120, "atlas.battle", "token" + i)
                    token.anchor.setTo(0.5)
                    token.scale.setTo(0.75 * side, 0.75)
                    token.x -= 155 * j * side
                    
                    var pic = game.add.sprite(0, - 10, "atlas.pics", listName[index])
                    pic.anchor.setTo(0.5)
                    pic.scale.setTo(0.8, 0.8)
                    token.addChild(pic)
                    
                    index++
                }
            
            pivotX += 1.5
        }
    
        teamName.setText("Equipo Bravo")
        life.x -= 4 //hardcode due to art diferen sizes
		
		//createTimer(HUDGroup)
		HUDGroup.rotateTokens = rotateTokens.bind(HUDGroup)
		HUDGroup.dealDamage = dealDamage.bind(HUDGroup)
        HUDGroup.setScore = setScore.bind(HUDGroup)
        HUDGroup.getScore = getScore.bind(HUDGroup)

        MAX_LIFE = life.width

        return HUDGroup
    }

	function createTimer(group){
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
        
        var timeToken = group.create(game.world.centerX, 150, "atlas.battle", "timeToken")
        timeToken.anchor.setTo(0.5)
        
        var text = new Phaser.Text(group.game, 0, -10, "3:00", fontStyle)
        text.anchor.setTo(0.5)
        timeToken.addChild(text)
        timeToken.text = text 
	}
	
	function rotateTokens(index){

		var tokens = this.children[index].tokenGroup
		
		for(var i = 0; i < tokens.length; i++){

			var pic = tokens.children[i]
			var pos = i + 1 >= tokens.length ? 0 : i + 1
			var next = tokens.children[pos]
			var size = next.y < pic.y ? 1 : 0.75

			game.add.tween(pic).to({x: next.x, y: next.y}, 500, Phaser.Easing.linear, true)
			game.add.tween(pic.scale).to({x: size * tokens.side, y: size}, 490, Phaser.Easing.linear, true)

			if(size == 1)
				pic.parent.sendToBack(pic)
		}
	}

	//TODO: refactor HUD.js, HUD most only use HUD functions, not damage, shakeCamara, nextRound, etc..
    //TODO: also damage and type attack are going to be on the server side but in the mainteam, I will add a function
    //to reduce life in the server
	function dealDamage(loseIndex, percent, ultra){

        var self = this
        var life = self.children[loseIndex].life
        var winIndex = loseIndex == 0 ? 1 : 0
        var delay = 3500
        var damage = life.width - (MAX_LIFE * percent)
		var defeat = loseIndex == 1 ? damage >= -0.1 : damage <= 0.1
        if(defeat) damage = MIN_LIFE
		
        if(ultra){
            shakeCamera()
            delay = 5000
        }

        var reduceLife = game.add.tween(life).to({width:damage}, 500, Phaser.Easing.Cubic.Out, true)

		reduceLife.onComplete.add(function(){

            life.amount -= Math.abs(percent) * 100
            var lifeText = life.amount > 0 ? life.amount + "/100" : "0/100"
            lifeText = lifeText.split("").join(String.fromCharCode(8202))
            life.points.setText(lifeText)

            if(damage == MIN_LIFE){
                game.time.events.add(2000, self.setWinteam, null, winIndex, loseIndex)
            }
            else{
                self.nextRound(delay)
            }


            //UPDATE SCORE SERVER
            var team1Data = self.teams[0]
            var team2Data = self.teams[1]
            var teamsData = {
                "t1" : {
					life : team1Data.life.amount > 0 ? team1Data.life.amount : 0,
                    score : {correct : team1Data.teamScore.points}
				},
				"t2" : {
					life : team2Data.life.amount > 0 ? team2Data.life.amount : 0,
					score : {correct : team2Data.teamScore.points}
				}
            }
            server.updateTeam(1, teamsData.t1)
            server.updateTeam(2, teamsData.t2)
        })
    }
    
    function shakeCamera(){
        game.camera.shake(0.01, 900)
    }

	function setScore(index){

        var score = this.children[index].teamScore
        score.points++
        game.add.tween(score.scale).to({x: 1 * score.side, y:1}, 400, Phaser.Easing.Cubic.InOut, true, 1500, 0, true).onStart.add(function(){
            score.text.setText(score.points)
        })
    }
    
    function getScore(index){

        var score = this.children[index].teamScore
        return score.points
    }
	
	return{
		createHUD:createHUD,
	}

}()
