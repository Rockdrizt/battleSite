
var playerScreen = function(){

	var soundsPath = "../../shared/minigames/sounds/"

	var bootFiles = {
		jsons: [
			// {
			// 	name: "sounds",
			// 	file: settings.BASE_PATH + "/data/sounds/tournament.json"
			// },
		],
		characters: [
		]
	}
    
	var assets = {
        atlases: [
            {   
                name: "atlas.player",
                json: settings.BASE_PATH + "/images/yogoSelector/atlas.json",
                image: settings.BASE_PATH + "/images/yogoSelector/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: settings.BASE_PATH + "/images/startScreen/bgTile.png",
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

	var PLAYER_DATA

	var sceneGroup
    var tile
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#0D014D"
        loadSounds()
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
    }
    
	function createBackground(){
		
        var bmd = game.add.bitmapData(game.world.width, game.world.height)
        var back = bmd.addToWorld()

        var y = 0

        for (var i = 0; i < bmd.height; i++)
        {
            var color = Phaser.Color.interpolateColor(0xF7EBAF, 0xF3CC09, bmd.height, i)

            bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
            y += 2
        }
        sceneGroup.add(back)
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.width, "tile")
		tile.tint = 0x00FFFF
		tile.alpha = 0.2
		sceneGroup.add(tile)
	}
	
    
	function update(){
        tile.tilePosition.y -= 0.4
    }
	
	function createTeamMember(){

		var teamMate = createYogoToken()
		teamMate.x = game.world.centerX
		teamMate.y = game.world.centerY + 50
		teamMate.scale.setTo(2)
		sceneGroup.add(teamMate)
	}

	function createYogoToken(){
		
		var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#FC1E79", align: "center", stroke : "#FFFFFF", strokeThickness : 15}
		//000066
		var memberGroup = game.add.group()

		var token = memberGroup.create(0, 0, "atlas.player", "token0")
        token.anchor.setTo(0.5)

		var kidName = new Phaser.Text(memberGroup.game, 0, -170, PLAYER_DATA.kid, fontStyle)
		kidName.anchor.setTo(0.5)
		memberGroup.add(kidName)
		memberGroup.kidName = kidName
		

		var yogoName = new Phaser.Text(memberGroup.game, 0, 150, PLAYER_DATA.yogo, fontStyle)
		yogoName.anchor.setTo(0.5)
		yogoName.fill = "#00D8FF"
		memberGroup.add(yogoName)
		memberGroup.yogoName = yogoName
		
		var yogo = memberGroup.create(-2, 53, "atlas.player", getYogoNumber(PLAYER_DATA.yogo))

		yogo.anchor.setTo(0.5, 1)
		memberGroup.yogo = yogo

		return memberGroup
	}

	function getYogoNumber(name){

		var NAMES_LIST = ["Tomiko", "Luna", "Nao", "Theffanie", "Eagle", "Dinamita", "Arthurius", "Estrella"] 
		var index = NAMES_LIST.indexOf(name)

		return "yogo" + index
	}

	return {
		assets: assets,
        bootFiles:bootFiles,
		name: "playerScreen",
		update: update,
        preload:preload,
        render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){
            
            sceneGroup = game.add.group()

            initialize()
			createBackground()
			createTeamMember()
		},
        setTeams: function (player) {
			PLAYER_DATA = player
		},
		shutdown: function () {
			sceneGroup.destroy()
		}
	}
}()