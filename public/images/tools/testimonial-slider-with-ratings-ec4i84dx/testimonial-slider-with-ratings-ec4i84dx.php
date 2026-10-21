<?php
/**
 * Plugin Name: Testimonial Slider with Ratings
 * Description: Adds testimonials with star ratings and displays them in an accessible slider shortcode.
 * Version: 1.0.0
 * Author: WPCoder AI
 * Requires at least: 6.4
 * Requires PHP: 8.3
 * License: GPL-2.0-or-later
 * Text Domain: testimonial-slider-with-ratings-ec4i84dx
 */

defined( 'ABSPATH' ) || exit;

const TSWREC4I84DX_VERSION   = '1.0.0';
const TSWREC4I84DX_POST_TYPE = 'tswr_testimonial';
const TSWREC4I84DX_SLUG      = 'testimonial-slider-with-ratings-ec4i84dx';

add_action( 'init', 'tswrec4i84dx_register_post_type' );
add_action( 'wp_enqueue_scripts', 'tswrec4i84dx_register_assets' );
add_action( 'admin_menu', 'tswrec4i84dx_register_admin_page' );
add_action( 'add_meta_boxes', 'tswrec4i84dx_add_meta_boxes' );
add_action( 'save_post_' . TSWREC4I84DX_POST_TYPE, 'tswrec4i84dx_save_meta' );
add_filter( 'manage_' . TSWREC4I84DX_POST_TYPE . '_posts_columns', 'tswrec4i84dx_columns' );
add_action( 'manage_' . TSWREC4I84DX_POST_TYPE . '_posts_custom_column', 'tswrec4i84dx_column_content', 10, 2 );
add_shortcode( 'testimonial_slider_with_ratings', 'tswrec4i84dx_shortcode' );

register_activation_hook( __FILE__, 'tswrec4i84dx_activate' );
register_deactivation_hook( __FILE__, 'tswrec4i84dx_deactivate' );

function tswrec4i84dx_activate(): void {
	tswrec4i84dx_register_post_type();
	flush_rewrite_rules();
}

function tswrec4i84dx_deactivate(): void {
	flush_rewrite_rules();
}

function tswrec4i84dx_register_post_type(): void {
	$labels = array(
		'name'                  => __( 'Testimonials', TSWREC4I84DX_SLUG ),
		'singular_name'         => __( 'Testimonial', TSWREC4I84DX_SLUG ),
		'add_new'               => __( 'Add New', TSWREC4I84DX_SLUG ),
		'add_new_item'          => __( 'Add New Testimonial', TSWREC4I84DX_SLUG ),
		'edit_item'             => __( 'Edit Testimonial', TSWREC4I84DX_SLUG ),
		'new_item'              => __( 'New Testimonial', TSWREC4I84DX_SLUG ),
		'view_item'             => __( 'View Testimonial', TSWREC4I84DX_SLUG ),
		'search_items'          => __( 'Search Testimonials', TSWREC4I84DX_SLUG ),
		'not_found'             => __( 'No testimonials found.', TSWREC4I84DX_SLUG ),
		'not_found_in_trash'    => __( 'No testimonials found in Trash.', TSWREC4I84DX_SLUG ),
		'all_items'             => __( 'All Testimonials', TSWREC4I84DX_SLUG ),
		'menu_name'             => __( 'Testimonials', TSWREC4I84DX_SLUG ),
		'name_admin_bar'        => __( 'Testimonial', TSWREC4I84DX_SLUG ),
		'item_published'        => __( 'Testimonial published.', TSWREC4I84DX_SLUG ),
		'item_updated'          => __( 'Testimonial updated.', TSWREC4I84DX_SLUG ),
	);

	register_post_type(
		TSWREC4I84DX_POST_TYPE,
		array(
			'labels'              => $labels,
			'public'              => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_rest'        => true,
			'menu_icon'           => 'dashicons-format-quote',
			'supports'            => array( 'title', 'editor', 'page-attributes' ),
			'has_archive'         => false,
			'rewrite'             => false,
		)
	);
}

function tswrec4i84dx_register_assets(): void {
	$base_url = plugin_dir_url( __FILE__ );
	$base_dir = plugin_dir_path( __FILE__ );

	wp_register_style(
		'tswrec4i84dx-slider',
		$base_url . 'assets/slider.css',
		array(),
		file_exists( $base_dir . 'assets/slider.css' ) ? (string) filemtime( $base_dir . 'assets/slider.css' ) : TSWREC4I84DX_VERSION
	);

	wp_register_script(
		'tswrec4i84dx-slider',
		$base_url . 'assets/slider.js',
		array(),
		file_exists( $base_dir . 'assets/slider.js' ) ? (string) filemtime( $base_dir . 'assets/slider.js' ) : TSWREC4I84DX_VERSION,
		true
	);
}

