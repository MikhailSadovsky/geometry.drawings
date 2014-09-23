/**
 * Created by Администратор on 30.03.14.
 */
var PointCtrl = {

    addPoint : function(event) {
        var point;
        var contains = PaintPanel.containsPoint(event);
        if(!contains) {
            var coordinates = PaintPanel.getUsrCoordinatesOfMouse(event);
            point = new ModelPoint(coordinates[0], coordinates[1]);
            Model.points.push(point);
            point.draw();
        }
    },

    clearPoints : function() {
    },

    setTooltipText : function() {
        $("#tooltip").text("Нажмите для нарисования точки");
    }
}