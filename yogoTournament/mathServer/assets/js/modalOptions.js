var current_set = "EASY"
var difficultSet = operationGenerator.RULES_SET[current_set]
var ruleSet
var OPERATORS = ["SUM", "SUB", "MUL", "DIV"]
var DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "MASTER"]
var operatorsObject = {}
var popSound = new Audio('sounds/pop.mp3');


function nextSectionButton2(){
          customRules = {}

		for(var i = 1;i<=OPERATORS.length;i++){
			var ruleSetOperator = difficultSet[OPERATORS[i-1]]

			if(!operatorsObject[current_set][OPERATORS[i-1]].disable) {
				customRules[OPERATORS[i-1]] = []
				var customRulesOperator = customRules[OPERATORS[i-1]]
				for (var j = 1; j <= ruleSetOperator.length; j++) {
					if (!ruleSetOperator[j - 1].disable)
						customRulesOperator.push(ruleSetOperator[j - 1])
				}
			}

		}

		console.log(customRules)

		$("#section4").css("display","block");
		$("#section3").css("display","none");  
}

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


	}
}



for (var i = 0; i < OPERATORS.length; i++) {
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
        
        if(
            $("#checkBox1").attr("selection") == 0 &&
            $("#checkBox2").attr("selection") == 0 &&
            $("#checkBox3").attr("selection") == 0 &&
            $("#checkBox4").attr("selection") == 0 
            
            ){
                $("#nextButton2").css("opacity",0.5);
                $("#nextButton2").unbind('click');
           }else{
               $("#nextButton2").bind('click');
                $("#nextButton2").css("opacity",1);
           }
        
        
	});
}
printOperators()

//var totalSum =  easy.sum
var operationColor;

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

	string += "<span class='highlight'>"
	switch (operator){
		case "SUM":
			string+=" + "
			$(".headerDifficulty").find("p").text("ADDITION")
			$(".headerDifficulty").css('background-color', '#912e99')
			$(".confirmOptions").css('background-color', '#912e99')
			$(".modal-body").css('background-color', '#c0b4fc')
			operationColor = '#8b7bdb'
			break
		case "SUB":
			string+=" - "
			$(".headerDifficulty").find("p").text("SUBTRACTION")
			$(".headerDifficulty").css('background-color', '#4595c0')
			$(".confirmOptions").css('background-color', '#4595c0')
			$(".modal-body").css('background-color', '#b6e9ff')
			operationColor = '#7dc1de'
			break
		case "MUL":
			string+=" x "
			$(".headerDifficulty").find("p").text("MULTIPLICATION")
			$(".headerDifficulty").css('background-color', '#c93585')
			$(".confirmOptions").css('background-color', '#c93585')
			$(".modal-body").css('background-color', '#ffb6e0')
			operationColor = '#de7db5'
			break
		case "DIV":
			string+=" ÷ "
			$(".headerDifficulty").find("p").text("DIVISION")
			$(".headerDifficulty").css('background-color', '#e6bd5f')
			$(".confirmOptions").css('background-color', '#e6bd5f')
			$(".modal-body").css('background-color', '#ffecae')
			operationColor = '#dec576'
			break
	}

	string += "</span>"

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
		string += " <span class='highlight'>=</span> ?"
	else {
		string += " <span class='highlight'>=</span> X"
	}

	var operationExample = operationGenerator.getOperationRule(rule, operator)
	var symbol = (operationExample.operator === "/" ? "÷" : operationExample.operator)
	string += "  (Example: " + operationExample.operand1 + "<span class='highlight'> " + symbol + " </span>" + operationExample.operand2 + " <span class='highlight'>=</span> " + operationExample.result + ")"

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
				'<div id="checkChoice' + p + '"  class="checkChoice" data-num="' + p +'">' +
				'<img src="assets/images/blank_check.png"> ' +
				'<img class="markCheck" src="assets/images/mark_check.png"> ' +
				'</div> ' + '<div class="operation">' + printRule(rule, operator) + '</div>' +'</div>');

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
				$("#operation" + p).css('background-color', operationColor);
        }
        
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
    //ANIMATION
});

$(".closeButton").click(function(){
	$("#modalDifficulty").hide();
    //ANIMATION
});

$(".okButton").click(function(){
	$("#modalDifficulty").hide();
    
});

var difficultyNameLevel = 0;
    
    function levelDifficulty(difficultyNameLevel){
        TweenMax.fromTo($("#difficultyName"),0.3,{scale:1.5},{scale:1});
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
        TweenMax.fromTo($(this).find("img"),0.3,{scale:1.5},{scale:1});
        if(difficultyNameLevel >= 1){
            difficultyNameLevel--
        }else{
            difficultyNameLevel = 3;
        }        
        levelDifficulty(difficultyNameLevel)
        popSound.play();
    })
    
    $(".nextDifficulty").click(function(){
        TweenMax.fromTo($(this).find("img"),0.3,{scale:1.5},{scale:1});
        if(difficultyNameLevel != 3){
            difficultyNameLevel++
        }else{
            difficultyNameLevel = 0;
        }        
        levelDifficulty(difficultyNameLevel)
        popSound.play();
    })



/*
    $(window).resize(function () {
      calculateNewScale();
    });

    calculateNewScale(); 

function calculateNewScale() {
      var percentageOn1 = $(window).width() / 1400;
$("body").css({
        "-moz-transform": "scale(" + percentageOn1 + ")",
        "-webkit-transform": "scale(" + percentageOn1 + ")",
        "transform": "scale(" + percentageOn1 + ")"
      });        
}
      
*/    
