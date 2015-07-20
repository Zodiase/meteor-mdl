# Client Code

# Uses:

debug = false

tplname = 'cards'

Router.route '/cards', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Cards')
	this.render tplname
