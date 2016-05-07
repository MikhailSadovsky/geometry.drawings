/**
 * Polygon model.
 */

Drawings.Polygon = function Polygon(points) {
    Drawings.Polygon.superclass.constructor.apply(this, [points]);
    this.perimeter = null;
};

extend(Drawings.Polygon, Drawings.Shape);

Drawings.Polygon.prototype.points = function () {
    return this.points;
};

Drawings.Polygon.prototype.setPerimeter = function (perimeter) {
    this.perimeter = perimeter;
};

Drawings.Polygon.prototype.getPerimeter = function () {
    return this.perimeter;
};