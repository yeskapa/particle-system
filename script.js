// TODO: stop particles from going through corners of lines
// TODO: make line placing snap to line points
// TODO: make line points movable
// TODO: add sliders for variables and checkboxes for toggling features
// TODO: make springs not able to cross lines
// TODO: optimise particle-line collision and particle-particle spring creation

var can
var ctx

const frameRate = -1

const pathLength = 0
const amountOfParticles = 100
const gravity = 0.1
const friction = 0.99
const mouseStrength = 0.2

const useSprings = true
const springDetachDistance = 130
const springAttachmentDistance = 100
const springRestLength = 100
const springStrength = 0.001
const springDampening = 0

const lineCollision = true
const lineCollisionFriction = 0.8

const particleCollision = true
const particleCollisionDistance = 10

const colors = {
    background: "#000",
    particle: "#fff",
    path: "#ffffff33",
    line: "#fff",
    newLine: "#2a2a2a"
}

var lines = [
    {p1:{x:0, y:0}, p2:{x:innerWidth, y:0}},
    {p1:{x:innerWidth, y:0}, p2:{x:innerWidth, y:innerHeight}},
    {p1:{x:innerWidth, y:innerHeight}, p2:{x:0, y:innerHeight}},
    {p1:{x:0, y:innerHeight}, p2:{x:0, y:0}},
]

var lineIntersections = []
updateLineIntersections()

var newLine = {
    p1:{x:0, y:0},
    p2:{x:0, y:0}
}

var springs = []
var particles = []
initParticles(amountOfParticles, pathLength)

var mouse = {position:{x:0, y:0}, mouse1Down:false, mouse2Down:false}

window.onload = function() {
    can = document.getElementById("canvas")
    ctx = can.getContext("2d")

    resizeCanvas()

    update()
}

window.onresize = function() {
    resizeCanvas()
}

addEventListener("mousemove", function(e) {
    mouse.position.x = e.clientX
    mouse.position.y = e.clientY
})

addEventListener("mousedown", function(e) {
    if (e.button == 0) mouse.mouse1Down = true
    else if (e.button == 2) {
        newLine.p1.x = e.clientX
        newLine.p1.y = e.clientY
        mouse.mouse2Down = true
    }
})

addEventListener("mouseup", function(e) {
    if (e.button == 0) mouse.mouse1Down = false
    else if (e.button == 2) {
        newLine.p2.x = e.clientX
        newLine.p2.y = e.clientY

        lines.push({p1:{x:newLine.p1.x, y:newLine.p1.y}, p2:{x:newLine.p2.x, y:newLine.p2.y}})
        updateLineIntersections()
        newLine = {
            p1:{x:0, y:0},
            p2:{x:0, y:0}
        }

        mouse.mouse2Down = false
    }
})

function updateLineIntersections() {
    lineIntersections = []
    for (var i = 0; i < lines.length; i++) {
        lineIntersections.push(lines[i].p1, lines[i].p1)
        for (var j = 0; j < lines.length; j++) {
            if (i == j) continue
            var intersection = collisionLineLine(lines[i], lines[j])
            if (intersection != false) lineIntersections.push(intersection)
        }
    }
}

function drawLines(color, width) {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    for (var i = 0; i < lines.length; i++) {
        ctx.beginPath()
        ctx.moveTo(lines[i].p1.x, lines[i].p1.y)
        ctx.lineTo(lines[i].p2.x, lines[i].p2.y)
        ctx.stroke()
        ctx.closePath()
    }
}

function drawNewLine() {
    if (mouse.mouse2Down) {
        ctx.strokeStyle = colors.newLine
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(newLine.p1.x, newLine.p1.y)
        ctx.lineTo(mouse.position.x, mouse.position.y)
        ctx.stroke()
        ctx.closePath()
    }
}

function resizeCanvas() {
    can.width = innerWidth
    can.height = innerHeight
}

function update() {
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, innerWidth, innerHeight)

    for (var i = 0; i < particles.length; i++) {
        particles[i].update(
            mouse.mouse1Down ? 1 : friction,
            mouse.mouse1Down ? 0 : gravity,
        )
        particles[i].draw(colors.particle, 2, 2, colors.path)
    }

    for (var i = 0; i < springs.length; i++) {
        if (!springs[i].calculate()) continue
        springs[i].draw()
    }

    drawNewLine()
    drawLines(colors.line, 1)

    if (frameRate == false) window.requestAnimationFrame(update)
    else setTimeout(update, 1000 / frameRate)
}