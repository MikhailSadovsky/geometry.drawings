/**
 * Angle controller.
 */

Drawings.AngleController = function (model) {
    this.model = model;
};

Drawings.AngleController.prototype = {

    handleContextMenuEvent: function (jxgAngle, event) {
        var angle = this.model.getShape(jxgAngle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgAngle.rendNode.id, event);

        var setValueMenuItem = {
            text: 'Задать значение',
            action: function () {
                controller._setValueAction(angle);
            }
        };

        var setNameMenuItem = {
            text: 'Задать имя',
            action: function () {
                controller._setNameAction(angle);
            }
        };

        contextMenu.show([setValueMenuItem, setNameMenuItem]);
    },


    _setNameAction: function (angle) {
        var name = prompt('Введите имя :');

        if (name != null) {
            angle.setName(name);
            this.model.updated([angle]);
        }
    },

    _setValueAction: function (angle) {
        var value = prompt('Введите значение угла:');

        if (value != null && value < 180 && value > 0) {
            angle.setValue(value);
            this.model.updated([angle]);
        }
        else {alert("Значение угла не корректно!")}
    },


};