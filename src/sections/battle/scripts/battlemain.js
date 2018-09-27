
var battleMain = function(){

	function bootConfigFiles(sceneList) {

		function onCompleteBoot() {
			preloadScenes(sceneList)
		}

		sceneloader.preload(sceneList, {onComplete: onCompleteBoot}, "boot")
	}

	function preloadScenes(sceneList){

		function onLoadFile(event){

			//var loaderScene = sceneloader.getScene("yogoSelector")
			yogoSelector.updateLoadingBar(event.totalLoaded, event.totalFiles)
		}

		function onCompleteSceneLoading(){
			yogoSelector.showBattle()
			server.setBattleReady(true)
            //sceneloader.show("battle")
			//sceneloader.show("battleScene")
		}

		document.body.style.visibility = "visible"
		sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})

	}

	function init(myTeams){
		battle.setTeams(myTeams)
		reward.setTeams(myTeams)
	}
    
    
    function initWinerTeam(win){
        reward.setWinner(win)
    }

	function create(){
		bootConfigFiles([
			battle,
			reward,
		])
	}

	return{
		init:init,
        initWinerTeam: initWinerTeam,
        create:create,
	}
}()

