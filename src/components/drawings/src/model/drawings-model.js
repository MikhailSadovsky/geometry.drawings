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
        return this.points.find(function (point) {
            return point.getName() == pointName;
        });
    },

    getShape: function (shapeName) {
        return this.points.find(function (point) {
            return point.getName() == shapeName;
        });
    },

    clear: function () {
        this.shapes.length = 0;
        this.points.length = 0;
    },

    addShape: function (shape) {
        this.shapes.push(shape);
        this._updated();
    },

    addPoint: function (point) {
        this.points.push(point);
        this._updated();
    },

    onUpdate: function (callback) {
        this.onUpdateCallback = callback;
    },

    _updated: function () {
        this.onUpdateCallback.call();
    }
};