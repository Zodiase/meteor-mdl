if (Meteor.isClient) {

	var tpl = Template['issue2'];

	tpl.events({
  	'click .mdl-layout__tab': function (event, template) {
			console.log('click');
		}
	});
}
