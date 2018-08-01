var isKinder = isKinder != undefined ? isKinder : false
// var src = isKinder ? "https://play.yogome.com/epicweb/minigames/mathServer/indexSLP.html":"https://play.yogome.com/epicweb/minigames/mathServer/index.html"
// var isMobile =
var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
	'BlackBerry|Windows Phone|'  +
	'Opera Mini|IEMobile|Mobile' ,
	'i');

var isMobile = testExp.test(navigator.userAgent)

//dev is without yogoTournament
var src = "../onboarding/index.html"
var gameFrame
var gameContainer
var server
var language = null

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBELTimQUqywzRlJTpIA2HZ8RTp9r_QF2E",
	authDomain: "mathtournament-175416.firebaseapp.com",
	databaseURL: "https://mathtournament-175416.firebaseio.com",
	projectId: "mathtournament-175416",
	storageBucket: "mathtournament-175416.appspot.com",
	messagingSenderId: "973021572842"
};
firebase.initializeApp(config);
var database = firebase.database();
var MAX_OPERAND_VALUE = 500;
var NUMBER_OF_FAKE_ANSWERS = 2;
var INITIAL_LIFE = 100;
var DAMAGE_BY_HIT = 20;
var HEALTH_BY_HIT = 20;
var DAMAGE_BY_CRITICAL_HIT = 30;

/**
 * @summary As default, an empty array has one element (an empty String). This function removes that element
 * @param {type} arr Array to be cleaned
 * @returns {unresolved} Array cleaned
 */
var cleanArray = function(arr){
	var i = arr.indexOf("");
	if(i>-1){
		arr.splice(i,1);
	}
	return arr;
};

/**
 * @class
 * @summary The class server is use to start a new game and init the reading of firebase
 * @public
 * @param {int} inLevel Level of the game. It could be {1|2|3} 1-Basic, 2- Medium, 3-Advanced
 */
