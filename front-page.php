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
    <div class="home-scroll-film js-home-scroll-film">
        <canvas class="home-scroll-film__canvas js-home-scroll-film-canvas" aria-hidden="true"></canvas>
        <?php get_template_part('template-parts/sections/home', 'hero'); ?>
        <?php get_template_part('template-parts/sections/home', 'showcase'); ?>
        <?php get_template_part('template-parts/sections/home', 'chaos'); ?>
    </div>
    <div class="home-chaos-about-flow">
        <div class="home-chaos-about-flow__spheres" aria-hidden="true"></div>
        <?php get_template_part('template-parts/sections/home', 'about'); ?>
    </div>
    <div class="home-hex-projects-flow">
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
        <?php get_template_part('template-parts/sections/services', 'projects'); ?>
    </div>
    <?php get_template_part('template-parts/sections/services', 'process'); ?>
    <?php get_template_part('template-parts/sections/home', 'faq'); ?>
    <?php get_template_part('template-parts/sections/services', 'final-cta'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
