


var riddles = function(){
    
    var questions = [
        /*{
            question: `Eagle tiene dos amigos, Nao y Oona. ¿Cuántos dedos en pies y manos tienen los tres amigos en total?`,
            src: "images/questions/imagen.png",
            image: `imagen.png`,
            answers: [{text:1, correct:false}, {text:5, correct:false}, {text:2, correct:true}, {text:3, correct:false}],
            index: 0,
            grade: 1,
        }*/
    ]
    
    function loadQuestions(){
        
        var list = rawList
        
        for(var i = 0; i < list.length; i++){
            
            var element = list[i]
            
            var obj = {
                question: element[0],
                src: "images/questions/" + element[1],
                image: element[1],
                answers: [],
                grade: element[7],
                index: i,
            }
            
            for(var k = 0; k < 4; k++){
                
                var option = {
                    text: element[k+2],
                    correct: element[k+2] == element[6] ? true : false
                }
                obj.answers.push(option)
            }
            questions.push(obj)
        }
        console.log("questions loaded")
    }
    
    function selectQuestion(usedQuestions){
        
        if(usedQuestions.length == questions.length)
            return -1
            
        do{
            var rand = Math.floor(Math.random() * questions.length)
        }while(usedQuestions.includes(rand))
        
        return questions[rand]
    }
    
    return{
        loadQuestions:loadQuestions,
        selectQuestion:selectQuestion
    }
    
}()
