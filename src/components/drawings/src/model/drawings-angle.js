/**
 * Angle model.
 */

Drawings.Angle = function Angle(point1, point2, point3) {
    Drawings.Angle.superclass.constructor.apply(this, [[point1, point2, point3]]);
    this.value = null;
};

extend(Drawings.Angle, Drawings.Shape);

Drawings.Angle.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Angle.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Angle.prototype.point3 = function () {
    return this.points[2];
};

Drawings.Angle.prototype.setValue = function (value) {
    this.value = value;
};

Drawings.Angle.prototype.getValue = function () {
    return this.value;
};


