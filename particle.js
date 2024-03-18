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
        var previousPosition = {x:this.position.x, y:this.position.y}

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

            if (useSprings && !this.connections.includes(i) && dist < springAttachDistance) {
                this.connections.push(i)
                particles[i].connections.push(particles.indexOf(this))
                springs.push(new Spring(this, particles[i]))
            }
            
            if (particleCollision && dist < particleCollisionDistance * 2) {
                this.resolveParticleCollision(particles[i], particleCollisionDistance)
            }
        }

        for (var i = 0; i < lineIntersections.length; i++) {
            var dist = distance(this.position, lineIntersections[i])
            if (dist < 10) {
                var collisionNormal = normalizeVector(this.position.x - lineIntersections[i].x, this.position.y - lineIntersections[i].y)
                this.velocity = getReflectVector(this.velocity, collisionNormal)
                
                this.position.x = lineIntersections[i].x + collisionNormal.x * 10
                this.position.y = lineIntersections[i].y + collisionNormal.y * 10
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

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

    resolveParticleCollision(particle, dist) {
        var xDiff = this.position.x + this.velocity.x - particle.position.x
        var yDiff = this.position.y + this.velocity.y - particle.position.y
        var angle = Math.atan2(yDiff, xDiff)
        var speed1 = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
        var speed2 = Math.sqrt(particle.velocity.x * particle.velocity.x + particle.velocity.y * particle.velocity.y)

        var direction1 = Math.atan2(this.velocity.y, this.velocity.x)
        var direction2 = Math.atan2(particle.velocity.y, particle.velocity.x)

        var newXSpeed1 = speed1 * Math.cos(direction1 - angle)
        var newYSpeed1 = speed1 * Math.sin(direction1 - angle)
        var newXSpeed2 = speed2 * Math.cos(direction2 - angle)
        var newYSpeed2 = speed2 * Math.sin(direction2 - angle)

        var finalXSpeed1 = ((dist - dist) * newXSpeed1 + (2 * dist) * newXSpeed2) / (dist + dist)
        var finalXSpeed2 = ((dist - dist) * newXSpeed2 + (2 * dist) * newXSpeed1) / (dist + dist)

        this.velocity.x = Math.cos(angle) * finalXSpeed1 + Math.cos(angle + Math.PI / 2) * newYSpeed1
        this.velocity.y = Math.sin(angle) * finalXSpeed1 + Math.sin(angle + Math.PI / 2) * newYSpeed1
        particle.velocity.x = Math.cos(angle) * finalXSpeed2 + Math.cos(angle + Math.PI / 2) * newYSpeed2
        particle.velocity.y = Math.sin(angle) * finalXSpeed2 + Math.sin(angle + Math.PI / 2) * newYSpeed2

        var d = distance(this.position, particle.position)
        this.position.x = (this.position.x - particle.position.x) / d * (dist + dist) + particle.position.x
        this.position.y = (this.position.y - particle.position.y) / d * (dist + dist) + particle.position.y
    }

    resolveLineCollision(collisionPoint, line, previousPosition) {
        // If we define dx = x2 - x1 and dy = y2 - y1, then the normals are (-dy, dx) and (dy, -dx)
        var lineNormal = normalizeVector(-(line.p2.y - line.p1.y), (line.p2.x - line.p1.x))

        var sideOfLine = getSideOfLine(previousPosition, line)

        lineNormal.x *= sideOfLine
        lineNormal.y *= sideOfLine

        this.velocity = getReflectVector(this.velocity, lineNormal)

        this.position.x = collisionPoint.x + lineNormal.x
        this.position.y = collisionPoint.y + lineNormal.y
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