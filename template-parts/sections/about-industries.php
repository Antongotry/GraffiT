<?php
/**
 * About page: industries / verticals where solutions apply (FiCSS layout → BEM).
 *
 * @package graffit
 */

declare(strict_types=1);

$uploads_base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/';

$columns = [
    [
        'label' => 'Рітейлі',
        'image' => $uploads_base . '1q_result.webp',
        'alt' => 'Рітейл',
    ],
    [
        'label' => 'E-commerce',
        'image' => $uploads_base . '2q_result.webp',
        'alt' => 'E-commerce',
    ],
    [
        'label' => 'Логістиці',
        'image' => $uploads_base . '3q_result.webp',
        'alt' => 'Логістика',
    ],
    [
        'label' => 'Сервісних бізнесах',
        'image' => $uploads_base . '4q_result.webp',
        'alt' => 'Сервісний бізнес',
    ],
    [
        'label' => 'Виробничих бізнесах',
        'image' => $uploads_base . '5q_result.webp',
        'alt' => 'Виробничий бізнес',
    ],
];
?>
<section class="about-industries" aria-labelledby="about-industries-title">
    <div class="about-industries__container">
        <header class="about-industries__header">
            <h2 class="about-industries__title" id="about-industries-title">
                Наші рішення підходять для компаній у
            </h2>
            <p class="about-industries__lead">
                Ми не просто кодимо — ми оптимізуємо, автоматизуємо і виводимо процеси з “ручного режиму” в керовану систему в компаніях будь-якого масштабу — від стартапів до корпорацій.
            </p>
        </header>

        <div class="about-industries__divider" aria-hidden="true"></div>

        <div class="about-industries__grid" role="list">
            <?php foreach ($columns as $column) : ?>
                <div class="about-industries__cell" role="listitem">
                    <div class="about-industries__cell-rule" aria-hidden="true"></div>
                    <img
                        class="about-industries__flag"
                        src="<?php echo esc_url($column['image']); ?>"
                        alt=""
                        width="64"
                        height="90"
                        loading="lazy"
                        decoding="async"
                    >
                    <h3 class="about-industries__label"><?php echo esc_html($column['label']); ?></h3>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
