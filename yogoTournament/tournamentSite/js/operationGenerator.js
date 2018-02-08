var operationGenerator = function () {

	var LEVELS = {
		EASY:{min: 1, max:10},
		MEDIUM:{min:10, max:100},
		HARD:{min:100, max:1000},
		MASTER:{min:1000, max:1000000}
	}

	var range
	var opedators

	function generate() {

		var opedator = Math.floor((Math.random() * opedators.length ) );
		console.log(opedator)
		var correctAnswer, operand1, operand2
		switch(opedator){
			case 2: // -
				opedator = "-";
				operand1= Math.floor((Math.random() * range.max ) )+range.min;
				operand2= Math.floor((Math.random() * range.max ) )+range.min;
				if(operand1< operand2){
					var aux = operand1;
					operand1 = operand2;
					operand2 = aux;
				}
				correctAnswer = operand1 - operand2;
				break;
			case 3: // x
				opedator = "x";
				operand1= Math.floor((Math.random() * 10 ) + 12 );
				operand2= Math.floor((Math.random() * 10 ) + 12 );
				correctAnswer = operand1 * operand2;
				break;
			case 4: // /
				// operand1 = dividendo, operand2 = divisor
				opedator = "/";
				operand1= Math.floor((Math.random() * 10 ) + 12 );
				operand2= Math.floor((Math.random() * 10 ) + 12);
				var aux =  operand1 * operand2;
				correctAnswer = operand1;
				operand1 = aux;
				break;
			case 1: // +
			default:
				opedator = "+";
				operand1= Math.floor((Math.random() * (range.max - 1) * 0.5 ) ) + 1;
				operand2= Math.floor((Math.random() * (range.max - 1) * 0.5 ) ) + 1;
				correctAnswer = operand1 + operand2;
				break;
		}

		return {opedator:opedator, operand1:operand1, operand2:operand2, correctAnswer:correctAnswer}
	}

	function setConfiguration(level, opedators) {
		range = LEVELS[level]
		opedators = opedators
	}

	return{
		setConfiguration:setConfiguration,
		generate:generate
	}
}()