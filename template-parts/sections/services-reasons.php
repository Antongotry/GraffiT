<?php
/**
 * Services reasons section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$uploads_base_url = trailingslashit((string) wp_get_upload_dir()['baseurl']) . '2026/04/';
$reasons_top_polygon_url = $uploads_base_url . 'Polygon-9_result.webp';
$reasons_bottom_polygon_url = $uploads_base_url . 'Polygon-10_result.webp';

$reason_items = [
    [
        'classes' => ['reason-hex--card-primary'],
        'title' => 'Ми не нав’язуємо готову “коробку”',
        'text' => 'створюємо рішення під ваші задачі',
        'size' => 'small',
        'variant' => 'active',
    ],
    [
        'classes' => ['reason-hex--card-stack'],
        'title' => 'Працюємо в стеку, який сумісний з вимогами enterprise:',
        'stack' => [
            ['label' => 'Java', 'image_url' => $uploads_base_url . 'icon-1_result.webp'],
            ['label' => 'Kotlin', 'image_url' => $uploads_base_url . 'icon-2_result.webp'],
            ['label' => 'PostgreSQL', 'image_url' => $uploads_base_url . 'icon-3_result.webp'],
            ['label' => 'Angular', 'image_url' => $uploads_base_url . 'icon-4_result.webp'],
            ['label' => 'Kafka', 'image_url' => $uploads_base_url . 'icon-5_result.webp'],
            ['label' => 'Docker', 'image_url' => $uploads_base_url . 'icon-6_result.webp'],
        ],
        'stack_caption' => 'Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--photo-large'],
        'size' => 'photo-large',
        'variant' => 'image',
        'image_url' => $reasons_top_polygon_url,
        'image_alt' => 'Команда GraffiT за роботою',
        'image_position' => '56% center',
        'decorative' => true,
    ],
    [
        'classes' => ['reason-hex--card-cases'],
        'title' => 'Допомагаємо в складних кейсах,',
        'text' => 'де інші кажуть “так не робиться”',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--card-landscape'],
        'title' => 'Інтегруємось у вже існуючий ландшафт',
        'text' => '(1С, CRM, ERP, маркетплейси, POS тощо)',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--card-docs'],
        'title' => 'Даємо чітку документацію,',
        'text' => 'підтримку після запуску і прозору комунікацію',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--photo-small'],
        'size' => 'photo-small',
        'variant' => 'image',
        'image_url' => $reasons_bottom_polygon_url,
        'image_alt' => 'Фахівці GraffiT на зустрічі',
        'image_position' => '64% center',
        'decorative' => true,
    ],
];
?>
<section class="services-reasons" aria-labelledby="services-reasons-title">
    <div class="services-reasons__container">
        <div class="services-reasons__eyebrow">
            <img
                class="services-reasons__eyebrow-icon"
                src="<?php echo esc_url($logo_mark_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="services-reasons__eyebrow-text">Чому ми</p>
        </div>

        <h2 class="services-reasons__summary" id="services-reasons-title">
            Ми не просто кодимо — ми глибоко занурюємось у бізнес клієнта, щоб створювати рішення, які не лише автоматизують, а й посилюють ефективність.
        </h2>

        <div class="services-reasons__cluster" role="list" aria-label="Переваги GraffiT">
            <div class="reason-hex reason-hex--outline reason-hex--outline-left" aria-hidden="true"></div>
            <?php foreach ($reason_items as $item) : ?>
                <?php get_template_part('template-parts/components/reason', 'hex', $item); ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
