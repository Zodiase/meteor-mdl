# Client Code

# Uses:

debug = false

tplname = 'sliders'

Router.route '/sliders', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Sliders')
	this.render tplname
