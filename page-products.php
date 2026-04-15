<?php
/**
 * Static page template for /products/ output.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--products">
    <?php get_template_part('template-parts/sections/products', 'hero'); ?>
    <?php get_template_part('template-parts/sections/products', 'benefits'); ?>
    <?php get_template_part('template-parts/sections/products', 'catalog'); ?>
    <?php get_template_part('template-parts/sections/products', 'inquiry'); ?>
    <?php get_template_part('template-parts/sections/products', 'process'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
