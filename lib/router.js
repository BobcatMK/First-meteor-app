Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: "loading",
    waitOn: function() { return Meteor.subscribe("posts"); }
});

Router.route('/', {name: 'postsList'});

Router.map(function() {
    this.route("postPage",{
        path: "/posts/:_id",
        data: function() { return Posts.findOne(this.params._id); }
    });
});