Template.postEdit.created = function() {
    Session.set('postEditErrors',{});
}

Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentPostId = this._id;
        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        // START
        // Ponizej znajduje sie validacja unikatowosci url
        // Jezeli url juz istnieje w bazie danych to wtedy wywala alerta, ze taki url juz istnieje

        var test = Posts.find({url: postProperties.url}).fetch()

        if (test.length != 0) {
            for (var i = 0;i <= test.length;i++) {
                if (test[0]._id !== currentPostId) {
                    throwError("Post with such url already exists");
                    // return Router.go('postPage', { _id: currentPostId});
                    return
                }
            }
        }

        // END

        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set('postEditErrors',errors);

        Posts.update(currentPostId, {
            $set: postProperties
        }, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                Router.go('postPage', {
                    _id: currentPostId
                });
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
});