Drawings.Circle = function Circle(point1, point2) {
    Drawings.Circle.superclass.constructor.apply(this, [[point1, point2]]);
    this.radius = null;
    //this.className = 'circle';
};

extend(Drawings.Circle, Drawings.Shape);

Drawings.Circle.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Circle.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Circle.prototype.setRadius = function (radius) {
    this.radius = radius;
};
