


var battleField = function(){
    
    function createBackground(group){
        
        var back = group.create(0, 0, "back")
        back.width = game.world.width
        back.height = game.world.height
        
//        var background = spineLoader.createSpine("background", "normal", "idle", game.world.centerX, game.world.centerY, true)
//        group.add(background)
        
        var pipes = group.create(-60, -150, "pipes")
        
        var cubes = spineLoader.createSpine("cubes", "normal", "idle", game.world.centerX - 30, game.world.centerY - 110, true)
        group.add(cubes)
        
        var triangles = spineLoader.createSpine("triangles", "normal", "idle", 380, game.world.centerY - 80, true)
        group.add(triangles)
        
        var floor = spineLoader.createSpine("floor", "normal", "idle", game.world.centerX - 10, game.world.centerY + 20, true)
        group.add(floor)
        
        var cylinder = spineLoader.createSpine("cylinder", "normal", "idle", game.world.centerX - 330, game.world.centerY - 30, true)
        group.add(cylinder)
        
        var blackMask = game.add.graphics()
        blackMask.beginFill(0x000000)
        blackMask.drawRect(0,0,game.world.width, game.world.height)
        blackMask.endFill()
        blackMask.alpha = 0
        group.add(blackMask)
        group.blackMask = blackMask
        
        var rect = game.add.graphics()
        rect.beginFill(0x242A4D)
        rect.drawRect(0, 0, game.world.width, 150)
        rect.endFill()
        rect.alpha = 0.5
        group.add(rect)
    }
    
    function createTeamBars(SIDES, listName){
    
        var fontStyle = {font: "65px skwig", fontWeight: "bold", fill: "#FFFFFE", align: "center"}
        var fontScore = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var teamsBarGroup = game.add.group()
        teamsBarGroup.fixedToCamera = true
        teamsBarGroup.cameraOffset.setTo(0, 0)
        
        var pivotX = 0.25
        var index = 0
        
        for(var i = 0; i < 2; i++){
            
            var side = SIDES[i].scale.x
            
            var teamSide = game.add.group()
            teamsBarGroup.add(teamSide)
            
            var lifeBox = teamSide.create(game.world.centerX * pivotX, 150, "atlas.battle", "lifeContainer" + i)
            lifeBox.anchor.setTo(i, 0.5)
            
            var text = game.add.bitmapText(lifeBox.x, lifeBox.y - 120, 'skwig', "Equipo Alpha", 75)
            text.anchor.setTo(i,0.5)
            teamSide.add(text)
            
            var life = teamSide.create(game.world.centerX * pivotX, lifeBox.y - 5, "atlas.battle", "lifeGauge")
            life.anchor.setTo(0, 0.5)
            life.scale.setTo(side, 1)
            teamSide.life = life
            
            var teamScore = teamSide.create(lifeBox.x - 80 * side, lifeBox.y * 2.5, "atlas.battle", "score" + i)
            teamScore.anchor.setTo(0.5)
            teamScore.scale.setTo(0.6)
            teamScore.points = 0
            teamSide.teamScore = teamScore
            
            var score = new Phaser.Text(teamSide.game, 0, 60, "0", fontScore)
            score.anchor.setTo(0.5)
            score.scale.setTo(1.5)
            teamScore.addChild(score)
            teamScore.text = score
            
            var tokenGroup = game.add.group()
            teamSide.add(tokenGroup)
            teamSide.tokenGroup = tokenGroup
            
            var token = tokenGroup.create(lifeBox.x, lifeBox.y, "atlas.battle", "token" + i)
            token.anchor.setTo(0.5)
            token.scale.setTo(side, 1)
            token.x -= 78 * side

            var pic = game.add.sprite(0, - 10, "atlas.battle", listName[index])
            pic.anchor.setTo(0.5)
            pic.scale.setTo(0.8, 0.8)
            token.addChild(pic)
            
            index++
            
            for(var j = 0; j < 2; j++){
                
                var token = tokenGroup.create(lifeBox.x, lifeBox.y + 120, "atlas.battle", "token" + i)
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
    
        text.setText("Equipo Bravo")
        
        return teamsBarGroup
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
    
    function createSpecialAttack(yogo){      
         
        var color = [0xffffff, 0x242A4D]
        
        var specialAttack = game.add.group()
        specialAttack.lines = []
        
        var frame = specialAttack.create(-10, game.world.centerY , "frame")
        frame.anchor.setTo(0, 0.5)
        specialAttack.frame = frame
        
        var poly = new Phaser.Polygon([new Phaser.Point(frame.x, frame.y + frame.height * 0.45), 
                                       new Phaser.Point(frame.x, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 120, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 10, frame.y + frame.height * 0.45)])
        
        var mask = game.add.graphics(0, 0)
        mask.beginFill(0xffffff) 
        mask.drawPolygon(poly.points)
        specialAttack.add(mask)

        var offset = -frame.height * 0.45
        
        while(offset < frame.height * 0.48){
            
            var long = game.rnd.integerInRange(5, 8) * 100
            var tall = game.rnd.integerInRange(1, 2) * 5
            var timer = game.rnd.integerInRange(2, 4) * 100

            var line = game.add.graphics()
            line.beginFill(color[game.rnd.integerInRange(0, 1)])
            line.drawRoundedRect(-long, offset, long, tall, tall * 0.5)
            line.endFill()
            line.mask = mask
            frame.addChild(line)
            specialAttack.lines.push(line)
            
            line.slide = game.add.tween(line).to({x: frame.width * 2}, timer, Phaser.Easing.linear, true)
            line.slide.repeat(-1, game.rnd.integerInRange(2, 6) * 50)
            line.slide.pause()
            
            offset += game.rnd.integerInRange(3, 10) * 5
        }
        
        var yogo = specialAttack.create(frame.centerX, frame.y + frame.height * 0.48, yogo + "Special")
        yogo.anchor.setTo(0.5,1)
        specialAttack.yogo = yogo
        specialAttack.y = game.world.height + 100
        
        return specialAttack
    }
    
    function createListosYa(){
        
        var listosYaGroup = game.add.group()
        
        var listos = listosYaGroup.create(game.world.centerX, -150, "listos")
        listos.anchor.setTo(0.5)
        listosYaGroup.listos = listos
        
        var ya = listosYaGroup.create(game.world.centerX, game.world.centerY, "ya")
        ya.anchor.setTo(0.5)
        ya.scale.setTo(0)
        listosYaGroup.ya = ya
        
        return listosYaGroup
    }
    
    function createScores(SIDES, group){
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
        var pivotX = 0.7
        
        var playerAnswers = []
        
        for(var i = 0; i < 2; i++){
        
            var side = SIDES[i]

            var teamScore = game.add.group()
            teamScore.x = game.world.centerX * pivotX
            teamScore.y = game.world.centerY - 130
            teamScore.time = 0
            group.add(teamScore)
            playerAnswers.push(teamScore)
            
            var timeDif = new Phaser.Text(group.game, 50 * side.direction, -70, "-2 sec", fontStyle)
            timeDif.anchor.setTo(0.5)
            timeDif.fill = "#ffff54"
            timeDif.fontSize = 45
            timeDif.stroke = "#000066"
            timeDif.strokeThickness = 10
            timeDif.alpha = 0
            teamScore.add(timeDif)
            teamScore.diference = timeDif

            var timeCont = teamScore.create(0, 0, "atlas.answers", "timeCont")
            timeCont.anchor.setTo(0.5)
            timeCont.scale.setTo(side.direction, 1)
            
            var timeTxt = new Phaser.Text(group.game, 50 * side.direction, 7, "0:00", fontStyle)
            timeTxt.anchor.setTo(0.5)
            timeTxt.alpha = 0
            teamScore.add(timeTxt)
            teamScore.timeTxt = timeTxt

            var stock = teamScore.create(200 * side.direction, 0, "atlas.answers", "stock")
            stock.anchor.setTo(0.5)
            teamScore.stock = stock
            
            var bg = teamScore.create(0, 80, "atlas.answers", "containerBG")
            bg.anchor.setTo(0.5)
            
            var bar = game.add.sprite(110 * side.direction, 0, "atlas.answers", "fillBar")
            bar.anchor.setTo(i, 0.5)
            bg.addChild(bar)
            teamScore.bar = bar
            
            var shine = game.add.sprite(0, 0, "atlas.answers", "shineBar")
            shine.anchor.setTo(0.5)
            shine.alpha = 0
            bg.addChild(shine)
            teamScore.shine = shine
            
            var container = game.add.sprite(0, 0, "atlas.answers", "container" + i)
            container.anchor.setTo(0.5)
            bg.addChild(container)
            
            var particle = game.add.emitter(0, 50, 50);
            particle.makeParticles("atlas.answers", "bubblePart");
            particle.gravity = -150;
            particle.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.In)
            particle.width = bg.width
            teamScore.add(particle)
            teamScore.parts = particle

            pivotX = 1.3
            teamScore.alpha = 0
        }
        
        return playerAnswers
    }
    
    return{
        createBackground:createBackground,
        createTeamBars:createTeamBars,
        createTimer:createTimer,
        createSpecialAttack:createSpecialAttack,
        createListosYa:createListosYa,
        createScores:createScores
    }
    
}()
