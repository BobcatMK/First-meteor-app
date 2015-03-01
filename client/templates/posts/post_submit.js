Template.postSubmit.events({
  "submit form": function(e) {
      e.preventDefault();

        var post = {
          url: $(e.target).find("[name=url]").val(),
          title: $(e.target).find("[name=title]").val()
        }

        var errors = validatePost(post);
        if (errors.title || errors.url)
          return Session.set("postSubmitErrors",errors);

        // post._id = Posts.insert(post); nie uzywamy tego bo jest unsafe, uzywamy zamiast tego metod , metody w meteorze to server-side funkcje ktore sa odpalane na clientcie.
        Meteor.call("postInsert",post,function(error,result) {
          if (error)
            return throwError(error.reason);

          if (result.postExists)
            throwError('This link has already been posted');

          //Router.go("postPage", {_id: result._id})
        });
        //Router.go("postPage",post); 

        Router.go('postsList');
  }
});

Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {});
}

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});