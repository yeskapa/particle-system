function updateMarchingSquaresGrid() {
    for (var i = 0; i < marchingGrid.points.length; i++) {
        var a = 0
        for (var j = 0; j < particles.length; j++) {
            var dist = distance(marchingGrid.points[i].position, particles[j].position)
            a += 1 / dist * marchingSquaresStrength
        }
        marchingGrid.points[i].value = Math.min(Math.max(a, 0), 5)
    }
}


function drawLine(p1x, p1y, p2x, p2y, color) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(p1x, p1y)
    ctx.lineTo(p2x, p2y)
    ctx.stroke()
    ctx.closePath()
}

function distance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

class MarchingSquares {
    constructor(corner1, corner2, amountOfParticlesX, amountOfParticlesY) {
        this.corner1 = corner1
        this.corner2 = corner2
        this.dimensions = {
            x:amountOfParticlesX,
            y:amountOfParticlesY
        }
        this.points = []
        for (var y = 0; y <= this.dimensions.y; y++) {
            for (var x = 0; x <= this.dimensions.x; x++) {
                this.points.push({
                    position:{x:x * corner2.x / this.dimensions.x + corner1.x, y:y * corner2.y / this.dimensions.y + corner1.y},
                    value:0
                })
            }
        }
    }

    init(corner1, corner2) {
        this.corner1 = corner1
        this.corner2 = corner2
        this.points = []
        for (var y = 0; y <= this.dimensions.y; y++) {
            for (var x = 0; x <= this.dimensions.x; x++) {
                this.points.push({
                    position:{x:x * corner2.x / this.dimensions.x + corner1.x, y:y * corner2.y / this.dimensions.y + corner1.y},
                    value:0
                })
            }
        }
    }

