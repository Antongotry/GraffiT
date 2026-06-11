<?php
/**
 * Ultimate fallback — show themed 404 instead of the dev placeholder.
 *
 * @package graffit
 */

declare(strict_types=1);

global $wp_query;

$wp_query->set_404();
status_header(404);
nocache_headers();

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--not-found" aria-label="<?php esc_attr_e('Сторінку не знайдено', 'graffit'); ?>">
    <?php get_template_part('template-parts/sections/not', 'found'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
