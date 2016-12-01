.. image:: https://raw.githubusercontent.com/score-framework/py.doc/master/docs/score-banner.png
    :target: http://score-framework.org

`The SCORE Framework`_ is a collection of harmonized python and javascript
libraries for the development of large scale web projects. Powered by strg.at_.

.. _The SCORE Framework: http://score-framework.org
.. _strg.at: http://strg.at


**************
score.dom.form
**************

.. _js_dom_form:

.. image:: https://travis-ci.org/score-framework/js.dom.form.svg?branch=master
    :target: https://travis-ci.org/score-framework/js.dom.form

Very low-level form handling library.

Quickstart
==========

This library ist foremost for providing a uniform API across all form fields:

.. code-block:: javascript

    var fruit = score.dom.field.select([
        [1, 'oranges'],
        [2, 'apples'],
        [3, 'pomegrenades'],
        [4, 'greengages'],
        [5, 'grapes'],
        [6, 'passion fruit'],
        [7, 'lemons'],
        [8, 'plums'],
        [9, 'mangoes in syrup'],
        [10, 'cherries (red and black)'],
        [11, 'bananas']
    ]);
    fruit.on('input', function() {
        // this function will be called whenever the
        // user changes the select value.
    });
    fruit.on('change', function() {
        // this function will be called whenever the
        // user changes the select value *or* the value
        // is set programmatically.
    });

    score.dom('#some-node').append(fruit.node);

    fruit.setValue(8);  // will trigger 'change' and set
                         // the selected value 8 (plums)

    fruit.setValue(12); // will throw an Error since id
                         // 12 does not exist.

You can combine multiple fields to create a form object, which can be used to
set multiple values at once:

.. code-block:: javascript

    // note that the only requirement for the variable `attacker` in the
    // following code block is that it must be a form.field object, it does not
    // matter whether this is a select, an input, a textarea or something else:
    var form = score.dom.form({
        'fruit': fruit,
        'attacker': attacker
    });

    form.setValue({
        'fruit': 11,
        'attacker': 'Harrison'
    });

    fruit.getValue();    // returns 11 (banana)
    attacker.getValue(); // returns 'Harrison'

Details
=======

Using existing nodes
--------------------

All existing field objects optionally accept a DOM Node as first parameter. The
parameter is expected to be of the correct type for the used class:

.. code-block:: javascript

    var select = new score.domf.form.field.select('select#fruits');
    select.getValue();  // returns whatever was currently selected in the DOM

Events
------

Field objects have two different events:

* **change**: Triggered, whenever the value of this field changes.
* **input**: Triggered only when the value is changed through user-input.


Extending
---------

The parent class of all form fields (score.dom.form.field) has two abstract
methods, that need to be overriden by implementing child classes:

.. code-block:: javascript

    var Input = new score.oop.Class({
        __name__: 'InputField',
        __parent__: score.dom.form.field,

        __init__: function() {
            // simplified implentation for demonstration
            self.node = score.dom.create('input');
        },

        _getValue: function(self) {
            return self.node.DOMNode.value;
        },

        _setValue: function(self, value) {
            self.node.DOMNode.value = value;
        }

    });

Customizing
-----------

This module creates the minimum number of DOM nodes necessary for implementing
the required field. You can create sub-classes, if you want a different DOM
layout. The following example wraps the <input> element inside a <div> and adds
a <label>:

.. code-block:: javascript

    var LabeledInput = new score.oop.Class({
        __name__: 'LabeledInputField',
        __parent__: score.dom.form.field.input,

        __init__: function(labelText) {
            self.__super__();
            self.node = score.dom.create('div');
            self.label = score.dom.create('label');
            self.label.text(labelText);
            self.node.append(self.label);
            self.node.append(self.input);
        }

    });


API
===

class ``score.dom.form(fields)``
    Wraps multiple fields to provide a single setter/getter for all field
    values at once. The provided ``fields`` parameter must be an object mapping
    field names to ``score.dom.form.field`` objects.

    ``getValue()``
        Get the values of each field of this form. The return value is an
        object mapping each field name to the value of the corresponding field
        (as defined by ``score.dom.form.field.getValue()``)

    ``setValue(value)``
        Sets the values of all managed fields. Note that all field names must
        be present in the provided *value*.


class ``score.dom.form.field()``
    An abstract Field class providing unifying the value setting/retrieval
    API.

    ``getValue()``
        Get the value of this field.

    ``setValue(value)``
        Sets the values of this field and returns this field object.


class ``score.dom.form.field.input(node)``
    An ``<input>`` field. The optional *node* parameter can be either of the
    following:

    * ``undefined`` or ``null``: A new node object will be created by the
      constructor.
    * a `score.dom` object
    * anything that can be used to create a `score.dom` object with (a
      selector string, a ``DOMNode``, an ``HTMLCollection``, ...)


class ``score.dom.form.field.password(node)``
    A ``<password>`` field. The *node* parameter is the same as that for the
    <input> field.


class ``score.dom.form.field.textarea(node)``
    A ``<textarea>`` field. The *node* parameter is the same as that for the
    <input> field.


class ``score.dom.form.field.select(nodeOrOptions)``
    A ``<select>`` field. The constructor parameter *nodeOrOptions* must either
    be a node (anything accepted by the constructor of the InputField is fine),
    or a list of key-value tuples. Example:

    .. code-block:: javascript

        new score.dom.form.field.select([
            [1, 'foo'],
            [2, 'bar'],
        ])

    Why doesn't the constructor accept objects? Because `objects do not
    preserve property order in javascript
    <http://stackoverflow.com/a/5525820/44562>`_.


Acknowledgments
===============

Many thanks to BrowserStack_ and `Travis CI`_ for providing automated tests for
our open source projects! We wouldn't be able to maintain our high quality
standards without them!

.. _BrowserStack: https://www.browserstack.com
.. _Travis CI: https://travis-ci.org/


License
=======

Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.
