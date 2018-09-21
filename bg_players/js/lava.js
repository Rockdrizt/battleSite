var previusTeam;
var selectTeam;
var idGameFromHash = window.location.hash.substr(1);
var idGame = idGameFromHash;
var teamId = parseInt(getParameterByName("team"));
console.log(idGame)
var service = new ScreenService();
service.start(idGame, teamId, showTeam,animateAnswer,hitToLife)


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function showTeam(team){ //team is an array
    for(var i = 0; i<=team.length -1 ; i ++){
        if((team[i].avatar && previusTeam && previusTeam[i].avatar != team[i].avatar) || (!previusTeam && team[i].avatar)) {
           ChoiceYogotar("#animation" + [i+2],team[i].avatar) 
        }
    }
    previusTeam = team;
}

function animateAnswer(answer){
    switch(answer){
        case 0: correctAnswer("#animation3");correctAnswer("#animation2");correctAnswer("#animation4");
            break;
            
        case 1:
            goodAnswer("#animation3");goodAnswer("#animation2");goodAnswer("#animation4");
            break;
            
        case 2:
            wrongAnswer("#animation3");wrongAnswer("#animation2");wrongAnswer("#animation4");
            break;       
    }
}

function hitToLife(teamHit){
    if(teamHit == teamId){
       hitYogotar("#animation2");hitYogotar("#animation3");hitYogotar("#animation4");
       }
    
}

function ChoiceYogotar(parent,obj){
    if(teamId == 1){
         $(parent).find(".yogotar").find("img").attr("src","vectores/alpha/" + obj + ".svg" );
    }else{
         $(parent).find(".yogotar").find("img").attr("src","vectores/bravo/" + obj + ".svg" );
    }
    TweenMax.fromTo($(parent).find(".yogotar").find("img"),0.5,{top:"1080px"},{top:"0px",ease:Back.easeOut,delay:1});
}



function correctAnswer(parent){  
    TweenMax.fromTo($(parent).find(".gradient--green"),0.5,{height:"0px",top:"1344px"},{height:"1344px",top:"0px"})
    TweenMax.fromTo($(parent).find(".gradient--green"),0.5,{height:"1344px",top:"0px"},{height:"0px",top:"1344px",delay:1})
    TweenMax.fromTo($(parent).find(".correct--icon"),0.5,{alpha:0,top:"300px"},{alpha:1,top:"200px"});
    TweenMax.to($(parent).find(".correct--icon").find("img"),0.2,{scaleY:"-=0.1", yoyo:true, repeat:5}); 
    TweenMax.fromTo($(parent).find(".correct--icon"),0.5,{alpha:1,top:"200px"},{alpha:0,top:"100px",delay:1});
}    
        
function wrongAnswer(parent){
    TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"0px",top:"1344px"},{height:"1344px",top:"0px"});
    TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"1344px",top:"0px"},{height:"0px",top:"1344px",delay:1});
    TweenMax.fromTo($(parent).find(".wrong--icon"),0.5,{alpha:0,top:"100px"},{alpha:1,top:"200px"});
    TweenMax.to($(parent).find(".wrong--icon").find("img"),0.2,{scaleY:"-=0.1", yoyo:true, repeat:5}); 
    TweenMax.fromTo($(parent).find(".wrong--icon"),0.5,{alpha:1,top:"200px"},{alpha:0,top:"300px",delay:1});
    TweenMax.to($(parent).find(".yogotar").find("img"),0.05,{x:"-=100", yoyo:true, repeat:9});
}   

