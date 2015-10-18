if Meteor.isClient
  clickCount = 0;
  incClickCount = () ->
    clickCount++
    return true

  Template['issue2_bad'].events
    'click .mdl-layout__tab': incClickCount
  
  Template['issue2_good'].events
    'click .mdl-layout__tab': incClickCount
  
  Template['body'].onRendered (tpl) ->
    tpl = this
    
    MochaWeb.testOnly () ->
      console.clear()
      expect = chai.expect
      
      describe 'Issue #2', () ->
        it 'Bad example does not trigger event handler', () ->
          $buttons = tpl.$('.badbutton')
          prevValue = clickCount
          increment = $buttons.length
          $buttons.click()
          expect(clickCount).to.equal(prevValue)
          return true
          
        it 'Good example triggers event handler', () ->
          $buttons = tpl.$('.goodbutton')
          prevValue = clickCount
          increment = $buttons.length
          $buttons.click()
          expect(clickCount).to.equal(prevValue + increment)
          return true
