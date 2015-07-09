Tinytest.add('exposure', function (test) {
	test.isNotUndefined(componentHandler, "componentHandler not found.");
	test.instanceOf(componentHandler, Object);
	
	test.instanceOf(componentHandler.upgradeDom,               Function);
	test.instanceOf(componentHandler.upgradeElement,           Function);
	test.instanceOf(componentHandler.upgradeAllRegistered,     Function);
	test.instanceOf(componentHandler.registerUpgradedCallback, Function);
	test.instanceOf(componentHandler.register,                 Function);
	test.instanceOf(componentHandler.downgradeElements,        Function);
});
