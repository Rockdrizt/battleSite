
var soundsPath = "../../shared/minigames/sounds/"

var result = function(){
    
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
                name: "atlas.result",
                json: "images/result/atlas.json",
                image: "images/result/atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: "images/result/bgTile.png",
            }
		],
		sounds: [
		],
        spritesheets: [
        ],
        spines:[
		],
        particles: [
			{
				name: 'horizontalLine',
				file: 'particles/horizontalLine/intence_horison_ligth.json',
				texture: 'intence_horison_ligth.png'
			},
			{
				name: 'dot',
				file: 'particles/particlesHorizontal/particle_horison_ligth.json',
				texture: 'particle_horison_ligth.png'
			}
		]
    }
    
    var SIDES = {
		LEFT:{direction: -1, scale:{x:1}},
		RIGHT:{direction: 1, scale:{x:-1}},
	}
    
	var ORDER_SIDES = [SIDES.LEFT, SIDES.RIGHT]
    
    var teams
    var kids
    var resultSong
	var resultGroup
    var tile
    var fontStyle
    var teamsGroup
    
    var bmd
    var innerCircle
    var outerCircle
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#0D014D"
        loadSounds()
        fontStyle = {font: "65px skwig", fontWeight: "bold", fill: "#FFFFFE", align: "center"}
	}
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
        game.load.bitmapFont('skwig', 'images/fonts/font.png', 'images/fonts/font.fnt')
    }
    
	function createBackground(){
        
        var bmd = game.add.bitmapData(game.world.width, game.world.height)
        var back = bmd.addToWorld()

        var y = 0

        for (var i = 0; i < bmd.height; i++)
        {
            var color = Phaser.Color.interpolateColor(0x05072B, 0x0D014D, bmd.height, i)

            bmd.rect(0, y, bmd.width, y + 1, Phaser.Color.getWebRGB(color))
            y += 2
        }
        resultGroup.add(back)
        
        tile = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width + 150, game.world.width + 180, "tile")
        tile.anchor.setTo(0.5)
        tile.tint = 0x0099AA
        tile.angle = 45
        resultGroup.add(tile)
        
        var text = game.add.bitmapText(game.world.centerX, 100, 'skwig', "Resultados", 100)
        text.anchor.setTo(0.5)
        resultGroup.add(text)
        
        for(var i = 0; i < 2; i++){
            
            var img = resultGroup.create(game.world.width * i, 30, "atlas.result", "teamBar" + i)
            img.anchor.setTo(i, 0)
            img.scale.setTo(0.9)
            
            var text = game.add.bitmapText(320, 25, 'skwig', "Equipo Alpha", 80)
            text.anchor.setTo(0.5, 0)
            //text.alpha = 0
            img.addChild(text)
            img.text = text
        }
        text.x *= -1
        text.setText("Equipo Bravo")
        
