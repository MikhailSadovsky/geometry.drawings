/**
 * Triangle model.
 */

Drawings.Triangle = function Triangle(point1, point2, point3) {
    Drawings.Triangle.superclass.constructor.apply(this, [[point1, point2, point3]]);
};

extend(Drawings.Triangle, Drawings.Shape);

Drawings.Triangle.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Triangle.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Triangle.prototype.point3 = function () {
    return this.points[2];
};