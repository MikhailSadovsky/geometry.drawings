/**
 * Translator.
 */

Drawings.Translator = {

    toJson: function (model) {
        return JSON.stringify(this._prepareModelForSerialization(model));
    },

    _prepareModelForSerialization: function (model) {
        var points = model.getPoints();
        var shapes = [];

        model.getShapes().forEach(function (shape) {
            shapes.push({className: shape.constructor.name, points: shape.getPoints()})
        });

        return {model: {points: points, shapes: shapes}};
    }
};