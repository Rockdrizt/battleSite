window.minigame = window.minigame || {}
function startGame(){

	window.game = new Phaser.Game(1920, 1080, Phaser.CANVAS, "canvasConfetti", {init: init, create: create,preload:preload }, true, true);

    
    function preload(){
        game.load.image("conffeti","/img/conffeti.png")
    }


    function init(){

        var fullWidth = 1024
        var fullHeight = 1080

        // var ratio = document.body.clientWidth / document.body.clientHeight
        // var gameHeight = Math.round(fullHeight)
        // var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // game.scale.setGameSize(gameWidth, gameHeight); game.input.maxPointers = 1

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh()


        window.minigame.game = window.game
    }

    function createConfetti(){
        console.log("teamId: " + teamId);
        //var color = teamId == 1 - 1 ? "0xFCE347" : "0xB7D8DD"
        var confetti = game.add.emitter(game.world.centerX, 0, 50)
        confetti.makeParticles("conffeti")
        confetti.gravity = 10
        confetti.maxParticleSpeed.setTo(0, 800)
        confetti.minParticleSpeed.setTo(0, 500)
        confetti.setSize(game.world.width, 0)
        confetti.setScale(0.3, 0.5, 0.3, 0.5, 0) 
        confetti.forEach(function(element) {
            //element.tint = getRandomColor()
            element.tint = colorConfetti;
        });
        confetti.start(false, 5000, 100, 0) 
    }    
    
    function create(){
         createConfetti();
    }
}



