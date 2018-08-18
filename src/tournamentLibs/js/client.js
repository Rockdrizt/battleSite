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

	this.id_game = null;
	this.numTeam =null;
	this.gameEnded = false
	this.queueToInsert = -1;
	this.refIdGame= null;
	var self = this;
	this.time = null;
	this.restartGame = null
	this.timeOutCallback = null

	var setfb = function(ref, value) {
		ref.set(value).catch(function (reason) {
			console.log(reason)
			setfb(ref, value)
		})
	}

	function initialize(idGame, team, val){
		var t1 = val.t1;
		var t2 = val.t2;
		if(!t1){
			setfb(self.refIdGame.child("t1"), team)//self.refIdGame.child("t1").set(team);
			self.numTeam = 1;
		}else if(!t2){
			setfb(self.refIdGame.child("t2"), team)//self.refIdGame.child("t2").set(player);
			self.numTeam = 2;
			console.log("SET TEAM 2")
		}else{
			self.id_game = null;
			self.refIdGame= null;
			self.fireEvent('onGameFull',[]);
			return false
		}
		if(((idGame!==null)&&(!self.id_game))||(idGame === "000000")){
			self.id_game = idGame;
			self.refIdGame.child("data").on('value', function(snapshot) {
				var data = snapshot.val();
				if(data) {
					self.currentData = data
					self.fireEvent('showEquation', [data]);
				}
			});

			self.refIdGame.child('winner').on('value', function(snapshot) {

				var values = snapshot.val();
				if(values){
					console.log("on Turn End triggered")
					self.fireEvent('onTurnEnds',[values]);
				}

			});

			self.refIdGame.child('gameReady').on('value', function(snapshot) {
				var gameReady = snapshot.val();
				if(gameReady && self.startGame){
					self.startGame()
				}
			});

			self.refIdGame.child('battleReady').on('value', function(snapshot) {
				var battleReady = snapshot.val();
				if(battleReady && self.startBattle){
					self.startBattle()
				}
			});

			self.refIdGame.child('gameEnded').on('value', function(snapshot) {
				var gameEnded = snapshot.toJSON();
				if((gameEnded)&&(gameEnded.winner)){
					self.fireEvent('onGameEnds',[gameEnded]);
					self.gameEnded = true
				}
			});

			self.refIdGame.child('retry').on('value', function(snapshot) {
				var values = snapshot.toJSON();
				console.log("retryPressed", values)
				if((values)&&(values.retry)){
					self.restartGame(values.retry)
					self.gameEnded = false
				}
			});

			self.refIdGame.child('timeOut').on('value', function (snapshot) {
				var timeOut = snapshot.val()
				if(timeOut)
					self.timeOutCallback()
			})

		}
		self.time= (new Date()).getTime();
		self.fireEvent('onClientInit',[]);

		return true
	}

	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start =function(team, idGame, callback, onError){
		// self.events = {};
		console.log(self.events)
		self.team = team
		self.refIdGame= database.ref(idGame);

		self.refIdGame.once('value').then(function(snapshot) {
			var val = snapshot.val()
			if(val){
				var success = initialize(idGame, team, val)
				if(success && callback) callback()
			}else{
				onError()
			}


		});

		//Reportando la salida del juego
		window.onbeforeunload = function(){
			if(self.numTeam!=null)
				setfb(self.refIdGame.child("t" + self.numTeam), false)//self.refIdGame.child("t"+self.numTeam).set(false);
		};
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
				value: value
			}
			setfb(self.refIdGame.child("t" + self.numTeam + "answer"), answer)
			//self.refIdGame.child("t"+self.numTeam+"answer").set(answer);
		}
	};
	
	this.setReady = function (value) {
		self.team.ready = value
		setfb(self.refIdGame.child("t" + self.numTeam + "/ready"), value)
		//self.refIdGame.child("t"+self.numTeam+"/ready").set(value);
	}

	this.selectYogotar = function (players) {
		setfb(self.refIdGame.child("t" + self.numTeam + "/players"), players)
	}
}

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
	if(gameContainer){
		loadGame()
		cliente = new Client();
	}
}

// window.addEventListener("resize", loadGame);