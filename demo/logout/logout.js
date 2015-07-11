if (Meteor.isClient) {
  Template.hello.helpers({
    userId: function () {
      return Meteor.userId();
    }
  });

  Template.hello.events({
    'click button': function () {
      Meteor.logout();
    }
  });
}
