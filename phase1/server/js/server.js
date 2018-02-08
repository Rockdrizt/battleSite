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
	var events

	var addEventListener = function(name, handler) {
		if (events.hasOwnProperty(name))
			events[name].push(handler);
		else
			events[name] = [handler];
		console.log(events[name])
	};

	/* This is a bit tricky, because how would you identify functions?
		This simple solution should work if you pass THE SAME handler. */
	var removeEventListener = function(name, handler) {
		if (!events.hasOwnProperty(name))
			return;
		var index = events[name].indexOf(handler);
		if (index !== -1)
			events[name].splice(index, 1);
	};

	var fireEvent = function(name, args) {
		if (!events.hasOwnProperty(name))
			return;
		if (!args || !args.length)
			args = [];
		var evs = events[name], l = evs.length;
		for (var i = 0; i < l; i++) {
			evs[i].apply(null, args);
		}
	};
	
	function startPhase1(successCallBack) {
		console.log(userRef)
		if (userRef){
			console.log("startPhase1")
			ref.once("value").then(function (snapshot) {
				console.log("snapshot", snapshot)
				var startTime = snapshot.child("startTime").val();
				console.log("startTime", snapshot.key)
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
								// addListeners()
								if(successCallBack) successCallBack();
							}
						}
					};
				}else{
					// return
					var numOperations = snapshot.child("operations").numChildren();
					var operation = snapshot.child("operations").child(numOperations).val();
					console.log(numOperations, operation);
					currentOperation = {number:numOperations, operation:operation}
					// addListeners()
					console.log("callback")
					if(successCallBack) successCallBack();
				}
			})
		}else{
			console.log("notLogged")
		}
	}

	function addListeners() {
		if(operationRef){
			operationRef.off();
		}
		operationRef = ref.child("operations");
		console.log(currentOperation.number)

		operationRef.limitToLast(1).on("child_changed", function (snapshot) {
			if(snapshot.key)
			console.log("fireEventOnComplete")
			var data
			if(snapshot.val() > 0){
				data = {isCorrect:true, score: snapshot.val()}
			}else
				data = {isCorrect:false, score: snapshot.val()}

			snapshot.ref.parent.once("value", function (operationData) {
				console.log("key", operationData.key)
				currentOperation.operation.correctAnswer = operationData.child("correctAnswer").val();
				fireEvent('onCompletedOperation', [data]);
			})
		})
	// 	ref.child("operations/" + snapshot.key + "/bonusTriple").on("value", function (snapshot) {
	// 		fireEvent('onTripleBonus',[snapshot.val()]);
	// 	})
	// 	ref.child("operations/" + snapshot.key + "/bonusTime").on("value", function (snapshot) {
	// 		fireEvent('onTimeBonus',[snapshot.val()]);
	// 	})
	}
	
	function init(successCallBack) {

		events = {};
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
				// ref.child("operations").limitToLast(1).on("child_added", function (snapshot) {
				// 	console.log("addListener", snapshot.key)
				// 	currentOperation = {number:snapshot.key, operation:snapshot.val()}
				// 	// addListeners(snapshot.ref)
				// })
				ref.child("operations").limitToLast(1).on("child_added", function(snapshot) {
					snapshot.ref.orderByChild("correctAnswer").on("child_changed", function (itemSnapshot) {
						console.log(itemSnapshot.key)
						if(itemSnapshot.key === "correctAnswer"){
							currentOperation.operation.correctAnswer = itemSnapshot.val();
						}
					});
					snapshot.ref.on("child_added", function (itemSnapshot) {
						if(itemSnapshot.key === "score"){
							console.log("fireEventOnComplete")
							var data
							if(itemSnapshot.val() > 0){
								data = {isCorrect:true, score: itemSnapshot.val()}
							}else
								data = {isCorrect:false, score: itemSnapshot.val()}


							console.log("value", snapshot.child("correctAnswer").val())
							fireEvent('onCompletedOperation', [data]);
						}
					})
					if((currentOperation)&&(currentOperation.number < snapshot.key)){
						currentOperation.operation = snapshot.val();
						currentOperation.number = snapshot.key;
						console.log(currentOperation)
					}
				});
				startPhase1(successCallBack);
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

	function setAnswer(answer) {
		if(userRef){
			ref.child("operations/" + currentOperation.number + "/userAnswer").set(answer)
		}
	}

	return{
		init: init,
		login: login,
		logout:logout,
		addEventListener:addEventListener,
		removeEventListener:removeEventListener,
		setAnswer:setAnswer,
		getCurrentOperation:function () {
			return currentOperation;
		}
	}
}()



function loadGame(){
	if(gameFrame)
		gameContainer.removeChild(gameFrame);
	else
		gameFrame = document.createElement("iframe")
	gameFrame.src= src
	gameFrame.style.borderStyle = "none"
	gameFrame.scrolling = "no"
	gameFrame.width = "100%"
	gameFrame.height = "100%"
	gameContainer.appendChild(gameFrame);
}

window.onload =  function(){
	gameContainer = document.getElementById("game-container")
	loadGame()
	// server = new Server();
}

// window.addEventListener("resize", loadGame);