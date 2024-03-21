// TODO: make line point placing not snap to same line
// TODO: make line points movable
// TODO: make all rendering options togglable
// TODO: add checkboxes for toggleable features
// TODO: optimise collisions and spring creation
// TODO: make it GPU accelerated for performance
// TODO: fix the particles collisions

var can
var ctx

const frameRate = -1

var amountOfParticles = 100
var gravity = 0.1
var friction = 0.99
var mouseStrength = 0.2

var useSprings = true
var springAttachDistance = 49
var springDetachOffset = 0.9
var springRestOffset = 0.66
var springStrength = 0.01
var springDampening = 0

var lineCollision = true
var lineCollisionFriction = 0.8

var particleCollision = true
var particleCollisionDistance = 10

var linePlacingSnap = true
var linePlacingSnapDistance = 20

var showMarchingSquares = false
var showSprings = true
var showParticles = true
var showVariableMenu = false

var URLvariables = [
    amountOfParticles,
    useSprings,
    springAttachDistance,
    springDetachOffset,
    springRestOffset,
    springStrength,
    particleCollision,
    particleCollisionDistance,
    showSprings,
    showParticles,
    showVariableMenu,
]

const colors = {
    background: "#111",
    particle: "#fff",
    spring: "#ffffff33",
    line: "#fff",
    newLine: "#2a2a2a",
    marchingSquares: "#fff",
}

var lines = [
    {p1:{x:0, y:0}, p2:{x:innerWidth, y:0}},
    {p1:{x:innerWidth, y:0}, p2:{x:innerWidth, y:innerHeight}},
    {p1:{x:innerWidth, y:innerHeight}, p2:{x:0, y:innerHeight}},
    {p1:{x:0, y:innerHeight}, p2:{x:0, y:0}},
]

// file:///C:/Users/kapam/Desktop/code/javascript/particle%20system/index.html?100?0.1?49?0.9?0.66?0.01?1?10?1?1?1
for (var i = 1; i < window.location.href.split("?").length; i++) {
    var value = window.location.href.split("?")[i]
    if (i == 1) amountOfParticles = Number(value)
    if (i == 2) useSprings = Number(value)
    if (i == 3) springAttachDistance = Number(value)
    if (i == 4) springDetachOffset = Number(value)
    if (i == 5) springRestOffset = Number(value)
    if (i == 6) springStrength = Number(value)
    if (i == 7) particleCollision = Number(value)
    if (i == 8) particleCollisionDistance = Number(value)
    if (i == 9) showSprings = Number(value)
    if (i == 10) showParticles = Number(value)
    if (i == 11) showVariableMenu = Number(value)
}

var marchingSquaresStrength = 3
var marchingGrid = new MarchingSquares({x:0, y:0}, {x:innerWidth, y:innerHeight}, 100, 100)

var newLine = {
    p1:{x:0, y:0},
    p2:{x:0, y:0}
}

var springs = []
var particles = []
initParticles(amountOfParticles)

var mouse = {position:{x:0, y:0}, mouse1Down:false, mouse2Down:false}

window.onload = function() {
    can = document.getElementById("canvas")
    ctx = can.getContext("2d")

    if (!showVariableMenu) document.getElementById("slidersDiv").remove()
    
    can.addEventListener("mousemove", function(e) {
        mouse.position.x = e.clientX
        mouse.position.y = e.clientY

        if (mouse.mouse2Down) {
            newLine.p2.x = e.clientX
            newLine.p2.y = e.clientY

            if (linePlacingSnap) {
                for (var i = 0; i < lines.length; i++) {
                    var closestLineOnPoint = getClosestPointOnLine(mouse.position, lines[i])
                    if (distance(closestLineOnPoint, mouse.position) < linePlacingSnapDistance) {
                        newLine.p2 = closestLineOnPoint
                    }
                }
            }
        }
    })

    can.addEventListener("mousedown", function(e) {
        if (e.button == 0) {
            mouse.mouse1Down = true
        } else if (e.button == 2) {
            mouse.mouse2Down = true
            newLine.p1.x = e.clientX
            newLine.p1.y = e.clientY
            newLine.p2.x = e.clientX
            newLine.p2.y = e.clientY
            if (linePlacingSnap) {
                for (var i = 0; i < lines.length; i++) {
                    var closestLineOnPoint = getClosestPointOnLine(newLine.p1, lines[i])
                    if (distance(closestLineOnPoint, mouse.position) < linePlacingSnapDistance) {
                        newLine.p1 = closestLineOnPoint
                    }
                }
            }
        }
    })

    can.addEventListener("mouseup", function(e) {
        if (e.button == 0) mouse.mouse1Down = false
        else if (e.button == 2) {
            mouse.mouse2Down = false
            lines.push({p1:{x:newLine.p1.x, y:newLine.p1.y}, p2:{x:newLine.p2.x, y:newLine.p2.y}})
            newLine = {
                p1:{x:0, y:0},
                p2:{x:0, y:0}
            }
        }
    })

    can.width = innerWidth
    can.height = innerHeight

    update()
}

window.onresize = function() {
    marchingGrid.init({x:0, y:0}, {x:innerWidth, y:innerHeight})
    can.width = innerWidth
    can.height = innerHeight
}

function update() {
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, innerWidth, innerHeight)

    for (var i = 0; i < particles.length; i++) {
        particles[i].update(
            friction,
            mouse.mouse1Down ? 0 : gravity,
        )
        if (showParticles) particles[i].draw(colors.particle, 2)
    }

    for (var i = 0; i < springs.length; i++) {
        if (!springs[i].calculate()) continue
        if (showSprings) springs[i].draw(colors.spring, 1)
    }

    drawNewLine()
    drawLines(colors.line, 1)
    if (showMarchingSquares) {
        updateMarchingSquaresGrid()
        marchingGrid.draw(colors.marchingSquares)
    }

    if (frameRate == false) window.requestAnimationFrame(update)
    else setTimeout(update, 1000 / frameRate)
}