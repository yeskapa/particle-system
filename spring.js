class Spring {
    constructor(p1, p2) {
        this.p1 = p1
        this.p2 = p2
    }

    calculate() {
        for (var i = 0; i < lines.length; i++) {
            var intersection = collisionLineLine({p1:this.p1.position, p2:this.p2.position}, lines[i])
            if (intersection != false) {
                return false
            }
        }

        var length = distance(this.p1.position, this.p2.position)
        if (length == 0) return true

        if (length > springAttachDistance * springDetachOffset) {
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
        this.p1.velocity.x -= springStrength * (this.p1.position.x - (this.p2.position.x + (ABvector.x * (springAttachDistance * springRestOffset)))) + springDampening * this.p1.velocity.x
        this.p1.velocity.y -= springStrength * (this.p1.position.y - (this.p2.position.y + (ABvector.y * (springAttachDistance * springRestOffset)))) + springDampening * this.p1.velocity.y
        this.p2.velocity.x -= springStrength * (this.p2.position.x - (this.p1.position.x + ((ABvector.x * -1) * (springAttachDistance * springRestOffset)))) + springDampening * this.p2.velocity.x
        this.p2.velocity.y -= springStrength * (this.p2.position.y - (this.p1.position.y + ((ABvector.y * -1) * (springAttachDistance * springRestOffset)))) + springDampening * this.p2.velocity.y

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