    draw(color) {
        for (var i = 0; i < this.points.length - this.dimensions.x; i++) {
            if (this.points[i].position.x >= this.corner2.x || this.points[i].position.y >= this.corner2.y) continue
    
            if ((this.points[i].value > 1) && (this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1) || !(this.points[i].value > 1) && !(this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                continue
            } else if ((this.points[i].value > 1) && !(this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1) || !(this.points[i].value > 1) && (this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i].position.x + (this.points[i + 1].position.x - this.points[i].position.x) * ((1 - this.points[i].value) / (this.points[i + 1].value - this.points[i].value)), this.points[i].position.y,this.points[i].position.x, this.points[i].position.y + (this.points[i + this.dimensions.x + 1].position.y - this.points[i].position.y) * ((1 - this.points[i].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i].value)),color)
            } else if (!(this.points[i].value > 1) && (this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1) || (this.points[i].value > 1) && !(this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i + 1].position.x + (this.points[i].position.x - this.points[i + 1].position.x) * ((1 - this.points[i + 1].value) / (this.points[i].value - this.points[i + 1].value)), this.points[i + 1].position.y,this.points[i + 1].position.x, this.points[i + 1].position.y + (this.points[i + this.dimensions.x + 1 + 1].position.y - this.points[i + 1].position.y) * ((1 - this.points[i + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + 1].value)),color)
            } else if (!(this.points[i].value > 1) && !(this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1) || (this.points[i].value > 1) && (this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i + this.dimensions.x + 1].position.x + (this.points[i + this.dimensions.x + 1 + 1].position.x - this.points[i + this.dimensions.x + 1].position.x) * ((1 - this.points[i + this.dimensions.x + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + this.dimensions.x + 1].value)), this.points[i + this.dimensions.x + 1].position.y,this.points[i + this.dimensions.x + 1].position.x, this.points[i + this.dimensions.x + 1].position.y + (this.points[i].position.y - this.points[i + this.dimensions.x + 1].position.y) * ((1 - this.points[i + this.dimensions.x + 1].value) / (this.points[i].value - this.points[i + this.dimensions.x + 1].value)),color)
            } else if (!(this.points[i].value > 1) && !(this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1) || (this.points[i].value > 1) && (this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i + this.dimensions.x + 1 + 1].position.x + (this.points[i + this.dimensions.x + 1].position.x - this.points[i + this.dimensions.x + 1 + 1].position.x) * ((1 - this.points[i + this.dimensions.x + 1 + 1].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i + this.dimensions.x + 1 + 1].value)), this.points[i + this.dimensions.x + 1 + 1].position.y,this.points[i + this.dimensions.x + 1 + 1].position.x, this.points[i + this.dimensions.x + 1 + 1].position.y + (this.points[i + 1].position.y - this.points[i + this.dimensions.x + 1 + 1].position.y) * ((1 - this.points[i + this.dimensions.x + 1 + 1].value) / (this.points[i + 1].value - this.points[i + this.dimensions.x + 1 + 1].value)),color)
            } else if ((this.points[i].value > 1) && (this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1) || !(this.points[i].value > 1) && !(this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i].position.x, this.points[i].position.y + (this.points[i + this.dimensions.x + 1].position.y - this.points[i].position.y) * ((1 - this.points[i].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i].value)),this.points[i + 1].position.x, this.points[i + 1].position.y + (this.points[i + this.dimensions.x + 1 + 1].position.y - this.points[i + 1].position.y) * ((1 - this.points[i + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + 1].value)),color)
            } else if ((this.points[i].value > 1) && !(this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1) || !(this.points[i].value > 1) && (this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i].position.x + (this.points[i + 1].position.x - this.points[i].position.x) * ((1 - this.points[i].value) / (this.points[i + 1].value - this.points[i].value)), this.points[i].position.y,this.points[i + this.dimensions.x + 1].position.x + (this.points[i + this.dimensions.x + 1 + 1].position.x - this.points[i + this.dimensions.x + 1].position.x) * ((1 - this.points[i + this.dimensions.x + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + this.dimensions.x + 1].value)), this.points[i + this.dimensions.x + 1].position.y,color)
            } else if ((this.points[i].value > 1) && !(this.points[i + 1].value > 1) && !(this.points[i + this.dimensions.x + 1].value > 1) && (this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i].position.x + (this.points[i + 1].position.x - this.points[i].position.x) * ((1 - this.points[i].value) / (this.points[i + 1].value - this.points[i].value)), this.points[i].position.y,this.points[i + 1].position.x, this.points[i + 1].position.y + (this.points[i + this.dimensions.x + 1 + 1].position.y - this.points[i + 1].position.y) * ((1 - this.points[i + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + 1].value)),color)
                drawLine(this.points[i + this.dimensions.x + 1 + 1].position.x + (this.points[i + this.dimensions.x + 1].position.x - this.points[i + this.dimensions.x + 1 + 1].position.x) * ((1 - this.points[i + this.dimensions.x + 1 + 1].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i + this.dimensions.x + 1 + 1].value)), this.points[i + this.dimensions.x + 1 + 1].position.y,this.points[i].position.x, this.points[i].position.y + (this.points[i + this.dimensions.x + 1].position.y - this.points[i].position.y) * ((1 - this.points[i].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i].value)),color)
            } else if (!(this.points[i].value > 1) && (this.points[i + 1].value > 1) && (this.points[i + this.dimensions.x + 1].value > 1) && !(this.points[i + this.dimensions.x + 1 + 1].value > 1)) {
                drawLine(this.points[i + 1].position.x + (this.points[i].position.x - this.points[i + 1].position.x) * ((1 - this.points[i + 1].value) / (this.points[i].value - this.points[i + 1].value)), this.points[i + 1].position.y,this.points[i].position.x, this.points[i].position.y + (this.points[i + this.dimensions.x + 1].position.y - this.points[i].position.y) * ((1 - this.points[i].value) / (this.points[i + this.dimensions.x + 1].value - this.points[i].value)),color)
                drawLine(this.points[i + this.dimensions.x + 1].position.x + (this.points[i + this.dimensions.x + 1 + 1].position.x - this.points[i + this.dimensions.x + 1].position.x) * ((1 - this.points[i + this.dimensions.x + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + this.dimensions.x + 1].value)), this.points[i + this.dimensions.x + 1 + 1].position.y,this.points[i + 1].position.x, this.points[i + 1].position.y + (this.points[i + this.dimensions.x + 1 + 1].position.y - this.points[i + 1].position.y) * ((1 - this.points[i + 1].value) / (this.points[i + this.dimensions.x + 1 + 1].value - this.points[i + 1].value)),color)
            }
        }
    }
}