Meteor.publish('posts', function() {
  check(options, {
    sort: Object,
    limit: Number
  });
});

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications',function() {
  return Notifications.find({userId: this.userId, read: false});
});