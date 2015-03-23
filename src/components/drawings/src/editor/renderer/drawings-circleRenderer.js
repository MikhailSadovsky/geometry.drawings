/**
 * Point renderer.
 */

Drawings.CircleRenderer = function (board) {
    this.board = board;
};

Drawings.CircleRenderer.prototype = {

    render: function (circle) {
        this._drawCircle(circle);
    },

    erase: function(circle) {
        var jxgCircle = Drawings.Utils.getJxgObjectById(this.board, circle.getId());
        this._eraseCircle(jxgCircle);
    },

    _drawCircle: function (circle) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, circle.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, circle.point2().getId());

        var strokeColor = Drawings.Utils.getStrokeColor(circle);

        var properties = {
            id: circle.getId(),
            name: circle.getName(),
            straightFirst: false,
            straightLast: false,
            strokeColor: strokeColor
        };

        this.board.create('circle', [jxgPoint1, jxgPoint2], properties);
    },

    _eraseCircle: function(jxgCircle) {
        this.board.removeObject(jxgCircle);
    }
};