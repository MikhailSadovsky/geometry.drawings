/**
 * Segment model.
 */

Drawings.Segment = function Segment(point1, point2) {
    var name = 'Отр(' + point1.getName() + ';' + point2.getName() + ')';
    Drawings.Segment.superclass.constructor.apply(this, [[point1, point2], name]);
};

extend(Drawings.Segment, Drawings.Shape);

Drawings.Segment.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Segment.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Segment.prototype.setPoint1Coordinates = function(x, y) {
    this.points[0].x = x;
    this.points[0].y = y;
};

Drawings.Segment.prototype.setPoint2Coordinates = function(x, y) {
    this.points[1].x = x;
    this.points[1].y = y;
};