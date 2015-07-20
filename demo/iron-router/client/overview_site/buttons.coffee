# Client Code

# Uses:

debug = false

tplname = 'buttons'

Router.route '/buttons', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Buttons')
	this.render tplname
