
var soundsPath = "../../shared/minigames/sounds/"

var battle = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    
    var bootFiles = {
		jsons: [
			{
				name: "sounds",
				file: "data/sounds/tournament.json"
			},
		],
		characters: [
			// {
			// 	name:"yogotarLuna",
			// 	file:"data/characters/yogotarLuna.json",
			// 	scales:['@0.5x']
			// }
		]
	}
    
	var assets = {
        atlases: [
            {   
                name: "atlas.battle",
                json: "images/battle/atlas.json",
                image: "images/battle/atlas.png",
            }
        ],
        images: [
            {
                name: "background",
                file: "images/battle/background.png",
            },
            {
                name: "listos",
                file: "images/battle/listos.png",
            },
            {
                name: "ya",
                file: "images/battle/ya.png",
            },
            {
                name: "frame",
                file: "images/battle/frame.png",
            },
            {
                name: "questionBoard",
                file: "images/battle/questionBoard.png",
            }
		],
		sounds: [
		],
        spritesheets: [
        ],
        spines:[
		],
        particles: [
		]
    }

    var TEAM_NAMES = ["alpha", "delta"]
	var DELAY_APPEAR = 800
    
    var SIDES = {
		LEFT:{direction: -1, scale:{x:1}},
		RIGHT:{direction: 1, scale:{x:-1}},
	}
    
    var POSITIONS = {
		UP:{x:130, y: -200, scale:{x:0.8, y:0.8}},
		MID:{x:350, y: 0, scale:{x:0.9, y:0.9}},
		DOWN:{x:-70, y: 120, scale:{x:1, y:1}},
	}
    
    var DAMAGE_PERCENT = [
        {normal: 0.1, super: 0.125, ultra: 0.167},
        {normal: 0.0666, super: 0.083, ultra: 0.111}
    ]
    
    var ATTACKS = ["normal", "super", "ultra"]

	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
	var ORDER_POSITIONS = [POSITIONS.UP, POSITIONS.MID, POSITIONS.DOWN]
	var CHARACTER_CENTER_OFFSET = {x:-200, y: -200}
    
    var QUESTIONS = {N_10: 0, N_15:1}
    var DAMAGE = DAMAGE_PERCENT[QUESTIONS.N_10]
    var MAX_LIFE
    
    var teams
    var battleSong
	var sceneGroup
    var teamsBarGroup
    var yogoGroup
    var questionGroup
    var specialAttack
    var blackMask
    var miniYogos = []
    var lifeBars = []
    var scoreRound = []
    
    var mainYogotorars
    var mainSpine
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#0D014D"
        loadSounds()
        mainYogotorars = []
        miniYogos = [[],[]]
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
        game.load.bitmapFont('skwig', 'images/fonts/font.png', 'images/fonts/font.fnt')
    }
    
	function createBackground(){
        
        var background = sceneGroup.create(0, 0, "background")
        background.width = game.world.width
        background.height = game.world.height
        
        blackMask = game.add.graphics()
        blackMask.beginFill(0x000000)
        blackMask.drawRect(0,0,game.world.width, game.world.height)
        blackMask.endFill()
        blackMask.alpha = 0
        sceneGroup.add(blackMask)
        
        var rotateButton = createButton(rotateTeam.bind(null, 0), 0x00ff00)
		rotateButton.x = game.world.centerX
		rotateButton.y = game.world.height - 150
		rotateButton.label.text = "rotate"
        
        var team = 0
        
        var damageButom = createButton(attackMove.bind(null, "normal"), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 250
		damageButom.label.text = "normal"
        
        var damageButom = createButton(attackMove.bind(null, "super"), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 200
		damageButom.label.text = "super"
        
        var damageButom = createButton(ultraMove, 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 150
		damageButom.label.text = "ultra"
        
        var returnBtn = createButton(returnCamera, 0xff0033)
		returnBtn.x = game.world.centerX 
		returnBtn.y = game.world.height - 200
		returnBtn.label.text = "zoom out"
        
        var win = createButton(setWinteam, 0xffaa33)
		win.x = game.world.centerX - 200
		win.y = game.world.height - 100
		win.label.text = "winner"
        
        var rect = game.add.graphics()
        rect.beginFill(0x242A4D)
        rect.drawRect(0, 0, game.world.width, 150)
        rect.endFill()
        rect.alpha = 0.5
        sceneGroup.add(rect)
    }
    
    function createButton(callback, color) {
		color = color || 0x000000

		var buttonGroup = game.add.group()

		var rectBg = game.add.graphics()
		rectBg.beginFill(color)
		rectBg.lineStyle(5, 0xffffff, 1)
		rectBg.drawRect(0, 0, 200, 50)
		rectBg.endFill()
		buttonGroup.add(rectBg)

		rectBg.inputEnabled = true
		rectBg.events.onInputDown.add(callback)

		var fontStyle = {font: "24px Arial", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var text = game.add.text(10, 10, "", fontStyle)
		buttonGroup.add(text)
		buttonGroup.label = text

		return buttonGroup
	}

	function update(){
		epicparticles.update()
    }
    
    function createTeamBars(){
    
        var fontStyle = {font: "65px skwig", fontWeight: "bold", fill: "#FFFFFE", align: "center"}
        var fontScore = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        teamsBarGroup = game.add.group()
        teamsBarGroup.fixedToCamera = true
        teamsBarGroup.cameraOffset.setTo(0, 0)
        sceneGroup.add(teamsBarGroup)
        
        var tokenGroup = game.add.group()
        
        listName = loadNames()
        
        var pivotX = 0.25
        var index = 0
        
        for(var i = 0; i < 2; i++){
            
            var side = ORDER_SIDES[i].scale.x
            
            var lifeBox = teamsBarGroup.create(game.world.centerX * pivotX, 150, "atlas.battle", "lifeContainer" + i)
            lifeBox.anchor.setTo(i, 0.5)
            
            var text = game.add.bitmapText(lifeBox.x, lifeBox.y - 120, 'skwig', "Equipo Alpha", 75)
            text.anchor.setTo(i,0.5)
            teamsBarGroup.add(text)
            
            var life = teamsBarGroup.create(game.world.centerX * pivotX, lifeBox.y - 5, "atlas.battle", "lifeGauge")
            life.anchor.setTo(0, 0.5)
            life.scale.setTo(side, 1)
            
            lifeBars.push(life)
            
            var token = tokenGroup.create(lifeBox.x, lifeBox.y, "atlas.battle", "token" + i)
            token.anchor.setTo(0.5)
            token.scale.setTo(side, 1)
            token.x -= 78 * side

            var pic = game.add.sprite(0, - 10, "atlas.battle", listName[index])
            pic.anchor.setTo(0.5)
            pic.scale.setTo(0.8, 0.8)
            token.addChild(pic)
            
            miniYogos[i].push(token)
            index++
            
            var teamScore = teamsBarGroup.create(token.x, token.y * 2.5, "atlas.battle", "score"+i)
            teamScore.anchor.setTo(0.5)
            teamScore.scale.setTo(0.6)
            
            var score = new Phaser.Text(sceneGroup.game, 0, 60, "99", fontScore)
            score.anchor.setTo(0.5)
            score.scale.setTo(1.5)
            teamScore.addChild(score)
            teamScore.text = score
            
            scoreRound.push(teamScore)
            
            for(var j = 0; j < 2; j++){
                
                var token = tokenGroup.create(lifeBox.x, lifeBox.y + 120, "atlas.battle", "token" + i)
                token.anchor.setTo(0.5)
                token.scale.setTo(0.75 * side, 0.75)
                token.x -= 155 * j * side
                
                var pic = game.add.sprite(0, - 10, "atlas.battle", listName[index])
                pic.anchor.setTo(0.5)
                pic.scale.setTo(0.8, 0.8)
                token.addChild(pic)
                
                miniYogos[i].push(token)
                index++
            }
            
            pivotX += 1.5
        }
    
        text.setText("Equipo Bravo")
        teamsBarGroup.add(tokenGroup)
        teamsBarGroup.tokenGroup = tokenGroup
        MAX_LIFE = -life.width
    }
    
    function loadNames(){
        
        var nameList = []
        
        for(var i = 0; i < teams.length; i++){
            for(var j = 0; j < teams[i].length; j++){
                var character = teams[i][j].name.substr(7).toLowerCase()
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
    
    function createTimer(){
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
        
        var timeToken = teamsBarGroup.create(game.world.centerX, 150, "atlas.battle", "timeToken")
        timeToken.anchor.setTo(0.5)
        
        var text = new Phaser.Text(sceneGroup.game, 0, -5, "3:00", fontStyle)
        text.anchor.setTo(0.5)
        timeToken.addChild(text)
        timeToken.text = text
    }
    
    function createSpecialAttack(){      
         
        var color = [0xffffff, 0x242A4D]
        
        specialAttack = game.add.group()
        specialAttack.lines = []
        sceneGroup.add(specialAttack)
        
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
        var yogo = specialAttack.create(frame.centerX, frame.y + frame.height * 0.48, mainSpine.data.name + "Special")
        yogo.anchor.setTo(0.5,1)
        specialAttack.yogo = yogo
        specialAttack.y = game.world.height
    }
    
    function createQuestionOverlay(){
        
        questionGroup = game.add.group()
        sceneGroup.add(questionGroup)
        
        var black = game.add.graphics()
        black.beginFill(0x000000)
        black.drawRect(0,0,game.world.width, game.world.height)
        black.endFill()
        black.alpha = 0.5
        questionGroup.add(black)
        
        var board = questionGroup.create(game.world.centerX + 50, game.world.height - 20, "questionBoard")
        board.anchor.setTo(0.5, 1)
        
        var box = questionGroup.create(board.centerX - 130, board.y - board.height + 5, "atlas.battle", "questionBox")
        box.anchor.setTo(0.5, 1)
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "left", wordWrap: true, wordWrapWidth: box.width - 180}
        
        var text = new Phaser.Text(sceneGroup.game, box.centerX + 70, box.centerY, "", fontStyle)
        text.anchor.setTo(0.5)
        questionGroup.add(text)
        
        var container = questionGroup.create(board.centerX - 110, board.centerY - board.height * 0.2, "atlas.battle", "questionImage")
        container.anchor.setTo(0.5)
        
        var img = questionGroup.create(0, 0, "atlas.battle", "dazzle")
        img.anchor.setTo(0.5)
        container.addChild(img)
        
        var options = game.add.group()
        questionGroup.add(options)
        var pivotX = 0.5
        
        for(var i = 0; i < 4; i++){
            
            var btn = options.create(board.centerX * pivotX, board.centerY + board.height * 0.17, "atlas.battle", "questionBtn")
            btn.anchor.setTo(0.5)
            btn.inputEnabled = true
            btn.events.onInputDown.add(function(btn){
                game.add.tween(btn.scale).to({x: 0.8, y:0.8}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
                    questionGroup.options.setAll("inputEnabled", false)
                    game.add.tween(questionGroup).to({alpha:0}, 500, Phaser.Easing.linear, true)
                })
            },this)
            
            var letter = new Phaser.Text(sceneGroup.game, -btn.width * 0.30, -5, "A", fontStyle)
            letter.anchor.setTo(0.5)
            btn.addChild(letter)
            btn.letter = letter
            
            var info = new Phaser.Text(sceneGroup.game, 0, 0, "info", fontStyle)
            info.anchor.setTo(0,0.5)
            btn.addChild(info)
            btn.info = info
            
            pivotX += 0.3
            
            if(i % 2 != 0){
                btn.y += 150
            }
        }
        
        options.children[1].letter.setText("B")
        options.children[2].letter.setText("C")
        options.children[3].letter.setText("D")
        
        questionGroup.question = text
        questionGroup.question.setText("Aqui va la pregunta Aqui va la preguntaAqui va la pregunta Aqui va la pregunta Aqui va la pregunta Aqui va la pregunta Aqui va la pregunta")
        questionGroup.image = img
        questionGroup.options = options
        questionGroup.options.setAll("inputEnabled", false)
        questionGroup.alpha = 0
        
        //questionGroup.setQuestion = setQuestion()
        
        var questionBtn = createButton(function(){
        	//questionGroup.setQuestion()
            setQuestion()
			}, 0x00ffff
		)
		questionBtn.x = game.world.centerX
		questionBtn.y = game.world.height - 250
		questionBtn.label.text = "questionBtn"
    }
    
    function setQuestion(question, image, options){

        //questionGroup.question.setText(question)
        questionGroup.question.alpha = 0
        //questionGroup.image.loadTexture("atlas.battle", image)
        questionGroup.image.alpha = 0
        for(var i = 0; i < questionGroup.options.length; i++){
            //questionGroup.options.children[i].info.setText(options[i])
            questionGroup.options.children[i].alpha = 0
        }
        
        game.add.tween(questionGroup).to({alpha:1}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            questionGroup.image.alpha = 1
            game.add.tween(questionGroup.image.scale).to({x:1.5, y:1.5}, 100, Phaser.Easing.linear, true, 0, 0, true)
            game.add.tween(questionGroup.question).to({alpha:1}, 400, Phaser.Easing.linear, true, 300)
            var delay = 200
            questionGroup.options.forEach(function(opt){
                opt.alpha = 1
                game.add.tween(opt).from({x: game.world.width + 300}, delay += 200, Phaser.Easing.Cubic.Out, true, 800).onComplete.add(function(){
                    opt.inputEnabled = true
                })
            })
        })
    }
    
    function rotateTeam(teamIndex){
        
		var team = teams[teamIndex]
		var side = ORDER_SIDES[teamIndex]
		var copyPositions = []

		function returnNormal(obj) {
			obj.setAnimation(["idle_normal"], true)
			obj.scale.x = obj.prevScale
			obj.updatePosition()
		}

		for (var playerIndex = 0; playerIndex < team.length; playerIndex++) {
			var character = team[playerIndex]

			var playerPos = playerIndex - 1 < 0 ? ORDER_POSITIONS.length - 1 : playerIndex - 1
			var newPosition = ORDER_POSITIONS[playerPos]
			copyPositions[playerIndex] = newPosition

			var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + newPosition.x * side.scale.x

			var characterPos = {
				x : game.world.centerX * 0.5 * side.direction + xOffset,
				y : CHARACTER_CENTER_OFFSET.y + game.world.centerY + newPosition.y
			}

			character.setAnimation(["run"], true)

			character.prevScale = newPosition.scale.x
			var toScaleX = newPosition.scale.x //facing direction
			if(character.x > characterPos.x) { //check facing direction
				character.scale.x *= -1
				toScaleX *= -1
			}

			game.add.tween(character.scale).to({x:toScaleX, y:newPosition.scale.y}, 490, null, true)
			var moveTween = game.add.tween(character).to({x:characterPos.x, y:characterPos.y}, 500, null, true)
			moveTween.onComplete.add(returnNormal)

			if(ORDER_POSITIONS[playerPos] === POSITIONS.MID)
				mainYogotorars[teamIndex] = character
		}

		yogoGroup.sort('y', Phaser.Group.SORT_ASCENDING)
		ORDER_POSITIONS = copyPositions
        
        rotateMinis(teamIndex)
	}
    
    function rotateMinis(index){
        
        var minis = miniYogos[index]
        var dir = ORDER_SIDES[index].scale.x
        
        for(var i = 0; i < minis.length; i++){
            
            var pic = minis[i]
            var pos = i + 1 >= minis.length ? 0 : i + 1
            var next = minis[pos]
            var size = next.y < pic.y ? 1 : 0.75
               
            game.add.tween(pic).to({x: next.x, y: next.y}, 500, Phaser.Easing.linear, true)
            game.add.tween(pic.scale).to({x: size * dir, y: size}, 490, Phaser.Easing.linear, true)
            
            if(size == 1)
                teamsBarGroup.tokenGroup.sendToBack(pic)
        }
    }
    
    function takeGroupDamage(type, element) {
		var team = this.characters

		for(var teamIndex = 0; teamIndex < team.length; teamIndex++){
			var character = team[teamIndex]

			character.takeDamage(type, element)
		}
	}
    
    function setCharacter(character, teamIndex) {

		var charObj = {
			name: character,
			file: "data/characters/" + character + ".json",
			scales: ["@0.5x"],
			teamNum:teamIndex
		}
		bootFiles.characters.push(charObj)
	}
    
    function pushSpecialArt(character){
        
        var charObj = {
			name: character + "Special",
			file: "images/battle/" + character + "Special.png",
		}
		assets.images.push(charObj)
    }

    function createAppear(character, teamIndex, charIndex) {
		character.alpha = 0
		var teamName = TEAM_NAMES[teamIndex]
		var teamTime = teamIndex * DELAY_APPEAR * teams[teamIndex].length
		var appearTime = DELAY_APPEAR * charIndex
		game.time.events.add(teamTime + appearTime, function (animation) {
			this.alpha = 1
			this.setAnimation([animation, "answer_good"], true)
		}, character, "appear_" + teamName)
	}

    function placeYogotars() {
        
        yogoGroup = game.add.group()
        yogoGroup.x = game.world.centerX
        yogoGroup.y = game.world.centerY
        sceneGroup.add(yogoGroup)

		for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
			var teamCharacters = teams[teamIndex]
			var side = ORDER_SIDES[teamIndex]

			for(var charIndex = 0; charIndex < teamCharacters.length; charIndex++){

				var character = teamCharacters[charIndex]
				var characterName = character.name
				var skin = character.skin
				var position = ORDER_POSITIONS[charIndex]
				var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + position.x * side.scale.x

				var characterPos = {
					x : game.world.centerX * 0.5 * side.direction + xOffset,
					y : CHARACTER_CENTER_OFFSET.y + game.world.centerY + position.y
				}
				var character = characterBattle.createCharacter(characterName, skin, characterPos)
				console.log("postion", character.position)
				character.scale.setTo(position.scale.x * side.scale.x, position.scale.y)
				character.teamIndex = teamIndex
				character.alpha = 0
                character.name = characterName
                character.skin = skin
				yogoGroup.add(character)
				createAppear(character, teamIndex, charIndex)

				var rect = game.add.graphics()
				rect.beginFill(0xffffff)
				rect.drawRect(0, 0, 200, 400)
				rect.endFill()
				rect.x = -100
				rect.y = -400
				rect.alpha = 0
				character.add(rect)
				rect.inputEnabled = true
				rect.events.onInputDown.add(selectYogotar)

				teams[teamIndex][charIndex] = character

				if(charIndex === 1)
					mainSpine = character

				if(ORDER_POSITIONS[charIndex] === POSITIONS.MID){
					mainYogotorars[teamIndex] = character
				}
			}

			var groupPoint = game.add.graphics()
			groupPoint.beginFill(0xffffff)
			groupPoint.drawRect(0, 0, 50, 10)
			groupPoint.endFill()
			groupPoint.x = game.world.centerX * 0.5 * side.direction + 100 * side.direction
			groupPoint.y = CHARACTER_CENTER_OFFSET.y + game.world.centerY + POSITIONS.MID.y
			groupPoint.characters = teamCharacters
			groupPoint.impactPoint = {x:groupPoint.x, y:groupPoint.y}
			groupPoint.takeDamage = takeGroupDamage.bind(groupPoint)
			groupPoint.side = side.direction
			groupPoint.alpha = 0
			teamCharacters.groupPoint = groupPoint

			yogoGroup.add(groupPoint)
		}
	}
    
    function selectYogotar(obj) {
		mainSpine = obj.parent
	}
    
    function createMenuAnimations() {
		var animations = mainSpine.spine.skeletonData.animations

		var pivotY, pivotX
		for (var animationIndex = 0; animationIndex < animations.length; animationIndex++) {
			var animationName = animations[animationIndex].name
			pivotY = Math.floor(animationIndex / 9)
			pivotX = animationIndex % 9

			var button = createButton(changeAnimation.bind(null, animationName))
			button.x = pivotX * 200
			button.y = pivotY * 50
			button.label.text = animationName
		}

		/*for(var attackIndex = 0; attackIndex < ATTACKS.length; attackIndex++){
			var buttonAttack = createButton(attack, 0xff0000)
			buttonAttack.tag = ATTACKS[attackIndex]
			buttonAttack.x = attackIndex * 200
			buttonAttack.y = (pivotY + 1) * 50
			buttonAttack.label.text = ATTACKS[attackIndex]
		}*/
	}
    
    function changeAnimation(name) {
		mainSpine.setAnimation([name], true)
	}
    
    function dealDamage(team, percent){
       
        var life = lifeBars[team]
        var damage = life.width - (MAX_LIFE * percent * ORDER_SIDES[team].scale.x)
        
        game.add.tween(life).to({width:damage}, 500, Phaser.Easing.Cubic.Out, true)
    }
    
    function attackMove(type){
        
        var otherTeam = mainSpine.teamIndex == 0 ? 1 : 0
        var target = type === "ultra" ? teams[otherTeam].groupPoint : mainYogotorars[otherTeam]
        
        if(type == "normal"){
            var damage = DAMAGE.normal
            zoomCamera(1.4, 2000, {x: game.world.centerX * 0.4, y:game.world.centerY + 100}) 
            game.time.events.add(2000, returnCamera)
        }
        else if(type == "super"){
            var damage = DAMAGE.super
            zoomCamera(1.4, 2000, {x: game.world.centerX * 0.4, y:game.world.centerY + 100}) 
            game.time.events.add(3000, returnCamera)
        }
        else{
            var damage = DAMAGE.ultra
        }

        mainSpine.attack(target, type, dealDamage.bind(null, otherTeam, damage))
    }
    
    function ultraMove(){
        
        var team = mainSpine.teamIndex
        var side = ORDER_SIDES[team]
        
        specialAttack.scale.setTo(side.scale.x, 1)
        specialAttack.y = 0
        specialAttack.x = game.world.width * team
        var spawnX = (specialAttack.frame.width + specialAttack.x) * side.direction

        specialAttack.yogo.loadTexture(mainSpine.data.name + "Special")
        specialAttack.lines.forEach(function(line){
            line.slide.resume()
        })
        
        game.add.tween(blackMask).to({alpha:0.5}, 300, Phaser.Easing.Cubic.InOut, true)
        game.add.tween(specialAttack.yogo).from({x:0}, 500, Phaser.Easing.Cubic.InOut, true, 300)
        var specialMove = game.add.tween(specialAttack).from({x:spawnX}, 500, Phaser.Easing.Cubic.InOut, true, 200)
        specialMove.repeat(1, 800)
        specialMove.onComplete.add(function(){
            specialAttack.lines.forEach(function(line){
                line.slide.pause()
            })
			blackMask.alpha = 0
			attackMove("ultra")
        })
    }
    
    function zoomCamera(zoom, delay, pos) {
         
        var scaleTween = game.add.tween(game.camera.scale).to({x:zoom, y:zoom}, delay, Phaser.Easing.Cubic.Out, true)
        game.add.tween(game.camera).to({x:pos.x, y:pos.y}, delay, Phaser.Easing.Cubic.Out, true)
        game.add.tween(blackMask).to({alpha:0.3}, 500, Phaser.Easing.Cubic.Out, true)
		
        var toScale1 = 1/zoom
		var actualScale = teamsBarGroup.scale.x
        
		scaleTween.onUpdateCallback(function () {
			if(toScale1 < actualScale) {
				teamsBarGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				teamsBarGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

			}else{
				teamsBarGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				teamsBarGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			}
		})
	}
    
    function returnCamera() {
		game.camera.follow(null)
		zoomCamera(1, 1000, {x:0, y:0})
		game.add.tween(blackMask).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
	}
    
    function setWinteam(){
        
        var rewardList = [[], []]
        
        for(var i = 0; i < teams.length; i++){
            for(var j = 0; j < teams[i].length; j++){
                
                var obj = {
                    name : teams[i][j].name.substr(7).toLowerCase(),
                    skin : teams[i][j].skin
                }
                rewardList[i].push(obj)
            }
        }
        
        battleMain.initResults(rewardList, game.rnd.integerInRange(0, 1))
        //battleMain.create()
        showResults()
    }
    
    function showResults() {
		game.add.tween(sceneGroup).to({alpha:0}, 1000, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
			sceneloader.show("reward")
		})
	}

	return {
		
		assets: assets,
        bootFiles:bootFiles,
		name: "battle",
		update: update,
        preload:preload,
        render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){
            
            sceneGroup = game.add.group()

            
            initialize()
            createBackground()	
            placeYogotars()
            createTeamBars()
            createTimer()
            createSpecialAttack()
            createQuestionOverlay()
            createMenuAnimations()
            //battleSong = sound.play("battleSong", {loop:true, volume:0.6})
            
		},
        setCharacter:setCharacter,
        setTeams: function (myTeams) {
			teams = myTeams
			for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
				var team = myTeams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character.name, teamIndex)
                    var img = team[charIndex].name.substr(7)
                    console.log(img)
                    pushSpecialArt(img)
				}
			}
		}
	}
}()