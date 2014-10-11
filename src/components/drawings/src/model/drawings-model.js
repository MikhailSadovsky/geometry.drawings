/**
 * Drawings model.
 */

Drawings.Model = function Model() {
    this.points = [];
    this.shapes = [];
};

Drawings.Model.prototype = {

    getPoint: function (pointName) {
        var point = null;
        for (var i = 0; i < this.points.length; i++) {
            if (pointName == this.points[i].getName()) {
                point = this.points[i];
            }
        }
        for (i = 0; i < this.shapes.length; i++) {
            point = this.shapes[i].getPoint(pointName);
            if (point != null) {
                break;
            }
        }
        if (point == null) {
            throw TypeError();
        }
        return point;
    },

    getInfo: function () {
        for (var i = 0; i < this.shapes.length; i++) {
            alert("line - " + i + " " + this.shapes[i].points[0].getName() + "-" + this.shapes[i].points[1].getName())
        }
    },

    clear: function () {
        this.shapes = [];
        this.points = [];
    },

    addShape: function (shape) {
        this.shapes.push(shape)

    },

    addPoint: function (point) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].name == point.name) {
                return;
            }
        }
        this.points.push(point);
    },

    Initialize: function (parmodel) {
        this.clear();
        for (var i = 0; i < parmodel.points.length; i++) {
            this.points.push(parmodel.points[i]);
            this.points[this.points.length - 1].draw();
        }
        for (var i = 0; i < parmodel.shapes.length; i++) {
            this.shapes.push(parmodel.shapes[i]);
            this.shapes[this.shapes.length - 1].draw();
        }
        //TODO: When insert other types of figure we must add other cycles
    }
};