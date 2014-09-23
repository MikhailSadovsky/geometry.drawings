/**
 * Created by Администратор on 09.12.13.
 */

var LineCtrl = {

    points: [],

    addPoint: function (event) {
        var point;
        var contains = PaintPanel.containsPoint(event);
        if(!contains) {
            var coordinates = PaintPanel.getUsrCoordinatesOfMouse(event);
            point = new ModelPoint(coordinates[0], coordinates[1]);
            point.draw();
        } else {
            var pointName = PaintPanel.getExistPointName();
            point = Model.getPoint(pointName);
        }
        this.addLinePoint(point);
        this.setTooltipText();
    },

    addLinePoint : function(point) {
        this.points.push(point);
        if(this.points.length == 2) {
            var linePoints = [this.points[0], this.points[1]];
            var line = new Line(linePoints);
            line.draw();
            Model.addShape(line)
            this.points.length = 0;
        }
    },

    clearPoints: function () {
        this.points.length = 0;
    },

    setTooltipText : function() {
        var info = "";
        switch (this.points.length) {
            case 0 :
                info = "Установите начальную точку линии";
                break;
            case 1:
                info = "Установите конечную точку линии";
        }
        $("#tooltip").text(info);
    }
};