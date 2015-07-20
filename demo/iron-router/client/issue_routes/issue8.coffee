# Client Code

tplname = 'issue8'

Router.route '/issue8', () ->
  # Force fullUpgrade style for auto-upgrading to avoid other issues.
  MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade')
  this.render 'issue8'

Template["#{tplname}_bad"].events
  'click': (event, template) ->
    console.log(event.target)
    return true

Template["#{tplname}_good"].events
  'click': (event, template) ->
    console.log(event.target)
    return true
