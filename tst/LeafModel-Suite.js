(function() {

    buster.testCase('leafSuite', {

        "test leafModel has dispatchEvent method": function() {
            var leafModel = new maria.LeafModel();
            assert.isFunction(leafModel.dispatchEvent);
        },

        "test leafModel has parentNode property": function() {
            var leafModel = new maria.LeafModel();
            assert.same(true, 'parentNode' in leafModel);
        },

        "test leafModel has nextSibling property": function() {
            var leafModel = new maria.LeafModel();
            assert.same(true, 'nextSibling' in leafModel);
        },

        "test leafModel has previousSibling property": function() {
            var leafModel = new maria.LeafModel();
            assert.same(true, 'previousSibling' in leafModel);
        }

    });

}());
