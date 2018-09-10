


var battleField = function(){
    
    function createBackground(group){
        
        var back = group.create(0, 0, "back")
        back.width = game.world.width
        back.height = game.world.height
        
//        var background = spineLoader.createSpine("background", "normal", "idle", game.world.centerX, game.world.centerY, true)
//        group.add(background)
        
        var pipes = group.create(-60, -150, "pipes")
        
        var cubes = spineLoader.createSpine("cubes", "normal", "idle", game.world.centerX - 30, game.world.centerY - 110, true)
        group.add(cubes)
        
        var triangles = spineLoader.createSpine("triangles", "normal", "idle", 380, game.world.centerY - 80, true)
        group.add(triangles)
        
        var floor = spineLoader.createSpine("floor", "normal", "idle", game.world.centerX - 10, game.world.centerY + 20, true)
        group.add(floor)
        
        var cylinder = spineLoader.createSpine("cylinder", "normal", "idle", game.world.centerX - 330, game.world.centerY - 30, true)
        group.add(cylinder)
        
        var blackMask = game.add.graphics()
        blackMask.beginFill(0x000000)
        blackMask.drawRect(0,0,game.world.width, game.world.height)
        blackMask.endFill()
        blackMask.alpha = 0
        group.add(blackMask)
        group.blackMask = blackMask
        
        var rect = game.add.graphics()
        rect.beginFill(0x242A4D)
        rect.drawRect(0, 0, game.world.width, 150)
        rect.endFill()
        rect.alpha = 0.5
        group.add(rect)
    }
    
    function createSpecialAttack(yogo){      
         
        var color = [0xffffff, 0x242A4D]
        
        var specialAttack = game.add.group()
        specialAttack.lines = []
        
        var frame = specialAttack.create(-10, game.world.centerY , "frame")
        frame.anchor.setTo(0, 0.5)
        specialAttack.frame = frame
        
        var poly = new Phaser.Polygon([new Phaser.Point(frame.x, frame.y + frame.height * 0.45), 
                                       new Phaser.Point(frame.x, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 120, frame.y - frame.height * 0.5), 
                                       new Phaser.Point(frame.x + frame.width - 10, frame.y + frame.height * 0.45)])
        
        var mask = game.add.graphics(0, 0)
        mask.beginFill(0xffffff) 
        mask.drawPolygon(poly.points)
        specialAttack.add(mask)

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
            frame.addChild(line)
            specialAttack.lines.push(line)
            
            line.slide = game.add.tween(line).to({x: frame.width * 2}, timer, Phaser.Easing.linear, true)
            line.slide.repeat(-1, game.rnd.integerInRange(2, 6) * 50)
            line.slide.pause()
            
            offset += game.rnd.integerInRange(3, 10) * 5
        }
        
        var yogo = specialAttack.create(frame.centerX, frame.y + frame.height * 0.48, yogo + "Special")
        yogo.anchor.setTo(0.5,1)
        specialAttack.yogo = yogo
        specialAttack.y = game.world.height + 100
        
        return specialAttack
    }
    
    function createListosYa(){

        var listosYaGroup = game.add.group()
        
        var listos = listosYaGroup.create(game.world.centerX, -150, "listos")
        listos.anchor.setTo(0.5)
        listosYaGroup.listos = listos
        
        var ya = listosYaGroup.create(game.world.centerX, game.world.centerY, "ya")
        ya.anchor.setTo(0.5)
        ya.scale.setTo(0)
        listosYaGroup.ya = ya
        
        return listosYaGroup
    }
    
    return{
        createBackground:createBackground,
        createSpecialAttack:createSpecialAttack,
        createListosYa:createListosYa,
    }
    
}()
