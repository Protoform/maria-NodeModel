/**

A constructor function for creating `LeafModel` objects to be used as part
of the composite design pattern in the model layer of your application.

    var leafModel = new maria.LeafModel();

To attach a `LeafModel` to a `NodeModel`, use the `NodeModel`'s child
manipulation methods: `appendChild`, `insertBefore`, `replaceChild`.
To remove a `LeafModel` from a `NodeModel` use the `Node`'s `removeChild` method.

@constructor

@extends maria.Model

@extends maria.Leaf

*/
maria.LeafModel = function() {
    maria.Model.call(this);
    maria.Leaf.call(this);
};
maria.LeafModel.prototype = maria.create(maria.Model.prototype);
maria.LeafModel.prototype.constructor = maria.LeafModel;


/**

@override

*/
maria.LeafModel.prototype.destroy = function() {
    maria.Leaf.prototype.destroy.call(this);
    maria.Model.prototype.destroy.call(this);
};