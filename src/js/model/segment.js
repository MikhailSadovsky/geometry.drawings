/**
 * Created by Ruslan on 27.09.14.
 */
extend(Segment, Shape);
function Segment(points) {
    Line.superclass.constructor.apply(this, arguments);
}
Segment.prototype.draw = function() {
    var startPoint = this.points[0];
    var endPoint = this.points[1];
    var segment = PaintPanel.board.create('line', [[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]],
        {straightFirst:false, straightLast:false});
    segment.setAttribute({
        fixed: true
    });
}

