<?php
/**
 * Product MediaHub — «Що вміє MediaHub» (карусель за патерном services-projects).
 *
 * @package graffit
 */

declare(strict_types=1);

$mediahub_capabilities_eyebrow_icon = get_template_directory_uri() . '/assets/images/mediahub-benefits-eyebrow.svg';
$mediahub_capabilities_nav_l = content_url('uploads/2026/04/l.svg');
$mediahub_capabilities_nav_r = content_url('uploads/2026/04/r.svg');
$mediahub_capabilities_logo = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$mediahub_capabilities_bg = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/123_result-scaled.webp';

$mediahub_capabilities_cards = [
    [
        'body' => 'Оновлювати контент централізовано — один кабінет для всіх екранів.',
        'result' => 'швидкий запуск акцій у всіх магазинах одночасно.',
    ],
    [
        'body' => 'Показувати різний контент у різних місцях — персоналізація для магазинів чи відділів.',
        'result' => 'вища конверсія завдяки точнішій комунікації.',
    ],
    [
        'body' => 'Моніторити показ у реальному часі — бачити, що саме виходить на екрани з будь-якої точки.',
        'result' => 'менше інцидентів і швидше реагування на зміни.',
    ],
    [
        'body' => 'Планувати кампанії та розклади — автоматичний показ за часом, зонами та правилами.',
        'result' => 'менше ручної роботи для маркетингу й IT.',
    ],
    [
        'body' => 'Отримувати зрозумілу аналітику — охоплення, частота показів і ефективність у зручних звітах.',
        'result' => 'прозорі рішення щодо інвестицій у екранну рекламу.',
    ],
];
?>
<section
    class="services-projects mediahub-capabilities js-projects-scroller"
    id="mediahub-capabilities"
    aria-labelledby="mediahub-capabilities-title"
    style="--services-projects-bg-image: url('<?php echo esc_url($mediahub_capabilities_bg); ?>')"
>
    <div class="services-projects__viewport">
        <div class="services-projects__container">
            <div class="services-projects__header">
                <div class="services-projects__eyebrow">
                    <img
                        class="services-projects__eyebrow-icon"
                        src="<?php echo esc_url($mediahub_capabilities_eyebrow_icon); ?>"
                        alt=""
                        width="28"
                        height="32"
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    >
                    <p class="services-projects__eyebrow-text">Що вміє MediaHub</p>
                </div>

                <div class="services-projects__top-row">
                    <h2 class="services-projects__title" id="mediahub-capabilities-title">
                        Розроблений на основі досвіду управління контентом у великих торговельних мережах, MediaHub об’єднує стабільність enterprise-рішень і простоту впровадження SaaS-продукту.
                    </h2>
                </div>

                <div class="services-projects__swipe-hint">
                    <span class="services-projects__swipe-icon-wrap" aria-hidden="true">
                        <img
                            class="services-projects__swipe-icon"
                            src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/mdi-gesture-swipe-right.svg'); ?>"
                            alt=""
                            width="24"
                            height="24"
                            loading="lazy"
                            decoding="async"
                        >
                    </span>
                    <p class="services-projects__swipe-text">гортайте вбік</p>
                </div>
            </div>

            <div class="services-projects__stage js-projects-stage">
                <div class="services-projects__track js-projects-track">
                    <?php foreach ($mediahub_capabilities_cards as $cap) : ?>
                        <article class="mediahub-capability-card">
                            <div class="mediahub-capability-card__visual" aria-hidden="true"></div>
                            <p class="mediahub-capability-card__body"><?php echo esc_html($cap['body']); ?></p>
                            <div class="mediahub-capability-card__result">
                                <p class="mediahub-capability-card__result-label">Результат:</p>
                                <p class="mediahub-capability-card__result-text"><?php echo esc_html($cap['result']); ?></p>
                            </div>
                        </article>
                    <?php endforeach; ?>

                    <article class="mediahub-capability-card mediahub-capability-card--cta">
                        <img
                            class="mediahub-capability-card__cta-logo"
                            src="<?php echo esc_url($mediahub_capabilities_logo); ?>"
                            alt=""
                            width="63"
                            height="72"
                            loading="lazy"
                            decoding="async"
                            aria-hidden="true"
                        >
                        <p class="mediahub-capability-card__cta-title">
                            У результаті екрани працюють не як «фоновий шум», а як інструмент, що реально впливає на продажі, впізнаваність бренду та лояльність клієнтів.
                        </p>
                        <p class="mediahub-capability-card__cta-lead">
                            Залиште заявку — покажемо, як MediaHub працюватиме саме у вашій мережі.
                        </p>
                        <button
                            class="mediahub-capability-card__cta-button"
                            type="button"
                            data-popup-open="request"
                            data-popup-source="mediahub-capabilities"
                            data-popup-source-label="MediaHub · Що вміє · Отримати консультацію"
                        >
                            Отримати консультацію
                        </button>
                    </article>
                </div>
            </div>

            <div class="services-projects__nav">
                <button class="services-projects__nav-button services-projects__nav-button--prev js-projects-prev" type="button" aria-label="Попередня картка">
                    <img
                        class="services-projects__nav-icon"
                        src="<?php echo esc_url($mediahub_capabilities_nav_l); ?>"
                        alt=""
                        width="18"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    >
                </button>
                <button class="services-projects__nav-button services-projects__nav-button--next js-projects-next" type="button" aria-label="Наступна картка">
                    <img
                        class="services-projects__nav-icon"
                        src="<?php echo esc_url($mediahub_capabilities_nav_r); ?>"
                        alt=""
                        width="18"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    >
                </button>
            </div>
        </div>
    </div>
</section>
