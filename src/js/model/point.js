/**
 * Created by Ruslan on 27.09.14.
 */
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