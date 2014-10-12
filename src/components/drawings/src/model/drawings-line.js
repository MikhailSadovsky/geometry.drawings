/**
 * Line model.
 */

Drawings.Line = function (point1, point2) {
    Drawings.Line.superclass.constructor.apply(this, [[point1, point2]]);
};

extend(Drawings.Line, Drawings.Shape);

Drawings.Line.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Line.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Line.prototype.draw = function () {
    var point1 = this.point1();
    var point2 = this.point2();

    var line = Drawings.app.paintPanel.board.create('line',
        [[point1.getX(), point1.getY()], [point2.getX(), point2.getY()]]);

    line.setAttribute({
        fixed: true
    });
};