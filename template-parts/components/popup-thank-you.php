<?php
/**
 * Popup thank you component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'title_id' => 'site-popup-success-title',
    ]
);
?>
<div class="thank-you-popup">
    <div class="thank-you-popup__mark" aria-hidden="true">
        <svg viewBox="0 0 72 72" focusable="false" aria-hidden="true">
            <circle cx="36" cy="36" r="35" fill="none" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"/>
            <path d="M22.5 37.8 31.4 46.7 49.8 28.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
        </svg>
    </div>

    <p class="thank-you-popup__eyebrow">Дякуємо</p>

    <h2 class="thank-you-popup__title" id="<?php echo esc_attr((string) $args['title_id']); ?>">
        Заявку успішно відправлено
    </h2>

    <p class="thank-you-popup__text">
        Ми вже отримали ваш запит і звʼяжемося з вами найближчим робочим часом, щоб уточнити деталі та запропонувати доречний наступний крок.
    </p>

    <div class="thank-you-popup__actions">
        <button class="thank-you-popup__button" type="button" data-popup-close>Повернутися на сайт</button>
    </div>
</div>
