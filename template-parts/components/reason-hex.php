<?php
/**
 * Reason hex component.
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
        'size' => 'small',
        'stack' => [],
        'stack_caption' => '',
    ]
);

$class_names = ['reason-hex', 'reason-hex--' . sanitize_html_class((string) $args['size'])];

foreach ((array) $args['classes'] as $class_name) {
    if (is_string($class_name) && $class_name !== '') {
        $class_names[] = $class_name;
    }
}
?>
<article class="<?php echo esc_attr(implode(' ', $class_names)); ?>">
    <div class="reason-hex__inner">
        <h3 class="reason-hex__title"><?php echo esc_html((string) $args['title']); ?></h3>

        <?php if (! empty($args['stack'])) : ?>
            <div class="reason-hex__stack" aria-label="Technology stack">
                <?php foreach ((array) $args['stack'] as $stack_item) : ?>
                    <span class="reason-hex__stack-item"><?php echo esc_html((string) $stack_item); ?></span>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if (! empty($args['text'])) : ?>
            <p class="reason-hex__text"><?php echo esc_html((string) $args['text']); ?></p>
        <?php endif; ?>

        <?php if (! empty($args['stack_caption'])) : ?>
            <p class="reason-hex__caption"><?php echo esc_html((string) $args['stack_caption']); ?></p>
        <?php endif; ?>
    </div>
</article>
