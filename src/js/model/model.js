/**
 * Created by Vladimir on 22.09.14.
 */
var Model = {

    points : [],
    shapes : [],

    getPoint : function(pointName) {
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