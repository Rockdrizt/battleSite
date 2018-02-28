var current_set = "EASY"
var difficultSet = operationGenerator.RULES_SET[current_set]
var ruleSet
var OPERATORS = ["SUM", "SUB", "MUL", "DIV"]
var DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "MASTER"]
var operatorsObject = {}

for (var dif = 0; dif < DIFFICULTIES.length; dif++) {
	var difName = DIFFICULTIES[dif]
	operatorsObject[difName] = {}
	for (var i = 0; i < OPERATORS.length; i++) {
		var operator = OPERATORS[i]
		operatorsObject[difName][operator] = {disable: false}
	}
}

var printOperators = function() {
	for (var i = 0; i < OPERATORS.length; i++) {
		var operator = OPERATORS[i]

		if(operatorsObject[current_set][operator].disable){
			$("#checkBox" + (i + 1)).attr("selection", 0);
			$("#checkBox" + (i + 1)).find(".markCheck").css("display", "none");
		}else {
			$("#checkBox" + (i + 1)).attr("selection", 1);
			$("#checkBox" + (i + 1)).find(".markCheck").css("display", "block");
		}

		$("#checkBox" + (i + 1)).click(function () {

			if ($(this).attr("selection") == 1) {
				$(this).find(".markCheck").css("display", "none");
				$(this).attr("selection", 0)
				var type = $(this).data("type")
				operatorsObject[current_set][type].disable = true
			} else {
				$(this).find(".markCheck").css("display", "block");
				$(this).attr("selection", 1)
				var type = $(this).data("type")
				operatorsObject[current_set][type].disable = false
			}
		});
	}
}
printOperators()

//var totalSum =  easy.sum

function printRule(rule, operator){
	var string = ""

	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.operand1)
		string += "?"
	else if(rule.operand1X) {

		for (var index = 0; index < rule.operand1X; index++){
			string += "X"
		}

	}else if(rule.operand1Const){
		string += rule.operand1Const
	}

	switch (operator){
		case "SUM":
			string+=" + "
            $(".headerDifficulty").find("p").text("ADDITION")
			break
		case "SUB":
			string+=" - "
            $(".headerDifficulty").find("p").text("SUBSTRACTION")
			break
		case "MUL":
			string+=" x "
            $(".headerDifficulty").find("p").text("MULTIPLICATION")
			break
		case "DIV":
			string+=" ÷ "
            $(".headerDifficulty").find("p").text("DIVISION")
			break
	}

	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.operand2)
		string += "?"
	else if(rule.operand2X) {

		for (var index = 0; index < rule.operand2X; index++){
			string += "X"
		}
	}else if(rule.operand2Const){
		string += rule.operand2Const
	}

	if(rule.paramToAnswer === operationGenerator.OPERATION_PARAMS.result)
		string += " = ?"
	else {
		string += " = X"
	}

	var operationExample = operationGenerator.getOperationRule(rule, operator)
	var symbol = (operationExample.operator === "/" ? "÷" : operationExample.operator)
	string += " (Example: " + operationExample.operand1 + " " + symbol + " " + operationExample.operand2 + " = " + operationExample.result + ")"

	var minRange = rule.minRange || 1
	var maxRange = rule.maxRange || 1

	string += "<br> Answer Range: " + minRange + " - " + maxRange

	return string
}

function getRules(operator) {
    
	$(".choiceOptions").html("")

	ruleSet = difficultSet[operator]
	for (var p = 0; p <= ruleSet.length - 1; p++) {
		var rule = ruleSet[p]

		$(".choiceOptions")
			.append(' <div id="operation' + p + '" class="optionOperations">' +
				'<div class="operation">' + printRule(rule, operator) + '</div>' +
				'<div id="checkChoice' + p + '"  class="checkChoice" data-num="' + p +'">' +
				'<img src="assets/images/blank_check.png"> ' +
				'<img class="markCheck" src="assets/images/mark_check.png"> ' +
				'</div> ' +
				'</div>');

    	if(!rule.disable)
			$("#checkChoice" + p).attr("selection",1);
    	else {
			console.log("disable rule")
			$("#checkChoice" + p).find(".markCheck").css("display","none");
			$("#checkChoice" + p).attr("selection", 0);
		}


	$("#checkChoice" + p).click(function(){

		if($(this).attr("selection") == 1){
			$(this).find(".markCheck").css("display","none");
			$(this).attr("selection",0)
			var num = $(this).data("num")
			ruleSet[num].disable = true
            //aqui para guardar el deseleccionado
		}else{
			$(this).find(".markCheck").css("display","block");
			$(this).attr("selection",1)
			$(this).data("num")
			var num = $(this).data("num")
			ruleSet[num].disable = false
            //aqui para guardar el seleccionado
		}
	});


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

var difficultyNameLevel = 0;
    
    function levelDifficulty(difficultyNameLevel){
        switch(difficultyNameLevel){
            case 0:
               $("#difficultyName").find("span").text("EASY");
                current_set = "EASY"
            break; 
            case 1:
               $("#difficultyName").find("span").text("MEDIUM");
                current_set = "MEDIUM"
            break;
            case 2:
               $("#difficultyName").find("span").text("HARD");
                current_set = "HARD"
            break;
            case 3:
               $("#difficultyName").find("span").text("MASTER");
                current_set = "MASTER"
            break;
                
        }
		difficultSet = operationGenerator.RULES_SET[current_set]
		printOperators()
    }
    
    $(".prevDifficulty").click(function(){
        if(difficultyNameLevel >= 1){
            difficultyNameLevel--
        }else{
            difficultyNameLevel = 3;
        }        
        levelDifficulty(difficultyNameLevel)
    })
    
    $(".nextDifficulty").click(function(){
        if(difficultyNameLevel != 3){
            difficultyNameLevel++
        }else{
            difficultyNameLevel = 0;
        }        
        levelDifficulty(difficultyNameLevel)
    })