function tswrec4i84dx_register_admin_page(): void {
	add_submenu_page(
		'edit.php?post_type=' . TSWREC4I84DX_POST_TYPE,
		__( 'Testimonial Slider', TSWREC4I84DX_SLUG ),
		__( 'Slider Shortcode', TSWREC4I84DX_SLUG ),
		'edit_posts',
		'tswrec4i84dx-slider',
		'tswrec4i84dx_render_admin_page'
	);
}

function tswrec4i84dx_render_admin_page(): void {
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', TSWREC4I84DX_SLUG ) );
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Testimonial Slider with Ratings', TSWREC4I84DX_SLUG ); ?></h1>
		<p><?php esc_html_e( 'Add testimonials from the Testimonials menu, then place this shortcode in any post, page, or widget:', TSWREC4I84DX_SLUG ); ?></p>
		<p><code>[testimonial_slider_with_ratings]</code></p>
		<h2><?php esc_html_e( 'Optional shortcode attributes', TSWREC4I84DX_SLUG ); ?></h2>
		<ul>
			<li><code>limit="10"</code> <?php esc_html_e( 'Number of testimonials to show, from 1 to 50.', TSWREC4I84DX_SLUG ); ?></li>
			<li><code>orderby="date"</code> <?php esc_html_e( 'Allowed values: date, title, menu_order, rand.', TSWREC4I84DX_SLUG ); ?></li>
			<li><code>order="DESC"</code> <?php esc_html_e( 'Allowed values: ASC or DESC.', TSWREC4I84DX_SLUG ); ?></li>
			<li><code>autoplay="true" interval="5000"</code> <?php esc_html_e( 'Enable automatic sliding and set the interval in milliseconds.', TSWREC4I84DX_SLUG ); ?></li>
			<li><code>ids="12,34"</code> <?php esc_html_e( 'Show only specific testimonial IDs.', TSWREC4I84DX_SLUG ); ?></li>
		</ul>
		<p><?php esc_html_e( 'Example:', TSWREC4I84DX_SLUG ); ?> <code>[testimonial_slider_with_ratings limit="5" orderby="menu_order" order="ASC"]</code></p>
	</div>
	<?php
}

function tswrec4i84dx_add_meta_boxes(): void {
	add_meta_box(
		'tswrec4i84dx_details',
		__( 'Reviewer Details', TSWREC4I84DX_SLUG ),
		'tswrec4i84dx_render_meta_box',
		TSWREC4I84DX_POST_TYPE,
		'normal',
		'high'
	);
}

function tswrec4i84dx_render_meta_box( WP_Post $post ): void {
	$reviewer = get_post_meta( $post->ID, '_tswrec4i84dx_reviewer', true );
	$company  = get_post_meta( $post->ID, '_tswrec4i84dx_company', true );
	$rating   = (int) get_post_meta( $post->ID, '_tswrec4i84dx_rating', true );
	$rating   = $rating >= 1 && $rating <= 5 ? $rating : 5;

	wp_nonce_field( 'tswrec4i84dx_save_meta', 'tswrec4i84dx_meta_nonce' );
	?>
	<p>
		<label for="tswrec4i84dx_reviewer"><strong><?php esc_html_e( 'Reviewer name', TSWREC4I84DX_SLUG ); ?></strong></label><br>
		<input type="text" class="widefat" id="tswrec4i84dx_reviewer" name="tswrec4i84dx_reviewer" value="<?php echo esc_attr( $reviewer ); ?>" maxlength="120">
	</p>
	<p>
		<label for="tswrec4i84dx_company"><strong><?php esc_html_e( 'Role or company', TSWREC4I84DX_SLUG ); ?></strong></label><br>
		<input type="text" class="widefat" id="tswrec4i84dx_company" name="tswrec4i84dx_company" value="<?php echo esc_attr( $company ); ?>" maxlength="160">
	</p>
	<p>
		<label for="tswrec4i84dx_rating"><strong><?php esc_html_e( 'Star rating', TSWREC4I84DX_SLUG ); ?></strong></label><br>
		<select id="tswrec4i84dx_rating" name="tswrec4i84dx_rating">
			<?php for ( $i = 5; $i >= 1; $i-- ) : ?>
				<option value="<?php echo esc_attr( (string) $i ); ?>" <?php selected( $rating, $i ); ?>><?php echo esc_html( sprintf( _n( '%d star', '%d stars', $i, TSWREC4I84DX_SLUG ), $i ) ); ?></option>
			<?php endfor; ?>
		</select>
	</p>
	<?php
}

