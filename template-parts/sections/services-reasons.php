<?php
/**
 * Services reasons section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$reason_items = [
    [
        'classes' => ['reason-hex--top-left'],
        'title' => 'Допомагаємо в складних кейсах,',
        'text' => 'де інші кажуть “так не робиться”',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--top-right'],
        'title' => 'Даємо чітку документацію,',
        'text' => 'підтримку після запуску і прозору комунікацію',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--center'],
        'title' => 'Працюємо в стеку, який сумісний з вимогами enterprise:',
        'stack' => ['Java', 'Kotlin', 'PostgreSQL', 'Angular', 'Kafka', 'Docker'],
        'stack_caption' => 'Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first',
        'size' => 'large',
    ],
    [
        'classes' => ['reason-hex--bottom'],
        'title' => 'Інтегруємось у вже існуючий ландшафт',
        'text' => '(1С, CRM, ERP, маркетплейси, POS тощо)',
        'size' => 'small',
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

        <div class="services-reasons__cluster" role="list" aria-label="Переваги GraffiT">
            <?php foreach ($reason_items as $item) : ?>
                <?php get_template_part('template-parts/components/reason', 'hex', $item); ?>
            <?php endforeach; ?>
        </div>

        <h2 class="services-reasons__summary" id="services-reasons-title">
            Ми не просто кодимо — ми глибоко занурюємось у бізнес клієнта, щоб створювати рішення, які не лише автоматизують, а й посилюють ефективність.
        </h2>
    </div>
</section>
