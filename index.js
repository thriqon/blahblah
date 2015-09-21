
var channels = {};

function boundToChannelName(f, ctxt, chl) {
	return function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(chl);
		f.apply(ctxt, args);
		return ctxt;
	};
}

function getChannel(channel) {
	if (!channels[channel]) {
		channels[channel] = {};
	}
	return channels[channel];
}
function getEventsArray(channelId, evt) {
	var channel = getChannel(channelId);
	if (!channel[evt]) {
		channel[evt] = [];
	}
	return channel[evt];
}
function listenTo(channel, evt, handler) {
	getEventsArray(channel, evt).push(handler);
}
function tell(channel, evt) {
	var handlers = getEventsArray(channel, evt);
	var args = Array.prototype.slice.call(arguments, 2);
	handlers.forEach(function (h) { h.apply(null, args); });

	var allHandlers = getEventsArray(channel, '___all');
	args = Array.prototype.slice.call(arguments, 1);
	allHandlers.forEach(function (h) { h.apply(null, args); });
}
function listenToOnce(channel, evt, handler) {
	function executeAndUnlisten() {
		handler.apply(null, arguments);
		unlistenTo(channel, evt, handler);
	}
	this.listenTo(evt, executeAndUnlisten);
}
function unlistenTo(channel, evt, handler) {
	var arr = getEventsArray(channel, evt);
	var pos = arr.indexOf(handler);
	if (pos >= 0) {
		arr.splice(pos, 1);
	}
}
function listenToAll(channel, handler) {
	listenTo(channel, '___all', handler);
}
function unlistenToAll(channel, handler) {
	unlistenTo(channel, '___all', handler);
}

function channel(chl) {
	var obj = {};
	obj.listenTo = boundToChannelName(listenTo, obj, chl);
	obj.tell = boundToChannelName(tell, obj, chl);
	obj.listenToOnce = boundToChannelName(listenToOnce, obj, chl);
	obj.unlistenTo = boundToChannelName(unlistenTo, obj, chl);
	obj.listenToAll = boundToChannelName(listenToAll, obj, chl);
	obj.unlistenToAll = boundToChannelName(unlistenToAll, obj, chl);
	return obj;
}

module.exports = {
	globalReset: function () {
		Object.keys(channels).forEach(function (channel) {
			if (channel !== '/') {
				channels[channel] = null;
			}
		});
	},
	channel: function (name) {
		return channel(name);
	}
};
