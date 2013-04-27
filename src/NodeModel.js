/**

A constructor function for creating `NodeModel` objects with ordered children
to be used as part of the composite design pattern in your model layer.

Do not mutate the elements of the `childNodes` array directly.
Instead use the `appendChild`, `insertBefore`, `replaceChild`, and `removeChild`
methods to manage the children.

    var nodeModel = new maria.NodeModel();

@constructor

@extends maria.Node

@extends maria.Model

*/
maria.NodeModel = function() {
    maria.Model.call(this);
    maria.Node.call(this);
};

maria.NodeModel.prototype = maria.create(maria.Model.prototype);
maria.NodeModel.prototype.constructor = maria.NodeModel;


/**

@override

*/
maria.NodeModel.prototype.destroy = function() {
    maria.Node.prototype.destroy.call(this);
    maria.Model.prototype.destroy.call(this);
};


/**

@override

*/
maria.NodeModel.prototype.insertBefore = function(newChild, oldChild) {
    var before = {
        parentNode: newChild.parentNode,
        nextSibling: newChild.nextSibling,
        previousSibling: newChild.previousSibling
    };

    maria.Node.prototype.insertBefore.call(this, newChild, oldChild);

    if ((before.parentNode !== newChild.parentNode) ||
        (before.nextSibling !== newChild.nextSibling) ||
        (before.previousSibling !== newChild.previousSibling)) {
        this.dispatchEvent({type: 'change'});    
    }
};


/**

@override

*/
maria.NodeModel.prototype.appendChild = function(newChild) {
    this.insertBefore(newChild, null);
};


/**

@override

*/
maria.NodeModel.prototype.replaceChild = function(newChild, oldChild) {
    var before = {
        parentNode: newChild.parentNode,
        nextSibling: newChild.nextSibling,
        previousSibling: newChild.previousSibling
    };

    maria.Node.prototype.replaceChild.call(this, newChild, oldChild);

    if ((before.parentNode !== newChild.parentNode) ||
        (before.nextSibling !== newChild.nextSibling) ||
        (before.previousSibling !== newChild.previousSibling)) {
        this.dispatchEvent({type: 'change'});    
    }
};


/**

@override

*/
maria.NodeModel.prototype.removeChild = function(oldChild) {
    var before = {
        parentNode: oldChild.parentNode,
        nextSibling: oldChild.nextSibling,
        previousSibling: oldChild.previousSibling
    };

    maria.Node.prototype.removeChild.call(this, oldChild);

    if ((before.parentNode !== oldChild.parentNode) ||
        (before.nextSibling !== oldChild.nextSibling) ||
        (before.previousSibling !== oldChild.previousSibling)) {
        this.dispatchEvent({type: 'change'});    
    }
};
