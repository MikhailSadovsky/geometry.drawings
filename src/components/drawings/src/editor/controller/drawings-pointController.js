/**
 * Point controller.
 */

Drawings.PointController = function (model) {
    this.model = model;
};

Drawings.PointController.prototype = {

    handleContextMenuEvent: function (jxgPoint) {
        var point = this.model.getPoint(jxgPoint.id);

        var controller = this;

        var setNameMenuItem = {
            text: 'Задать имя точки',
            action: function () {
                controller._setNameAction(point);
                context.destroy();
            }
        };

        context.attach('#' + jxgPoint.rendNode.id, [setNameMenuItem]);
    },

    _setNameAction: function (point) {
        var name = prompt('Введите имя точки:');

        if (name != null) {
            point.setName(name);
            this.model.updated([point]);
        }
    }
};