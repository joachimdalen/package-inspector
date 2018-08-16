"use strict";

var expect = require("chai").expect;
var packageInspector = require("../index");

describe("packageInspector", async function() {
	it("should be scoped", async function() {
		var res = await packageInspector("./");
		expect(res.name.scoped).to.be.true;
	});

	it("should parse scope", async function() {
		var res = await packageInspector("./");
		expect(res.name.scope).to.be.string("joachimdalen");
		expect(res.name.name).to.be.string("package-inspector");
	});
	
});
