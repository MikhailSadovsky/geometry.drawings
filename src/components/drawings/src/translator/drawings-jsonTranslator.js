/**
 * Json translator.
 */

Drawings.JsonTranslator = {

    toJson: function (model) {
        return JSON.stringify(model);
    },

    fromJson: function (json) {
        var jsonModel = JSON.parse(json);
        var points = this._fromJsonPoints(jsonModel.points);
        var shapes = this._fromJsonShapes(jsonModel.shapes, points);
        return {points: points, shapes: shapes};
    },

    _fromJsonPoints: function (jsonPoints) {
        var points = [];

        jsonPoints.forEach(function (jsonPoint) {
            var point = new Drawings.Point(jsonPoint.x, jsonPoint.y);
            point.setName(jsonPoint.name);
            points.push(point);
        });

        return points;
    },

    _fromJsonShapes: function (jsonShapes, points) {
        var shapes = [];

        var parseMethodsMap = {};
        parseMethodsMap["Line"] = this._parseJsonLine;
        parseMethodsMap["Segment"] = this._parseJsonSegment;
        parseMethodsMap["Triangle"] = this._parseJsonTriangle;

        jsonShapes.forEach(function (jsonShape) {
            var shape = parseMethodsMap[jsonShape.className](jsonShape, points);
            shapes.push(shape);
        });

        return shapes;
    },

    _parseJsonLine: function(jsonLine, points) {
        var point1 = Drawings.Utils.getPointByName(points, jsonLine.points[0].name);
        var point2 = Drawings.Utils.getPointByName(points, jsonLine.points[1].name);
        return new Drawings.Line(point1, point2);
    },

    _parseJsonSegment: function(jsonSegment, points) {
        var point1 = Drawings.Utils.getPointByName(points, jsonSegment.points[0].name);
        var point2 = Drawings.Utils.getPointByName(points, jsonSegment.points[1].name);
        return new Drawings.Segment(point1, point2);
    },

    _parseJsonTriangle: function(jsonTriangle, points) {
        var point1 = Drawings.Utils.getPointByName(points, jsonTriangle.points[0].name);
        var point2 = Drawings.Utils.getPointByName(points, jsonTriangle.points[1].name);
        var point3 = Drawings.Utils.getPointByName(points, jsonTriangle.points[2].name);
        return new Drawings.Triangle(point1, point2, point3);
    }
};