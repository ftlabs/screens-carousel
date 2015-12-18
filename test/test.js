'use strict';

/* global describe, it */

const chai = require('chai');
const expect = chai.expect;
const Carousel = require('../build');
const testUrl = 'http://localhost:3010/generators/carousel?' +
	'title=Editorial%20FT%20Pages&' +
	'u=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D9dxiTuPy9dQ&d=&' +
	'u=http%3A%2F%2F40.media.tumblr.com%2F23262af37efc39ddd56d2027ef6cbc22%2Ftumblr_nz045mpSxR1u3akyno1_1280.jpg&d=20&' +
	'u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2FbvT334mDMvXe8%2Fgiphy.gif&d=0&' +
	'u=http%3A%2F%2Fvideo.ft.com%2F4665768882001%2FHow-mood-changed-towards-Fed-rate-rise%2FEditors-Choice&d=2&' +
	'u=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3DPLrhpR40o4n5yM1_NXEzN8FJqI0vND7aqy&d=5&' +
	'u=&d=';

describe('It should transform urls correctly', function() {

	const carousel = new Carousel(testUrl, 'http://example.com');

	it('Should have the correct title', function (done) {
		expect(carousel.getTitle()).to.equal('Editorial FT Pages');
		done();
	});

	it('Should have the first url correctly transformed', function (done) {
		expect(carousel.getCurrentURL()).to.equal('https://www.youtube.com/embed/9dxiTuPy9dQ?autoplay=1&controls=0&loop=1&html5=1&showinfo=0&playlist=9dxiTuPy9dQ');
		done();
	});

	let carouselStarted = Date.now();
	it ('Should change after 10s', function (done) {
		this.timeout(11000);
		carousel.once('change', function (url) {
			const duration = Date.now() - carouselStarted;
			expect(duration).to.be.above(9995);
			expect(url).to.equal('http://example.com/generators/image/?https%3A%2F%2Fimage.webservices.ft.com%2Fv1%2Fimages%2Fraw%2Fhttp%253A%252F%252F40.media.tumblr.com%252F23262af37efc39ddd56d2027ef6cbc22%252Ftumblr_nz045mpSxR1u3akyno1_1280.jpg%3Fsource%3Dscreens&title=tumblr_nz045mpSxR1u3akyno1_1280.jpg');
			done();
		});
	});

	it ('Should change after 20s', function (done) {
		carouselStarted = Date.now();
		this.timeout(21000);
		carousel.once('change', function (url) {
			const duration = Date.now() - carouselStarted;
			expect(duration).to.be.above(19995);
			expect(url).to.equal('http://example.com/generators/image/?https%3A%2F%2Fmedia.giphy.com%2Fmedia%2FbvT334mDMvXe8%2Fgiphy.gif&title=giphy.gif');
			done();
		});
	});

	it ('Should change to ftvideo after 2s, if timeout is zero', function (done) {
		carouselStarted = Date.now();
		this.timeout(3000);
		carousel.once('change', function (url) {
			const duration = Date.now() - carouselStarted;
			expect(duration).to.be.above(1995);
			expect(url).to.equal('http://example.com/generators/ftvideo/?id=4665768882001');
			done();
		});
	});

	it ('Should change to the youtube playlist after 2s because 2s is the declared time', function (done) {
		carouselStarted = Date.now();
		this.timeout(3000);
		carousel.once('change', function (url) {
			const duration = Date.now() - carouselStarted;
			expect(duration).to.be.above(1995);
			expect(url).to.match(/^https:\/\/www.youtube.com\/embed\/videoseries\?autoplay=1&controls=0&loop=1&html5=1&showinfo=0&listType=playlist&list=/);
			done();
		});
	});

	it ('Should return to beginning after 5s', function (done) {
		carouselStarted = Date.now();
		this.timeout(6000);
		carousel.once('change', function (url) {
			const duration = Date.now() - carouselStarted;
			expect(duration).to.be.above(4995);
			expect(url).to.equal('https://www.youtube.com/embed/9dxiTuPy9dQ?autoplay=1&controls=0&loop=1&html5=1&showinfo=0&playlist=9dxiTuPy9dQ');
			done();
		});
	});
});
