/**
 * Line model.
 */

Drawings.Line = function Line(point1, point2) {
    var name = 'Прямая(' + point1.getName() + ';' + point2.getName() + ')';
    Drawings.Line.superclass.constructor.apply(this, [[point1, point2], name]);
};

extend(Drawings.Line, Drawings.Shape);

Drawings.Line.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Line.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Line.prototype.setPoint1Coordinates = function(x, y) {
    this.points[0].x = x;
    this.points[0].y = y;
};

Drawings.Line.prototype.setPoint2Coordinates = function(x, y) {
    this.points[1].x = x;
    this.points[1].y = y;
};