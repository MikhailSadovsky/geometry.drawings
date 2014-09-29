/**
 * Created by Ruslan on 27.09.14.
 */
extend(Line, Shape);
function Line(points) {
    Line.superclass.constructor.apply(this, arguments);
}
Line.prototype.draw = function() {
    var startPoint = this.points[0];
    var endPoint = this.points[1];
    var line = PaintPanel.board.create('line', [[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]]);
    line.setAttribute({
        fixed: true
    });
}

