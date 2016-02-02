Meteor.startup(function () {
  if (!MDl.autoUpgrade) return;

  Tinytest.add('patch/autoUpgrade/exposure', function (test) {
  	test.isNotNull(MDl.autoUpgrade);
  	test.instanceOf(MDl.autoUpgrade, Object);

  	let myEnv = MDl.autoUpgrade;

  	test.instanceOf(myEnv.setUpgradeStyle, Function);
  	test.instanceOf(myEnv.getUpgradeStyle, Function);
  });

  const upgradeStyles = ['fullUpgrade', 'mutationOnly'];

  Tinytest.add('patch/autoUpgrade/set-and-get-upgradeStyle', function (test) {
  	let myEnv = MDl.autoUpgrade;
  	for (let styleName of upgradeStyles) {
  		myEnv.setUpgradeStyle(styleName);
  		test.equal(myEnv.getUpgradeStyle(), styleName);
  	}
  });

});
