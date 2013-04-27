.PHONY: clean

SRCS = src/header.js     \
       src/LeafModel.js  \
       src/NodeModel.js

build: $(SRCS)
	mkdir -p build
	cat $(SRCS) >build/maria-NodeModel.js
	jsmin <build/maria-NodeModel.js >build/maria-NodeModel-tmp.js
	cat src/header.js build/maria-NodeModel-tmp.js >build/maria-NodeModel-min.js
	rm build/maria-NodeModel-tmp.js

clean:
	rm -rf build
