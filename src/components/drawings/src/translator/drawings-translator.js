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
        var model = new Drawings.Model();
        model.setPoints(points);
        model.setShapes(shapes);
        return model;
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
        var shapes = [], point1, point2;
        var translator = this;
        jsonShapes.forEach(function(shape) {
            if(shape.className == "Segment") {
                point1 = translator._findPoint(points, shape.points[0].name);
                point2 = translator._findPoint(points, shape.points[1].name);
                shapes.push(new Drawings.Segment(point1, point2));
            } else if(shape.className == "Line") {
                point1 = translator._findPoint(points, shape.points[0].name);
                point2 = translator._findPoint(points, shape.points[1].name);
                shapes.push(new Drawings.Line(point1, point2));
            }
        });
        return shapes;
    },

    _findPoint: function(points, pointName) {
        var point;
        for(var i = 0; i < points.length; i++) {
            if(points[i].getName() == pointName) {
                point = points[i]
            }
        }
        return point;
    }
};