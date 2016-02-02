if Meteor.isClient
  # tab is 1 by default
  Session.setDefault('tab', 1)
  Session.setDefault('haveSwitchedOutFromTab1', false)

  tpl = Template['body']

  tpl.helpers
    tabEquals: (value) ->
      return Session.get('tab') == value
    haveSwitchedOutFromTab1: () ->
      return Session.get('haveSwitchedOutFromTab1')

  tpl.events
    'click .tabbutton': (event, template) ->
      $button      = $(event.currentTarget)
      targetTabId  = parseInt($button.attr('for'))
      currentTabId = parseInt(Session.get('tab'))
      if !isNaN(targetTabId)
        if currentTabId == 1 && targetTabId != 1
          Session.set('haveSwitchedOutFromTab1', true)
        Session.set('tab', targetTabId)
      return true

  tpl.onRendered (tpl) ->
    tpl = this

    MochaWeb.testOnly () ->
      console.clear()
      expect = chai.expect

      hasRippleEffect = (element, done) ->
        $testButton = tpl.$(element)
        $rippleObject = $testButton.find('.mdl-ripple')
        expect($rippleObject.length).to.not.equal(0)
        expect($rippleObject.hasClass('is-visible')).to.be.false
        $testButton[0].dispatchEvent(new MouseEvent('mousedown', {
          'view': window
          'bubbles': true
          'cancelable': true
        }))
        expect($rippleObject.hasClass('is-visible')).to.be.true
        $testButton[0].dispatchEvent(new MouseEvent('mouseup', {
          'view': window
          'bubbles': true
          'cancelable': true
        }))
        setTimeout (() ->
          expect($rippleObject.hasClass('is-visible')).to.be.false
          done()
        ), 0

        return true

      hasNoRippleEffect = (element) ->
        $testButton = tpl.$('.testbutton')
        $rippleObject = $testButton.find('.mdl-ripple')
        expect($rippleObject.length).to.equal(0)
        return true

      describe 'Issue #1', () ->
        upgradeStyle = null
        it '*Clear upgrade style', () ->
          upgradeStyle = MDl.autoUpgrade.getUpgradeStyle()
          MDl.autoUpgrade.setUpgradeStyle('none')
          return true

        it 'Button should exist', () ->
          expect(tpl.$('.testbutton')).to.be.not.empty
          return true

        it 'Button should have ripple effect at first', (done) ->
          hasRippleEffect('.testbutton', done)
          return true

        it 'Button should not have ripple effect after tab switch', (done) ->
          tpl.$('.tabbutton[for=2]').click()
          expect(Session.get('tab')).to.equal(2)
          # Give some time for Blaze to render the template.
          setTimeout () ->
            tpl.$('.tabbutton[for=1]').click()
            expect(Session.get('tab')).to.equal(1)
            # Give some time for Blaze to render the template.
            setTimeout () ->
              hasNoRippleEffect('.testbutton')
              done()
              return true
            , 100
            return true
          , 100
          return true

        it 'Button should have ripple effect after tab switch with auto-upgrading', (done) ->
          MDl.autoUpgrade.setUpgradeStyle('fullUpgrade')
          tpl.$('.tabbutton[for=2]').click()
          expect(Session.get('tab')).to.equal(2)
          # Give some time for Blaze to render the template.
          setTimeout () ->
            tpl.$('.tabbutton[for=1]').click()
            expect(Session.get('tab')).to.equal(1)
            # Give some time for Blaze to render the template.
            setTimeout hasRippleEffect.bind(null, '.testbutton', done), 100
            return true
          , 100
          return true

        it '*Restore upgrade style', () ->
          MDl.autoUpgrade.setUpgradeStyle(upgradeStyle)
          return true
