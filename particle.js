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
        this.previousPositions = new Array(pathLength).fill({x:x, y:y})
    }

    update(useGravity, friction, gravity, collisionFriction, lines = false) {

        if (mouse.mouse1Down) {
            var dist = distance(this.position, mouse.position)

            this.velocity.x += (mouse.position.x - this.position.x) / dist * 0.1
            this.velocity.y += (mouse.position.y - this.position.y) / dist * 0.1
        }
        
        this.velocity.x *= friction
        this.velocity.y *= friction

        if (useGravity) {
            this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        var previousPosition = {x:this.position.x - this.velocity.x, y:this.position.y - this.velocity.y}

        if (lines != false) {
            for (var i = 0; i < lines.length; i++) {
                var collision = collisionLineLine({p1:previousPosition, p2:this.position}, lines[i])
                if (collision != false) {
                    this.resolveCollision(collision, lines[i], previousPosition)
                    this.velocity.x *= collisionFriction
                    this.velocity.y *= collisionFriction
                }
            }
        }

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

    resolveCollision(collisionPoint, line) {
        // If we define dx = x2 - x1 and dy = y2 - y1, then the normals are (-dy, dx) and (dy, -dx)
        var normal1 = {
            x:-(line.p2.y - line.p1.y),
            y:(line.p2.x - line.p1.x)
        }
        var normal1Length = Math.sqrt(normal1.x ** 2 + normal1.y ** 2)
        normal1.x /= normal1Length
        normal1.y /= normal1Length

        var normal2 = {
            x:(line.p2.y - line.p1.y),
            y:-(line.p2.x - line.p1.x)
        }
        var normal2Length = Math.sqrt(normal2.x ** 2 + normal2.y ** 2)
        normal2.x /= normal2Length
        normal2.y /= normal2Length
        
        var normal = normal2

        if (dot(this.velocity, normal1) > 0) normal = normal1

        // end = velocity − 2 * dot(velocity ⋅ normal) * normal

        // var velocityLength = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
        // var normalizedVelocity = {
        //     x:this.velocity.x / velocityLength,
        //     y:this.velocity.y / velocityLength
        // }

        var d = dot(this.velocity, normal)
        this.velocity.x = this.velocity.x - 2 * d * normal.x
        this.velocity.y = this.velocity.y - 2 * d * normal.y

        this.position.x = collisionPoint.x + this.velocity.x
        this.position.y = collisionPoint.y + this.velocity.y
    }
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function initParticles(amount, pathLength) {
    for (var i = 0; i < amount; i++) {
        particles.push(new Particle(Math.random() * innerWidth, Math.random() * innerHeight, pathLength))
    }
}