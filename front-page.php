<?php
/**
 * Front page template.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--home" aria-label="<?php esc_attr_e('Front page', 'graffit'); ?>">
    <?php get_template_part('template-parts/sections/home', 'hero'); ?>
    <?php get_template_part('template-parts/sections/home', 'showcase'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
