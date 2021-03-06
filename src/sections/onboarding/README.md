# Math Tournament (Yogome Tournament)

Math Tournament ahora oficialmente como Yogome Tournament es una aplicacion que permite (actualmente) dos usuarios con sus respectivos dispositovos comunicarse con un tercer dispositivo que seria el host. Con el objetivo de concursar a un duelo o batalla de conocimientos. El host muestra una pregunta y el usuario que conteste la pregunta correctamente y más rapido realizara un ataque a su adversario reduciendo sus puntos de vida, el usuario que se quede sin puntos de vida al final del combate pierde y el que sobrevive gana. 

## Firebase

Math Tournament es construido usando el Api firebase de google que permite el uso de una base de datos en tiempo real cpm actualizaciones de informacion tanto del lado del servidor como del cliente al instante. El cual funciona como una continua comunicacion entre los jugadores y el host.

La aplicacion se divide en dos partes, la parte del cliente el client.js y el server.js.

### Estructura base  de datos

La estructura de la base de datos es similar a la estructura de un json, cada dato tiene su valor ya sea númerico o de string, o puede valer otro conjunto datos con sus respectivos valores y asi sucesivamente. Firebase te deja modificar su valor de cualquiera de esos campos, agregar nuevos valores o borrarlos respectivamente, cada cambio se refleja inmediatamente en el servidor en el firebase asi mismo como del lado del cliente, si es que el cliente por medio del api esta escuchando los cambios que suceden dentro de la base de datos.

Esta es la estructura que se usa en MathTournament

* 99063
* 99491
	* data  
		* correctAnswer: 26  
		* opedator: "+"
		* operand1: 48	
		* operand2: "?"
		* result: 74
		* date: 1257201
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
	* rules
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

El primer campo es el valor numerico gameID, que indicara el numero de la sesion a la cual el jugador se debe unir a la partida, basicamente es el ID del juego o de la batalla con sus propios jugadores y estadisticas.

El data, son los datos de la pregunta que el servidor va mandar al cliente, en este caso enfocado a las matematicas, se manda la operación. Se manda el date por si la pregunta por alguna razón vuelve a ser la misma, firebase solo dispara el evento si el dato es completamente nuevo y diferente al que estaba anteriormente puesto.

GameEnded sirve para detectar si el juego termino y quien fue el ganador, esto funciona para mandar al cliente su pantalla de resultados.

GameReady es el handshake para indicar que los usuarios estan listos y el juego esta cargado y listo para jugarse.

P1 y P2 es la información del jugador 1 y 2 respectivamente.

P1answer y p2answer son las respuestas de los jugadores en el respectivo tiempo que tardaron.

PossibleAnswers, las opciones que los jugadores van a visualizar para responder, una de esas es la correcta.

Retry es para indicar y llamar el evento al cliente de que se reinicio el juego, esto mantiene la sesión y evita que el jugador tenda que volver a poner el pin, hay dos tipos de reincio, dependiendo del valor si es "inBattle" se reincia el juego llevandolo directamente a la batalla y respetando la misma configuración del juego, otro es "inLobby" esto indica que lo lleva nuevamente a la pantalla de la configuración del juego y que tanto los jugadores como las opciones se puedan cambiar sin la necesidad de un nuevo gameId.

Time es el tiempo asignado a la batalla.

Rules son reglas especificas que afectan a la generacion de la pregunta (ej. solo sumas y restas cuyo resultado es del 1 al 9, etc.)

Winner: cuando se reciben las respuestas de cada jugador junto con su respectivo valor y tiempo que se tardo en responder (p1answer y p2answer), la parte del host (script server.js) calcula quien es el ganador, genera la comparación en tiempo y respuesta correcta y manda el numero de jugador ganador (1 o 2) más los datos de respuesta nuevamente para que en el mismo evento se puedan recibir. //TODO: No es necesario escribir los datos de las respuestas nuevamente, se puede capturar el dato de las respuestas (p1answer, p2answer) haciendo un llamado a la referencia, hay que cambiarlo.


### Eventos y Funciones Firebase

***self.refIdGame.once('value').then(function(snapshot) { ... })***

el refIdGame es la referencia de la base de datos, que puede ser a un campo especifico en la estructura de la base de datos.

Once es que escucha solo una vez si se metio un nuevo valor a la base de datos y dispara una funcion donde el objecto de captura se encuentra en el parametro snapshot, y para obtener su valor se obtiene con un get de .val de la siguiente forma ***ej snapshot.val()*** la captura tambien puede servir para obtener otros datos como la referencia de donde se llamo. En este caso ***snapshot.val()*** es el que nos interesa pues con esto podemos obtener los valores de los datos que se mandan, como son las operaciones y las respuestas.

