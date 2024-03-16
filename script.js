var can
var ctx

const pathLength = 20
const amountOfParticles = 100
const gravity = 0.1
const friction = 1
const collisionFriction = 0.9

var lines = [
    {p1:{x:0, y:0}, p2:{x:innerWidth, y:0}},
    {p1:{x:innerWidth, y:0}, p2:{x:innerWidth, y:innerHeight}},
    {p1:{x:innerWidth, y:innerHeight}, p2:{x:0, y:innerHeight}},
    {p1:{x:0, y:innerHeight}, p2:{x:0, y:0}},
]

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
    else if (e.button == 2) mouse.mouse2Down = true
})

addEventListener("mouseup", function(e) {
    if (e.button == 0) mouse.mouse1Down = false
    else if (e.button == 2) mouse.mouse2Down = false
})

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

function resizeCanvas() {
    can.width = innerWidth
    can.height = innerHeight
}

function update() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, innerWidth, innerHeight)

    for (var i = 0; i < particles.length; i++) {
        particles[i].update(!mouse.mouse1Down, friction, gravity, collisionFriction, lines)
        particles[i].draw("#fff", 2, 2, "#ffffff33")
    }

    drawLines("#fff", 2)

    window.requestAnimationFrame(update)
}