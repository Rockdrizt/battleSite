var countQuestions = 0;
var optionLetters = ["a","b","c","d"];
var _buttonAddQuestion = $(".questions__botton--add");
var _buttonWindowConfirm = $(".window__button--confirm");
var _buttonWindowClose = $(".window__button--close");
var questionsArray = [];
var selectQuestionToDelete;

function addElementArray(number){
    questionsArray[number-1] = new Array;
    questionsArray[number-1].question = $("#questionText_" + number).val();
    questionsArray[number-1].A = $("#AnswerText_" + number + "_1").val();
    questionsArray[number-1].B = $("#AnswerText_" + number + "_2").val();
    questionsArray[number-1].C = $("#AnswerText_" + number + "_3").val();
    questionsArray[number-1].D = $("#AnswerText_" + number + "_4").val();
    questionsArray[number-1].answer = "";
}
function saveInfoinArray(){
    questionsArray = [];
    var getTotalQuestions = $(".questions__container").children().length;
    for(var i = 0;i<=getTotalQuestions-1;i++){
        questionsArray[i] = new Array;
        questionsArray[i].question = $("#questionText_" + [i+1]).val();
        questionsArray[i].A = $("#AnswerText_" + [i+1] + "_1").val();
        questionsArray[i].B = $("#AnswerText_" + [i+1] + "_2").val();
        questionsArray[i].C = $("#AnswerText_" + [i+1] + "_3").val();
        questionsArray[i].D = $("#AnswerText_" + [i+1] + "_4").val();
        for(var p = 1;p<=4;p++){
            if($("#choiceCorrect_" + [i+1] + "_" + p).attr("choice") == "true"){
                questionsArray[i].answer = $("#choiceCorrect_" + [i+1] + "_" + p).attr("index");
            }
        }
    }
    
}

function confirmDeleteQuestion(obj){
    $("#question__new_" + $(obj).attr("index") ).remove();
        countQuestions--
        var getTotalQuestions = $(".questions__container").children().length;
        var hijos = [];
        var newCount = 0;
        var newCountAnswer = 1;
        var newCountChoice = 1;
        $('section','.questions__container').each(function(){
            hijos.push($(this).attr("id"));
            var newID = $("#" + hijos[newCount]).attr("id", "question__new_" + [newCount+1] );
            hijos[newCount] = newID.attr("id");
            $("#" + hijos[newCount]).find(".questions__input").attr("id", "questionText_" + [newCount+1] ).attr("place",newCount+1 );
            $("#" + hijos[newCount]).find(".questions__number").find("span").html(newCount+1);
            $("#" + hijos[newCount]).find(".question__button--delete").attr("index",newCount+1);
            $("#" + hijos[newCount]).find(".text_limit").attr("id","limitTextQuestion_" + newCount+1);
        
             $('.answers__item',"#" + hijos[newCount]).each(function(){
                 if(newCountAnswer == 5){newCountAnswer = 1};
                 $(this).find("textarea").attr("id","AnswerText_" +[newCount+1]+"_"+ newCountAnswer)
                 newCountAnswer++;
            });  
             $('.star__image--select',"#" + hijos[newCount]).each(function(){
                 if(newCountChoice == 5){newCountChoice = 1};
                 $(this).attr("id","choiceCorrect_" +[newCount+1]+"_"+ newCountChoice).attr("place",[newCount+1]).attr("num",[newCount+1]).attr("index",newCountChoice).removeAttr('class');
                 $(this).attr('class', 'star__image--select answer__choice_' +  $(this).attr("num") );
                 newCountChoice++;
            });  
            newCount++; 
        });
    }

