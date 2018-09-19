
var soundsPath = "../../shared/minigames/sounds/";
var imagePath = settings.BASE_PATH + "/images/reward/";

var rewardClient = function(){
    
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
            },
            {
                name: "confetti",
                file: settings.BASE_PATH + "/particles/rewardScreen/confetti/Conffeti_win.png",
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
            }
        ],
        jsons: [
		],
        particles: [
        ]
    }
    
    var TEAMS = {
		1:{
			name: "Equipo Alpha",
            side: 1,
            color: 1,
            coupSkin: "bravo",
            appear: "appear_alpha",
            index:0,
            pivot: 0
		},
		2:{
			name: "Equipo Bravo",
            side: -1,
            color: 2,
            coupSkin: "alfa",
            appear: "appear_delta",
            index:0,
            pivot: 1
		},
    }
    
    var DEFAULT_NUMTEAM = 1
    
    var WIN_DATA
    var LOSE_DATA
    var COUP_X = [0.75, 1.25]
    var WIN_SCALES = [0.8, 0.9, 0.8]

    var sceneGroup
    var tile
    var winnerGroup
    var loserGroup
    var teams
    var cliente
    var indexWinner

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        loadSounds()

        cliente = parent.cliente || {}
        var winnerTeam = indexWinner || DEFAULT_NUMTEAM
        var loseTeam = winnerTeam === 1 ? 2 : 1
        WIN_DATA = TEAMS[winnerTeam]
        WIN_DATA.index = winnerTeam
        LOSE_DATA = TEAMS[loseTeam]
        LOSE_DATA.index = loseTeam
    }
    
    function preload(){
        game.stage.disableVisibilityChange = true;
    }

    function update(){
        tile.tilePosition.x -= 0.4
        tile.tilePosition.y -= 0.4
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
        //tile.anchor.setTo(0.5)
        tile.tint = 0x0099AA
        //tile.angle = 45
        sceneGroup.add(tile)
    }

    function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var border = WIN_DATA.color - 1

		teamBar = sceneGroup.create(game.world.width * border, 30, "atlas.reward", "teamBar" + WIN_DATA.color)
		teamBar.anchor.setTo(border, 0)
		//teamBar.scale.setTo(0.8)

		var text = new Phaser.Text(sceneGroup.game, 320, 25, WIN_DATA.name, fontStyle)
		text.anchor.setTo(0.5, 0)
		text.stroke = "#000066"
		text.strokeThickness = 10
		//text.alpha = 0
		text.x *= WIN_DATA.side
		teamBar.addChild(text)
		teamBar.text = text
    }
    
    function createCoup(){

        var coup = game.add.spine(0, game.world.height - 70, "coup")
        coup.x = COUP_X[WIN_DATA.index] * game.world.centerX
        coup.scale.setTo(0.8)
        coup.setSkinByName(WIN_DATA.coupSkin)
        coup.setAnimationByName(0,"idle", false)
        var anim = coup.addAnimationByName(0, "win", false)
            anim.onStart = function(){
                sound.play("shineSpell")
            }
            anim.onComplete = function(){
                appearWiners()
                apearLosers()
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

        var winers = teams[WIN_DATA.index].players
        
        for(var i = 0; i < winers.length; i++){

            var obj = winers[i]
            var player = spineLoader.createSpine(obj.avatar, obj.skin, "gg", 0, 0, true)
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

        var side = LOSE_DATA.pivot
        var pivotX = 85 * LOSE_DATA.side
        var pivotY = 0.25
        var offsetX = 40 * LOSE_DATA.side
        var DIRECTION = LOSE_DATA.side
        var SCALE = 0.7
        var losers = teams[LOSE_DATA.index].players

        for(var i = 0; i < losers.length; i++){

            var subGroup = game.add.group()
            subGroup.x = (game.world.width * side) + pivotX
            subGroup.y = game.world.centerY * pivotY
            subGroup.scale.setTo(DIRECTION, 1)
            subGroup.alpha = 0
            loserGroup.add(subGroup)

            var frame = subGroup.create(0, 0, "atlas.reward", "ventanaFondo")
            frame.anchor.setTo(0, 0.5)

            var obj = losers[i]

            var player = spineLoader.createSpine(obj.avatar, obj.skin, "gg", frame.width * 0.65, frame.height * 1.1, true)
            player.scale.setTo(SCALE)
			player.setAlive(false)
            subGroup.add(player)
            subGroup.anim = player

            var mask = game.add.graphics(50, -160)
            mask.beginFill(0xffffff)
            mask.drawRect(0, 0, frame.width, frame.height * 1.5)
            player.mask = mask
            player.addChild(mask)

            subGroup.create(-2, frame.height * 0.47, "atlas.reward", "ventanaFrente")
            
            pivotX -= offsetX
            pivotY += 0.45
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
            game.add.tween(player).from({x: posX, y:player.y + 200}, delay, Phaser.Easing.Cubic.InOut, true)
            delay += 500
        }
    }

    function createConfetti(){

        var confetti = game.add.emitter(game.world.centerX, 0, 50)
        confetti.makeParticles("confetti")
        confetti.gravity = 10
        confetti.maxParticleSpeed.setTo(0, 500)
        confetti.minParticleSpeed.setTo(0, 200)
        confetti.width = game.world.width
        confetti.height = 0
        confetti.forEach(function(element) {
            element.tint = getRandomColor()
        });
        confetti.start(false, 5000, 100, 0) 
        sceneGroup.add(confetti)
    }

    function getRandomColor(){

        var letters = '0123456789ABCDEF'
        var color = '0x'
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    return {
        assets: assets,
        name: "rewardClient",
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
            createConfetti()
            
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
			teams = myTeams
		},
        setWinner: function(winner){
            indexWinner = winner
        },
        shutdown: function () {
            sceneGroup.destroy()
		}
    }
}()