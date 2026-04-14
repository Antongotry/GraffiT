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
    <?php get_template_part('template-parts/sections/home', 'chaos'); ?>
    <?php get_template_part('template-parts/sections/home', 'about'); ?>
    <?php
    get_template_part(
        'template-parts/sections/services-reasons-hex',
        null,
        [
            'section_extra_class' => 'hex-reasons--home',
            'eyebrow_text' => 'Переваги',
            'title_id' => 'home-hex-reasons-title',
            'title_class_extra' => 'hex-reasons__title--home',
            'custom_title_lines' => [
                'Що це означає',
                'для вас?',
            ],
        ]
    );
    ?>
    <?php get_template_part('template-parts/sections/home-services-directions'); ?>
    <?php get_template_part('template-parts/sections/home-inquiry'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
