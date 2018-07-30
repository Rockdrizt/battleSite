
var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/reward/";

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
                file:"images/spines/brain/Pantalla de victoria.json"
            }
        ],
        particles: [
            {
                name: "brain_particles",
                file: "particles/brain_particles/sphere_ligths1.json",
                texture: "sphere_ligths1.png"
            },
            {
                name: "brain_particlesB",
                file: "particles/brain_particles/Ligth_Brain.json",
                texture: "Ligth_Brain.png"
            },
            {
                name: "confetti",
                file: "particles/confetti/Conffeti_win.json",
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
    var loseColocation;                     //Position to colocate the window of players in y
    var loseColocationX;                    //Position to colocate the window of player in x
    var indexWinner;                        //Id of winner team
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
        //indexWinner = 0;
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

    function createSpineScenary(){
        brainGroupBack = game.add.group();
        sceneGroup.add(brainGroupBack);

        coupSpine = game.add.spine(0,0,"coup");
        coupSpine.x = 820;
        coupSpine.y = game.height - coupSpine.height/2 - 25;
        coupSpine.scale.setTo(0.95,0.95);
        if(indexWinner == 0){
            coupSpine.setSkinByName("alfa");
        }else{
            coupSpine.setSkinByName("bravo");
        }
        coupSpine.setAnimationByName(0,"idle", false);
        coupSpine.addAnimationByName(0, "win", false);
        coupSpine.addAnimationByName(0, "winstill", true);
        sceneGroup.add(coupSpine);
    }

    function createParticles(){

        game.time.events.add(1500,function(){
            sound.play("gold");
        },this);

        game.time.events.add(2000,function(){
            sound.play("bright");
            var brainParticles = epicparticles.newEmitter("brain_particles");
            brainParticles.x = coupSpine.x + 3;
            brainParticles.y = coupSpine.y - 500;
            brainGroup.add(brainParticles);

            var brainBackParticles = epicparticles.newEmitter("brain_particlesB");
            brainBackParticles.x = coupSpine.x -10;
            brainBackParticles.y = coupSpine.y - 620;
            brainGroupBack.add(brainBackParticles);
        },this);

        game.time.events.add(3000,function(){
            sound.play("song");
            var confettiParticles = epicparticles.newEmitter("confetti");
            confettiParticles.x = game.world.centerX;
            confettiParticles.y = 0;
            sound.play("cheers");
            sound.play("music", {loop:true, volume:0.4});
        },this);

    }

    //Create elements for the screen
    function createScenary(){
        var namePlayer;
        if(indexWinner == 0){
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
            createSpineL(180,260,players[1][i],0.65*scaleOrder[i],0.65,squareLoser[i],game.rnd.integerInRange(1, 2));
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
        tweenNameWin.onComplete.add(function(){
            loseColocation = 150;
            for(var j=0; j<3; j++){
                game.add.tween(squareLoser[j]).to({ x: loseColocationX, y: loseColocation }, 5000, Phaser.Easing.Sinusoidal.Out, true, 0, 0);
                game.add.tween(closeSquare[j]).to({ x: loseColocationX - 2, y: loseColocation + squareLoser[j].height - 5 }, 5000, Phaser.Easing.Sinusoidal.Out, true, 0, 0);
                loseColocationX += 50;
                loseColocation += squareLoser[j].height + 10;
            }
            game.time.events.add(Phaser.Timer.SECOND * 16, showInformation, this);
        });
        for(var m=0; m<3; m++){
            createSpine(winnerColocationX[m],winnerColocationY[m],players[0][m],winnerScale[m]*scaleOrder[m], winnerScale[m], game.rnd.integerInRange(1, 2));
        }
        
    }

    //Show the last information about game
    function showInformation(){
        for(var k=0; k<3; k++){
            game.add.tween(squareLoser[k]).to({ x: squareLoser[k].x+600, y: squareLoser[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
            game.add.tween(closeSquare[k]).to({ x: closeSquare[k].x+600, y: closeSquare[k].y+250 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
        sound.play("sword");
        for(var l=0; l<2; l++){
            game.add.tween(title[l]).to({ x: (game.width - 650)+(100*l) }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0);
        }
        sound.play("cheers");
    }

     //Funcion para cargar el spine (opcional)
    function createSpine(x,y,name,scalex,scaley, skinNum) {

        var appear;

        if(indexWinner == 0){
            appear = "appear_delta";
        }else{
            appear = "appear_alpha";
        }

        var playerYogotarSpine = characterBattle.createCharacter(name, name + skinNum);
        playerYogotarSpine.alpha = 0;
        playerYogotarSpine.x = x;
        playerYogotarSpine.y = y;
        playerYogotarSpine.scale.setTo(scalex,scaley);
        sceneGroup.add(playerYogotarSpine);

        game.time.events.add(game.rnd.integerInRange(2000,3000),function(){
                playerYogotarSpine.setAnimation([appear,"win"], true);
                playerYogotarSpine.alpha=1;
        },this);

    }

    function createSpineL(x,y,name,scalex,scaley,addParent, skinNum) {

        var playerYogotarSpine = characterBattle.createCharacter(name, name + skinNum, "gg");
        playerYogotarSpine.x = x;
        playerYogotarSpine.y = y;
        playerYogotarSpine.scale.setTo(-scalex,scaley);
        addParent.addChild(playerYogotarSpine);

        var mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, addParent.width, addParent.height);
        addParent.mask = mask;
        addParent.addChild(mask);

    }

    function setCharacter(character, teamIndex) {
        var charObj = {
            name: character,
            file: "images/spines/"+character+"/"+character+"Win.json",
            scales: ["@0.5x"],
            teamNum:teamIndex
        }
        assets.spines.push(charObj)
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
            createSpineScenary();
            createScenary();
            createParticles();
        },
        setCharacter:setCharacter,
        setTeams: function (myTeams) {
            for(var teamIndex = 0; teamIndex < myTeams.length; teamIndex++){
                players = myTeams;
                var team = myTeams[teamIndex]

                for(var charIndex = 0; charIndex < team.length; charIndex++){
                    var character = team[charIndex];
                    setCharacter(character, teamIndex);
                }
            }
        }
    }
}()