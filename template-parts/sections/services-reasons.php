<?php
/**
 * Services reasons section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$reasons_card_images = [
    'cover'   => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1-card_result.webp',
    'primary' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2-card_result.webp',
    'stack'   => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/4-card_result.webp',
];
$reasons_stack_icons = [
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-1_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-2_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-3_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-4_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-5_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-6_result.webp',
];
$reasons_cursor_icon  = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/cursor-5.svg';
$reasons_side_photo   = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/621_result.webp';
$reasons_lower_photo  = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Polygon-110_result.webp';

$cover_card_style   = sprintf("--reasons-card-image: url('%s');", esc_url_raw($reasons_card_images['cover']));
$primary_card_style = sprintf("--reasons-card-image: url('%s');", esc_url_raw($reasons_card_images['primary']));
$stack_card_style   = sprintf("--reasons-card-image: url('%s');", esc_url_raw($reasons_card_images['stack']));
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
            <div
                class="services-reasons__outline-shape"
                style="<?php echo esc_attr($cover_card_style); ?>"
                aria-hidden="true"
            ></div>
            <article
                class="services-reasons__primary-card"
                role="listitem"
                aria-label="Ми не нав’язуємо готову коробку"
                style="<?php echo esc_attr($primary_card_style); ?>"
            >
                <div class="services-reasons__primary-card-inner">
                    <h3 class="services-reasons__primary-card-title">Ми не нав’язуємо готову “коробку”</h3>
                    <p class="services-reasons__primary-card-text">створюємо рішення під ваші задачі</p>
                </div>
            </article>
            <article
                class="services-reasons__stack-card"
                role="listitem"
                aria-label="Працюємо в стеку, який сумісний з вимогами enterprise"
                style="<?php echo esc_attr($stack_card_style); ?>"
            >
                <div class="services-reasons__stack-card-inner">
                    <h3 class="services-reasons__stack-card-title">Працюємо в стеку, який сумісний з вимогами enterprise:</h3>
                    <div class="services-reasons__stack-icons" aria-hidden="true">
                        <?php foreach ($reasons_stack_icons as $icon_url) : ?>
                            <span class="services-reasons__stack-icon-wrap">
                                <img
                                    class="services-reasons__stack-icon"
                                    src="<?php echo esc_url($icon_url); ?>"
                                    alt=""
                                    width="32"
                                    height="32"
                                    loading="lazy"
                                    decoding="async"
                                >
                            </span>
                        <?php endforeach; ?>
                    </div>
                    <p class="services-reasons__stack-card-text">Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first</p>
                </div>
            </article>
            <div class="services-reasons__side-photo" aria-hidden="true">
                <img
                    class="services-reasons__side-photo-image"
                    src="<?php echo esc_url($reasons_side_photo); ?>"
                    alt=""
                    width="621"
                    height="621"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <div class="services-reasons__lower-photo" aria-hidden="true">
                <img
                    class="services-reasons__side-photo-image"
                    src="<?php echo esc_url($reasons_lower_photo); ?>"
                    alt=""
                    width="365"
                    height="365"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <article
                class="services-reasons__bottom-card services-reasons__bottom-card--cursor"
                role="listitem"
                aria-label="Допомагаємо в складних кейсах"
                style="<?php echo esc_attr($stack_card_style); ?>"
            >
                <div class="services-reasons__bottom-card-inner services-reasons__bottom-card-inner--short">
                    <h3 class="services-reasons__bottom-card-title">Допомагаємо в складних кейсах,</h3>
                    <p class="services-reasons__bottom-card-text services-reasons__bottom-card-text--short">де інші кажуть “так не робиться”</p>
                    <img
                        class="services-reasons__bottom-card-cursor"
                        src="<?php echo esc_url($reasons_cursor_icon); ?>"
                        alt=""
                        width="28"
                        height="26"
                        loading="lazy"
                        decoding="async"
                    >
                </div>
            </article>
            <article
                class="services-reasons__bottom-card services-reasons__bottom-card--landscape"
                role="listitem"
                aria-label="Інтегруємось у вже існуючий ландшафт"
                style="<?php echo esc_attr($stack_card_style); ?>"
            >
                <div class="services-reasons__bottom-card-inner">
                    <h3 class="services-reasons__bottom-card-title">Інтегруємось у вже існуючий ландшафт</h3>
                    <p class="services-reasons__bottom-card-text">(1С, CRM, ERP, маркетплейси, POS тощо)</p>
                </div>
            </article>
            <article
                class="services-reasons__bottom-card services-reasons__bottom-card--docs"
                role="listitem"
                aria-label="Даємо чітку документацію"
                style="<?php echo esc_attr($stack_card_style); ?>"
            >
                <div class="services-reasons__bottom-card-inner">
                    <h3 class="services-reasons__bottom-card-title">Даємо чітку документацію,</h3>
                    <p class="services-reasons__bottom-card-text">підтримку після запуску і прозору комунікацію</p>
                </div>
            </article>
        </div>
    </div>
</section>
