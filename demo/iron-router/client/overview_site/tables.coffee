# Client Code

# Uses:

debug = false

tplname = 'tables'

Router.route '/tables', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Tables')
	this.render tplname
