# Client Code

# Uses:

debug = false

tplname = 'home'

Router.route '/', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Home')
	this.render tplname
