Router.configure({
    layoutTemplate: 'layout', // This line tells meteor to use layout.html as default template for all routes
    loadingTemplate: "loading", // Loading template odnosi sie bezposredio do momentu kiedy dany route sie laduje, na czas ladowania wyswietla sie jakich zastepczy route po to aby nie bylo nic nie widac w trakcie ladowania.
    notFoundTemplate: "notFound", // This template is loaded when no url was found
    waitOn: function() { return [ Meteor.subscribe("posts"), Meteor.subscribe("comments")] } // What we are saying here is that for every route on the site (we only have one right now, but soon we’ll have more!), we want to subscribe to the posts subscription.
});

Router.route('/', {name: 'postsList'});

// Router.map(function() {
//     this.route("postPage",{
//         path: "/posts/:_id",
//         data: function() { return Posts.findOne(this.params._id); }
//     });
// });

Router.route("/posts/:_id", {
    name: "postPage",
    data: function() { return Posts.findOne(this.params._id)}
});

Router.route("/posts/:_id/edit", {
    name: "postEdit",
    data: function() { return Posts.findOne(this.params._id) } // tutaj this to route, a params to jego paramsy
});

Router.route("/submit",{ name: "postSubmit" });

var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render("accessDenied");
        }
    } else {
        this.next();  // chyba chodzi o to ze jezeli sie uda przekierowac
    }
}

Router.onBeforeAction("dataNotFound",{only: "postPage"});
Router.onBeforeAction(requireLogin, {only: "postSubmit"});

// if (Meteor.isClient) {
//     Tracker.autorun(function() { console.log(Session.get("pageTitle")) });
// }
