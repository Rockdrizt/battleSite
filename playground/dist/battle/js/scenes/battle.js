
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
            },
            {   
                name: "atlas.question",
                json: "images/questionOverlay/atlas.json",
                image: "images/questionOverlay/atlas.png",
            },
            {   
                name: "atlas.answers",
                json: "images/answers/atlas.json",
                image: "images/answers/atlas.png",
            }
        ],
        images: [
            {
                name: "back",
                file: "images/battle/back.png",
            },
            {
                name: "listos",
                file: "images/questionOverlay/listos.png",
            },
            {
                name: "ya",
                file: "images/questionOverlay/ya.png",
            },
            {
                name: "frame",
                file: "images/battle/frame.png",
            },
            {
                name: "questionBoard",
                file: "images/questionOverlay/questionBoard.png",
            },
            {
                name: "pinkLight",
                file: "images/yogoSelector/pinkLight.png",
            },
            {
                name: "pipes",
                file: "images/battle/pipes.png",
            }
		],
		sounds: [
		],
        spritesheets: [
        ],
        spines:[
            {
				name:"background",
				file:"spines/battle/background/Background2.json",
			},
            {
				name:"cubes",
				file:"spines/battle/cubes/cubes.json",
			},
            {
				name:"cylinder",
				file:"spines/battle/energy_cylinder/energy_cylinder.json",
			},
            {
				name:"floor",
				file:"spines/battle/floor/floor.json",
			},
            {
				name:"triangles",
				file:"spines/battle/triangle/triangle.json",
			}
		],
        particles: [
		]
    }

    var TEAM_NAMES = ["alpha", "delta"]
	var DELAY_APPEAR = 800
	var YOGOTARS_PER_TEAM = 3
    
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
    
    var COLORS = [0xFC1E79, 0x00D8FF]
    
    var teams
    var battleSong
	var sceneGroup
    var teamsBarGroup
    var yogoGroup
    var questionGroup
    var listosYaGroup
    var specialAttack
    var blackMask
    var miniYogos = []
    var lifeBars = []
    var scoreBoards = []
    var usedQuestions = []
    var playerAnswers = []
	var layers
    var attackTxt
    
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
        
        riddles.loadQuestions()
        operationGenerator.setConfiguration()
        usedQuestions = []
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
        game.load.bitmapFont('skwig', 'fonts/font.png', 'fonts/font.fnt')
    }
    
	function createBackground(){
        
        battleField.createBackground(sceneGroup)
        blackMask = sceneGroup.blackMask
    }
        
    function menubuttons(){
        
        btngroup= game.add.group()
        
        var rotateButton = createButton(rotateTeam.bind(null, 0), 0x00ff00)
		rotateButton.x = game.world.centerX
		rotateButton.y = game.world.height - 150
		rotateButton.label.text = "rotate"
        btngroup.add(rotateButton)
        
        var damageButom = createButton(attackMove.bind(null, "normal", 1), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 250
		damageButom.label.text = "normal"
        btngroup.add(damageButom)
        
        var damageButom = createButton(attackMove.bind(null, "super", 0), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 200
		damageButom.label.text = "super"
        btngroup.add(damageButom)
        
        var damageButom = createButton(ultraMove.bind(null, 0), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 150
		damageButom.label.text = "ultra"
        btngroup.add(damageButom)
        
        var returnBtn = createButton(returnCamera, 0xff0033)
		returnBtn.x = game.world.centerX 
		returnBtn.y = game.world.height - 200
		returnBtn.label.text = "zoom out"
        btngroup.add(returnBtn)
        
        var win = createButton(setWinteam, 0xffaa33)
		win.x = game.world.centerX - 200
		win.y = game.world.height - 100
		win.label.text = "winner"
        btngroup.add(win)
        
        //var quest = createButton(getQuestion, 0x00ffff)
        var quest = createButton(getOperation, 0x00ffff)
		quest.x = game.world.centerX
		quest.y = game.world.height - 100
		quest.label.text = "questions"
        btngroup.add(quest)
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
    
        listName = loadNames()
        
        teamsBarGroup = battleField.createTeamBars(ORDER_SIDES, listName)
        sceneGroup.add(teamsBarGroup)
        
        for(var i = 0; i < teamsBarGroup.length; i++){
            
            var subGroup = teamsBarGroup.children[i]
            lifeBars.push(subGroup.life)
            scoreBoards.push(subGroup.teamScore)
            
            var tokens = subGroup.tokenGroup
            
            for(var k = 0; k < tokens.length; k++){
                miniYogos[i].push(tokens.children[k])
            }
        }
        
        battleField.createTimer(teamsBarGroup)
        MAX_LIFE = lifeBars[0].width
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
    
    function createSpecialAttack(){      
         
        specialAttack = battleField.createSpecialAttack(mainYogotorars[0].data.name)
        sceneGroup.add(specialAttack)
    }
    
    function createQuestionOverlay(){
        
        questionGroup = battleField.createQuestionOverlay()
        sceneGroup.add(questionGroup)
        questionGroup.alpha = 0
        
        questionGroup.options.forEach(function(btn){
             btn.inputEnabled = true
            btn.events.onInputDown.add(hideQuestionOverlay,this)
        })
        questionGroup.options.setAll("inputEnabled", false)
    }
    
    function createScores(){
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
        
        playerAnswers = battleField.createScores(ORDER_SIDES, sceneGroup)
                
        attackTxt = new Phaser.Text(sceneGroup.game, playerAnswers[0].x, playerAnswers[0].y, "NORMAL", fontStyle)
        attackTxt.anchor.setTo(0.5)
        attackTxt.fill = "#ffff54"
        attackTxt.fontSize = 80
        attackTxt.fontStyle = "italic"
        attackTxt.alpha = 0
        sceneGroup.add(attackTxt)
        
        var black = game.add.graphics()
        black.beginFill(0x000000, 0.5)
        black.drawRect(-playerAnswers[0].x, -playerAnswers[0].y,game.world.width, game.world.height)
        black.endFill()
        playerAnswers[0].addChildAt(black,0)
    }
    
    function createListosYa(){
        
        listosYaGroup = battleField.createListosYa()
        sceneGroup.add(listosYaGroup)
    }
    
    function rotateTeam(teamIndex){
        
		var team = teams[teamIndex]
		var side = ORDER_SIDES[teamIndex]
		var copyPositions = []

		function returnNormal(obj) {
			obj.setAnimation(["idle_normal"], true)
			obj.scale.x = obj.prevScale
			obj.updatePosition()

			if(obj.index < team.length - 1)
			layers[obj.index].add(obj)

			team[obj.index] = obj
		}

		for (var playerIndex = 0; playerIndex < team.length; playerIndex++) {
			var character = team[playerIndex]

			var newPlayerIndex = playerIndex - 1 < 0 ? ORDER_POSITIONS.length - 1 : playerIndex - 1
			var newPosition = ORDER_POSITIONS[newPlayerIndex]
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

			character.index = newPlayerIndex
			game.add.tween(character.scale).to({x:toScaleX, y:newPosition.scale.y}, 490, null, true)
			var moveTween = game.add.tween(character).to({x:characterPos.x, y:characterPos.y}, 500, null, true)
			moveTween.onComplete.add(returnNormal)

			if(ORDER_POSITIONS[newPlayerIndex] === POSITIONS.MID)
				mainYogotorars[teamIndex] = character

			if(newPlayerIndex === team.length - 1) {
				layers[newPlayerIndex].add(character)
				layers[newPlayerIndex].sendToBack(character)
			}

		}

		yogoGroup.sort('y', Phaser.Group.SORT_ASCENDING)
		//ORDER_POSITIONS = copyPositions
        
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
                pic.parent.sendToBack(pic)
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

		layers = []
		for(var lIndex = 0; lIndex < YOGOTARS_PER_TEAM; lIndex++){
			var layer = game.add.group()
			yogoGroup.add(layer)
			layers.push(layer)
		}

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
				character.index = charIndex
				layers[charIndex].add(character)
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
        var index = team == 0 ? 1 : 0
        var otherTeam = teams[index] 
        
        game.add.tween(life).to({width:damage}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
            otherTeam.forEach(function(member){
                member.setAnimation(["idle_normal"], true)
            })
        })
    }
    
    function attackMove(type, index){
        
        var yogotar = mainYogotorars[index]
        console.log(index)
        var otherTeam = index == 0 ? 1 : 0
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

        yogotar.attack(target, type, dealDamage.bind(null, otherTeam, damage))
    }
    
    function ultraMove(index){
        
        var yogotar = mainYogotorars[index]
        var side = ORDER_SIDES[index]
        
        supportAnimation(index)
        
        game.time.events.add(2000, function(){
            
            specialAttack.scale.setTo(side.scale.x, 1)
            specialAttack.y = 0
            specialAttack.x = game.world.width * index
            var spawnX = (specialAttack.frame.width + specialAttack.x) * side.direction

            specialAttack.yogo.loadTexture(yogotar.data.name + "Special")
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
                attackMove("ultra", index)
            })
        })
    }
    
    function supportAnimation(index){
        
        var subteam = teams[index]
        var aux = 2
        
        var color = COLORS[index]
        var names = ["cheer_flag", "cheer_glove"]

        for(var i = 0; i < subteam.length; i++){
            
            var yogo = subteam[i]
            
            if(yogo == mainYogotorars[index]){
                yogo.setAnimation(["ready"], true)
            }
            else{
                yogo.setAnimation(["support_yog" + aux], true)
                aux++
                
                for(var k = 0; k < names.length; k++){
                    
                    var slot = yogo.getSlotContainer(names[k])
					if(!slot)
						continue;
					slot.tint = color
                    yogo.spine.updateTransform()
                }
            }
        }
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
        
        battleMain.initWinerTeam(game.rnd.integerInRange(0, 1))
        game.add.tween(white).to({alpha:1}, 300, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
			sceneloader.show("reward")
		})
    }
    
    function createWhite(){
        
        white = game.add.graphics()
        white.beginFill(0xffffff)
        white.drawRect(0, 0, game.world.width, game.world.height)
        white.endFill()
        white.alpha = 0
    }
    
    function getOperation(){
        
        var ope = operationGenerator.generate()
        var question = ope.operand1 + " " + ope.operator + " " + ope.operand2
        var correctAnswer = ope.correctAnswer
        var possibleAnswers = [correctAnswer]
		var negativeOrPositive = Math.round(Math.random()) * 2 - 1;
        var scaleImg = fixImage(1)
        console.log(scaleImg)
        
		for(var i = 0; i < 3; i++){
            
			var diff = Math.floor(correctAnswer / 10) > 1 ? game.rnd.integerInRange(5, 10) : game.rnd.integerInRange(1, 5)
            
			negativeOrPositive = negativeOrPositive * -1
			var n = correctAnswer + diff * negativeOrPositive
			possibleAnswers.push(n)
		}
        
        Phaser.ArrayUtils.shuffle(possibleAnswers)
        questionGroup.question.setText(question)
        
        for(var i = 0; i < possibleAnswers.length; i++){
        
            var opt = questionGroup.options.children[i]
            opt.info.setText(possibleAnswers[i])
            
            if(correctAnswer === possibleAnswers[i])
                opt.correct = true
            else
                opt.correct = false
        }
        
        var delay = 200
        var last
        
        game.add.tween(questionGroup).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)
        
        questionGroup.boxes.forEach(function(box){
            last = game.add.tween(box.scale).to({x: 1}, 400, Phaser.Easing.Cubic.Out, true, delay)
            delay += 400
        }) 
        
        questionGroup.options.forEach(function(opt){
            game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay).onComplete.add(function(){
                opt.inputEnabled = true
            })
            delay += 200
        })
        
        delay += 200
        game.add.tween(questionGroup.question).to({alpha:1}, 300, Phaser.Easing.linear, true, delay)
        game.add.tween(questionGroup.image.scale).to({x:scaleImg, y:scaleImg}, 300, Phaser.Easing.Cubic.InOut, true, delay)
    }
    
    function getQuestion(){
        
        var newQuestion = riddles.selectQuestion(usedQuestions)
        
        if(newQuestion == -1){
            usedQuestions = []
            getQuestion()
        }
        else{
            usedQuestions.push(newQuestion.index)
            game.load.image(newQuestion.image, newQuestion.src + ".jpg")
            //game.load.onLoadComplete.add(setQuestion, this, null, newQuestion)
            game.load.onLoadComplete.add(function(){
                warning(function(){setQuestion(newQuestion)})
            }, this)
            game.load.start()
        }
    }
    
    function warning(callBack){
        
        var first = game.add.tween(listosYaGroup.listos).to({y: game.world.centerY}, 200, Phaser.Easing.Cubic.Out, true)
        first.yoyo(true, 700)
        
        var second = game.add.tween(listosYaGroup.ya.scale).to({x: 1,y: 1}, 400, Phaser.Easing.Elastic.Out, false)
        var secondOut = game.add.tween(listosYaGroup.ya.scale).to({x: 0,y: 0}, 300, Phaser.Easing.Cubic.InOut, false, 300)
        secondOut.onComplete.add(callBack)
        
        first.chain(second)
        second.chain(secondOut)
    }
    
    function setQuestion(riddle){

        var delay = 200
        var last
        
        questionGroup.question.setText(riddle.question)
        questionGroup.image.loadTexture(riddle.image)
        var scaleImg = fixImage(1)
        questionGroup.image.key = riddle.image
        
        Phaser.ArrayUtils.shuffle(riddle.answers)
        
        for(var i = 0; i < riddle.answers.length; i++){
        
            var opt = questionGroup.options.children[i]
            opt.info.setText(riddle.answers[i].text)
            opt.correct = riddle.answers[i].correct
        }
        
        game.add.tween(questionGroup).to({alpha: 1}, 100, Phaser.Easing.Cubic.Out, true)
        
        questionGroup.boxes.forEach(function(box){
            last = game.add.tween(box.scale).to({x: 1}, 400, Phaser.Easing.Cubic.Out, true, delay)
            delay += 400
        }) 
        
        questionGroup.options.forEach(function(opt){
            game.add.tween(opt).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true, delay).onComplete.add(function(){
                opt.inputEnabled = true
            })
            delay += 200
        })
        
        delay += 200
        game.add.tween(questionGroup.question).to({alpha:1}, 300, Phaser.Easing.linear, true, delay)
        game.add.tween(questionGroup.image.scale).to({x:scaleImg, y:scaleImg}, 300, Phaser.Easing.Cubic.InOut, true, delay)
    }
    
    function fixImage(scale){
        
        questionGroup.image.scale.setTo(scale)
        if(questionGroup.image.height > questionGroup.container.height){
            return fixImage(scale - 0.1)
        }
        else{
            questionGroup.image.scale.setTo(0)
            questionGroup.image.alpha = 1
            return scale
        }
    }
    
    function hideQuestionOverlay(btn){
        
        questionGroup.options.setAll("inputEnabled", false)
        
        questionGroup.options.forEach(function(opt){
            if(opt != btn){
                game.add.tween(opt).to({alpha:0}, 300, Phaser.Easing.linear, true)
            }
        })
        
        questionGroup.light.x = btn.x - 100
        questionGroup.light.y = btn.y
        var shine = game.add.tween(questionGroup.light.scale).to({x: 0.5, y:0.5}, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true)
        
        var newY = questionGroup.boxes[1].y - 180
        var choise = game.add.tween(btn).to({x: game.world.centerX, y:newY}, 500, Phaser.Easing.Cubic.Out, false)
                 
        playerAnswers[0].alpha = 1
        playerAnswers[1].alpha = 1
        var fadeOut = game.add.tween(questionGroup).to({alpha:0}, 500, Phaser.Easing.linear, false, 1000)
        fadeOut.onComplete.add(function(){
            questionGroup.image.scale.setTo(0)
            questionGroup.image.alpha = 0
            questionGroup.question.alpha = 0
            questionGroup.options.forEach(function(opt){
                opt.alpha = 0
                opt.x = opt.spawn.x
                opt.y = opt.spawn.y
            })
            questionGroup.boxes.forEach(function(box){
                box.scale.setTo(0, 1)
            })
            
            game.time.events.add(1000, checkAnswer)
        })
        shine.chain(choise)    
        choise.chain(fadeOut)
        
        removeImage(questionGroup.image.key)
    }
    
    function removeImage(image){
        //console.log(game.cache.checkImageKey(image))
        if(game.cache.checkImageKey(image)){
            console.log(image)
            game.cache.removeImage(image,false)
        }
        //console.log(game.cache.checkImageKey(image))
    }
    
    function checkAnswer(){
            
        var MAX_TIME = 180000 //3 min
        var P1 = {ans: true,
                  time: 50000 //2 min 30 seg
                 }
        var P2 = {ans: true,
                  time: 60000 //1 min 30 seg
                 }
        var events = [P1, P2]
        var diference = convertTime(Math.abs(P1.time - P2.time))
        
        for(var i = 0; i < playerAnswers.length; i++){
            
            var newScale = convertScale(events[i].time)
            var ansTime = convertTime(events[i].time)
            
            var score = playerAnswers[i]
            score.alpha = 1
            score.timeTxt.setText(ansTime)
            score.diference.setText("+" + diference)
            score.stock.loadTexture("atlas.answers", "ans" + events[i].ans)
            score.time = events[i].time
            
            var correct = game.add.tween(score.stock.scale).to({x:1.3, y:1.3}, 200, Phaser.Easing.Cubic.Out, true, 0, 0, true)
            var sizeBar = game.add.tween(score.bar.scale).to({x: newScale}, 400, Phaser.Easing.Cubic.Out, false)
            var showTime = game.add.tween(score.timeTxt).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, false)
            
            correct.chain(sizeBar)
            sizeBar.chain(showTime)
        }
        
        if(P1.ans && !P2.ans){
            
            setWiner(playerAnswers[0])
            setLoser(playerAnswers[1], 1)
        }
        else if(!P1.ans && P2.ans){
            
            setWiner(playerAnswers[1])
            setLoser(playerAnswers[0], -1)
        }
        else if(P1.ans && P2.ans){
            
            if(P1.time < P2.time){
                setWiner(playerAnswers[0], true)
                setLoser(playerAnswers[1], 1) 
            }
            else{
                setWiner(playerAnswers[1], true)
                setLoser(playerAnswers[0], -1)
            }
        }
        else{
            setLoser(playerAnswers[0], -1)
            setLoser(playerAnswers[1], 1)
        }
    }
    
    function selectAttackType(time){
        
        if(time > 0 && time <= 60000){
            return "ultra"
        }
        else if(time > 60000 && time <= 120000){
            return "super"
        }
        else{
            return "normal"
        }
    }
    
    function setWiner(results, tie){
        
        if(tie) results.diference.alpha = 1
        
        var attack = selectAttackType(results.time)
        attackTxt.setText(attack.toUpperCase() + " ")

        var fadeOut = game.add.tween(results).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, false, 1000)
        var showShine = game.add.tween(results.shine.scale).from({y:0}, 400, Phaser.Easing.Cubic.Out, false, 500)
        game.add.tween(results.diference).from({y: 30}, 400, Phaser.Easing.Cubic.Out, true, 1500).chain(showShine)
        showShine.chain(fadeOut)
        
        showShine.onStart.add(function(){
            results.parts.start(true, 1000, null, 20)
            results.shine.alpha = 1
        })
        fadeOut.onComplete.add(function(){
            
            attackTxt.x = results.x
            attackTxt.y = results.y
            attackTxt.alpha = 1
            game.add.tween(attackTxt).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, true, 1000).onComplete.add(function(){
                var index = playerAnswers.indexOf(results)
                scoreBoards[index].points++
                scoreBoards[index].text.setText(scoreBoards[index].points)
                attack == "ultra" ? ultraMove(index) : attackMove(attack, index)
            })
        })
    }
    
    function setLoser(results, side){
        
        var fadeOut = game.add.tween(results).to({alpha: 0}, 1000, Phaser.Easing.Cubic.Out, false)
        fadeOut.onComplete.add(restartResults)
        game.add.tween(results).to({angle: 50 * side}, 1000, Phaser.Easing.Bounce.Out, true, 2000).chain(fadeOut)
    }
    
    function restartResults(){
        
        for(var i = 0; i < playerAnswers.length; i++){
            
            var results = playerAnswers[i]
            results.stock.loadTexture("atlas.answers", "stock")
            results.angle = 0
            results.diference.alpha = 0
            results.timeTxt.alpha = 0
            results.time = 0
            results.bar.scale.setTo(1)
            results.shine.alpha = 0
            //results.parts.on = false
        }
    }
    
    function convertScale(time){
        
        var MAX_TIME = 180000
        
        return 1 - time/MAX_TIME
    }
    
    function convertTime(time) {
        
      var min = Math.floor(time / 60000)
      var sec = ((time % 60000) / 1000).toFixed(0)
      
      return min + ":" + (sec < 10 ? '0' : '') + sec
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
            createSpecialAttack()
            createScores()
            createQuestionOverlay()
            createListosYa()
            //createMenuAnimations()
            menubuttons()
            //battleSong = sound.play("battleSong", {loop:true, volume:0.6})
            createWhite()

            game.add.tween(sceneGroup).from({alpha:0},500, Phaser.Easing.Cubic.Out,true)
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