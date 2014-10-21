/**
 * Drawings model.
 */

Drawings.Model = function Model() {
    this.points = [];
    this.shapes = [];
};

Drawings.Model.prototype = {

    onUpdateCallback: null,

    getPoints: function () {
        return this.points;
    },

    getShapes: function () {
        return this.shapes;
    },

    getPoint: function (pointName) {
        return this.points.filter(function (point) {
            return point.getName() == pointName;
        })[0];
    },

    getShape: function (shapeName) {
        return this.shapes.filter(function (shape) {
            return shape.getName() == shapeName;
        })[0];
    },

    clear: function () {
        this.shapes.length = 0;
        this.points.length = 0;
    },

    addShape: function (shape) {
        this.shapes.push(shape);
        this._updated([shape]);
    },

    addPoint: function (point) {
        this.points.push(point);
        this._updated([point]);
    },

    onUpdate: function (callback) {
        this.onUpdateCallback = callback;
    },

    _updated: function (updatedObjects) {
        this.onUpdateCallback.call(this, updatedObjects);
    }
};