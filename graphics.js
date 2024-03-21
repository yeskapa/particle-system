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
        ctx.lineTo(newLine.p2.x, newLine.p2.y)
        ctx.stroke()
        ctx.closePath()
    }
}