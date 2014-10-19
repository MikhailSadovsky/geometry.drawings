/**
 * Translator.
 */

Drawings.Translator = {

    toJson: function (model) {
        return JSON.stringify(this._prepareModelForSerialization(model));
    },

    _prepareModelForSerialization: function (model) {
        var points = model.getPoints();
        var shapes = [];

        model.getShapes().forEach(function (shape) {
            shapes.push({className: shape.constructor.name, name: shape.getName(), points: shape.getPoints()})
        });

        return {model: {points: points, shapes: shapes}};
    },

    toModel: function(json) {
        var object = JSON.parse(json);
        var points = this._createPoints(object.model.points);
        var shapes = this._createShapes(object.model.shapes, points);
        var model = new Drawings.Model();
        model.setPoints(points);
        model.setShapes(shapes);
        return model;
    },

    _createPoints: function(object) {
        var points = [], point;
        object.forEach(function(p) {
            point = new Drawings.Point(p.x, p.y);
            point.setName(p.name);
            points.push(point);
        });
        return points;
    },

    _createShapes: function(object, points) {
        var shapes = [], point1, point2;
        var translator = this;
        object.forEach(function(shape) {
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