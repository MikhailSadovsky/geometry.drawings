/**
 * Created by Ruslan on 27.09.14.
 */

function extend(Child, Parent) {
    var F = function() { }
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.superclass = Parent.prototype
}

function Shape(points) {
    this.points = points;
}
Shape.prototype.getPoint = function(pointName) {
    var point = null;
    for(var i = 0; i < this.points.length; i++) {
        if(this.points[i].name == pointName) {
            point = this.points[i];
            break;
        }
    }
    return point;
}





