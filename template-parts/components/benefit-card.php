<?php
/**
 * Services benefit card component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'number' => '01',
        'title' => '',
        'text' => '',
        'icon' => 'system',
        'classes' => [],
        'active' => false,
    ]
);

$class_names = ['benefit-card'];

if (! empty($args['active'])) {
    $class_names[] = 'is-active';
}

foreach ((array) $args['classes'] as $class_name) {
    if (is_string($class_name) && $class_name !== '') {
        $class_names[] = $class_name;
    }
}

$step_number = (int) preg_replace('/\D+/', '', (string) $args['number']);
$step_number = $step_number > 0 ? min($step_number, 6) : 1;

$marker_inactive_url = sprintf('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/%d.svg', $step_number);
$marker_active_url   = sprintf('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/%02d-a.svg', $step_number);
$icon_url            = sprintf('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/i%d.svg', $step_number);
?>
<article class="<?php echo esc_attr(implode(' ', $class_names)); ?>">
    <div class="benefit-card__marker">
        <img
            class="benefit-card__marker-image benefit-card__marker-image--inactive"
            src="<?php echo esc_url($marker_inactive_url); ?>"
            alt=""
            width="42"
            height="48"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
        >
        <img
            class="benefit-card__marker-image benefit-card__marker-image--active"
            src="<?php echo esc_url($marker_active_url); ?>"
            alt=""
            width="42"
            height="48"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
        >
    </div>

    <div class="benefit-card__body">
        <div class="benefit-card__icon" aria-hidden="true">
            <img
                class="benefit-card__icon-image"
                src="<?php echo esc_url($icon_url); ?>"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
            >
        </div>

        <h3 class="benefit-card__title"><?php echo esc_html((string) $args['title']); ?></h3>
        <span class="benefit-card__divider" aria-hidden="true"></span>
        <p class="benefit-card__text"><?php echo esc_html((string) $args['text']); ?></p>
    </div>
</article>
