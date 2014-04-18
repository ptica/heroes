var data;
var pix;
var context;
var p;
var sobel;
var img;
var getLuminosity = function () {
	return (3*this.r + 4*this.g + this.b)/(6*255);
}

Template.canvas.events = {
		'mousedown': function (e) {
			e.target.mouse_down = true;
			var offsetParent = $(e.target).offset();
			var x = e.pageX - offsetParent.left;
			var y = e.pageY - offsetParent.top;
			e.target.last_x = x;
			e.target.last_y = y;
		},
		'mousemove': function (e) {
			if (e.target.mouse_down) {
				var offsetParent = $(e.target).offset();
				var x = e.pageX - offsetParent.left;
				var y = e.pageY - offsetParent.top;
				//console.log(x + ', ' + y);
				
				for (var j = e.target.last_y;j<=y;j++) {
					p = pix.getPixel(x,j);
					/*
					for (var i=x;i>0;i--) {
						pix.setPixel(i,j, p.r, p.g, p.b, p.a);
					}
					*/
					
					// left trace
					var treshold = 0.37;
					var i = x;
					//while ()
					for (var i=x; i>0; i--) {
						//console.log(sobel.data.getPixel(i,y).getLuminosity());
						if (sobel.data.getPixel(i,j).getLuminosity() < treshold) {
							pix.setPixel(i,j, 255, 255, 255, 255);
						} else {
							i = 0;
						}
					}
					// right trace
					for (var i=x+1; i<img.width; i++) {
						if (sobel.data.getPixel(i,j).getLuminosity() < treshold) {
							pix.setPixel(i,j, 255, 255, 255, 255);
						} else {
							i = img.width;
						}
					}
					
				}
				context.putImageData(data, 0, 0);
				
				e.target.last_x = x;
				e.target.last_y = y;
			}
		},
		'mouseup': function (e) {
			e.target.mouse_down = false;
		},
		'click': function (e) {
			var offsetParent = $(e.target).offset();
			var x = e.pageX - offsetParent.left;
			var y = e.pageY - offsetParent.top;
			
			// left trace
			var treshold = 0.5;
			var i = x;
			//while ()
			for (var i=x; i>0; i--) {
				//console.log(sobel.data.getPixel(i,y).getLuminosity());
				if (sobel.data.getPixel(i,y).getLuminosity() < treshold) {
					pix.setPixel(i,y, 255, 255, 255, 255);
				} else {
					i = 0;
				}
			}
			// right trace
			for (var i=x+1; i<img.width; i++) {
				if (sobel.data.getPixel(i,y).getLuminosity() < treshold) {
					pix.setPixel(i,y, 255, 255, 255, 255);
				} else {
					i = img.width;
				}
			}
			
			context.putImageData(data, 0, 0);
		}
}

Template.canvas.rendered = function () {
	var canvas  = document.querySelector('#hero');
	context = canvas.getContext('2d');
	
	img = new Image();
	// local url so we avoid tainting
	img.src = "venere.jpg";
	img.onload = function () {
		canvas.width = img.width;
		canvas.height = img. height;
		
		context.drawImage(img, 0, 0);
		data = context.getImageData(0, 0, img.width, img.height);
		pix  = data.data;
		Uint8ClampedArray.prototype.setPixel = function (x, y, r, g, b, a) {
			index = (x + y * canvas.width) * 4;
			this[index+0] = r;
			this[index+1] = g;
			this[index+2] = b;
			this[index+3] = a;
		}
		Uint8ClampedArray.prototype.getPixel = function (x, y) {
			index = (x + y * canvas.width) * 4;
			var r = {};
			r.getLuminosity = getLuminosity;
			r.r = this[index+0];
			r.g = this[index+1];
			r.b = this[index+2];
			r.a = this[index+3];
			
			return r;
		}
		sobel = Filters.sobel(data);
		//context.putImageData(sobel, 0, 0);
		
		
		/*for (var i = 0, n = pix.length; i < n; i += 4) {
			  var r = pix[i];
			  var g = pix[i+1];
			  var b = pix[i+2];
			  pix[i] = b;
			  pix[i+1] = r;
			  pix[i+2] = g;
			}
		
		context.putImageData(data, 0, 0);*/
	}
};