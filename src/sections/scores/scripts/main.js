window.minigame = window.minigame || {}

function startGame(){
	/*if(window.game) {
		location.reload()
		return
	}*/

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
				
				
				// alertDialog.init()
				// var idGameFromHash = window.location.hash.substr(1);
                // scoreService = new ScoreService()
				// scoreService.start(idGameFromHash, scoreMain.start)
				sceneloader.show("scores")
	    	}

			document.body.style.visibility = "visible"
	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            //sceneloader.show("preloaderIntro")
    	}

    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

	function init(){

		var fullWidth = 720
		var fullHeight = 1080

		// var ratio = document.body.clientWidth / document.body.clientHeight
		// var gameHeight = Math.round(fullHeight)
		// var gameWidth = Math.round(fullHeight * ratio)

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		//game.scale.setGameSize(gameWidth, gameHeight)

		game.stage.backgroundColor = "#ffffff"
		game.time.advancedTiming = true
		game.stage.disableVisibilityChange = true;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh()

		//game.add.plugin(PhaserInput.Plugin);
		game.plugins.add(PhaserSpine.SpinePlugin);
		game.add.plugin(PhaserInput.Plugin);
		epicparticles.init(game)

		//var language = "EN"
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

		localization.setLanguage(parent.language)

		window.minigame.game = window.game
		sceneloader.init(game)
		sound.init(game)

		// var teams = [
		// 	{	life: 100, 
		// 		players: [
		// 			{avatar: "theffanie", nickname: "yogome", skin: "theffanie1"}, 
		// 			{avatar: "arthurius", nickname: "yogome", skin: "arthurius1"}, 
		// 			{avatar: "estrella", nickname: "yogome", skin: "estrella1"}
		// 		], 
		// 		ready: true, 
		// 		score: {correct: 4}
		// 	},
		// 	{	
		// 		life: 0, 
		// 		players: [
		// 			{avatar: "theffanie", nickname: "yogome", skin: "theffanie2"}, 
		// 			{avatar: "tomiko", nickname: "yogome", skin: "tomiko2"}, 
		// 			{avatar: "eagle", nickname: "yogome", skin: "eagle2"}
		// 		], 
		// 		ready: true, 
		// 		score: {correct: 0}
		// 	}
		// ];
		// scores.setTeamData(teams)
	}
    
	function create(){

		bootConfigFiles([
			alertDialog
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
        urls:['../../../shared/minigames/css/custom_fonts.css']
    },
};
WebFont.load(wfconfig);


//minigame.orientation.init(startGame)