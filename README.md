maria-NodeModel
===============

`maria.LeafModel` and `maria.NodeModel` constructors for tree-structured models.


Downloads
---------

See http://peter.michaux.ca/downloads/maria-NodeModel/ for production ready builds.


Status
------

Beta.


Browser Support
---------------

Tested working in IE6 and newer browsers by a variety of manufacturers.


Dependencies
------------

Just [Maria](https://github.com/petermichaux/maria).


Source Code
-----------

GitHub: https://github.com/petermichaux/maria-NodeModel


Build
-----

To build the production ready files, you need [JSMin](http://www.crockford.com/javascript/jsmin.html) or any other tool with the same command line interface. Then just type "make" at the command line and look in the build directory for the results.

For the record, this is how I installed JSMin. Note that I have /Users/peter/bin in my PATH.

```sh
$ cd ~/tmp
$ curl -O https://raw.github.com/douglascrockford/JSMin/master/jsmin.c
$ gcc -o jsmin jsmin.c
$ mv jsmin ~/bin
$ rm jsmin.c
$ which jsmin
/Users/peter/bin/jsmin
```


Tests
-----

To run the automated tests, open tst/runner.html in a web browser.


Author
------

Peter Michaux<br>
petermichaux@gmail.com<br>
http://peter.michaux.ca/<br>
[@petermichaux](https://twitter.com/petermichaux)


License
-------

Simplified BSD License. See the included LICENSE file for details.
