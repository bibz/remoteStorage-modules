(function() {
  if(!RemoteStorage) {
    RemoteStorage = remoteStorage;
  }
  RemoteStorage.defineModule('root', function(privClient, pubClient) {

    function privPubFork(name, pathParamPos) {
      if(! pathParamPos) {
        pathParamPos = 0;
      }
      return function() {
        var args = util.toArray(arguments);
        var path = args[pathParamPos];
        if(path.substr(8) === '/public/') {
          return pubClient[name].apply(pubClient, args);
        } else {
          return privClient[name].apply(privClient, args);
        }
      }
    }

    return {
      exports: {
        on: function(eventName, handler) {
          privClient.on(eventName, handler);
          pubClient.on(eventName, handler);
        },

        use: privPubFork('use'),
        release: privPubFork('release'),
        getListing: privPubFork('getListing'),
        getAll: privPubFork('getAll'),
        getObject: privPubFork('getObject'),
        getFile: privPubFork('getFile'),
        storeObject: privPubFork('storeObject', 1),
        storeFile: privPubFork('storeFile', 1),
        remove: privPubFork('remove'),
        hasDiff: privPubFork('hasDiff'),
        getItemURL: privPubFork('getItemURL')
      }
    };
  });
})();
