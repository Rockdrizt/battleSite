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
    questionsArray[number-1].answer1 = $("#AnswerText_" + number + "_1").val();
}
function saveInfoinArray(){
    var getTotalQuestions = $(".questions__container").children().length;
    for(var i = 0;i<=getTotalQuestions-1;i++){
        questionsArray[i].question = $("#questionText_" + [i+1]).val();
        questionsArray[i].answer1 = $("#AnswerText_" + [i+1] + "_1").val();
    }
}


function confirmDeleteQuestion(obj){
    $("#question__new_" + $(obj).attr("index") ).remove();
        countQuestions--
        var getTotalQuestions = $(".questions__container").children().length;
        var hijos = []
        $('section','.questions__container').each(function(){
           hijos.push($(this).attr("id"));
        });
        for(var p = 0;p<getTotalQuestions;p++){  
            $("#" + hijos[p]).attr("id", "question__new_" + [p+1] );
            var element = $(".questions__container").children()[p].id;
            $("#" + element).find(".questions__number").find("span").html([p+1]);
            $("#" + element).find(".question__button--delete").attr("index",[p+1]);
        }
    
}




function addQuestion(){
    countQuestions++
    var body = $(".questions__body");
    $(".questions__container").append(`<section id= "question__new_`+ countQuestions +`" class="question__new"></section>`);
    var container = $("#question__new_" + countQuestions)
    container.append(`  
       <div class="questions__item">
                        <div class="questions__number"><span>`+countQuestions+`</span></div>
                        <div class="question__section--text">
                            <div id="limitTextQuestion_`+countQuestions+`" class="text_limit" limit="130">130/130</div>
                            <textarea id="questionText_`+ countQuestions +`" class="input--text questions__input" place="`+countQuestions+`" placeholder="Pregunta" wrap="soft" maxlength="130" spellcheck="true" rows="2" cols="2" ></textarea>
                        </div>
                        <div class="load_image--load"><img src="img/load_image.png"></div>
                        <div class="load_image--load question__button--delete" index="`+countQuestions+`"><img src="img/crash_button.png"></div>
                    </div>`);
        for(var i = 1;i<=4;i++){
            container.append(`
                <div class="answers__item">
                            <div class="answer__letter">`+optionLetters[i-1]+`)</div>
                            <div class="question__section--text">
                                <div id="limitTextAnswer_`+countQuestions+`_`+i+`" class="text_limit__answer" limit="70">70/70</div>
            <textarea id="AnswerText_`+countQuestions+`_`+i+`" class="input--text answer__input" placeholder="respuesta `+optionLetters[i-1]+`" rows="1" cols="2" place="`+countQuestions+`" answerNumber="`+i+`" maxlength="70" spellcheck="true"></textarea>
                            </div>
                            <div id="choiceCorrect_`+countQuestions+`_`+i+`" class="star__image--select answer__choice_`+countQuestions+`" index="`+countQuestions+`">
                                <div class="circle--select"></div>
                                <img src="img/bg_select_answer.png">
                            </div>
                        </div> 
            `);
            //choice correct
            $( "#choiceCorrect_" + countQuestions + "_" + i  ).click(function(){
                $(".answer__choice_" + $(this).attr("index")).find("img").attr("src","img/bg_select_answer.png")
                $(this).find("img").attr("src","img/correct_select.png")
            });
            
            //change text limit of answers
            $( "#AnswerText_" + countQuestions + "_" + i  ).on('input',function(e){
                var valueAnswer = $( this ).val().length;
                var limitAnswerText = $("#limitTextAnswer_" + $( this ).attr("place") +"_"+ $( this ).attr("answerNumber") );
                var restAnswerLimit =  parseInt(limitAnswerText.attr("limit")) - valueAnswer;
                limitAnswerText.text( restAnswerLimit  +"/70")
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
