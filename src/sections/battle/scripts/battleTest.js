window.minigame = window.minigame || {}
//window.onerror = function(){
//	location.reload()
//}

function startGame(){

	window.game = new Phaser.Game(1920, 1080, Phaser.WEBGL, "ingame", {init: init, create: create }, false, false);
    document.body.style.visibility = "hidden"

	function bootConfigFiles(sceneList) {

    	function onCompleteBoot() {
			preloadScenes(sceneList)
		}
    	
    	sceneloader.preload(sceneList, {onComplete: onCompleteBoot}, "boot")
	}
   
	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
                
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("battle")
	    	}

			document.body.style.visibility = "visible"
	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
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

        // game.plugins.add(Fabrique.Plugins.Spine);
        game.plugins.add(PhaserSpine.SpinePlugin);
		epicparticles.init(game)

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

        window.minigame.game = window.game
    	sceneloader.init(game)
		spineLoader.init()
    	sound.init(game)

		var teams = [
			["yogotarEagle", "yogotarNao", "yogotarTomiko"],
			["yogotarEagle", "yogotarLuna", "yogotarEstrella"],
		
		]
		var objTeams = []

		for(var teamIndex = 0; teamIndex < teams.length; teamIndex++){
			var team = teams[teamIndex]
			objTeams[teamIndex] = []
			for(var yogoIndex = 0; yogoIndex < team.length; yogoIndex++){
				var yogotar = team[yogoIndex]
				objTeams[teamIndex][yogoIndex] = {
					name: yogotar,
					skin: yogotar.substr(7).toLowerCase() + 1
				}
			}
		}

		battle.setTeams(objTeams)
    }

    function create(){
		console.log("createEpicBattle")
    	bootConfigFiles([
			battle,
    		//battleScene
            //result,
    	])
    }
}

var wfconfig = {

	active: function() {
		console.log("font loaded");
        startGame()
	},
    custom: {
        families: [ 'VAGRounded' ],
        urls:['../../shared/minigames/css/custom_fonts.css']
    },
};
WebFont.load(wfconfig);


//startGame()

