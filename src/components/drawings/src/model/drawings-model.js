/**
 * Drawings model.
 */

Drawings.Model = function Model() {
    this.points = [];
    this.shapes = [];
};

Drawings.Model.prototype = {

    onUpdateCallback: null,

    getModelObjects: function () {
        return [].concat(this.points, this.shapes);
    },

    getModelObject: function (objectId) {
        return Drawings.Utils.getObjectById(this.getModelObjects(), objectId);
    },

    getPoints: function () {
        return this.points;
    },

    getShapes: function () {
        return this.shapes;
    },

    getPoint: function (pointId) {
        return Drawings.Utils.getObjectById(this.points, pointId);
    },

    getShape: function (shapeId) {
        return Drawings.Utils.getObjectById(this.shapes, shapeId);
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

    updated: function (object) {
        if (object instanceof Drawings.Point) {
            this._updatePoint(object);
        }
        else {
            this._updated([object]);
        }
    },

    _updatePoint: function (point) {
        var connectedShapes = this._getConnectedShapes(point);
        this._removed(connectedShapes);
        this._updated([point]);
        this._added(connectedShapes);
    },

    _getConnectedShapes: function (point) {
        var connectedShapes = [];

        for (var i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];
            var pointIndex = shape.getPoints().indexOf(point);

            if (pointIndex >= 0) {
                connectedShapes.push(shape);
            }
        }

        return connectedShapes;
    },

    _added: function (objectsToAdd) {
        this.onUpdateCallback([], objectsToAdd, [])
    },

    _updated: function (objectsToUpdate) {
        this.onUpdateCallback([], [], objectsToUpdate);
    },

    _removed: function (objectsToRemove) {
        this.onUpdateCallback(objectsToRemove, [], []);
    }
};