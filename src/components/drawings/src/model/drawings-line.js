/**
 * Line model.
 */

Drawings.Line = function (points) {
    Drawings.Line.superclass.constructor.apply(this, arguments);
};

extend(Drawings.Line, Drawings.Shape);

Drawings.Line.prototype.draw = function () {
    var startPoint = this.points[0];
    var endPoint = this.points[1];
    var line = Drawings.app.paintPanel.board.create('line', [
        [startPoint.x, startPoint.y],
        [endPoint.x, endPoint.y]
    ]);
    line.setAttribute({
        fixed: true
    });
};