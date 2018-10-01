


var ultraEntitie = function(){
    
    function createUltraPreview(yogo){      
         
        var color = [0xffffff, 0x242A4D]
        
        var ultraPreview = game.add.group()
        ultraPreview.lines = []
        
        var frame = ultraPreview.create(-10, game.world.centerY , "frame")
        frame.anchor.setTo(0, 0.5)
        ultraPreview.frame = frame
        
        var poly = new Phaser.Polygon([new Phaser.Point(frame.x, frame.y + frame.height * 0.45), 
                                       new Phaser.Point(frame.x, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 120, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 10, frame.y + frame.height * 0.45)])
        
        var mask = game.add.graphics(0, 0)
        mask.beginFill(0xffffff) 
        mask.drawPolygon(poly.points)
        ultraPreview.add(mask)

        var offset = -frame.height * 0.45
        
        while(offset < frame.height * 0.48){
            
            var long = game.rnd.integerInRange(5, 8) * 100
            var tall = game.rnd.integerInRange(1, 2) * 5
            var timer = game.rnd.integerInRange(2, 4) * 100

            var line = game.add.graphics()
            line.beginFill(color[game.rnd.integerInRange(0, 1)])
            line.drawRoundedRect(-long, offset, long, tall, tall * 0.5)
            line.endFill()
            line.mask = mask
            line.START_X = line.x 
            frame.addChild(line)
            ultraPreview.lines.push(line)
            
            // line.slide = game.add.tween(line).to({x: frame.width * 2}, timer, Phaser.Easing.linear, true)
            // line.slide.repeat(-1, game.rnd.integerInRange(2, 6) * 50)
            // line.slide.pause()
            
            offset += game.rnd.integerInRange(3, 10) * 5
        }
        
        var yogo = ultraPreview.create(frame.centerX, frame.y + frame.height * 0.48, yogo + "Special")
        yogo.anchor.setTo(0.5,1)
        ultraPreview.yogo = yogo
        ultraPreview.y = game.world.height + 100

        ultraPreview.showMove = showMove.bind(ultraPreview)
        ultraPreview.startLines = startLines.bind(ultraPreview)
        ultraPreview.stopLines = stopLines.bind(ultraPreview)
        
        return ultraPreview
    }

    function startLines(){

        for (let i = 0; i < this.lines.length; i++) {
            
            var timer = game.rnd.integerInRange(2, 4) * 100
            const line = this.lines[i]
            line.slide = game.add.tween(line).to({x: this.frame.width * 2}, timer, Phaser.Easing.linear, true)
            line.slide.repeat(-1, game.rnd.integerInRange(2, 6) * 50)
        }
    }

    function stopLines(){

        this.lines.forEach(function(line){
            line.slide.stop()
            line.x = line.START_X
        })
    }

    function showMove(side, yogotar){

        var blackMask = this.parent.blackMask
        var index = side.direction == -1 ? 0 : 1
console.log("se uso el nuevo ultra preview")

        this.scale.setTo(side.scale.x, 1)
        this.y = 0
        this.x = game.world.width * index
        var spawnX = (this.frame.width + this.x) * side.direction

        this.yogo.loadTexture(yogotar + "Special")
        this.startLines()

        game.add.tween(blackMask).to({alpha:0.5}, 300, Phaser.Easing.Cubic.InOut, true)
        game.add.tween(this.yogo).from({x:0}, 500, Phaser.Easing.Cubic.InOut, true, 300).onStart.add(function(){
            sound.play("ultraAttack")
        })
        var specialMove = game.add.tween(this).from({x:spawnX}, 500, Phaser.Easing.Cubic.InOut, true, 200)
        specialMove.repeat(1, 800)
        specialMove.onComplete.add(function(){
            this.stopLines()
            blackMask.alpha = 0
            //attackMove("ultra", index)
        }, this)
    }
        
    return{
        createUltraPreview:createUltraPreview,
    }
    
}()
