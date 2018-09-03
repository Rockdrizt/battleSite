
var riddles = function(){

	var questions
	var usedQuestions
	var NUMBER_OF_FAKE_ANSWERS = 3

	function initialize(){

		questions = [
			/*{
			   "question": "En un cine había sesenta y cuatro personas y han entrado diecisiete más. ¿Cuántas personas hay ahora en el cine?",
				"existImg": "false",
				"image": "",
				"A": "Ochenta y uno",
				"B": "Setenta y uno",
				"C": "Cuarenta y siete",
				"D": "Cincuenta y siete",
				"answer": 1,
				"level": 5,
				"grade": 2
			}*/
		]
		usedQuestions = []
		loadQuestions()
		//operationGenerator.setConfiguration()
	}

	function loadQuestions(){

		var list = rawList

		for(var i = 0; i < list.length; i++){

			var element = list[i]

			if(element.existImg)
				var imagePath = "../../images/questionDB/grade" + element.grade + "/" + element.image + ".png"
			else
				var imagePath = "../../images/questionDB/default.png"
				
			var obj = {
				question: element.question,
				existImage : element.existImg,
				src: imagePath,
				image: element.image,
				answers: [element.A, element.B, element.C, element.D],
				grade: element.grade,
				level: element.level,
				correctAnswer: element.answer - 1,
				//index: i,
				//correctIndex:
			}
			questions.push(obj)
		}
		console.log("questions loaded")
	}

	function getQuestion(){
	
	    if(usedQuestions.length == questions.length){
	        usedQuestions = []
	        getQuestion()
	    }
	    else{
	        do{
	            var rand = Math.floor(Math.random() * questions.length)
	        }while(usedQuestions.includes(rand))
	
	        usedQuestions.push(rand)
			var newQuestion = questions[rand]

			return newQuestion
	    }
	}

	function getOperation(){

		var operation = operationGenerator.generate()
		var correctAnswer = operation.correctAnswer

		var possibleAnswers = [correctAnswer];
		var negativeOrPositive = Math.round(Math.random()) * 2 - 1;
		for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
			var diff = Math.floor(correctAnswer / 10) > 1 ? 10 : 1
			// 	while(possibleAnswers.includes(n)){
			negativeOrPositive = negativeOrPositive * -1
			var n = correctAnswer + diff * negativeOrPositive
			possibleAnswers.push(n);
		}

		Phaser.ArrayUtils.shuffle(possibleAnswers)

		var question
		if(operation.operator === "/"){
			question = operation.operand1 + " ÷ " + operation.operand2 + " = " + operation.result
		}else{
			question = operation.operand1 + " " + operation.operator + " " + operation.operand2 + " = " + operation.result
		}

		//TODO: correctAnswer only in server side

		var riddle = {
			question: question,
			existImage : false,
			src: "../../images/questionDB/default.png",
			image: "default",
			answers: possibleAnswers,
			grade: 10,
			level: 10,
			correctAnswer: correctAnswer
			//index: i,
		}

		return riddle
    }

	return{
		initialize:initialize,
		getOperation:getOperation,
		getQuestion:getQuestion
	}
}()
