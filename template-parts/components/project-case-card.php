<?php
/**
 * Project case card component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'title' => '',
        'product' => '',
        'results' => [],
        'detail_href' => '#',
        'media_class' => '',
    ]
);

$card_classes = ['project-case-card'];

if (is_string($args['media_class']) && $args['media_class'] !== '') {
    $card_classes[] = sanitize_html_class($args['media_class']);
}
?>
<article class="<?php echo esc_attr(implode(' ', $card_classes)); ?>">
    <div class="project-case-card__content">
        <h3 class="project-case-card__title"><?php echo esc_html((string) $args['title']); ?></h3>

        <div class="project-case-card__product">
            <p class="project-case-card__label">Програмний продукт:</p>
            <p class="project-case-card__value"><?php echo esc_html((string) $args['product']); ?></p>
        </div>

        <div class="project-case-card__result-box">
            <p class="project-case-card__label project-case-card__label--muted">Результат:</p>
            <ul class="project-case-card__result-list">
                <?php foreach ((array) $args['results'] as $result_item) : ?>
                    <li class="project-case-card__result-item"><?php echo esc_html((string) $result_item); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <a class="project-case-card__link" href="<?php echo esc_url((string) $args['detail_href']); ?>">
            Детальніше про кейс
        </a>
    </div>

    <div class="project-case-card__media" aria-hidden="true">
        <span class="project-case-card__media-overlay"></span>
    </div>
</article>
