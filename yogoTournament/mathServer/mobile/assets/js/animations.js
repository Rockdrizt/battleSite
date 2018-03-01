


/*TweenMax.fromTo($("#Obj"),1,{alpha:0},{alpha:1,ease:Back.easeOut,delay:1,onComplete:NextFunction})*/


function shine(){
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
}


function scaleButtons(){
    TweenMax.fromTo($(".createGame"),0.3,{scale:0},{scale:1,ease:Back.easeOut});
    TweenMax.fromTo($(".joinGame"),0.3,{scale:0},{scale:1,ease:Back.easeOut,delay:0.1});
}

function animation1(){
        TweenMax.to($(".createGame"),1,{x:"-50%",ease:Back.easeOut,onComplete:Next1});
        TweenMax.to($(".joinGame"),0.5,{scale:0,ease:Linear.easeNone});
        TweenMax.to($(".containerMainText"),0.5,{scale:0,ease:Back.easeIn});
}

function Next1(){
    $(".createGame").hide();
    TweenMax.to($("#logo"),1,{y:"100%",ease:Back.easeInOut});
    TweenMax.to($(".yogo-oona"),1,{x:"100%",ease:Back.easeInOut});
    TweenMax.to($(".yogo-arturius"),1,{x:"-100%",ease:Back.easeInOut});
    TweenMax.set('.yogo-oona',{'-webkit-filter':'brightness(0%)',delay:0.5}); 
    TweenMax.set('.yogo-arturius',{'-webkit-filter':'brightness(0%)',delay:0.5});  
    TweenMax.to($(".yogo-oona"),1,{alpha:0,delay:0.5});
    TweenMax.to($(".yogo-arturius"),1,{alpha:0,delay:0.5});
    TweenMax.to($("#logo"),1,{alpha:0,scale:4,delay:1.5,onComplete:Next2}); 
    //TweenLite.set($("#naoMain"), {clearProps:"all",delay:1.5});
}

function Next2(){
   window.location.href= 'selectSubject.html';
}

function backAnimate1(){
    window.location.href='index.html'
    scaleButtons();
}
