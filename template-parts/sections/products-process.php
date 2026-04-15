<?php
/**
 * Products process section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$process_visual_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-1707480437_result.webp';

$process_steps = [
    [
        'number' => '1',
        'title' => 'Запит',
        'text' => 'Ви залишаєте заявку та описуєте потреби бізнесу. Це допомагає визначити, яке рішення найкраще підійде.',
        'result' => 'Формуємо стартову рамку задачі без зайвих припущень.',
        'active' => true,
    ],
    [
        'number' => '2',
        'title' => 'Демонстрація',
        'text' => 'Ми показуємо можливості продукту: інтерфейс, функції та приклади використання.',
        'result' => 'Ви одразу бачите, як рішення працює у вашому сценарії.',
    ],
    [
        'number' => '3',
        'title' => 'Адаптація',
        'text' => 'Налаштовуємо продукт під ваші процеси й інтегруємо з існуючими системами (ERP, CRM, 1С тощо).',
        'result' => 'Продукт вбудовується у ваш поточний ландшафт без зайвого навантаження на команду.',
    ],
    [
        'number' => '4',
        'title' => 'Запуск і підтримка',
        'text' => 'Запускаємо рішення, навчаємо команду та супроводжуємо його розвиток.',
        'result' => 'Ми супроводжуємо продукт після запуску, оновлюємо його під нові вимоги бізнесу й гарантуємо стабільність.',
    ],
];
?>
<section class="services-process products-process js-process-section" aria-labelledby="products-process-title">
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

        <h2 class="services-process__title" id="products-process-title">Як працює співпраця з продуктами</h2>

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

                <div class="products-process__note">
                    <p class="products-process__note-text">
                        GraffIT — це не просто постачальник ПЗ, а технологічний партнер, який дбає про результат вашої компанії.
                    </p>
                </div>
            </div>

            <div class="services-process__visual" aria-hidden="true">
                <div class="services-process__visual-frame">
                    <img
                        class="services-process__visual-photo"
                        src="<?php echo esc_url($process_visual_image); ?>"
                        alt=""
                        width="977"
                        height="977"
                        loading="eager"
                        decoding="async"
                    >
                </div>
            </div>
        </div>
    </div>
</section>
