
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

		for(var k = 0; k < list.length; k++){

			var subList = list[k]
			var gradeList = []

			for(var i = 0; i < subList.length; i++){

				var element = subList[i]

				if(element.imgExist)
					var imagePath = settings.BASE_PATH + "/images/questionDB/grade" + element.grade + "/" + element.image + ".png"
				else
					var imagePath = settings.BASE_PATH + "/images/questionDB/default.png"
					
				var obj = {
					question: element.question,
					existImage : element.imgExist,
					src: imagePath,
					image: element.image,
					answers: [element.A, element.B, element.C, element.D],
					grade: element.grade,
					level: element.level,
					correctAnswer: element.answer - 1,
					//time:DIFFICULT_RULES[level].time
					index: i,
					//correctIndex:
				}

				gradeList.push(obj)
			}
			questions.push(gradeList)
		}
		console.log("questions loaded")
	}

	function getQuestion(grade){
	
		var lastQuestion = questions[grade].length - 1
		var rand
		var newQuestion

	    if(usedQuestions.length == lastQuestion){
			usedQuestions = []
			console.log("last")
			newQuestion =  questions[grade][lastQuestion]
			//getQuestion(grade)
	    }
	    else{
	        do{
	            rand = game.rnd.integerInRange(0, lastQuestion - 1)
	        }while(usedQuestions.includes(rand))
			
			console.log(rand)
	        usedQuestions.push(rand)
			newQuestion = questions[grade][rand]
		}
		
		return newQuestion
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
