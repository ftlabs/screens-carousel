'use strict';

var parseQueryString = require('query-string').parse;
var isYoutubeRegex = /^(https?:\/\/)?(www\.)youtube\.com\//;
var isAnImageRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;
var isASupportedImageRegex = /\.(jpg|jpeg|tiff|png)$/i;
var isFTVidRegex = /^(https?:\/\/)?video\.ft\.com\/(\d{7,})(\/.*)?$/;

function isYoutube(url) {
	return isYoutubeRegex.test(url);
}

function isImage(url) {
	return isAnImageRegex.test(url);
}

function isSupportedByImageService(url) {
	return isASupportedImageRegex.test(url);
}

function isFTVideo(url) {
	return isFTVidRegex.test(url);
}

function transformYoutubePlaylist(queryParams) {
	return 'https://www.youtube.com/embed/videoseries?autoplay=1&controls=0&loop=1&html5=1&showinfo=0&listType=playlist&list=' + queryParams.list;
}

function transformYoutubeVideo(queryParams) {
	return 'https://www.youtube.com/embed/' + queryParams.v + '?autoplay=1&controls=0&loop=1&html5=1&showinfo=0&playlist=' + queryParams.v;
}

function transformImageWithImageService(url, host) {
	var title = url.match(/[^/]+$/)[0];
	return host + '/generators/image/?' + encodeURIComponent('https://image.webservices.ft.com/v1/images/raw/' + encodeURIComponent(url) + '?source=screens') + '&title=' + title;
}

function transformImage(url, host) {
	var title = url.match(/[^/]+$/)[0];
	return host + '/generators/image/?' + encodeURIComponent(url) + '&title=' + title;
}

function tranformFTVideo(url, host) {
	var id = url.match(/\.com\/(\d{7,})/)[1];
	return host + '/generators/ftvideo/?id=' + id;
}

module.exports = function transform(url, host) {
	if (isYoutube(url)) {
		var queryParams = parseQueryString(url.split('?')[1]);

		if (queryParams.list) {
			url = transformYoutubePlaylist(queryParams);
		} else if (queryParams.v) {
			url = transformYoutubeVideo(queryParams);
		}
	} else if (isImage(url)) {
		if (isSupportedByImageService(url)) {
			url = transformImageWithImageService(url, host);
		} else {
			url = transformImage(url, host);
		}
	} else if (isFTVideo(url)) {
		url = tranformFTVideo(url, host);
	}
	return url;
};