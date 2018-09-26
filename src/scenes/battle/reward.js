
var soundsPath = "../../shared/minigames/sounds/";
var imagePath = settings.BASE_PATH + "/images/reward/";

var reward = function(){
    
    var localizationData = {
        "EN":{
            "howTo":"How to Play?"
        },

        "ES":{
            "howTo":"¿Cómo jugar?"
        }
    }
    
    var assets = {
        atlases: [
            {   
                name: "atlas.reward",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
            },

        ],
        images: [
            {
                name: "tile",
                file: imagePath + "bgTile.png",
            }
        ],
        sounds: [
            {	name: "shineSpell",
                file: settings.BASE_PATH + "/sounds/sounds/shineSpell.wav"
            },
            {	name: "cheers",
                file: settings.BASE_PATH + "/sounds/sounds/cheers.wav"
            },
            {
                name: "rewardSong",
                file: settings.BASE_PATH + "/sounds/songs/reward.wav",
            }
        ],
        spines:[
            {
                name:"coup",
                file:settings.BASE_PATH + "/spines/reward/brain/pantalla_victoria.json"
            },
            {
                name:"boardInfo",
                file:settings.BASE_PATH + "/spines/reward/PlecaAmarilla/PlecaAmarilla.json",
                scales: ["@0.5x"]
            },
            {
				name:"banner",
				file:settings.BASE_PATH + "/spines/selector/banners.json",
			},
        ],
        jsons: [
		],
        particles: [
            {
                name: "confetti1",
                file: settings.BASE_PATH + "/particles/rewardScreen/confettiReward1/confettiReward1.json",
                texture: "confettiReward1.png"
            },
            {
                name: "confetti2",
                file: settings.BASE_PATH + "/particles/rewardScreen/confettiReward1/confettiReward2.json",
                texture: "confettiReward2.png"
            },
            {
                name: "confetti3",
                file: settings.BASE_PATH + "/particles/rewardScreen/confettiReward1/confettiReward3.json",
                texture: "confettiReward3.png"
            },
            {
                name: "confetti6",
                file: settings.BASE_PATH + "/particles/rewardScreen/confettiReward1/confettiReward6.json",
                texture: "confettiReward6.png"
            },
        ]
    }
    
    var TEAMS = [
		{
			name: "Equipo Alfa",
            side: 1,
            color: 1,
            coupSkin: "bravo",
            appear: "appear_alpha",
            index: 0,
            pivot: 0,
            info: "Aciertos: "
		},
		{
			name: "Equipo Bravo",
            side: -1,
            color: 2,
            coupSkin: "alfa",
            appear: "appear_delta",
            index: 0,
            pivot: 1,
            info: "Aciertos: "
		},
    ]
    
    var DEFAULT_NUMTEAM = 0
    var DEFAULT_SCORE = 0
    var DEFAULT_TIME = 0
    
    var WIN_DATA
    var LOSE_DATA
    var WIN_SCALES = [0.8, 0.9, 0.8]
    var INDEX_WINNER
    var FINAL_SCORE
    //var FINAL_TIME

    var sceneGroup
    var tile
    var winnerGroup
    var loserGroup
    var infoGroup
    var players
    var cliente

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        loadSounds()

        cliente = parent.cliente || {}
        var numTeam = indexWinner || DEFAULT_NUMTEAM //cliente.numTeam
        var scoreTeam = FINAL_SCORE || DEFAULT_SCORE
        //var timeTeam = FINAL_TIME || DEFAULT_TIME
        var otherTeam = numTeam == 1 ? 0 : 1
        WIN_DATA = TEAMS[numTeam]
        WIN_DATA.index = numTeam
        WIN_DATA.info = WIN_DATA.info + scoreTeam
        //WIN_DATA.info[1] = WIN_DATA.info[1] + timeTeam
        LOSE_DATA = TEAMS[otherTeam]
        LOSE_DATA.index = otherTeam
    }
    
    function preload(){
        game.stage.disableVisibilityChange = false;
    }

    function update(){
        tile.tilePosition.x += 0.4 * WIN_DATA.side
        epicparticles.update()
    }

    function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height);
        var back = bmd.addToWorld();

        var y = 0;

        for (var i = 0; i < bmd.height; i++)
        {
            var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i);
            bmd.rect(0, y, bmd.width, y + 2, Phaser.Color.getWebRGB(color));
            y += 2;
        }
        sceneGroup.add(back);
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "tile")
        tile.tint = 0x0099AA
        sceneGroup.add(tile)
    }

    function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

        var border = WIN_DATA.color - 1
        
        teamBar = game.add.spine(game.world.width * border, 160, "banner")
		teamBar.setSkinByName(LOSE_DATA.coupSkin)
		teamBar.setAnimationByName(0, "idle", true)
		teamBar.scale.setTo(WIN_DATA.side, 1)
		teamBar.x += 390 * WIN_DATA.side
		sceneGroup.add(teamBar)

		var text = new Phaser.Text(sceneGroup.game, -100, -70, WIN_DATA.name, fontStyle)
		text.anchor.setTo(0.5)
		text.scale.setTo(WIN_DATA.side, 1)
		text.stroke = "#000066"
		text.strokeThickness = 10
		teamBar.addChild(text)
		teamBar.text = text

		// teamBar = sceneGroup.create(game.world.width * border, 30, "atlas.reward", "teamBar" + WIN_DATA.color)
		// teamBar.anchor.setTo(border, 0)

		// var text = new Phaser.Text(sceneGroup.game, 320, 25, WIN_DATA.name, fontStyle)
		// text.anchor.setTo(0.5, 0)
		// text.stroke = "#000066"
		// text.strokeThickness = 10
		// text.x *= WIN_DATA.side
		// teamBar.addChild(text)
		// teamBar.text = text
    }
    
    function createCoup(){

        var coup = game.add.spine(game.world.centerX, game.world.height - 70, "coup")
        coup.scale.setTo(0.8)
        coup.setSkinByName(WIN_DATA.coupSkin)
        coup.setAnimationByName(0,"idle", false)
        var anim = coup.addAnimationByName(0, "win", false)
            anim.onStart = function(){
                sound.play("shineSpell")
                game.add.tween(infoGroup).to({alpha:1}, 500, Phaser.Easing.Cubic.InOut, true)
            }
            anim.onComplete = function(){
                appearWiners()
                apearLosers()
                createConfetti()
            }
        coup.addAnimationByName(0, "winstill", true)
        sceneGroup.add(coup)
        sceneGroup.coup = coup
    }

    function createWinTeam(){

        winnerGroup = game.add.group()
        winnerGroup.x = sceneGroup.coup.centerX
        winnerGroup.y = sceneGroup.coup.centerY - 100
        sceneGroup.add(winnerGroup)

        var distance = sceneGroup.coup.game.width * 0.2
        var pivotX = -distance
        var directon = -1

        var winers = players[WIN_DATA.index]
        
        for(var i = 0; i < winers.length; i++){

            var obj = winers[i]
            var player = spineLoader.createSpine(obj.name, obj.skin, "gg", 0, 0, true)
			player.x = pivotX
            player.scale.setTo(WIN_SCALES[i] * directon, WIN_SCALES[i])
			player.setAlive(false)
            winnerGroup.add(player)
            
            pivotX += distance
            directon = 1
        }
        winnerGroup.children[1].y += 45
    }

    function appearWiners(){

        for(var i = 0; i < winnerGroup.length; i++){

            var delay = game.rnd.realInRange(2, 3) * 1000
            var player = winnerGroup.children[i]  //diferent time to apear
            game.time.events.add(delay, function(player){
                player.setAnimation([WIN_DATA.appear, "win"], true)
                player.setAlive(true)
            },null, player)
        }
        
        game.time.events.add(delay, function(){
            sound.play("cheers")
        })
    }

    function createLoseTeam(){

        loserGroup = game.add.group()
        sceneGroup.add(loserGroup)

        var pivotX = 0.5
        var losers = players[LOSE_DATA.index]

        for(var i = 0; i < losers.length; i++){

            var subGroup = game.add.group()
            subGroup.x = game.world.centerX * pivotX
            subGroup.y = game.world.height - 210
            subGroup.alpha = 0
            loserGroup.add(subGroup)

            var frame = subGroup.create(0, 0, "atlas.reward", "ventanaFondo")
            frame.anchor.setTo(0.5)

            var obj = losers[i]

            var player = spineLoader.createSpine(obj.name, obj.skin, "gg", frame.x, frame.height * 0.9, true)
            player.scale.setTo(0.7)
			player.setAlive(false)
            subGroup.add(player)
            subGroup.anim = player

            var mask = game.add.graphics(-frame.width * 0.8, -200)
            mask.beginFill(0xffffff)
            mask.drawRect(0, 0, frame.width * 1.5, frame.height * 1.55)
            player.mask = mask
            player.addChild(mask)

            var frame = subGroup.create(-2, frame.height * 0.47, "atlas.reward", "ventanaFrente")
            frame.anchor.setTo(0.5)
            
            pivotX += 0.5
        }
    }

    function apearLosers(){

        var posX = (game.world.width * LOSE_DATA.pivot) - (400 * LOSE_DATA.side)
        var delay = 2000

        for(var i = 0; i < loserGroup.length; i++){

            var player = loserGroup.children[i]
            player.anim.setAnimation(["gg"], true)
            player.anim.setAlive(true)
            player.alpha = 1
            game.add.tween(player).from({y:game.world.height + 200}, delay, Phaser.Easing.Cubic.InOut, true)
            delay += 500
        }
    }

    function createInfo(){

        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#000066", align: "center"}
        var border = LOSE_DATA.pivot * game.world.width
        var pivotX = 400 * LOSE_DATA.side
        
        infoGroup = game.add.group()
        infoGroup.alpha = 0
        sceneGroup.add(infoGroup)

        // var board = infoGroup.create(border + pivotX, pivotY, "atlas.reward", "barraAmarilla")
        // board.scale.setTo(LOSE_DATA.side, 1)

        // var text = new Phaser.Text(infoGroup.game, board.centerX + (25 * LOSE_DATA.side), board.centerY + 10, WIN_DATA.info, fontStyle)
        // text.anchor.setTo(0.5)
        // infoGroup.add(text)
        // board.text = text

        teamBar = game.add.spine(border + pivotX, 120, "boardInfo")
		teamBar.setSkinByName("PlecaAmarilla")
		teamBar.setAnimationByName(0, "IDLE", true)
		teamBar.scale.setTo(LOSE_DATA.side * 0.5, 0.5)
		infoGroup.add(teamBar)

		var text = new Phaser.Text(infoGroup.game, 30, 5, WIN_DATA.info, fontStyle)
		text.anchor.setTo(0.5)
		text.scale.setTo(LOSE_DATA.side * 2, 2)
		teamBar.addChild(text)
		teamBar.text = text
    }

    function createBrainParticles(){

        var partsA = epicparticles.newEmitter("partsA")
        partsA.x = sceneGroup.coup.centerX
        partsA.y = sceneGroup.coup.centerY
        sceneGroup.add(partsA)

        var partsB = epicparticles.newEmitter("partsB")
        partsB.x = sceneGroup.coup.centerX
        partsB.y = sceneGroup.coup.centerY
        sceneGroup.add(partsB)
    }

    function createConfetti(){

        var confettisGroup = game.add.group()
        sceneGroup.add(confettisGroup)

        for (let i = 0; i < assets.particles.length; i++) {
            var confetti = epicparticles.newEmitter(assets.particles[i].name)
            confetti.x = game.world.centerX
            confetti.y = 0
            confettisGroup.add(confetti)
        }
    }

    return {
        assets: assets,
        name: "reward",
        update: update,
        preload:preload,
        create: function(event){
            
            sceneGroup = game.add.group()
           
            createBackground()
            initialize()
            createCoup()
            createTeamBar()
            createWinTeam()
            createLoseTeam()
            createInfo()
            
            var rewardSong = sound.play("rewardSong", {loop:true, volume:0.6})

            game.add.tween(sceneGroup).from({alpha:0},500, Phaser.Easing.Cubic.Out,true)

			game.onPause.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = false
			})
			game.onResume.add(function () {
				PhaserSpine.Spine.globalAutoUpdate = true
			})
            
        },
        setTeams: function (myTeams) {
			players = myTeams
		},
        setWinner: function(winner, score, time){
            indexWinner = winner
            FINAL_SCORE = score
            //FINAL_TIME = time
        },
        shutdown: function () {
            sceneGroup.destroy()
		}
    }
}()