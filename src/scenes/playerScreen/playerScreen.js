
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
                json: settings.BASE_PATH + "/images/yogoSelector/portraits/atlas.json",
                image: settings.BASE_PATH + "/images/yogoSelector/portraits/atlas.png",
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

	var NAMES_LIST = ["tomiko", "luna", "nao", "theffanie", "eagle", "dinamita", "arthurius", "estrella"]
	var X_OFFSETS = [-30, 0, 0, 10, 0, 0, 0, 10]
    var X_SCALES = [1, 1, -1, -1, 1, 1, -1, -1]

	var sceneGroup
    var tile
	var teamMate
    
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

		teamMate = createYogoToken()
		teamMate.x = game.world.centerX
		teamMate.y = game.world.centerY - 50
		teamMate.scale.setTo(2)
		sceneGroup.add(teamMate)
	}

	function updateYogoInfo(data) {
		console.log(data)

		if(typeof data.avatar !== "string")
			return

        var side = data.numTeam == 1 ? 1 : -1
		teamMate.kidName.text = data.nickname
		var avatar = data.avatar
		teamMate.yogoName.text = avatar[0].toUpperCase() + avatar.slice(1)

		if(teamMate.yogo) teamMate.yogo.destroy()

		var yogoInfo = getYogoInfo(data.avatar)
		var yogo = teamMate.create(yogoInfo.offsetX - 2, 53, "atlas.player", data.skin)//yogoInfo.name)
		yogo.anchor.setTo(0.5, 1)
        yogo.scale.setTo(yogoInfo.scaleX * side, 1)
		teamMate.yogo = yogo
	}

	function createYogoToken(){
		
		var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#FC1E79", align: "center", stroke : "#000066", strokeThickness : 15}

		var memberGroup = game.add.group()

		var token = memberGroup.create(0, 0, "atlas.player", "token")
        token.anchor.setTo(0.5)

		var kidName = new Phaser.Text(memberGroup.game, 0, -170, "", fontStyle)
		kidName.anchor.setTo(0.5)
		memberGroup.add(kidName)
		memberGroup.kidName = kidName

		var yogoName = new Phaser.Text(memberGroup.game, 0, 150, "", fontStyle)
		yogoName.anchor.setTo(0.5)
		yogoName.fill = "#00D8FF"
		memberGroup.add(yogoName)
		memberGroup.yogoName = yogoName
		
		//updateYogoInfo(memberGroup)

		return memberGroup
	}

	function getYogoInfo(name){

		var index = NAMES_LIST.indexOf(name)
		var offsetX = X_OFFSETS[index]
        var scaleX = X_SCALE[index]

		return {
			name: "yogo" + index,
			offsetX:offsetX,
            scaleX:scaleX
		}
	}

	function initializeService() {
		var hashValue = window.location.hash.substr(1);
		var arrValues = hashValue.split("/")
		var idGame = arrValues[0]
		var numTeam = arrValues[1]
		var numPlayer = arrValues[2]

		var playerService = new PlayerService()
		playerService.start(idGame, numTeam, numPlayer, updateYogoInfo)
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

			initializeService()
		},
		shutdown: function () {
			sceneGroup.destroy()
		}
	}
}()