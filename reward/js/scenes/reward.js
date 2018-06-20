
var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/reward/";

var reward = function(){
    
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
    

	assets = {
        atlases: [
            {   
                name: "atlas.reward",
                json: imagePath + "/atlas.json",
                image: imagePath + "atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: imagePath + "bgTile.png",
            },
            {
                name: "blueCup",
                file: imagePath + "copaAzul.png",
            },
            {
                name: "pinkCup",
                file: imagePath + "copRosa.png",
            },
            {
                name: "blueBrain",
                file: imagePath + "brainAzul.png",
            },
            {
                name: "pinkBrain",
                file: imagePath +"brainRosa.png",
            },
            {
                name: "grayCup",
                file: imagePath +"copa_Gris.png",
            }
		],
		sounds: [],
        spritesheets: [],
        spines:[]
    }
    
     //////////////////
    // Variables
    //////////////////
    //General variables
	var sceneGroup;                         //General group of all scene
    var tile;                               //Reference of tile background
    //Own variables
    var loseColocation;                     //Position to colocate the window of players in y
    var loseColocationX;                    //Position to colocate the window of player in x
    var indexWinner;                        //Id of winner team
    var squareLoser;                        //Reference at squares of losers
    var closeSquare;                        //Reference at a line of squares
    var title;                              //Reference of title's information
    var textTitle;                          //Reference of text
    
     //////////////////
    // Principal flow
    //////////////////
    //To load all sounds
	function loadSounds(){
		sound.decode(assets.sounds);
	}

    //To start some variables and start flow
	function initialize(){
        game.stage.backgroundColor = "#ffffff";
        loseColocation = 150;
        loseColocationX = game.width - 550;
        squareLoser = [];
        closeSquare = [];
        indexWinner = 0;
        title = [];
        textTitle = ["Tiempo: 25 min", "Aciertos: 29"]

        loadSounds();
	}
    
    //Load or change configurations
    function preload(){
        game.stage.disableVisibilityChange = false;
    }

    //Complete GamePlay update
	function update(){
        // tile.tilePosition.x -= 0.4
        // tile.tilePosition.y -= 0.4
    }

    //////////////////
    // Own flow
    //////////////////
    //Create  principal background
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

    //Create elements for the screen
    function createScenary(){
        var cupPlayer;
        var namePlayer;
        var brainPlayer;
        var tweenCup;
        if(indexWinner == 0){
            cupPlayer = "blueCup";
            namePlayer = "equipoAzul";
            brainPlayer = "blueBrain";
        }else{
            cupPlayer = "pinkCup";
            namePlayer = "equipoRosa";
            brainPlayer = "pinkBrain"
        }
        console.log("Entre");
        var cup = game.add.sprite(50, game.height/2 - 350, cupPlayer);
        cup.blendMode = PIXI.blendModes.MULTIPLY;
        sceneGroup.add(cup);

        var cupGray = game.add.sprite(50, game.height/2 - 350, "grayCup");
        sceneGroup.add(cupGray);

        var brainWin = game.add.sprite(cup.x + 450, game.height/2 - 600, brainPlayer);
        brainWin.alpha = 0;
        sceneGroup.add(brainWin);

        for(var i=0; i<3; i++){
            squareLoser.push(game.add.sprite(loseColocationX, -300,"atlas.reward","ventanaFondo"));
            sceneGroup.add(squareLoser[i]);
            loseColocationX += 50;
            closeSquare.push(game.add.sprite(squareLoser[i].x - 2, squareLoser[i].y + squareLoser[i].height - 5,"atlas.reward","ventanaFrente"));
         }

        for(var x=0; x<2; x++){
            title.push(game.add.sprite((game.width + 650)+ (100*x), (150 * (x+0.5)),"atlas.reward", "barraAmarilla"));
            var style = { font: "50px Arial", fill: "#0D014D" , align: "center", fontWeight: "bold"};  
            var textTemp = game.add.text(0, 0, textTitle[x], style);
            textTemp.position.setTo(132 + ((354/2) - textTemp.width/2), title[x].height/2 - textTemp.height/2);
            title[x].addChild(textTemp);
            title[x].text = textTemp; 
            sceneGroup.add(title[x]);
        }

        var nameWin = game.add.sprite(-500, 50,"atlas.reward", namePlayer);
        sceneGroup.add(nameWin);
        var tweenNameWin = game.add.tween(nameWin).to({ x: 0 }, 2000, Phaser.Easing.Bounce.Out, true, 0, 0);
        tweenNameWin.onComplete.add(function(){
            game.add.tween(cupGray).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.Out, true, 0, 0);
            tweenCup = game.add.tween(cup).to({ blendMode: PIXI.blendModes.NORMAL }, 2000, Phaser.Easing.Linear.Out, true, 0, 0);
            game.add.tween(brainWin).to({ alpha: 1 }, 300, Phaser.Easing.Bounce.InOut, true, 0, 6);
            tweenCup.onComplete.add(function(){
                game.add.tween(brainWin).to({ y: -35 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1,true, 2000);
                for(var j=0; j<3; j++){
                    game.add.tween(squareLoser[j]).to({ y: loseColocation }, 3000, Phaser.Easing.Bounce.Out, true, 0, 0);
                    game.add.tween(closeSquare[j]).to({ y: loseColocation + squareLoser[j].height - 5 }, 3000, Phaser.Easing.Bounce.Out, true, 0, 0);
                    loseColocation += squareLoser[j].height + 10;
                }
                game.time.events.add(Phaser.Timer.SECOND * 6, showInformation, this);
            });
        });
    }

    //Show the last information about game
    function showInformation(){
        for(var k=0; k<3; k++){
            game.add.tween(squareLoser[k]).to({ x: squareLoser[k].x+600, y: squareLoser[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
            game.add.tween(closeSquare[k]).to({ x: closeSquare[k].x+600, y: closeSquare[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
        for(var l=0; l<2; l++){
            game.add.tween(title[l]).to({ x: (game.width - 650)+(100*l) }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
    }
    
    //////////////////
    // Return all game, configurations and creations
    //////////////////
	return {
		assets: assets,
		name: "reward",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group();
			
			createBackground();	
            initialize();
            createScenary();
		}
	}
}()