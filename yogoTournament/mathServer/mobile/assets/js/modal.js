// Get the modal
var modal = document.getElementById('modal');
var warningModal = document.getElementById('warningModal');

 var blurElement = {a:10};
    TweenMax.to(blurElement, 0, {a:0, onUpdate:applyBlur});

    function applyBlur(){
        TweenMax.set(['.container'], {webkitFilter:"blur(" + blurElement.a + "px)",filter:"blur(" + blurElement.a + "px)"});  
    };

    

// When the user clicks the button, open the modal 
$(".plus-btn").click(function() {
    TweenMax.to(blurElement, 1, {a:10, onUpdate:applyBlur});  
    modal.style.display = "block";
	var operator = $(this).data("type")
	getRules(operator)
    console.log(operator)
});

$(".warning").click(function() {
    warningModal.style.display = "block";
});

$(".close-btn").click(function() {
    modal.style.display = "none";
});

$(".ok-btn").click(function() {
    TweenMax.to(blurElement, 0.2, {a:0, onUpdate:applyBlur});  
    modal.style.display = "none";
});

$(".close-warning").click(function() {
    warningModal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == warningModal) {
        warningModal.style.display = "none";
    }
}