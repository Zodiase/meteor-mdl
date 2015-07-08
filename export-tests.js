Tinytest.add('exposure', function (test) {
	test.isNotUndefined(window, "window object not found.");
	test.instanceOf(window, Object);
	
	test.isNotUndefined(window.componentHandler, "componentHandler not found.");
	test.instanceOf(window.componentHandler, Object);
	
	test.instanceOf(window.componentHandler.upgradeDom, Function);
	test.instanceOf(window.componentHandler.upgradeElement, Function);
	test.instanceOf(window.componentHandler.upgradeAllRegistered, Function);
	test.instanceOf(window.componentHandler.registerUpgradedCallback, Function);
	test.instanceOf(window.componentHandler.register, Function);
	test.instanceOf(window.componentHandler.downgradeElements, Function);
});
