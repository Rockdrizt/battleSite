window.minigame = window.minigame || {}

function startGame(){
	/*if(window.game) {
		location.reload()
		return
	}*/

	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create }, true, true);
	document.body.style.visibility = "hidden"

	function bootConfigFiles(sceneList) {

		function onCompleteBoot() {
			preloadScenes(sceneList)
		}

		sceneloader.preload(sceneList, {onComplete: onCompleteBoot}, "boot")
	}

	function onWaitingPlayers() {
		alertDialog.show({message:"Esperando jugadores.", isButtonDisabled:true})
	}

	function connectToServer(value){
		cliente.start(value, onWaitingPlayers, onErrorConnection)
		cliente.startGame = function () {
			sceneloader.show("teamSelector")
		}
	}

	function onErrorConnection(message, showInput){

		alertDialog.show({message:message, callback:connectToServer, showInput:showInput})
	}

	function onCompleteSceneLoading(){

		alertDialog.init()
		cliente = new Client();
		connectToServer(cliente.id_game)
		//sceneloader.show("teamSelector")
	}

	function preloadScenes(sceneList){

		function onCompletePreloading(){

			function onLoadFile(event){
				var loaderScene = sceneloader.getScene("preloaderIntro")
				loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
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

		game.add.plugin(PhaserInput.Plugin);
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

		bootConfigFiles([
			alertDialog,
			teamSelector,
			questions
		])
	}
}

(function () {
	startGame()
	//cliente.startGame = startGame
})()
//minigame.orientation.init(startGame)