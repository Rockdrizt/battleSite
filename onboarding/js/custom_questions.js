var countQuestions = 1;
var optionLetters = ["a","b","c","d"];

function addQuestion(){
    countQuestions++
    $(".questions__body").append(`
        <hr>
       <div class="questions__item">
                        <div class="questions__number"><span>`+countQuestions+`</span></div>
                        <div class="question__section--text">
                            <div class="text_limit">0/130</div>
                            <input  class="input--text questions__input" placeholder="Pregunta `+countQuestions+`">
                        </div>
                        <div class="load_image--load"><img src="img/load_image.png"></div>
                    </div>`);
        for(var i = 1;i<=4;i++){
            $(".questions__body").append(`
                <div class="answers__item">
                            <div class="answer__letter">`+optionLetters[i-1]+`)</div>
                            <div class="question__section--text">
                                <div class="text_limit__answer">0/70</div>
                                <input   class="input--text answer__input" placeholder="respuesta `+optionLetters[i-1]+`">
                            </div>
                            <div class="star__image--select">
                                <div class="circle--select"></div>
                                <img src="img/circle_select.png">
                            </div>
                        </div> 
            `);
        }
                     
}