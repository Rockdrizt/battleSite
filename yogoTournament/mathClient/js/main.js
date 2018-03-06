window.minigame = window.minigame || {}

function startGame(){
	window.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, "inGame", {init: init, create: create }, true, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				if(cliente) {
					cliente.setReady(true)
				}
					sceneloader.show("operations")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 540
        var fullHeight = 960

		// game.canvas.style.width = '50%';
		// game.canvas.style.height = '100%';
        var ratio = window.innerHeight / fullHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullWidth)
		var newWidth = Math.round(fullWidth * ratio)
		document.getElementById("inGame").style.width = newWidth + "px";

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight); game.input.maxPointers = 1
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

        game.plugins.add(Fabrique.Plugins.Spine);
        // game.plugins.add(PhaserSpine.SpinePlugin);

        // var language = "EN"
        // if(window.location.search){
        //     var params = window.location.search.trim(1)
        //     var regex = /language=(..)/i
        //     var result = regex.exec(params)
        //     if(result){
        //         language = result[result.index].toUpperCase()
        //     }else{
        //         language = "EN"
        //     }
        //
        // }

        localization.setLanguage(parent.language)
		console.log(parent.language)

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){

    	preloadScenes([
    		operations,
            // result,
    	])
    }
}

window.addEventListener('resize', function () {
	var fullWidth = 540
	var fullHeight = 960

	var ratio = window.innerHeight / fullHeight
	console.log(fullWidth * ratio)
	var newWidth = Math.round(fullWidth * ratio)
	document.getElementById("inGame").style.width = newWidth + "px";

	// game.scale.setGameSize(gameWidth, gameHeight);
	// game.scale.scaleMode = window.innerHeight > window.innerWidth ? Phaser.ScaleManager.RESIZE : Phaser.ScaleManager.EXACT_FIT
	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.canvas.style.width = '100%';
	game.canvas.style.height = '100%';
	game.scale.refresh();
	// game.scale.setGameSize(gameWidth, gameHeight);

})

var wfconfig = {

	active: function() {
		console.log("font loaded");
		startGame();
	},

	google: {
		families: ['Luckiest Guy']
	}

};
WebFont.load(wfconfig);