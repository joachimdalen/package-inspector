"use strict";

var expect = require("chai").expect;
var packageInspector = require("../index");

describe("packageInspector", async function() {
	it("should be scoped", async function() {
		var res = await packageInspector("./");
		expect(res.name.scoped).to.be.true;
	});
});
