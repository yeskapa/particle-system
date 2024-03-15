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