<?php
/**
 * Static page template for /about/ output.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--about">
    <?php get_template_part('template-parts/sections/about', 'hero'); ?>
    <?php get_template_part('template-parts/sections/about', 'clients'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
