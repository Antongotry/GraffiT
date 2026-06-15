<?php
/**
 * Front page showcase cover section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_showcase_background = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-1707480432_result-scaled.webp?v=home-showcase-bg-4';
$home_showcase_figure = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8707_result.webp?v=home-showcase-figure-1';
?>
<section class="home-showcase js-home-showcase" aria-label="<?php esc_attr_e('Вітрина GraffiT', 'graffit'); ?>">
    <div class="home-showcase__media js-home-showcase-media" aria-hidden="true">
        <img
            class="home-showcase__image"
            src="<?php echo esc_url($home_showcase_background); ?>"
            alt=""
            width="2560"
            height="1691"
            loading="eager"
            decoding="async"
        >
    </div>
    <div class="home-showcase__inner">
        <div class="home-showcase__figure" aria-hidden="true">
            <img
                class="home-showcase__figure-image"
                src="<?php echo esc_url($home_showcase_figure); ?>"
                alt=""
                width="2401"
                height="1198"
                loading="eager"
                decoding="async"
            >
        </div>
    </div>
</section>
