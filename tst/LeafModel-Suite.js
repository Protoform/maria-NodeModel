(function() {

    buster.testCase('leafSuite', {

        "test leafModel has EventTarget interface": function() {
            var leafModel = new maria.LeafModel();
            assert.isFunction(leafModel.dispatchEvent);
            assert.isFunction(leafModel.addEventListener);
            assert.isFunction(leafModel.removeEventListener);
            assert.isFunction(leafModel.addParentEventTarget);
            assert.isFunction(leafModel.removeParentEventTarget);
            assert.isFunction(leafModel.destroy);
        },

        "test leafModel has Leaf interface": function() {
            var leafModel = new maria.LeafModel();
            assert.same(true, 'parentNode' in leafModel);
            assert.same(true, 'previousSibling' in leafModel);
            assert.same(true, 'nextSibling' in leafModel);
            assert.isFunction(leafModel.destroy);
        },

        "test destroy dispatches event": function() {
            var leafModel = new maria.LeafModel();
            var called = false;
            var listener = function() {
                called = true;
            };
            leafModel.addEventListener('destroy', listener);
            leafModel.destroy();
            assert.same(true, called);
        },

        "test destroy nulls relationships": function() {
            var leafModel = new maria.LeafModel();
            // application code would NEVER set these properties directly
            leafModel.parentNode = true;
            leafModel.previousSibling = true;
            leafModel.nextSibling = true;
            leafModel.destroy();
            assert.same(null, leafModel.parentNode);
            assert.same(null, leafModel.previousSibling);
            assert.same(null, leafModel.nextSibling);
        },

        "test subclass method exists": function() {
            assert.isFunction(maria.LeafModel.subclass);
        }

    });

}());
