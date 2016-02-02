# Client Code

# Uses:

debug = false

tplname = 'snackbar'

Router.route '/snackbar', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Snackbar')
	this.render tplname
