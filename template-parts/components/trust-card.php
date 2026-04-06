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
        'icon' => 'insight',
    ]
);

$render_icon = static function (string $icon_name): void {
    switch ($icon_name) {
        case 'focus':
            ?>
            <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                <path d="M4 9V4h5v2H6v3H4Zm12-5h6v6h-2V6h-4V4ZM4 17h2v3h3v2H4v-5Zm16 0h2v5h-5v-2h3v-3ZM9 9h8v8H9V9Zm2 2v4h4v-4h-4Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'market':
            ?>
            <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                <path d="M4 20V7.5L9 4l4 3 4-3 5 3.5V20H4Zm2-2h14V8.5l-3-2.1-4 3-4-3-3 2.1V18Zm3-3h2v-4H9v4Zm4 0h2v-6h-2v6Zm4 0h2v-2h-2v2Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'scale':
            ?>
            <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                <path d="M4 20v-2h18v2H4Zm4-4V8h2v8H8Zm4 0V4h2v12h-2Zm4 0v-6h2v6h-2Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'partnership':
            ?>
            <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                <path d="M8.3 15.7 5 12.4l1.4-1.4 1.9 1.9 3.3-3.3 1.4 1.4-4.7 4.7Zm4.8-.7c1.4 0 2.6-1.2 2.6-2.6S14.5 9.8 13 9.8s-2.6 1.2-2.6 2.6S11.6 15 13 15Zm0 2c-2.5 0-7 1.3-7 4v1h14v-1c0-2.7-4.5-4-7-4Z" fill="currentColor"/>
            </svg>
            <?php
            break;

        case 'insight':
        default:
            ?>
            <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                <path d="M13 3c4.9 0 8.9 4 8.9 8.9 0 3.7-2.2 6.9-5.3 8.2V23H9.4v-2.9A8.9 8.9 0 0 1 13 3Zm0 3.1a5.8 5.8 0 0 0-5.8 5.8c0 2 1 3.8 2.5 4.8l.7.5V20h5.2v-2.8l.7-.5a5.8 5.8 0 0 0-3.3-10.6Zm-.8 2.4h1.6v4.2h-1.6V8.5Zm0 5.3h1.6v1.6h-1.6v-1.6Z" fill="currentColor"/>
            </svg>
            <?php
            break;
    }
};
?>
<article class="trust-card">
    <div class="trust-card__ribbon" aria-hidden="true">
        <span class="trust-card__icon">
            <?php $render_icon((string) $args['icon']); ?>
        </span>
    </div>

    <div class="trust-card__content">
        <h3 class="trust-card__title"><?php echo esc_html((string) $args['title']); ?></h3>
        <p class="trust-card__text"><?php echo esc_html((string) $args['text']); ?></p>
    </div>
</article>
