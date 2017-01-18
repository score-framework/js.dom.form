/* global loadScore, expect, describe, it */

if (typeof loadScore == 'undefined') {

    /* global loadScore:true, expect:true */
    var tmp = require('./node.js');
    loadScore = tmp.loadScore;
    expect = tmp.expect;
}

describe('score.dom.form', function() {

    it('should be a function', function(done) {

        loadScore(['oop', 'dom', 'dom.form'], function(score) {
            try {
                expect(score.dom.form).to.be.a('function');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should provide a `field` member', function(done) {
        loadScore(['oop', 'dom', 'dom.form'], function(score) {
            try {
                expect(score.dom.form.field).to.be.a('function');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe('#getValue()', function() {

        it('should return an object', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var form = score.dom.form({});
                    expect(form.getValue()).to.be.an('object');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should return all field values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input1 = score.dom.form.field.input();
                    var input2 = score.dom.form.field.input();
                    var form = score.dom.form({
                        'input1': input1,
                        'input2': input2
                    });
                    expect(form.getValue()).to.eql({
                        'input1': '',
                        'input2': ''
                    });
                    input1.setValue('foo');
                    expect(form.getValue()).to.eql({
                        'input1': 'foo',
                        'input2': ''
                    });
                    input2.setValue('bar');
                    expect(form.getValue()).to.eql({
                        'input1': 'foo',
                        'input2': 'bar'
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#setValue()', function() {

        it('should set all field values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input1 = score.dom.form.field.input();
                    var input2 = score.dom.form.field.input();
                    var form = score.dom.form({
                        'input1': input1,
                        'input2': input2
                    });
                    expect(input1.getValue()).to.equal('');
                    expect(input2.getValue()).to.equal('');
                    form.setValue({
                        'input1': 'foo',
                        'input2': 'bar'
                    });
                    expect(input1.getValue()).to.equal('foo');
                    expect(input2.getValue()).to.equal('bar');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw error on missing values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input1 = score.dom.form.field.input();
                    var input2 = score.dom.form.field.input();
                    var form = score.dom.form({
                        'input1': input1,
                        'input2': input2
                    });
                    expect(function() {
                        form.setValue({
                            'input1': 'foo'
                        });
                    }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should not change existing fields on missing values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input1 = score.dom.form.field.input();
                    var input2 = score.dom.form.field.input();
                    var form = score.dom.form({
                        'input1': input1,
                        'input2': input2
                    });
                    expect(function() {
                        form.setValue({
                            'input1': 'foo'
                        });
                    }).to.throwError();
                    expect(input1.getValue()).to.equal('');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should not throw error on additional values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input1 = score.dom.form.field.input();
                    var input2 = score.dom.form.field.input();
                    var form = score.dom.form({
                        'input1': input1,
                        'input2': input2
                    });
                    form.setValue({
                        'input1': 'foo',
                        'input2': 'bar',
                        'input3': 'baz'
                    });  // should not throw
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('field.input', function() {

        it('should create an <input> node', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var input = score.dom.form.field.input();
                    expect(input.node.DOMNode.nodeName.toLowerCase()).to.be('input');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept an <input> node', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var domInput = document.createElement('input');
                    var input = score.dom.form.field.input(domInput);
                    expect(input.node.DOMNode.nodeName.toLowerCase()).to.be('input');
                    expect(input.node.DOMNode).to.be(domInput);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept a selector', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var fixture = document.getElementById('fixture');
                    var domInput = document.createElement('input');
                    domInput.setAttribute('id', 'fixture-input');
                    fixture.appendChild(domInput);
                    var input = score.dom.form.field.input('#fixture-input');
                    expect(input.node.DOMNode).to.be(domInput);
                    fixture.removeChild(domInput);
                    done();
                } catch (e) {
                    fixture.removeChild(domInput);
                    done(e);
                }
            });
        });

        it('should throw exception on non-<input> nodes', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var domDiv = document.createElement('div');
                    expect(function() {score.dom.form.field.input(domDiv);}).to.throwError();
                    var domInput = document.createElement('input');
                    domDiv.appendChild(domInput);
                    expect(function() {score.dom.form.field.input(domDiv);}).to.throwError();
                    score.dom.form.field.input(domInput);  // should not throw
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        describe('#setValue()', function() {

            it('should set the <input> value', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var input = score.dom.form.field.input();
                        expect(input.node.DOMNode.value).to.be('');
                        input.setValue('foo');
                        expect(input.node.DOMNode.value).to.be('foo');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('should trigger a change event', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var input = score.dom.form.field.input();
                        input.on('change', function() {
                            done();
                        });
                        input.setValue('foo');
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('should not trigger an input event', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var callDone = false;
                        var input = score.dom.form.field.input();
                        input.on('input', function() {
                            done(new Error('received input event'));
                            callDone = true;
                        });
                        input.setValue('foo');
                        window.setTimeout(function() {
                            if (!callDone) {
                                done();
                            }
                        }, 500);
                    } catch (e) {
                        done(e);
                    }
                });
            });

        });

        describe('#getValue()', function() {

            it('should always return the <input> value', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var input = score.dom.form.field.input();
                        expect(input.node.DOMNode.value).to.be('');
                        expect(input.getValue()).to.be('');
                        input.setValue('foo');
                        expect(input.node.DOMNode.value).to.be('foo');
                        expect(input.getValue()).to.be('foo');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

        });

    });

    describe('field.textarea', function() {

        it('should create a <textarea> node', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var textarea = score.dom.form.field.textarea();
                    expect(textarea.node.DOMNode.nodeName.toLowerCase()).to.be('textarea');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('field.select', function() {

        it('should throw an error if invoked without arguments', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    expect(function() {score.dom.form.field.select();}).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should create an empty <select> node', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var select = score.dom.form.field.select([]);
                    expect(select.node.DOMNode.nodeName.toLowerCase()).to.be('select');
                    expect(select.node.children().empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept a <select> element', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var selectNode = score.dom.fromString(
                        '<select>' +
                        '    <option value="1">1</option>' +
                        '    <option value="2">2</option>' +
                        '    <option value="3">3</option>' +
                        '</select>'
                    );
                    var select = score.dom.form.field.select(selectNode);
                    expect(select.node).to.be(selectNode);
                    expect(select.node.children().length).to.be(3);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept an array', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var select = score.dom.form.field.select([
                        [1, 'one'],
                        [2, 'two'],
                        [3, 'three'],
                    ]);
                    expect(select.node.DOMNode.nodeName.toLowerCase()).to.be('select');
                    expect(select.node.children().length).to.be(3);
                    select.node.children().forEach(function(node, index) {
                        expect(node.DOMNode.nodeName.toLowerCase()).to.be('option');
                        expect(node.attr('value')).to.be('' + (index + 1));
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        describe('#getValue()', function() {

            it('should always return the <select> value', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var selectNode = score.dom.fromString(
                            '<select>' +
                            '    <option value="1">1</option>' +
                            '    <option value="2">2</option>' +
                            '    <option value="3">3</option>' +
                            '</select>'
                        );
                        var select = score.dom.form.field.select(selectNode);
                        expect(select.getValue()).to.be("1");
                        select.setValue("2");
                        expect(select.getValue()).to.be("2");
                        select.setValue("3");
                        expect(select.getValue()).to.be("3");
                        select.node.children().attr('selected', null);
                        select.node.children().first.attr('selected', 'selected');
                        select.node.DOMNode.value = "1";
                        expect(select.getValue()).to.be("1");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

        });

        describe('#setValue()', function() {

            it('should be able to handle weird option values', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var selectNode = score.dom.fromString(
                            '<select>' +
                            '    <option value="1">1</option>' +
                            '    <option value="][\'blah">weird</option>' +
                            '    <option value=\'"\'>even weirder</option>' +
                            '</select>'
                        );
                        var select = score.dom.form.field.select(selectNode);
                        select.setValue("][\'blah");
                        expect(select.getValue()).to.be("][\'blah");
                        select.setValue('"');
                        expect(select.getValue()).to.be('"');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('should not accept invalid values', function(done) {
                loadScore(['oop', 'dom', 'dom.form'], function(score) {
                    try {
                        var selectNode = score.dom.fromString(
                            '<select>' +
                            '    <option value="1">1</option>' +
                            '    <option value="2">2</option>' +
                            '    <option value="3">3</option>' +
                            '</select>'
                        );
                        var select = score.dom.form.field.select(selectNode);
                        expect(function() {select.setValue("4");}).to.throwError();
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

        });

    });

    describe('field.radios', function() {

        it('should throw an error if invoked without arguments', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    expect(function() {score.dom.form.field.radios();}).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should create an object without any nodes', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var radios = score.dom.form.field.radios([]);
                    expect(radios.nodes.empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should reject an array of values without any name', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var values = ['one', 'two', 'three'];
                    expect(function() {score.dom.form.field.radios(values);}).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept an array of values', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var values = ['one', 'two', 'three'];
                    var radios = score.dom.form.field.radios(values, 'test');
                    radios.radios.forEach(function(node, index) {
                        expect(node.DOMNode.nodeName.toLowerCase()).to.be('input');
                        expect(node.attr('value')).to.be(values[index]);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept an array of values with reversed parameters', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var values = ['one', 'two', 'three'];
                    var radios = score.dom.form.field.radios('test', values);
                    radios.radios.forEach(function(node, index) {
                        expect(node.DOMNode.nodeName.toLowerCase()).to.be('input');
                        expect(node.attr('value')).to.be(values[index]);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept an array of <input type="radio"> fields', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var nodes = score.dom.fromString(
                        '<input type="radio" value="one"></input>' +
                        '<input type="radio" value="two"></input>' +
                        '<input type="radio" value="three"></input>'
                    );
                    var radios = score.dom.form.field.radios(nodes, 'test');
                    expect(radios.nodes).to.be(nodes);
                    expect(radios.radios).to.be(nodes);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should reject a single <input type="non-radio"> field', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var nodes = score.dom.fromString('<input value="one"></input>');
                    expect(function() {score.dom.form.field.radios('test', nodes);}).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should reject an array containing a <input type="non-radio"> field', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var nodes = score.dom.fromString(
                        '<input type="radio" value="one"></input>' +
                        '<input type="radio" value="two"></input>' +
                        '<input value="three"></input>'
                    );
                    expect(function() {score.dom.form.field.radios('test', nodes);}).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should reject an array if it contains a node with a different name', function(done) {
            loadScore(['oop', 'dom', 'dom.form'], function(score) {
                try {
                    var string = 
                        '<input name="test" type="radio" value="one"></input>' +
                        '<input name="test" type="radio" value="two"></input>' +
                        '<input name="test2" type="radio" value="three"></input>';
                    var nodes = score.dom.fromString(string);
                    expect(function() {score.dom.form.field.radios(nodes);}).to.throwError();
                    // re-run the same test with the correct name to
                    // make sure this was the cause of the exception.
                    nodes = score.dom.fromString(string.replace('test2', 'test'));
                    score.dom.form.field.radios(nodes);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

});

