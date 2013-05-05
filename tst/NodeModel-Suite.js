(function() {

    buster.testCase('nodeSuite', {

        "test has EventTarget interface": function() {
            var nodeModel = new maria.NodeModel();
            assert.isFunction(nodeModel.dispatchEvent);
            assert.isFunction(nodeModel.addEventListener);
            assert.isFunction(nodeModel.removeEventListener);
            assert.isFunction(nodeModel.addParentEventTarget);
            assert.isFunction(nodeModel.removeParentEventTarget);
            assert.isFunction(nodeModel.destroy);
        },

        "test has Node interface": function() {
            var nodeModel = new maria.NodeModel();
            assert.same(true, 'parentNode' in nodeModel);
            assert.same(true, 'previousSibling' in nodeModel);
            assert.same(true, 'nextSibling' in nodeModel);
            assert.same(true, 'firstChild' in nodeModel);
            assert.same(true, 'lastChild' in nodeModel);
            assert.same(true, 'childNodes' in nodeModel);
            assert.isFunction(nodeModel.destroy);
            assert.isFunction(nodeModel.hasChildNodes);
        },

        "test destroy dispatches event": function() {
            var nodeModel = new maria.NodeModel();
            var called = false;
            var listener = function() {
                called = true;
            };
            nodeModel.addEventListener('destroy', listener);
            nodeModel.destroy();
            assert.same(true, called);
        },

        "test destroy nulls relationships": function() {
            var nodeModel = new maria.NodeModel();
            // application code would NEVER set these properties directly
            nodeModel.parentNode = true;
            nodeModel.previousSibling = true;
            nodeModel.nextSibling = true;
            nodeModel.childNodes = [];
            nodeModel.firstChild = true;
            nodeModel.lastChild = true;
            nodeModel.destroy();
            assert.same(null, nodeModel.parentNode);
            assert.same(null, nodeModel.previousSibling);
            assert.same(null, nodeModel.nextSibling);
            assert.same(null, nodeModel.childNodes);
            assert.same(null, nodeModel.firstChild);
            assert.same(null, nodeModel.lastChild);
        },

        "test destroy on child removes it": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);

            assert.same(2, nodeModel.childNodes.length);
            assert.same(leafModel0, nodeModel.childNodes[0]);
            assert.same(leafModel1, nodeModel.childNodes[1]);
            assert.same(leafModel0, nodeModel.firstChild);
            assert.same(leafModel1, nodeModel.lastChild);
            assert.same(leafModel1, leafModel0.nextSibling);
            assert.same(leafModel0, leafModel1.previousSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel1.nextSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(nodeModel, leafModel0.parentNode);
            assert.same(nodeModel, leafModel1.parentNode);

            leafModel0.destroy();

            assert.same(1, nodeModel.childNodes.length);
            assert.same(leafModel1, nodeModel.childNodes[0]);
            assert.same(leafModel1, nodeModel.firstChild);
            assert.same(leafModel1, nodeModel.lastChild);
            assert.same(null, leafModel0.nextSibling);
            assert.same(null, leafModel1.previousSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel1.nextSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel0.parentNode);
            assert.same(nodeModel, leafModel1.parentNode);
        },

        "test destroy on grandchild does not remove child from parent": function() {
            var parent = new maria.NodeModel();
            var child = new maria.NodeModel();
            var grandchild = new maria.LeafModel();
            parent.appendChild(child);
            child.appendChild(grandchild);

            grandchild.destroy();

            assert.same(1, parent.childNodes.length);
            assert.same(child, parent.childNodes[0]);
            assert.same(child, parent.firstChild);
            assert.same(child, parent.lastChild);
            assert.same(parent, child.parentNode);
            assert.same(null, child.nextSibling);
            assert.same(null, child.previousSibling);
            
            assert.same(0, child.childNodes.length);
            assert.same(undefined, child.childNodes[0]);
            assert.same(null, child.firstChild);
            assert.same(null, child.lastChild);
            assert.same(null, grandchild.parentNode);
            assert.same(null, grandchild.nextSibling);
            assert.same(null, grandchild.previousSibling);
        },

        "test destroy calls destroy on childNodes": function() {
            var nodeModel = new maria.NodeModel();
            var child0 = new maria.NodeModel();
            var child1 = new maria.LeafModel();
            nodeModel.appendChild(child0);
            nodeModel.appendChild(child1);
            var called = 0;
            child0.addEventListener('destroy', function() {
                called++;
            });
            child1.addEventListener('destroy', function() {
                called++;
            });
            nodeModel.destroy();
            assert.same(2, called);
        },

        "test events bubble up the tree to grandparent": function() {
            var parent = new maria.NodeModel();
            var child = new maria.NodeModel();
            var grandchild = new maria.LeafModel();
            parent.appendChild(child);
            child.appendChild(grandchild);
            
            var called = false;
            
            parent.addEventListener('alpha', function() {
                called = true;
            });
            
            grandchild.dispatchEvent({type: 'alpha'});
            
            assert.same(true, called);
        },

        "test parent starts being bubble parent after child is appended": function() {
            var parent = new maria.NodeModel();
            var child = new maria.NodeModel();
            parent.appendChild(child);
            
            var called = false;
            
            parent.addEventListener('alpha', function() {
                called = true;
            });
            
            child.dispatchEvent({type: 'alpha'});
            
            assert.same(true, called);
        },

        "test parent stops being bubble parent after child is removed": function() {
            var parent = new maria.NodeModel();
            var child = new maria.NodeModel();
            parent.appendChild(child);
            
            var called = false;
            
            parent.addEventListener('alpha', function() {
                called = true;
            });
            
            parent.removeChild(child);
            child.dispatchEvent({type: 'alpha'});
            
            assert.same(false, called);
        },

        "test insertBefore dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel1);
            var events= [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });
            nodeModel.insertBefore(leafModel0, leafModel1);
            assert.same(1, events.length);
            var event = events[0];
            assert.isObject(event);
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(0, event.removedNodes.length);
            assert.isArray(event.addedNodes);
            assert.same(1, event.addedNodes.length);
            assert.same(leafModel0, event.addedNodes[0]);
            assert.same(null, event.previousSibling);
            assert.same(leafModel1, event.nextSibling);
        },  

        "test insertBefore sets parentNode": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            nodeModel.appendChild(leafModel);
            assert.same(nodeModel, leafModel.parentNode);
        },

        "test insertBefore dispatchs event when child moves": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);
            var events = [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });
            nodeModel.insertBefore(leafModel1, leafModel0); // swaps the order of the two children
            assert.same(2, events.length);

            var event = events[0];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(1, event.removedNodes.length);
            assert.same(leafModel1, event.removedNodes[0]);
            assert.isArray(event.addedNodes);
            assert.same(0, event.addedNodes.length);
            assert.same(leafModel0, event.previousSibling);
            assert.same(null, event.nextSibling);

            var event = events[1];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(0, event.removedNodes.length);
            assert.isArray(event.addedNodes);
            assert.same(1, event.addedNodes.length);
            assert.same(leafModel1, event.addedNodes[0]);
            assert.same(null, event.previousSibling);
            assert.same(leafModel0, event.nextSibling);
        },

        "test insertBefore does not dispatch event when child was already last child": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            nodeModel.appendChild(leafModel);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.insertBefore(leafModel, null);
            assert.same(false, happened);
        },

        "test appendChild dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            var events = [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });
            nodeModel.appendChild(leafModel);
            assert.same(1, events.length);
            var event = events[0];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(0, event.removedNodes.length);
            assert.isArray(event.addedNodes);
            assert.same(1, event.addedNodes.length);
            assert.same(leafModel, event.addedNodes[0]);
            assert.same(null, event.previousSibling);
            assert.same(null, event.nextSibling);
        },

        "test appendChild dispatchs event when child moves": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);
            var events = [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });
            nodeModel.appendChild(leafModel0); // swaps the order of the two children

            assert.same(2, events.length);

            var event = events[0];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(1, event.removedNodes.length);
            assert.same(leafModel0, event.removedNodes[0]);
            assert.isArray(event.addedNodes);
            assert.same(0, event.addedNodes.length);
            assert.same(null, event.previousSibling);
            assert.same(leafModel1, event.nextSibling);
            
            var event = events[1];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(0, event.removedNodes.length);
            assert.isArray(event.addedNodes);
            assert.same(1, event.addedNodes.length);
            assert.same(leafModel0, event.addedNodes[0]);
            assert.same(leafModel1, leafModel0.previousSibling);
            assert.same(leafModel1, event.previousSibling);
            assert.same(null, event.nextSibling);
        },

        "test appendChild does not dispatch event when child was already last child": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            nodeModel.appendChild(leafModel);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.appendChild(leafModel);
            assert.same(false, happened);
        },
        
        "=>test replaceChild dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            var events = [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });

            nodeModel.replaceChild(leafModel1, leafModel0);

            // it would be better to optimize so that there is
            // only 1 event in this case.
            assert.same(2, events.length);

            var event = events[0];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(0, event.removedNodes.length);
            assert.isArray(event.addedNodes);
            assert.same(1, event.addedNodes.length);
            assert.same(null, event.previousSibling);
            assert.same(leafModel0, event.nextSibling);
            
            var event = events[1];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(1, event.removedNodes.length);
            assert.same(leafModel0, event.removedNodes[0])
            assert.isArray(event.addedNodes);
            assert.same(0, event.addedNodes.length);
            assert.same(leafModel1, event.previousSibling);
            assert.same(null, event.nextSibling);
        },

        "test replaceChild dispatchs event when child moves": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);
            var events = [];
            maria.on(nodeModel, 'change', function(evt) {
                events.push(evt);
            });
            nodeModel.replaceChild(leafModel0, leafModel1); // effectively removes leafModel1

            // There is only one event for the removal of leafModel1 because
            // leafModel0 is already in the correct location.

            assert.same(1, events.length);

            var event = events[0];
            assert.same('change', event.type);
            assert.isArray(event.removedNodes);
            assert.same(1, event.removedNodes.length);
            assert.same(leafModel1, event.removedNodes[0]);
            assert.isArray(event.addedNodes);
            assert.same(0, event.addedNodes.length);
            assert.same(leafModel0, event.previousSibling);
            assert.same(null, event.nextSibling);
        },

        "test replaceChild does not dispatch event when child replacing itself": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            nodeModel.appendChild(leafModel);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.replaceChild(leafModel, leafModel);
            assert.same(false, happened);
        },

        "test removeChild does remove the child": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);

            assert.same(2, nodeModel.childNodes.length);
            assert.same(leafModel0, nodeModel.childNodes[0]);
            assert.same(leafModel1, nodeModel.childNodes[1]);
            assert.same(leafModel0, nodeModel.firstChild);
            assert.same(leafModel1, nodeModel.lastChild);
            assert.same(leafModel1, leafModel0.nextSibling);
            assert.same(leafModel0, leafModel1.previousSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel1.nextSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(nodeModel, leafModel0.parentNode);
            assert.same(nodeModel, leafModel1.parentNode);

            nodeModel.removeChild(leafModel0);

            assert.same(1, nodeModel.childNodes.length);
            assert.same(leafModel1, nodeModel.childNodes[0]);
            assert.same(leafModel1, nodeModel.firstChild);
            assert.same(leafModel1, nodeModel.lastChild);
            assert.same(null, leafModel0.nextSibling);
            assert.same(null, leafModel1.previousSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel1.nextSibling);
            assert.same(null, leafModel0.previousSibling);
            assert.same(null, leafModel0.parentNode);
            assert.same(nodeModel, leafModel1.parentNode);
        },

        "test removeChild dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel = new maria.LeafModel();
            nodeModel.appendChild(leafModel);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.removeChild(leafModel);
            assert.same(true, happened);
        },

        "test subclass method exists": function() {
            assert.isFunction(maria.NodeModel.subclass);
        }

    });

}());
