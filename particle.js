class Particle {
    constructor(x, y, pathLength) {
        this.position = {
            x:x,
            y:y
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.externalForces = []
        this.previousPositions = new Array(pathLength).fill({x:x, y:y})
    }

    addExternalForce(position, magnitude) {
        this.externalForces.push({position:position, magnitude:magnitude})
    }

    removeExternalForce(index) {
        this.externalForces.splice(index, 1)
    }

    update() {
        for (var i = 0; i < this.externalForces.length; i++) {
            var dist = distance(this.position, this.externalForces[i].position)

            this.velocity.x += (this.externalForces[i].position.x - this.position.x) / dist * this.externalForces[i].magnitude
            this.velocity.y += (this.externalForces[i].position.y - this.position.y) / dist * this.externalForces[i].magnitude
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.previousPositions.pop()
        this.previousPositions.unshift({x:this.position.x, y:this.position.y})
    }

    draw(color, radius, pathWidth = 0, pathColor = color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, radius, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = pathColor
        ctx.lineWidth = pathWidth
        ctx.beginPath()
        for (var i = 0; i < this.previousPositions.length; i++) {
            ctx.lineTo(this.previousPositions[i].x, this.previousPositions[i].y)
        }
        ctx.stroke()
        ctx.closePath()
    }
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function initParticles(amount, pathLength) {
    for (var i = 0; i < amount; i++) {
        particles.push(new Particle(Math.random() * innerWidth, Math.random() * innerHeight, pathLength))
    }
}