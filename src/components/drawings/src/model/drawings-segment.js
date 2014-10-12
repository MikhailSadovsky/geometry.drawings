/**
 * Segment model.
 */

Drawings.Segment = function (point1, point2) {
    Drawings.Segment.superclass.constructor.apply(this, [[point1, point2]]);
};

extend(Drawings.Segment, Drawings.Shape);

Drawings.Segment.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Segment.prototype.point2 = function () {
    return this.points[1];
};