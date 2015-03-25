/**
 * Triangle controller.
 */

Drawings.TriangleController = function (model) {
    this.model = model;
};

Drawings.TriangleController.prototype = {

    handleContextMenuEvent: function (jxgTriangle) {
        var triangle = this.model.getShape(jxgTriangle.id);

        var controller = this;

        var setSquareMenuItem = {
            text: 'Задать площадь',
            action: function () {
                controller._setSquareAction(triangle);
                context.destroy();
            }
        };

        context.attach('#' + jxgTriangle.rendNode.id, [setSquareMenuItem]);
    },

    _setSquareAction: function (triangle) {
        var square = prompt('Введите площадь треугольника:');

        if (square != null) {
            triangle.setSquare(square);
            this.model.updated([triangle]);
        }
    }
};