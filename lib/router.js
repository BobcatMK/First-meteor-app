// Router.configure({
//     layoutTemplate: 'layout', // This line tells meteor to use layout.html as default template for all routes
//     loadingTemplate: "loading", // Loading template odnosi sie bezposredio do momentu kiedy dany route sie laduje, na czas ladowania wyswietla sie jakich zastepczy route po to aby nie bylo nic nie widac w trakcie ladowania.
//     notFoundTemplate: "notFound", // This template is loaded when no url was found
//     // waitOn: function() { return [ Meteor.subscribe("posts"), Meteor.subscribe("comments")] } // What we are saying here is that for every route on the site (we only have one right now, but soon we’ll have more!), we want to subscribe to the posts subscription.
//     waitOn: function() { return Meteor.subscribe("notifications") }
// });

// Router.route('/:postsLimit?', {
//     name: 'postsList',
//     waitOn: function() {
//         var limit = parseInt(this.params.postsLimit) || 5;
//         return Meteor.subscribe("posts",{sort: {submitted: -1}, limit: limit});
//     },
//     data: function() {
//         var limit = parseInt(this.params.postsLimit) || 5;
//         return {
//             posts: Posts.find({},{sort: {submitted: -1}, limit: limit})
//         };
//     }
// });

// // Router.map(function() {
// //     this.route("postPage",{
// //         path: "/posts/:_id",
// //         data: function() { return Posts.findOne(this.params._id); }
// //     });
// // });

// Router.route("/posts/:_id", {
//     name: 'postPage',
//     waitOn: function() {
//         return Meteor.subscribe('comments', this.params._id);
//     },
//     data: function() { return Posts.findOne(this.params._id); }
// });

// Router.route("/posts/:_id/edit", {
//     name: "postEdit",
//     data: function() { return Posts.findOne(this.params._id) } // tutaj this to route, a params to jego paramsy
// });

// Router.route("/submit",{ name: "postSubmit" });

// var requireLogin = function() {
//     if (!Meteor.user()) {
//         if (Meteor.loggingIn()) {
//             this.render(this.loadingTemplate);
//         } else {
//             this.render("accessDenied");
//         }
//     } else {
//         this.next();  // chyba chodzi o to ze jezeli sie uda przekierowac
//     }
// }

// Router.onBeforeAction("dataNotFound",{only: "postPage"});
// Router.onBeforeAction(requireLogin, {only: "postSubmit"});

// if (Meteor.isClient) {
//     Tracker.autorun(function() { console.log(Session.get("pageTitle")) });
// }


Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {
      sort: this.sort,
      limit: this.postsLimit()
    };
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});
NewPostsController = PostsListController.extend({
  sort: {
    submitted: -1,
    _id: -1
  },
  nextPath: function() {
    return Router.routes.newPosts.path({
      postsLimit: this.postsLimit() + this.in
      crement
    })
  }
});
BestPostsController = PostsListController.extend({
  sort: {
    votes: -1,
    submitted: -1,
    _id: -1
  },
  nextPath: function() {
    return Router.routes.bestPosts.path({
      postsLimit: this.postsLimit() + this.i
      ncrement
    })
  }
});
Router.route('/', {
  name: 'home',
  controller: NewPostsController
});
Router.route('/new/:postsLimit?', {
  name: 'newPosts'
});
Router.route('/best/:postsLimit?', {
  name: 'bestPosts'
});