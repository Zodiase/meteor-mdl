
Session.setDefault('PageTitle', '')

siteName = 'Iron:Router'

# This adds support for changing the page title by Session.set('PageTitle', value)
Meteor.autorun () ->
	pageTitle = Session.get('PageTitle')
	document.title = if pageTitle == ''
		siteName
	else
		"#{pageTitle} - #{siteName}"

Template.registerHelper 'pageTitle', () ->
	return Session.get('PageTitle')
