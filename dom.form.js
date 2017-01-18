/**
 * Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js
(function (root, factory) {
    /* globals module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['score.init', 'score.dom', 'score.oop'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(require('score.init'), require('score.dom'), require('score.oop'));
    } else {
        // Browser globals (root is window)
        factory(root.score);
    }
})(this, function(score) {

    score.extend('dom.form', ['dom', 'oop'], function() {

        var Form = score.oop.Class({
            __name__: 'Form',

            __init__: function(self, fields) {
                self.fields = fields;
            },

            getValue: function(self) {
                var value = {};
                for (var name in self.fields) {
                    value[name] = self.fields[name].getValue();
                }
                return value;
            },

            setValue: function(self, value) {
                for (var name in self.fields) {
                    if (name in value) {
                        continue;
                    }
                    throw new Error('No value for field ' + name);
                }
                for (var name in self.fields) {
                    self.fields[name].setValue(value[name]);
                }
            }

        });

        Form.field = score.oop.Class({
            __name__: 'FormField',
            __events__: [
                'change',  // triggered whenever the value changes
                'input'    // triggered only when value is changed by user
            ],

            _input: function(self) {
                self.trigger('change');
                self.trigger('input');
            },

            getValue: function(self) {
                return self._getValue();
            },

            setValue: function(self, value) {
                self._setValue(value);
                self.trigger('change');
                return self;
            },

            _getValue: function(self) {
                throw new Error('Abstract function ' + self.__class__.__name__ + '::_getValue() called');
            },

            _setValue: function(self, value) {
                throw new Error('Abstract function ' + self.__class__.__name__ + '::_setValue() called');
            }

        });

        Form.field.input = score.oop.Class({
            __name__: 'InputField',
            __parent__: Form.field,

            __init__: function(self, node) {
                if (!node) {
                    node = score.dom.create('input');
                } else {
                    node = score.dom(node);
                    if (node.DOMNode.nodeName.toLowerCase() != 'input') {
                        throw new Error('Node argument must be an <input> element');
                    }
                }
                self.node = self.input = node;
                self.input.on('input', self._input);
            },

            _getValue: function(self, value) {
                return self.input.DOMNode.value;
            },

            _setValue: function(self, value) {
                self.input.DOMNode.value = value;
            }

        });

        Form.field.password = score.oop.Class({
            __name__: 'PasswordField',
            __parent__: Form.field.input,

            __init__: function(self, node) {
                self.__super__(node);
                self.node.attr('type', 'password');
            }

        });

        Form.field.textarea = score.oop.Class({
            __name__: 'TextareaField',
            __parent__: Form.field,

            __init__: function(self, node) {
                if (!node) {
                    node = score.dom.create('textarea');
                } else {
                    node = score.dom(node);
                    if (node.DOMNode.nodeName.toLowerCase() != 'textarea') {
                        throw new Error('Node argument must be an <textarea> element');
                    }
                }
                self.node = self.textarea = node;
                self.textarea.on('input', self._input);
            },

            _getValue: function(self, value) {
                return self.textarea.DOMNode.value;
            },

            _setValue: function(self, value) {
                self.textarea.DOMNode.value = value;
            }

        });

        Form.field.select = score.oop.Class({
            __name__: 'SelectField',
            __parent__: Form.field,

            __init__: function(self, nodeOrOptions) {
                if (!nodeOrOptions) {
                    throw new Error('First argument must either be a <select> element or an options list');
                }
                if (Array.isArray(nodeOrOptions) && !(nodeOrOptions instanceof score.dom)) {
                    self.node = self.select = score.dom.create('select');
                    for (var i = 0; i < nodeOrOptions.length; i++) {
                        self.select.append(
                            score.dom.create('option')
                            .attr('value', nodeOrOptions[i][0])
                            .text(nodeOrOptions[i][1]));
                    }
                } else {
                    self.node = self.select = score.dom(nodeOrOptions);
                    if (self.select.DOMNode.nodeName.toLowerCase() != 'select') {
                        throw new Error('First argument must either be a <select> element or an options list');
                    }
                }
                self.select.on('change', self._input);
            },

            _getValue: function(self) {
                return self.select.DOMNode.value;
            },

            _setValue: function(self, value) {
                value = '' + value;
                var found = false;
                self.select.children('option').forEach(function(option) {
                    if (option.attr('value') === value) {
                        found = true;
                    }
                });
                if (!found) {
                    throw new Error('No such value "' + value + '"');
                }
                self.select.DOMNode.value = value;
            }

        });

        Form.field.radios = score.oop.Class({
            __name__: 'RadioListField',
            __parent__: Form.field,

            __init__: function(self, nodesOrValues, name) {
                if (!nodesOrValues) {
                    throw new Error('First argument must either be a list of <input type="radio"> elements or a list of values');
                }
                if (typeof nodesOrValues === 'string') {
                    var tmp = nodesOrValues;
                    nodesOrValues = name;
                    name = tmp;
                }
                if (Array.isArray(nodesOrValues) && nodesOrValues.length && typeof nodesOrValues[0] == 'string') {
                    self.nodes = self.radios = score.dom();
                    if (!name) {
                        throw new Error('Second argument must contain a name if first argument is a list of values');
                    }
                    for (var i = 0; i < nodesOrValues.length; i++) {
                        self.nodes.push(
                            score.dom.create('input')
                            .attr('type', 'radio')
                            .attr('name', name)
                            .attr('value', nodesOrValues[i])
                            .DOMNode);
                    }
                } else {
                    self.nodes = self.radios = score.dom(nodesOrValues);
                    if (self.nodes.length) {
                        self.radios.forEach(function(node) {
                            if (node.DOMNode.nodeName.toLowerCase() != 'input' || node.attr('type').toLowerCase() != 'radio') {
                                throw new Error('First argument must either be a list of <input type="radio"> elements or a list of values');
                            }
                        });
                        var nameAttr = self.nodes.first.attr('name');
                        if (!nameAttr) {
                            if (!name) {
                                throw new Error('Second argument must contain a name if nodes don\'t have a name attribute');
                            }
                            self.nodes.attr('name', name);
                        } else {
                            self.radios.forEach(function(node) {
                                if (node.attr('name') != nameAttr) {
                                    throw new Error('All nodes must have the same name attribute');
                                }
                            });
                        }
                    }
                }
                self.radios.on('change', self._input);
            },

            _getValue: function(self) {
                for (var i = 0; i < self.radios.length; i++) {
                    if (self.radios[i].checked) {
                        return self.radios.get(i).attr('value');
                    }
                }
                return null;
            },

            _setValue: function(self, value) {
                value = '' + value;
                for (var i = 0; i < self.radios.length; i++) {
                    if (self.radios.get(i).attr('value') == value) {
                        self.radios.get(i).DOMNode.checked = true;
                        return;
                    }
                }
                throw new Error('No such value "' + value + '"');
            }

        });

        return Form;

    });

});
