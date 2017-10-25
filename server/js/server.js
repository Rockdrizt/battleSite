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
	var currentOperation = null;
	var operationRef

	function createListeners() {

	}
	
	function startPhase1() {
		console.log(userRef)
		if (userRef){
			console.log("startPhase1")
			ref.once("value").then(function (snapshot) {
				console.log(snapshot)
				var startTime = snapshot.child("startTime").val();
				if(!startTime){
					var xhttp = new XMLHttpRequest();
					xhttp.open("POST", "https://us-central1-mathtournamentonline.cloudfunctions.net/startPhase1", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("uid="+userRef.uid);
					xhttp.onreadystatechange = function() {
						if (this.readyState === 4 && this.status === 200){
							var response = JSON.parse(xhttp.responseText);
							console.log(response)
							if (response.operation){
								currentOperation = {number:response.numberOperation, operation:response.operation}
								addListeners(ref.child("operations/" + response.numberOperation))
							}
						}
					};
				}else{
					// return
					var numOperations = snapshot.child("operations").numChildren();
					var operation = snapshot.child("operations").child(numOperations).val();
					console.log(numOperations, operation);
					currentOperation = {number:numOperations, operation:operation}
					addListeners(ref.child("operations/" + numOperations))
				}
			})
		}else{
			console.log("notLogged")
		}
	}

	function addListeners(snapshot) {
		if(operationRef){
			operationRef.off();
		}
		operationRef = snapshot.ref;

		ref.child("operations/" + snapshot.key + "/score").on("value", function (snapshot) {
			if(snapshot.val() > 0){
				//callBackScore
			}
		})
		ref.child("operations/" + snapshot.key + "/bonusTriple").on("value", function (snapshot) {

		})
		ref.child("operations/" + snapshot.key + "/bonusTime").on("value", function (snapshot) {

		})
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
					currentOperation = {number:snapshot.key, operation:snapshot.val()}
					addListeners(snapshot.ref)
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
	
	function logout() {
		firebase.auth().signOut();
	}

	return{
		init: init,
		login: login,
		logout:logout,
		getCurrentOperation:function () {
			return currentOperation;
		}
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