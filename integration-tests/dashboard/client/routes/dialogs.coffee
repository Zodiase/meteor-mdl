# Client Code

# Uses:

debug = false

tplname = 'dialogs'

Router.route '/dialogs', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Dialogs')
	this.render tplname
