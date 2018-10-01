

/**
 * @class
 * @summary The class server is use to start a new game and init the reading of firebase
 * @public
 * @param {int} inLevel Level of the game. It could be {1|2|3} 1-Basic, 2- Medium, 3-Advanced
 */
// function Server(inLevel){
function Server(){

	var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
		'BlackBerry|Windows Phone|'  +
		'Opera Mini|IEMobile|Mobile' ,
		'i');


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
	var NUM_TEAMS = 2
	var NUMBER_OF_FAKE_ANSWERS = 3;
	var TEAM1_DEFAULT = {
		players: [
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false}
		],
		ready:false,
		life:100,
		score:{
			correct:0,
			wrong:0
		}
	}

	var TEAM2_DEFAULT = {
		players: [
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false},
			{nickname: "yogome", avatar: false, skin:false}
		],
		ready:false,
		life:100,
		score:{
			correct:0,
			wrong:0
		}
	}

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

	var self = this;
	/** Events
	 */
	self.events = {};
	self.currentData = null;
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
			// console.log("error", reason)
			setInterval(function(){ setfb(ref, value) }, 3000);
		})
	}

	/**
	 * @summary Generates a code for the current game.
	 * @returns {String} The code of the current game
	 */
	var makeid = function(id) {
		var ref2
		if (id) {
			ref2 = database.ref(id);
			return ref2.once('value').then(function (snapshot) {
				var val = snapshot.val()
				return {
					id : id,
					val : val
				}
			});

		} else {
			var text = "";
			//var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var possible = "0123456789";
			for (var i = 0; i < 5; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			ref2 = database.ref(text);
			return ref2.once('value').then(function (snapshot) {
				if (!snapshot.exists()) {
					return {
						id : text
					};
				} else {
					return makeid();
				}
			});
		}
	}

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

		// console.log(correctAnswer, t1Value, t2Value, "answers")
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

		// if(valores.winner === 1 && (typeQuestion === 1 || typeQuestion === 2) ){
		// 	valores.t2.life+=damage;
		// 	//setfb(refIdGame.child("t2/life"), valores.t2.life)//refIdGame.child("t2/life").set(valores.t2.life);
		// }else if(valores.winner === 2 && typeQuestion === 3 ){
		// 	valores.t2.life+=damage;
		// 	//setfb(refIdGame.child("t2/life"), valores.t2.life)//refIdGame.child("t2/life").set(valores.t2.life);
		// }else {
		// 	valores.t1.life+=damage;
		// 	//setfb(refIdGame.child("t1/life"), valores.t1.life)//refIdGame.child("t1/life").set(valores.t1.life);
		// }
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
		console.log("onTurnEnds")
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
		var questionData = riddles.getQuestion(self.questionGrade)
		//var questionData = riddles.getOperation()
		correctAnswer = questionData.correctAnswer

		valores.possibleAnswers = questionData.answers
		valores.t1answer = false;
		valores.t2answer = false;

		//questionData.date = firebase.database.ServerValue.TIMESTAMP
		questionData.timeOut = false
		valores.questions.push(questionData);

		var numIndex = valores.questions.length - 1
		refIdGame.child("questions/" + numIndex).set(questionData);
		//TODO: showPossibleAnswers deprected check client events to avoid conflicts.
		self.fireEvent('afterGenerateQuestion',[questionData]);
		checkDate()
	}

	function getData(val) {
		valores = val
		//TODO: when retry is applied change player reset
		var team1 = val.t1
		var team2 = val.t2
		team1.life = 100
		team2.life = 100
		team1.score = {correct : 0, wrong : 0}
		team2.score = {correct : 0, wrong : 0}
		self.initializeTeams()
		valores.serverReady = true
		valores.gameEnded = false
		valores.winner = false
		if(!valores.questions)
			valores.questions = []
		refIdGame.update(valores)

		self.questionGrade = valores.grade
		self.currentData = val
	}

	/**
	 * @summary Starts the server
	 */
	function initializeData(id){

		valores = {
			rules:self.rules,
			t1: TEAM1_DEFAULT,
			t2: TEAM2_DEFAULT,
			winner :false,
			t1answer : false,
			t2answer : false,
			possibleAnswers: [],
			questions:[],
			gameReady:false,
			battleReady:false,
			gameEnded:false,
			retry:false,
			time:self.battleTime,
			maxRounds:self.maxRounds,
			timeOut:false,
			serverReady:true,
			grade:self.questionGrade
		};
		self.currentData = valores

		refIdGame.set(valores)
	}

	function evaluateAllReady(key){
		var allReady = true
		for(var i = 1; i <= NUM_TEAMS; i++){
			allReady = allReady && valores[key].ready
		}

		return allReady
	}

	function checkTeamReady(value, key, num, team) {
		if ((!value) || (value.ready === false)) {
			self.currentData[key].ready = false
			self.setGameReady(false)
			self.fireEvent('onTeamDisconnect', [{numTeam: num, teamWinner: valores[key]}]);
		} else if (valores[key].ready === false) {
			valores[key] = team;
			self.currentData = valores
			self.fireEvent('onInitTeam', [{numTeam: num, team: valores[key]}]);
			var allTeamsReady = evaluateAllReady(key)
			if (allTeamsReady) {
				self.fireEvent('onTeamsReady', [valores]);
			}
		}
	}

	function checkPlayers(players, numTeam){
		if (players) {
			var objReturn = {
				numTeam: numTeam,
				players: players
			}
			self.fireEvent('onPlayersChange', [objReturn]);
		}
	}

	function checkTeams(){
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++){
			var refT = database.ref(id_game + "/t" + teamIndex);
			refT.on('value', function (snapshot) {
				var value = snapshot.val()
				var key = snapshot.key
				var num = Number(key[key.length - 1])
				var players = snapshot.child("players").val()
				var team = snapshot.toJSON();

				checkTeamReady(value, key, num, team)
				checkPlayers(players, num)
			});
		}
	}

	function checkAllAnswered(){
		var allAnswer = true
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++){
			allAnswer = allAnswer && valores["t" + teamIndex + "answer"]
		}
		return allAnswer
	}

	function checkTeamAnswers() {
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++) {
			var tAnswer = database.ref(id_game + "/t" + teamIndex + "answer");
			tAnswer.on('value', function (snapshot) {
				var answer = snapshot.toJSON();
				var key = snapshot.key
				valores[key] = answer;
				// console.log("answer", answer)
				var isAllAnswered = checkAllAnswered()
				if (isAllAnswered) {
					checkResults();
				}
			});
		}
	}

	function checkDisconnect(id){
		if(id.lenght < 6) {
			database.ref(id).onDisconnect().remove()
		}
		else{
			var resetValues = {
				serverReady : false,
				gameReady : false,
				battleReady : false,
				gameEnded : false
			}

			database.ref(id).onDisconnect().update(resetValues)
			database.ref(id + "/t1/ready").onDisconnect().set(false)
			database.ref(id + "/t2/ready").onDisconnect().set(false)
		}
	}

	function checkDate() {
		var lastIndex = valores.questions.length - 1
		refIdGame.child("questions/" + lastIndex + "/date").on('value', function (snap) {
			var currentTime = snap.val()
			var ref = snap.ref
			if(currentTime){
				ref.off()
				self.fireEvent("setTimer", [currentTime - self.timeOffset])
			}
		})
	}

	function initializeSession(obj){
		var id = obj.id
		var val = obj.val
		refIdGame = database.ref(id);

		if(val)
			getData(val)
		else
			initializeData(id)

		if(!id_game) {
			id_game = id

			checkTeams()
			checkTeamAnswers()
			checkDisconnect(id)
			checkTimeOffset()
		}

		if((id)&&(self.onStart)) self.onStart()
	}

	function setGame(currentId) {
		var promise = makeid(currentId);
		promise.then(initializeSession);
	};

	function checkConnected(currentId){
		database.ref('.info/connected').off()
		database.ref('.info/connected').on('value', function (snap) {
			if (snap.val() === false) {
				var message = "Tratando de recuperar la conexión. Revisa que tu internet sea estable."
				alertDialog.show({
					message:message,
					isButtonDisabled:true,
					showSpin:true,
				})
				serverReady = false
				if(id_game) {
					//self.setGameReady(false)
					var onDisconnectValues = {
						serverReady : false,
						gameReady : false,
						battleReady : false,
					}
					database.ref(id_game).update(onDisconnectValues)
					database.ref(id_game + "/t1/ready").set(false)
					database.ref(id_game + "/t2/ready").set(false)
				}
			} else if (snap.val() === true) {
				var id = id_game || currentId
				setGame(id)
			}
		})
	}

	this.start = function(currentId, onStart, params, onError) {

		// if(!currentId) {
		// 	getCurrentID(onStart, params, onError)
		// 	return
		// }

		var params = params || {}
		var rules = params.rules || operationGenerator.RULES_SET.EASY
		var battleTime = params.battleTime || 300000
		var questionGrade = typeof params.grade == "number" ? params.grade : -1
		self.battleTime = battleTime
		self.rules = rules
		self.questionGrade = questionGrade
		self.onAlert = onError
		self.onStart = onStart
		self.maxRounds = typeof params.maxRounds !== "undefined" ? params.maxRounds : self.maxRounds

		// console.log(self.events)
		var numPerOperations = Math.round(battleTime / 60000) * 3
		self.numberOperation = numPerOperations

		checkConnected(currentId)
		operationGenerator.setConfiguration(self.rules, self.numPerOperations)
	}

	this.setGameReady = function (value) {
		setfb(refIdGame.child("gameReady"), value)//refIdGame.child("gameReady").set(value);
	}

	this.setBattleReady = function (value) {
		setfb(refIdGame.child("battleReady"), value)//refIdGame.child("gameReady").set(value);
	}

	this.updateTeam = function (teamIndex, value) {
		var key = "t" + teamIndex
		valores[key].life = value.life
		valores[key].score = value.score
		refIdGame.child(key).update(value);
	}

	this.initializeTeams = function () {
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++){
			var key = "t" + teamIndex
			var players = valores[key].players
			valores[key].life = 100
			for(var playerIndex = 0; playerIndex < players.length; playerIndex++){
				var player = players[playerIndex]
				player.avatar = false
				player.skin = false
			}
			//refIdGame.child(key).set(valores[key])
		}
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
		valores.questions = [];
		valores.gameEnded = false;
		valores.retry = {retry:location, date:actualDate};
		valores.timeOut = false
		setfb(refIdGame, valores)//refIdGame.set(valores);
		// refIdGame.off()
		// refIdGame.remove();
		operationGenerator.setConfiguration(self.rules, self.numberOperation)

	}

	this.setGameEnded = function (numTeamWinner) {
		var data = {winner:numTeamWinner, date:firebase.database.ServerValue.TIMESTAMP}
		setfb(refIdGame.child("gameEnded"), data)//refIdGame.child("gameEnded").set(data);
	}

	this.setTimeOut = function () {
		setfb(refIdGame.child("timeOut"), true)
	}

	this.setQuestionTimeOut = function () {
		console.log("timeOUT!")
		var lastIndex = valores.questions.length - 1
		refIdGame.child("questions/" + lastIndex).update({timeOut:true})
	}

	function checkTimeOffset() {
		var offsetRef = firebase.database().ref(".info/serverTimeOffset");
		offsetRef.on("value", function(snap) {
			self.timeOffset = snap.val();
		});
	}

	function getCurrentID(onStart, params, onError){
		database.ref("currentId").on("value", function (snap) {
			if(id_game) {
				window.location.reload()
				return
			}
			var currentId = snap.val()
			if(currentId)
				self.start(currentId, onStart, params, onError)
		})
	}

	this.setDate = function () {
		var lastIndex = valores.questions.length - 1
		refIdGame.child("questions/" + lastIndex).update({date:firebase.database.ServerValue.TIMESTAMP})
	}
}