'use strict';

const transformUrl = require('./urls');
const EventEmitter = require('events');
const util = require('util');
const querystring = require('query-string');

function getFrames(url, host) {
	const params = querystring.parse(url.split('?')[1]);
	const urls = params.u;
	const durationsOfUrls = params.d;
	const defaultDuration = 10;
	const minDuration = 2;
	const maxDuration = 50000;

	const frames = urls.map(function (url, i) {
		let duration = parseInt(durationsOfUrls[i]);
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

function getTitle(url) {
	return querystring.parse(url.split('?')[1]).title;
}

function Carousel(url, host) {
	EventEmitter.call(this);
	this.frames = getFrames(url, host);
	this.carouselTimeout = null;
	this.url = null;
	this.title = getTitle(url);
	if (this.frames.length) {
		this.changeFrame(this.frames, 0);
	}
}
util.inherits(Carousel, EventEmitter);

module.exports = Carousel;

Carousel.prototype.getTitle = function getTitle() {
	return this.title;
};

Carousel.prototype.getCurrentURL = function getCurrentURL() {
	return this.url;
};

Carousel.prototype.changeFrame = function changeFrame(frames, i) {

	if (i >= frames.length) { i = 0; }
	const url      = frames[i][0];
	const duration = frames[i][1] * 1000;

	setTimeout(() => {

		console.log('changeFrame: i=' + i + ', duration=' + duration + ', url=' + url);

		this.url = url;
		this.emit('change', url);
	}, 0);
	
	this.carouselTimeout = setTimeout(this.changeFrame.bind(this), duration, frames, i+1);
};

Carousel.prototype.destroy = function() {
	clearTimeout(this.carouselTimeout);
};

Carousel.isCarousel = function(url) {
	return (url.indexOf('generators/carousel?') !== -1);
};
