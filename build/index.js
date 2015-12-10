'use strict';

var transformUrl = require('./urls');
var EventEmitter = require('events');
var util = require('util');

function getFrames(url, host) {
	var params = querystring.parse(url.split('?')[1]);
	var urls = params.u;
	var durationsOfUrls = params.d;
	var defaultDuration = 10;
	var minDuration = 2;
	var maxDuration = 50000;

	var frames = urls.map(function (url, i) {
		var duration = parseInt(durationsOfUrls[i]);
		duration = isNaN(duration) ? defaultDuration : duration;

		duration = Math.max(duration, minDuration);
		duration = Math.min(duration, maxDuration);

		url = transformUrl(url, host);

		// Append the host if it is a local url
		if (url && !/^https?:/.exec(url)) {
			url = host + url;
		}
		return [url, duration];
	}).filter(function (pair) {
		return pair[0] !== '';
	});

	if (frames.length === 0) {
		return [];
	}

	return frames;
}

function Carousel(url, host) {
	EventEmitter.call(this);
	this.frames = getFrames(url, host);
	this.carouselTimeout = null;
	this.url = null;
	if (this.frames.length) {
		this.changeFrame(this.frames, 0);
	}
}
util.inherits(Carousel, EventEmitter);

module.exports = Carousel;

Carousel.prototype.getCurrentURL = function getCurrentURL() {
	return this.url;
};

Carousel.prototype.changeFrame = function changeFrame(frames, i) {

	if (i >= frames.length) {
		i = 0;
	}
	var url = frames[i][0];
	var duration = frames[i][1] * 1000;

	console.log('changeFrame: i=' + i + ', duration=' + duration + ', url=' + url);

	this.url = url;
	this.emit('change', url);
	this.carouselTimeout = setTimeout(this.changeFrame.bind(this), duration, frames, i + 1);
};

Carousel.prototype.destroy = function () {
	clearTimeout(this.carouselTimeout);
};

Carousel.isCarousel = function (url) {
	return url.indexOf('generators/carousel?') !== -1;
};
