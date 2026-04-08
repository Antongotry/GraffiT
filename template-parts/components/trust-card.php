<?php
/**
 * Trust card component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'title' => '',
        'text' => '',
        'badge_icon_url' => '',
    ]
);
?>
<article class="trust-card">
    <div class="trust-card__ribbon" aria-hidden="true">
        <span class="trust-card__icon">
            <img
                class="trust-card__icon-image"
                src="<?php echo esc_url((string) $args['badge_icon_url']); ?>"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
            >
        </span>
    </div>

    <div class="trust-card__content">
        <h3 class="trust-card__title"><?php echo esc_html((string) $args['title']); ?></h3>
        <p class="trust-card__text"><?php echo esc_html((string) $args['text']); ?></p>
    </div>
</article>
