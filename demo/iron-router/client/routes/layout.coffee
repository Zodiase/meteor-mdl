# Client Code

# Uses:

debug = false

tplname = 'layout'

Router.route '/layout', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Layout')
	this.render tplname
