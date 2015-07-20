# Client Code

# Uses:

tplname = 'issue2'

Router.route '/issue2', () ->
  # Force fullUpgrade style for auto-upgrading to avoid other issues.
  MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade')
  this.render tplname
  
tpl = Template[tplname]

Template["#{tplname}_bad"].events
  'click .mdl-layout__tab': (event, template) ->
    console.log('click')
    return true

Template["#{tplname}_good"].events
  'click .mdl-layout__tab': (event, template) ->
    console.log('click')
    return true
