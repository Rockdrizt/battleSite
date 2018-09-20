var previusTeam;
var selectTeam;
var idGameFromHash = window.location.hash.substr(1);
var idGame = idGameFromHash;
var teamId = 1
var service = new ScreenService()
service.start(idGame, teamId, showTeam,animateAnswer)


function showTeam(team){ //team is an array
    for(var i = 0; i<=team.length -1 ; i ++){
        if((team[i].avatar && previusTeam && previusTeam[i].avatar != team[i].avatar) || (!previusTeam && team[i].avatar)) {
           ChoiceYogotar("#animation" + [i+2],team[i].avatar) 
        }
    }
    previusTeam = team;
}

function animateAnswer(winner){
    console.log("ok")
    console.log(winner)
}


function ChoiceYogotar(parent,obj){
 $(parent).find(".yogotar").find("img").attr("src","vectores/" + obj + ".svg" );
    TweenMax.fromTo($(parent).find(".yogotar").find("img"),0.5,{top:"1080px"},{top:"0px",ease:Back.easeOut,delay:1});
}


function correctAnswer(parent){  
    TweenMax.fromTo($(parent).find(".gradient--green"),0.5,{height:"0px",top:"1080px"},{height:"1080px",top:"0px"})
    TweenMax.fromTo($(parent).find(".gradient--green"),0.5,{height:"1080px",top:"0px"},{height:"0px",top:"1080px",delay:1})
    TweenMax.fromTo($(parent).find(".correct--icon"),0.5,{alpha:0,top:"300px"},{alpha:1,top:"200px"});
    TweenMax.to($(parent).find(".correct--icon").find("img"),0.2,{scaleY:"-=0.1", yoyo:true, repeat:5}); 
    TweenMax.fromTo($(parent).find(".correct--icon"),0.5,{alpha:1,top:"200px"},{alpha:0,top:"100px",delay:1});
}    
        
function wrongAnswer(parent){
    TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"0px",top:"1080px"},{height:"1080px",top:"0px"});
    TweenMax.fromTo($(parent).find(".gradient--red"),0.5,{height:"1080px",top:"0px"},{height:"0px",top:"1080px",delay:1});
    TweenMax.fromTo($(parent).find(".wrong--icon"),0.5,{alpha:0,top:"100px"},{alpha:1,top:"200px"});
    TweenMax.to($(parent).find(".wrong--icon").find("img"),0.2,{scaleY:"-=0.1", yoyo:true, repeat:5}); 
    TweenMax.fromTo($(parent).find(".wrong--icon"),0.5,{alpha:1,top:"200px"},{alpha:0,top:"300px",delay:1});
    TweenMax.to($(parent).find(".yogotar").find("img"),0.05,{x:"-=100", yoyo:true, repeat:9});
}    
            
function animateBlob(parent,time1,time2){    
    TweenMax.fromTo($(parent).find(".blobV1"),time1,{scale:0.8,y:500,x:50},{y:-200,delay:1,repeat:-1});
    TweenMax.fromTo($(parent).find(".blobV2"),time2,{scale:0.5,y:600,x:200},{y:-200,repeat:-1});
    TweenMax.fromTo($(parent).find(".blobV3"),time2,{scale:0.3,y:600,x:230},{y:-200,repeat:-1,delay:1});
    TweenMax.to($(parent).find(".blobV4"),time1,{y:"+=20",repeat:-1,delay:2});              
}    
        
        
TweenLite.set($(".correct--icon"),{transformOrigin: "50% 50% 0"});       
TweenLite.set($(".blobAnimate"),{transformOrigin: "50% 50% 0"});
TweenLite.set($(".st0"),{y:140});    
TweenMax.fromTo($(".base1"),3,{x:300},{x:300,yoyo:true,repeat:-1});
TweenMax.fromTo($(".blobAnimate"),2,{rotation:0},{rotation:360,repeat:-1,ease:Back.easeNone});
        
animateBlob("#animation1",5,6);
animateBlob("#animation2",3,5);
animateBlob("#animation3",5,6);
animateBlob("#animation4",4,3);
animateBlob("#animation5",5,7);