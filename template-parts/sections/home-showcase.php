<?php
/**
 * Front page showcase cover section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_showcase_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-1707480430_result-scaled.webp?v=home-showcase-1';
?>
<section class="home-showcase js-home-showcase" aria-label="<?php esc_attr_e('Вітрина GraffiT', 'graffit'); ?>">
    <div class="home-showcase__media js-home-showcase-media" aria-hidden="true">
        <img
            class="home-showcase__image"
            src="<?php echo esc_url($home_showcase_image); ?>"
            alt=""
            width="1440"
            height="1024"
            loading="eager"
            decoding="async"
        >
    </div>
</section>
