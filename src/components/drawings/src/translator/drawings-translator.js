/**
 * Translator.
 */

Drawings.Translator = {

    toJson: function (model) {
        return JSON.stringify(this._prepareModelForSerialization(model));
    },

    fromJson: function (json) {
        var jsonModel = JSON.parse(json);

        var points = this._fromJsonPoints(jsonModel.points);
        var shapes = this._fromJsonShapes(jsonModel.shapes, points);

        return [points, shapes];
    },

    _prepareModelForSerialization: function (model) {
        var points = model.getPoints();
        var shapes = [];

        model.getShapes().forEach(function (shape) {
            shapes.push({className: shape.constructor.name, name: shape.getName(), points: shape.getPoints()})
        });

        return {points: points, shapes: shapes};
    },

    _fromJsonPoints: function(jsonPoints) {
        var points = [];

        for (var i = 0; i < jsonPoints.length; i++) {
            var jsonPoint = jsonPoints[i];

            var point = new Drawings.Point(jsonPoint.x, jsonPoint.y);
            point.setName(jsonPoint.name);

            points.push(point);
        }

        return points;
    },

    _fromJsonShapes: function(jsonShapes, points) {
        var shapes = [];
        return shapes;
    }
};