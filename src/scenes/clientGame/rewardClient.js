
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
    
    var bootFiles = {
		jsons: [
			//{
				//name: "sounds",
				//file: settings.BASE_PATH + "/data/sounds/tournament.json"
			//},
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
                name: "atlas.reward",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
            },
            {
				name: "atlas.yogoSelector",
				json: settings.BASE_PATH + "images/teamSelector/atlas.json",
				image: settings.BASE_PATH + "images/teamSelector/atlas.png",
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
                file: settings.BASE_PATH + "/sounds/sounds/shineSpell.mp3"
            },
            {
                name: "song",
                file: soundsPath + "winBattle1.mp3"
            },
            {
                name: "cheers",
                file: soundsPath + "cheers.mp3"
            },
            {
                name: "goldShine",
                file: soundsPath + "goldShine.mp3"
            },
            {
                name: "bright",
                file: soundsPath + "brightTransition.mp3"
            },
            {
                name: "rewardSong",
                file: settings.BASE_PATH + "/sounds/songs/reward.mp3",
            }
        ],
        spines:[
            {
                name:"coup",
                file:settings.BASE_PATH + "/spines/reward/brain/pantalla_victoria.json"
            }
        ],
        jsons: [
			{
				name: "sounds",
				file: settings.BASE_PATH + "/data/sounds/tournament.json"
			},
		],
        particles: [
            {
                name: "brain_particles",
                file: settings.BASE_PATH + "/particles/rewardScreen/brain_particles/sphere_ligths1.json",
                texture: "sphere_ligths1.png"
            },
            {
                name: "brain_particlesB",
                file: settings.BASE_PATH + "/particles/rewardScreen/brain_particles/Ligth_Brain.json",
                texture: "Ligth_Brain.png"
            },
            {
                name: "confetti",
                file: settings.BASE_PATH + "/particles/rewardScreen/confetti/Conffeti_win.json",
                texture: "Conffeti_win.png"
            }
        ]
    }
    
    var TEAMS = [
		{
			name: "Equipo Alpha",
            side: 1,
            color: 1,
            coupSkin: "bravo",
            appear: "appear_alpha",
            index:0,
            pivot: 0
		},
		{
			name: "Equipo Bravo",
            side: -1,
            color: 2,
            coupSkin: "alfa",
            appear: "appear_delta",
            index:0,
            pivot: 1
		},
    ]
    
    var DEFAULT_NUMTEAM = 0
    var TEAM_MEMBERS = 3
    
    var WIN_DATA
    var LOSE_DATA

    var sceneGroup
    var tile
    var rewardSong
    var winnerGroup
    var loserGroup
    var players
    var cliente

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        loadSounds()

        cliente = parent.cliente || {}
        var numTeam = cliente.numTeam || DEFAULT_NUMTEAM
        var otherTeam = numTeam == 0 ? 1 : 0
        WIN_DATA = TEAMS[numTeam]
        WIN_DATA.index = numTeam
        LOSE_DATA = TEAMS[otherTeam]
        LOSE_DATA.index = otherTeam
    }
    
    function preload(){
        game.stage.disableVisibilityChange = false;
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
        
        tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile");
        tile.anchor.setTo(0.5);
        tile.tint = 0x0099AA;
        tile.angle = 45;
        sceneGroup.add(tile);
    }

    function createTeamBar(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}

		var border = WIN_DATA.color - 1

		teamBar = sceneGroup.create(game.world.width * border, 30, "atlas.yogoSelector", "teamBar" + WIN_DATA.color)
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

        var posX = WIN_DATA.color == 1 ? 0.75 : 1.25

        var coup = game.add.spine(game.world.centerX, game.world.height - 70, "coup")
        coup.scale.setTo(0.8)
        coup.x *= posX
        coup.setSkinByName(WIN_DATA.coupSkin)
        coup.setAnimationByName(0,"idle", false)
        var anim = coup.addAnimationByName(0, "win", false)
            anim.onStart = function(){
                sound.play("shineSpell")
            }
            anim.onComplete = function(){
                rewardSong = sound.play("rewardSong", {loop:true, volume:0.6})
                appearWiners()
                apearLosers()
            }
        coup.addAnimationByName(0, "winstill", true)
        sceneGroup.add(coup)
        sceneGroup.coup = coup
    }

    function createWinTeam(){

        var WIN_SCALES = [0.8, 0.9, 0.8]

        winnerGroup = game.add.group()
        sceneGroup.add(winnerGroup)

        var pivotX = WIN_DATA.color == 1 ? 0.5 : 0.7
        var RISE = 1 - pivotX
        var directon = -1

        for(var i = 0; i < TEAM_MEMBERS; i++){

            var obj = players[WIN_DATA.index][i]
            var player = spineLoader.createSpine(obj.name, obj.skin, "wait", 0, 0, true)
			player.x = sceneGroup.coup.centerX * pivotX
            player.y = sceneGroup.coup.centerY - 100
            player.scale.setTo(WIN_SCALES[i] * directon, WIN_SCALES[i])
			player.setAlive(false)
            winnerGroup.add(player)
            
            pivotX += RISE
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

        for(var i = 0; i < TEAM_MEMBERS; i++){

            var subGroup = game.add.group()
            subGroup.x = (game.world.width * side) + pivotX
            subGroup.y = game.world.centerY * pivotY
            subGroup.alpha = 0
            loserGroup.add(subGroup)

            var frame = subGroup.create(0, 0, "atlas.reward", "ventanaFondo")
            frame.anchor.setTo(side, 0.5)

            var obj = players[LOSE_DATA.index][i]

            var player = spineLoader.createSpine(obj.name, obj.skin, "gg", frame.width * 0.65, frame.height * 1.1, true)
            player.scale.setTo(DIRECTION * SCALE, SCALE)
			player.setAlive(false)
            subGroup.add(player)
            subGroup.anim = player

            var mask = game.add.graphics(50, -160)
            mask.beginFill(0xffffff)
            mask.drawRect(0, 0, frame.width, frame.height * 1.5)
            player.mask = mask
            player.addChild(mask)

            var lowBar = subGroup.create(-2 * LOSE_DATA.side, frame.height * 0.47, "atlas.reward", "ventanaFrente")
            lowBar.anchor.setTo(side, 0)
            
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

    function createParticles(){

        game.time.events.add(2000,function(){
            sound.play("bright");
            createEmitterParticles("brain_particles", coupSpine.x + 3, coupSpine.y - 500,brainGroup);
            createEmitterParticles("brain_particlesB",coupSpine.x -10,coupSpine.y - 620,brainGroupBack);
        },this);

        game.time.events.add(3000,function(){
            sound.play("song");
            createEmitterParticles("confetti",game.world.centerX,0,null);
            sound.play("cheers");
            //rewardSong = sound.play("music", {loop:true, volume:0.4});
            for(var j=0; j<3; j++)
                squareLoser[j].children[0].setAlive(true)
        },this);
    }

    function createEmitterParticles(name, x, y, group){
        var prefabParticles = epicparticles.newEmitter(name);
        prefabParticles.x = x;
        prefabParticles.y = y;
        if(group!=null){
            group.add(prefabParticles);
        }
    }

    //Appear losers in their squares with animation
    function addLosersTween(){
        loseColocation = 150;
        for(var j=0; j<3; j++){
            game.add.tween(squareLoser[j]).to({ x: loseColocationX, y: loseColocation }, 5000, Phaser.Easing.Sinusoidal.Out, true);
            game.add.tween(closeSquare[j]).to({ x: loseColocationX - 2, y: loseColocation + squareLoser[j].height - 5 }, 5000, Phaser.Easing.Sinusoidal.Out, true);
            loseColocationX += 50;
            loseColocation += squareLoser[j].height + 10;
        }
        game.time.events.add(Phaser.Timer.SECOND * 10, showInformation, this);
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
            createTeamBar()
            createCoup()
            createWinTeam()
            createLoseTeam()
            
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
			// for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
			// 	var team = myTeams[teamIndex]

			// 	for(var charIndex = 0; charIndex < team.length; charIndex++){
			// 		var character = team[charIndex]
			// 		setCharacter(character.name, teamIndex)
			// 	}
			// }
		},
        setWinner: function(winner){
            INDEX_WINNER = winner
        },
        shutdown: function () {
            sceneGroup.destroy()
		}
    }
}()