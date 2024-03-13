var can
var ctx

function resizeCanvas() {
    can.width = innerWidth
    can.height = innerHeight
    aspectRatio = innerWidth / innerHeight
}

window.onload = function() {
    can = document.getElementById("canvas")
    ctx = can.getContext("2d")

    resizeCanvas()

    update()
}

window.onresize = function() {
    resizeCanvas()
}

function update() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, innerWidth, innerHeight)

    window.requestAnimationFrame(update)
}