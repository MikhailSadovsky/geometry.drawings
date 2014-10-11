/**
 * Point model.
 */

Drawings.Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.name = "";
};

Drawings.Point.prototype.getX = function () {
    return this.x;
};

Drawings.Point.prototype.getY = function () {
    return this.y;
};

Drawings.Point.prototype.setName = function (name) {
    this.name = name;
};

Drawings.Point.prototype.getName = function () {
    return this.name;
};

Drawings.Point.prototype.equals = function (point) {
    var result = false;
    if (this.x == point.x && this.y == point.y) {
        result = true;
    }
    return result;
};

Drawings.Point.prototype.draw = function () {
    //var point = app.paintPanel.board.create('point', [this.x, this.y]);
    if (this.name) {
        var point = Drawings.app.paintPanel.board.create('point', [this.x, this.y], {name: this.name});
    } else {
        var point = Drawings.app.paintPanel.board.create('point', [this.x, this.y]);

    }
    this.name = point.getName();
    point.setAttribute({
        fixed: true
    });
};