<?php
/**
 * Static page template for /product-mediahub/ output.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--product-mediahub">
    <?php get_template_part('template-parts/sections/product-mediahub', 'hero'); ?>
    <?php get_template_part('template-parts/sections/product-mediahub', 'audience'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
