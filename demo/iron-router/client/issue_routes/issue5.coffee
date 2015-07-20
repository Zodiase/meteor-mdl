# Client Code

Router.route '/issue5', () ->
	this.layout('layout_issue5')
	this.render 'issue5_p1'
	this.render 'issue5_p1_header', to: 'header'
	this.render 'issue5_p1_footer', to: 'footer'

Router.route '/issue5_p2', () ->
	this.layout('layout_issue5')
	this.render 'issue5_p2'
