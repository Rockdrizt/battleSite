
var soundsPath = "../../shared/minigames/sounds/"
var battle = function(){
	var server = parent.server || null

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"question":"Question ",
			"winner":"WINNER",
			"victory":"VICTORY",
			"newCard":"New Card",
			"perfect":"PERFECT",
			"good":"GOOD",
			"weak":"WEAK",
			"dontgiveup":"DON'T GIVE UP"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?",
			"question":"Pregunta ",
			"winner":"GANADOR",
			"victory":"VICTORIA",
			"newCard":"Nueva Carta",
			"perfect":"PERFECTO",
			"good":"BIEN",
			"weak":"DEBIL",
			"dontgiveup":"NO TE RINDAS"
        }
    }


    var assets = {
        atlases: [
            {
                name: "atlas.battle",
                json: "images/battle/atlas.json",
                image: "images/battle/atlas.png"
            },
			{
				name: "atlas.cards",
				json: "images/cards/atlas.json",
				image: "images/cards/atlas.png"
			}
        ],
        images: [
			{
				name: "container",
				file: "images/battle/container.png"},
			{   name:"fondo",
				file: "images/battle/fondo1.jpg"}
        ],
        sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
            {	name: "magic",
                file: soundsPath + "magic.mp3"},
            {	name: "throw",
                file: soundsPath + "throw.mp3"},
            {	name: "cut",
                file: soundsPath + "cut.mp3"},
            {	name: "flip",
                file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {	name: "right",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "hit",
                file: soundsPath + "towercollapse.mp3"},
            {   name: "whoosh",
                file: soundsPath + "whoosh.mp3"},
            {   name: "uuh",
                file: soundsPath + "uuh.mp3"},
            {   name: "fart",
                file: soundsPath + "splash.mp3"},
            {   name: "explosion",
                file: soundsPath + "fireExplosion.mp3"},
            {   name: "winBattle",
                file: soundsPath + "winBattle1.mp3"},
            {   name: "swordSmash",
                file: soundsPath + "swordSmash.mp3"},
			{   name: "comboSound",
                file: soundsPath + "mathTournament/comboSound.mp3"},
			{   name: "fireCharge",
                file: soundsPath + "mathTournament/fireCharge2.mp3"},
			{   name: "fireExplosion",
				file: soundsPath + "mathTournament/fireExplosion2.mp3"},
			{   name: "fireProjectile",
				file: soundsPath + "mathTournament/fireProjectile1.mp3"},
			{   name: "fireReveal",
				file: soundsPath + "mathTournament/fireReveal1.mp3"},
			{	name:"epicTapTouchGames",
				file:"sounds/battle/TapWhoosh.mp3"},
			{	name:"epicAttackButton",
				file:"sounds/battle/buttonTick.mp3"},
			{	name:"loseBattle",
				file:"sounds/battle/loseBattle1.mp3"},
			{	name:"starsCollision",
				file:"sounds/battle/starsCollision1.mp3"},
			{	name:"barLoad",
				file:"sounds/battle/barLoad1.mp3"},
			{	name:"levelBar",
				file:"sounds/battle/levelBar1.wav"},
			{	name:"levelUp",
				file:"sounds/battle/levelUp2.mp3"}
        ],
		spines: [
			// {
			// 	name:"yogotarEagle",
			// 	file:"images/spines/Eagle/eagle.json"
			// },
			// {
			// 	name:"yogotarEagle",
			// 	file:"images/spines/Eagle/eagle.json"
			// }
		],
		jsons: [
			{
				name:"sounds",
				file:"data/sounds/general.json"
			}
		]
    }

    var COLORS = {maxEnery:0x08ff03, midEnergy:0xcccd05, lowEnergy:0xff180a, tiltRed:0x7a2c14}

    var NUM_LIFES = 3
    var NUM_OPTIONS = 3
    var MAX_HP = 100
	var WIDTH_DISTANCE = 110
	var HP_BAR_WIDTH = 335 //195
	var DATA_CHAR_PATH = "data/characters/"
	var ELEMENT_MULTIPLIERS = {
		"fire": {
			"water": 0.5,
			"earth": 2,
		},
		"water": {
			"fire": 2,
			"wind": 0.5,
		},
		"wind": {
			"water": 2,
			"earth": 0.5,
		},
		"earth": {
			"fire": 0.5,
			"wind": 2,
		}
	}
	var ATTACK = {
		"attack":{
			"base":10,
			"bonus":15
		},
		"special":{
			"base":15,
			"bonus":20
		}
	}

	var XP_TABLE = {
		HITS : {
			NORMAL : {
				PERFECT : 5,
				GOOD : 4,
				WEAK : 3,
			},
			SPECIAL : {
				PERFECT : 6,
				GOOD : 5,
				WEAK : 4,
			},
		},
		KILL : 10,
		DEATH : 2,
	}

	var POWER_LEVELS = {
		LOW:{
			color:0xFF0000,
			width:60
		},
		MED:{
			color:0xFFEB00,
			width:120
		},
		HIGH:{
			color:0x00F500,
			width:176
		}
	}

	var ELEMENTS = ["fire", "water", "wind", "earth"]

	var NUM_BACKGROUNDS = 3

    var lives
    var sceneGroup = null
    // var gameIndex = 58
    var tutoGroup
    var battleSong
    var pullGroup = null
    var timeValue
    var inputsEnabled
    var monsterCounter
    var players
    var killedMonsters
	var alphaMask
	var roundGroup, go
	var hudGroup
	var frontGroup
	var tapGroup
	var soundsList
	var sumXp
	var elements
	var charactersCards
	var currentPlayer
	var model
    var tutorial,mano;
	var questionCounter
	var timeElapsed
	var battleTime
	var startTimer
	var timerGroup
	var equationGroup
	var timerEnded
	var onBattle
	var tweenReady1
	var timesUp
	var lastRound

    function loadSounds(){

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
    }

    function getSoundsSpine(spine) {
		var events = spine.skeletonData.events
		// console.log(events, spine)
		var soundsAdded = {}

		for(var index = 0; index < events.length; index++){
			var event = events[index]
			var functionData = getFunctionData(event.name)

			if((functionData)&&(functionData.name === "PLAY")){
				var soundObj = {
					name:functionData.param,
					file:soundsList[functionData.param]
				}
				if(!soundsAdded[soundObj.name]){
					assets.sounds.push(soundObj)
					game.load.audio(soundObj.name, soundObj.file);
					soundsAdded[soundObj.name] = soundObj.name
				}
			}
		}
	}

    function initialize(){
        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 60
        monsterCounter = 0
        killedMonsters = 0
		sumXp = 0
		questionCounter = 1
		timeElapsed = 0
		startTimer = false
		onBattle = false
		timerEnded = false
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);
        inputsEnabled = false
		elements = {}
		model = parent.epicModel || epicModel
		currentPlayer = model.getPlayer()

		if(server){
			server.removeEventListener('afterGenerateQuestion', generateQuestion);
			server.removeEventListener('onTurnEnds', checkAnswer);
			server.addEventListener('afterGenerateQuestion', generateQuestion);
			server.addEventListener('onTurnEnds', checkAnswer);
		}

        loadSounds()

    }

    function tweenTint(obj, startColor, endColor, time, delay, callback, loop) {
        // check if is valid object
        time = time || 250
        delay = delay || 0

        if (obj) {
            // create a step object
            var colorBlend = { step: 0 };
            // create a tween to increment that step from 0 to 100.
            var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
            // add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
            colorTween.onUpdateCallback(function () {
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this);
            }
            // finally, start the tween

			if(loop){
            	colorTween.yoyo(true).loop(true)
			}

            colorTween.start();
        }
    }

	function winPlayer(player) {
		hudGroup.winGroup.playerName.text = player.name
		game.add.tween(hudGroup.uiGroup).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
		game.add.tween(hudGroup.winGroup).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
		game.add.tween(alphaMask).to({alpha:0.7}, 800, Phaser.Easing.Cubic.Out, true)
		createConfeti()
		inputsEnabled = true

		player.setAnimation(["win", "winstill"], true)
		battleSong.stop()
		sound.play("winBattle")

		var toCamaraX = player.x < game.world.centerX ? 0 : game.world.width
		zoomCamera(1.6, 2000)
		// var scaleData = zoomCamera.generateData(60)

		game.add.tween(game.camera).to({x:toCamaraX, y:player.y - 250}, 2000, Phaser.Easing.Cubic.Out, true)
		// game.time.events.add(6000, stopGame)
		if(server){
			server.setGameEnded(player.numPlayer)
		}
	}

    function receiveAttack(target, from) {
		// target.hpBar.removeHealth(20)
		sound.play(from.projectileData.impact.soundID)

		target.statusAnimation = target.hpBar.health <= 40 ? "tired" : "idle"
		target.setAnimation(["hit", target.statusAnimation], true)
		// console.log(target.spine.state)
		target.add(from.hit)
		from.hit.start(true, 1000, null, 5)
    }

    function returnCamera() {
		game.camera.follow(null)
    	game.add.tween(game.camera).to({x:0, y:0}, 1000, Phaser.Easing.Cubic.Out, true)
		zoomCamera(1, 1000)
		// game.add.tween(player1.hpBar.scale).to({x:0.8, y:0.8}, 2000, Phaser.Easing.Cubic.Out, true)
		game.add.tween(alphaMask).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
	}

	function zoomCamera(zoom, delay) {
		var scaleTween = game.add.tween(game.camera.scale).to({x:zoom, y:zoom}, delay, Phaser.Easing.Cubic.Out, true)
		var toScale1 = 1/zoom
		// game.add.tween(player1.hpBar.scale).to({x:toScale1, y:toScale1}, delay, Phaser.Easing.Cubic.Out, true)
		// game.add.tween(player2.hpBar.scale).to({x:toScale2, y:toScale1}, delay, Phaser.Easing.Cubic.Out, true)
		var actualScale = hudGroup.scale.x
		scaleTween.onUpdateCallback(function () {
			if(toScale1 < actualScale) {
				hudGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				hudGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)
				frontGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				frontGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

			}else{
				hudGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				hudGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
				frontGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				frontGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			}
		})
	}
	
	function proyectileUpdate(tween, percentage) {
    	var proyectile = sceneGroup.proyectile
		// var angle = Phaser.Math.angleBetweenPoints(proyectile.worldPosition, proyectile.previousPosition)
		// proyectile.rotation = -4.71239 + angle
		// console.log(angle)
		var zoom = (2 - proyectile.scale.y) * 1.5
		game.camera.scale.x = zoom; game.camera.scale.y = zoom
		var toScale1 = 1/zoom
		var actualScale = hudGroup.scale.x
		if(toScale1 < actualScale) {
			hudGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
			hudGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)
			frontGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
			frontGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

		}else{
			hudGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
			hudGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			frontGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
			frontGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
		}

	}
	
	function getMultiplier(elementFrom, elementTarget) {
    	return ELEMENT_MULTIPLIERS[elementFrom] && ELEMENT_MULTIPLIERS[elementFrom][elementTarget] || 1
	}

	function playerAttack(fromPlayer, targetPlayer, typeAttack, asset){
		// console.log(fromPlayer.multiplier)
    	game.add.tween(fromPlayer.hpBar).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
		game.add.tween(targetPlayer.hpBar).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
		game.add.tween(timerGroup).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)

    	fromPlayer.setAnimation(["charge"], false)
		fromPlayer.spine.speed = 0.5
		fromPlayer.proyectile.startPower.alpha = 1
		fromPlayer.proyectile.startPower.animations.play('start', fromPlayer.proyectile.startPower.fps, false)
		game.camera.follow(fromPlayer.proyectile.followObj)
		fromPlayer.proyectile.followObj.x = -110 * fromPlayer.scale.x
		fromPlayer.proyectile.followObj.y = -160 * fromPlayer.scale.x
		// game.add.tween(fromPlayer.proyectile.followObj).to({x:0}, 2000, Phaser.Easing.Cubic.In, true)

		var fromScale = 1//fromPlayer.numPlayer === 1 ? 1 : 0.6
		// console.log("fromScale", fromScale)
		zoomCamera((2 - fromScale) * 1.5, 4000)
		game.add.tween(alphaMask).to({alpha:0.7}, 1000, Phaser.Easing.Cubic.Out, true)
		var toAngle
		if(fromPlayer.scaleReference > 0)
			toAngle = Phaser.Math.angleBetweenPoints(new Phaser.Point(fromPlayer.proyectile.centerX, fromPlayer.proyectile.centerY), new Phaser.Point(targetPlayer.hitDestination.x, targetPlayer.hitDestination.y - 150))
		else
			toAngle = Phaser.Math.angleBetweenPoints(new Phaser.Point(targetPlayer.hitDestination.x, 150), new Phaser.Point(fromPlayer.proyectile.centerX, fromPlayer.proyectile.centerY))
		// console.log(toAngle)
		toAngle = -1.5708 * fromPlayer.scaleReference + toAngle
		// console.log(toAngle)
		fromPlayer.proyectile.scale.x = fromScale; fromPlayer.proyectile.scale.y = fromScale
		game.add.tween(fromPlayer.proyectile.startPower).to({rotation:toAngle}, 2000, Phaser.Easing.Cubic.Out, true, 1000)
		game.add.tween(fromPlayer.proyectile.idlePower).to({rotation:toAngle}, 2000, Phaser.Easing.Cubic.Out, true, 1000)
        
		var attackCallBack = function (percentage) {
			fromPlayer.stats.hideBan()

			percentage = percentage || 0
			fromPlayer.spine.speed = 1
			var targetX = targetPlayer.x < game.world.centerX ? 0 : game.world.width
			fromPlayer.setAnimation(["attack", "idle"], true)
            
			// game.add.tween(game.camera.scale).to({x:1.7, y:1.7}, 300, Phaser.Easing.Cubic.Out, true)
			// moveCamera.onComplete.add(returnCamera)

			var proyectile = fromPlayer.proyectile
			sceneGroup.bringToTop(proyectile)
			// game.camera.follow(proyectile, null, 0.1, 0.1)
			game.camera.x = 0
			game.camera.y = 0
			// var proyectile = sceneGroup.create(0, 0, 'atlas.battle', asset)
			// proyectile.x = fromPlayer.from.x
			// proyectile.y = fromPlayer.from.y
			// proyectile.scale.x = fromPlayer.scaleShoot.from.x
			// proyectile.scale.y = fromPlayer.scaleShoot.from.y
			// proyectile.anchor.setTo(0.5, 0.5)
			// proyectile.tint = fromPlayer.proyectile
			sceneGroup.proyectile = proyectile
			// proyectile.originalRotation = Phaser.Math.angleBetweenPoints(proyectile.previousPosition, proyectile.world)
			game.time.events.add(500, function () {
				typeAttack(proyectile, fromPlayer, targetPlayer, percentage)
			})
		}

		game.time.events.add(2000, attackCallBack, null, 1)
	}

    function defeatPlayer(player) {
		// player.setAnimation(["HIT", player.statusAnimation])
		// game.add.tween(player.hpBar).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)

        game.time.events.add(400, function () {
			player.setAnimation(["lose", "losestill"], true)
			// var dissapear = game.add.tween(player).to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true)
			// dissapear.onComplete.add(stopGame)
			// stopGame()
		})
    }

	function blowAttack(proyectile, from, target){
		sound.play("swordSmash")

		// var toScale = target.scaleShoot
		game.add.tween(proyectile.scale).to({x: toScale.to.x, y: toScale.to.y}, 1200, null, true)

		var toHit = target.hitDestination
		game.add.tween(proyectile).to({x: toHit.x, y: toHit.y}, 1200, null, true).onComplete.add(function () {
			game.add.tween(proyectile).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
				proyectile.alpha = 0
				proyectile.x = from.from.x
				proyectile.y = from.from.y
			})
			receiveAttack(target, from)
		})

	}
	
	function createCaptured() {
		var captureGroup = game.add.group()
		captureGroup.x = game.world.centerX
		captureGroup.y = game.world.centerY + 80
		hudGroup.captureGroup = captureGroup
		hudGroup.add(captureGroup)

		var container = captureGroup.create(0,0,"container")
		container.anchor.setTo(0.5, 0.5)

		//TODO: change to compatible multiple cards
		var card = charactersEntity.getCard(players[1].card)
		// card.scale.setTo(0.8, 0.8)
		captureGroup.add(card)

		var fontStyle = {font: "78px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var capturedText = game.add.text(0, -200, localization.getString(localizationData, "newCard"), fontStyle)
		capturedText.stroke = '#2a2a2a';
		capturedText.strokeThickness = 12;
		capturedText.anchor.setTo(0.5, 0.5)
		capturedText.setShadow(6, 6, 'rgba(0,0,0,0.5)', 0);
		captureGroup.add(capturedText)

		captureGroup.alpha = 0
	}
	
	function showCaptured() {
		var captureGroup = hudGroup.captureGroup
		var captureTween = game.add.tween(captureGroup).to({alpha:1}, 800, Phaser.Easing.Quintic.In, true)
		game.add.tween(captureGroup.scale).from({x:1.5, y:1.5}, 800, Phaser.Easing.Quintic.In, true)
		captureTween.onComplete.add(function () {
			sound.play("comboSound")
			game.time.events.add(500, showExit)
		})
		var battleIndex = parent.env ? (parent.env.battleIndex || 0) : 0
		var cardOwned = currentPlayer.battles[battleIndex][0].captured
		currentPlayer.cards.push(players[1].card)
	}

    function createProyectile(proyectile, from, target, percentage){

		var toScale = 1//target.numPlayer === 1 ? 1 : 0.6

		var toHit = target.hitDestination
		game.add.tween(proyectile.followObj).to({y:0}, 1600, null, true)
		var moveProyectile = game.add.tween(proyectile).to({x: toHit.x}, 1600, null, true)
		// moveProyectile.onUpdateCallback(proyectileUpdate)
        game.add.tween(proyectile.scale).to({x: toScale, y: toScale}, 1600, null, true)

        var first = game.add.tween(proyectile).to({y: from.y - 350}, 800, Phaser.Easing.Cubic.Out, true)
        first.onComplete.add(function () {
            game.add.tween(proyectile).to({y: toHit.y}, 800, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(proyectile.idlePower).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    // proyectile.destroy()
					returnCamera()
					proyectile.startPower.alpha = 0
					proyectile.idlePower.alpha = 0
					proyectile.x = from.from.x
					proyectile.y = from.from.y
					sceneGroup.proyectile = null
					proyectile.startPower.rotation = 0
					proyectile.idlePower.rotation = 0
					game.add.tween(players[0].hpBar).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
					game.add.tween(players[1].hpBar).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
					game.add.tween(timerGroup).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)

					// if(from.numPlayer === 1){
					// 	var index = percentage < 0.5 ? "WEAK" : percentage < 0.8 ? "GOOD" : "PERFECT"
					// 	sumXp += XP_TABLE.HITS.NORMAL[index]
					// }

					game.time.events.add(500, function () {
						var combinedDamage = 20//10 + (15 * percentage)
						// combinedDamage = Math.floor(combinedDamage * from.multiplier) * from.level
						target.hpBar.updateHealth(-combinedDamage)
						addNumberPart(target, -combinedDamage, "#FF0000", -100)

						if(target.hpBar.health > 0)
							game.time.events.add(1000, showReadyGo)
						else{
							defeatPlayer(target)
							game.time.events.add(3000, winPlayer, null, from)
						}
					})

                })
                receiveAttack(target, from)
            })
        })

    }

	function createHpbar(scale){
		scale = scale || 1
		var anchorX = scale < 1 ? 1 : 0
		//anchorX = 0.5
		var hpGroup = game.add.group()
		hpGroup.scale.setTo(0.8 * scale, 0.8)
		hpGroup.health = MAX_HP

		// var rectBg = game.add.graphics()
		// rectBg.beginFill(0x000000)
		// rectBg.alpha = 0.4
		// rectBg.drawRect(0,0, 390, 50)
		// rectBg.endFill()
		// rectBg.x = -195
		// rectBg.y = -25 - 5
		// hpGroup.add(rectBg)

		var container = hpGroup.create(0, -34, 'atlas.battle', 'container_health')
		container.anchor.setTo(0.5, 0.5)

		var hpBg = hpGroup.create(-HP_BAR_WIDTH * 0.4, -19, 'atlas.battle', 'lifebar_gradient')
		hpBg.anchor.setTo(0, 0.5)
		hpBg.scale.setTo(0.9, 0.9)
		hpBg.width = HP_BAR_WIDTH

		var hpBarMask = game.add.graphics()
		hpBarMask.beginFill(0xffffff)
		hpBarMask.drawRoundedRect(0,0, HP_BAR_WIDTH, 30)
		hpBarMask.endFill()
		hpGroup.add(hpBarMask)
		hpBarMask.y = -34
		hpBarMask.x = -HP_BAR_WIDTH * 0.5
		hpBg.mask = hpBarMask

		var heartBg = game.add.graphics()
		heartBg.beginFill(0xffffff)
		heartBg.drawRoundedRect(0,0, 80, 70, 27)
		heartBg.endFill()
		hpGroup.add(heartBg)
		heartBg.x = -210
		heartBg.y = -55
		heartBg.color = COLORS.maxEnery
		heartBg.tint = heartBg.color

		var heart = hpGroup.create(-170, -20, 'atlas.battle', 'heart')
		heart.anchor.setTo(0.5, 0.5)

		// container.scale.setTo(0.8, 0.8)

		var fontStyle = {font: "30px Luckiest Guy", fontWeight: "bold", fill: "#871b87", align: "center"}
		var healthText = new Phaser.Text(game, 0, 5, "100/100", fontStyle)
		healthText.x = -66
		healthText.y = -58
		healthText.anchor.setTo(0.5,0.5)
		healthText.scale.x = scale
		hpGroup.add(healthText)
		hpGroup.healthText = healthText

		hpGroup.updateHealth = function (number) {
			this.health = Phaser.Math.clamp(this.health + number, 0, MAX_HP)
			var newWidth = this.health * HP_BAR_WIDTH / MAX_HP
			var newWidth = newWidth <= 0 ? 1 : newWidth
			// console.log(this.health, newWidth)
			game.add.tween(hpBarMask).to({width:newWidth}, 1000, Phaser.Easing.Cubic.Out, true)

			this.healthText.text = this.health + "/" + MAX_HP

			if((this.health < MAX_HP * 0.7)&&(this.health > MAX_HP * 0.3)&&(heartBg.color !== COLORS.midEnergy)) {
				heartBg.color = COLORS.midEnergy
				tweenTint(heartBg, COLORS.maxEnery, COLORS.midEnergy, 1000)
			}
			else if((this.health <= MAX_HP * 0.3)&&(heartBg.color !== COLORS.lowEnergy)){
				heartBg.color = COLORS.lowEnergy
				tweenTint(heartBg, COLORS.midEnergy, COLORS.lowEnergy, 1000, 0, function () {
					tweenTint(heartBg, COLORS.lowEnergy, COLORS.tiltRed, 1000, 0, null, true)
				})
			}

			// game.add.tween(this.healthText.scale).to({x:1.2 * scale, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		}

		hpGroup.resetHealth = function () {
			this.health = MAX_HP
		}

		var containerName = hpGroup.create(50, 30, 'atlas.battle', 'container_name')
		containerName.anchor.setTo(0.5, 0.5)

		var fontStyle2 = {font: "28px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", boundsAlignH: "left"}
		var name = new Phaser.Text(game, 0, 5, "", fontStyle2)
		name.stroke = '#2a2a2a';
		name.strokeThickness = 6;
		//name.x = HP_BAR_WIDTH*0.1
		//name.y = -45
		name.x = -95
		name.y = -18
		name.anchor.setTo(anchorX,0.5)
		name.scale.x = scale
		hpGroup.add(name)
		hpGroup.name = name
		name.setTextBounds(0, 0, 150, 0);

		var fontStyle3 = {font: "36px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", boundsAlignH: "left"}
		var wins = new Phaser.Text(game, 50, 27, "Wins: 0", fontStyle3)
		hpGroup.add(wins)
		wins.scale.x = scale
		wins.setTextBounds(0, 0, 150, 0);
		wins.anchor.setTo(0.5,0.5)
		hpGroup.winCounter = 0

		hpGroup.addWin = function () {
			this.winCounter++
			wins.text = "Wins: " + this.winCounter

		}

		return hpGroup
	}

    function createPlayer(spine, position, scale, playerScale) {

		playerScale = playerScale || 1
		var player = spine
		var spineScale = player.data.spine.options.scale
		player.scale.setTo(playerScale * 0.8 * spineScale * scale, playerScale * 0.8 * spineScale)
		sceneGroup.add(player)
		player.statusAnimation = "idle"
		// console.log("width", player.width)
		player.x = position.x
		player.y = position.y
		player.alpha = 1
		// player.colorProyectile = MONSTERS[monsterCounter].colorProyectile
		player.scaleReference = scale

		var shadow = player.create(0, 0, 'atlas.battle', 'shadow')
		shadow.anchor.setTo(0.5, 0.5)
		shadow.scale.setTo(1.2, 1.2)
		player.sendToBack(shadow)
		// shadow.x = player.x
		// shadow.y = player.y

		var from = {}
		from.x = player.x + 100 * playerScale * scale
		from.y = player.y - 100 * playerScale
		player.from = from

		var hitDestination = {}
		hitDestination.x = player.x
		hitDestination.y = player.y - 100 * playerScale
		player.hitDestination = hitDestination

		var scaleShoot = {from:{x: 1, y: 1}, to:{x: 1, y: 1}}
		player.scaleShoot = scaleShoot

		var hitParticle = createPart("impact" + spine.projectileName)
		hitParticle.y = -100
		sceneGroup.add(hitParticle)
		player.hit = hitParticle

		var hpBar = createHpbar(scale, player.data.stats.health)
		hpBar.x = player.x + 80 * scale
		hpBar.y = 100
		sceneGroup.add(hpBar)
		hpBar.name.text = player.nickname
		console.log(player.nickname, "nickname")
		player.hpBar = hpBar
		player.name = player.nickname

		var proyectile = game.add.group()
		proyectile.x = from.x; proyectile.y = from.y
		sceneGroup.add(proyectile)

		var followObj = game.add.graphics()
		// followObj.beginFill(0xffffff)
		followObj.drawRect(0, 0, 50, 50)
		followObj.x = -followObj.width * 0.5
		followObj.y = -followObj.height * 0.5 - 50
		proyectile.add(followObj)
		// followObj.endFill()
		proyectile.followObj = followObj

		var idleSheet = game.add.sprite(0, 0, 'idlePower' + spine.projectileName)
		idleSheet.fps = spine.projectileData.sheet.idle.fps
		idleSheet.animations.add('idle')
		idleSheet.anchor.setTo(0.5, 0.5)
		proyectile.add(idleSheet)
		// idleSheet.x = from.x
		// idleSheet.y = from.y
		idleSheet.alpha = 0
		proyectile.idlePower = idleSheet

		var startSheet = game.add.sprite(0, 0, 'startPower' + spine.projectileName)
		startSheet.fps = spine.projectileData.sheet.start.fps
		var startAnimation = startSheet.animations.add('start')
		startSheet.anchor.setTo(0.5, 0.5)
		proyectile.add(startSheet)
		// startSheet.x = from.x
		// startSheet.y = from.y
		startSheet.alpha = 0
		proyectile.startPower = startSheet

		player.proyectile = proyectile
		player.level = charactersEntity.getLevel(player.card.xp)

		startAnimation.onComplete.add(function () {
			startSheet.alpha = 0
			idleSheet.alpha = 1
			idleSheet.animations.play('idle', idleSheet.fps, true)
		}, this);

		player.spine.setMixByName("run", "idle", 0.3)
		player.spine.setMixByName("win", "idle", 0.3)

		return player
	}
	
	function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

		players[0] = createPlayer(players[0], {x:WIDTH_DISTANCE, y: game.world.height - 150}, 1)
		players[1] = createPlayer(players[1], {x:game.world.width - 100, y: game.world.height - 150}, -1, 1)
		// players[0].multiplier = getMultiplier(players[0].data.stats.element, players[1].data.stats.element)
		// players[1].multiplier = getMultiplier(players[1].data.stats.element, players[0].data.stats.element)
		// player2.scale.setTo(playerScale * -1, playerScale)

		var input1 = game.add.graphics()
		input1.beginFill(0xffffff)
		input1.drawCircle(0,0, 200)
		input1.alpha = 0
		input1.endFill()
		players[0].add(input1)
		input1.inputEnabled = true
		input1.events.onInputDown.add(function () {
			var answer1 = {value:100, time:3450}
			var answer2 = {value:100, time:3450}
			checkAnswer({numPlayer:1, timeDifference:200, answers:{p1:answer1, p2:answer2}})
		})
		//
		var input2 = game.add.graphics()
		input2.beginFill(0xffffff)
		input2.drawCircle(0,0, 200)
		input2.alpha = 0
		input2.endFill()
		players[1].add(input2)
		input2.inputEnabled = true
		input2.events.onInputDown.add(function () {
			var answer1 = {value:100, time:3450}
			var answer2 = {value:100, time:3450}
			checkAnswer({numPlayer:2, timeDifference:200, answers:{p1:answer1, p2:answer2}})
		})

		// var cloud = createSpine("cloud", "normal", "BITE")
		// // cloud.setAnimation(["BITE"])
		// cloud.x = game.world.centerX
		// cloud.y = game.world.height - 200
		// sceneGroup.add(cloud)

    }

	function createConfeti(){
		var emitter = game.add.emitter(game.world.centerX, -32, 400);
		emitter.makeParticles('confeti', [0, 1, 2, 3, 4, 5]);
		emitter.maxParticleScale = 0.6;
		emitter.minParticleScale = 0.3;
		emitter.setYSpeed(200, 300);
		// emitter.gravity = 0;
		emitter.width = game.world.width;
		emitter.minRotation = 0;
		emitter.maxRotation = 360;

		emitter.start(false, 10000, 100, 0);
		frontGroup.add(emitter)
		// hudGroup.sendToBack(emitter)

	}

    function createPart(key, atlas){
        var particle = game.add.emitter(0, 0, 100);

        if(atlas)
        	particle.makeParticles(atlas, key);
        else
        	particle.makeParticles(key)
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.1;
        particle.maxParticleScale = 0.3;
        particle.gravity = 150;
        particle.angularDrag = 30;
		particle.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.In)

        return particle

    }

	function stopGame(tag){

		//objectsGroup.timer.pause()
		//timer.pause()
		// sound.play("uuh")
		console.log("stopGame")
		players[0].hpBar.resetHealth()
		players[1].hpBar.resetHealth()
		sound.stopAll()
		sound.play("pop")

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 200)
		tweenScene.onComplete.add(function(){
			game.camera.x = 0
			game.camera.y = 0
			game.camera.scale.x = 1
			game.camera.scale.y = 1
			if(tag === "home") {
				if (server) {
					server.removeEventListener('afterGenerateQuestion', generateQuestion);
					server.removeEventListener('onTurnEnds', checkAnswer);
					server.retry()

					// if(parent.isKinder)
					// 	window.open("indexSLP.html", "_self")
					// else
					if(parent.isMobile)
						window.open("mobile/index.html", "_self")
					else
						window.open("index.html", "_self")
				}
			}else {
				if (server)
					server.retry("inBattle")
				sceneloader.show("battle")
			}
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = true;
		game.load.audio('battleSong', soundsPath + 'songs/battleSong.mp3');
		// game.load.spine(avatar1, "images/spines/"+directory1+"/"+avatar1+".json")
		// game.load.spine(avatar2, "images/spines/"+directory2+"/"+avatar2+".json")
		// game.load.spine("tap", "images/spines/tap/tap.json")
		game.load.spritesheet('confeti', 'images/battle/confeti.png', 64, 64, 6)

		game.load.image('round',"images/battle/shout_round.png")
		game.load.image('start',"images/battle/shout_start.png")
		game.load.image('lastRound',"images/battle/last_round.png")
		game.load.image('timesUp',"images/battle/times_up.png")
		game.load.bitmapFont('WAG', 'fonts/WAG.png', 'fonts/WAG.xml');
        game.load.spritesheet("hand", 'images/spines/Tuto/manita.png', 115, 111, 23)
        
		// buttons.getImages(game)
		// console.log(parent.isKinder)
		soundsList = game.cache.getJSON('sounds')
		// console.log(assets.spines[0].name, assets.spines[0].file)
		players = []
		var projectilesList = {}
		for(var pIndex = 0; pIndex < 2; pIndex++){

			var player = createSpine(charactersCards[pIndex].id, "normal")
			player.data = epicCharacters[charactersCards[pIndex].id]
			player.card = charactersCards[pIndex]
			player.numPlayer = pIndex + 1
			var projectileName = player.data.stats.element
			player.projectileName = projectileName
			player.projectileData = projectilesData[projectileName]
			player.y = -100
			player.nickname = charactersCards[pIndex].nickname

			if(typeof projectilesList[projectileName] === "undefined"){
				var sheetData = player.projectileData.sheet
				game.load.spritesheet('startPower' + projectileName, sheetData.start.path,
					sheetData.start.frameWidth, sheetData.start.frameHeight, sheetData.start.frameMax)
				game.load.spritesheet('idlePower' + projectileName, sheetData.idle.path,
					sheetData.idle.frameWidth, sheetData.idle.frameHeight, sheetData.idle.frameMax)

				projectilesList[projectileName] = sheetData
				game.load.image('impact' + projectileName, player.projectileData.impact.particles[0])
				// console.log(player.projectileData.impact.particles[0])
				var name = player.projectileData.impact.soundID
				var file = soundsList[name]
				game.load.audio(name, file);
				assets.sounds.push({name:name, file:file})
			}

			// getSoundsSpine(player.spine)
			players.push(player)
		}
	}
	
	function checkPowerBars() {
		inputsEnabled = false
		var midY = (players[0].y + players[1].y) * 0.5

		for(var pIndex = 0; pIndex < players.length; pIndex++){
			var elementName = players[pIndex].data.stats.element

			var element = game.add.sprite(0,0,"atlas.battle",elementName)
			element.anchor.setTo(0.5, 0.5)
			element.scale.setTo(0.5, 0.5)
			element.alpha = 0
			element.index = pIndex

			hudGroup.uiGroup.add(element)
			element.x = players[pIndex].hitDestination.x; element.y = players[pIndex].hitDestination.y - 100
			game.add.tween(element).to({alpha:1},600, Phaser.Easing.Cubic.Out, true)
			var moveElement1 = game.add.tween(element).to({x:game.world.centerX - 30 * players[pIndex].scaleReference},
				600, Phaser.Easing.Sinusoidal.In, true, 400)

			var fromScale = element.scale.x + 0.2 * players[pIndex].scaleReference
			var scaleTween = game.add.tween(element.scale).from({x:fromScale, y:fromScale}, 600, null, true, 400)
			game.add.tween(element).to({y:game.world.centerY},600, Phaser.Easing.Sinusoidal.In, true, 400)
			moveElement1.onStart.add(function () {
				sound.play("cut")
			})

			var moveElement2 = game.add.tween(element).to({x:players[pIndex].hpBar.x, y:players[pIndex].hpBar.y}, 400,
				null, false, 500)
			moveElement2.onStart.add(function (obj) {
				game.add.tween(obj.scale).to({x:0.25, y:0.25}, 400, null, true)
			})
			moveElement1.onComplete.add(function (obj) {
				game.add.tween(obj.scale).to({x:0.6, y:0.6}, 150, Phaser.Easing.Cubic.Out, true).yoyo(true)
				sound.play("starsCollision")
			})
			// var scaleElement = game.add.tween(element.scale).to({x:0.6, y:0.6}, 250, Phaser.Easing.Cubic.Out).yoyo(true)
			var alphaElement = game.add.tween(element).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, false)
			moveElement1.chain(moveElement2)
			moveElement2.chain(alphaElement)
			
			alphaElement.onStart.add(function (obj) {
				var powerLvl = players[obj.index].multiplier < 1 ? "LOW" :
					players[obj.index].multiplier > 1 ? "HIGH" : "MED"

				players[obj.index].hpBar.setPower(powerLvl)
			})


		}



	}

    function showReadyGo() {
		onBattle = false
		if(timerEnded){
			var gameFinished = checkWins()
			if(gameFinished)
				return
		}

		sound.play("swipe")
    	tweenReady1 = game.add.tween(roundGroup).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(roundGroup.scale).from({x:0.5, y:0.5}, 600, Phaser.Easing.Back.Out, true)
		var tweenReady2 = game.add.tween(roundGroup).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		var tweenReady3 = game.add.tween(go).to({alpha:1}, 300, Phaser.Easing.Quintic.Out)
		var tweenScale = game.add.tween(go.scale).from({x:0.5, y:0.5}, 300, Phaser.Easing.Quintic.Out)
		var tweenReady4 = game.add.tween(go).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		tweenReady1.chain(tweenReady2)
		tweenReady2.chain(tweenReady3)
		tweenReady3.chain(tweenReady4)
		tweenReady3.onStart.add(function(){
			tweenScale.start()
			sound.play("comboSound")
		})
		tweenReady4.onComplete.add(function(){
			startTimer = true
			startRound()
			// checkPowerBars()
		})
	}
    
    function enterGame() {
		for(var pIndex = 0; pIndex < players.length; pIndex++){
			var player = players[pIndex]

			player.originalX = player.x
			player.x = player.numPlayer === 1 ? -100 : game.world.width + 100 //* player.scaleReference
			// console.log(player.scaleReference, "scaleReference")
			player.setAnimation(["run", "idle"], true)
			game.add.tween(player).to({x:player.originalX}, 1200, Phaser.Easing.Cubic.Out, true)

			player.hpBar.alpha = 0
			game.add.tween(player.hpBar).to({alpha:1}, 1200, Phaser.Easing.Cubic.Out, true, 600)
		}

		game.time.events.add(1200, showReadyGo)

	}

	function initQuestion(){
		// questionGroup.questionText.text = localization.getString(localizationData, "question") + questionCounter
		questionCounter++
		roundGroup.numberRound.text = questionCounter
		// equationGroup.alpha = 0
		// game.add.tween(questionGroup).to({alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true)
	}

	function generateEquation(data){
		if(data.operator === "/"){
			equationGroup.equation.text = data.operand1 + " ÷ " + data.operand2 + " = " + data.result
		}else{
			equationGroup.equation.text = data.operand1 + " " + data.operator + " " + data.operand2 + " = " + data.result
		}

	}

	function convertTimeFormat2(timeValue){
		var minutes = Math.floor((timeValue * 0.001) / 60)
		var seconds = Math.floor(timeValue * 0.001) % 60
		var result = (seconds < 10) ? "0" + seconds : seconds;
		return minutes + ":" + result
	}

	function convertTimeFormat(timeValue){
		var seconds = Math.floor(timeValue * 0.001)
		var decimals = Math.floor(timeValue * 0.01) % 10
		var centimals = (Math.floor(timeValue / 10) % 10)
		// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
		var result = (seconds < 10) ? "0" + seconds : seconds;
		result += ":" + decimals + centimals
		return result
	}

	function compareResult(data, playerWin, playerLose){
		if(playerWin){
			playerWin.stats.showWinner(data.timeDifference)
			playerLose.stats.showLose(data.timeDifference)
		}else{
			players[0].stats.showLose()
			players[1].stats.showLose()
		}
		game.time.events.add(1500, roundWinReaction, null, playerWin, playerLose)
	}

	function roundWinReaction(playerWin, playerLose){
		if(playerWin){
			sound.play("magic")
			sceneGroup.correctParticle.x = playerWin.x
			sceneGroup.correctParticle.y = playerWin.y - 150
			sceneGroup.correctParticle.start(true, 1000, null, 5)
			playerWin.setAnimation(["win", "idle"], true)
			game.time.events.add(1000, function () {
				game.add.tween(answersGroup).to({y:answersGroup.y + 184 * 0.9}, 1000, Phaser.Easing.Cubic.Out, true)
				playerAttack(playerWin, playerLose, createProyectile, "proyectile")
			})

			playerWin.hpBar.addWin()
		}else{
			players[0].setAnimation(["hit", "idle"], true)
			players[1].setAnimation(["hit", "idle"], true)
			game.time.events.add(1000, function(){
				game.add.tween(answersGroup).to({y:answersGroup.y + 184 * 0.9}, 1000, Phaser.Easing.Cubic.Out, true)
				showReadyGo()
			})
		}
		game.add.tween(questionGroup).to({alpha:0}, 1000, Phaser.Easing.Cubic.Out, true)
	}

	function numbersEffect() {
		// sound.play("cut")
		//
		// equationGroup.alpha = 0
		questionGroup.alpha = 0
		//
		// equationGroup.scale.x = 0.2
		// equationGroup.scale.y = 0.2
		questionGroup.scale.y = 0.2
		questionGroup.scale.x = 0.2

		// game.add.tween(equationGroup.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
		// game.add.tween(equationGroup).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
		game.add.tween(questionGroup).to({alpha: 1}, 800, Phaser.Easing.Cubic.Out, true)
		game.add.tween(questionGroup.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true)
	}

	function generateQuestion(data) {
		// var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
		// console.log(data)
		generateEquation(data)
		numbersEffect()

	}

	function checkAnswer(event) {
		onBattle = true

		game.add.tween(answersGroup).to({y:game.world.height}, 500, Phaser.Easing.Cubic.Out, true)
		sound.play("swipe")

		var data = server ? server.currentData.data : {operand1:100, operator:"+", operand2:100, result:200, correctAnswer:200}
		switch ("?"){
			case data.operand1:
				data.operand1 = data.correctAnswer
				break
			case data.operand2:
				data.operand2 = data.correctAnswer
				break
			case data.result:
				data.result = data.correctAnswer
				break

		}
		generateEquation(data)

		game.add.tween(equationGroup.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		var playerWin = null, playerLose = null
		if(event.numPlayer === 1){
			playerWin = players[0]
			playerLose = players[1]
		}
		else if(event.numPlayer === 2) {
			playerWin = players[1]
			playerLose = players[0]
		}

		var p1answer = players[0].stats.answerText
		p1answer.text = event.answers.p1.value
		var p2answer = players[1].stats.answerText
		p2answer.text = event.answers.p2.value
		p1answer.alpha = 0
		p2answer.alpha = 0
		p1answer.scale.x = 0.4; p1answer.scale.y = 0.4;
		p2answer.scale.x = 0.4; p2answer.scale.y = 0.4;

		var p1Time = players[0].stats.timeText
		p1Time.text = convertTimeFormat(event.answers.p1.time)
		var p2Time = players[1].stats.timeText
		p2Time.text = convertTimeFormat(event.answers.p2.time)
		p1Time.alpha = 0
		p2Time.alpha = 0
		p1Time.scale.x = 0.4; p1Time.scale.y = 0.4;
		p2Time.scale.x = 0.4; p2Time.scale.y = 0.4;

		var answerShow = game.add.tween(p1answer).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true, 800)
		game.add.tween(p1answer.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true, 800)
		game.add.tween(p2answer).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true, 800)
		game.add.tween(p2answer.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true, 800)
		answerShow.onStart.add(function () {
			sound.play("flip")
		})

		var timeTween = game.add.tween(p1Time).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true, 1200)
		game.add.tween(p1Time.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true, 1200)
		game.add.tween(p2Time).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true, 1200)
		game.add.tween(p2Time.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true, 1200)

		timeTween.onStart.add(function () {
			sound.play("flip")
		})
		timeTween.onComplete.add(function () {
			compareResult(event, playerWin, playerLose)
		})

	}

	function startRound() {
		players[0].stats.clear()
		players[1].stats.clear()

		initQuestion()
		if(server){
			server.generateQuestion()
		}else{
			// game.time.events.add(200, function () {
				generateQuestion({operand1:200, operator:"/", operand2:200, result:400})
			// })
		}
		// if(server)
		// 	server.generateQuestion()

		// game.time.events.add(1000, generateQuestion)
	}

    function enableCircle(option) {
        option.circle.inputEnabled = true
    }

	function showExit() {

		var exitButton = hudGroup.winGroup.exitButton
		var exitTween = game.add.tween(exitButton).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		exitTween.onStart.add(function () {
			game.add.tween(exitButton.scale).to({x:0.9, y:0.9}, 500, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true)
		})
	}

	function createWinOverlay() {
		hudGroup.winGroup.alpha = 0

		var winBar = hudGroup.winGroup.create(0, 0, "atlas.battle", "win")
		winBar.anchor.setTo(0.5, 0)
		winBar.x = game.world.centerX

		var fontStyle = {font: "55px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var winText = game.add.text(0, -5, "VICTORY", fontStyle)
		winText.anchor.setTo(0.5, 0)
		hudGroup.winGroup.add(winText)
		winText.x = game.world.centerX
		winText.y = 135

		var playerName = game.add.text(0, -5, "Player1", fontStyle)
		playerName.anchor.setTo(0.5, 0.5)
		hudGroup.winGroup.add(playerName)
		playerName.x = game.world.centerX
		playerName.y = game.world.centerY - 50
		hudGroup.winGroup.playerName = playerName

		var buttonGroup = game.add.group()
		buttonGroup.x = game.world.centerX
		buttonGroup.y = game.world.centerY + 140
		hudGroup.winGroup.add(buttonGroup)

		var homeButton = buttonGroup.create(0, -70, "atlas.battle", "redButton")
		homeButton.anchor.setTo(0.5, 0.5)
		homeButton.tag = "home"

		homeButton.inputEnabled = true
		homeButton.events.onInputDown.add(onClickBtn)

		var homeLabel = game.add.text(0, -70, "Home", fontStyle)
		homeLabel.anchor.setTo(0.5, 0.5)
		buttonGroup.add(homeLabel)

		var retryBtn = buttonGroup.create(0, 80, "atlas.battle", "greenButton")
		retryBtn.anchor.setTo(0.5, 0.5)
		retryBtn.tag = "retry"

		var retryLabel = game.add.text(0, 80, "Retry", fontStyle)
		retryLabel.anchor.setTo(0.5, 0.5)
		buttonGroup.add(retryLabel)

		retryBtn.inputEnabled = true
		retryBtn.events.onInputDown.add(onClickBtn)
	}
	
	function createLoseOverlay() {
		hudGroup.loseGroup.alpha = 0
		hudGroup.loseGroup.y = -game.world.height

		var loseBar = hudGroup.loseGroup.create(0, 110, "atlas.battle", "lose")
		loseBar.anchor.setTo(0.5, 0)
		loseBar.x = game.world.centerX

		var fontStyle = {font: "55px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var loseText = game.add.text(0, 22, "DON'T GIVE UP", fontStyle)
		loseText.anchor.setTo(0.5, 0)
		hudGroup.loseGroup.add(loseText)
		loseText.x = game.world.centerX
		loseText.y = 135

		var retryButton = hudGroup.loseGroup.create(0, game.world.height - 80, "atlas.battle", "retry01")
		retryButton.anchor.setTo(0.5, 0.5)
		retryButton.scale.setTo(0.5, 0.5)
		retryButton.x = game.world.centerX - 100
		retryButton.tag = "retry"
		retryButton.inputEnabled = true
		retryButton.events.onInputDown.add(onClickBtn)

		var exitButton = hudGroup.loseGroup.create(0, game.world.height - 80, "atlas.battle", "back01")
		exitButton.anchor.setTo(0.5, 0.5)
		exitButton.scale.setTo(0.5, 0.5)
		exitButton.x = game.world.centerX + 100
		exitButton.tag = "exit"
		exitButton.inputEnabled = true
		exitButton.events.onInputDown.add(onClickBtn)

	}

	function onClickBtn(btn) {
        
        
        
		if(inputsEnabled){
            // if(!tutorial){
                // game.add.tween(mano).to({alpha:0},100,Phaser.Easing.linear,true, 200).onComplete.add(function(){
                //         sceneGroup.add(mano);
                //         mano.position.x=game.world.centerX-90
                //         mano.position.y=game.world.centerY-140
                //         mano.animations.stop("hand")
                //         mano.animations.play('hand', 60, true);
                //         game.add.tween(mano).to({alpha:1},200,Phaser.Easing.linear,true, 100)
                //     })
                // }
			inputsEnabled = false
			var toScaleX = btn.scale.x + 0.1
			var toScaleY = btn.scale.y - 0.1
			game.add.tween(btn.scale).to({x:toScaleX, y:toScaleY}, 200, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true)
            
			if(btn.tag === "attack"){
				playerAttack(players[0], players[1], createProyectile)
				controlGroup.hide.start()
				sound.play("epicAttackButton")
			}else if(btn.tag === "retry")
				stopGame("retry")
			else if(btn.tag === "home")
				stopGame("home")
			// else
			// 	stopGame()
		}
	}

	function createPlayerStats(direction) {
		var statsGroup = game.add.group()
		answersGroup.add(statsGroup)

		var fontStyle = {font: "48px Luckiest Guy", fontWeight: "bold", fill: "#000000", align: "center"}

		var answerBg = statsGroup.create(200 * direction, -120, "atlas.battle", "answer")
		answerBg.anchor.setTo(0.5, 0.5)

		var answerText = game.add.text(answerBg.x, answerBg.y + 4, "999", fontStyle)
		answerText.anchor.setTo(0.5, 0.5)
		statsGroup.add(answerText)
		statsGroup.answerText = answerText

		var ledOff = statsGroup.create(80 * direction, -120, "atlas.battle", "led_off")
		ledOff.anchor.setTo(0.5, 0.5)
		var ledRed = statsGroup.create(80 * direction, -120, "atlas.battle", "led_red")
		ledRed.anchor.setTo(0.5, 0.5)
		ledRed.alpha = 0
		var ledGreen = statsGroup.create(80 * direction, -120, "atlas.battle", "led_green")
		ledGreen.anchor.setTo(0.5, 0.5)
		ledGreen.alpha = 0

		var timeBgOff = statsGroup.create(150 * direction, -44, "atlas.battle", "time_off")
		timeBgOff.anchor.setTo(0.5, 0.5)
		var timeBgWin = statsGroup.create(150 * direction, -44, "atlas.battle", "time")
		timeBgWin.anchor.setTo(0.5, 0.5)
		timeBgWin.alpha = 0
		var timeBgLose = statsGroup.create(150 * direction, -44, "atlas.battle", "time_lose")
		timeBgLose.anchor.setTo(0.5, 0.5)
		timeBgLose.alpha = 0

		var timeText = game.add.text(timeBgOff.x, timeBgOff.y + 4, "00:00", fontStyle)
		timeText.anchor.setTo(0.5, 0.5)
		statsGroup.add(timeText)
		statsGroup.timeText = timeText

		var timeImg = statsGroup.create(285 * direction, -44, "atlas.battle", "stopwatch")
		timeImg.scale.setTo(0.7, 0.7)
		timeImg.anchor.setTo(0.5, 0.5)

		var winnerGroup = game.add.group()
		winnerGroup.x = 200 * direction; //winnerGroup.y = -246
		answersGroup.add(winnerGroup)
		answersGroup.sendToBack(winnerGroup)

		var winnerBan = winnerGroup.create(0, 0, "atlas.battle", "comparison")
		winnerBan.anchor.setTo(0.5, 0.5)
		winnerBan.scale.x = 1.4

		var fontStyle2 = {font: "32px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var winString = localization.getString(localizationData, "winner")
		var winnerText = game.add.text(0, -44, winString, fontStyle2)
		winnerText.anchor.setTo(0.5, 0.5)
		winnerGroup.add(winnerText)

		var difTimeText = game.add.text(-28, 12, "-0:00", fontStyle)
		difTimeText.anchor.setTo(0.5, 0.5)
		winnerGroup.add(difTimeText)

		var fontStyle3 = {font: "32px Luckiest Guy", fontWeight: "bold", fill: "#000000", align: "center"}
		var diffLabel = game.add.text(75, 30, "sec", fontStyle3)
		diffLabel.anchor.setTo(0.5, 0.5)
		winnerGroup.add(diffLabel)

		statsGroup.showWinner = function (timeDifference) {
			var toMove = timeDifference ? -246 : -152
			var moveWinner = game.add.tween(winnerGroup).to({y:toMove}, 500, Phaser.Easing.Cubic.Out, true, 500)
			moveWinner.onStart.add(function () {
				sound.play("swipe")
			})

			game.add.tween(ledGreen).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true, 1500)
			game.add.tween(ledGreen.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Cubic.Out, true, 1500).yoyo(true)

			if(timeDifference){
				sound.play("pop")
				game.add.tween(timeBgWin).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)
				game.add.tween(timeBgWin.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
				difTimeText.text = "-" + convertTimeFormat(timeDifference)
			}
		}

		statsGroup.showLose = function (timeDifference) {
			game.add.tween(ledRed).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true, 1500)
			game.add.tween(ledRed.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Cubic.Out, true, 1500).yoyo(true)

			if(timeDifference){
				sound.play("pop")
				game.add.tween(timeBgLose).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)
				game.add.tween(timeBgLose.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
			}
		}

		statsGroup.hideBan = function(){
			game.add.tween(winnerGroup).to({y:0}, 500, Phaser.Easing.Cubic.Out, true)
		}

		statsGroup.clear = function () {
			timeBgLose.alpha = 0
			timeBgWin.alpha = 0
			ledRed.alpha = 0
			ledGreen.alpha = 0
			timeText.alpha = 0
			answerText.alpha = 0
		}

		return statsGroup
	}

	function createbattleUI() {

		var fontStyle = {font: "52px VAGRounded", fontWeight: "bold", fill: "#113860", align: "center"}
		var fontStyle2 = {font: "72px Luckiest Guy", fontWeight: "bold", fill: "#000000", align: "center"}

		questionGroup = game.add.group()
		questionGroup.x = game.world.centerX
		questionGroup.y = game.world.centerY - 50
		questionGroup.alpha = 0
		hudGroup.uiGroup.add(questionGroup)
		// questionGroup.scale.setTo(0.6, 0.6)

		// var topBar = questionGroup.create(0, 0, "atlas.battle", "top")
		// topBar.anchor.setTo(0.5, 0)

		var container = questionGroup.create(0,0, "atlas.battle", "container_blue")
		// container.y = 170
		container.anchor.setTo(0.5, 0.5)
		container.scale.x = 1.4

		// var questionString = localization.getString(localizationData, "question") + questionCounter
		// var questionText = new Phaser.Text(game, 0, 60, questionString, fontStyle2)
		// questionText.anchor.setTo(0.5,0.5)
		// questionGroup.add(questionText)
		// questionGroup.questionText = questionText

		equationGroup = game.add.group()
		questionGroup.add(equationGroup)
		equationGroup.y = container.y
		// equationGroup.alpha = 0
		// equationGroup.question = ""

		// var equation = game.add.bitmapText(0,6,"WAG", "0+0=?", 72)
		var equation = game.add.text(0, -16, "0+0=?", fontStyle)
		// equation.scale.setTo(1.4, 1.4)
		// equation.tint = 0x350A00
		equation.anchor.setTo(0.5,0.5)
		equationGroup.add(equation)
		equationGroup.equation = equation

		answersGroup = game.add.group()
		answersGroup.x = game.world.centerX
		answersGroup.y = game.world.height
		hudGroup.uiGroup.add(answersGroup)
		answersGroup.scale.setTo(0.9, 0.9)

		var bar = answersGroup.create(0,0, "atlas.battle", "bar")
		bar.anchor.setTo(0.5, 1)

		var vs = answersGroup.create(0,0, "atlas.battle", "versus")
		vs.anchor.setTo(0.5, 1)
		answersGroup.y = answersGroup.y + bar.height

		players[0].stats = createPlayerStats(-1)
		players[1].stats = createPlayerStats(1)

		var correctParticle = createPart("star", "atlas.battle")
		sceneGroup.add(correctParticle)
		sceneGroup.correctParticle = correctParticle

		var wrongParticle = createPart("wrong", "atlas.battle")
		sceneGroup.add(wrongParticle)
		sceneGroup.wrongParticle = wrongParticle

		// createConfeti()
		roundGroup = game.add.group()
		sceneGroup.add(roundGroup)
		roundGroup.x = game.world.centerX
		roundGroup.y = game.world.centerY
		roundGroup.alpha = 0

		var round = roundGroup.create(0, 0, "round")
		round.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "110px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var roundText = game.add.text(180, -20, questionCounter, fontStyle)
		roundText.anchor.setTo(0.5, 0.5)
		roundGroup.add(roundText)
		roundGroup.numberRound = roundText

		go = sceneGroup.create(game.world.centerX, game.world.centerY, "start")
		go.anchor.setTo(0.5, 0.5)
		go.alpha = 0

		createWinOverlay()
		// createLoseOverlay()

    }

    function getFunctionData(value) {
		var indexOfFunc = value.indexOf(":")
		var functionName = null
		var param = null

		if(indexOfFunc > -1){
			functionName = value.substr(0, indexOfFunc)
			param = value.substr(indexOfFunc + 1)
		}
		// console.log(functionName, param)

		return {name: functionName, param: param}
	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
		// spineSkeleton.scale.setTo(0.8,0.8)
		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setAnimationByName(0, idleAnimation, true)
		// spineSkeleton.autoUpdateTransform ()
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, loop, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var isLoop = (index === animations.length - 1) && loop
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, isLoop)
				else
					spineSkeleton.addAnimationByName(0, animation, isLoop)

			}

			if (args)
				entry.args = args

			if(onComplete){
				entry.onComplete = onComplete
			}

			return entry
		}

		spineGroup.setSkinByName = function (skin) {
			spineSkeleton.setSkinByName(skin)
			spineSkeleton.setToSetupPose()
		}

		spineGroup.setAlive = function (alive) {
			spineSkeleton.autoUpdate = alive
		}

		spineGroup.getSlotContainer = function (slotName) {
			var slotIndex
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.name === slotName){
					slotIndex = index
				}
			}

			if (slotIndex){
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineSkeleton.onEvent.add(function (i,e) {
			var eventName = e.data.name

			if((!eventName)&&(typeof eventName !== 'string'))
				return

			var functionData = getFunctionData(eventName)
			if((!functionData)||(!functionData.name)){return}

			if(functionData.name === "PLAY"){
				// console.log(functionData.param)
				sound.play(functionData.param)
			}
		})

		spineGroup.spine = spineSkeleton

		return spineGroup
	}

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
            
            tutoGroup.y = -game.world.height
            startRound()
            // startTimer(missPoint)
        })
    }


	function addNumberPart(obj,number, fill, offsetY){
		offsetY = offsetY || 100
		fill = fill || "#ffffff"
		var fontStyle = {font: "38px Luckiest Guy", fontWeight: "bold", fill: fill, align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world ? obj.world.x : obj.centerX
		pointsText.y = obj.world ? obj.world.y : obj.centerY - 100
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + offsetY},1000,Phaser.Easing.Cubic.Out,true)
		game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.Cubic.In,true,1000)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}
	
	function createTimer() {
		timerGroup = game.add.group()
		timerGroup.y = 100
		timerGroup.x = game.world.centerX
		sceneGroup.add(timerGroup)
		// timerGroup.cameraOffset.setTo(game.world.centerX, 100);

		var containerTime = timerGroup.create(0, 0, "atlas.battle", "container_time")
		containerTime.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "60px Luckiest Guy", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var timerString = convertTimeFormat2(battleTime)
		var timerText = game.add.text(0, 11, timerString, fontStyle)
		timerGroup.add(timerText)
		timerText.anchor.setTo(0.5, 0.5)

		var fontStyle2 = {font: "34px Luckiest Guy", fontWeight: "bold", fill: "#363737", align: "center"}
		var label = game.add.text(0, -60, "Time", fontStyle2)
		timerGroup.add(label)
		label.anchor.setTo(0.5, 0.5)

		timerGroup.timerText = timerText
	}

	function checkWins() {
		if((players[0].hpBar.winCounter === players[1].hpBar.winCounter)||(onBattle))
			return

		tweenReady1.stop()
		roundGroup.alpha = 0
		go.alpha = 0
		var playerWin = players[0].hpBar.winCounter > players[1].hpBar.winCounter ? players[0] : players[1]

		var tweenAppear = game.add.tween(timesUp).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(timesUp.scale).from({x:0.5, y:0.5}, 600, Phaser.Easing.Back.Out, true)
		var tweenDissapear = game.add.tween(timesUp).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, false, 1400)
		tweenAppear.chain(tweenDissapear)
		tweenDissapear.onComplete.add(winPlayer.bind(null, playerWin))

		if(server)
			server.removeEventListener('onTurnEnds', checkAnswer)

		return true
	}

    return {
        assets: assets,
        name: "battle",
        preload:preload,
		setCharacters:function (characters) {
			charactersCards = []
        	for(var charIndex = 0; charIndex < characters.length; charIndex++){
				var character = characters[charIndex]
				var data = epicCharacters[character.id]
				// console.log(character, "character")
				// var jsonPath = DATA_CHAR_PATH + character.name + ".json"
				// assets.jsons.push({name:character.name + "Data", file:jsonPath})
				assets.spines.push({name:character.id, file:data.directory})
				charactersCards.push(character)
			}
		},
		setBackground:function (number) {
			number = number || game.rnd.integerInRange(1, NUM_BACKGROUNDS)
			var floorObj = {
				name:"floor",
				file:"images/battle/backgrounds/floor_" + number + ".png"
			}
			var bgObg = {
				name:"background",
				file:"images/battle/backgrounds/top_bg_" + number + ".png"
			}

			assets.images.push(floorObj)
			assets.images.push(bgObg)
		},
		update:function () {
			if((startTimer)&&(!timerEnded)) {
				timeElapsed += game.time.elapsedMS
				var timeRemaining = battleTime - timeElapsed
				if(timeRemaining > 0)
				{
					timerGroup.timerText.text = convertTimeFormat2(timeRemaining)
				}else {
					timerGroup.timerText.text = "0:00"
					timerEnded = true
					checkWins()
				}

			}
		},
        create: function(event){
            

        	// game.camera.bounds = new Phaser.Rectangle(-200,0,game.world.width + 200,game.world.height)
			// console.log(game.camera.bounds)
			battleTime = server ? server.currentData.time : 10000
        	sceneGroup = game.add.group();
            //yogomeGames.mixpanelCall("enterGame",gameIndex);


			var fondo = sceneGroup.create(0,0,'fondo')
			fondo.anchor.setTo(0.5, 1)
			fondo.scale.setTo(1, 1)
			fondo.x = game.world.centerX
			fondo.y = game.world.height

			alphaMask = game.add.graphics()
			alphaMask.beginFill(0x000000)
			alphaMask.drawRect(-200,-100, game.world.width + 200, game.world.height + 100)
			alphaMask.endFill()
			sceneGroup.add(alphaMask)
			alphaMask.alpha = 0

            battleSong = game.add.audio('battleSong')
            game.sound.setDecodedCallback(battleSong, function(){
                battleSong.loopFull(0.6)
            }, this);


			hudGroup = game.add.group();
			sceneGroup.add(hudGroup)
			hudGroup.fixedToCamera = true
			hudGroup.cameraOffset.setTo(0, 0);

			var uiGroup = game.add.group()
			hudGroup.add(uiGroup)
			hudGroup.uiGroup = uiGroup

			// createCaptured()

			var winGroup = game.add.group()
			hudGroup.add(winGroup)
			hudGroup.winGroup = winGroup

			var loseGroup = game.add.group()
			hudGroup.add(loseGroup)
			hudGroup.loseGroup = loseGroup
            

			initialize()
			createGameObjects()
            createbattleUI()
			// game.time.events.add(500, startRound)
			enterGame()
            // createTutorial()

			sceneGroup.bringToTop(hudGroup)
            // buttons.getButton(battleSong,hudGroup, game.width - 50)

			frontGroup = game.add.group()
			sceneGroup.add(frontGroup)
			frontGroup.fixedToCamera = true
			frontGroup.cameraOffset.setTo(0, 0);

			lastRound = sceneGroup.create(game.world.centerX, game.world.centerY, "lastRound")
			lastRound.anchor.setTo(0.5, 0.5)
			timesUp = sceneGroup.create(game.world.centerX, game.world.centerY, "timesUp")
			timesUp.anchor.setTo(0.5, 0.5)
			lastRound.alpha = 0
			timesUp.alpha = 0

			createTimer()
        }
    }
}()