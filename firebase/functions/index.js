const functions = require('firebase-functions');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// const cors = require('cors')({origin: true});
const parser = require('body-parser');

var jsonParser = parser.json();
//
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

function getBonusTime(diffTime){
	var result = 0
	var MAX_TIME = 30000
	var MAX_POINTS = 10000

	if(diffTime <= MAX_TIME)
		result = (MAX_TIME - diffTime) * MAX_POINTS / MAX_TIME

	console.log(result)
	return result
}

function generateQuestion(level){
	var operand1;
	var operand2;
	var result = "?";
	var operator = Math.floor((Math.random() * 3) + 1);
	var correctAnswer;

	var MAX_OPERAND_VALUE
	var NUMBER_OF_FAKE_ANSWERS = 2

	switch(level){
		case 2://Medium
			MAX_OPERAND_VALUE = 500;
			switch(operator){
				case 2: // -
					operator = "-";
					operand1= Math.floor((Math.random() * 399 ) )+101;
					operand2= Math.floor((Math.random() * 399 ) )+101;
					if(operand1< operand2){
						var aux = operand1;
						operand1 = operand2;
						operand2 = aux;
					}
					correctAnswer = operand1 -operand2;
					break;
				case 3: // x
					operator = "x";
					operand1= Math.floor((Math.random() * 10 ) + 12 );
					operand2= Math.floor((Math.random() * 10 ) + 12 );
					correctAnswer = operand1 * operand2;
					break;
				case 4: // /
					// operand1 = dividendo, operand2 = divisor
					operator = "/";
					operand1= Math.floor((Math.random() * 10 ) + 12 );
					operand2= Math.floor((Math.random() * 10 ) + 12);
					var aux =  operand1 * operand2;
					correctAnswer = operand1;
					operand1 = aux;
					break;
				case 1: // +
				default:
					operator = "+";
					operand1= Math.floor((Math.random() * 250) + 1);
					operand2= Math.floor((Math.random() * 250) + 1);
					correctAnswer = operand1 +operand2;
					break;
			}
			break;
		case 3://Advance
			MAX_OPERAND_VALUE = 999;
			switch(operator){
				case 2: // -
					operator = "-";
					operand1= Math.floor((Math.random() * 498 ) ) + 501;
					operand2= Math.floor((Math.random() * 498 ) ) + 501;
					if(operand1< operand2){
						var aux = operand1;
						operand1 = operand2;
						operand2 = aux;
					}
					correctAnswer = operand1 -operand2;
					break;
				case 3: // x
					operator = "x";
					operand1= Math.floor((Math.random() * 10 ) + 22 );
					operand2= Math.floor((Math.random() * 10 ) + 21 );
					correctAnswer = operand1 * operand2;
					break;
				case 4: // /
					// operand1 = dividendo, operand2 = divisor
					operator = "/";
					operand1= Math.floor((Math.random() * 10 ) + 22);
					operand2= Math.floor((Math.random() * 10 ) + 21);
					var aux =  operand1 * operand2;
					correctAnswer = operand1;
					operand1 = aux;
					break;
				case 1: // +
				default:
					operator = "+";
					operand1= Math.floor((Math.random() * 500) + 1);
					operand2= Math.floor((Math.random() * 499) + 1);
					correctAnswer = operand1 +operand2;
					break;
			}
			break;
		case 1://Basic
		default:
			MAX_OPERAND_VALUE = 100;
			switch(operator){
				case 2: // -
					operator = "-";
					operand1= Math.floor((Math.random() * 99 ) + 1 );
					operand2= Math.floor((Math.random() * 99 ) + 1);
					if(operand1< operand2){
						var aux = operand1;
						operand1 = operand2;
						operand2 = aux;
					}
					correctAnswer = operand1 -operand2;
					break;
				case 3: // x
					operator = "x";
					operand1= Math.floor((Math.random() * 9 ) + 1 );
					operand2= Math.floor((Math.random() * 11 ) + 1);
					correctAnswer = operand1 * operand2;
					break;
				case 4: // /
					// operand1 = dividendo, operand2 = divisor
					operator = "/";
					operand1= Math.floor((Math.random() * 11 ) + 1 );
					operand2= Math.floor((Math.random() * 9 ) + 1);
					var aux =  operand1 * operand2;
					correctAnswer = operand1;
					operand1 = aux;
					break;
				case 1: // +
				default:
					operator = "+";
					operand1= Math.floor((Math.random() * 100) + 1);
					operand2= Math.floor((Math.random() * 100) + 1);
					correctAnswer = operand1 +operand2;
					break;
			}
			var isEcuation = Math.floor((Math.random() * 2) + 1);
			if(isEcuation===1){
				result =correctAnswer;
				correctAnswer = operand2;
				operand2 = "?";
			}
	}

	var possibleAnswers = [correctAnswer];
	var percentage = 0;
	percentage = Math.floor(correctAnswer * 0.25)+1;
	for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
		var n = correctAnswer;
		while(possibleAnswers.includes(n)){
			var isSuma = Math.floor((Math.random() * 2) + 1);
			if(isSuma ===1 )
				n = correctAnswer + Math.floor(Math.random() * percentage)+Math.floor(Math.random() * 2);
			else
				n = correctAnswer - Math.floor(Math.random() * percentage)-Math.floor(Math.random() * 2);
		}
		possibleAnswers.push(n);
	}

	possibleAnswers = shuffleArray(possibleAnswers);

	// var typeQuestion= Math.floor((Math.random() * 100) + 1);
	// if(valores.p1.life < INITIAL_LIFE && valores.p2.life < INITIAL_LIFE){
	// 	typeQuestion= Math.floor((Math.random() * 100) + 1);
	// 	if(typeQuestion<= 20){
	// 		typeQuestion= 2; //red
	// 	}else if(typeQuestion <= 40){
	// 		typeQuestion=3; //blue
	// 	}else{
	// 		typeQuestion= 1; //green
	// 	}
	// }else{
	// 	if(typeQuestion<= 20){
	// 		typeQuestion= 2; //red
	// 	}else {
	// 		typeQuestion=1; //green
	// 	}
	// }

	var data = {
		operand1 : operand1,
		operand2 : operand2,
		operator : operator,
		result : result,
		correctAnswer : correctAnswer,
		possibleAnswers:possibleAnswers
	}
	return data;
}

