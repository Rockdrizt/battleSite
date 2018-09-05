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
	apiKey: "AIzaSyDSKraaLJOVdFvExqI9q5i-PfUl1k9h3GQ",
	authDomain: "smartkidstournament-ce44b.firebaseapp.com",
	databaseURL: "https://smartkidstournament-ce44b.firebaseio.com",
	projectId: "smartkidstournament-ce44b",
	storageBucket: "smartkidstournament-ce44b.appspot.com",
	messagingSenderId: "745841805113"
};
firebase.initializeApp(config);
var database = firebase.database();
var MAX_OPERAND_VALUE = 500;
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

	var NUMBER_OF_FAKE_ANSWERS = 3;

	var self = this;
	/** Events
	 */
	self.events = {};
	self.currentData = null;
	self.t1Ready = false;
	self.t2Ready = false;
	self.startGame = false
	self.rulesSet = false
	self.battleTime = 60000
	self.maxRounds = 1
	self.onAlert = null
	var serverReady = false;

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
		if(valores.t1.life<=0){
			self.fireEvent('onGameEnds',[{ numTeam: 2, teamWinner: valores.t2 }]);
			return true;
		}
		if(valores.t2.life<=0){
			self.fireEvent('onGameEnds',[{ numTeam: 1, teamWinner: valores.t1 }]);
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
		if(valores.t1answer === null){
			return;
		}
		var t1Time = valores.t1answer.time;
		var t1Value =valores.t1answer.value;

		var t2Time = valores.t2answer.time;
		var t2Value = valores.t2answer.value;

		var teamWinner =  null;
		var timeDifference = null;

		var damage =checkDamage();

		console.log(correctAnswer, t1Value, t2Value, "answers")
		if(t1Value === t2Value && t1Value === correctAnswer){
			timeDifference = Math.abs(t1Time - t2Time)
			// console.log(timeDifference)
			if(t1Time < t2Time){
				valores.winner = 1
			}else{
				valores.winner = 2
			}
		}else{
			switch(correctAnswer){
				case t1Value:
					valores.winner = 1
					break;
				case t2Value:
					valores.winner = 2
					break;
				default:
					valores.winner = -1;
			}
		}

		if(valores.winner === 1 && (typeQuestion === 1 || typeQuestion === 2) ){
			valores.t2.life+=damage;
			//setfb(refIdGame.child("t2/life"), valores.t2.life)//refIdGame.child("t2/life").set(valores.t2.life);
		}else if(valores.winner === 2 && typeQuestion === 3 ){
			valores.t2.life+=damage;
			//setfb(refIdGame.child("t2/life"), valores.t2.life)//refIdGame.child("t2/life").set(valores.t2.life);
		}else {
			valores.t1.life+=damage;
			//setfb(refIdGame.child("t1/life"), valores.t1.life)//refIdGame.child("t1/life").set(valores.t1.life);
		}
		var actualDate = firebase.database.ServerValue.TIMESTAMP
		// console.log(actualDate)
		var answers = {
			t1:valores.t1answer,
			t2:valores.t2answer
		}
		var data = {
			numTeam: valores.winner,
			timeDifference: timeDifference,
			answers:answers,
			date:actualDate,
			correctAnswer:correctAnswer,
		}
		setfb(refIdGame.child("winner"), data)//refIdGame.child("winner").set(data);
		self.fireEvent('onTurnEnds',[data]);

		// valores.t1answer=false;
		// valores.t2answer=false;
		// refIdGame.set(valores);

		if(checkWinner()){
			valores.t1answer=false;
			valores.t2answer=false;
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

		possibleAnswers = shuffleArray(possibleAnswers);

		var question
		if(operation.operator === "/"){
			question = operation.operand1 + " ÷ " + operation.operand2 + " = " + operation.result
		}else{
			question = operation.operand1 + " " + operation.operator + " " + operation.operand2 + " = " + operation.result
		}

		//TODO: correctAnswer only in server side
		var questionData = {
			question : question,
			answers : possibleAnswers,
			correctAnswer : correctAnswer
		}

		return questionData
	}
	this.generateQuestion = generateQuestion;

	//TODO: generate question is not a server function
	this.sendQuestion = function () {
		//var questionData = generateQuestion()
		var questionData = riddles.getOperation()
		correctAnswer = questionData.correctAnswer

		valores.possibleAnswers = questionData.answers
		valores.t1answer = false;
		valores.t2answer = false;

		questionData.date = firebase.database.ServerValue.TIMESTAMP
		valores.data = questionData;

		setfb(refIdGame.child("data"), questionData)//refIdGame.child("data").set(valores.data);
		//TODO: showPossibleAnswers deprected check client events to avoid conflicts.
		self.fireEvent('afterGenerateQuestion',[questionData]);
	}

	/**
	 * @summary Starts the server
	 */

	this.start = function(currentId, onStart, params, onError){

		var params = params || {}
		var rules = params.rules || operationGenerator.RULES_SET.EASY
		var battleTime = params.battleTime || 300000
		self.battleTime = battleTime
		self.rules = rules
		self.onAlert = onError
		self.maxRounds = typeof params.maxRounds !== "undefined" ? params.maxRounds : self.maxRounds

		self.events = {};
		self.t1Ready = false;
		self.t2Ready = false;
		console.log(self.events)
		var numPerOperations = Math.round(battleTime / 60000) * 3
		self.numberOperation = numPerOperations

		database.ref('.info/connected').on('value', function (snap) {
			if (snap.val() === false) {
				self.onAlert("Tienes un problema de conexión.\n\n Revisa que tu internet sea estable" +
					" y dale click en OK para continuar.")
				serverReady = false
			}
		})

		var promise = makeid(currentId);
		promise.then(function(id){
			id_game = id;
			operationGenerator.setConfiguration(rules, numPerOperations)

			valores = {
				rules:rules,
				t1: false,
				t2: false,
				winner :false,
				t1answer : false,
				t2answer : false,
				possibleAnswers: [],
				data:false,
				gameReady:false,
				battleReady:false,
				gameEnded:false,
				retry:false,
				time:battleTime,
				maxRounds:self.maxRounds,
				timeOut:false
			};
			refIdGame = database.ref(id_game);
			setfb(refIdGame, valores)//refIdGame.set(valores);

			if((!currentId)||("000000")) {
				if((id)&&(onStart)) onStart()

				var refT1 = database.ref(id_game + "/t1");
				refT1.on('value', function (snapshot) {
					if (serverReady) {
						if (!snapshot.val()) {
							self.t1Ready = false
							self.fireEvent('onTeamDisconnect', [{numTeam: 1, teamWinner: valores.t1}]);
						} else if (!self.t1Ready) {
							self.t1Ready = true
							var t1 = snapshot.toJSON();
							valores.t1 = valores.t1 || t1;
							self.fireEvent('onInitTeam', [{numTeam: 1, team: valores.t1}]);
							if (self.t2Ready) {
								self.currentData = valores
								self.fireEvent('onTeamsReady', [valores]);
							}
						}
					}

				});

				var refT2 = database.ref(id_game + "/t2");
				refT2.on('value', function (snapshot) {
					if (serverReady) {
						if (!snapshot.val()) {
							self.t2Ready = false
							self.fireEvent('onTeamDisconnect', [{numTeam: 2, teamWinner: valores.t2}]);
						} else if (!self.t2Ready) {
							self.t2Ready = true
							var t2 = snapshot.toJSON();
							valores.t2 = valores.t2 || t2;
							self.fireEvent('onInitTeam', [{numTeam: 2, team: valores.t2}]);
							if (self.t1Ready) {
								self.currentData = valores
								self.fireEvent('onTeamsReady', [valores]);
							}
						}
					}
				});

				var selectt1 = database.ref(id_game + "/t1/players");
				selectt1.on('value', function (snapshot) {
					var players = snapshot.val()
					// console.log(ready)
					if (players) {
						var objReturn = {
							numTeam : 1,
							players : players
						}
						self.fireEvent('onPlayersChange', [objReturn]);
					}
				});

				var selectt2 = database.ref(id_game + "/t2/players");
				selectt2.on('value', function (snapshot) {
					var players = snapshot.val()
					if(players) {
						var objReturn = {
							numTeam: 2,
							players: players
						}
						self.fireEvent('onPlayersChange', [objReturn]);
					}
				});

				/*var readyt1 = database.ref(id_game + "/t1/ready");
				readyt1.on('value', function (snapshot) {
					if (serverReady) {
						var ready = snapshot.val()
						// console.log(ready)
						if (ready) {
							self.t1Ready = true;
							if (self.t2Ready) {
								console.log("START GAME INIT")
								if(self.startGame) self.startGame()
							}
						}
					}
				});

				var readyt2 = database.ref(id_game + "/t2/ready");
				readyt2.on('value', function (snapshot) {
					if (serverReady) {
						var ready = snapshot.val()
						// console.log(ready)
						if (ready) {
							self.t2Ready = true;
							if (self.t1Ready) {
								if(self.startGame) self.startGame()
							}
						}
					}
				});*/

				var t1answer = database.ref(id_game + "/t1answer");
				t1answer.on('value', function (snapshot) {
					var t1answer = snapshot.toJSON();
					valores.t1answer = t1answer;
					console.log("answer", t1answer)
					if (valores.t2answer) {
						checkResults();
					}
				});

				var t2answer = database.ref(id_game + "/t2answer");
				t2answer.on('value', function (snapshot) {
					var t2answer = snapshot.toJSON();
					valores.t2answer = t2answer;
					console.log("answer", t1answer)
					if (valores.t1answer) {
						checkResults();
					}
				});

				//checar si se desconecto

				//Borrando los datos al abandonar la partida
				if(id !== "000000") {
					database.ref(id_game).onDisconnect().remove(function (err) {
						if (err)
							self.onAlert("Tienes un problema de conexión.\n\n Revisa que tu internet sea estable" +
								" y dale click en OK para continuar.")
					})
				}
				else{
					// if(!id_game.includes("egs"))
					var reset = {}
					reset.t1answer =false;
					reset.t2answer =false;
					reset.t1.life =INITIAL_LIFE;
					reset.t2.life =INITIAL_LIFE;
					reset.winner =false;
					reset.possibleAnswers = [];
					reset.time = self.battleTime;
					reset.maxRounds = self.maxRounds;
					reset.rules = self.rules
					reset.data = false;
					reset.gameEnded = false;
					reset.gameReady = false
					reset.timeOut = false
					database.ref(id_game).onDisconnect.set(reset)
				}
				serverReady = true;
			}
		});
	};

	this.setGameReady = function (value) {
		setfb(refIdGame.child("gameReady"), value)//refIdGame.child("gameReady").set(value);
	}

	this.setBattleReady = function (value) {
		setfb(refIdGame.child("battleReady"), value)//refIdGame.child("gameReady").set(value);
	}

	this.retry = function(location){
		var date = new Date()
		var actualDate = date.getTime()
		location = location || "toHome"

		valores.t1answer =false;
		valores.t2answer =false;
		valores.t1.life =INITIAL_LIFE;
		valores.t2.life =INITIAL_LIFE;
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

	this.setGameEnded = function (numTeamWinner) {
		var data = {winner:numTeamWinner}
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
	if(gameContainer){
		loadGame()
		server = new Server();
	}
	// cliente = new Client();
}

// window.addEventListener("resize", loadGame);