const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createPhase = functions.auth.user().onCreate(function (event){
	var user = event.data;
	admin.database().ref('/phase1').push()
		.then(function(snapshot){
			var userRef = admin.database().ref('/users/'+ user.uid)
			console.log(snapshot.key);
			userRef.set({phase1ID:snapshot.key});
		});
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
