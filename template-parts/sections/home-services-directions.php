<?php
/**
 * Front page: three service direction cards + matches services overview FiCSS layout.
 *
 * @package graffit
 */

declare(strict_types=1);

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
<section class="services-overview services-overview--home-directions" aria-labelledby="home-services-directions-title">
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
            <p class="services-overview__eyebrow-text">Послуги</p>
        </div>

        <h2 class="services-overview__title" id="home-services-directions-title">
            Ми працюємо у трьох напрямках:
        </h2>

        <div class="services-overview__grid">
            <?php foreach ($cards as $card) : ?>
                <?php get_template_part('template-parts/components/service', 'card', $card); ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
