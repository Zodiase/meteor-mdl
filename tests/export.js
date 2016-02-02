Tinytest.add('MDl/exposure-basic', function (test) {
	test.isNotUndefined(componentHandler);
	test.instanceOf(componentHandler, Object);

	test.instanceOf(componentHandler.upgradeDom,               Function);
	test.instanceOf(componentHandler.upgradeElement,           Function);
	test.instanceOf(componentHandler.upgradeElements,          Function);
	test.instanceOf(componentHandler.upgradeAllRegistered,     Function);
	test.instanceOf(componentHandler.registerUpgradedCallback, Function);
	test.instanceOf(componentHandler.register,                 Function);
	test.instanceOf(componentHandler.downgradeElements,        Function);
});

Tinytest.add('MDl/exposure-alias', function (test) {
	test.isNotUndefined(MDl);
	test.instanceOf(MDl, Object);

	test.isNotUndefined(MDl.componentHandler);
	test.equal(MDl.componentHandler, componentHandler);
});

Tinytest.add('MDl/exposure-extras', function (test) {
	test.isNotUndefined(MDl);
	test.instanceOf(MDl, Object);

	test.isNotUndefined(MDl.settings);
	test.instanceOf(MDl.settings, Object);
});
