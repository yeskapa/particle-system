function distance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

function collisionLineLine(line1, line2) {

    var uA = ((line2.p2.x-line2.p1.x)*(line1.p1.y-line2.p1.y) - (line2.p2.y-line2.p1.y)*(line1.p1.x-line2.p1.x)) / ((line2.p2.y-line2.p1.y)*(line1.p2.x-line1.p1.x) - (line2.p2.x-line2.p1.x)*(line1.p2.y-line1.p1.y))
    var uB = ((line1.p2.x-line1.p1.x)*(line1.p1.y-line2.p1.y) - (line1.p2.y-line1.p1.y)*(line1.p1.x-line2.p1.x)) / ((line2.p2.y-line2.p1.y)*(line1.p2.x-line1.p1.x) - (line2.p2.x-line2.p1.x)*(line1.p2.y-line1.p1.y))
  
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return {x:line1.p1.x + (uA * (line1.p2.x-line1.p1.x)), y:line1.p1.y + (uA * (line1.p2.y-line1.p1.y))}
    }
    return false
}

function getClosestPointOnLine(pos, line) {
    var len = distance(line.p1, line.p2)
    var dot = (((pos.x - line.p1.x) * (line.p2.x - line.p1.x)) + ((pos.y - line.p1.y) * (line.p2.y - line.p1.y))) / (len * len)
    var closestPoint = { x: line.p1.x + (dot * (line.p2.x - line.p1.x)), y: line.p1.y + (dot * (line.p2.y - line.p1.y)) }

    var cpl1dist = distance(closestPoint, line.p1)
    var cpl2dist = distance(closestPoint, line.p2)

    if (cpl1dist > len) {
        return { x: line.p2.x, y: line.p2.y }
    }
    if (cpl2dist > len) {
        return { x: line.p1.x, y: line.p1.y }
    }
    return closestPoint
}

function collisionCircleLine(pos, rad, line) {
    var closestPoint = getClosestPointOnLine(pos, line)

    //line(closestPoint.x, closestPoint.y, c.x, c.y)
    if (distance(closestPoint, pos) < rad) {
        return true
    }
    return false
}