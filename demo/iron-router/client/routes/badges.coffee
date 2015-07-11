# Client Code

# Uses:

debug = false

tplname = 'badges'

Router.route '/badges', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Badges')
	this.render tplname
