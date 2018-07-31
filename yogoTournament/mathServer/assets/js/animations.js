function scaleButtonAnimate(obj){
    obj.mouseover(function(){
       TweenMax.fromTo(this,0.5,{scale:1},{scale:1.1,ease:Elastic.easeOut}); 
    });
    
    obj.mouseout(function(){
       TweenMax.fromTo(this,0.5,{scale:1.1},{scale:1,ease:Elastic.easeOut}); 
    });    
    
    obj.mousedown(function(){
       TweenMax.fromTo(this,0.5,{scale:1},{scale:0.9,ease:Elastic.easeOut}); 
    }); 
    obj.mouseup(function(){
       TweenMax.fromTo(this,0.5,{scale:0.9},{scale:1,ease:Elastic.easeOut}); 
    });  
}


function clearElements(section){
   TweenLite.set(section, {clearProps:"all"}); 
}

  scaleButtonAnimate($(".scaleButton"));

//animation 1
//TweenMax.to('html',2,{opacity:0,ease:Linear.easeNone});
TweenMax.set('#animation1',{'-webkit-filter':'brightness(0%)'});
TweenMax.set('#naoMain',{'-webkit-filter':'brightness(100%)'});
TweenMax.set('#estrellaMain',{'-webkit-filter':'brightness(100%)'});
TweenMax.to({}, 2, {
     onUpdate: function(tl){
          var tlp = (tl.progress()*100) >> 0;
          TweenMax.set('#animation1',{
               '-webkit-filter': 'brightness(' + tlp + '%)'
          });
     },
     onUpdateParams: ["{self}"], // references the tweens timeline
    delay:0,
    onComplete: scaleButtons
});


function scaleButtons(){
    TweenMax.to($("#createGame"),0.3,{scale:1,ease:Back.easeOut});
    TweenMax.to($("#joinGame"),0.3,{scale:1,ease:Back.easeOut,delay:0.1});
}

function animation1(){
        TweenMax.to($("#createGame"),1,{x:"50%",ease:Back.easeOut,onComplete:Next1});
        TweenMax.to($("#joinGame"),0.5,{scale:0,ease:Linear.easeNone});
        TweenMax.to($(".containerMainText"),0.5,{scale:0,ease:Back.easeIn});
}

function Next1(){
    $("#createGame").hide();
    TweenMax.to($("#logo"),1,{y:"50%",ease:Back.easeInOut});
    TweenMax.to($("#naoMain"),1,{x:"100%",ease:Back.easeInOut});
    TweenMax.to($("#estrellaMain"),1,{x:"-100%",ease:Back.easeInOut});
    TweenMax.set('#naoMain',{'-webkit-filter':'brightness(0%)',delay:0.5});   
    TweenMax.set('#estrellaMain',{'-webkit-filter':'brightness(0%)',delay:0.5});  
    TweenMax.to($("#naoMain"),1,{alpha:0,delay:0.5});
    TweenMax.to($("#estrellaMain"),1,{alpha:0,delay:0.5});
    TweenMax.to($("#logo"),1,{alpha:0,scale:4,delay:1.5,onComplete:Next2}); 
    //TweenLite.set($("#naoMain"), {clearProps:"all",delay:1.5});
}

function Next2(){
    $("#animation1").css("display","none");
    $("#section2").css("display","block");    
    clearElements("#section1 div");
}


function backAnimate1(){
    $("#animation1").css("display","block");
    $("#section2").css("display","none");
    scaleButtons();
}
