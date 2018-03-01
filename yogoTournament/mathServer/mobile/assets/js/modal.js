// Get the modal
var modal = document.getElementById('modal');
var warningModal = document.getElementById('warningModal');

// When the user clicks the button, open the modal 
$(".plus-btn").click(function() {
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