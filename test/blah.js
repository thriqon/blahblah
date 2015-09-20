
describe('blah', function () {
	"use strict";

	var chai = require('chai');
	var blah = require('..');
	var testChan = blah.channel('testChannel');

	afterEach(function () {
		blah.globalReset();
	});

	it('can broadcast and subscribe', function (done) {
		testChan
			.listenTo('number', function (a) {
				chai.expect(a).to.be.equal(123);
				done();
			})
		.tell('number', 123);
	});
	it('can be subscribed to multiple times', function () {
		var adder = 0;
		function addParam(x) { adder += x; }
		testChan
			.listenTo('add', addParam)
			.listenTo('add', addParam)
			.listenTo('add', addParam)
			.listenTo('add', addParam)
			.tell('add', 1);
		chai.expect(adder).to.be.equal(4);
	});
	it('can be subscribed to to only execute once', function () {
		var adder = 0;
		function addParam(x) { adder += x; }
		testChan
			.listenTo('add', addParam)
			.listenToOnce('add', addParam)
			.tell('add', 1)
			.tell('add', 1);
		chai.expect(adder).to.be.equal(3);
	});
	it('can subscribe and unsubscribe handlers', function () {
		var adder = 0;
		function addParam(x) { adder += x; }
		testChan
			.listenTo('add', addParam)
			.tell('add', 1)
			.unlistenTo('add', addParam)
			.unlistenTo('add', addParam)
			.tell('add', 2)
			.listenTo('add', addParam)
			.tell('add', 5);
		chai.expect(adder).to.be.equal(6);
	});
	it('can listen to all events in one channel', function () {
		var adder = 0;
		function addParam(evt, x) { adder += x; }
		testChan
			.listenToAll(addParam)
			.tell('blah', 1)
			.tell('xsd', 1);
		chai.expect(adder).to.be.equal(2);
	});
	it('can unlisten from all events in one channel', function () {
		function handler() {
			throw new Error("should not be called");
		}
		testChan
			.listenToAll(handler)
			.unlistenToAll(handler)
			.tell('asd');
	});
	it('can be globally reset, forgetting all previosly registered handlers', function () {
		testChan.listenTo('asd', function () {
			throw new Error("should not be called");
		});
		blah.globalReset();
		testChan.tell('asd');
	});
	it('can be globally reset, keeping handlers for the root channel', function (done) {
		var root = blah.channel('/');
		root.listenTo('test', done);
		blah.globalReset();
		root.tell('test');
	});
});

