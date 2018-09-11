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

	this.addEventListener = function(name, handler) {
		if (self.events.hasOwnProperty(name))
			self.events[name].push(handler);
		else
			self.events[name] = [handler];
		console.log(self.events[name])
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
			console.log(reason)
			setfb(ref, value)
		})
	}

	function initialize(idGame, team, val){
		var t1 = val.t1;
		var t2 = val.t2;
		if(self.numTeam){
			if((val[self.numTeam])&&(!val[self.numTeam].ready))
				setfb(self.refIdGame.child("t" + self.numTeam), team)
			else
				self.onError("El equipo " + self.numTeam + " ya esta siendo ocupado. Da click en OK para continuar", false, true)
		}
		else if(!t1.ready){
			setfb(self.refIdGame.child("t1"), team)//self.refIdGame.child("t1").set(team);
			self.numTeam = 1;
			self.opponent = 2
		}else if(!t2.ready){
			setfb(self.refIdGame.child("t2"), team)//self.refIdGame.child("t2").set(player);
			self.numTeam = 2;
			self.opponent = 1;
		}else{
			self.id_game = null;
			self.refIdGame= null;
			self.fireEvent('onGameFull',[]);
			self.onError("La sesión esta llena, ingresa un pin diferente", true)
			return false
		}

		//if(((idGame!==null)&&(!self.id_game))||(idGame === "000000")){
		self.id_game = idGame;

		self.refIdGame.child("data").off()
		self.refIdGame.child("data").on('value', function(snapshot) {
			var data = snapshot.val();
			if(data) {
				self.currentData = data
				self.fireEvent('showEquation', [data]);
			}
		});

		self.refIdGame.child('winner').off()
		self.refIdGame.child('winner').on('value', function(snapshot) {

			var values = snapshot.val();
			if(values){
				console.log("on Turn End triggered")
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

		self.refIdGame.child('t' + self.opponent + "/ready").off()
		self.refIdGame.child('t' + self.opponent + "/ready").on('value', function (snapshot) {
			var playerReady = snapshot.val()
			if(playerReady === false) {
				self.onWait()
			}
		})

		self.refIdGame.child('battleReady').off()
		self.refIdGame.child('battleReady').on('value', function(snapshot) {
			var battleReady = snapshot.val();
			if(battleReady && self.startBattle){
				self.startBattle()
			}
		});

		self.refIdGame.child('gameEnded').off()
		self.refIdGame.child('gameEnded').on('value', function(snapshot) {
			var gameEnded = snapshot.toJSON();
			if((gameEnded)&&(gameEnded.winner)){
				self.fireEvent('onGameEnds',[gameEnded]);
				self.gameEnded = true
			}
		});

		self.refIdGame.child('retry').off()
		self.refIdGame.child('retry').on('value', function(snapshot) {
			var values = snapshot.toJSON();
			console.log("retryPressed", values)
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


		database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().cancel()
		database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().set(false)

		self.time= (new Date()).getTime();
		self.fireEvent('onClientInit',[]);
	}

	function setGame(idGame){

		//database.ref().child(idGame).off()
		database.ref().child(idGame + "/serverReady").on('value', function(snapshot) {
			var gameReady = snapshot.val()
			if (gameReady) {
				database.ref().child(idGame).once('value', function (snap) {
					var val = snap.val()
					self.refIdGame = database.ref(idGame)
					initialize(idGame, self.team, val)
				})
			} else {
				if(self.numTeam)
					self.showAlert("Se perdió la comunicación con el servidor. ", true)
				else
					self.showAlert("La partida no existe.", true)

				database.ref().child(idGame).once('value', function (snap) {
					if(snap.exists() === false)
						database.ref(idGame + "/t" + self.numTeam + "/ready").onDisconnect().cancel()
				})
			}
		})
	}	/*if(!val.gameReady)
				onWait()*/



	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start =function(idGame, onAlert, onWait){
		// self.events = {};
		console.log(self.events)
		self.refIdGame= database.ref();
		self.showAlert = onAlert
		self.onWait = onWait

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
		setfb(self.refIdGame.child("t" + self.numTeam + "/players"), players)
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