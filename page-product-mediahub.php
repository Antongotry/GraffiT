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
    <?php get_template_part('template-parts/sections/product-mediahub', 'results'); ?>
    <?php get_template_part('template-parts/sections/product-mediahub', 'capabilities'); ?>
    <?php get_template_part('template-parts/sections/product-mediahub', 'process'); ?>
    <?php
    get_template_part(
        'template-parts/sections/services',
        'clients',
        [
            'section_extra_class' => 'mediahub-about',
            'section_id' => 'mediahub-clients',
            'enable_scroller' => false,
            'section_js_class' => 'js-mediahub-clients-motion',
        ]
    );
    ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
