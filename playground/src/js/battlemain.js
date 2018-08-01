
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
			//sceneloader.show("battleScene")
		}

		document.body.style.visibility = "visible"
		sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})

	}

	function init(teams){
		battle.setTeams(teams)
	}
    
    function initResults(teams){
        reward.setTeams(teams)
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
        initResults: initResults,
        initWinerTeam: initWinerTeam,
        create:create,
	}
}()

