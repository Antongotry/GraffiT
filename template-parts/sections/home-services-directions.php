<?php
/**
 * Front page (default) and About page (optional copy): three service direction cards.
 *
 * Optional `get_template_part` args:
 * - `eyebrow_text` (string)
 * - `title_id` (string)
 * - `title_lines` (string[]) — if non-empty, multi-line title; else `title_text` or default
 * - `title_text` (string) — single-line title when `title_lines` empty
 *
 * @package graffit
 */

declare(strict_types=1);

$directions_eyebrow_text = isset($eyebrow_text) && is_string($eyebrow_text) && $eyebrow_text !== ''
    ? $eyebrow_text
    : 'Послуги';
$directions_title_id = isset($title_id) && is_string($title_id) && $title_id !== ''
    ? $title_id
    : 'home-services-directions-title';
$directions_title_lines = [];

if (isset($title_lines) && is_array($title_lines)) {
    foreach ($title_lines as $line) {
        if (is_string($line) && $line !== '') {
            $directions_title_lines[] = $line;
        }
    }
}

$directions_title_text = isset($title_text) && is_string($title_text) && $title_text !== ''
    ? $title_text
    : 'Ми працюємо у трьох напрямках:';

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$uploads_base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/';
$services_url = home_url('/services/');

$cards = [
    [
        'title' => 'Розробка індивідуальних IT-рішень під ключ',
        'copy' => [],
        'image_url' => $uploads_base . '1asd_result.webp',
        'image_alt' => 'Розробка індивідуальних IT-рішень',
        'image_position' => 'center',
        'button_label' => 'Детальніше',
        'button_url' => $services_url,
        'highlighted' => false,
        'layout' => 'default',
    ],
    [
        'title' => 'Готові IT-продукти для рітейлу, логістики та продажів',
        'copy' => [],
        'image_url' => $uploads_base . '2asd_result.webp',
        'image_alt' => 'Готові IT-продукти для бізнесу',
        'image_position' => 'center',
        'button_label' => 'Детальніше',
        'button_url' => $services_url,
        'highlighted' => false,
        'layout' => 'default',
    ],
    [
        'title' => 'Консалтинг: підтримка, розвиток',
        'copy' => [],
        'image_url' => $uploads_base . '3asd_result.webp',
        'image_alt' => 'IT-консалтинг',
        'image_position' => 'center',
        'button_label' => 'Детальніше',
        'button_url' => $services_url,
        'highlighted' => false,
        'layout' => 'default',
    ],
];
?>
<section class="services-overview services-overview--home-directions" aria-labelledby="<?php echo esc_attr($directions_title_id); ?>">
    <div class="services-overview__container">
        <div class="services-overview__eyebrow">
            <img
                class="services-overview__eyebrow-icon"
                src="<?php echo esc_url($logo_mark_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="services-overview__eyebrow-text"><?php echo esc_html($directions_eyebrow_text); ?></p>
        </div>

        <h2 class="services-overview__title" id="<?php echo esc_attr($directions_title_id); ?>">
            <?php if ($directions_title_lines !== []) : ?>
                <?php foreach ($directions_title_lines as $line) : ?>
                    <span class="services-overview__title-line"><?php echo esc_html($line); ?></span>
                <?php endforeach; ?>
            <?php else : ?>
                <?php echo esc_html($directions_title_text); ?>
            <?php endif; ?>
        </h2>

        <div class="services-overview__grid">
            <?php foreach ($cards as $card) : ?>
                <?php get_template_part('template-parts/components/service', 'card', $card); ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
