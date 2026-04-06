<?php
/**
 * Services overview section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$cards = [
    [
        'title' => 'Автоматизація бізнес-процесів',
        'copy' => [
            'Інтеграція, розробка й впровадження систем будь-якої складності — замість хаосу даних ви отримуєте чітку логіку управління.',
            'GraffIT забезпечує стабільність і масштабованість рішень enterprise-рівня.',
        ],
        'image_url' => graffit_services_automation_image_url(),
        'image_alt' => 'Команда GraffiT за роботою',
        'image_position' => 'center',
        'button_label' => 'Детальніше',
        'button_url' => '#',
        'highlighted' => false,
        'layout' => 'default',
    ],
    [
        'title' => 'IT-аутсорсинг',
        'copy' => [
            'Сильна команда без витрат на штат: розробники, аналітики, тестувальники, адміністратори. Ми будуємо процеси, які працюють стабільно — із прозорою комунікацією, документацією та підтримкою після запуску.',
        ],
        'image_url' => graffit_services_outsourcing_image_url(),
        'image_alt' => 'Фахівці GraffiT на зустрічі',
        'image_position' => 'center',
        'highlighted' => false,
        'layout' => 'low',
    ],
];
?>
<section class="services-overview" aria-labelledby="services-overview-title">
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

        <h2 class="services-overview__title" id="services-overview-title">
            Ви отримуєте не просто код, а продуману систему, що інтегрується у ваш бізнес і масштабується разом із ним.
        </h2>

        <div class="services-overview__grid">
            <?php foreach ($cards as $card) : ?>
                <?php get_template_part('template-parts/components/service', 'card', $card); ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
