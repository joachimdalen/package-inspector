"use strict";
const readPkg = require("read-pkg");
const packageJson = require("package-json");
const semver = require("semver");
const scopedNameRegex = /@(?<scope>.+)\/(?<name>.+)/;

/**
 * This module provides advanced/detailed infomation about the
 * content of the package.json file.
 *
 * @param {string} cwd Directory for the package.json file.
 */
module.exports = async function(cwd) {
	if (cwd === undefined || cwd === null) cwd = process.cwd();

	const pkg = await readPkg({ cwd });

	if (!pkg) return null;
	let base = {};

	if (pkg.name) {
		let m;
		if ((m = scopedNameRegex.exec(pkg.name)) !== null) {
			base.name = {
				scoped: true,
				scope: m.groups.scope,
				name: m.groups.name
			};
		} else {
			base.name = {
				scoped: false,
				scope: null,
				name: pkg.name
			};
		}
	} else {
		pkg.name = null;
	}
	if (pkg.version) {
		let pkgVer = semver(pkg.version);
		base.version = {
			major: pkgVer.major,
			minor: pkgVer.minor,
			patch: pkgVer.patch,
			clean: semver.clean(pkg.version),
			raw: pkg.version
		};
	}
	base.keywords = pkg.keywords || null;
	base.license = pkg.license || null;
	base.files = pkg.files || null;

	if (pkg.bugs) {
		base.bugs = {
			url: pkg.bugs.url || null,
			email: pkg.bugs.email || null
		};
	} else {
		base.bugs = null;
	}
	base.repository = pkg.repository || null;
	base.author = pkg.author || null;
	base.description = pkg.description || null;
	base.homepage = pkg.homepage || null;
	if (pkg.dependencies) {
		base.dependencies = {};
		Object.keys(pkg.dependencies).forEach(async function(key) {
			let latest = await packageJson(key.toLowerCase());
			base.dependencies.key = {
				current: pkg.dependencies[key],
				latest: latest.version,
				upgradable: semver.satisfies(latest.version, pkg.dependencies[key])
			};
		});
	}
	return base;
};
