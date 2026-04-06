<?php
/**
 * Services process section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$process_steps = [
    [
        'number' => '1',
        'title' => 'Аналіз задач і бізнес-процесів',
        'text' => 'Фіксуємо ваші потреби, перекладаємо їх у чіткі вимоги.',
        'result' => 'Ви отримуєте зрозумілий план без зайвої технічної мови.',
        'active' => true,
    ],
    [
        'number' => '2',
        'title' => 'Проєктування рішення',
        'text' => 'Будуємо архітектуру та передбачаємо інтеграції з ERP, CRM, 1С та ін.',
        'result' => 'Система одразу масштабована й сумісна з вашими процесами.',
    ],
    [
        'number' => '3',
        'title' => 'Розробка та тестування',
        'text' => 'Розробляємо поетапно, тестуємо кожен модуль.',
        'result' => 'Ви бачите прогрес і отримуєте стабільний результат вчасно.',
    ],
    [
        'number' => '4',
        'title' => 'Запуск і навчання',
        'text' => 'Впроваджуємо систему й навчаємо команду.',
        'result' => 'Рішення починає працювати з першого дня.',
    ],
    [
        'number' => '5',
        'title' => 'Підтримка',
        'text' => 'Супроводжуємо й розвиваємо продукт далі.',
        'result' => 'Ви маєте надійного партнера, а не «одноразового підрядника».',
    ],
];
?>
<section class="services-process js-process-section" aria-labelledby="services-process-title">
    <div class="services-process__container">
        <div class="services-process__eyebrow">
            <img
                class="services-process__eyebrow-icon"
                src="<?php echo esc_url($logo_mark_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="services-process__eyebrow-text">Процес</p>
        </div>

        <h2 class="services-process__title" id="services-process-title">Як ми працюємо</h2>

        <div class="services-process__layout">
            <div class="services-process__timeline">
                <div class="services-process__line" aria-hidden="true">
                    <span class="services-process__line-fill js-process-line-fill"></span>
                </div>

                <div class="services-process__steps">
                    <?php foreach ($process_steps as $process_step) : ?>
                        <?php get_template_part('template-parts/components/process', 'step', $process_step); ?>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="services-process__visual" aria-hidden="true">
                <div class="services-process__visual-frame">
                    <span class="services-process__visual-shape"></span>
                    <div class="services-process__visual-image"></div>
                </div>
            </div>
        </div>
    </div>
</section>
