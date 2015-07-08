if (Meteor.isClient) {
	// tab is 1 by default
	Session.setDefault('tab', 1);
	Session.setDefault('leftTab1', false);

	var tpl = Template.tabs;
	
	tpl.helpers({
		tab: function (value) {
			return Session.get('tab') === value;
		},
		leftTab1: function () {
			return Session.get('leftTab1');
		}
	});

	tpl.events({
		'click button': function (event, template) {
			var $button      = $(event.currentTarget),
				targetTabId  = parseInt($button.attr('for')),
				currentTabId = parseInt(Session.get('tab'));
			if (!isNaN(targetTabId)) {
				if (currentTabId === 1 && targetTabId != 1) {
					Session.set('leftTab1', true);
				}
				Session.set('tab', targetTabId);
			}
		}
	});
}
