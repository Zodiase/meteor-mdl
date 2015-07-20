# Client Code

# Uses:

debug = false

tplname = 'textfields'

Router.route '/text-fields', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Text Fields')
	this.render tplname
