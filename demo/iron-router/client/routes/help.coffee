# Client Code

# Uses:

debug = false

tplname = 'help'

Router.route '/help', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Help')
	this.render tplname
