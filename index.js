"use strict";
const readPkg = require("read-pkg");
const packageJson = require("package-json");
const semver = require("semver");
const scopedNameRegex = /@(?<scope>.+)\/(?<name>.+)/;

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
			patch: pkgVer.patch
		};
	}

	base.description = pkg.description || null;
	return base;
};
