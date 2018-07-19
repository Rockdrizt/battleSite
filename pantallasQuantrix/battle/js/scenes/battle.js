
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
    
    var DAMAGE = DAMAGE_PERCENT[1]
    var MAX_LIFE
    
    var teams
    var battleSong
	var sceneGroup
    var teamsBarGroup
    var yogoGroup
    var miniYogos = []
    var lifeBars = []
    
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
        
        var rotateButton = createButton(rotateTeam.bind(null, 0), 0x00ff00)
		rotateButton.x = game.world.centerX
		rotateButton.y = game.world.height - 150
		rotateButton.label.text = "rotate"
        
        var damageButom = createButton(dealDamage.bind(null, 0), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 550
		damageButom.label.text = "normal"
        
        var damageButom = createButton(dealDamage.bind(null, 0), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 350
		damageButom.label.text = "super"
        
        var damageButom = createButton(dealDamage.bind(null, 0), 0xff00ff)
		damageButom.x = game.world.centerX - 200
		damageButom.y = game.world.height - 150
		damageButom.label.text = "ultra"
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
        
    }
    
    function createTeamBars(){
    
        var fontStyle = {font: "65px skwig", fontWeight: "bold", fill: "#FFFFFE", align: "center"}
        
        teamsBarGroup = game.add.group()
        sceneGroup.add(teamsBarGroup)
        
        var tokenGroup = game.add.group()
        
        var listName = loadNames()
        
        var pivotX = 0.25
        var index = 0
        
        for(var i = 0; i < 2; i++){
            
            var side = ORDER_SIDES[i].scale.x
            
            var lifeBox = teamsBarGroup.create(game.world.centerX * pivotX, 150, "atlas.battle", "lifeContainer" + i)
            lifeBox.anchor.setTo(i, 0.5)
            
            var text = game.add.bitmapText(lifeBox.centerX, lifeBox.y - 100, 'skwig', "Equipo Alpha", 75)
            text.anchor.setTo(0.5)
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
                var character = teams[i][j].substr(7).toLowerCase()
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
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#444444", align: "center"}
        
        var timeToken = sceneGroup.create(game.world.centerX, 150, "atlas.battle", "timeToken")
        timeToken.anchor.setTo(0.5)
        
        var text = new Phaser.Text(sceneGroup.game, 0, -5, "3:00", fontStyle)
        text.anchor.setTo(0.5)
        timeToken.addChild(text)
        timeToken.text = text
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
    
    function placeYogotars() {
        
        yogoGroup = game.add.group()
        yogoGroup.x = game.world.centerX
        yogoGroup.y = game.world.centerY
        sceneGroup.add(yogoGroup)

		for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
			var teamCharacters = teams[teamIndex]
			var side = ORDER_SIDES[teamIndex]

			for(var charIndex = 0; charIndex < teamCharacters.length; charIndex++){
				var characterName = teamCharacters[charIndex]
				var position = ORDER_POSITIONS[charIndex]
				var xOffset = CHARACTER_CENTER_OFFSET.x * side.scale.x + position.x * side.scale.x

				var characterPos = {
					x : game.world.centerX * 0.5 * side.direction + xOffset,
					y : CHARACTER_CENTER_OFFSET.y + game.world.centerY + position.y
				}
				var character = characterBattle.createCharacter(characterName, characterPos)
				console.log("postion", character.position)
				character.scale.setTo(position.scale.x * side.scale.x, position.scale.y)
				character.teamIndex = teamIndex
				yogoGroup.add(character)

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
			teamCharacters.groupPoint = groupPoint

			yogoGroup.add(groupPoint)
		}
        //createMenuAnimations()
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

		for(var attackIndex = 0; attackIndex < ATTACKS.length; attackIndex++){
			var buttonAttack = createButton(attack, 0xff0000)
			buttonAttack.tag = ATTACKS[attackIndex]
			buttonAttack.x = attackIndex * 200
			buttonAttack.y = (pivotY + 1) * 50
			buttonAttack.label.text = ATTACKS[attackIndex]
		}

		var rotateButton = createButton(rotateTeam.bind(null, 0), 0xffff00)
		rotateButton.x = attackIndex * 200
		rotateButton.y = (pivotY + 1) * 50
		rotateButton.label.text = "rotate"
	}
    
    function changeAnimation(name) {
		mainSpine.setAnimation([name], true)
	}
    
    function dealDamage(team){
        
        var life = lifeBars[team]
        var damage = life.width - MAX_LIFE * DAMAGE.normal
        
        game.add.tween(life).to({width:damage}, 150, Phaser.Easing.linear, true)
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
            createTeamBars()
            createTimer()
            placeYogotars()
            //battleSong = sound.play("battleSong", {loop:true, volume:0.6})    
            
		},
        setCharacter:setCharacter,
        setTeams: function (myTeams) {
			teams = myTeams
			for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
				var team = myTeams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character, teamIndex)
				}
			}
		}
	}
}()