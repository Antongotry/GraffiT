<?php
/**
 * CTA band component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'classes' => [],
        'title' => '',
        'text' => '',
        'button_label' => '',
        'button_url' => '#',
        'theme' => 'light',
        'pattern_url' => '',
    ]
);

$class_names = ['cta-band'];

if (($args['theme'] ?? 'light') === 'light') {
    $class_names[] = 'cta-band--light';
}

foreach ((array) $args['classes'] as $class_name) {
    if (is_string($class_name) && $class_name !== '') {
        $class_names[] = $class_name;
    }
}

$style_tokens = [];

if (! empty($args['pattern_url'])) {
    $style_tokens[] = '--cta-band-pattern: url("' . esc_url_raw((string) $args['pattern_url']) . '")';
}
?>
<section
    class="<?php echo esc_attr(implode(' ', $class_names)); ?>"
    style="<?php echo esc_attr(implode('; ', $style_tokens)); ?>"
>
    <div class="cta-band__container">
        <div class="cta-band__layout">
            <h2 class="cta-band__title"><?php echo esc_html((string) $args['title']); ?></h2>

            <div class="cta-band__content">
                <p class="cta-band__text"><?php echo esc_html((string) $args['text']); ?></p>

                <?php if (! empty($args['button_label'])) : ?>
                    <a class="cta-band__button" href="<?php echo esc_url((string) $args['button_url']); ?>">
                        <?php echo esc_html((string) $args['button_label']); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
