/**
 * Created by Vladimir on 22.09.14.
 */
var Model = {

    points : [],
    shapes : [],

    getPoint : function(pointName) {
        var point = null;
        for(var i = 0; i < this.points.length; i++) {
            if(this.points[i].name == pointName) {
                point = this.points[i];
                return point;
            }
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
    },

    getInfo : function() {
        for(var i = 0; i < this.shapes.length; i++) {
            alert("line - " + i + " " + this.shapes[i].points[0].getName() + "-" + this.shapes[i].points[1].getName())
        }
    },

    clear : function() {
        this.shapes.length = 0;
        this.points.length = 0;
    },

    addShape : function(shape) {
        this.shapes.push(shape)
    }
}

function ModelPoint(x, y){

    this.x = x;
    this.y = y;
    this.name = "";
}
ModelPoint.prototype.getX = function() {
    return this.x;
};
ModelPoint.prototype.getY = function() {

    return this.y;
};
ModelPoint.prototype.getX = function() {
    return this.x;
};
ModelPoint.prototype.getY = function() {
    return this.y;
}
ModelPoint.prototype.setName = function(name) {
    this.name = name;
}
ModelPoint.prototype.getName = function() {
    return this.name;
}
ModelPoint.prototype.equals = function(point) {
    var result = false;
    if(this.x == point.x && this.y == point.y) {
        result = true;
    }
    return result;
}
ModelPoint.prototype.draw = function() {
    var point = PaintPanel.board.create('point', [this.x, this.y]);
    this.name = point.getName();
    point.setAttribute({
        fixed: true
    });
}

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
function Line(points) {
    Line.superclass.constructor.apply(this, arguments);
}
extend(Segment, Shape);
extend(Line, Shape);

Line.prototype.draw = function() {
    var startPoint = this.points[0];
    var endPoint = this.points[1];
    var line = PaintPanel.board.create('line', [[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]]);
    line.setAttribute({
        fixed: true
    });
}

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

