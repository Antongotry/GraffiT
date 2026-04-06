<?php
/**
 * Static page template for /services/ output.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--services">
    <?php get_template_part('template-parts/sections/services', 'hero'); ?>
    <?php get_template_part('template-parts/sections/services', 'overview'); ?>
    <?php get_template_part('template-parts/sections/services', 'inquiry'); ?>
    <?php get_template_part('template-parts/sections/services', 'reasons'); ?>
    <?php get_template_part('template-parts/sections/services', 'benefits'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
