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

        "test insertBefore dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel1);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.insertBefore(leafModel0, leafModel1);
            assert.same(true, happened);
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
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.insertBefore(leafModel1, leafModel0); // swaps the order of the two children
            assert.same(true, happened);
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
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.appendChild(leafModel);
            assert.same(true, happened);
        },

        "test appendChild dispatchs event when child moves": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.appendChild(leafModel0); // swaps the order of the two children
            assert.same(true, happened);
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
        
        "test replaceChild dispatches an event": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.replaceChild(leafModel1, leafModel0);
            assert.same(true, happened);
        },

        "test replaceChild dispatchs event when child moves": function() {
            var nodeModel = new maria.NodeModel();
            var leafModel0 = new maria.LeafModel();
            var leafModel1 = new maria.LeafModel();
            nodeModel.appendChild(leafModel0);
            nodeModel.appendChild(leafModel1);
            var happened = false;
            maria.on(nodeModel, 'change', function() {
                happened = true;
            });
            nodeModel.replaceChild(leafModel0, leafModel1); // effectively removes leafModel1
            assert.same(true, happened);
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