function addQuestion(){
    countQuestions++
    var body = $(".questions__body");
    $(".questions__container").append(`<section id= "question__new_`+ countQuestions +`" class="question__new"></section>`);
    var container = $("#question__new_" + countQuestions);
    container.append(function(){
        return $("<div/>")
            .addClass("questions__item")
            .append($("<div/>")
                    .addClass("questions__number")
                    .append($("<span/>").html(countQuestions))
                   )
            .append($("<div/>")
                 .addClass("question__section--text")  
                   .append($("<div/>")
                        .attr("id","limitTextQuestion_" + countQuestions)
                        .addClass("text_limit")
                        .attr("limit","130")
                        .html("130/130")
                    )
                    .append($("<textarea/>")
                        .attr("id","questionText_" + countQuestions)
                        .addClass("input--text questions__input")
                        .attr("place",countQuestions)
                        .attr("placeholder","Pregunta")
                        .attr("wrap","soft")
                        .attr("maxlength","130")
                        .attr("spellcheck",true)
                        .attr("rows",2)
                        .attr("cols",2)
                    )
                   )
            .append($("<div/>")
                    .addClass("load_image--load")
                    .html('<img src="img/load_image.png">')
                   )
            .append($("<div/>")
                    .addClass("load_image--load question__button--delete")
                    .attr("index",countQuestions)
                    .html('<img src="img/crash_button.png">')
                   )
    });
    
    for(var i = 1;i<=4;i++){
         container.append(function(){
        return $("<div/>")
            .addClass("answers__item")
            .append($("<div/>")
                    .addClass("answer__letter")
                    .html(optionLetters[i-1] + " )")
                    )
            .append($("<div/>")
                    .addClass("question__section--text")
                    .append($("<div/>")
                            .attr("id","limitTextAnswer_"+countQuestions+"_"+i)
                            .addClass("text_limit__answer")
                            .attr("limit","70")
                            .html("70/70")
                           )
                    .append($("<textarea/>")
                            .attr("id","AnswerText_"+countQuestions+"_"+i)
                            .addClass("input--text answer__input")
                            .attr("placeholder","Respuesta " + optionLetters[i-1])
                            .attr("place",countQuestions)
                            .attr("wrap","soft")
                            .attr("maxlength","70")
                            .attr("answerNumber",i)
                            .attr("spellcheck",true)
                            .attr("rows",1)
                            .attr("cols",2)
                           )
                   )
             .append($("<div/>")
                    .attr("id","choiceCorrect_" + countQuestions + "_" + i)
                    .addClass("star__image--select")
                    .addClass("answer__choice_" + countQuestions)
                    .attr("index",i)
                    .attr("num",countQuestions)
                    .attr("choice",false)
                    .append($("<div/>")
                            .addClass("circle--select")
                            .html('<img src="img/bg_select_answer.png">')
                           )
                    )
         });
        //choice correct
            $( "#choiceCorrect_" + countQuestions + "_" + i  ).click(function(){
                $(".answer__choice_" + $(this).attr("num")).find("img").attr("src","img/bg_select_answer.png");
                $(".answer__choice_" + $(this).attr("num")).attr("choice",false);
                $(this).attr("choice",true);
                $(this).find("img").attr("src","img/correct_select.png");
            });
        //change text limit of answers
            $( "#AnswerText_" + countQuestions + "_" + i  ).on('input',function(e){
                var valueAnswer = $( this ).val().length;
                var limitAnswerText = $("#limitTextAnswer_" + $( this ).attr("place") +"_"+ $( this ).attr("answerNumber") );
                var restAnswerLimit =  parseInt(limitAnswerText.attr("limit")) - valueAnswer;
                limitAnswerText.text( restAnswerLimit  +"/70");
          })
    }
    //delete question
    $("#question__new_" + countQuestions).find(".question__button--delete").click(function(){
        $(".window__contain").css("display","block");
        selectQuestionToDelete = this       
        $(".window__message").find("span").html("¿Estás seguro de eliminar la pregunta "+ $(this).attr("index")  +"?");
    });
    //scroll animate 
    body.animate({scrollTop: (body.height() * countQuestions)},"2000"); 
    //change text limit of question
    $( "#questionText_" + countQuestions ).on('input',function(e){
        var value = $( this ).val().length;
        var limitText = $("#limitTextQuestion_" + $( this ).attr("place"));
        var restLimit =  parseInt(limitText.attr("limit")) - value;
        limitText.text( restLimit  +"/130")
  })  
    addElementArray(countQuestions);
}

//BUTTONS ACTIONS
_buttonAddQuestion.click(function(){
    addQuestion();
});

_buttonWindowConfirm.click(function(){
    confirmDeleteQuestion(selectQuestionToDelete);
    $(".window__contain").css("display","none");
})

_buttonWindowClose.click(function(){
    $(".window__contain").css("display","none");
})
