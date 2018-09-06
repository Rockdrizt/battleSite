var alertDialog = function () {
	var alertGroup
	var okButton
	var appearTween

	var DIALOG = {
		width : 400,
		height : 300,
		offsetX : 5,
		offsetYLong : 40,
		offsetYShort : -40
	}


	var assets = {
		images: [
			{
				name: 'textbox',
				file: settings.BASE_PATH + "/images/onboarding/textbox.png"
			},
			{
				name: 'okOn',
				file: settings.BASE_PATH + "/images/onboarding/okOn.png"
			},
			{
				name: 'okOff',
				file: settings.BASE_PATH + "/images/onboarding/okOff.png"
			}
		],
	}

	function hideAlert(callback) {
		game.paused = false

		var dissapearTween = game.add.tween(alertGroup).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
		dissapearTween.onComplete.add(function () {
			var value = alertGroup.input.value
			if(typeof callback === "function")
				callback(value)
		})
	}

	function disableButton() {
		this.btn.inputEnabled = false
		this.alpha = 0
	}

	function onClickOk (btn) {
		var button = btn.parent
		var okOn = button.okOn
		var okOff = button.okOff

		okOn.alpha = 1
		okOff.alpha = 0
		sound.play("pop")
		btn.inputEnabled = false

		hideAlert(button.callback)
	}
	
	function createButton() {
		okButton = game.add.group()
		var okOff = okButton.create(0, 0, "okOff")
		okOff.anchor.setTo(0.5, 0.5)
		var okOn = okButton.create(0, 0, "okOn")
		okOn.anchor.setTo(0.5, 0.5)
		okButton.okOn = okOn
		okButton.okOff = okOff

		okOn.alpha = 0
		okOn.inputEnabled = true
		okButton.btn = okOn
		okOn.events.onInputDown.add(onClickOk, this)
		
		okButton.disable = disableButton.bind(okButton)
		okButton.initialize = initButton.bind(okButton)
	}

	function initButton(){
		this.okOff.alpha = 1
		this.okOn.alpha = 0

		this.btn.inputEnabled = true
		this.alpha = 1
	}

	function showAlertGroup(params) {
		game.paused = false
		params = params || {}
		game.world.remove(alertGroup)
		game.world.add(alertGroup)

		var message = params.message || "Hola Mundo"
		var showInput = params.showInput
		var isButtonDisabled = params.isButtonDisabled
		var pin = params.pin

		if(showInput)
			alertGroup.input.alpha = 1
		else
			alertGroup.input.alpha = 0

		alertGroup.dialog.text = message

		if(isButtonDisabled)
			okButton.disable()
		else
			okButton.initialize()

		if(pin) {
			alertGroup.pinGroup.alpha = 1
			alertGroup.pinGroup.pin.text = pin
		}else{
			alertGroup.pinGroup.alpha = 0
		}

		if((showInput)||(pin))
			alertGroup.dialog.setTextBounds(DIALOG.offsetX, DIALOG.offsetYShort, DIALOG.width, DIALOG.height)
		else
			alertGroup.dialog.setTextBounds(DIALOG.offsetX, DIALOG.offsetYLong, DIALOG.width, DIALOG.height)

		appearTween = game.add.tween(alertGroup).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)
		appearTween.onComplete.add(function() {
			game.paused = true
		})
		//appearTween.update()

		if(params.callback) okButton.callback = params.callback
	}

	function initAlert() {

		alertGroup = game.add.group()
		alertGroup.x = game.world.centerX
		alertGroup.y = game.world.centerY - 100

		var alphaMask = game.add.graphics()
		alphaMask.beginFill(0x000000)
		alphaMask.drawRect(-game.world.centerX - 2, -game.world.centerY - 2 + 100, game.world.width + 2, game.world.height + 2)
		alphaMask.endFill()
		alphaMask.alpha = 0.7
		alphaMask.inputEnabled = true

		alertGroup.add(alphaMask)

		var textBox = alertGroup.create(0, 0, "textbox")
		textBox.anchor.setTo(0.5, 0.5)
		textBox.x = -15

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var fontStyle2 = {font: "46px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var dialog = game.add.text(10, -10, "", fontStyle)
		//dialog.setTextBounds(5, 40, textBox.width, textBox.height)
		dialog.boundsAlignH = "middle"
		dialog.boundsAlignV = "top"
		dialog.anchor.setTo(0.5,0.5)
		alertGroup.add(dialog)
		dialog.wordWrapWidth = textBox.width - 100
		dialog.wordWrap = true
		alertGroup.dialog = dialog

		var input = game.add.inputField(0, 50, {
			font: '32px VAGRounded',
			fill: '#000',
			fontWeight: 'bold',
			width: 300,
			height: 38,
			padding: 8,
			borderWidth: 3,
			borderColor: '#000',
			borderRadius: 12,
			placeHolder: 'PIN',
			textAlign:"center",
			max:6,
			type: PhaserInput.InputType.numeric
		});
		//input.anchor.setTo(0.5, 0.5)
		input.x = -input.width * 0.5
		input.alpha = 0
		alertGroup.input = input
		alertGroup.add(input)

		var pinGroup = game.add.group()
		pinGroup.x = 10
		pinGroup.y = 50
		pinGroup.alpha = 0
		alertGroup.pinGroup = pinGroup

		var roundRect = game.add.graphics()
		roundRect.beginFill(0x000000)
		roundRect.drawRoundedRect(-150, 0, 300, 100, 25)
		roundRect.endFill()
		pinGroup.add(roundRect)

		var pinText = game.add.text(0, 0, "000000", fontStyle2)
		pinText.fill = "#fff"
		pinGroup.add(pinText)
		pinText.wordWrapWidth = 500
		pinText.wordWrap = true
		pinText.anchor.setTo(0.5, 0.5)
		pinText.y = 50
		pinGroup.pin = pinText

		alertGroup.add(pinGroup)

		createButton()
		alertGroup.add(okButton)
		okButton.x = 0; okButton.y = 380
		okButton.scale.setTo(0.8, 0.8)

		alertGroup.alpha = 0
		return alertGroup
	}

	function pauseUpdate() {
		//if(appearTween)appearTween.update()
		alertGroup.input.update()
	}

	return{
		assets : assets,
		init : initAlert,
		show : showAlertGroup,
		hide : hideAlert,
		pauseUpdate: pauseUpdate
	}
}()