exports.createUser = functions.https.onRequest(function(req, res) {

	// Grab the text parameter.
	console.log(req)
	jsonParser(req, res, function () {
		var email = req.body.email;
		var password = req.body.password;
		// Push the new message into the Realtime Database using the Firebase Admin SDK.
		admin.auth().createUser({
			email: email,
			password: password,
		})
			.then(function(userRecord) {
				// See the UserRecord reference doc for the contents of userRecord.
				console.log("Successfully created new user:", userRecord.uid, email, password);
				res.redirect(303, userRecord.uid);
			})
			.catch(function(error) {
				console.log("Error creating new user:", error);
			});
	})

});

exports.startPhase1 = functions.https.onRequest(function(req, res) {

	// Grab the text parameter.
	console.log(req)
	var email = req.body.email;
	var password = req.body.password;
	// Push the new message into the Realtime Database using the Firebase Admin SDK.
	admin.auth().createUser({
		email: email,
		password: password,
	})
		.then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log("Successfully created new user:", userRecord.uid, email, password);
			res.redirect(303, userRecord.uid);
		})
		.catch(function(error) {
			console.log("Error creating new user:", error);
		});

});

exports.createPhase = functions.auth.user().onCreate(function (event){
	var user = event.data;
	admin.database().ref('/phase1').push()
		.then(function(snapshot){
			var userRef = admin.database().ref('/users/'+ user.uid)
			console.log(snapshot.key);
			userRef.set({phase1ID:snapshot.key});
		});
});

exports.checkOperation = functions.database.ref('/phase1/{pushId1}/operations/{pushId2}/userAnswer')
	.onWrite(function (event) {
		var SCORE_BASE = 10000

		var ref = event.data.adminRef;
		var params = event.params;
		var operationKey = ref.parent.key;
		var userID = ref.parent.parent.parent.key
		var timeStamp = admin.database.ServerValue.TIMESTAMP;
		ref.parent.child("answerTimestamp").set(timeStamp);

		return admin.database().ref('/phase1/'+userID+'/operations').once("value", function (snapshot) {
			var timeStampVal = snapshot.child(operationKey + "/answerTimestamp").val();

			var correctAnswer = snapshot.child(operationKey + "/correctAnswer").val();
			var score = 0, bonusTime = 0
			var numChildren = parseInt(operationKey) + 1
			if(event.data.val() === correctAnswer){
				score = SCORE_BASE;
				var createTime = parseInt(snapshot.child(operationKey + "/timestamp").val())
				var timeDiff = parseInt(timeStampVal) - createTime;
				bonusTime = getBonusTime(timeDiff)

				if(numChildren >= 3){
					var countCorrect = 1
					for(var index = numChildren - 2; index > numChildren - 4; index--){
						var pastValue = snapshot.child(index)
						if((pastValue.child("score").val() === SCORE_BASE)&&(!pastValue.child("bonusTriple").exists())){
							countCorrect++;
						}else{
							countCorrect = 0;
							break;
						}

					}
					if(countCorrect === 3){
						ref.parent.child("bonusTriple").set(SCORE_BASE * 2);
					}
				}
			}
			ref.parent.child("score").set(score)
			ref.parent.child("bonusTime").set(bonusTime)

			var operation = generateQuestion(1)
			operation.timestamp = timeStamp

			ref.parent.parent.child(numChildren).set(operation)
		})
	});
