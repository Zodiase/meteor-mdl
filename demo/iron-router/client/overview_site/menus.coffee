# Client Code

# Uses:

debug = false

tplname = 'menus'

Router.route '/menus', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Menus')
	this.render tplname
