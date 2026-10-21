(function () {
	'use strict';

	function initSlider(slider) {
		var slides = Array.prototype.slice.call(slider.querySelectorAll('.tswrec4i84dx-slide'));
		if (slides.length < 2) {
			return;
		}

		var previous = slider.querySelector('.tswrec4i84dx-prev');
		var next = slider.querySelector('.tswrec4i84dx-next');
		var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-to]'));
		var current = 0;
		var timer = null;
		var interval = parseInt(slider.getAttribute('data-interval'), 10) || 0;

		function show(index) {
			current = (index + slides.length) % slides.length;
			slides.forEach(function (slide, slideIndex) {
				var active = slideIndex === current;
				slide.classList.toggle('is-active', active);
				slide.hidden = !active;
			});
			dots.forEach(function (dot, dotIndex) {
				if (dotIndex === current) {
					dot.setAttribute('aria-current', 'true');
				} else {
					dot.removeAttribute('aria-current');
				}
			});
		}

		function stop() {
			if (timer) {
				window.clearInterval(timer);
				timer = null;
			}
		}

		function start() {
			stop();
			if (interval > 0) {
				timer = window.setInterval(function () {
					show(current + 1);
				}, interval);
			}
		}

		previous.addEventListener('click', function () {
			show(current - 1);
			start();
		});
		next.addEventListener('click', function () {
			show(current + 1);
			start();
		});
		dots.forEach(function (dot) {
			dot.addEventListener('click', function () {
				show(parseInt(dot.getAttribute('data-slide-to'), 10) || 0);
				start();
			});
		});

		slider.addEventListener('mouseenter', stop);
		slider.addEventListener('mouseleave', start);
		slider.addEventListener('focusin', stop);
		slider.addEventListener('focusout', start);
		show(0);
		start();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			document.querySelectorAll('.tswrec4i84dx-slider').forEach(initSlider);
		});
	} else {
		document.querySelectorAll('.tswrec4i84dx-slider').forEach(initSlider);
	}
}());
