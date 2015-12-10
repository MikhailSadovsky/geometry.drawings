/**
 * Point renderer.
 */

Drawings.PointRenderer = function (board) {
    this.board = board;
};

Drawings.PointRenderer.prototype = {

    render: function (point) {
        this._drawPoint(point);
    },

    erase: function(point) {
        var jxgPoint = Drawings.Utils.getJxgObjectById(this.board, point.getId());

        this._erasePointName(jxgPoint);
        this._erasePoint(jxgPoint);
    },

    _drawPoint: function (point) {
        var strokeColor = Drawings.Utils.getStrokeColor(point);
        var fillColor = Drawings.Utils.getFillColor(point);
        var namePoint = (point.getName() == 'Point') ? '': point.getName();
        var properties = {
            id: point.getId(),
            name: namePoint,
            showInfobox: false,
            strokeColor: strokeColor,
            fillColor: fillColor,
            strokeWidth:4
        };

        var jxgPoint = this.board.create('point', [point.getX(), point.getY()], properties);

        jxgPoint.coords.on('update', function () {
            point.setXY(this.X(), this.Y());
        }, jxgPoint);
    },

    _erasePointName: function(jxgPoint) {
        if (jxgPoint.textLabel) {
            this.board.removeObject(jxgPoint.textLabel);
        }
    },

    _erasePoint: function(jxgPoint) {
        this.board.removeObject(jxgPoint);
    }
};