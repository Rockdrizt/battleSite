var operationGenerator = function () {

	var OPERATION_PARAMS = {
		operand1:"operand1",
		operand2:"operand2",
		result:"result"
	}

	var MIN_RANGE_DEFAULT = 2

	//operandX means how many digits
	//operandConst means a constant number
	var RULES_SET = {
		EASY: {
			SUM: [
				{operand1X: 1, operand2X: 1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 1, operand2X: 1, maxRange: 19, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, maxRange: 19, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, maxRange: 104, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, maxRange: 104, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 2, operand2X: 1, minRange: 11, maxRange: 108, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange: 11, maxRange: 108, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			SUB: [
				{operand1X: 1, operand2X: 1, minRange: 0, maxRange: 8, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange: 0, maxRange: 8, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1Const: 10, operand2X: 1, minRange: 1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange: 1, maxRange: 98, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange: 1, maxRange: 98, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			MUL: [
				{operand1X: 1, operand2X: 1, minRange: 1, maxRange: 50, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange: 1, maxRange: 50, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1Const: 10, operand2X: 1, minRange: 0, maxRange: 90, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange: 50, maxRange: 90, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange: 50, maxRange: 90, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			DIV: [
				{operand1X: 1, operand2X: 1, minRange:1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange:1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.operand2},
			]
		}
	}

	var ruleSet = RULES_SET.EASY
	var currentRound
	var numOfOperations = 32
	var numPerOperator
	var currentOperator
	var operatorsList
	var counterOperators

	function getMultiplies(number) {
		var array = []
		for(var index = 2; index < number; index++){
			if(number % index === 0)
				array.push(number)
		}
		return array
	}

	function setOperators() {
		operatorsList = []
		counterOperators = {}

		for(var operator in ruleSet){
			operatorsList.push(operator)
			counterOperators[operator] = 0
		}
	}

	function makeOperation(operation) {

		var operand1 = operation.operand1
		var operand2 = operation.operand2
		var operator = operation.operator
		var answer

		switch (operator){
			case "SUM":
				answer = (operand1 + operand2)
				break
			case "SUB":
				if(operand1 < operand2){
					var aux = operand2
					operand2 = operand1
					operand1 = aux
				}
				answer = (operand1 - operand2)
				break
			case "MUL":
				answer = (operand1 * operand2)
				break
			case "DIV":
				if(operand1 < operand2){
					var aux = operand1
					operand1 = operand2
					operand2 = aux
				}
				var diff = operand1 % operand2
				if(diff > 0)
					operand1 = operand1 + (operand2 - diff)
				console.log(operand1, operand2, "DIV")
				answer = (operand1 / operand2)
				break
		}

		operation.operand1 = operand1
		operation.operand2 = operand2
		return answer

	}

	function checkRule(rule, operand1, operand2, operator){

		var operation = {operand1:operand1, operand2:operand2, operator:operator}
		var result = makeOperation(operation)

		if ((rule.maxRange) && (result > rule.maxRange)) {
			if(operator === "SUM" || operator === "SUB") {
				var dif = rule.maxRange - result
				console.log(dif)
				if (operand2 > operand1)
					operand2 = operand2 + dif
				else
					operand1 = operand1 + dif
			}else if(operator === "MUL"){
				if (operand2 > operand1)
					operand1 = Math.floor(rule.maxRange / operand2)
				else
					operand2 = Math.floor(rule.maxRange / operand1)
			}else{
					operand1 = result
					operand2 = (operand1 / operand2) > rule.maxRange ? rule.maxRange : operand2
			}
			//63: 9 60 / 8
		}

		var minRange = rule.minRange || MIN_RANGE_DEFAULT
		console.log(result, minRange)
		if (result < minRange) {
			if(operator === "SUM" || operator === "SUB") {
				var dif = minRange - result
				console.log(dif)
				if (operand1 > operand2) {
					operand1 = operand1 + dif
				} else {
					operand2 = operand2 + dif
				}
			}else if(operator === "MUL"){
				if (operand2 > operand1)
					operand1 = Math.floor(minRange / operand2)
				else
					operand2 = Math.floor(minRange / operand1)
			}
		}

		operation = {operand1:operand1, operand2:operand2, operator:operator}
		result = makeOperation(operation)
		operation.result = result

		return operation
	}

	function getOperationRule(rule, operator){

		var operand1

		if(rule.operand1X) {
			var maxOperand1 = Math.pow(10, rule.operand1X) - 1
			var minOperand1 = Math.pow(10, rule.operand1X - 1) - 1
			minOperand1 = minOperand1 < 1 ? 1 : minOperand1
			console.log(maxOperand1, minOperand1)
			operand1 = Math.floor(Math.random() * (maxOperand1 - minOperand1)) + minOperand1
		}else if(rule.operand1Const){
			operand1 = rule.operand1Const
		}else {
			console.warn("operand 1 not found in rule")
			return
		}

		var operand2

		if(rule.operand2X) {
			var maxOperand2 = Math.pow(10, rule.operand2X) - 1
			var minOperand2 = Math.pow(10, rule.operand2X - 1) + 1
			operand2 = Math.floor(Math.random() * (maxOperand2 - minOperand2)) + minOperand2
		}else if(rule.operand2Const){
			operand2 = rule.operand2Const
		}else {
			console.warn("operand 2 not found in rule")
			return
		}

		var operation =  checkRule(rule, operand1, operand2, operator)

		switch(rule.paramToAnswer){
			case (OPERATION_PARAMS.result):
				operation.correctAnswer = operation.result
				operation.result = "?"
				break
			case OPERATION_PARAMS.operand1:
				operation.correctAnswer = operation.operand1
				operation.operand1 = "?"
				break
			case OPERATION_PARAMS.operand2:
				operation.correctAnswer = operation.operand2
				operation.operand2 = "?"
				break
		}

		switch(operator){
			case "SUM":
				operation.operator = "+"
				break
			case "SUB":
				operation.operator = "-"
				break
			case "MUL":
				operation.operator = "x"
				break
			case "DIV":
				operation.operator = "/"
				break
		}

		return operation

	}

	function generate() {

		// var operatorNum = Math.floor(currentRound / numPerOperator) % operatorsList.length
		var rndOperator = Math.floor(Math.random() * operatorsList.length);
		var operator = operatorsList[rndOperator]
		var rules = ruleSet[operator]
		var operationsPerRule = Math.ceil(numPerOperator / rules.length)
		var ruleNum = Math.floor((counterOperators[operator] % numPerOperator) / operationsPerRule) % rules.length
		var rule = rules[ruleNum]

		counterOperators[operator]++

		return getOperationRule(rule, operator)
	}

//numOfOperations is the theorical number of minimal operations per level based on time
	function setConfiguration(ruleSet, numOfOperations) {
		ruleSet = RULES_SET.EASY
		currentRound = 0
		numOfOperations = numOfOperations || 32
		currentOperator = ruleSet
		setOperators()
		numPerOperator = Math.floor(numOfOperations / operatorsList.length)

		// return getOperationRule(ruleSet.DIV[1], "DIV")
	}

	return{
		setConfiguration:setConfiguration,
		generate:generate
	}
}()