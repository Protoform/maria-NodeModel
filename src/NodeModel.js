/**

A constructor function for creating `NodeModel` objects with ordered children
to be used as part of the composite design pattern in your model layer.

Do not mutate the elements of the `childNodes` array directly.
Instead use the `appendChild`, `insertBefore`, `replaceChild`, and `removeChild`
methods to manage the children.

    var nodeModel = new maria.NodeModel();

@constructor

@extends maria.Model

@extends maria.Node

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
maria.NodeModel.prototype.hasChildNodes = function() {
    return maria.Node.prototype.hasChildNodes.call(this);
};

/**

@override

*/
maria.NodeModel.prototype.destroy = function() {
    // must call model destroy method first so containing
    // node can remove the child before the child
    // null's its parentNode reference which happens
    // in the leaf destroy method.
    maria.Model.prototype.destroy.call(this);
    maria.Node.prototype.destroy.call(this);
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

        if (typeof newChild.addEventListener === 'function') {
            newChild.addEventListener('destroy', this);
        }
        if (typeof newChild.addParentEventTarget === 'function') {
            newChild.addParentEventTarget(this);
        }

        this.dispatchEvent({
            type: 'change',
            removedNodes: [],
            addedNodes: [newChild],
            previousSibling: newChild.previousSibling,
            nextSibling: newChild.nextSibling
        });    
    }
};


/**

@override

*/
maria.NodeModel.prototype.appendChild = function(newChild) {
    maria.Node.prototype.appendChild.call(this, newChild);
};


/**

@override

*/
maria.NodeModel.prototype.replaceChild = function(newChild, oldChild) {
    maria.Node.prototype.replaceChild.call(this, newChild, oldChild);
};


/**

@override

*/
maria.NodeModel.prototype.removeChild = function(oldChild) {
    if (oldChild.parentNode !== this) {
        throw new Error('maria.NodeModel.prototype.removeChild: oldChild is not a child of this NodeModel.');
    }

    var before = {
        previousSibling: oldChild.previousSibling,
        nextSibling: oldChild.nextSibling
    };

    maria.Node.prototype.removeChild.call(this, oldChild);

    if (typeof oldChild.removeEventListener === 'function') {
        oldChild.removeEventListener('destroy', this);
    }
    if (typeof oldChild.removeParentEventTarget === 'function') {
        oldChild.removeParentEventTarget(this);
    }

    this.dispatchEvent({
        type: 'change',
        removedNodes: [oldChild],
        addedNodes: [],
        previousSibling: before.previousSibling,
        nextSibling: before.nextSibling
    });    
};

/**

If a child fires a `destroy` event then that child
must be removed from this node. This handler will do the delete.

@param {Object} event The event object.

*/
maria.NodeModel.prototype.handleEvent = function(evt) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this node.
    if ((evt.type === 'destroy') &&
        (evt.currentTarget === evt.target)) {
        this.removeChild(evt.target);
    }

};

maria.NodeModel.subclass = function() {
    maria.Model.subclass.apply(this, arguments);
};
