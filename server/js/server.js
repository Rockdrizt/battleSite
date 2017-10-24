// var src = "http://yogome.com/epic/minigames/mathServer/index.html"
var src = "../operations/index.html"
var gameFrame
var gameContainer
var language = null

// Initialize Firebase

var server = function () {
	var database
	var userRef = null;
	var ref
	var newOperationCallBack = null;

	function createListeners() {

	}
	
	function startPhase1() {
		console.log(userRef)
		if (userRef){
			console.log("startPhase1")
			ref.once("value").then(function (snapshot) {
				console.log(snapshot)
				var started = snapshot.child("started").val();
				if(!started){
					var xhttp = new XMLHttpRequest();
					xhttp.open("POST", "https://us-central1-mathtournamentonline.cloudfunctions.net/startPhase1", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("uid="+userRef.uid);
					xhttp.onreadystatechange = function() {
						var response = JSON.parse(xhttp.responseText);
						if ((response.operation)&&(newOperationCallBack)){
							newOperationCallBack(response.numberOperation, response.operation);
						}
						console.log(response)
					};
				}else{
					// return
					var numOperations = snapshot.child("operations").numChildren();
					var operation = snapshot.child("operations").child(numOperations).val()
					if (newOperationCallBack) {
						newOperationCallBack(numOperations, operation);
					}
				}
			})
		}else{
			console.log("notLogged")
		}
	}
	
	function init() {

		var config = {
			apiKey: "AIzaSyAcbtFTrY02g0QnwDD9Vf6M12OjZ_DHLWE",
			authDomain: "mathtournamentonline.firebaseapp.com",
			databaseURL: "https://mathtournamentonline.firebaseio.com",
			projectId: "mathtournamentonline",
			storageBucket: "mathtournamentonline.appspot.com",
			messagingSenderId: "893263399784"
		};
		firebase.initializeApp(config);
		var database = firebase.database();

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log(user)
				userRef = user;
				ref = database.ref("phase1/" + user.uid);
				ref.child("operations").on("child_added", function (snapshot) {
					if ((newOperationCallBack) && (user))
						newOperationCallBack(snapshot);
				})
				startPhase1();
				console.log("connected")
			} else {
				if(ref)
					ref.child("operations").off();
				userRef = null;
				ref = null;
				alert("not logged");
				return {notLogged:true};
			}
		});
	}
	
	function login(email, password) {
		if(!userRef){
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				return error;
			});
		}
	}

	return{
		init: init,
		login: login,
	}
}()



// function loadGame(){
// 	if(gameFrame)
// 		gameContainer.removeChild(gameFrame);
// 	else
// 		gameFrame = document.createElement("iframe")
// 	gameFrame.src= src
// 	gameFrame.style.borderStyle = "none"
// 	gameFrame.scrolling = "no"
// 	gameFrame.width = "100%"
// 	gameFrame.height = "100%"
// 	gameContainer.appendChild(gameFrame);
// }
//
// window.onload =  function(){
// 	gameContainer = document.getElementById("game-container")
// 	loadGame()
// 	server = new Server();
// }

// window.addEventListener("resize", loadGame);