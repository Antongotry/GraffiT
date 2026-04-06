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

$icon = is_string($args['icon']) ? $args['icon'] : 'system';

$render_icon = static function (string $icon_name): void {
    switch ($icon_name) {
        case 'architecture':
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 8h4V4h2v6H4V8Zm10 0h6v2h-4v4h-2V8ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'visibility':
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M10.9 18.8a8.5 8.5 0 0 1-6.6-6.8A8.6 8.6 0 0 1 12 4.2a8.6 8.6 0 0 1 7.8 7.8h-2A6.6 6.6 0 0 0 12 6.2a6.6 6.6 0 0 0-5.7 5.8 6.5 6.5 0 0 0 5 5.1l-.4 1.7Zm7 4.2-4.1-4.1a6.3 6.3 0 0 1-2.8.6 6.4 6.4 0 1 1 6.4-6.4c0 1-.2 1.9-.6 2.8L19 21.6 17.9 23ZM11 17.5a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'efficiency':
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 12h4v8H4v-8Zm6-6h4v14h-4V6Zm6-4h4v18h-4V2Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'support':
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 4h9a4 4 0 0 1 4 4v4h-2V8a2 2 0 0 0-2-2H5v12h5v2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'integration':
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 3h5v5H8V6H6v2H3V3h2Zm11 0h5v5h-3V6h-2v2h-3V3h3Zm-8 8h8v2h-3v3h-2v-3H8v-2Zm-5 5h3v2h2v3H3v-5Zm15 2h-2v-2h5v5h-5v-3h2v-2Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'system':
        default:
            ?>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 4h14l1 4H4l1-4Zm-1 6h16v4H4v-4Zm1 6h14l1 4H4l1-4Z" fill="currentColor"/>
            </svg>
            <?php
            break;
    }
};
?>
<article class="<?php echo esc_attr(implode(' ', $class_names)); ?>">
    <div class="benefit-card__marker">
        <span class="benefit-card__marker-shape" aria-hidden="true"></span>
        <span class="benefit-card__number"><?php echo esc_html((string) $args['number']); ?></span>
    </div>

    <div class="benefit-card__body">
        <div class="benefit-card__icon" aria-hidden="true">
            <?php $render_icon($icon); ?>
        </div>

        <h3 class="benefit-card__title"><?php echo esc_html((string) $args['title']); ?></h3>
        <span class="benefit-card__divider" aria-hidden="true"></span>
        <p class="benefit-card__text"><?php echo esc_html((string) $args['text']); ?></p>
    </div>
</article>