//        for(var j = 0; j < 2; j++){
//            
//            var logo = resultGroup.create(game.world.centerX, game.world.height - 50, "atlas.result", "logo" + j)
//            logo.anchor.setTo(j, 1)
//        }
    }
    
	function update(){
        tile.tilePosition.y -= 0.4
        tile.tilePosition.x -= 0.4
        epicparticles.update()
        
//        var grd = bmd.context.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, outerCircle.x, outerCircle.y, outerCircle.radius);
//        grd.addColorStop(0, '#8ED6FF');
//        grd.addColorStop(1, '#FF3FA2');
//
//        bmd.cls();
//        bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);
    }
    
    function createTimeToken(){
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#444444", align: "center"}
        
        var timeToken = resultGroup.create(game.world.centerX, 320, "atlas.result", "timeToken")
        timeToken.anchor.setTo(0.5)
        
        var text = new Phaser.Text(resultGroup.game, 0, -5, "3:00", fontStyle)
        text.anchor.setTo(0.5)
        timeToken.addChild(text)
        timeToken.text = text
    }
    
    function createTeamsResults(){
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#444444", align: "center"}
        
        teamsGroup = game.add.group()
        resultGroup.add(teamsGroup)
    
        for(var j = 0; j < 2; j++){
            
            var teamG = game.add.group()
            teamsGroup.add(teamG)
            
            var side = ORDER_SIDES[j].scale.x
            var pivotX = (game.world.width * j) + (140 * side)
            var pivotY = 0.75
            
            for(var i = 0; i < 3; i++){

                var yogoGroup = game.add.group()
                yogoGroup.x = pivotX
                yogoGroup.y = game.world.centerY * pivotY
                teamG.add(yogoGroup)
                
                var shine = yogoGroup.create(0, 0, "atlas.result", "light" + j)
                shine.anchor.setTo(0.5, 1)
                shine.scale.setTo(1,0)
                yogoGroup.shine = shine

                var token = yogoGroup.create(0, 0, "atlas.result", "token" + j)
                token.anchor.setTo(0.5)
                
                var nameBoard = yogoGroup.create(0, 160, "atlas.result", "nameBoard")
                nameBoard.anchor.setTo(0.5, 1)
                nameBoard.scale.setTo(-side * 0.5, 0.5)
                
//                var nameTxt = new Phaser.Text(yogoGroup.game, -80 * side, 140, "Homero", fontStyle)
//                nameTxt.anchor.setTo(j,0.5)
//                yogoGroup.add(nameTxt)
//                nameBoard.txt = nameTxt
                
                var nameTxt = new Phaser.Text(yogoGroup.game, 0, -50, kids[j][i], fontStyle)
                nameTxt.anchor.setTo(0.5)
                nameTxt.scale.setTo(-side, 1)
                nameBoard.addChild(nameTxt)
                nameBoard.txt = nameTxt
                
                var yogo = yogoGroup.create(0, 30, teams[j][i])
                yogo.anchor.setTo(0.5, 1)
                yogo.scale.setTo(0.5)
                yogo.team = j
                yogo.kid = i
                yogo.turn = 0
                yogo.changeYogo = changeYogo.bind(null, yogo)
                yogoGroup.yogo = yogo
                
                pivotY += 0.35
            }
            
            var bubble = teamG.create(game.world.centerX * 0.7, game.world.centerY + 50, "atlas.result", "score" + j)
            bubble.anchor.setTo(0.5)
            
            var score = new Phaser.Text(teamG.game, 0, 50, "99", fontStyle)
            score.anchor.setTo(0.5)
            score.scale.setTo(1.3)
            score.fill = "#FFFFFF"
            bubble.addChild(score)
            bubble.score = score
            
            teamG.children[1].x += 230 * side
        }
        bubble.x = game.world.centerX * 1.3
    }
    
    function changeYogo(yogo){
        
        var scaleDown = game.add.tween(yogo.scale).to({x: 0}, 400, Phaser.Easing.Cubic.Out, true)
        scaleDown.onComplete.add(function(){
            if(yogo.turn == 0){
                var size = 0.03
                yogo.loadTexture(kids[yogo.team][yogo.kid])
                yogo.scale.setTo(0, size)
                yogo.turn = 1
            }
            else{
                var size = 0.5
                yogo.loadTexture(teams[yogo.team][yogo.kid])
                yogo.scale.setTo(0, size)
                yogo.turn = 0
            }
            
            game.add.tween(yogo.scale).to({x: size}, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                game.time.events.add(5000, changeYogo, null, yogo)
            })
        })
    }
    
    function createVS(){
        
        var light = resultGroup.create(game.world.centerX, game.world.centerY + 40, "atlas.result", "pinkLight")
        light.anchor.setTo(0.5)
        light.scale.setTo(0)
        resultGroup.light = light
        
        var VS = resultGroup.create(light.x, light.y, "atlas.result", "vs")
        VS.anchor.setTo(0.5)
        VS.alpha = 0
        resultGroup.VS = VS
    }
    
    function animateScene(){
        
//        var emitter = epicparticles.newEmitter("horizontalLine")
//        emitter.x = game.world.centerX
//        emitter.y = game.world.centerY + 40
        
        var dots = epicparticles.newEmitter("dot")
        dots.x = game.world.centerX
        dots.y = game.world.centerY + 40
        
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
			file: "images/result/" + character + ".png",
		}
		assets.images.push(charObj)
	}
    
    function circle(){
        
        bmd = game.make.bitmapData(800, 600);

        //  Add it to the world or we can't see it
        bmd.addToWorld();

        //  Create the Circles
        innerCircle = new Phaser.Circle(200, 200, 100);
        outerCircle = new Phaser.Circle(200, 200, 300);

        game.add.tween(innerCircle).to( { x: 100, y: 100, radius: 1 }, 3000, "Sine.easeInOut", true, 0, -1, true);

    }

	return {
		
		assets: assets,
        bootFiles:bootFiles,
		name: "result",
		update: update,
        preload:preload,
        render:function () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		},
		create: function(event){
            
            resultGroup = game.add.group()

            initialize()
            createBackground()
            createTimeToken()
            createTeamsResults()
            createVS()
            animateScene()
            circle()
            
		},
        setCharacter:setCharacter,
        setTeams: function (myTeams) {
			teams = myTeams
			for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
				var team = myTeams[teamIndex]

				for(var charIndex = 0; charIndex < team.length; charIndex++){
					var character = team[charIndex]
					setCharacter(character)
				}
			}
            kids = [["Tino", "Pawel", "Rulas"], ["Rock", "Cherry", "Humbert"]]
            for(var i = 0; i < kids.length; i++){
                for(var j = 0; j < kids[i].length; j++)
                    setCharacter(kids[i][j])
            }
		}
	}
}()