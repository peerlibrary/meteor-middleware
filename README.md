Meteor Middleware
=================

Meteor smart package which provides middleware support for Meteor publish functions. It creates a system of
publish endpoints and stacked middleware which allows easy use of reusable components in the pipeline between
MongoDB and clients, in a reactive manner.

Implemented features are:
 * class-based publish endpoint
 * class-based middleware which can post-process documents send to the subscriber by the publish endpoint
 * stacking of middleware onto the publish endpoint

Planned features are:
 * auto-generation of public API documentation for publish endpoints
 * integration of automatic arguments checking

Adding this package to your [Meteor](http://www.meteor.com/) application adds `PublishEndpoint` and `PublishMiddleware`
objects into the global scope.

Server side only.

Installation
------------

```
meteor add peerlibrary:middleware
```

Publish endpoints
-----------------

`PublishEndpoint` provides a base connection between the database and the rest of the stack. It can be seen as
traditional Meteor publish function and you define it in a similar, but class-based way:

```coffee
myEndpoint = new PublishEndpoint 'my-endpoint', (argument1, argument2) ->
  # Here you can define your base publish function in the same way as you
  # would otherwise. For example, you can just return a cursor:
  Posts.find()
```

Publish middleware
------------------

To define middleware, you extend the `PublishMiddleware` class with following methods:

```coffee
class PublishMiddleware
  added: (publish, collection, id, fields) =>
    publish.added collection, id, fields

  changed: (publish, collection, id, fields) =>
    publish.changed collection, id, fields

  removed: (publish, collection, id) =>
    publish.removed collection, id

  onReady: (publish) =>
    publish.ready()

  onStop: (publish) =>
    publish.stop()

  onError: (publish, error) =>
    publish.error error
```

`publish` argument is the publish context of the current subscription. It is passed as an argument because
the same middleware instance is reused among all subscriptions to the same publish endpoint. In addition to
[all official methods available for you otherwise](http://docs.meteor.com/#meteor_publish), there are few additional:

 * `publish.params()` – returns the arguments passed to the subscription by the client, an array
 * `publish.set(key, value)` – sets a `value` for the `key` in the state for this subscription, you can use this to share state
 between middleware
 * `publish.get(key)` – retrieves the value for the `key` from the state

Default implementation of all `PublishMiddleware` methods is to pass it on to the client. You can modify parameters,
decide to send something all, or simply to ignore and not do anything. You call `publish` methods you want.

Example:

```coffee
class LogAllActionsMiddleware extends PublishMiddleware
  added: (publish, collection, id, fields) =>
    console.log "added", collection, id, fields
    super

  changed: (publish, collection, id, fields) =>
    console.log "changed", collection, id, fields
    super

  removed: (publish, collection, id) =>
    console.log "removed", collection, id
    super

  onReady: (publish) =>
    console.log "ready"
    super

  onStop: (publish) =>
    console.log "stop"
    super

  onError: (publish, error) =>
    console.log "error", error
    super
```

Stacking middleware
-------------------

Once you defined your middleware class, you can add in onto the publish endpoint:

```coffee
myEndpoint.use new LogAllActionsMiddleware()
```

Middleware is stacked in the order they were registered. Those registered earlier are called earlier. At each middleware,
only later middleware is processed, no matter what you call from the method. For example, if you are in `added` method
and you call `publish.changed`, only `changed` for the rest of middleware stack will be called, and will **not** go from the
top again.

Examples
--------

See [tests](https://github.com/peerlibrary/meteor-middleware/blob/master/tests.coffee) for some examples. See
[middleware definitions in PeerLibrary](https://github.com/peerlibrary/peerlibrary/tree/development/server/middlewares) for
real-world definitions, and [their endpoints](https://github.com/peerlibrary/peerlibrary/blob/development/server).
