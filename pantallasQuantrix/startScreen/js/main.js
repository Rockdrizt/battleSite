window.minigame = window.minigame || {}

function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.canvas, null, {init: init, create: create }, true, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				//sceneloader.show("startScreen")
				sceneloader.show("teamSelector")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 720
        var fullHeight = 1080

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

        game.plugins.add(PhaserSpine.SpinePlugin);
        epicparticles.init(game)
        
        var language = "EN"
        /*if(window.location.search){
            var params = window.location.search.trim(1)
            var regex = /language=(..)/i
            var result = regex.exec(params)
            if(result){
                language = result[result.index].toUpperCase()    
            }else{
                language = "EN"
            }
            
        }*/

        localization.setLanguage(language)

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
        
//        var config = {
//            name: "Alpha Team",
//            side: 1,
//            states: {yellow: 0, color: 1},
//        }
        
        var config = {
            name: "Bravo Team",
            side: -1,
            states: {yellow: 0, color: 2},
        }
        
        teamSelector.setConfig(config)
    }

    function create(){

    	preloadScenes([
            teamSelector,
            startScreen,
            yogoSelector
    	])
    }
}
startGame()
//minigame.orientation.init(startGame)