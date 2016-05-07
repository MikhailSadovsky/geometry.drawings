/**
 * Polygon renderer.
 */

Drawings.PolygonRenderer = function (board) {
    this.board = board;
};

Drawings.PolygonRenderer.prototype = {

    render: function (polygon) {
        var jxgPolygon = this._drawPolygon(polygon);

        if (polygon.getSquare() != null) {
            this._drawPolygonSquare(jxgPolygon, polygon);
        }
        if (polygon.getPerimeter() != null) {
            this._drawPolygonPerimeter(jxgPolygon, polygon);
        }
    },

    erase: function(polygon) {
        var jxgPolygon = Drawings.Utils.getJxgObjectById(this.board, polygon.getId());

        this._erasePolygonSquare(jxgPolygon);
        this._erasePolygonPerimeter(jxgPolygon);
        this._erasePolygon(jxgPolygon);
    },

    _drawPolygon: function (polygon) {
        var polygonPoints = polygon.getPoints();
        var jxgPoints = [];

        for (var i = 0; i < polygonPoints.length; i++) {
            var jxgPoint = Drawings.Utils.getJxgObjectById(this.board, polygonPoints[i].getId());
            jxgPoints.push(jxgPoint);
        }

        var strokeColor = Drawings.Utils.getStrokeColor(polygon);
        var fillColor = Drawings.Utils.getFillColor(polygon);

        var properties = {
            id: polygon.getId(),
            name: polygon.getName(),
            straightFirst: false,
            straightLast: false,
            hasInnerPoints: true,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        return this.board.create('polygon', jxgPoints, properties);
    },

    _drawPolygonSquare: function (jxgPolygon, polygon) {
        var means = this._getMeanPosFuncs(polygon);

        var properties = {
            fontSize: 13
        };

        jxgPolygon.textLabelSquare = this.board.create('text', [means[0], means[1], "square = " + polygon.getSquare()], properties);
    },

    _drawPolygonPerimeter: function (jxgPolygon, polygon) {
        var means = this._getMeanPosFuncs(polygon, [0, 0.7]);

        var properties = {
            fontSize: 13
        };

        jxgPolygon.textLabelPerimeter = this.board.create('text', [means[0], means[1], "perimeter = " + polygon.getPerimeter()], properties);
    },

    _erasePolygonSquare: function(jxgPolygon) {
        if (jxgPolygon.textLabelSquare) {
            this.board.removeObject(jxgPolygon.textLabelSquare);
        }
    },

    _erasePolygonPerimeter: function(jxgPolygon) {
        if (jxgPolygon.textLabelPerimeter) {
            this.board.removeObject(jxgPolygon.textLabelPerimeter);
        }
    },

    _erasePolygon: function(jxgPolygon) {
        this.board.removeObject(jxgPolygon);
    },

    _getMeanPosFuncs: function (polygon, offset) {
        var polygonPoints = polygon.getPoints();
        if (!offset) var offset = [0, 0];

        var meanX = function () {
            var mean = 0;
            for (var i = 0; i < polygonPoints.length; i++) {
                mean += polygonPoints[i].getX();
            }
            mean /= polygonPoints.length;
            mean += offset[0];
            return mean;
        }

        var meanY = function () {
            var mean = 0;
            for (var i = 0; i < polygonPoints.length; i++) {
                mean += polygonPoints[i].getY();
            }
            mean /= polygonPoints.length;
            mean += offset[1];
            return mean;
        }

        return [meanX, meanY];
    }
};