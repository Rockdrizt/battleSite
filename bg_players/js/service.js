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

function ScreenService(){
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

	var setfb = function(ref, value) {
		ref.set(value).catch(function (reason) {
			console.log(reason)
			setfb(ref, value)
		})
	}

    this.checkTeam = function (numTeam){
        self.refIdGame.child("t" + numTeam + "/players").on('value', function(snapshot) {
			var t1 = snapshot.val();
			if(t1) {
				self.showTeam(t1)
			}
		});
    }
    
    this.checkAnswer = function(numTeam){
        self.refIdGame.child("winner/numTeam").on('value',
            function(snapshot){
            var answer = snapshot.val();
            console.log(answer);
         if(answer){
             self.animateAnswer(answer)
         }
        })
        
    }


	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start = function(idGame, numTeam, showTeam, animateAnswer){
		// self.events = {};
		console.log(self.events)
		self.refIdGame= database.ref(idGame);
        self.showTeam = showTeam
        self.animateAnswer = animateAnswer
        self.checkTeam(numTeam)
        self.checkAnswer(numTeam)
		
	};

}