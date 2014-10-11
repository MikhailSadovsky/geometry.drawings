/**
 * Shape model.
 */

Drawings.Shape = function (points) {
    this.points = points;
};

Drawings.Shape.prototype.getPoint = function (pointName) {
    var point = null;
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].name == pointName) {
            point = this.points[i];
            break;
        }
    }
    return point;
};

Drawings.Shape.prototype.addPoint = function (point) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].name == point.name) {
            return;
        }
    }
};