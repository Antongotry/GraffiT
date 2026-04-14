<?php
/**
 * Services benefits section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$benefits = [
    [
        'number' => '01',
        'title' => 'Зрозумілу систему управління',
        'text' => 'процеси зводяться в єдину логіку, без хаосу й ручної рутини.',
        'icon' => 'system',
        'active' => true,
    ],
    [
        'number' => '02',
        'title' => 'Надійну архітектуру',
        'text' => 'рішення працює стабільно, витримує навантаження й масштабування.',
        'icon' => 'architecture',
    ],
    [
        'number' => '03',
        'title' => 'Прозорість і контроль',
        'text' => 'дані зібрані в одному місці, управлінські звіти формуються швидко й чітко.',
        'icon' => 'visibility',
    ],
    [
        'number' => '04',
        'title' => 'Економію часу та ресурсів',
        'text' => 'команда перестає витрачати години на ручні операції.',
        'icon' => 'efficiency',
    ],
    [
        'number' => '05',
        'title' => 'Підтримку та розвиток',
        'text' => 'система не «завмирає» після запуску, а зростає разом із бізнесом.',
        'icon' => 'support',
    ],
    [
        'number' => '06',
        'title' => 'Гнучкість інтеграції',
        'text' => 'з ERP, CRM, маркетплейсами чи складськими системами під конкретні потреби.',
        'icon' => 'integration',
    ],
];
?>
<section class="services-benefits js-benefits-scroller" aria-labelledby="services-benefits-title">
    <div class="services-benefits__viewport">
        <div class="services-benefits__container">
            <div class="services-benefits__eyebrow">
                <img
                    class="services-benefits__eyebrow-icon"
                    src="<?php echo esc_url($logo_mark_url); ?>"
                    alt=""
                    width="28"
                    height="32"
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                >
                <p class="services-benefits__eyebrow-text">Переваги</p>
            </div>

            <h2 class="services-benefits__title" id="services-benefits-title">
                <span class="services-benefits__title-line">В результаті роботи</span><br>
                <span class="services-benefits__title-line">ви отримаєте</span>
            </h2>

            <div class="services-benefits__swipe-hint">
                <span class="services-benefits__swipe-icon-wrap" aria-hidden="true">
                    <img
                        class="services-benefits__swipe-icon"
                        src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/mdi-gesture-swipe-right.svg'); ?>"
                        alt=""
                        width="24"
                        height="24"
                        loading="lazy"
                        decoding="async"
                    >
                </span>
                <p class="services-benefits__swipe-text">гортайте вбік</p>
            </div>

            <div class="services-benefits__stage js-benefits-stage">
                <div class="services-benefits__track js-benefits-track">
                    <div class="services-benefits__line" aria-hidden="true">
                        <span class="services-benefits__line-fill js-benefits-line-fill"></span>
                    </div>

                    <?php foreach ($benefits as $index => $benefit) : ?>
                        <?php
                        $benefit['classes'] = ['js-benefit-item'];
                        $benefit['active'] = $index === 0;
                        ?>
                        <?php get_template_part('template-parts/components/benefit', 'card', $benefit); ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</section>
