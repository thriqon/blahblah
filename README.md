
BlahBlah
========

Dead-simple pubsub implementation for Browser and Node.

Installation
============

    npm install --save blahblah

Usage
=====

Blahblah has the concept of channels: Each event is fired in a channel, and is
received by handlers that are registered for this event type:

```javascript
var channel = blahblah.channel('/asd');

channel.listenTo('windowOpened', function () { ... });

// ...

var sender = blahblah.channel('/asd');

sender.tell('windowClosed'); // is not received by the function above

sender.tell('windowOpened'); // is received
```

Additionally, for some use cases it is important to listen to all events that
occur in a room:

```javascript
channel.listenToAll(function (eventName) { ... });
```

Additional arguments passed to `.tell` are passed to the handlers. All-Handlers
receive the event name first, however.

```javascript
channel.listenTo('windowOpened', function (win) { ... });

channel.tell('windowOpened', window);
```

Both normal handlers and all-handlers can be unregistered by calling `unlistenTo`
or `unlistenToAll`, respectively.

### Global Reset

During testing, it might be preferable to have a possibility to deregister all currently
registered handlers to provide a clean work environment for the next test. This
can be accomplished by calling `blahblah.globalReset()`, which will forget all handlers, with
one exception: Handlers registered for the root channel `/` are preserved.


Testing
=======

Tests are run with `npm test`. Note that the code coverage is 100%.

Contributions
=============

Please include tests and try to keep the code coverage at 100%.

License
=======

This work is released under the terms of the ISC license.


