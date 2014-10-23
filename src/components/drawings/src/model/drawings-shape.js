/**
 * Shape model.
 */

Drawings.Shape = function Shape(points, name) {
    this.points = points;
    this.name = name;
};

Drawings.Shape.prototype.getPoints = function () {
    return this.points;
};

Drawings.Shape.prototype.getPoint = function (pointName) {
    return this.points.filter(function (point) {
        return point.getName() == pointName
    })[0];
};

Drawings.Shape.prototype.getName = function () {
    return this.name;
};

Drawings.Shape.prototype.setPointCoordinates = function (index, x, y) {
    this.points[index].x = x;
    this.points[index].y = y;
};