***self.refIdGame.child("data").on('value', function(snapshot)***

El refIdGame tambien puede accesar el hijo de un dato en especifico y crear un listener unicamente si el valor de ese campo en especifico cambia, en caso de ***.on()*** es que siempre esta escuchando y no solo una vez como en ***once()***

***self.refIdGame.child("p1").set(player);***

El **.set()** es para modificar o agregar un valor al campo de la base de datos.

## Client.js

El client.js que se encuentra dentro de la carpeta MathTournament es la conexión con el api de firebase a los eventos y callbacks necesarios para la comunicación del juego de parte del jugador que seria el cliente al host que seria el servidor.

var client = new Client()

para inicializar el cliente

**client.start(player, idGame, onError)**

Se le mandan los parametros de los datos del jugador, el id del juego mas un callback de si se encontro un error, esta funcion siempre se llama al momento de que el usuario inserta el pin y sus datos. Esta funcion revisa el gameId y asigna el numero del jugador a la base de datos.

### Eventos:

client.addEventListener("showEquation", function(){...})

**('onClientInit',[])** Se dispara cuando el jugador inicializa y empieza a capturar sus datos a la base del firebase

**('showEquation',[data])** Se dispara al detectar una nueva ecuación, o cuando el valor de data en el servidor cambia, esto es para disparar la funcion del dibujado de la pregunta, manda la operación.

**('showPossibleAnswers',[possibleAnswers])** Al igual que el anterior se dispara cuando el valor de possibleAnswers se cambia y manda las opciones.

**('onTurnEnds',[values])** Cuando se detecta el cambio de valor en el campo **winner** en la base de datos se dispara el evento de que el turno termino y manda el numero del jugador que gano el turno más las respuestas de cada uno de los jugadores.

**('onGameEnds',[gameEnded])** Se dispara el evento de cuando la batalla termina y manda el numero de jugador que gano que se inserta en el game.

**('onGameFull',[])** Indica que la sesión del juego llego a su limite de jugadores.

### Callbacks:

client.startGame = function(){...}

**startGame()** callback que se dispara al momento de generar el handshake del campo gameReady, este valor se cambia a true, cuando el juego ya esta cargado y listo para jugarse.

**restartGame(String send)** callback que se dispara al detectar que se intenta reiniciar el juego. Parametros: String send (opcional): si el valor de send es igual a "inBattle" significa que se reinicia la batalla, si es diferente se manda al inicio de la pagina manteniendo el mismo gameId del juego.

### Funciones:

**buttonOnClick(int value, int time):** función para escribir en la base de datos, los valores de lo que respondio el jugador. Parametros: value el valor de la respuesta y time el tiempo en milisegundos de lo que se tardo en contestar.

**setReady(boolean value):** manda que el jugador esta listo para iniciar la partida.


## Server.js

El server es el host que muestra la batalla y su estatus actual, se encarga de enviar las operaciones al cliente, y escuchar las respuestas del cliente.

Para iniciar el servidor

**sever.start(currentId, onStart, params)** currentId es un parametro opcional, es para indicar que se conecta a una sesión especificada en dado caso que no se mande, se crea un nuevo ID. El onStart es un callback que se llama cuando se encuentra un nuevo ID (esto para mostrar el pin cuando se encuentra uno, hay que recordar que la comunicación es asincrona. Los parametros es la configuración que se quiere asignar a la partida, como es el tiempo, las reglas y las rondas. TODO: Aun no se agregan las rondas a la configuración.


### Eventos:

**('onPlayerDisconnect', [{numPlayer:numPlayer, player: valoresPlayer] }]** Evento que indica que el jugador se desconecto y manda el numero del jugador que se desconecto y la informacion del jugador.


**('onInitPlayer', [{numPlayer: numPlayer, player: valoresPlayer}]);** Evento que indica que se conecto un jugador al host.

**('onPlayersReady', [valores])** Evento que indica que ya los dos jugadores se conectaron y estan listos para empezar la partida.

### Callbacks:

**startGame()** Cuando cada jugador esta en la pantalla de (Ready...) y esta listo para jugar llama a la función de startGame() para que el sever ya inicie el juego.

### Funciones:

**server.setGameReady(boolean value)** El handshake para indicar que el juego está listo (o no si manda un false como valor) para que en caso de que el valor sea true, cada jugador pueda iniciar sus respectivas cargas.

**server.retry(String location)** Llamar a que se reinicia la batalla, dependiendo del parametro location que indica a que parte del sitio se desea mandar, ya sea de regreso en la misma batalla respetando las mismas configuraciones o de regreso al lobby solo guardando el gameId. ("inBattle" o "inLobby" por default se manda "inLobby")

**server.setGameEnded(numPlayer)** Para indicar que el juego ya termino y se manda como parametro el numero del jugador que gano. Esto para notificar a los jugadores del lado del cliente que el juego termino y quien fue el ganador.






