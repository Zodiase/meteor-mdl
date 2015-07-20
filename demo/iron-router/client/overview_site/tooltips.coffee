# Client Code

# Uses:

debug = false

tplname = 'tooltips'

Router.route '/tooltips', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Tooltips')
	this.render tplname
