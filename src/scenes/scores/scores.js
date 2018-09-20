
var scores = function(){

	var soundsPath = "../../shared/minigames/sounds/"

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
				name: "atlas.scores",
				json: settings.BASE_PATH + "/images/scores/atlas.json",
				image: settings.BASE_PATH + "/images/scores/atlas.png",
			},
			{
				name: "atlas.yogotars",
				json: settings.BASE_PATH + "/images/scores/yogotars.json",
				image: settings.BASE_PATH + "/images/scores/yogotars.png",
			},
			{
				name: "atlas.question",
				json: settings.BASE_PATH + "/images/questionOverlayCliente/atlas.json",
				image: settings.BASE_PATH + "/images/questionOverlayCliente/atlas.png",
			},
		],
		images: [
			{
				name: "tile",
				file: settings.BASE_PATH + "/images/startScreen/bgTile.png",
			},
			{
				name: "eagle",
				file: settings.BASE_PATH + "/images/scores/eagle.png",
			},
			{
				name: "questionBoard",
				file: settings.BASE_PATH + "/images/questionOverlayCliente/questionBoard.png",
			},
{
				name: "default",
				file: settings.BASE_PATH + "/images/questionDB/default.png",
			}
		],
		sounds: [
		],
		spritesheets: [
		],
		spines:[
		],
		particles: [
			// {
			// 	name: 'horizontalLine',
			// 	file: 'particles/horizontalLine/intence_horison_ligth.json',
			// 	texture: 'intence_horison_ligth.png'
			// },
			// {
			// 	name: 'dot',
			// 	file: 'particles/particlesHorizontal/particle_horison_ligth.json',
			// 	texture: 'particle_horison_ligth.png'
			// }
		]
	}

	var SIDES = {
		LEFT:{direction: -1, scale:{x:1}},
		RIGHT:{direction: 1, scale:{x:-1}},
	}

	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
	var teams = [
		["dinamita", "theffanie", "luna"],
		["eagle", "nao", "estrella"],
	]
	var kids = [
		["Rock", "Pawel", "Rulas"],
		["Mares", "Cherry", "Humbert"]
	]

	var TEAM_NAMES = [
		"Equipo Alfa",
		"Equipo Bravo"
	]

	var teamsData

	var sceneGroup
	var tile
	var teamsGroup


	var scoresGroup

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#0D014D"
		loadSounds()
	}

	function preload(){

		game.stage.disableVisibilityChange = true
	}

	function createBackground(){

		var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var bmd = game.add.bitmapData(game.world.width, game.world.height)
		var back = bmd.addToWorld()

		var y = 0

		for (var i = 0; i < bmd.height; i++)
		{
			var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

			bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
			y += 2
		}
		sceneGroup.add(back)

		tile = game.add.tileSprite(0, 0, game.world.width, game.world.width, "tile")
		tile.tint = 0x0099AA
		sceneGroup.add(tile)

		var title = new Phaser.Text(sceneGroup.game, game.world.centerX, 230, "Resultados", fontStyle)
		title.anchor.setTo(0.5)
		sceneGroup.add(title)

		var logos = game.add.group()
		sceneGroup.add(logos)

		for(var j = 0; j < 2; j++){

			var logo = logos.create(game.world.centerX, game.world.height - 150, "atlas.scores", "logo" + j)
			logo.x -= 150 * ORDER_SIDES[j].direction
			logo.anchor.setTo(0.5, 0)
		}
		logos.children[0].scale.setTo(0.3)
		logos.children[1].scale.setTo(0.9)
	}

	function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var barsGroup = game.add.group()
		sceneGroup.add(barsGroup)

		for(var i = 0; i < ORDER_SIDES.length; i++){

			var side = ORDER_SIDES[i]

			var teamBar = barsGroup.create(game.world.width * i, 30, "atlas.scores", "teamBar" + i)
			teamBar.anchor.setTo(i, 0)

			var name = new Phaser.Text(barsGroup.game, 260, 75, TEAM_NAMES[i], fontStyle)
			name.anchor.setTo(0.5)
			name.stroke = "#000066"
			name.strokeThickness = 10
			name.x *= -side.direction
			teamBar.addChild(name)
			teamBar.name = name
		}
	}

	function update(){
		tile.tilePosition.y -= 0.4
		epicparticles.update()
	}

	function createTimeToken(){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#444444", align: "center"}

		var timeToken = resultGroup.create(game.world.centerX, 320, "atlas.scores", "timeToken")
		timeToken.anchor.setTo(0.5)

		var text = new Phaser.Text(resultGroup.game, 0, -5, "3:00", fontStyle)
		text.anchor.setTo(0.5)
		timeToken.addChild(text)
		timeToken.text = text
	}

	function createTeams(){

		teamsGroup = game.add.group()
		teamsGroup.x = game.world.centerX
		teamsGroup.y = game.world.centerY
		sceneGroup.add(teamsGroup)

		for(var sideIndex = 0; sideIndex < ORDER_SIDES.length; sideIndex++){

			var sideTeam = game.add.group()
			teamsGroup.add(sideTeam)

			var side = ORDER_SIDES[sideIndex]
			var pivotX = game.world.centerX * 0.82 * side.direction
			var pivotY = game.world.centerY * -0.2
			var RISE_Y = game.world.centerY * 0.35

			for(var i = 0; i < teamsData[sideIndex].players.length; i++){
				var playerData = teamsData[sideIndex].players[i]

				var teamMate = createYogoToken(sideIndex, playerData.avatar, playerData.nickname)
				teamMate.x = pivotX
				teamMate.y = pivotY
				sideTeam.add(teamMate)

				if(i == 1){
					teamMate.x += 225 * side.scale.x
				}

				pivotY += RISE_Y
			}

			sideTeam.swapImage = swapImage.bind(sideTeam)
			game.time.events.add(5000, sideTeam.swapImage)
		}
	}

	function createYogoToken(color, yogo, kid){

		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
		var side = ORDER_SIDES[color]

		var memberGroup = game.add.group()
		memberGroup.turn = 0

		var shine = memberGroup.create(0, 50, "atlas.scores", "light" + color)
		shine.anchor.setTo(0.5, 1)
		//shine.scale.setTo(1,0)
		memberGroup.shine = shine

		var token = memberGroup.create(0, 0, "atlas.scores", "token" + color)
		token.anchor.setTo(0.5)

		var nameBoard = memberGroup.create(0, 100, "atlas.scores", "nameBoard")
		nameBoard.anchor.setTo(0.5)
		nameBoard.scale.setTo(side.scale.x * 0.5, 0.5)
		memberGroup.board = nameBoard

		var nameTxt = new Phaser.Text(memberGroup.game, 40, 5, kid, fontStyle)
		nameTxt.anchor.setTo(0.5)
		nameTxt.scale.setTo(side.scale.x, 1)
		nameBoard.addChild(nameTxt)
		nameBoard.txt = nameTxt

		var yogo = memberGroup.create(0, 40, "atlas.yogotars", yogo)
		yogo.anchor.setTo(0.5, 1)
		yogo.scale.setTo(0.5)
		yogo.growScale = 0.5
		memberGroup.yogo = yogo

		var key = game.cache.checkImageKey(kid) ? kid : "eagle"
		var kidPhoto = memberGroup.create(0, 40, key)
		kidPhoto.anchor.setTo(0.5, 1)
		kidPhoto.scale.setTo(0, 0.4)
		kidPhoto.growScale = 0.4
		memberGroup.kid = kidPhoto

		return memberGroup
	}

	function createScoreBubble(){

		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		scoresGroup = game.add.group()
		scoresGroup.x = game.world.centerX
		scoresGroup.y = game.world.centerY
		sceneGroup.add(scoresGroup)

		var pivotX = game.world.centerX * 0.25

		for(var i = 0; i < ORDER_SIDES.length; i++){

			var bubble = scoresGroup.create(0, 0, "atlas.scores", "score" + i)
			bubble.anchor.setTo(0.5)
			bubble.x = pivotX * ORDER_SIDES[i].direction
			bubble.points = 0

			var lifeText = teamsData[i].life//.split("").join(String.fromCharCode(8202))
			
			var score = new Phaser.Text(scoresGroup.game, 0, 50, lifeText, fontStyle)
            score.anchor.setTo(0.5)
            bubble.addChild(score)
            bubble.text = score
		}
	}

	function swapImage(){

		var self = this

		for(var i = 0; i < self.length; i++){

			var token = self.children[i]
			if(token.turn == 0){
				token.turn = 1
				var size = token.kid.growScale
				var picDown = token.yogo
				var picUp = token.kid
			}
			else{
				token.turn = 0
				var size = token.yogo.growScale
				var picDown = token.kid
				var picUp = token.yogo
			}

			var scaleDown = game.add.tween(picDown.scale).to({x: 0}, 400, Phaser.Easing.Cubic.InOut, true)
			var scaleUp = game.add.tween(picUp.scale).to({x: size}, 400, Phaser.Easing.Cubic.InOut, false)
			scaleDown.chain(scaleUp)

		}

		game.time.events.add(5000, self.swapImage)
	}

	function createVS(){

		var vs = sceneGroup.create(game.world.centerX, game.world.centerY - 100, "atlas.scores", "vs")
		vs.anchor.setTo(0.5)
		vs.scale.setTo(0.8)
		//vs.alpha = 0
		sceneGroup.vs = vs
	}

	function animateScene(){

//        var emitter = epicparticles.newEmitter("horizontalLine")
//        emitter.x = game.world.centerX
//        emitter.y = game.world.centerY + 40

		// var dots = epicparticles.newEmitter("dot")
		// dots.x = game.world.centerX
		// dots.y = game.world.centerY + 40

		var lastTween

		for(var j = 0; j < teamsGroup.length; j++){

			var teamG = teamsGroup.children[j]
			var side = ORDER_SIDES[j].scale.x
			var posx = -250 * side + (game.world.width * j)
			var delay = 500

			for(var i = 0; i < teamG.length; i++){

				lastTween = game.add.tween(teamG.children[i]).from({x:posx}, 200, Phaser.Easing.Cubic.Out, true, delay)
				delay += 250
			}
		}

		lastTween.onComplete.add(function(){
			resultGroup.VS.alpha = 1
			var first = game.add.tween(resultGroup.VS.scale).from({x: 10, y: 10}, 400, Phaser.Easing.Cubic.Out, true)
			var second = game.add.tween(resultGroup.light.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Cubic.InOut, false, 0, 0, true)
			first.chain(second)

			second.onComplete.add(function(){
				//for(var j = 0; j < teamsGroup.length; j++){
				//var teamG = teamsGroup.children[j]
				teamsGroup.forEach(function(teamG){
					teamG.forEach(function(grp){
						if(grp.shine)
							game.add.tween(grp.shine.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Cubic.Out, true)
						if(grp.yogo)
							grp.yogo.changeYogo()
					})
				})

				//}
			})
		})
	}

	function setCharacter(character){

		var charObj = {
			name: character,
			file: settings.BASE_PATH + "/images/scores/" + character + ".png",
		}
		assets.images.push(charObj)
	}

	function setScore(index, lifePoints){

		var bubble = scoresGroup.children[index]
		bubble.points++
		game.add.tween(bubble.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.InOut, true, 0, 0, true)
		bubble.text.setText(lifePoints)
	}

	function createQuestionOverlay(){

		questionGroup = questionHUD.createQuestionOverlay()
		questionGroup.client = true
		sceneGroup.add(questionGroup)

		var obj = {
			question: "lorem ipsum dolor",
			existImage : false,
			src: settings.BASE_PATH + "/images/questionDB/default.png",
			image: "default",
			answers: ["a", "be", "ce", "de"],
			grade: 1,
			level: 1,
			correctAnswer: 2,
			timers:{
				ultra : 6500,
				super : 13000,
				normal : 20000
			},
			index: 0,
			correctValue: "be"
			//correctIndex:
		}

		//questionGroup.showQuestion(obj)
		//questionGroup.hide()
    }

    function onTeamUpdate(data) {
		setScore(data.numTeam - 1, data.life)
	}

	return {
		assets: assets,
		bootFiles:bootFiles,
		name: "scores",
		update: update,
		preload:preload,
		render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){

			sceneGroup = game.add.group()

			initialize()
			createBackground()
			createTeamBar()
			createTeams()
			createVS()
			createScoreBubble()
			createQuestionOverlay()

			scoreService.removeEventListener("newQuestion", questionGroup.showQuestion)
			scoreService.addEventListener("newQuestion", questionGroup.showQuestion)
			scoreService.removeEventListener("onTeamUpdate", onTeamUpdate)
			scoreService.addEventListener("onTeamUpdate", onTeamUpdate)
			scoreService.removeEventListener("onTurnEnds", questionGroup.hide)
			scoreService.addEventListener("onTurnEnds", questionGroup.hide)
		},
		setTeamData: function (data) {
			teamsData = data

			for (var teamIndex = 0; teamIndex < teamsData.length; teamIndex++){
				for (var playerIndex = 0; playerIndex < teamsData[teamIndex].players.length; playerIndex++) {
					var player = teamsData[teamIndex].players[playerIndex]
					var image = {
						name: player.nickname,
						file: settings.BASE_PATH + "/images/scores/" + player.nickname + ".png"
					}

					assets.images.push(image)
				}
			}
		},
		setScore:setScore,
		shutdown: function () {
			sceneGroup.destroy()
		}
	}
}()