var alertDialog = function () {
	var alertGroup

	var assets = {
		images: [
			{
				name: 'textbox',
				file: "/images/onboarding/textbox.png"
			}
		],
	}

	function createAlert() {
		var alertGroup = game.add.group()
		alertGroup.x = game.world.centerX
		alertGroup.y = game.world.centerY

		var alphaMask = game.add.graphics()
		alphaMask.beginFill(0x000000)
		alphaMask.drawRect(-game.world.centerX - 2, -game.world.centerY - 2, game.world.width + 2, game.world.height + 2)
		alphaMask.endFill()
		alphaMask.alpha = 0.7

		alertGroup.add(alphaMask)

		var dialog = alertGroup.create(0, 0, "textbox")
		dialog.anchor.setTo(0.5, 0.5)

		var dialogText = game.add.bitmapText(0, 0, 'skwig', "asdf", 75)
		dialogText.tint = 0x000000
		dialogText.maxWidth = dialog.width - 20
		dialogText.anchor.setTo(0.5, 0.5)
		alertGroup.add(dialogText)

		return alertGroup
	}

	return{
		assets : assets,
		createAlert : createAlert,
	}
}()