# Client Code

# Uses:

debug = false

tplname = 'loading'

Router.route '/loading', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Loading')
	this.render tplname
