# Client Code

# Uses:

tplname = 'issue2'

Router.route '/issue2', () ->
  MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade')
  this.render tplname
  
tpl = Template[tplname]

tpl.events
  'click .mdl-layout__tab': (event, template) ->
    console.log('click');
    return true;
