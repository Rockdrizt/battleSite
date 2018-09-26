// var src = "https://play.yogome.com/epicweb/minigames/mathClient/index.html"
var src = "../client/index.html"
var gameFrame
var gameContainer
// var language = null

var config = {
	apiKey: "AIzaSyDSKraaLJOVdFvExqI9q5i-PfUl1k9h3GQ",
	authDomain: "smartkidstournament-ce44b.firebaseapp.com",
	databaseURL: "https://smartkidstournament-ce44b.firebaseio.com",
	projectId: "smartkidstournament-ce44b",
	storageBucket: "smartkidstournament-ce44b.appspot.com",
	messagingSenderId: "745841805113"
};
firebase.initializeApp(config);
var database = firebase.database();

/**
 * @class
 * @summary The class client join to a existent game
 * @public
 */
function Client(){
	var self = this;
	var valuesInitialized = false
	/** Events
	 */
	self.events = {};
	self.team = {
		players: [
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false}
		],
		ready:true
	}
	this.id_game = null;
	this.numTeam =null;
	this.gameEnded = false
	this.queueToInsert = -1;
	this.refIdGame= null;
	this.time = null;
	this.restartGame = null
	this.timeOutCallback = null
	this.onError = null
	this.teams = []

	this.addEventListener = function(name, handler) {
		if (self.events.hasOwnProperty(name))
			self.events[name].push(handler);
		else
			self.events[name] = [handler];
		// console.log(self.events[name])
	};

	/* This is a bit tricky, because how would you identify functions?
		This simple solution should work if you pass THE SAME handler. */
	this.removeEventListener = function(name, handler) {
		if (!self.events.hasOwnProperty(name))
			return;
		var index = self.events[name].indexOf(handler);
		if (index != -1)
			self.events[name].splice(index, 1);
	};

	this.fireEvent = function(name, args) {
		if (!self.events.hasOwnProperty(name))
			return;
		if (!args || !args.length)
			args = [];
		var evs = self.events[name], l = evs.length;
		for (var i = 0; i < l; i++) {
			evs[i].apply(null, args);
		}
	};
	/**End Events*/

	var setfb = function(ref, value) {
		ref.set(value).catch(function (reason) {
			// console.log(reason)
			setfb(ref, value)
		})
	}

	this.setOnQuestions = function(){
		self.refIdGame.child("questions").off()
		self.refIdGame.child("questions").limitToLast(1).on('child_added', function(snapshot) {
			var data = snapshot.val();
			var ref = snapshot.ref
			if(data && !data.timeOut) {
				self.currentData = data
				self.fireEvent('showEquation', [data]);
				ref.child("timeOut").on("value", function (snap) {
					var timeOut = snap.val()
					if(timeOut === true)
						self.fireEvent("questionTimeOut")
				})
				ref.child("date").on("value", function (snap) {
					var date = snap.val()
					if(date)
						self.fireEvent("setTimer", [date - self.timeOffset])
				})
			}

		});
	}

	function initialize(idGame, val){
		var t1 = val.t1;
		var t2 = val.t2;
		self.teams[1] = val.t1
		self.teams[2] = val.t2
		if(self.numTeam){
			self.team = val["t" + self.numTeam]
			self.opponent = self.numTeam === 1 ? 2 : 1

			if((self.team)&&(!self.team.ready)){
				self.team.ready = true
				setfb(self.refIdGame.child("t" + self.numTeam), self.team)
				}
			else
				self.showAlert("El equipo " + self.numTeam + " ya esta siendo ocupado. Da click en OK para continuar", false, true)
		}
		else if(!t1.ready){
			//self.refIdGame.child("t1").set(team);
			self.team = t1
			self.team.ready = true
			self.numTeam = 1;
			self.opponent = 2
			setfb(self.refIdGame.child("t1"), self.team)
		}else if(!t2.ready){
			//self.refIdGame.child("t2").set(player);
			self.team = t2
			self.team.ready = true
			self.numTeam = 2;
			self.opponent = 1;
			setfb(self.refIdGame.child("t2"), self.team)
		}else{
			self.id_game = null;
			self.refIdGame= null;
			self.fireEvent('onGameFull',[]);
			self.showAlert("La sesión esta llena, ingresa un pin diferente", true)
			return false
		}

		//if(((idGame!==null)&&(!self.id_game))||(idGame === "000000")){
		self.id_game = idGame;

		self.refIdGame.child('winner').off()
		self.refIdGame.child('winner').on('value', function(snapshot) {

			var values = snapshot.val();
			if(values){
				// console.log("on Turn End triggered")
				self.fireEvent('onTurnEnds',[values]);
			}

		});

		self.refIdGame.child('gameReady').off()
		self.refIdGame.child('gameReady').on('value', function(snapshot) {
			var gameReady = snapshot.val();
			if(gameReady && self.startGame){
				self.startGame()
			}
		});

		self.refIdGame.child('battleReady').off()
		self.refIdGame.child('battleReady').on('value', function(snapshot) {
			var battleReady = snapshot.val();
			if(battleReady && self.startBattle){
				self.startBattle()
			}
		});

		self.refIdGame.child('gameEnded').off()
		self.refIdGame.child('gameEnded').on('value', function(snapshot) {
			var gameEnded = snapshot.val();
			gameEnded.teams = self.teams
			if((gameEnded)&&(typeof gameEnded.winner === "number")){
				self.fireEvent('onGameEnds',[gameEnded]);
				self.gameEnded = true
			}
		});

		self.refIdGame.child('retry').off()
		self.refIdGame.child('retry').on('value', function(snapshot) {
			var values = snapshot.toJSON();
			// console.log("retryPressed", values)
			if((values)&&(values.retry)){
				self.restartGame(values.retry)
				self.gameEnded = false
			}
		});

		self.refIdGame.child('timeOut').off()
		self.refIdGame.child('timeOut').on('value', function (snapshot) {
			var timeOut = snapshot.val()
			if(timeOut)
				self.timeOutCallback()
		})

		checkTimeOffset()

		database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().cancel()
		database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().set(false)


		self.time= (new Date()).getTime();
		self.fireEvent('onClientInit',[]);
	}

	function setGame(idGame){

		//database.ref().child(idGame).off()
		database.ref().child(idGame).on('value', function(snapshot) {
			var serverReady = snapshot.child("serverReady").val()
			if (serverReady) {
				var val = snapshot.val()

				if (self.numTeam && self.team[self.numTeam]) {
					var ready = snapshot.child("t" + self.numTeam + "/ready").val()
					if(self.teams[self.numTeam].players !== val["t" + self.numTeam].players) {
						self.teams[self.numTeam] = val["t" + self.numTeam]
						self.fireEvent('onPlayersChange',[self.teams[self.numTeam]]);
					}
					if (ready === false) {
						database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().cancel()
						self.showAlert("Te desconectaste del server, ingresa el pin de nuevo.", true)
						return
					}
				}

				if (self.opponent) {
					var opponentReady = snapshot.child("t" + self.opponent + "/ready").val()
					if(self.teams[self.opponent].players !== val["t" + self.opponent].players) {
						self.teams[self.opponent] = val["t" + self.opponent]
						self.fireEvent('onPlayersChange',[self.teams[self.opponent]]);
					}
					if (opponentReady === false) {
						self.onWait()
						return
					}
				}

				if ((val)&&(valuesInitialized !== true)) {
					valuesInitialized = true
					self.refIdGame = database.ref(idGame)
					initialize(idGame, val)
				}

			} else {
				database.ref().child(idGame).off()
				valuesInitialized = false
				if(self.numTeam) {
					self.showAlert("Se perdió la comunicación con el servidor. ", true)
					//database.ref(idGame + "/t" + self.numTeam + "/ready").set(false)
					database.ref().child(idGame).once('value', function (snap) {
						if(snap.exists() === false)
							database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().cancel()
						//self.numTeam = null
					})
				}
				else
					self.showAlert("La partida no existe.", true)

			}
		})
	}	/*if(!val.gameReady)
				onWait()*/



	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start = function(idGame, onAlert, onWait, numTeam){
		// self.events = {};
		// console.log(self.events)
		self.refIdGame= database.ref();
		self.showAlert = onAlert
		self.onWait = onWait
		if(numTeam) self.numTeam = numTeam

		database.ref('.info/connected').off()
		database.ref('.info/connected').on('value', function (snap) {
			var val = snap.val()
			if (val === false) {
				var message = "Tratando de recuperar la conexión. Revisa que tu internet sea estable."
				alertDialog.show({
					message:message,
					isButtonDisabled:true,
					showSpin:true,
				})
				if(self.numTeam)
					database.ref(idGame + "/t" + self.numTeam + "ready").set(false)
				//self.numTeam = null
			} else if (val === true) {
				if((!idGame) || (idGame === "")){
					return onAlert("Ingresa un pin valido", true)
				}else {
					//if(self.numTeam)
					//database.ref(idGame + "/t" + self.numTeam + "/ready").set(true)
					setGame(idGame)
				}

			}
		})
	};

	/**
	 * @summary Function to be executed when a button is clicked
	 * @param {type} boton Button object in main HTML
	 * @param {type} getCode function to get de code of the button
	 */
	this.buttonOnClick = function(params){
		var time = params.time
		var value = params.value

		if(self.numTeam != null){

			var answer = {
				time: time,
				value: value,
				date: firebase.database.ServerValue.TIMESTAMP
			}
			setfb(self.refIdGame.child("t" + self.numTeam + "answer"), answer)
			//self.refIdGame.child("t"+self.numTeam+"answer").set(answer);
		}
	};

	/*this.setReady = function (value) {
		self.team.ready = value
		setfb(self.refIdGame.child("t" + self.numTeam + "/ready"), value)
		//self.refIdGame.child("t"+self.numTeam+"/ready").set(value);
	}*/

	this.selectYogotar = function (players) {
		//players.date = firebase.database.ServerValue.TIMESTAMP
		self.teams[self.numTeam] = players
		setfb(self.refIdGame.child("t" + self.numTeam + "/players"), players)
	}

	function checkTimeOffset() {
		var offsetRef = firebase.database().ref(".info/serverTimeOffset");
		offsetRef.on("value", function(snap) {
			self.timeOffset = snap.val();
		});
	}
}

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
// 	if(gameContainer){
// 		loadGame()
// 		cliente = new Client();
// 	}
// }

// window.addEventListener("resize", loadGame);