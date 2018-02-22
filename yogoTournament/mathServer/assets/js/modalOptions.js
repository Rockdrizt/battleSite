
for(var i = 1;i<=4;i++){
	$("#checkBox" + i).attr("selection",1);

	$("#checkBox" + i).click(function(){

		if($(this).attr("selection") == 1){
			$(this).find(".markCheck").css("display","none");
			$(this).attr("selection",0)
		}else{
			$(this).find(".markCheck").css("display","block");
			$(this).attr("selection",1)
		}
	});
}

//var totalSum =  easy.sum

function printRule(rule, operator){
	var string = ""

	if(operator === "MUL")
		string += "("
	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.operand1)
		string += "?"
	else if(rule.operand1X) {

		for (var index = 0; index < rule.operand1X; index++){
			string += "X"
		}

	}else if(rule.operand1Const){
		string += rule.operand1Const
	}
	if(operator === "MUL")
		string += ")"

	switch (operator){
		case "SUM":
			string+="+"
			break
		case "SUB":
			string+="-"
			break
		case "MUL":
			string+=""
			break
		case "DIV":
			string+="÷"
			break
	}

	if(operator === "MUL")
		string += "("
	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.operand2)
		string += "?"
	else if(rule.operand2X) {

		for (var index = 0; index < rule.operand2X; index++){
			string += "X"
		}
	}else if(rule.operand2Const){
		string += rule.operand1Const
	}
	if(operator === "MUL")
		string += ")"

	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.result)
		string += "=?"
	else {
		string += "=X"
	}

	if(rule.minRange) {
		string += " Min " + rule.minRange
	}

	if(rule.maxRange) {
		switch (operator){
			case "SUM":
				string += " Max Sum " + rule.maxRange
				break
			case "SUB":
				string += " Max Difference " + rule.maxRange
				break
			case "MUL":
				string += " Max Product " + rule.maxRange
				break
			case "DIV":
				string += " " + rule.maxRange
				break
		}
	}

	return string
}

function getRules(operator) {

	$(".choiceOptions").html("")

	var ruleSet = operationGenerator.RULES_SET[current_set][operator]
	for (var p = 0; p <= ruleSet.length - 1; p++) {
		var rule = ruleSet[p]

		$(".choiceOptions")
			.append(' <div id="operation' + p + '" class="optionOperations">' +
				'<div class="operation">' + printRule(rule, operator) + '</div>' +
				'<div class="checkChoice">' +
				'<img src="assets/images/blank_check.png"> ' +
				'<img class="markCheck" src="assets/images/mark_check.png"> ' +
				'</div> ' +
				'</div>');


		if (p % 2 === 0) {
			console.log(p)
			$("#operation" + p).addClass("optionPar");
		}
	}
}

$("#modalDifficulty").hide();
$(".showModal").click(function(){
	var operator = $(this).data("type")
	getRules(operator)
	$("#modalDifficulty").show();
});

$(".closeButton").click(function(){
	$("#modalDifficulty").hide();
});

var current_set = "EASY"