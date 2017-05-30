class LaneNode {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.exits = []
  }
}



class Lane {
  constructor(entryNode, exitNode) {
    this.entryNode = entryNode
    this.exitNode = exitNode
  }
}



class Vehicle {
  constructor(startingNode) {
    this.x = startingNode.x
    this.y = startingNode.y
    this.isCurrentlyAtNode = true
    this.currentNode = startingNode
  }

  update() {
    if (this.isCurrentlyAtNode) {
      this.isCurrentlyAtNode = false
      this.currentLane = this.chooseExit()
    } else {
      const {x: nextX, y: nextY} = getNextPosition({x: this.x, y: this.y}, {x: this.currentLane.exitNode.x, y: this.currentLane.exitNode.y}, this.velocity)

      if (isWithinOnePixelFrom({x: nextX, y: nextY}, {x: this.currentLane.exitNode.x, y: this.currentLane.exitNode.y})) {
        this.isCurrentlyAtNode = true
        this.currentNode = this.currentLane.exitNode
      }

      this.x = nextX
      this.y = nextY
    }
  }

  chooseExit() {
    return this.currentNode.exits[0]
  }

  draw(context) {
    const drawingX = 200 + this.x
    const drawingY = 200 - this.y
    context.fillRect(drawingX, drawingY, 20, 30)
  }
}

function getAngleBetweenPoints(startPosition, targetPosition) {
  /**
   * https://gist.github.com/conorbuck/2606166
   * right 0
   * down 4.71238898038469
   * left 3.141592653589793
   * up 1.5707963267948966
   */
  let angle = Math.atan2(targetPosition.y - startPosition.y, targetPosition.x - startPosition.x)
  if (angle < 0) angle += 2 * Math.PI
  return angle
}

function getNextPosition(currentPosition, targetPosition, velocity) {
  const angle = getAngleBetweenPoints(currentPosition, targetPosition)
  return {
    x: currentPosition.x + Math.cos(angle) * velocity,
    y: currentPosition.y + Math.sin(angle) * velocity
  }
}

function isWithinOnePixelFrom(positionA, positionB) {
  let isXPositionWithinOnePixel = positionA.x - positionB.x < 1
  let isYPositionWithinOnePixel = positionA.y - positionB.y < 1
  return isXPositionWithinOnePixel && isYPositionWithinOnePixel
}



class FireTruck extends Vehicle {
  constructor(startingNode) {
    super(startingNode)
    this.velocity = 1.1
  }

  update() {
    super.update()
  }

  draw(context) {
    context.fillStyle = '#a00'
    super.draw(context)
  }
}

class Car extends Vehicle {
  constructor(startingNode) {
    super(startingNode)
    this.velocity = 1
  }

  draw(context) {
    context.fillStyle = '#888'
    super.draw(context)
  }
}



class FireTruckGame {
  constructor() {
    this.fps = 50
  }

  initialize() {
    this.entities = []
    this.context = document.getElementById("fireTruckGame").getContext("2d")
  }

  update() {
    for (var i=0; i < this.entities.length; i++) {
      this.entities[i].update()
    }
  }

  draw() {
    this.context.clearRect(0, 0, 640, 480)

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.context)
    }
  }

  addEntity(entity) {
    this.entities.push(entity)
  }
}

const Game = new FireTruckGame()

Game.initialize()

const fireStation = new LaneNode(0, 100)
const northCrossingNode = new LaneNode(0, 0)

const laneFromFireStation = new Lane(fireStation, northCrossingNode)
fireStation.exits.push(laneFromFireStation)

const westExit = new LaneNode(-200, 0)
const laneFromNorthCrossingToWest = new Lane(northCrossingNode, westExit)
northCrossingNode.exits.push(laneFromNorthCrossingToWest)

const eastEntry = new LaneNode(200, 0)
const laneFromEastEntryToNorthCrossing = new Lane(eastEntry, northCrossingNode)
eastEntry.exits.push(laneFromEastEntryToNorthCrossing)

Game.addEntity(new FireTruck(fireStation))
Game.addEntity(new Car(eastEntry))

Game.run = (function() {
  let loops = 0
  const skipTicks = 1000 / Game.fps
  let nextGameTick = (new Date).getTime()

  return function() {
    loops = 0

    while ((new Date).getTime() > nextGameTick) {
      Game.update()
      nextGameTick += skipTicks
      loops++
    }

    if (loops) Game.draw()
  }
})();

(function() {
  var onEachFrame = function (cb) {
    var _cb = function() {
      cb()
      requestAnimationFrame(_cb)
    }
    _cb()
  }
  window.onEachFrame = onEachFrame
})();

window.onEachFrame(Game.run);
