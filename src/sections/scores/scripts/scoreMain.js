
var scoreMain = function(){

	function bootConfigFiles(sceneList) {

		function onCompleteBoot() {
			preloadScenes(sceneList)
		}

		sceneloader.preload(sceneList, {onComplete: onCompleteBoot}, "boot")
	}

	function preloadScenes(sceneList){

		function onLoadFile(event){

			//var loaderScene = sceneloader.getScene("yogoSelector")
			//yogoSelector.updateLoadingBar(event.totalLoaded, event.totalFiles)
		}

		function onCompleteSceneLoading(){
			sceneloader.show("scores")
		}

		document.body.style.visibility = "visible"
		sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})

	}

	function create(teamsData){
		scores.setTeamData(teamsData)

		bootConfigFiles([
			scores,
		])
	}

	return{
		start:create,
	}
}()

