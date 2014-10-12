/**
 * Segment model.
 */

Drawings.Segment = function (point1, point2) {
    Drawings.Segment.superclass.constructor.apply(this, [[point1, point2]]);
};

extend(Drawings.Segment, Drawings.Shape);

Drawings.Segment.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Segment.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Segment.prototype.draw = function () {
    var point1 = this.point1();
    var point2 = this.point2();

    var jsxSegment = Drawings.app.paintPanel.board.create('line',
        [[point1.getX(), point1.getY()], [point2.getX(), point2.getY()]], {straightFirst: false, straightLast: false});

    jsxSegment.setAttribute({
        fixed: true
    });
};