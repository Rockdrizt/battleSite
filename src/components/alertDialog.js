var alertDialog = function () {
	var alertGroup
	var okButton

	var assets = {
		images: [
			{
				name: 'textbox',
				file: "/images/onboarding/textbox.png"
			},
			{
				name: 'okOn',
				file: "/images/onboarding/okOn.png"
			},
			{
				name: 'okOff',
				file: "/images/onboarding/okOff.png"
			}
		],
	}

	function hideAlert() {
		alertGroup.dialog.text = ""
		alertGroup.input.setText("")
		alertGroup.input.alpha = 0

		var dissapearTween = game.add.tween(alertGroup).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
		if(okButton.callback)
			dissapearTween.onComplete.add(okButton.callback)
	}

	function disableButton() {
		this.btn.inputEnabled = false
		this.alpha = 0
	}
	
	function createButton() {
		okButton = game.add.group()
		var okOff = okButton.create(0, 0, "okOff")
		okOff.anchor.setTo(0.5, 0.5)
		var okOn = okButton.create(0, 0, "okOn")
		okOn.anchor.setTo(0.5, 0.5)

		okOn.alpha = 0
		okOn.inputEnabled = true
		okButton.btn = okOn
		okOn.events.onInputDown.add(function (btn) {
			okOn.alpha = 1
			okOff.alpha = 0
			sound.play("pop")
			var value = alertGroup.input.value
			console.log(value)
			okButton.callback = okButton.callback.bind(this, value)
			btn.inputEnabled = false

			game.time.events.add(200, function () {
				okOn.alpha = 0
				okOff.alpha = 1
				hideAlert()
			})
		}, this)
		
		okButton.disable = disableButton.bind(okButton)
	}

	function showAlertGroup(params) {
		params = params || {}
		game.world.remove(alertGroup)
		game.world.add(alertGroup)

		var message = params.message || "Hola Mundo"
		var showInput = params.showInput
		var isButtonDisabled = params.isButtonDisabled
		var pin = params.pin

		if(showInput)
			alertGroup.input.alpha = 1
		alertGroup.dialog.text = message

		if(isButtonDisabled)
			okButton.disable()
		else
			okButton.btn.inputEnabled = true

		if(pin) {
			alertGroup.pinGroup.alpha = 1
			alertGroup.pinGroup.pin.text = pin
		}


		game.add.tween(alertGroup).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)

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
		var dialog = game.add.text(10, -30, "", fontStyle)
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

	return{
		assets : assets,
		init : initAlert,
		show : showAlertGroup,
		hide : hideAlert
	}
}()