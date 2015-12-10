# screens-carousel
Takes a carousel url and fires events when the carousel url changes.

# Example Usage

```
  const Carousel = require('ftlabs-screens-carousel');

	const carousel = new Carousel(
    	url, // http://ftlabs-screens.herokuapp.com/generators/carousel?title=FT%20Screens%2010%2F1...
    	host // http://ftlabs-screens.herokuapp.com/
	);
	carousel.on('change', updateFrameURL);
	
	// load the first url
	updateFrameURL(carousel.getCurrentURL());
```
