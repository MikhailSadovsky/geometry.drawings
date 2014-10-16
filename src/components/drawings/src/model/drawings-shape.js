/**
 * Shape model.
 */

Drawings.Shape = function Shape(points) {
    this.points = points;
};

Drawings.Shape.prototype.getPoints = function () {
    return this.points;
};

Drawings.Shape.prototype.getPoint = function (pointName) {
    return this.points.filter(function (point) {
        return point.getName() == pointName
    })[0];
};