function tswrec4i84dx_save_meta( int $post_id ): void {
	$nonce = isset( $_POST['tswrec4i84dx_meta_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['tswrec4i84dx_meta_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'tswrec4i84dx_save_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$reviewer = isset( $_POST['tswrec4i84dx_reviewer'] ) ? sanitize_text_field( wp_unslash( $_POST['tswrec4i84dx_reviewer'] ) ) : '';
	$company  = isset( $_POST['tswrec4i84dx_company'] ) ? sanitize_text_field( wp_unslash( $_POST['tswrec4i84dx_company'] ) ) : '';
	$rating   = isset( $_POST['tswrec4i84dx_rating'] ) ? absint( wp_unslash( $_POST['tswrec4i84dx_rating'] ) ) : 5;
	$rating   = min( 5, max( 1, $rating ) );

	tswrec4i84dx_update_or_delete_meta( $post_id, '_tswrec4i84dx_reviewer', $reviewer );
	tswrec4i84dx_update_or_delete_meta( $post_id, '_tswrec4i84dx_company', $company );
	update_post_meta( $post_id, '_tswrec4i84dx_rating', $rating );
}

function tswrec4i84dx_update_or_delete_meta( int $post_id, string $key, string $value ): void {
	if ( '' === $value ) {
		delete_post_meta( $post_id, $key );
		return;
	}
	update_post_meta( $post_id, $key, $value );
}

function tswrec4i84dx_columns( array $columns ): array {
	$new = array();
	foreach ( $columns as $key => $label ) {
		$new[ $key ] = $label;
		if ( 'title' === $key ) {
			$new['tswrec4i84dx_rating']   = __( 'Rating', TSWREC4I84DX_SLUG );
			$new['tswrec4i84dx_reviewer'] = __( 'Reviewer', TSWREC4I84DX_SLUG );
		}
	}
	return $new;
}

function tswrec4i84dx_column_content( string $column, int $post_id ): void {
	if ( 'tswrec4i84dx_rating' === $column ) {
		echo wp_kses_post( tswrec4i84dx_stars_html( (int) get_post_meta( $post_id, '_tswrec4i84dx_rating', true ) ) );
	}

	if ( 'tswrec4i84dx_reviewer' === $column ) {
		echo esc_html( (string) get_post_meta( $post_id, '_tswrec4i84dx_reviewer', true ) );
	}
}

function tswrec4i84dx_shortcode( array|string $atts = array() ): string {
	$atts = shortcode_atts(
		array(
			'limit'    => 10,
			'orderby'  => 'date',
			'order'    => 'DESC',
			'autoplay' => 'true',
			'interval' => 5000,
			'ids'      => '',
		),
		(array) $atts,
		'testimonial_slider_with_ratings'
	);

	$limit   = min( 50, max( 1, absint( $atts['limit'] ) ) );
	$orderby = in_array( $atts['orderby'], array( 'date', 'title', 'menu_order', 'rand' ), true ) ? $atts['orderby'] : 'date';
	$order   = 'ASC' === strtoupper( (string) $atts['order'] ) ? 'ASC' : 'DESC';
	$ids     = tswrec4i84dx_parse_ids( (string) $atts['ids'] );
	$autoplay = ! in_array( strtolower( (string) $atts['autoplay'] ), array( '0', 'false', 'no', 'off' ), true );
	$interval = $autoplay ? min( 60000, max( 1000, absint( $atts['interval'] ) ) ) : 0;

	$query_args = array(
		'post_type'              => TSWREC4I84DX_POST_TYPE,
		'post_status'            => 'publish',
		'posts_per_page'         => $limit,
		'orderby'                => $orderby,
		'order'                  => $order,
		'no_found_rows'          => true,
		'ignore_sticky_posts'    => true,
		'update_post_meta_cache' => true,
		'update_post_term_cache' => false,
	);

	if ( $ids ) {
		$query_args['post__in'] = $ids;
		$query_args['orderby']  = 'post__in';
	}

	$query = new WP_Query( $query_args );
	if ( ! $query->have_posts() ) {
		return current_user_can( 'edit_posts' ) ? '<p class="tswrec4i84dx-empty">' . esc_html__( 'No published testimonials found.', TSWREC4I84DX_SLUG ) . '</p>' : '';
	}

	wp_enqueue_style( 'tswrec4i84dx-slider' );
	wp_enqueue_script( 'tswrec4i84dx-slider' );

	static $instance = 0;
	$instance++;
	$slider_id = 'tswrec4i84dx-slider-' . $instance;
	$count     = (int) $query->post_count;

	ob_start();
	?>
	<section id="<?php echo esc_attr( $slider_id ); ?>" class="tswrec4i84dx-slider" data-interval="<?php echo esc_attr( (string) $interval ); ?>" aria-label="<?php esc_attr_e( 'Testimonials', TSWREC4I84DX_SLUG ); ?>">
		<div class="tswrec4i84dx-track">
			<?php
			$index = 0;
			while ( $query->have_posts() ) :
				$query->the_post();
				$post_id  = get_the_ID();
				$reviewer = (string) get_post_meta( $post_id, '_tswrec4i84dx_reviewer', true );
				$company  = (string) get_post_meta( $post_id, '_tswrec4i84dx_company', true );
				$rating   = (int) get_post_meta( $post_id, '_tswrec4i84dx_rating', true );
				?>
				<article class="tswrec4i84dx-slide<?php echo 0 === $index ? ' is-active' : ''; ?>" <?php echo 0 === $index ? '' : 'hidden'; ?> data-slide-index="<?php echo esc_attr( (string) $index ); ?>">
					<div class="tswrec4i84dx-stars-wrap"><?php echo wp_kses_post( tswrec4i84dx_stars_html( $rating ) ); ?></div>
					<div class="tswrec4i84dx-content"><?php echo wp_kses_post( wpautop( get_post_field( 'post_content', $post_id ) ) ); ?></div>
					<footer class="tswrec4i84dx-person">
						<?php if ( '' !== $reviewer ) : ?><strong><?php echo esc_html( $reviewer ); ?></strong><?php endif; ?>
						<?php if ( '' !== $company ) : ?><span><?php echo esc_html( $company ); ?></span><?php endif; ?>
					</footer>
				</article>
				<?php
				$index++;
			endwhile;
			wp_reset_postdata();
			?>
		</div>
		<?php if ( $count > 1 ) : ?>
			<div class="tswrec4i84dx-controls" aria-controls="<?php echo esc_attr( $slider_id ); ?>">
				<button type="button" class="tswrec4i84dx-prev" aria-label="<?php esc_attr_e( 'Previous testimonial', TSWREC4I84DX_SLUG ); ?>">‹</button>
				<div class="tswrec4i84dx-dots" aria-label="<?php esc_attr_e( 'Choose testimonial', TSWREC4I84DX_SLUG ); ?>">
					<?php for ( $i = 0; $i < $count; $i++ ) : ?>
						<button type="button" data-slide-to="<?php echo esc_attr( (string) $i ); ?>" <?php echo 0 === $i ? 'aria-current="true"' : ''; ?>>
							<span class="screen-reader-text"><?php echo esc_html( sprintf( __( 'Show testimonial %d', TSWREC4I84DX_SLUG ), $i + 1 ) ); ?></span>
						</button>
					<?php endfor; ?>
				</div>
				<button type="button" class="tswrec4i84dx-next" aria-label="<?php esc_attr_e( 'Next testimonial', TSWREC4I84DX_SLUG ); ?>">›</button>
			</div>
		<?php endif; ?>
	</section>
	<?php
	return (string) ob_get_clean();
}

function tswrec4i84dx_parse_ids( string $ids ): array {
	if ( '' === trim( $ids ) ) {
		return array();
	}

	$parsed = array_filter( array_map( 'absint', explode( ',', $ids ) ) );
	return array_values( array_unique( array_slice( $parsed, 0, 50 ) ) );
}

function tswrec4i84dx_stars_html( int $rating ): string {
	$rating = min( 5, max( 1, $rating ) );
	$label  = sprintf( _n( '%d star out of 5', '%d stars out of 5', $rating, TSWREC4I84DX_SLUG ), $rating );
	$html   = '<span class="tswrec4i84dx-stars" aria-label="' . esc_attr( $label ) . '">';

	for ( $i = 1; $i <= 5; $i++ ) {
		$html .= '<span aria-hidden="true" class="' . ( $i <= $rating ? 'is-filled' : 'is-empty' ) . '">★</span>';
	}

	$html .= '</span>';
	return $html;
}
