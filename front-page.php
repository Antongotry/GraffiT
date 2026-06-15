<?php
/**
 * Front page template.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_film_upload_base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/';
$home_film_video_p1    = $home_film_upload_base . rawurlencode('Відео-1-2-екран.mp4');
$home_film_video_p2    = $home_film_upload_base . rawurlencode('Відео-2-3-екран.mp4');
$home_film_poster      = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/05/ezgif-frame-001_result.webp';

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--home" aria-label="<?php esc_attr_e('Front page', 'graffit'); ?>">
    <div
        class="home-scroll-film js-home-scroll-film"
        data-film-video-p1="<?php echo esc_url($home_film_video_p1); ?>"
        data-film-video-p2="<?php echo esc_url($home_film_video_p2); ?>"
        data-film-poster="<?php echo esc_url($home_film_poster); ?>"
    >
        <canvas class="home-scroll-film__canvas js-home-scroll-film-canvas" aria-hidden="true"></canvas>
        <video
            class="home-scroll-film__video js-home-scroll-film-video-p1"
            src="<?php echo esc_url($home_film_video_p1); ?>"
            muted
            playsinline
            preload="auto"
            aria-hidden="true"
        ></video>
        <video
            class="home-scroll-film__video js-home-scroll-film-video-p2"
            src="<?php echo esc_url($home_film_video_p2); ?>"
            muted
            playsinline
            preload="auto"
            aria-hidden="true"
        ></video>
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
    <?php
    get_template_part(
        'template-parts/sections/services',
        'process',
        [
            'process_visual_image' => graffit_home_process_image_url(),
            'process_visual_image_mobile' => graffit_home_process_image_mobile_url(),
        ]
    );
    ?>
    <?php get_template_part('template-parts/sections/home', 'faq'); ?>
    <?php get_template_part('template-parts/sections/services', 'final-cta'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
