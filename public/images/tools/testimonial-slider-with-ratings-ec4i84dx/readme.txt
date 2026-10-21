=== Testimonial Slider with Ratings ===
Contributors: wpcoder-ai
Requires at least: 6.4
Requires PHP: 8.3
License: GPL-2.0-or-later

Adds a Testimonials admin area with reviewer details, star ratings, and a frontend slider shortcode.

== Installation ==
1. Upload the testimonial-slider-with-ratings-ec4i84dx folder to /wp-content/plugins/.
2. Activate "Testimonial Slider with Ratings" from the Plugins screen.
3. Add testimonials from Testimonials > Add New.

== Usage ==
Place this shortcode in a post, page, or widget:
[testimonial_slider_with_ratings]

Optional attributes:
limit="10" orderby="date" order="DESC" autoplay="true" interval="5000" ids="12,34"

The shortcode displays published testimonials only. The testimonial content comes from the editor, while reviewer name, role/company, and rating are stored in the Reviewer Details box.

== Privacy and external services ==
This plugin does not contact external services and does not create custom database tables. It stores testimonial content and reviewer details as WordPress posts and post meta.
