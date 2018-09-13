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
				//sceneloader.show("battle")
				//sceneloader.show("scores")
				alertDialog.init()
				var idGameFromHash = window.location.hash.substr(1);
                var scoreService = new ScoreService()
				scoreService.start(idGameFromHash, scoreMain.start)
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

		/*var teamsData = [
			[
				{
					nickname : "Rock",
					avatar : "dinamita"
				},
				{
					nickname : "Pawel",
					avatar : "theffanie"
				},
				{
					nickname : "Rulas",
					avatar : "luna"
				}
			],
			[
				{
					nickname: "Cherry",
					avatar: "dinamita"
				},
				{
					nickname: "Humbert",
					avatar: "theffanie"
				},
				{
					nickname: "Mares",
					avatar: "luna"
				}
			]
		]
		scores.setTeamData(teamsData)*/
	}

	//scores.setTeams(teams, kids)
    
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