function goodAnswer(parent){
    TweenMax.fromTo($(parent).find(".gradient--yellow"),0.5,{height:"0px",top:"1344px"},{height:"1344px",top:"0px"});
    TweenMax.fromTo($(parent).find(".gradient--yellow"),0.5,{height:"1344px",top:"0px"},{height:"0px",top:"1344px",delay:1});
    TweenMax.fromTo($(parent).find(".good--icon"),0.5,{alpha:0,top:"100px"},{alpha:1,top:"200px"});
    TweenMax.to($(parent).find(".good--icon").find("img"),0.2,{scaleY:"-=0.1", yoyo:true, repeat:5}); 
    TweenMax.fromTo($(parent).find(".good--icon"),0.5,{alpha:1,top:"200px"},{alpha:0,top:"300px",delay:1});
}    

        
function hitYogotar(parent){
    //TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"0px",top:"1344px"},{height:"1344px",top:"0px"});
    //TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"1344px",top:"0px"},{height:"0px",top:"1344px",delay:2,onComplete:removeClassYogotar});
    TweenMax.to($(parent).find(".yogotar").find("img"),0.05,{x:"-=100", yoyo:true, repeat:11,onComplete:removeClassYogotar});
    $(parent).find(".yogotar").addClass("hitYogotar");
    function removeClassYogotar(){
     $(parent).find(".yogotar").removeClass("hitYogotar");   
    }
}  
            
function animateBlob(parent,time1,time2){    
    TweenMax.fromTo($(parent).find(".blobV1"),time1,{scale:0.8,y:500,x:50},{y:-200,delay:1,repeat:-1});
    TweenMax.fromTo($(parent).find(".blobV2"),time2,{scale:0.5,y:600,x:200},{y:-200,repeat:-1});
    TweenMax.fromTo($(parent).find(".blobV3"),time2,{scale:0.3,y:600,x:230},{y:-200,repeat:-1,delay:1});
    TweenMax.to($(parent).find(".blobV4"),time1,{y:"+=20",repeat:-1,delay:2});              
}    
       
createSVGElement= function(element) {
    return $(document.createElementNS('http://www.w3.org/2000/svg', element));
}


function selectColorTeam(){
    var GradientBar= createSVGElement('linearGradient')
        .attr( {
            id:"SVGID_1_",
            gradientUnits:"userSpaceOnUse",
            x1:"192",
            y1:"1",
            x2:"92",
            y2:"436.365"
        });

    var myDefs = createSVGElement('defs');
    if(teamId == 1){
        $("#teamLogo").attr("src","img/alpha_team.png");
        createSVGElement('stop')
        .attr({
            offset:"8.514761e-04",
            "stop-color":"#2AD8FF"
        }).appendTo(GradientBar);        
      createSVGElement('stop')
        .attr({
            offset: "1",
            "stop-color": "#FF1E79"
        }).appendTo(GradientBar);         
        
    }else{
        $("#logoCuantrix").attr("src","img/beta_team.png");
        $("#teamLogo").attr("src","img/logo.png");
        createSVGElement('stop')
            .attr({
                offset: "4.514761e-04",
                "stop-color": "#FF1E79"
            })
            .appendTo(GradientBar);
        createSVGElement('stop')
            .attr({
                offset:"1",
                "stop-color":"#2AD8FF"
            }).appendTo(GradientBar);
    }


    $('svg defs').prepend(GradientBar);
    $('svg').prepend(myDefs);
    $('svg defs').prepend(GradientBar);
    
}
var example = $("#animate2").find(".yogotar").find("img")
TweenLite.to(example, 2, { fill: "rgb(255,0,255)" });
        
TweenLite.set($(".correct--icon"),{transformOrigin: "50% 50% 0"}); 
TweenLite.set($(".blobAnimate"),{transformOrigin: "50% 50% 0"});
TweenLite.set($(".st0"),{y:270});    
TweenMax.fromTo($(".base1"),3,{x:300},{x:300,yoyo:true,repeat:-1});
TweenMax.fromTo($(".blobAnimate"),2,{rotation:0},{rotation:360,repeat:-1,ease:Back.easeNone});
        
animateBlob("#animation1",5,6);
animateBlob("#animation2",3,5);
animateBlob("#animation3",5,6);
animateBlob("#animation4",4,3);
animateBlob("#animation5",5,7);
selectColorTeam();