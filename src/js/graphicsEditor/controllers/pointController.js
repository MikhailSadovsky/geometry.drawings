/**
 * Created by Администратор on 30.03.14.
 */
var PointCtrl = {

    addPoint : function(event) {
        var point;
        var contains = app.paintPanel.containsPoint(event);
        if(!contains) {
            var coordinates = app.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Point(coordinates[0], coordinates[1]);
            app.paintPanel.model.points.push(point);
            point.draw();
        }
    },

    clearPoints : function() {
    },

    setTooltipText : function() {
        $("#tooltip").text("Нажмите для нарисования точки");
    }
}