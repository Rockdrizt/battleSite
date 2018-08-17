window.minigame = window.minigame || {}

function startGame(){
	if(window.game) {
		location.reload()
		return
	}

	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create }, true, true);
	document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

		function onCompletePreloading(){

			function onLoadFile(event){
				var loaderScene = sceneloader.getScene("preloaderIntro")
				loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
			}

			function onCompleteSceneLoading(){
				var cliente = parent.cliente
				if(cliente)
					cliente.setReady(true)

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

		//server test
	}

	function create(){

		preloadScenes([
			teamSelector,
			questions
		])
	}
}

(function () {
	var team = {
		players: [
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false}
		],
		ready:true
	}

	//TODO: this is just testing remove on prod
	cliente = new Client();
	cliente.start(team, "test-online01")
	cliente.startGame = startGame
})()
//minigame.orientation.init(startGame)