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
function ScoreService(){
	var self = this;
	var valuesInitialized = false
	var teamAnswers = []

	var NUM_TEAMS = 2
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

	function checkAllAnswered(){
		var allAnswer = true
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++){
			allAnswer = allAnswer && teamAnswers[teamIndex]
		}
		return allAnswer
	}

	function onScoreUpdate(){
		for(var teamIndex = 1; teamIndex <= NUM_TEAMS; teamIndex++) {
			var teamKey = "t" + teamIndex
			self.refIdGame.child(teamKey).on('value', function (snapshot) {
				var teamValue = snapshot.val()
				var key = snapshot.key
				var numTeam = Number(key[key.length - 1])
				if (teamValue.score && teamValue.life) {
					var returnValue = {
						numTeam : numTeam,
						score : teamValue.score,
						life : teamValue.life
					}
					self.fireEvent("onTeamUpdate", [returnValue])
				}
			})

			var tAnswer = self.refIdGame.child("t" + teamIndex + "answer");
			tAnswer.on('value', function (snapshot) {
				var answer = snapshot.toJSON();
				var key = snapshot.key
				var num = Number(key[1])
				teamAnswers[num] = answer;
				var isAllAnswered = checkAllAnswered()
				if (isAllAnswered) {
					self.fireEvent("onTurnEnds")
				}
			});
		}
	}

	function onNewQuestion(){
		self.refIdGame.child("data").on("value", function (snap) {
			var data = snap.val()
			if(data){
				self.fireEvent("newQuestion", [data])
			}
		})
	}

	function onBattleReady(idGame){

		//database.ref().child(idGame).off()
		database.ref().child(idGame).on('value', function(snapshot) {
			var battleReady = snapshot.child("battleReady").val()
			if (battleReady) {
				if(!valuesInitialized) {
					alertDialog.hide()
					valuesInitialized = true
					var team1 = snapshot.child("t1").val()
					var team2 = snapshot.child("t2").val()
					var teams = [team1, team2]
					//scoreMain.start(teams)
					self.onBattle(teams)
					self.refIdGame = database.ref(idGame);
					onNewQuestion()
					onScoreUpdate()
				}
			} else {
				var message = "Equipos seleccionando yogotats."
				alertDialog.show({
					message:message,
					isButtonDisabled:true,
					showSpin:true,
				})
			}
		})
	}	/*if(!val.gameReady)
				onWait()*/



	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start = function(idGame, onBattle){
		// self.events = {};
		console.log(self.events)
		self.refIdGame= database.ref();
		self.onBattle = onBattle

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
				//self.numTeam = null
			} else if (val === true) {
				if((!idGame) || (idGame === "")){
					alertDialog.show({
						message:"Ingresa un pin valido.",
						callback:function (value) {
							self.start(value, onBattle)
						}
					})
				}else {
					//if(self.numTeam)
					//database.ref(idGame + "/t" + self.numTeam + "/ready").set(true)
					onBattleReady(idGame)
				}

			}
		})
	};

}
