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
    <div class="about-dark-flow">
        <?php get_template_part('template-parts/sections/about', 'stack'); ?>
        <?php get_template_part('template-parts/sections/about', 'story'); ?>
        <?php get_template_part('template-parts/sections/about', 'industries'); ?>
        <?php
        get_template_part(
            'template-parts/sections/home-services-directions',
            null,
            [
                'eyebrow_text' => 'Напрямки роботи',
                'title_id' => 'about-services-directions-title',
                'title_lines' => [
                    'Проєктуємо рішення, що працюють у реальному навантаженні',
                    'та витримують темп бізнесу',
                ],
            ]
        );
        ?>
    </div>
    <?php
    get_template_part(
        'template-parts/sections/home-inquiry',
        null,
        [
            'button_source' => 'about-inquiry',
            'button_source_label' => 'Про нас · CTA-блок · Залишити заявку',
        ]
    );
    ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
