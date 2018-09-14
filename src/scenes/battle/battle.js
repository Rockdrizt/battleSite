
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
				file: settings.BASE_PATH + "/data/sounds/tournament.json"
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
				json: settings.BASE_PATH + "/images/battle/atlas.json",
				image: settings.BASE_PATH + "/images/battle/atlas.png",
			},
			{
				name: "atlas.question",
				json: settings.BASE_PATH + "/images/questionOverlay/atlas.json",
				image: settings.BASE_PATH + "/images/questionOverlay/atlas.png",
			},
			{
				name: "atlas.feedback",
				json: settings.BASE_PATH + "/images/feedback/atlas.json",
				image: settings.BASE_PATH + "/images/feedback/atlas.png",
			}
		],
		images: [
			{
				name: "back",
				file: settings.BASE_PATH + "/images/battle/back.png",
			},
			{
				name: "listos",
				file: settings.BASE_PATH + "/images/questionOverlay/listos.png",
			},
			{
				name: "ya",
				file: settings.BASE_PATH + "/images/questionOverlay/ya.png",
			},
			{
				name: "frame",
				file: settings.BASE_PATH + "/images/battle/frame.png",
			},
			{
				name: "questionBoard",
				file: settings.BASE_PATH + "/images/questionOverlay/questionBoard.png",
			},
			{
				name: "pinkLight",
				file: settings.BASE_PATH + "/images/yogoSelector/pinkLight.png",
			},
			{
				name: "pipes",
				file: settings.BASE_PATH + "/images/battle/pipes.png",
			},
			{
				name: "default",
				file: settings.BASE_PATH + "/images/questionDB/default.png",
			}
		],
		sounds: [
			{	name: "battleSong",
				file: "../../sounds/songs/battle.mp3"},
			{	name: "listos",
				file: "../../sounds/sounds/listos.wav"},
			{	name: "ya",
				file: "../../sounds/sounds/ya.wav"},
		],
		spritesheets: [
		],
		spines:[
			{
				name:"background",
				file:settings.BASE_PATH + "/spines/battle/background/Background2.json",
			},
			{
				name:"cubes",
				file:settings.BASE_PATH + "/spines/battle/cubes/cubes.json",
			},
			{
				name:"cylinder",
				file:settings.BASE_PATH + "/spines/battle/energy_cylinder/energy_cylinder.json",
			},
			{
				name:"floor",
				file:settings.BASE_PATH + "/spines/battle/floor/floor.json",
			},
			{
				name:"triangles",
				file:settings.BASE_PATH + "/spines/battle/triangle/triangle.json",
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

	var DAMAGE_PERCENT = {
		1:{normal: 0.1, super: 0.125, ultra: 0.167},
		2:{normal: 0.0666, super: 0.083, ultra: 0.111},
		3:{normal: 0.2, super: 0.25, ultra: 0.3}
	}

	var DIFFICULT_RULES = {
		1 : {
			time : 20000,
			attacks : {
				ultra : 6600,
				super : 0,
				normal : 0
			}
		},
		2 : {
			time : 60000,
			attacks : {
				ultra : 6600,
				super : 0,
				normal : 0
			}
		}
	}

	var ATTACKS = ["normal", "super", "ultra"]

	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
	var ORDER_POSITIONS = [POSITIONS.UP, POSITIONS.MID, POSITIONS.DOWN]
	var CHARACTER_CENTER_OFFSET = {x:-200, y: -200}

	var DAMAGE = DAMAGE_PERCENT[3]
	var MAX_LIFE
    var MIN_LIFE = 0
	var EMPTY_QUESTION = -1

	var COLORS = [0xFC1E79, 0x00D8FF]

	var teams
	var battleSong
	var sceneGroup
	var HUDGroup
	var yogoGroup
	var questionGroup
	var listosYaGroup
	var feedbackGroup
    var answersGroup
	var specialAttack
	var blackMask
	var layers
	var gradeQuestion

	var mainYogotorars
	var mainSpine
	var listName

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#0D014D"
		loadSounds()
		mainYogotorars = []
		gradeQuestion = -1//0

        riddles.initialize()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
		game.load.bitmapFont('skwig', settings.BASE_PATH + '/fonts/font.png', settings.BASE_PATH + '/fonts/font.fnt')
	}

	function createBackground(){

		battleField.createBackground(sceneGroup)
		blackMask = sceneGroup.blackMask
	}

	function menubuttons(){

		btngroup = game.add.group()

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

		var win = createButton(setWinteam, 0xffaa33)
		win.x = game.world.centerX - 200
		win.y = game.world.height - 100
		win.label.text = "winner"
        btngroup.add(win)

        var quest = createButton(setReadyGo, 0x00ffff)
        //var quest = createButton(getOperation, 0x00ffff)
		quest.x = game.world.centerX
		quest.y = game.world.height - 100
		quest.label.text = "questions"
		btngroup.add(quest)
        
        var returnBtn = createButton(initGame, 0xff0033)
		returnBtn.x = game.world.centerX
		returnBtn.y = game.world.height - 200
		returnBtn.label.text = "initGame"
		btngroup.add(returnBtn)
        
        var returnBtn = createButton(shakeCamera, 0xff0033)
		returnBtn.x = game.world.centerX
		returnBtn.y = game.world.height - 250
		returnBtn.label.text = "shake"
		btngroup.add(returnBtn)
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

    function createHUD(){

        listName = loadNames()

        HUDGroup = HUD.createHUD(ORDER_SIDES, listName)
        sceneGroup.add(HUDGroup)
        MAX_LIFE = HUDGroup.getLifeBar(0).width
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

        questionGroup = questionHUD.createQuestionOverlay()
        questionGroup.callback = function (event) {
			questionGroup.hide()
            //questionGroup.timer.stop()
        	game.time.events.add(2000, checkAnswer)
		}
        questionGroup.stopTimer = function(){
			questionGroup.timer.destroy()
            questionGroup.hide()
            setNoAnswer()
            console.log("time out")
        }
		sceneGroup.add(questionGroup)
    }

    function createFeedback(){

		feedbackGroup = resultsFeedback.createFeedback()
		feedbackGroup.score.loserCallback = function(){
			swapYogotars(layers[1])
		}
		feedbackGroup.winCallback = function(index, attack){
			HUDGroup.setScore(index)
            attack == "ultra" ? ultraMove(index) : attackMove(attack, index)
		}
		feedbackGroup.score.tieCallback = function(){
			setNoAnswer()
		}
        sceneGroup.add(feedbackGroup)
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
			obj.scale.x = obj.prevScale * side.scale.x
			obj.updateImpactPoint()

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

            if(teamIndex == 0){
                if(character.x > characterPos.x) { //check facing direction
                    character.scale.x *= -1
                    toScaleX *= -1
                }
            }
            else{
                if(character.x < characterPos.x) { //check facing direction
                    character.scale.x *= -1
                    toScaleX *= -1
                }
            }

			character.index = newPlayerIndex
            //character.scale.setTo(toScaleX, newPosition.scale.y)
			game.add.tween(character.scale).to({x:toScaleX * side.scale.x, y:newPosition.scale.y}, 490, null, true)
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

		HUDGroup.rotateTokens(teamIndex)
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
			name: character.name,
			file: settings.BASE_PATH + "/data/characters/" + character.name + ".json",
			scales: ["@0.5x"],
			skin: character.skin,
			teamNum:teamIndex
		}
		bootFiles.characters.push(charObj)
	}

	function pushSpecialArt(character){

		var charObj = {
			name: character + "Special",
			file: settings.BASE_PATH + "/images/battle/" + character + "Special.png",
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
				character.updateImpactPoint()
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
                
                var shadow = game.add.graphics()
                shadow.beginFill(0x000000)
                shadow.drawEllipse(0, 0, 110, 30)
                shadow.endFill()
                shadow.alpha = 0.3
                character.addAt(shadow, 0)

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

		game.time.events.add(8000, initGame)
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

		var life = HUDGroup.getLifeBar(team)
		var damage = life.width - (MAX_LIFE * percent * ORDER_SIDES[team].scale.x)
		var limit = team == 1 ? damage >= -0.1 : damage <= 0.1
		if(limit) damage = MIN_LIFE
		var index = team == 0 ? 1 : 0
        var delay = 3500
        
        if(percent == DAMAGE.ultra){
            shakeCamera()
            delay = 5000
        }

		game.add.tween(life).to({width:damage}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
            
            if(damage == MIN_LIFE){
                game.time.events.add(2000, setWinteam, null, index, team)
            }
            else{
                for(var i = 0; i < 2; i++){
                    game.time.events.add(delay * 0.5, rotateTeam, null, i)
                }
                game.time.events.add(delay, setReadyGo)
            }
		})
	}

	function attackMove(type, index){

		var yogotar = mainYogotorars[index]
		var otherTeam = index == 0 ? 1 : 0
		var xPos = 0.4 * ORDER_SIDES[index].direction
        var delay = 1000
        var zoom = 1.15
        var target = type === "ultra" ? teams[otherTeam].groupPoint : mainYogotorars[otherTeam]

		if(type == "normal"){
			var damage = DAMAGE.normal
			zoomCamera(zoom, delay, {x: game.world.centerX * xPos, y:100})
		}
		else if(type == "super"){
			var damage = DAMAGE.super
			zoomCamera(zoom, delay, {x: game.world.centerX * xPos, y:100})
		}
		else{
			var damage = DAMAGE.ultra
		}

        game.time.events.add(delay, function(){
            yogotar.attack(target, type, dealDamage.bind(null, otherTeam, damage))
        })
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

		var scaleTween = game.add.tween(game.camera.scale).to({x:zoom, y:zoom}, delay, Phaser.Easing.Cubic.InOut, true)
		scaleTween.yoyo(true, delay * 0.5)
        game.add.tween(game.camera).to({x:pos.x, y:pos.y}, delay, Phaser.Easing.Cubic.InOut, true).yoyo(true, delay * 0.5)
		game.add.tween(blackMask).to({alpha:0.4}, 500, Phaser.Easing.Cubic.InOut, true).yoyo(true, delay * 0.5)

		var toScale1 = 1/zoom
		var actualScale = HUDGroup.scale.x

		scaleTween.onUpdateCallback(function () {
			if(toScale1 < actualScale) {
				HUDGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				HUDGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

			}else{
				HUDGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				HUDGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			}
		})
	}
    
    function shakeCamera(){
        
        game.camera.shake(0.01, 900)
    }

	function setWinteam(win, lose){

         teams[lose].forEach(function(member){
            member.setAnimation(["gg"], true)
        })
        teams[win].forEach(function(member){
            member.setAnimation(["win"], true)
        })
		
		var score = HUDGroup.getScore(win)
		
		battleMain.initWinerTeam(win)
		reward.setWinner(win, score)
		game.add.tween(white).to({alpha:1}, 300, Phaser.Easing.Cubic.In, true, 4000).onComplete.add(function(){
			battleSong.stop()
			sceneloader.show("reward")
		})
	}

	function createWhite(){

		white = game.add.graphics()
		white.beginFill(0xffffff)
		white.drawRect(0, 0, game.world.width, game.world.height)
		white.endFill()
		white.alpha = 0
        sceneGroup.add(white)
	}

	function showFeedback(event){
		questionGroup.hide()
		game.time.events.add(2000, function () {
			checkAnswer(event)
		})
	}

	function checkAnswer(event){
        
		event = event || {}
		var answers = event.answers || {}
        
		var t1 = answers.t1 || {}
		var t2 = answers.t2 ||{}
		var players = [t1, t2]
        
		swapYogotars(feedbackGroup)
		
		for(var i = 0; i < players.length; i++){
			var anim = players[i].value == event.correctAnswer ? "answer_good" : "answer_bad"
			var yogo = mainYogotorars[i]
			game.time.events.add(1000, changeAnim, null, yogo, anim)
		}

		feedbackGroup.displayResults(event, questionGroup.riddle)
	}
    
    function swapYogotars(newParent){
       
        for(var i = 0; i < mainYogotorars.length; i++){
            
            var yogo = mainYogotorars[i]
			yogo.parent.remove(yogo)
			newParent.add(yogo)
            //newParent.length > 0 ? newParent.addAt(yogo, 1) : newParent.add(yogo)
        }
	}

	function selectAttackType(time){

		//var riddleTime = curentRiddle.index !== 4 ? DIFFICULT_RULES[1].time : DIFFICULT_RULES[2].time

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

    function setReadyGo(){

		var first = game.add.tween(listosYaGroup.listos).to({y: game.world.centerY}, 200, Phaser.Easing.Cubic.Out, true)
		sound.play("listos")
        first.yoyo(true, 700)

		var second = game.add.tween(listosYaGroup.ya.scale).to({x: 1,y: 1}, 400, Phaser.Easing.Elastic.Out, false)
		second.onStart.add(function(){
			sound.play("ya")
		})
        var secondOut = game.add.tween(listosYaGroup.ya.scale).to({x: 0,y: 0}, 300, Phaser.Easing.Cubic.InOut, false, 500)
        secondOut.onComplete.add(function(){
			// questionGroup.showQuestion(server.generateQuestion())
			// var riddle = riddles.getQuestion(gradeQuestion)
			// questionGroup.showQuestion(riddle)
			server.sendQuestion()
		})

        first.chain(second)
        second.chain(secondOut)
    }
    
    function initGame(){
        
        for(var i = 0; i < teams.length; i++){
            var team = teams[i]
            for(var k = 0; k < team.length; k++){
                var yogo = team[k]
                changeAnim(yogo, "idle_normal")
            }
        }
        game.time.events.add(1000, setReadyGo)
    }
    
    function changeAnim(yogo, anim){
        yogo.setAnimation([anim], true)
    }
    
    function setNoAnswer(){
        
        for(var i = 0; i < teams.length; i++){
            var team = teams[i]
            for(var k = 0; k < team.length; k++){
                var yogo = team[k]
                changeAnim(yogo, "answer_bad")
            }
        }
        for(var i = 0; i < 2; i++){
            game.time.events.add(2000, rotateTeam, null, i)
        }
        game.time.events.add(4000, setReadyGo)
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
			createHUD()
			createSpecialAttack()
			createFeedback()
			createQuestionOverlay()
			createListosYa()
			//createMenuAnimations()
			//menubuttons()
			battleSong = sound.play("battleSong", {loop:true, volume:0.4})
			createWhite()

			// var damageBtn = createButton(attackMove.bind(null, "ultra", 0), 0xff0033)
			// damageBtn.x = game.world.centerX
			// damageBtn.y = game.world.height - 250
			// damageBtn.label.text = "damage"
			// sceneGroup.add(damageBtn)

			if(server){
				server.removeEventListener('afterGenerateQuestion', questionGroup.showQuestion);
				server.removeEventListener('onTurnEnds', showFeedback);
				server.addEventListener('afterGenerateQuestion', questionGroup.showQuestion);
				server.addEventListener('onTurnEnds', showFeedback);
			}

			game.add.tween(sceneGroup).from({alpha:0},500, Phaser.Easing.Cubic.Out,true)

			game.onPause.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = false
			})
			game.onResume.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = true
			})
		},
		setCharacter:setCharacter,
		setTeams: function (myTeams) {
			teams = myTeams
			for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
				var team = myTeams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character, teamIndex)
					var img = team[charIndex].name.substr(7)
					console.log(img)
					pushSpecialArt(img)
				}
			}
		},
		shutdown:function () {
			sceneGroup.destroy()
		}
	}
}()