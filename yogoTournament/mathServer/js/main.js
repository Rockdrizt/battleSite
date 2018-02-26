window.minigame = window.minigame || {}
//window.onerror = function(){
//	location.reload()
//}

function startGame(){

	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create }, true, true);
    document.body.style.visibility = "hidden"

	var battleScene
   
	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
                
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				var preloadAlpha = document.getElementById("preloadBattle");
				preloadAlpha.style.visibility = "hidden";
				if(server){
					server.setGameReady(true)
					console.log("GAME READY BATTLE")
					server.startGame = function () {
						console.log("BATTLE SHOW")
						sceneloader.show("vs")
					}
				}else
					sceneloader.show("battle")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		var serverData = server ? server.currentData : {
			p1:{nickname:"Player1aa", avatar:"eagle"},
			p2:{nickname:"Player2", avatar:"arthurius"}
		}

		var characterP1 = "yogotar" + capitalizeFirstLetter(serverData.p1.avatar)
		var characterP2 = "yogotar" + capitalizeFirstLetter(serverData.p2.avatar)

        var fullWidth = 1024
        var fullHeight = 768

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight); game.input.maxPointers = 1

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;

        // game.plugins.add(Fabrique.Plugins.Spine);
        game.plugins.add(PhaserSpine.SpinePlugin);
		game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);

		this.game.kineticScrolling.configure({
			kineticMovement: true,
			// timeConstantScroll: 325, //really mimic iOS
			horizontalScroll: false,
			verticalScroll: true,
			// horizontalWheel: true,
			verticalWheel: true,
			deltaWheel: 40,
			// onUpdate: null
		});

		battleScene = window.innerHeight > window.innerWidth ? battleMobile : battle

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

		var charactersSet = []
		var allCharacters = []
		for(var key in epicCharacters){
			var character = epicCharacters[key]
			allCharacters.push(character)
		}

		var players = parent.epicModel || epicModel
		// if(typeof parent.epicModel == "undefined")
		//TODO uncomment this on dev
		// players.loadPlayer()

		// var currentPlayer = players.getPlayer()
		// var cards = currentPlayer.cards

		// var battleIndex = parent.env ? (parent.env.battleIndex ? parent.env.battleIndex : 0) : 0
		// var enemyCards = currentPlayer.battles[battleIndex] || battleService.getOpponents(1)
		// currentPlayer.battles[battleIndex] = enemyCards

		//TODO: change when card Selector is ready
		// var selectedCards = currentPlayer.cards
		// charactersSet = selectedCards.concat(enemyCards)

		var cards = [{nickname: serverData.p1.nickname, xp:0, id:characterP1}, {xp:0, id:characterP2, nickname:serverData.p2.nickname}]


		//TODO: change charactersSet to player and enemy cards for both battle and versus
		charactersEntity.preloadCards(vs, cards)
		// selectCards.setCharacters(enemyCards, selectedCards)

		vs.setCharacters(cards)
		battleScene.setCharacters(cards)
		battleScene.setBackground()

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){
		console.log("createEpicBattle")
    	preloadScenes([
           // preloaderIntro,
			selectCards,
    		battleScene,
			vs,
            //result,
    	])
    }
}

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

