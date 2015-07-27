if (!MDl.envConfig['blazeFix']) return;

Tinytest.add('patcher/blaze/exposure', function (test) {
	test.isNotUndefined(MDl.envConfig.patchers.blaze);
	test.instanceOf(MDl.envConfig.patchers.blaze, Object);
	
	var myEnv = MDl.envConfig.patchers.blaze;
	
	test.instanceOf(myEnv.setUpgradeStyle, Function);
	test.instanceOf(myEnv.getUpgradeStyle, Function);
});

var upgradeStyles = ['fullUpgrade', 'mutationOnly'];

Tinytest.add('patcher/blaze/set-and-get-upgradeStyle', function (test) {
	var myEnv = MDl.envConfig.patchers.blaze;
	for (var i = 0, n = upgradeStyles.length, styleName; i < n; i++) {
		styleName = upgradeStyles[i];
		myEnv.setUpgradeStyle(styleName);
		test.equal(myEnv.getUpgradeStyle(), styleName);
	}
});
