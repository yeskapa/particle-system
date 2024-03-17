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
        this.connections = []
    }

    update(friction, gravity) {

        if (mouse.mouse1Down) {
            var dist = distance(this.position, mouse.position)

            this.velocity.x += (mouse.position.x - this.position.x) / dist * mouseStrength
            this.velocity.y += (mouse.position.y - this.position.y) / dist * mouseStrength
        }
        
        this.velocity.x *= friction
        this.velocity.y *= friction

        this.velocity.y += gravity

        for (var i = 0; i < particles.length; i++) {
            var dist = distance(this.position, particles[i].position)
            if (dist == 0) continue

            if (useSprings && !this.connections.includes(i) && dist < springAttachmentDistance) {
                this.connections.push(i)
                particles[i].connections.push(particles.indexOf(this))
                springs.push(new Spring(this, particles[i], springStrength, true, springDetachDistance, springDampening, springRestLength))
            }
            
            if (particleCollision && dist < particleCollisionDistance ) {
                this.resolveParticleCollision(particles[i])
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        var previousPosition = {x:this.position.x - this.velocity.x, y:this.position.y - this.velocity.y}

        if (lineCollision) {
            for (var i = 0; i < lines.length; i++) {
                var collision = collisionLineLine({p1:previousPosition, p2:this.position}, lines[i])
                if (collision != false) {
                    this.resolveLineCollision(collision, lines[i], previousPosition)
                    this.velocity.x *= lineCollisionFriction
                    this.velocity.y *= lineCollisionFriction
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

    resolveParticleCollision(particle) {
        var collisionNormal = normalizeVector(this.position.x - particle.position.x, this.position.y - particle.position.y)

        this.position.x = particle.position.x + collisionNormal.x * particleCollisionDistance
        this.position.y = particle.position.y + collisionNormal.y * particleCollisionDistance

        this.velocity = getReflectVector(this.velocity, collisionNormal)
    }

    resolveLineCollision(collisionPoint, line) {
        // If we define dx = x2 - x1 and dy = y2 - y1, then the normals are (-dy, dx) and (dy, -dx)
        var lineNormal = normalizeVector(-(line.p2.y - line.p1.y), (line.p2.x - line.p1.x))

        var sideOfLine = getSideOfLine({x:this.position.x - this.velocity.x, y:this.position.y - this.velocity.y}, line)

        lineNormal.x *= sideOfLine
        lineNormal.y *= sideOfLine

        this.velocity = getReflectVector(this.velocity, lineNormal)

        var velocityNormal = normalizeVector(this.velocity.x, this.velocity.y)

        this.position.x = collisionPoint.x + velocityNormal.x
        this.position.y = collisionPoint.y + velocityNormal.y
    }
}

function getSideOfLine(point, line) {    
    return ((line.p2.x - line.p1.x) * (point.y - line.p1.y) - (line.p2.y - line.p1.y) * (point.x - line.p1.x)) > 0 ? 1 : -1
}

function getReflectVector(vector, normal) {
    return {
        x:vector.x - 2 * dot(vector, normal) * normal.x,
        y:vector.y - 2 * dot(vector, normal) * normal.y
    }
}

function normalizeVector(x, y) {
    var length = Math.sqrt(x * x + y * y)
    return { x: x / length, y: y / length }
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y
}

function initParticles(amount, pathLength) {
    for (var i = 0; i < amount; i++) {
        particles.push(new Particle(Math.random() * innerWidth, Math.random() * innerHeight, pathLength))
    }
}