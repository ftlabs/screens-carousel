'use strict';

const transformUrl = require('./urls');
const EventEmitter = require('events');
const util = require('util');

function parseParams(url) {
	const params = [];
	let tmp = [];
	(new URL(url)).search.substr(1).split('&')
		.forEach(function(item) {
			tmp = item.split('=');
			params.push( [tmp[0], decodeURIComponent(tmp[1])] );
		});
	return params;
}

function getFrames(url, host) {
	const params = parseParams(url);
	const urls = [];
	const durationsOfUrls  = {};
	const defaultDuration = 10;
	const minDuration = 2;
	const maxDuration = 50000;

	params.forEach(function(param) {
		if (param[0] === 'u') {
			urls.push(param[1]);
		} else if (param[0] === 'd') {
			durationsOfUrls [ urls.slice(-1) ] = param[1];
		}
	});

	const frames = urls.map(function(url) {
		let duration = parseInt(durationsOfUrls [url]);
		duration = isNaN(duration)? defaultDuration : duration;

		duration = Math.max(duration, minDuration);
		duration = Math.min(duration, maxDuration);

		url = transformUrl(url, host);

		// Append the host if it is a local url
		if (url && !/^https?:/.exec(url)) {
			url = host + url;
		}
		return [url, duration];
	})
	.filter(function(pair) {return (pair[0] !== '');});

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

	if (i >= frames.length) { i = 0; }
	const url      = frames[i][0];
	const duration = frames[i][1] * 1000;

	console.log('changeFrame: i=' + i + ', duration=' + duration + ', url=' + url);

	this.url = url;
	this.emit('change', url);
	this.carouselTimeout = setTimeout(this.changeFrame.bind(this), duration, frames, i+1);
};

Carousel.prototype.destroy = function() {
	clearTimeout(this.carouselTimeout);
};

Carousel.isCarousel = function(url) {
	return (url.indexOf('generators/carousel?') !== -1);
};
