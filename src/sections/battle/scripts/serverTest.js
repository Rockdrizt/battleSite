window.minigame = window.minigame || {}
//window.onerror = function(){
//	location.reload()
//}

function startGame(){

	var onReadyCallback

	window.game = new Phaser.Game(1920, 1080, Phaser.WEBGL, "ingame", {init: init, create: create }, false, false);
	document.body.style.visibility = "hidden"

	function bootConfigFiles(sceneList) {

		function onCompleteBoot() {
			preloadScenes(sceneList)
		}

		sceneloader.preload(sceneList, {onComplete: onCompleteBoot}, "boot")
	}

	function pauseUpdate() {
		alertDialog.pauseUpdate()
	}

	function showAlert(message){
		alertDialog.show({
			message:message,
			isButtonDisabled:true,
			pin:server.getIdGame()
		})
	}

	function showError(message){
		alertDialog.show({
			message:message,
			callback:function(){
				location.reload()
			}
		})
	}

	function checkPlayers() {
		if(onReadyCallback){
			alertDialog.hide()
			onReadyCallback()
			onReadyCallback = null
		}

		return

		var t1Ready = server.currentData.t1.ready
		var t2Ready = server.currentData.t2.ready

		if((t1Ready)&&(t2Ready)){
			alertDialog.hide()
			server.setGameReady(true)

			if(onReadyCallback){
				onReadyCallback()
				onReadyCallback = null
			}
		}else if(t1Ready){
			showAlert("Esperando a equipo 2 en conectarse")
		}else if(t2Ready){
			showAlert("Esperando a equipo 1 en conectarse")
		}else{
			showAlert("Esperando a equipos en conectarse")
		}
	}

	function preloadScenes(sceneList){

		function onCompletePreloading(){

			function onLoadFile(event){

				var loaderScene = sceneloader.getScene("preloaderIntro")
				loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
			}

			function onCompleteSceneLoading(){
				alertDialog.init()
				server = new Server()
				var idGameFromHash = window.location.hash.substr(1);
				var questionsGrade = -1
				server.start(idGameFromHash, checkPlayers, {rules:operationGenerator.RULES_SET.MEDIUM, grade:questionsGrade}, showError)

				var loaderScene = sceneloader.getScene("preloaderIntro")

				if (server) {
					/*server.startGame = function () {
						sceneloader.show("yogoSelector")
					}*/
					//alertDialog.init()

					server.addEventListener("onTeamDisconnect", checkPlayers)
					server.addEventListener("onInitTeam", checkPlayers)
					onReadyCallback = function () {
						loaderScene.onComplete("battle")
						//sceneloader.show("yogoSelector")
					}
				}
				else {
					//sceneloader.show("yogoSelector")


					loaderScene.onComplete("yogoSelector")
					//sceneloader.show("yogoSelector")
				}
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

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		game.input.maxPointers = 1

		game.stage.backgroundColor = "#ffffff"
		game.time.advancedTiming = true
		game.stage.disableVisibilityChange = true;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh()

		game.plugins.add(PhaserSpine.SpinePlugin)
		game.add.plugin(PhaserInput.Plugin)
		epicparticles.init(game)

		localization.setLanguage(parent.language)

		window.minigame.game = window.game
		sceneloader.init(game)
		spineLoader.init()
		sound.init(game)

		var teams = [

			[{name:"yogotarNao", skin:"nao1"}, {name:"yogotarTheffanie", skin:"theffanie2"}, {name:"yogotarLuna", skin:"luna1"}],
			[{name:"yogotarEagle", skin:"eagle2"}, {name:"yogotarNao", skin:"nao2"}, {name:"yogotarEstrella", skin:"estrella1"}],

		];

		battle.setTeams(teams)
		reward.setTeams(teams)
	}

	function create(){
		console.log("createEpicBattle")

		bootConfigFiles([
			//startScreen,
			alertDialog,
			//yogoSelector,
			battle,
			reward
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