// function Server(inLevel){
function Server(){

	var self = this;
	/** Events
	 */
	self.events = {};
	self.currentData = null;
	self.p1Ready = false;
	self.p2Ready = false;
	self.startGame = false
	self.rulesSet = false
	self.battleTime = 60000
	self.maxRounds = 1
	self.numberOperation

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

	var id_game;
	var level=null;
	var valores = null;
	var correctAnswer= false;
	var refIdGame = null;
	var setFb = null
	var typeQuestion = 0;

	this.getIdGame= function(){
		return id_game;
	};

	var intervalTime
	var setfb = function(ref, value) {
		if(intervalTime)
			clearInterval(intervalTime)

		ref.set(value).catch(function (reason) {
			console.log("error", reason)
			setInterval(function(){ setfb(ref, value) }, 3000);
		})
	}

	/**
	 * @summary Generates a code for the current game.
	 * @returns {String} The code of the current game
	 */
	var makeid = function(id) {
		if(id){
			ref2 = database.ref(id);
			return ref2.once('value').then(function (snapshot) {
				return id;
			});
		}else{
			var text = "";
			//var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var possible = "0123456789";
			for (var i = 0; i < 5; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			ref2 = database.ref(text);
			return ref2.once('value').then(function (snapshot) {
				if(!snapshot.exists()){
					return text;
				}else{
					return makeid();
				}
			});
		}
	};



	var shuffleArray = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	var checkWinner = function(){
		if(valores.p1.life<=0){
			self.fireEvent('onGameEnds',[{ numPlayer: 2, playerWinner: valores.p2 }]);
			return true;
		}
		if(valores.p2.life<=0){
			self.fireEvent('onGameEnds',[{ numPlayer: 1, playerWinner: valores.p1 }]);
			return true;
		}
		return false;
	}

	var checkDamage = function() {
		switch(typeQuestion){
			case 1://green
				return -1*DAMAGE_BY_HIT;
				break;
			case 2://red
				return -1*DAMAGE_BY_CRITICAL_HIT;
				break;
			case 3://blue
				return HEALTH_BY_HIT;
				break;
			default:
				return -1*DAMAGE_BY_HIT
		}
	}

	var checkResults= function(){
		// console.log("checkResultsTriggered")
		if(valores.p1answer === null){
			return;
		}
		var p1Time = valores.p1answer.time;
		var p1Value =valores.p1answer.value;

		var p2Time = valores.p2answer.time;
		var p2Value = valores.p2answer.value;

		var playerWinner =  null;
		var timeDifference = null;

		var damage =checkDamage();

		console.log(correctAnswer, p1Value, p2Value, "answers")
		if(p1Value === p2Value && p1Value === correctAnswer){
			timeDifference = Math.abs(p1Time - p2Time)
			// console.log(timeDifference)
			if(p1Time < p2Time){
				valores.winner = 1
			}else{
				valores.winner = 2
			}
		}else{
			switch(correctAnswer){
				case p1Value:
					valores.winner = 1
					break;
				case p2Value:
					valores.winner = 2
					break;
				default:
					valores.winner = -1;
			}
		}

		if(valores.winner === 1 && (typeQuestion === 1 || typeQuestion === 2) ){
			valores.p2.life+=damage;
			setfb(refIdGame.child("p2/life"), valores.p2.life)//refIdGame.child("p2/life").set(valores.p2.life);
		}else if(valores.winner === 2 && typeQuestion === 3 ){
			valores.p2.life+=damage;
			setfb(refIdGame.child("p2/life"), valores.p2.life)//refIdGame.child("p2/life").set(valores.p2.life);
		}else {
			valores.p1.life+=damage;
			setfb(refIdGame.child("p1/life"), valores.p1.life)//refIdGame.child("p1/life").set(valores.p1.life);
		}
		var actualDate = firebase.database.ServerValue.TIMESTAMP
		// console.log(actualDate)
		var answers = {
			p1:valores.p1answer,
			p2:valores.p2answer
		}
		var data = { numPlayer: valores.winner, timeDifference: timeDifference, answers:answers, date:actualDate }
		setfb(refIdGame.child("winner"), data)//refIdGame.child("winner").set(data);
		self.fireEvent('onTurnEnds',[data]);

		// valores.p1answer=false;
		// valores.p2answer=false;
		// refIdGame.set(valores);

		if(checkWinner()){
			valores.p1answer=false;
			valores.p2answer=false;
			valores.winner=false;
			valores.possibleAnswers = [];
		}
	}

	function generateQuestion(){

		var operation = operationGenerator.generate()
		correctAnswer = operation.correctAnswer

		var possibleAnswers = [correctAnswer];
		var negativeOrPositive = Math.round(Math.random()) * 2 - 1;
		for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
			var diff = Math.floor(correctAnswer / 10) > 1 ? 10 : 1
			// 	while(possibleAnswers.includes(n)){
			negativeOrPositive = negativeOrPositive * -1
			var n = correctAnswer + diff * negativeOrPositive
			possibleAnswers.push(n);
		}

		valores.possibleAnswers = shuffleArray(possibleAnswers);
		valores.p1answer = false;
		valores.p2answer = false;

		operation.date = firebase.database.ServerValue.TIMESTAMP
		valores.data = operation;
		setfb(refIdGame.child("data"), valores.data)//refIdGame.child("data").set(valores.data);
		setfb(refIdGame.child("possibleAnswers"), valores.possibleAnswers)//refIdGame.child("possibleAnswers").set(valores.possibleAnswers);
		self.fireEvent('afterGenerateQuestion',[operation]);
	}
	this.generateQuestion = generateQuestion;

	/**
	 * @summary Starts the server
	 */

	this.start = function(currentId, onStart, params){

		var params = params || {}
		var rules = params.rules || operationGenerator.RULES_SET.EASY
		var battleTime = params.battleTime || 300000
		self.battleTime = battleTime
		self.rules = rules
		self.maxRounds = typeof params.maxRounds !== "undefined" ? params.maxRounds : self.maxRounds

		self.events = {};
		self.p1Ready = false;
		self.p2Ready = false;
		console.log(self.events)
		var numPerOperations = Math.round(battleTime / 60000) * 3
		self.numberOperation = numPerOperations

		var promise = makeid(currentId);
		promise.then(function(id){

			id_game = id;
			operationGenerator.setConfiguration(rules, numPerOperations)

			var serverReady = false;
			valores = {
				rules:rules,
				p1: false,
				p2: false,
				winner :false,
				p1answer : false,
				p2answer : false,
				possibleAnswers: [],
				data:false,
				gameReady:false,
				gameEnded:false,
				retry:false,
				time:battleTime,
				maxRounds:self.maxRounds,
				timeOut:false,
			};
			refIdGame = database.ref(id_game);
			setfb(refIdGame, valores)//refIdGame.set(valores);

			if(!currentId) {
				if(onStart) onStart()

				var refP1 = database.ref(id_game + "/p1");
				refP1.on('value', function (snapshot) {
					if (serverReady) {
						if (!snapshot.val()) {
							self.fireEvent('onPlayerDisconnect', [{numPlayer: 1, playerWinner: valores.p1}]);
						} else if (!valores.p1) {
							var p1 = snapshot.toJSON();
							valores.p1 = p1;
							self.fireEvent('onInitPlayer', [{numPlayer: 1, player: valores.p1}]);
							if (valores.p2) {
								self.currentData = valores
								self.fireEvent('onPlayersReady', [valores]);
							}
						}
					}

				});

				var refP2 = database.ref(id_game + "/p2");
				refP2.on('value', function (snapshot) {
					if (serverReady) {
						if (!snapshot.val()) {
							self.fireEvent('onPlayerDisconnect', [{numPlayer: 2, playerWinner: valores.p2}]);
						} else if (!valores.p2) {
							var p2 = snapshot.toJSON();
							valores.p2 = p2;
							self.fireEvent('onInitPlayer', [{numPlayer: 2, player: valores.p2}]);
							if (valores.p1) {
								self.currentData = valores
								self.fireEvent('onPlayersReady', [valores]);
							}
						}
					}
				});

				var readyP1 = database.ref(id_game + "/p1/ready");
				readyP1.on('value', function (snapshot) {
					if (serverReady) {
						var ready = snapshot.val()
						// console.log(ready)
						if (ready) {
							self.p1Ready = true;
							if (self.p2Ready) {
								console.log("START GAME INIT")
								self.startGame()
							}
						}
					}
				});

				var readyP2 = database.ref(id_game + "/p2/ready");
				readyP2.on('value', function (snapshot) {
					if (serverReady) {
						var ready = snapshot.val()
						// console.log(ready)
						if (ready) {
							self.p2Ready = true;
							if (self.p1Ready) {
								self.startGame()
							}
						}
					}
				});

				var p1answer = database.ref(id_game + "/p1answer");
				p1answer.on('value', function (snapshot) {
					var p1answer = snapshot.toJSON();
					valores.p1answer = p1answer;
					console.log("answer", p1answer)
					if (valores.p2answer) {
						checkResults();
					}
				});

				var p2answer = database.ref(id_game + "/p2answer");
				p2answer.on('value', function (snapshot) {
					var p2answer = snapshot.toJSON();
					valores.p2answer = p2answer;
					console.log("answer", p1answer)
					if (valores.p1answer) {
						checkResults();
					}
				});

				//Borrando los datos al abandonar la partida
				window.onbeforeunload = function () {
					// if(!id_game.includes("egs"))
					refIdGame.remove();
					// else
					// 	self.retry();
				};
				serverReady = true;
			}
		});
	};

	this.setGameReady = function (value) {
		setfb(refIdGame.child("gameReady"), value)//refIdGame.child("gameReady").set(value);
	}

	this.retry = function(location){
		var date = new Date()
		var actualDate = date.getTime()
		location = location || "toHome"

		valores.p1answer =false;
		valores.p2answer =false;
		valores.p1.life =INITIAL_LIFE;
		valores.p2.life =INITIAL_LIFE;
		valores.winner =false;
		valores.possibleAnswers = [];
		valores.time = self.battleTime;
		valores.maxRounds = self.maxRounds;
		valores.rules = self.rules
		valores.data = false;
		valores.gameEnded = false;
		valores.retry = {retry:location, date:actualDate};
		valores.timeOut = false
		setfb(refIdGame, valores)//refIdGame.set(valores);
		// refIdGame.off()
		// refIdGame.remove();
		operationGenerator.setConfiguration(self.rules, self.numberOperation)

	}

	this.setGameEnded = function (numPlayerWinner) {
		var data = {winner:numPlayerWinner}
		setfb(refIdGame.child("gameEnded"), data)//refIdGame.child("gameEnded").set(data);
	}

	this.setTimeOut = function () {
		setfb(refIdGame.child("timeOut"), true)
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
	loadGame()
	server = new Server();
	// cliente = new Client();
}

// window.addEventListener("resize", loadGame);