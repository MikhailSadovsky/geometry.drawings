/**
 * Drawings model.
 */

Drawings.Model = function Model() {
    this.points = [];
    this.shapes = [];
};

Drawings.Model.prototype = {

    onUpdateCallback: null,

    getPoints: function() {
        return this.points;
    },

    getShapes: function() {
        return this.shapes;
    },

    getPoint: function (pointName) {
        return this.points.filter(function (point) {
            return point.getName() == pointName;
        });
    },

    clear: function () {
        this.shapes = [];
        this.points = [];
    },

    addShape: function (shape) {
        this.shapes.push(shape);
        this._updated();
    },

    addPoint: function (point) {
        this.points.push(point);
        this._updated();
    },

    onUpdate: function(callback) {
        this.onUpdateCallback = callback;
    },

    _updated: function() {
        this.onUpdateCallback.call();
    }
};