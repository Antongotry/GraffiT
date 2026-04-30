<?php
/**
 * Process step component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'number' => '1',
        'tag_prefix' => 'Етап',
        'title' => '',
        'text' => '',
        'result' => '',
        'active' => false,
    ]
);

$class_names = ['process-step', 'js-process-step'];

if (! empty($args['active'])) {
    $class_names[] = 'is-active';
}
?>
<article class="<?php echo esc_attr(implode(' ', $class_names)); ?>">
    <div class="process-step__tag">
        <span class="process-step__tag-text"><?php echo esc_html((string) $args['tag_prefix']); ?> <?php echo esc_html((string) $args['number']); ?></span>
    </div>

    <div class="process-step__content">
        <?php if ((string) $args['title'] !== '') : ?>
            <h3 class="process-step__title"><?php echo esc_html((string) $args['title']); ?></h3>
        <?php endif; ?>
        <?php if ((string) $args['text'] !== '') : ?>
            <p class="process-step__text"><?php echo esc_html((string) $args['text']); ?></p>
        <?php endif; ?>
        <?php if ((string) $args['result'] !== '') : ?>
            <div class="process-step__result">
                <p class="process-step__result-text"><?php echo esc_html((string) $args['result']); ?></p>
            </div>
        <?php endif; ?>
    </div>
</article>
