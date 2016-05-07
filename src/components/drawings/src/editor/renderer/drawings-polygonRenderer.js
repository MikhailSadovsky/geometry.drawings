/**
 * Polygon renderer.
 */

Drawings.PolygonRenderer = function (board) {
    this.board = board;
};

Drawings.PolygonRenderer.prototype = {

    render: function (polygon) {
        var jxgPolygon = this._drawPolygon(polygon);

        // if (polygon.getPerimeter() != null) {
        //     this._drawPolygonPerimeter(jxgPolygon, polygon);
        // }
    },

    erase: function(polygon) {
        var jxgPolygon = Drawings.Utils.getJxgObjectById(this.board, polygon.getId());

        // this._erasePolygonPerimeter(jxgPolygon);
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

    // _drawPolygonPerimeter: function (jxgPolygon, polygon) {
    //     var point1 = triangle.point1();
    //     var point2 = triangle.point2();
    //     var point3 = triangle.point3();

    //     var labelX = function () {
    //         return (point1.getX() + point2.getX() + point3.getX()) / 3;
    //     };

    //     var labelY = function () {
    //         return (point1.getY() + point2.getY() + point3.getY()) / 3 + 0.7;
    //     };

    //     var properties = {
    //         fontSize: 13
    //     };

    //     jxgTriangle.textLabelPerimeter = this.board.create('text', [labelX, labelY, "perimeter = " + triangle.getPerimeter()], properties);
    // },

    // _erasePolygonPerimeter: function(jxgPolygon) {
    //     if (jxgPolygon.textLabelPerimeter) {
    //         this.board.removeObject(jxgPolygon.textLabelPerimeter);
    //     }
    // },

    _erasePolygon: function(jxgPolygon) {
        this.board.removeObject(jxgPolygon);
    }
};