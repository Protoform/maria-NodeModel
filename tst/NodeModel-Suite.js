(function() {

    buster.testCase('nodeSuite', {

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
        }

    });

}());
