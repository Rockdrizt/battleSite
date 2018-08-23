//Parsing the transition function from corona to be phaser compatible
/*
time (optional)
Number. Specifies the duration of the transition in milliseconds. By default, the duration is 500 milliseconds.

iterations (optional)
Number. Specifies the number of iterations for which the transition will repeat. By default, the iteration value is 1.

tag (optional)
String. Specifies the transition tag. The transition library can pause, resume, or cancel transitions sharing the same tag.

transition (optional)
Function. Specifies the easing interpolation method. Default is linear.

delay (optional)
Number. Specifies the delay, in milliseconds, before the transition begins. Default is 0.

delta (optional)
Boolean. Specifies whether non-control parameters are interpreted as final ending values or as changes in value. The default is false.

onStart (optional)
Listener. Listener function to be called before the transition begins. This function will receive a reference to the associated object as its sole argument.

onComplete (optional)
Listener. Listener function to be called after the transition completes. This function will receive a reference to the associated object as its sole argument.

onPause (optional)
Listener. Listener function to be called when the transition is paused. This function will receive a reference to the associated object as its sole argument.

onResume (optional)
Listener. Listener function to be called when the transition is resumed. This function will receive a reference to the associated object as its sole argument.

onCancel (optional)
Listener. Listener function to be called when the transition is cancelled. This function will receive a reference to the associated object as its sole argument.

onRepeat (optional)
Listener. Listener function to be called when the transition completes an iteration in a repeat cycle. This function will receive a reference to the associated object as its sole argument.

x (optional)
Number. Moves the target from its current x coordinate to another.

y (optional)
Number. Moves the target from its current y coordinate to another.

rotation (optional)
Number. Rotates the target from its current angle to another.

alpha (optional)
Number. Fades the target from its current alpha value to another.

xScale (optional)
Number. Scales the target to a specific x ratio.

yScale (optional)
Number. Scales the target to a specific y ratio.

size (optional)
Number. Applies only if the target is a TextObject created via display.newText(). This will transition the font size of the text object.

width (optional)
Number. Resizes the target from its current width to another.

height (optional)
Number. Resizes the target from its current height to another.
 */
var transition = function () {

	//TODO: translate all corona EASING intro PHASER easing functions
	var easing = {
		inQuad:Phaser.Easing.Quadratic.In,
		outQuad:Phaser.Easing.Quadratic.Out,
		inOutQuad:Phaser.Easing.Quadratic.InOut
	}

	function parseParams(params) {
		var obj = {}

		obj.duration = params.time
		delete params.time
		obj.ease = params.transition
		delete params.transition
		obj.delay = params.delay
		delete params.delay
		obj.repeat = params.repeat - 1
		delete params.repeat

		return obj
	}
	
	function to(target, params) {
		//to(properties, duration, ease, autoStart, delay, repeat, yoyo)
		var options = parseParams(params)
		var ease = options.ease || Phaser.Easing.Linear.None
		var repeat = options.repeat || 0
		var delay = options.delay || 0

		game.add.tween(target).to(params, options.duration, ease, true, delay, repeat)
	}

	function from(target, params) {
		var options = parseParams(params)
		var ease = options.ease || Phaser.Easing.Linear.None
		var repeat = options.repeat || 0

		game.add.tween(target).from(params, options.duration, ease, repeat)
	}
	
	return {
		to:to,
		from:from
	}
}()