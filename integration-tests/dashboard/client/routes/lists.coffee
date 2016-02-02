# Client Code

# Uses:

debug = false

tplname = 'lists'

Router.route '/lists', () ->
	this.layout('layout_main')
	Session.set('PageTitle', 'Lists')
	this.render tplname
