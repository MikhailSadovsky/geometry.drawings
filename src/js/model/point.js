/**
 * Created by Ruslan on 27.09.14.
 */
function Point(x, y){

    this.x = x;
    this.y = y;
    this.name = "";
}
Point.prototype.getX = function() {
    return this.x;
};
Point.prototype.getY = function() {

    return this.y;
};
Point.prototype.setName = function(name) {
    this.name = name;
}
Point.prototype.getName = function() {
    return this.name;
}
Point.prototype.equals = function(point) {
    var result = false;
    if(this.x == point.x && this.y == point.y) {
        result = true;
    }
    return result;
}
Point.prototype.draw = function(parpoint) {
    var point = app.paintPanel.board.create('point', [this.x, this.y]);
   // if(parpoint.name) {
   //     var point = app.paintPanel.board.create('point', [this.x, this.y],{name: parpoint.name});
   // }
   // else {
   //     var point = app.paintPanel.board.create('point', [this.x, this.y]);
   //     this.name = point.getName();
   // }

    point.setAttribute({
        fixed: true
    });
}