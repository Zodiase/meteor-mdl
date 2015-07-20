# Client Code

# Uses:

debug = false

tplname = 'toggles'

Router.route '/toggles', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Toggles')
	this.render tplname
