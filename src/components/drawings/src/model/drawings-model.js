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

    addPoint: function (point) {
        this.points.push(point);
        this._added([point]);
    },

    addPoints: function (points) {
        this.points = this.points.concat(points);
        this._added(points);
    },

    addShape: function (shape) {
        this.shapes.push(shape);
        this._added([shape]);
    },

    addShapes: function (shapes) {
        this.shapes = this.shapes.concat(shapes);
        this._added(shapes);
    },

    clear: function () {
        this._removed(this.shapes);
        this._removed(this.points);

        this.shapes.length = 0;
        this.points.length = 0;
    },

    onUpdate: function (callback) {
        this.onUpdateCallback = callback;
    },

    _added: function (objectsToAdd) {
        this.onUpdateCallback([], objectsToAdd, [])
    },

    _updated: function (objectsToUpdate) {
        this.onUpdateCallback([], [], objectsToUpdate);
    },

    _removed: function(objectsToRemove) {
        this.onUpdateCallback(objectsToRemove, [], []);
    }
};