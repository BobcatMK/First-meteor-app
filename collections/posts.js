Posts = new Meteor.Collection("posts");

// Posts.allow({
//     insert: function(userId,doc) {
//         return !!userId;
//     }
// })

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two field:
    return (_.without(fieldNames, 'url', 'title').length > 0)
  },
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    console.log(modifier);
    return errors.title || errors.url;
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.world);
    check(postAttributes, {
      title: String,
      url: String
    });

    if (Meteor.isServer) {
      postAttributes.title += "(server)";
      // wait for 5 seconds
      Meteor._sleepForMs(5000);
    } else {
      postAttributes.title += "(client)";
    }

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error("invalid-post","you must set a title and URL for your post")

    var postWithSameLink = Posts.findOne({url: postAttributes.url});

    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();

    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  },
  upvote: function(postId) {
    check(this.userId,String);
    check(postId,String);

    // var post = Posts.findOne(postId);
    // if (!post)
    //   throw new Meteor.Error('invalid','Post not found');

    // if (_.include(post.upvoters,this.userId))
    //   throw new Meteor.Error('invalid','Already upvoted this post')

    // Posts.update(post._id,{
    //   $addToSet: {upvoters: this.userId},
    //   $inc: {votes: 1}
    // });
    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (!affected)
      throw new Meteor.Error('invalid',"You weren't able to upvote that post");
  }
});

validatePost = function(post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";

  if (!post.url)
    errors.url = "Please fill in a URL";

  return errors;
}
