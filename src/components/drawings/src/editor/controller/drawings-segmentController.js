/**
 * Segment controller.
 */

Drawings.SegmentController = function (model) {
    this.model = model;
};

Drawings.SegmentController.prototype = {

    handleContextMenuEvent: function (jxgSegment) {
        var segment = this.model.getShape(jxgSegment.id);

        var controller = this;

        var setLengthMenuItem = {
            text: 'Задать длину',
            action: function () {
                controller._setLengthAction(segment);
                context.destroy();
            }
        };

        context.attach('#' + jxgSegment.rendNode.id, [setLengthMenuItem]);
    },

    _setLengthAction: function (segment) {
        var length = prompt('Введите длину отрезка:');

        if (length != null) {
            segment.setLength(length);
            this.model.updated([segment]);
        }
    }
};