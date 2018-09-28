
var riddles = function(){

	var questions
	var testQuestions
	var usedQuestions
	var NUMBER_OF_FAKE_ANSWERS = 3
    var usedTestQuestions

	var TIME_ATTACKS = {
		1 : {
            ultra : 6500,
            super : 13000,
            normal : 20000
		},
		2 : {
            ultra : 20000,
            super : 30000,
            normal : 60000
		}
	}

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
		testQuestions = []
		usedQuestions = []
        usedTestQuestions = []
		loadQuestions()
		loadTestQuestions()
		//operationGenerator.setConfiguration()
	}

	function loadQuestions(){

		var list = rawList

		for(var k = 0; k < list.length; k++){

			var subList = list[k]
			var gradeList = []
			var timeIndex = 1

			for(var i = 0; i < subList.length; i++){

				var element = subList[i]

				var answers = [element.A, element.B, element.C, element.D]
				var correctValue = answers[element.answer - 1]

				i == subList.length - 1 ? timeIndex = 2 : timeIndex = 1
                var lastQuestion = i == subList.length - 1 ? true : false

				if(element.imgExist)
					var imagePath = settings.BASE_PATH + "/images/questionDB/grade" + element.grade + "/" + element.image + ".png"
				else
					var imagePath = settings.BASE_PATH + "/images/questionDB/default.png"
					
				var obj = {
					question: element.question,
					existImage : element.imgExist,
					src: imagePath,
					image: element.image,
					answers: answers,
					grade: element.grade,
					level: element.level,
					correctAnswer: element.answer - 1,
					timers: TIME_ATTACKS[timeIndex],
					index: i,
					correctValue: correctValue,
                    lastQuestion: lastQuestion
					//correctIndex:
				}
				gradeList.push(obj)
			}
			questions.push(gradeList)
		}
		// console.log("questions loaded")
	}

	function loadTestQuestions(){

		if(!rawListTest)
			return

		var list = rawListTest

		for(var i = 0; i < list.length; i++){

			var element = list[i]

			var answers = [element.A, element.B, element.C, element.D]
			var correctValue = answers[element.answer - 1]
            var lastQuestion = i == list.length - 1 ? true : false

			if(element.imgExist)
				var imagePath = settings.BASE_PATH + "/images/questionDB/grade" + element.grade + "/" + element.image + ".png"
			else
				var imagePath = settings.BASE_PATH + "/images/questionDB/default.png"
				
			var obj = {
				question: element.question,
				existImage : element.imgExist,
				src: imagePath,
				image: element.image,
				answers: answers,
				grade: element.grade,
				level: element.level,
				correctAnswer: element.answer - 1,
				timers: TIME_ATTACKS[1],
				index: i,
				correctValue: correctValue,
                lastQuestion: lastQuestion
				//correctIndex:
			}
			testQuestions.push(obj)
		}
		// console.log("test questions loaded")
	}

	function getQuestion(grade){

		if(grade == -1){
            
            var lastTestQuestion = testQuestions.length - 1
			var rand
			var newTestQuestion
            
            if(usedTestQuestions.length == lastTestQuestion){
				//usedQuestions = []
                console.log("last test question")
				usedTestQuestions.push(lastTestQuestion)
				newTestQuestion =  testQuestions[lastTestQuestion]
				//getQuestion(grade)
			}
            else if(usedTestQuestions.length > lastTestQuestion){
				return getOperation()
                
            }
            else{
                do{
					rand = game.rnd.integerInRange(0, lastTestQuestion - 1)
				}while(usedTestQuestions.includes(rand))
				
				usedTestQuestions.push(rand)
                newTestQuestion = testQuestions[rand]
            }
            return newTestQuestion
		}
		else{

			var lastQuestion = questions[grade].length - 1
			var rand
			var newQuestion

			if(usedQuestions.length == lastQuestion){
				//usedQuestions = []
                console.log("last question")
				usedQuestions.push(lastQuestion)
				newQuestion =  questions[grade][lastQuestion]
				//getQuestion(grade)
			}
			else if(usedQuestions.length > lastQuestion){
				return getOperation()
			}
			else{
				do{
					rand = game.rnd.integerInRange(0, lastQuestion - 1)
				}while(usedQuestions.includes(rand))
				
				usedQuestions.push(rand)
				newQuestion = questions[grade][rand]
			}
			
			return newQuestion
		}
	}

	function getOperation(){

		var operation = operationGenerator.generate()
		var correctAnswer = operation.correctAnswer

		var possibleAnswers = [correctAnswer]
		var negativeOrPositive = Math.round(Math.random()) * 2 - 1;
		for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS - 1; i++){
			var diff = Math.floor(correctAnswer / 10) > 1 ? 10 : 1
			// 	while(possibleAnswers.includes(n)){
			negativeOrPositive = negativeOrPositive * -1
			var n = correctAnswer + diff * negativeOrPositive
			possibleAnswers.push(n)
		}
		var n = game.rnd.integerInRange(possibleAnswers[1] , possibleAnswers[2])
		possibleAnswers.push(n)
		

		// var possibleAnswers = [correctAnswer];
		// var range = correctAnswer <= 10 ? correctAnswer : correctAnswer * 0.1
		// for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
		// 	do{
		// 		var diff = game.rnd.integerInRange(-range, range)
		// 		var n = correctAnswer + diff
		// 	}while(possibleAnswers.includes(n) && n != 0)
			
		// 	possibleAnswers.push(n);
		// }

		Phaser.ArrayUtils.shuffle(possibleAnswers)

		var question
		if(operation.operator === "/"){
			question = operation.operand1 + " ÷ " + operation.operand2 + " = " + operation.result
		}else{
			question = operation.operand1 + " " + operation.operator + " " + operation.operand2 + " = " + operation.result
		}

		var TIMES = {
            ultra : 800,
            super : 15000,
            normal : 30000
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
			correctAnswer: correctAnswer,
			timers: TIMES,
			correctAnswer: possibleAnswers.indexOf(correctAnswer),
			correctValue: correctAnswer
			//index: i,
		}

		return riddle
    }
    
    function allQuestionsUsed(grade){
       
        if(grade == -1){
            
            var lastQuestion = testQuestions.length
        
            return (usedTestQuestions.length == lastQuestion)
        } 
        else{
             var lastQuestion = questions[grade].length
        
            return (usedQuestions.length == lastQuestion)
        }
    }

	return{
		initialize:initialize,
		getOperation:getOperation,
		getQuestion:getQuestion,
        allQuestionsUsed:allQuestionsUsed,
	}
}()