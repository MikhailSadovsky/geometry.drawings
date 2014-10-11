/**
 * Segment model.
 */

Drawings.Segment = function (points) {
    Drawings.Segment.superclass.constructor.apply(this, arguments);
};

extend(Drawings.Segment, Drawings.Shape);

Drawings.Segment.prototype.draw = function () {
    var startPoint = this.points[0];
    var endPoint = this.points[1];
    var segment = Drawings.app.paintPanel.board.create('line', [
            [startPoint.x, startPoint.y],
            [endPoint.x, endPoint.y]
        ],
        {straightFirst: false, straightLast: false});
    segment.setAttribute({
        fixed: true
    });
};