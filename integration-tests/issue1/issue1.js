if (Meteor.isClient) {
  // tab is 1 by default
  Session.setDefault('tab', 1);
  Session.setDefault('haveSwitchedOutFromTab1', false);

  const tpl = Template['body'];

  tpl.helpers({
    tabEquals (value) {
      return Session.get('tab') === value;
    },
    haveSwitchedOutFromTab1 () {
      return Session.get('haveSwitchedOutFromTab1');
    }
  });

  tpl.events({
    'click .tabbutton' (event, template) {
      const $button      = $(event.currentTarget),
            targetTabId  = parseInt($button.attr('for')),
            currentTabId = parseInt(Session.get('tab'));

      if (!isNaN(targetTabId)) {
        if (currentTabId == 1 && targetTabId != 1) {
          Session.set('haveSwitchedOutFromTab1', true);
        }
        Session.set('tab', targetTabId);
      }
      return true;
    }
  });

  tpl.onRendered(function () {
    const tpl = this;

    MochaWeb.testOnly(() => {
      console.clear();
      const expect = chai.expect;

      const hasRippleEffect = (element, done) => {
        const $testButton = tpl.$(element);
        $rippleObject = $testButton.find('.mdl-ripple');
        expect($rippleObject.length).to.not.equal(0);
        expect($rippleObject.hasClass('is-visible')).to.be.false;
        $testButton[0].dispatchEvent(new MouseEvent('mousedown', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        }));
        expect($rippleObject.hasClass('is-visible')).to.be.true;
        $testButton[0].dispatchEvent(new MouseEvent('mouseup', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        }));
        setTimeout(() => {
          expect($rippleObject.hasClass('is-visible')).to.be.false;
          done();
        }, 0);

        return true;
      };

      const hasNoRippleEffect = (element) => {
        $testButton = tpl.$('.testbutton');
        $rippleObject = $testButton.find('.mdl-ripple');
        expect($rippleObject.length).to.equal(0);
        return true;
      };

      describe('Issue #1', function() {
        let upgradeStyle = null;

        it('*Clear upgrade style', function() {
          upgradeStyle = MDl.autoUpgrade.getUpgradeStyle();
          MDl.autoUpgrade.setUpgradeStyle('none');
          return true;
        });

        it('Button should exist', function() {
          expect(tpl.$('.testbutton')).to.be.not.empty;
          return true;
        });

        it('Button should have ripple effect at first', function(done) {
          hasRippleEffect('.testbutton', done);
          return true;
        });

        it('Button should not have ripple effect after tab switch', function(done) {
          tpl.$('.tabbutton[for=2]').click();
          expect(Session.get('tab')).to.equal(2);
          setTimeout(function() {
            tpl.$('.tabbutton[for=1]').click();
            expect(Session.get('tab')).to.equal(1);
            setTimeout(function() {
              hasNoRippleEffect('.testbutton');
              done();
              return true;
            }, 100);
            return true;
          }, 100);
          return true;
        });

        it('Button should have ripple effect after tab switch with auto-upgrading', function(done) {
          MDl.autoUpgrade.setUpgradeStyle('fullUpgrade');
          tpl.$('.tabbutton[for=2]').click();
          expect(Session.get('tab')).to.equal(2);
          setTimeout(function() {
            tpl.$('.tabbutton[for=1]').click();
            expect(Session.get('tab')).to.equal(1);
            setTimeout(hasRippleEffect.bind(null, '.testbutton', done), 100);
            return true;
          }, 100);
          return true;
        });

        return it('*Restore upgrade style', function() {
          MDl.autoUpgrade.setUpgradeStyle(upgradeStyle);
          return true;
        });
      });
    });
  });
}
