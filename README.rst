.. image:: https://github.com/reputage/didery.js/blob/dev/logo/didery.png
   :alt: Didery logo

|Docs|

.. |Docs| image:: //readthedocs.org/projects/dideryjs/badge/?version=latest
   :alt: Documentation Status

.. contents:: Table of Contents

Overview
========
dideryJS is a Javascript client library for distributed didery servers.

Installation
============
Manual
------
To download dideryJS run the following command in the terminal:
::
  $ git clone git clone https://github.com/reputage/didery.js.git
After downloading the repository you must install the project dependencies using Node.js. If you do not already have
Node.js installed on your computer, you can install it by download visiting the `Node.js download page
<https://nodejs.org/en/download/>`_ and following the instructions for your operating system. You can verify that
Node.js has been installed on your system by running this command in the terminal:
::
  $ node -v
You should also verify that the node package manager (npm) was installed by running this command in the terminal:
::
  $ npm -v
You can now install the dideryJS project dependencies by running this command in the terminal:
::
  $ npm install
Finally, compile the main Javascript file by running either:
::
  $ npm run dev
for development, or:
::
  $ npm run build
for production. The compiled library can be found in the newly created dist folder and is named didery.js.
Alternatively, the un-compiled code can be referenced directly from src/index.js.

Node
----
The dideryJS library can also be downloaded as an npm repository. To do so make sure you have Node.js and the node
package manager (npm) installed on your machine (see details above for installation instructions). With Node.js
installed, the following terminal command can be run to install dideryJS:
::
   $ npm install didery
To save dideryJS as a project dependency run either:
::
  $ npm install --save-dev didery
for a development dependency, or
::
  $ npm install --save didery
for a production dependency.

Testing
=======
The dideryJS unit tests utilize the Mocha testing framework and the native Node.js assert library. To run the tests for
dideryJS use the following terminal command:
::
  $ npm test
  
Examples
========
Use cases for dideryJS can be found in the `examples
<https://github.com/reputage/didery.js/tree/dev/examples>`_ folder of the project. Documentation and examples
for each function can be found in the `docs <https://github.com/reputage/didery.js/tree/dev/docs>`_ folder of the
project. The examples included in the examples folder must have their JavaScript compiled before being viewed. This can
be done by running the following terminal command:
::
  $ npm run <name of example>
The index.html file of each example can then be opened in your web browser.
