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
				{operand1X: 1, operand2X: 1, minRange: 1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 1, operand2X: 1, minRange: 1, maxRange: 9, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 1, operand2X: 1, minRange: 1, maxRange: 19, paramToAnswer:OPERATION_PARAMS.result},
				{operand1Const: 10, operand2X: 1, minRange: 11, maxRange: 19, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange: 11, maxRange: 104, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange: 11, maxRange: 104, paramToAnswer:OPERATION_PARAMS.operand2},
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
		},

		MEDIUM:{
			SUM:[
				{operand1X: 2, operand2Const: 10, minRange:20, maxRange: 109, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:20, maxRange: 50, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:20, maxRange: 50, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 2, operand2X: 2, minRange:51, maxRange: 198, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:51, maxRange: 198, paramToAnswer:OPERATION_PARAMS.result},
			],
			SUB:[
				{operand1X: 2, operand2Const: 10, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 3, operand2X: 1, minRange:91, maxRange: 990, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 1, minRange:91, maxRange: 990, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			MUL:[
				{operand1X: 2, operand2Const: 10, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 2, minRange:0, maxRange: 89, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 3, operand2X: 1, minRange:91, maxRange: 990, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 1, minRange:91, maxRange: 990, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			DIV:[
				{operand1X: 2, operand2X: 1, minRange:99, maxRange: 990, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 2, operand2X: 1, minRange:99, maxRange: 990, paramToAnswer:OPERATION_PARAMS.operand2},
			]
		},

		HARD:{
			SUM:[
				{operand1X: 3, operand2X: 1, minRange:101, maxRange: 1008, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 1, minRange:101, maxRange: 1008, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 3, operand2Const: 10, minRange:110, maxRange: 1009, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 3, operand2X: 2, minRange:110, maxRange: 1098, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 2, minRange:110, maxRange: 1098, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			SUB:[
				{operand1X: 3, operand2X: 2, minRange:90, maxRange: 989, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 2, minRange:90, maxRange: 989, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 4, operand2X: 1, minRange:991, maxRange: 9998, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 1, minRange:991, maxRange: 9998, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			MUL:[
				{operand1X: 3, operand2X: 1, minRange:100, maxRange: 8991, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2Const: 10, minRange:1000, maxRange: 9990, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 3, operand2X: 2, minRange:90, maxRange: 98901, paramToAnswer:OPERATION_PARAMS.result},
			],
			DIV:[
				{operand1X: 3, operand2X: 1, minRange:100, maxRange:999, paramToAnswer:OPERATION_PARAMS.result},
			]
		},

		MASTER:{
			SUM:[
				{operand1X: 4, operand2Const: 10, minRange:1010, maxRange: 10009, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 2, minRange:1010, maxRange: 10098, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 2, minRange:1010, maxRange: 10098, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 4, operand2X: 3, minRange:1100, maxRange: 10998, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 3, minRange:1100, maxRange: 10998, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			SUB:[
				{operand1X: 4, operand2X: 2, minRange:990, maxRange: 9900, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 2, minRange:990, maxRange: 9900, paramToAnswer:OPERATION_PARAMS.operand2},
				{operand1X: 4, operand2X: 3, minRange:900, maxRange: 9000, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 3, minRange:900, maxRange: 9000, paramToAnswer:OPERATION_PARAMS.operand2},
			],
			MUL:[
				{operand1X: 4, operand2X: 1, minRange:1000, maxRange: 89991, paramToAnswer:OPERATION_PARAMS.result},
				{operand1X: 4, operand2X: 2, minRange:10000, maxRange: 989901, paramToAnswer:OPERATION_PARAMS.result},
			],
			DIV:[
				{operand1X: 3, operand2X: 2, minRange:10, maxRange:99, paramToAnswer:OPERATION_PARAMS.result},
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

	// function checkRule(rule, operand1, operand2, operator){
	//
	// 	var operation = {operand1:operand1, operand2:operand2, operator:operator}
	// 	var result = makeOperation(operation)
	//
	// 	var minRange = rule.minRange || MIN_RANGE_DEFAULT
	// 	if(operand1 > rule.maxRange)
	// 		operand1 = operand1 - minRange
	// 	if(operand2 > rule.maxRange)
	// 		operand2 = operand2 - minRange
	//
	// 	if ((rule.maxRange) && (result > rule.maxRange)) {
	// 		if(operator === "SUM" || operator === "SUB") {
	// 			var dif = rule.maxRange - result
	// 			console.log(dif)
	// 			if (operand2 > operand1)
	// 				operand2 = Math.abs(operand2 + dif)
	// 			else
	// 				operand1 = Math.abs(operand1 + dif)
	// 		}else if(operator === "MUL"){
	// 			if (operand2 > operand1)
	// 				operand1 = Math.ceil(rule.maxRange / operand2)
	// 			else
	// 				operand2 = Math.ceil(rule.maxRange / operand1)
	// 		}else{
	// 			operand1 = result
	// 			operand2 = (operand1 / operand2) > rule.maxRange ? rule.maxRange : operand2
	// 		}
	// 		//63: 9 60 / 8
	// 	}
	//
	// 	var minRange = rule.minRange || MIN_RANGE_DEFAULT
	// 	console.log(result, minRange)
	// 	if (result < minRange) {
	// 		if(operator === "SUM" || operator === "SUB") {
	// 			var dif = minRange - result
	// 			console.log(dif)
	// 			if (operand1 > operand2) {
	// 				operand1 = operand1 + dif
	// 			} else {
	// 				operand2 = operand2 + dif
	// 			}
	// 		}else if(operator === "MUL"){
	// 			if (operand2 < operand1)
	// 				operand1 = Math.ceil(minRange / operand2)
	// 			else
	// 				operand2 = Math.ceil(minRange / operand1)
	// 		}
	// 	}
	//
	// 	operation = {operand1:operand1, operand2:operand2, operator:operator}
	// 	result = makeOperation(operation)
	// 	operation.result = result
	//
	// 	return operation
	// }

	//when you need a random operand and you dont know the other operand yet
	function getFirstOperand(operand1X, operand2X, operator, rule) {
		var limitOperandMax = Math.pow(10, operand1X) - 1
		var limitOperandMin = Math.pow(10, operand1X - 1)
		var maxOperand2 = Math.pow(10, operand2X) - 1
		var minOperand2 = Math.pow(10, operand2X - 1)
		var maxOperand, minOperand
		// var minOperand2 = rule.operand2Const || Math.pow(10, operandX - 1)

		switch (operator){
			case "SUM":
				minOperand = rule.minRange - maxOperand2
				minOperand = minOperand < limitOperandMin ? limitOperandMin : minOperand
				maxOperand = rule.maxRange - minOperand2
				maxOperand = maxOperand > limitOperandMax ? limitOperandMax : maxOperand
				break
			case "SUB":
				break
		}

		return Math.floor(Math.random() * (maxOperand - minOperand)) + minOperand
	}

	//when you know the result of other operand
	function getSecondOperand(knownOperand, operandX, rule, operator) {
		var limitOperandMin = Math.pow(10, operandX - 1)
		var limitOperandMax = Math.pow(10, operandX) - 1
		var minOperand, maxOperand

		switch (operator){
			case "SUM":
				minOperand = rule.minRange - knownOperand
				console.log(rule.minRange, knownOperand, minOperand)
				minOperand = minOperand < limitOperandMin ? limitOperandMin : minOperand
				maxOperand = rule.maxRange - knownOperand
				maxOperand = maxOperand > limitOperandMax ? limitOperandMax : maxOperand
				break
		}
		console.log(knownOperand, "Min: " + minOperand, "Max: " + maxOperand)

		var operand = Math.floor(Math.random() * (maxOperand - minOperand)) + minOperand

		return operand
	}

	function getMinMaxOperands(rule, operator){

		var operand2, operand1
		if(rule.operand2Const){
			operand2 = rule.operand2Const
			operand1 = getSecondOperand(operand2, rule.operand1X, rule, operator)
		}else{
			operand1 = rule.operand1Const || getFirstOperand(rule.operand1X, rule.operand2X, operator, rule)
			operand2 = getSecondOperand(operand1, rule.operand2X, rule, operator)
		}

		return {operand1:operand1, operator:operator, operand2:operand2}
	}

	// function checkRule(operand, operator, rule, min, max) {
	// 	var otherOperand
	// 	var minOperand, maxOperand
	//
	// 	switch (operator){
	// 		case "MUL":
	// 			minOperand = Math.floor(rule.minRange / operand)
	// 			minOperand = minOperand < 1 ? 1 : minOperand
	// 			maxOperand = Math.floor(rule.maxRange / operand)
	// 			break
	// 		case "SUM":
	// 			minOperand = Math.floor(rule.minRange - operand)
	// 			maxOperand = Math.floor(rule.maxRange - operand)
	// 			break
	// 		case "SUB":
	// 			minOperand = Math.floor(rule.minRange + operand + 1)
	// 			maxOperand = Math.floor(rule.maxRange + operand + 1)
	// 			console.log("sub", min, max)
	// 			break
	// 		case "DIV":
	// 			minOperand = Math.floor(rule.minRange * operand)
	// 			maxOperand = Math.floor(rule.maxRange * operand)
	//
	// 	}
	// 	minOperand = minOperand > min ? min : minOperand
	// 	maxOperand = maxOperand > max ? max : maxOperand
	// 	console.log(minOperand, maxOperand)
	//
	// 	otherOperand = Math.floor(Math.random() * (maxOperand - minOperand)) + minOperand
	// 	return otherOperand
	// }

	function getOperationRule(rule, operator){

		var operation = getMinMaxOperands(rule, operator)
		console.log(operation)
		var answer =  makeOperation(operation)
		operation.result = answer

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
	function setConfiguration(rules, numOfOperations) {
		ruleSet = rules || RULES_SET.EASY
		currentRound = 0
		numOfOperations = numOfOperations || 32
		// currentOperator = ruleSet
		setOperators()
		numPerOperator = Math.floor(numOfOperations / operatorsList.length)

		// return getOperationRule(ruleSet.DIV[1], "DIV")
	}

	return{
		RULES_SET:RULES_SET,
		setConfiguration:setConfiguration,
		OPERATION_PARAMS:OPERATION_PARAMS,
		generate:generate,
		getOperationRule:getOperationRule
	}
}()