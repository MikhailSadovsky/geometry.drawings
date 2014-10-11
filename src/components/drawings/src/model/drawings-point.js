/**
 * Point model.
 */

Drawings.Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.name = "";
};

Drawings.Point.prototype = {

    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    equals: function (point) {
        var result = false;
        if (this.x == point.x && this.y == point.y) {
            result = true;
        }
        return result;
    },

    draw: function () {
        if (this.name) {
            var point = Drawings.app.paintPanel.board.create('point', [this.x, this.y], {name: this.name});
        } else {
            var point = Drawings.app.paintPanel.board.create('point', [this.x, this.y]);

        }
        this.name = point.getName();
        point.setAttribute({
            fixed: true
        });
    }
};