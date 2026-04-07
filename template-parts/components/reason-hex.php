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
        'variant' => 'muted',
        'image_url' => '',
        'image_alt' => '',
        'image_position' => 'center',
        'decorative' => false,
        'aria_label' => '',
    ]
);

$class_names = ['reason-hex', 'reason-hex--' . sanitize_html_class((string) $args['size'])];

if (is_string($args['variant']) && $args['variant'] !== '') {
    $class_names[] = 'reason-hex--' . sanitize_html_class($args['variant']);
}

foreach ((array) $args['classes'] as $class_name) {
    if (is_string($class_name) && $class_name !== '') {
        $class_names[] = $class_name;
    }
}

$has_image = is_string($args['image_url']) && $args['image_url'] !== '';
$tag_name  = ! empty($args['decorative']) ? 'div' : 'article';
$attributes = [
    'class' => implode(' ', $class_names),
];

if (! empty($args['decorative'])) {
    $attributes['aria-hidden'] = 'true';
} elseif (is_string($args['aria_label']) && $args['aria_label'] !== '') {
    $attributes['aria-label'] = $args['aria_label'];
}
?>
<<?php echo esc_html($tag_name); ?>
<?php foreach ($attributes as $attribute_name => $attribute_value) : ?>
    <?php echo ' ' . esc_html($attribute_name) . '="' . esc_attr((string) $attribute_value) . '"'; ?>
<?php endforeach; ?>
>
    <?php if ($has_image) : ?>
        <div class="reason-hex__media">
            <img
                class="reason-hex__image"
                src="<?php echo esc_url((string) $args['image_url']); ?>"
                alt="<?php echo esc_attr(! empty($args['decorative']) ? '' : (string) $args['image_alt']); ?>"
                loading="lazy"
                decoding="async"
                style="--reason-hex-image-position: <?php echo esc_attr((string) $args['image_position']); ?>"
            >
        </div>
    <?php else : ?>
        <div class="reason-hex__inner">
            <h3 class="reason-hex__title"><?php echo esc_html((string) $args['title']); ?></h3>

            <?php if (! empty($args['stack'])) : ?>
                <div class="reason-hex__stack" aria-label="Technology stack">
                    <?php foreach ((array) $args['stack'] as $stack_item) : ?>
                        <?php
                        $stack_classes = ['reason-hex__stack-item'];
                        $stack_label = '';
                        $stack_short = '';
                        $stack_image_url = '';

                        if (is_array($stack_item)) {
                            $stack_label = isset($stack_item['label']) ? (string) $stack_item['label'] : '';
                            $stack_short = isset($stack_item['short']) ? (string) $stack_item['short'] : $stack_label;
                            $stack_image_url = isset($stack_item['image_url']) ? (string) $stack_item['image_url'] : '';

                            if (isset($stack_item['class']) && is_string($stack_item['class']) && $stack_item['class'] !== '') {
                                $stack_classes[] = sanitize_html_class($stack_item['class']);
                            }
                        } else {
                            $stack_label = (string) $stack_item;
                            $stack_short = $stack_label;
                        }
                        ?>
                        <span
                            class="<?php echo esc_attr(implode(' ', $stack_classes)); ?>"
                            aria-label="<?php echo esc_attr($stack_label); ?>"
                            title="<?php echo esc_attr($stack_label); ?>"
                        >
                            <?php if ($stack_image_url !== '') : ?>
                                <img
                                    class="reason-hex__stack-icon"
                                    src="<?php echo esc_url($stack_image_url); ?>"
                                    alt=""
                                    width="32"
                                    height="32"
                                    loading="lazy"
                                    decoding="async"
                                >
                            <?php else : ?>
                                <?php echo esc_html($stack_short); ?>
                            <?php endif; ?>
                        </span>
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
    <?php endif; ?>
</<?php echo esc_html($tag_name); ?>>
