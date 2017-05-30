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
    this.velocity = 1
    this.isCurrentlyAtNode = true
    this.currentNode = startingNode
  }

  update() {
    if (this.isCurrentlyAtNode) {
      if (this.currentNode.exits.length === 1) {
        this.isCurrentlyAtNode = false
        this.currentLane = this.chooseExit()
        console.log('exit to lane', this.currentLane)
      } else {
        console.log('check exits for node', this.currentNode)
      }
    } else {
      let nextX
      if (this.x > this.currentLane.exitNode.x) {
        console.log('go left')
        nextX = this.x - this.velocity
      } else if (this.x < this.currentLane.exitNode.x) {
        console.log('go right')
        nextX = this.x + this.velocity
      } else {
        nextX = this.x
      }

      let nextY
      if (this.y > this.currentLane.exitNode.y) {
        console.log('go down')
        nextY = this.y - this.velocity
      } else if (this.y < this.currentLane.exitNode.y) {
        console.log('go up')
        nextY = this.y + this.velocity
      } else {
        nextY = this.y
      }

      if (nextX === this.x && nextY === this.y) {
        console.log('arrived to lane\'s end')
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
    context.fillStyle = '#f00'
    const drawingX = 200 + this.x
    const drawingY = 200 - this.y
    context.fillRect(drawingX, drawingY, 20, 30)
  }
}

class FireTruck extends Vehicle {
  constructor(startingNode) {
    super(startingNode)
  }
}

class Car extends Vehicle {
  constructor(startingNode) {
    super(startingNode)
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