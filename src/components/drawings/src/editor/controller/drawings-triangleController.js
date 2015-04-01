/**
 * Triangle controller.
 */

Drawings.TriangleController = function (model) {
    this.model = model;
};

Drawings.TriangleController.prototype = {

    handleContextMenuEvent: function (jxgTriangle, event) {
        var triangle = this.model.getShape(jxgTriangle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgTriangle.rendNode.id, event);

        var setSquareMenuItem = {
            text: 'Задать площадь',
            action: function () {
                controller._setSquareAction(triangle);
            }
        };

        contextMenu.show([setSquareMenuItem]);
    },

    _setSquareAction: function (triangle) {
        var square = prompt('Введите площадь треугольника:');

        if (square != null) {
            triangle.setSquare(square);
            this.model.updated([triangle]);
        }
    }
};