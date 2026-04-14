<?php
/**
 * Service card component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'title' => '',
        'copy' => [],
        'image_url' => '',
        'image_alt' => '',
        'image_position' => 'center',
        'button_label' => '',
        'button_url' => '#',
        'highlighted' => false,
        'layout' => 'default',
    ]
);

$card_classes = ['service-card'];

if (! empty($args['highlighted'])) {
    $card_classes[] = 'is-active';
}

if (($args['layout'] ?? 'default') === 'low') {
    $card_classes[] = 'service-card--low-copy';
}

$style_tokens = [];

if (! empty($args['image_position'])) {
    $style_tokens[] = '--service-card-image-position: ' . esc_attr((string) $args['image_position']);
}
?>
<article class="<?php echo esc_attr(implode(' ', $card_classes)); ?>">
    <div class="service-card__media">
        <?php if (! empty($args['image_url'])) : ?>
            <img
                class="service-card__image"
                src="<?php echo esc_url((string) $args['image_url']); ?>"
                alt="<?php echo esc_attr((string) $args['image_alt']); ?>"
                loading="lazy"
                decoding="async"
                style="<?php echo esc_attr(implode('; ', $style_tokens)); ?>"
            >
        <?php endif; ?>
    </div>

    <div class="service-card__content">
        <h3 class="service-card__title"><?php echo esc_html((string) $args['title']); ?></h3>

        <?php if (! empty((array) $args['copy'])) : ?>
            <div class="service-card__copy">
                <?php foreach ((array) $args['copy'] as $paragraph) : ?>
                    <p><?php echo esc_html((string) $paragraph); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <?php if (! empty($args['button_label']) && ($args['layout'] ?? 'default') !== 'low') : ?>
        <a class="service-card__cta" href="<?php echo esc_url((string) $args['button_url']); ?>">
            <?php echo esc_html((string) $args['button_label']); ?>
        </a>
    <?php endif; ?>
</article>
