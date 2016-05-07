/**
 * Polygon model.
 */

Drawings.Polygon = function Polygon(points) {
    Drawings.Polygon.superclass.constructor.apply(this, [points]);
    this.square = null;
    this.perimeter = null;
};

extend(Drawings.Polygon, Drawings.Shape);

Drawings.Polygon.prototype.setSquare = function (square) {
    this.square = square;
};

Drawings.Polygon.prototype.getSquare = function () {
    return this.square;
};

Drawings.Polygon.prototype.setPerimeter = function (perimeter) {
    this.perimeter = perimeter;
};

Drawings.Polygon.prototype.getPerimeter = function () {
    return this.perimeter;
};