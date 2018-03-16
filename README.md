# Math Tournament (Yogome Tournament)

Math Tournament ahora oficialmente como Yogome Tournament es una aplicacion que permite (actualmente) dos usuarios con sus respectivos dispositovos comunicarse con un tercer dispositivo que seria el host. Con el objetivo de concursar a un duelo o batalla de conocimientos. El host muestra una pregunta y el usuario que conteste la pregunta correctamente y más rapido realizara un ataque a su adversario reduciendo sus puntos de vida, el usuario que se quede sin puntos de vida al final del combate pierde y el que sobrevive gana. 

## Firebase

Math Tournament es construido usando el Api firebase de google que permite el uso de una base de datos en tiempo real cpm actualizaciones de informacion tanto del lado del servidor como del cliente al instante. El cual funciona como una continua comunicacion entre los jugadores y el host.

La aplicacion se divide en dos partes, la parte del cliente el client.js y el server.js.

### Estructura base  de datos

* 99063
* 99491
	* data  
		* correctAnswer: 26  
		* opedator: "+"
		* operand1: 48	
		* operand2: "?"
		* result: 74
	* gameEnded
		* winner: 1
	* gameReady: true
	* p1
		* avatar: "estrella"
		* life: 100
		* nickname: "Hanna"
		* ready: true

	* p1answer
		* time: 30487
		* value: 26
	* p2
		* avatar: "estrella"
		* life: 0
		* nickname: "Sofia"
		* ready: true
	* p2answer
		* time: 27568
		* value: 30
	* possibleAnswers
		* 0: 30
		* 1: 26
		* 2: 22
	* retry: false
	* time: 180000
	* winner
		* answers
			* p1
				* time: 30487
				* value: 26
			* p2
				* time: 27568
				* value: 30
			* date: 932
			* numPlayer: 1

La estructura de la base de datos es similar a la estructura de un json, cada dato tiene su valor ya sea númerico o de string, o puede valer otro conjunto 

### Eventos y Funciones Firebase

***self.refIdGame.once('value').then(function(snapshot) { ... })***

el refIdGame es la referencia de la base de datos, que puede ser a un campo especifico en la estructura de la base de datos.

Once es que escucha solo una vez si se metio un nuevo valor a la base de datos y dispara una funcion donde el objecto de captura se encuentra en el parametro snapshot, y para obtener su valor se obtiene con un get de .val de la siguiente forma ***ej snapshot.val() *** la captura tambien puede servir para obtener otros datos como la referencia de donde se llamo. En este caso ***snapshot.val()*** es el que nos interesa pues con esto podemos obtener los valores de los datos que se mandan, como son las operaciones y las respuestas.

***self.refIdGame.child("data").on('value', function(snapshot)***

El refIdGame tambien puede accesar

### Client.js

El client.js que se encuentra dentro de la carpeta MathTournament es la conexión con el api de firebase a los eventos y callbacks necesarios para la comunicación del juego de parte del jugador que seria el clienta al host que seria el servidor.

**Client.start(player, idGame, onError)**
