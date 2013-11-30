most-interesting-server
=======================

Get that unix fix right on the web, right in your flipping browser. Even in your phone! Yeah that's right, even in non-unix phones!!

Grab your beard and head over to the [interesting server demo](http://magwo.github.io/most-interesting-server/index.html).


![Screenshot of most interesting server on the web](/screenshot.png "Screenshot")

There's also a [demo with controls/metrics](http://magwo.github.io/most-interesting-server/index.html?controls).


FAQ
=====================

Q: What is the purpose of this?  
A: Consider it a work of art that goes well with unix beards.

Q: How does one performantly linebreak content bottom-up?  
A: Good question! As far as I'm aware, current browsers do not consistently support bottoms-up layouts with regards to line breaks (block elements). Essentially it means that we want a bottom-aligned element that grows in height, and then overflows in the top. It seems hard to properly achieve this behaviour across browsers.
It is probably possible with flexbox layouts in the latest browser versions.  
However, bottom-up layout can be achieved using a CSS flip transform along the Y axis, for both the parent element and the child elements.
So basically you flip the parent. The whole content is now upside down. Now you flip the individual rows of text, and the text is displayed correctly, but everything is layed out bottoms-up!
