orchids.init({
    route: !0,
    animate: !0,
    onFirstPageInitialized: function() {
        console.log('first page initialized');
    },
    onRouteChange: function () {
        console.log('route change');
    },
    container: 'container'
});
