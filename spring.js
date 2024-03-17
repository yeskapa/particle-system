class Spring {
    constructor(p1, p2, strength, canSnap, springDetachDistance, dampening, restLength = false) {
        this.p1 = p1
        this.p2 = p2
        this.strength = strength
        this.restLength = restLength
        this.canSnap = canSnap
        this.dampening = dampening
        if (!restLength) this.restLength = distance(p1.position, p2.position)
    }

    calculate() {
        var length = distance(this.p1.position, this.p2.position)
        if (length == 0) return true

        if (length > springDetachDistance && this.canSnap) {
            springs.splice(springs.indexOf(this), 1)
            this.p1.connections.splice(this.p1.connections.indexOf(particles.indexOf(this.p2)), 1)
            this.p2.connections.splice(this.p2.connections.indexOf(particles.indexOf(this.p1)), 1)
            return false
        }

        var ABvector = {
            x: (this.p1.position.x - this.p2.position.x) / length,
            y: (this.p1.position.y - this.p2.position.y) / length
        }

        // F = -kx - bv
        this.p1.velocity.x -= this.strength * (this.p1.position.x - (this.p2.position.x + (ABvector.x * this.restLength))) + this.dampening * this.p1.velocity.x
        this.p1.velocity.y -= this.strength * (this.p1.position.y - (this.p2.position.y + (ABvector.y * this.restLength))) + this.dampening * this.p1.velocity.y
        this.p2.velocity.x -= this.strength * (this.p2.position.x - (this.p1.position.x + ((ABvector.x * -1) * this.restLength))) + this.dampening * this.p2.velocity.x
        this.p2.velocity.y -= this.strength * (this.p2.position.y - (this.p1.position.y + ((ABvector.y * -1) * this.restLength))) + this.dampening * this.p2.velocity.y

        return true
    }

    draw(lineWidth, color) {
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.lineTo(this.p2.position.x, this.p2.position.y)
        ctx.lineTo(this.p1.position.x, this.p1.position.y)
        ctx.closePath()
        ctx.stroke()
    }
}