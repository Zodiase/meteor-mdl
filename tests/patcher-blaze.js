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

var speedTest = false;
var speedTestVolume = 1000, sampleOverTimes = 100;
var $sampleElement = $('<button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">add</i></button>');
var prepareElements = function (volume) {
	var results = [];
	for (var i = volume, element; i--;) {
		element = $sampleElement.clone();
		results.push(element);
	}
	return results;
};
var measure = function (speedTestVolume, sampleOverTimes, volumeRun) {
	var startTime, endTime, spentTime, sumSpentTime, avgSpentTime;
	sumSpentTime = 0;
	for (var i = sampleOverTimes, preparedElements; i--;) {
		preparedElements = prepareElements(speedTestVolume);
		startTime = new Date().getTime();
		volumeRun(preparedElements);
		endTime = new Date().getTime();
		spentTime = endTime - startTime;
		sumSpentTime += spentTime;
	}
	avgSpentTime = sumSpentTime / sampleOverTimes;
	return {
		volume: speedTestVolume,
		avgOver: sampleOverTimes,
		totalTime: sumSpentTime,
		avgTime: avgSpentTime
	};
};

Tinytest.add('patcher/blaze/upgradeStyleSpeed-horizontal', function (test) {
	if (!speedTest) return;
	test.notEqual(sampleOverTimes, 0);
	console.log('patcher/blaze/upgradeStyleSpeed-horizontal');
	
	var $sandbox = $('<div id="test-sandbox">').appendTo(document.body);
	var myEnv = MDl.envConfig.patchers.blaze;
	for (var i = 0, n = upgradeStyles.length, styleName, styleTime, appendTarget; i < n; i++) {
		styleName = upgradeStyles[i];
		myEnv.setUpgradeStyle(styleName);
		appendTarget = $sandbox;
		styleTime = measure(speedTestVolume, sampleOverTimes, function (elements) {
			// Append.
			for (var i = 0, n = elements.length, element; i < n; i++) {
				element = elements[i];
				appendTarget.append(element);
			}
			// Remove.
			for (var i = 0, n = elements.length, element; i < n; i++) {
				element = elements[i];
				element.remove();
			}
		});
		console.log(styleName, styleTime);
	}
	$sandbox.remove();
});

Tinytest.add('patcher/blaze/upgradeStyleSpeed-vertical', function (test) {
	if (!speedTest) return;
	test.notEqual(sampleOverTimes, 0);
	console.log('patcher/blaze/upgradeStyleSpeed-vertical');
	
	var $sandbox = $('<div id="test-sandbox">').appendTo(document.body);
	var myEnv = MDl.envConfig.patchers.blaze;
	for (var i = 0, n = upgradeStyles.length, styleName, styleTime, appendTarget; i < n; i++) {
		styleName = upgradeStyles[i];
		myEnv.setUpgradeStyle(styleName);
		appendTarget = $sandbox;
		styleTime = measure(speedTestVolume, sampleOverTimes, function (elements) {
			// Append.
			for (var i = 0, n = elements.length, element; i < n; i++) {
				element = elements[i];
				appendTarget.append(element);
				appendTarget = element;
			}
			// Remove.
			for (var i = elements.length - 1, element; i >= 0; i--) {
				element = elements[i];
				element.remove();
			}
		});
		console.log(styleName, styleTime);
	}
	$sandbox.remove();
});
