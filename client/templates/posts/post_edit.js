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
                    alert("Post with such url already exists");
                    // return Router.go('postPage', { _id: currentPostId});
                    return
                }
            }
        }

        // END

        Posts.update(currentPostId, {
            $set: postProperties
        }, function(error) {
            if (error) {
                // display the error to the user
                alert(error.reason);
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
            Router.go('postsList');
        }
    }
});