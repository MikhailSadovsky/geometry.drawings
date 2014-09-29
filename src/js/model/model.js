/**
 * Created by Vladimir on 22.09.14.
 */
function Model () {

    this.points = [];
    this.shapes = [];
}
    Model.prototype.getPoint = function(pointName) {
        var point = null;
        for(var i = 0; i < this.points.length; i++) {
            this.points.getName();
        }
        for(var i = 0; i < this.shapes.length; i++) {
            point = this.shapes[i].getPoint(pointName);
            if(point != null) {
                break;
            }
        }
        if(point == null) {
            throw TypeError();
        }
        return point;
    };

Model.prototype.getInfo = function() {
        for(var i = 0; i < this.shapes.length; i++) {
            alert("line - " + i + " " + this.shapes[i].points[0].getName() + "-" + this.shapes[i].points[1].getName())
        }
    };

Model.prototype.clear = function() {
        this.shapes.length = 0;
        this.points.length = 0;
    };

Model.prototype. addShape = function(shape) {
        this.shapes.push(shape)

};