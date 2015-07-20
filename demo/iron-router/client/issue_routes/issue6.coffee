# Client Code

Router.route '/issue6', () ->
  # Force fullUpgrade style for auto-upgrading to avoid other issues.
  MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade')
  this.layout('issue6_layout1')
  this.render 'issue6_content1'

Router.route '/issue6/p2', () ->
  # Force fullUpgrade style for auto-upgrading to avoid other issues.
  MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade')
  this.layout('issue6_layout2')
  this.render 'issue6_content2'
