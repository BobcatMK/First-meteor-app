Template.layout.helpers({
    pageTitle: function() { return Session.get("pageTitle"); }
});

Deps.autorun(function() {                   // ten kawalek kodu odpla sie za kazdym razem kiedy zmieniaja się reaktywne zródla danych
    console.log(Session.get("pageTitle"));
});