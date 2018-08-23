
var soundsPath = "../../../shared/minigames/sounds/";
var imagePath = "/images/reward/";

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
                json: imagePath + "/atlas.json",
                image: imagePath + "atlas.png",
            }
        ],
        images: [
            {
                name: "tile",
                file: imagePath + "bgTile.png",
            }
        ],
        sounds: [
            {
                name: "song",
                file: soundsPath + "winBattle1.mp3"
            },
            {
                name: "cheers",
                file: soundsPath + "cheers.mp3"
            },
            {
                name: "gold",
                file: soundsPath + "goldShine.mp3"
            },
            {
                name: "bright",
                file: soundsPath + "brightTransition.mp3"
            },
            {
                name: "sword",
                file: soundsPath + "swordSmash.mp3"
            },
            {
                name: "music",
                file: soundsPath + "/songs/weLoveElectricCars.mp3"
            }
        ],
        spines:[
            {
                name:"coup",
                file:"/spines/reward/brain/pantalla_victoria.json"
            }
        ],
        jsons: [
			{
				name: "sounds",
				file: "data/sounds/tournament.json"
			},
		],
        particles: [
            {
                name: "brain_particles",
                file: "/particles/rewardScreen/brain_particles/sphere_ligths1.json",
                texture: "sphere_ligths1.png"
            },
            {
                name: "brain_particlesB",
                file: "/particles/rewardScreen/brain_particles/Ligth_Brain.json",
                texture: "Ligth_Brain.png"
            },
            {
                name: "confetti",
                file: "/particles/rewardScreen/confetti/Conffeti_win.json",
                texture: "Conffeti_win.png"
            }
        ]
    }
    
     //////////////////
    // Variables
    //////////////////
    //General variables
    var sceneGroup;                         //General group of all scene
    var tile;                               //Reference of tile background
    //Own variables
    var COUPOFFSETX = 820;                  //Offset to collocate the coup in X
    var loseColocation;                     //Position to colocate the window of players in y
    var loseColocationX;                    //Position to colocate the window of player in x
    var INDEX_WINNER;                        //Id of winner team (0: Blue, 1: Pink)
    var squareLoser;                        //Reference at squares of losers
    var closeSquare;                        //Reference at a line of squares
    var title;                              //Reference of title's information
    var textTitle;                          //Reference of text
    var winnerColocationX;                  //Arrays in X winners
    var winnerColocationY;                  //Arrays in Y winners
    var winnerScale;                        //Scale for any winner
    var scaleOrder;                         //Direction of any winner or loser
    var players;                            //Array of characters
    var coupSpine;                          //Reference of coup
    var brainGroup;                         //Reference of group to put particles in brain
    var brainGroupBack;                     //Reference of group to put particles in brainBack
    
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
        loseColocationX = game.width - 550;
        squareLoser = [];
        closeSquare = [];
        //INDEX_WINNER = 0;   //*****Change this to set the winners
        title = [];
        textTitle = ["Tiempo: 25 min", "Aciertos: 29"];
        winnerColocationX = [420,860,1280];
        winnerColocationY = [680,735,680];
        winnerScale = [0.85,1,0.8];
        scaleOrder = [-1,1,1];

        loadSounds();
    }
    
    //Load or change configurations
    function preload(){
        game.stage.disableVisibilityChange = false;
    }

    //Complete GamePlay update
    function update(){
        tile.tilePosition.x -= 0.4;
        tile.tilePosition.y -= 0.4;
        epicparticles.update();
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

    //Create spines in scene
    function createSpineScenary(){
        brainGroupBack = game.add.group();
        sceneGroup.add(brainGroupBack);

        coupSpine = game.add.spine(0,0,"coup");
        coupSpine.x = COUPOFFSETX;
        coupSpine.y = game.height - coupSpine.height/2 - 25;
        coupSpine.scale.setTo(0.95,0.95);
        if(INDEX_WINNER == 0){
            coupSpine.setSkinByName("alfa");
        }else{
            coupSpine.setSkinByName("bravo");
        }
        coupSpine.setAnimationByName(0,"idle", false);
        coupSpine.addAnimationByName(0, "win", false);
        coupSpine.addAnimationByName(0, "winstill", true);
        sceneGroup.add(coupSpine);
    }

    //Create particles and sounds in scene
    function createParticles(){

        game.time.events.add(1500,function(){
            sound.play("gold");
        },this);

        game.time.events.add(2000,function(){
            sound.play("bright");
            createEmitterParticles("brain_particles", coupSpine.x + 3, coupSpine.y - 500,brainGroup);
            createEmitterParticles("brain_particlesB",coupSpine.x -10,coupSpine.y - 620,brainGroupBack);
        },this);

        game.time.events.add(3000,function(){
            sound.play("song");
            createEmitterParticles("confetti",game.world.centerX,0,null);
            sound.play("cheers");
            sound.play("music", {loop:true, volume:0.4});
            for(var j=0; j<3; j++)
                squareLoser[j].children[0].setAlive(true)
        },this);

    }

    //Creator of particles emitter
    function createEmitterParticles(name, x, y, group){
        var prefabParticles = epicparticles.newEmitter(name);
        prefabParticles.x = x;
        prefabParticles.y = y;
        if(group!=null){
            group.add(prefabParticles);
        }
    }

    //Create elements for the screen
    function createScenary(){
        var namePlayer;
        if(INDEX_WINNER == 0){
            namePlayer = "equipoAzul";
        }else{
            namePlayer = "equipoRosa";
        }

        brainGroup = game.add.group();
        sceneGroup.add(brainGroup);

        loseColocation = game.height;
        for(var i=0; i<3; i++){
            squareLoser.push(game.add.sprite(game.width + 300, loseColocation,"atlas.reward","ventanaFondo"));
            sceneGroup.add(squareLoser[i]);
            closeSquare.push(game.add.sprite(game.width + 300 - 2, loseColocation + squareLoser[i].height - 5,"atlas.reward","ventanaFrente"));
            createSpineLoser(180,260,players[1][i].name,0.65*scaleOrder[i],0.65,squareLoser[i],players[1][i].skin);
            loseColocation += squareLoser[i].height + 10;
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

        var tweenNameWin = game.add.tween(nameWin).to({ x: 0 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0);
        tweenNameWin.onComplete.add(addLosersTween);

        for(var m=0; m<3; m++){
            createSpineWinner(winnerColocationX[m],winnerColocationY[m],players[0][m].name,winnerScale[m]*scaleOrder[m], winnerScale[m], players[0][m].skin);
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

    //Show the last information about game
    function showInformation(){
        for(var k=0; k<3; k++){
            game.add.tween(squareLoser[k]).to({ x: squareLoser[k].x+600, y: squareLoser[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true)
            game.add.tween(closeSquare[k]).to({ x: closeSquare[k].x+600, y: closeSquare[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
        sound.play("sword");
        for(var l=0; l<2; l++){
            game.add.tween(title[l]).to({ x: (game.width - 650)+(100*l) }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
        sound.play("cheers");
        
        for(var j=0; j<3; j++)
            squareLoser[j].children[0].setAlive(false)
    }

    //Load all winner characters in scene
    function createSpineWinner(x,y,name,scalex,scaley, skin) {

        var appear;

        if(INDEX_WINNER == 0){
            appear = "appear_delta";
        }else{
            appear = "appear_alpha";
        }

        var winnerSpine = loadSpineCharacter(x, y, name, scalex, scaley, skin, 0);
        sceneGroup.add(winnerSpine);

        game.time.events.add(game.rnd.integerInRange(2000,3000),function(){
                winnerSpine.setAnimation([appear,"win"], true);
                winnerSpine.alpha=1;
                winnerSpine.setAlive(true)
        },this);

    }

    //Load all lossers in scene
    function createSpineLoser(x,y,name,scalex,scaley,addParent, skin) {

        var loserSpine = loadSpineCharacter(x, y, name, -scalex, scaley, skin, 1);
        loserSpine.setAnimation(["gg"], true);
        addParent.addChild(loserSpine);

        var mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, addParent.width, addParent.height);
        addParent.mask = mask;
        addParent.addChild(mask);

    }

    //Load spine of an character in scene
    function loadSpineCharacter(x, y, name, scaleX, scaleY,skin, alpha){
        
        var playerYogotarSpine = spineLoader.createSpine(name, skin, "gg", 0, 0, true)
            //characterBattle.createCharacter(name, skin);
        playerYogotarSpine.setAlive(false)
        playerYogotarSpine.alpha = alpha;
        playerYogotarSpine.x = x;
        playerYogotarSpine.y = y;
        playerYogotarSpine.scale.setTo(scaleX,scaleY);

        return playerYogotarSpine;
    }

    //Load each character to use in assets
    
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
            createSpineScenary();
            createScenary();
            createParticles();
        },
        setTeams: function (myTeams) {
			players = myTeams;
        },
        setWinner: function(winner){
            INDEX_WINNER = winner
        }
    }
}()