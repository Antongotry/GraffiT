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
            ['label' => 'Java', 'short' => 'J', 'class' => 'is-java'],
            ['label' => 'Kotlin', 'short' => 'K', 'class' => 'is-kotlin'],
            ['label' => 'PostgreSQL', 'short' => 'Pg', 'class' => 'is-postgresql'],
            ['label' => 'Angular', 'short' => 'A', 'class' => 'is-angular'],
            ['label' => 'Kafka', 'short' => 'Kf', 'class' => 'is-kafka'],
            ['label' => 'Docker', 'short' => 'D', 'class' => 'is-docker'],
        ],
        'stack_caption' => 'Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first',
        'size' => 'small',
    ],
    [
        'classes' => ['reason-hex--photo-large'],
        'size' => 'photo-large',
        'variant' => 'image',
        'image_url' => graffit_services_automation_image_url(),
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
        'image_url' => graffit_services_outsourcing_image_url(),
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
