var can
var ctx

const pathLength = 20
const amountOfParticles = 1000

var particles = []
initParticles(amountOfParticles, pathLength)

var mouse = {position:{x:0, y:0}, held:false}

window.onload = function() {
    can = document.getElementById("canvas")
    ctx = can.getContext("2d")

    resizeCanvas()

    update()
}

window.onresize = function() {
    resizeCanvas()
}

addEventListener("mousemove", function(event) {
    mouse.position.x = event.clientX
    mouse.position.y = event.clientY
})

addEventListener("mousedown", function() {
    mouse.held = true
    for (var i = 0; i < particles.length; i++) {
        particles[i].addExternalForce(mouse.position, 0.1)
    }
})

addEventListener("mouseup", function() {
    mouse.held = false
    for (var i = 0; i < particles.length; i++) {
        particles[i].removeExternalForce(0)
    }
})

function resizeCanvas() {
    can.width = innerWidth
    can.height = innerHeight
}

function update() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, innerWidth, innerHeight)

    for (var i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw("#fff", 0, 2, "#ffffff33")
    }

    window.requestAnimationFrame(update)
}