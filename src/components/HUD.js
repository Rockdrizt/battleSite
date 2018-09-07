
var HUD = function(){
	
	function createHUD(SIDES, listName){

        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var HUDGroup = game.add.group()
        HUDGroup.fixedToCamera = true
        HUDGroup.cameraOffset.setTo(0, 0)
        
        var pivotX = 0.25
        var index = 0
        
        for(var i = 0; i < 2; i++){
            
            var side = SIDES[i].scale.x
            
            var teamSide = game.add.group()
            HUDGroup.add(teamSide)
            
            var lifeBox = teamSide.create(game.world.centerX * pivotX, 150, "atlas.battle", "lifeContainer" + i)
            lifeBox.anchor.setTo(i, 0.5)

            var teamName = new Phaser.Text(teamSide.game, lifeBox.x, lifeBox.y - 105, "Equipo Alpha", fontStyle)
            teamName.anchor.setTo(i, 0.5)
            teamName.fontSize = 65
            teamName.stroke = "#000066"
            teamName.strokeThickness = 10
            teamSide.add(teamName)
            
            var life = teamSide.create(game.world.centerX * pivotX, lifeBox.y - 5, "atlas.battle", "lifeGauge")
            life.anchor.setTo(0, 0.5)
            life.scale.setTo(side, 1)
            teamSide.life = life
            
            var teamScore = teamSide.create(life.x - 80 * side, life.y * 2.5, "atlas.battle", "score" + i)
            teamScore.anchor.setTo(0.5)
            teamScore.scale.setTo(0.6)
            teamScore.points = 0
            teamSide.teamScore = teamScore
            
                var score = new Phaser.Text(teamSide.game, 0, 60, "0", fontStyle)
                score.anchor.setTo(0.5)
                score.scale.setTo(1.5)
                teamScore.addChild(score)
                teamScore.text = score
            
            var tokenGroup = game.add.group()
			tokenGroup.side = side
			teamSide.add(tokenGroup)
            teamSide.tokenGroup = tokenGroup
            
                var token = tokenGroup.create(life.x, life.y, "atlas.battle", "token" + i)
                token.anchor.setTo(0.5)
                token.scale.setTo(side, 1)
                token.x -= 78 * side

                var pic = game.add.sprite(0, - 10, "atlas.battle", listName[index])
                pic.anchor.setTo(0.5)
                pic.scale.setTo(0.8, 0.8)
                token.addChild(pic)
                
                index++
                
                for(var j = 0; j < 2; j++){
                    
                    var token = tokenGroup.create(life.x, life.y + 120, "atlas.battle", "token" + i)
                    token.anchor.setTo(0.5)
                    token.scale.setTo(0.75 * side, 0.75)
                    token.x -= 155 * j * side
                    
                    var pic = game.add.sprite(0, - 10, "atlas.battle", listName[index])
                    pic.anchor.setTo(0.5)
                    pic.scale.setTo(0.8, 0.8)
                    token.addChild(pic)
                    
                    index++
                }
            
            pivotX += 1.5
        }
    
		teamName.setText("Equipo Bravo")
		
		//createTimer(HUDGroup)
		HUDGroup.rotateTokens = rotateTokens.bind(HUDGroup)
		HUDGroup.getLifeBar = getLifeBar.bind(HUDGroup)
		HUDGroup.setScore = setScore.bind(HUDGroup)
        
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

	function getLifeBar(index){

		return this.children[index].life
	}

	function setScore(index){

        var score = this.children[index].teamScore
        score.points++
        game.add.tween(score.scale).to({x: 1, y:1}, 400, Phaser.Easing.Cubic.Out, true, 1500, 0, true).onStart.add(function(){
            score.text.setText(score.points)
        })
	}
	
	return{
		createHUD:createHUD,
	}

}()
