<?php
/**
 * Products projects section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$projects_background_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/123_result-scaled.webp';

$project_cases = [
    [
        'title' => 'Мережа піцерій — розробка унікального програмного рішення (каса самообслуговування)',
        'product' => 'індивідуально розроблена каса самообслуговування (kiosk-рішення)',
        'results' => [
            'прискорення процесу оформлення замовлень',
            'зниження навантаження на персонал у години пік',
            'покращення клієнтського досвіду',
            'підвищення операційної ефективності закладів та високий рівень задоволеності замовника',
        ],
        'media_class' => 'is-pizzeria',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1im_result.webp',
    ],
    [
        'title' => 'Мережа пекарень — розробка комплексного рішення для автоматизації каси та складу',
        'product' => 'розроблена система автоматизації касових операцій та складського обліку (Front-office + Back-office)',
        'results' => [
            'повна прозорість складського обліку',
            'скорочення помилок під час інвентаризації',
            'оптимізація роботи персоналу та зменшення операційних витрат',
            'підвищення швидкості обслуговування клієнтів та керованості бізнесу',
        ],
        'media_class' => 'is-bakery',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2im_result.webp',
    ],
    [
        'title' => 'Ритейл — розробка гнучкої програми лояльності',
        'product' => 'індивідуально розроблена система лояльності',
        'results' => [
            'зростання повторних покупок та середнього чека',
            'підвищення залучення клієнтів через інтерактивні механіки',
            'автоматизація маркетингових активностей',
            'формування довгострокової лояльності аудиторії',
        ],
        'media_class' => 'is-loyalty',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/3im_result.webp',
    ],
    [
        'title' => 'Роздрібна мережа — розробка системи розпізнавання та обліку співробітників',
        'product' => 'індивідуально розроблена система розпізнавання та обліку персоналу',
        'results' => [
            'повний і прозорий облік робочого часу',
            'зниження кількості помилок та зловживань',
            'оптимізація планування змін',
            'підвищення ефективності управління персоналом',
        ],
        'media_class' => 'is-retail-staff',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/4im_result.webp',
    ],
    [
        'title' => 'Крупний ритейл — розробка касових рішень',
        'product' => 'окреме касове рішення для Desktop; окреме касове рішення для Android',
        'results' => [
            'стабільна робота програмного забезпечення на 6000+ касах',
            'висока швидкість проведення касових операцій',
            'безперебійна робота навіть під піковими навантаженнями',
            'готовність систем до подальшого масштабування та розвитку мережі',
        ],
        'media_class' => 'is-enterprise-retail',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/5im_result.webp',
    ],
    [
        'title' => 'Торговельні мережі — розробка системи управління рекламою на екранах (Digital Signage)',
        'product' => 'індивідуально розроблена система управління рекламним контентом (Digital Signage)',
        'results' => [
            'оперативне управління рекламними кампаніями у всій мережі',
            'зменшення витрат на друковані матеріали',
            'підвищення ефективності маркетингових активностей',
            'покращення візуальної комунікації з покупцями у торгових точках',
        ],
        'media_class' => 'is-signage',
        'media_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/6im_result.webp',
    ],
];
?>
<section
    class="services-projects products-projects js-projects-scroller"
    id="products-projects"
    aria-labelledby="products-projects-title"
    style="--services-projects-bg-image: url('<?php echo esc_url($projects_background_image); ?>')"
>
    <div class="services-projects__viewport">
        <div class="services-projects__container">
            <div class="services-projects__header">
                <div class="services-projects__eyebrow">
                    <img
                        class="services-projects__eyebrow-icon"
                        src="<?php echo esc_url($logo_mark_url); ?>"
                        alt=""
                        width="28"
                        height="32"
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    >
                    <p class="services-projects__eyebrow-text">Проєкти</p>
                </div>

                <div class="services-projects__top-row">
                    <h2 class="services-projects__title" id="products-projects-title">
                        Вміємо адаптувати продукти під ваші бізнес-запити та робочі процеси.
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
                    <?php foreach ($project_cases as $project_case) : ?>
                        <?php get_template_part('template-parts/components/project-case', 'card', $project_case); ?>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="services-projects__nav">
                <button class="services-projects__nav-button services-projects__nav-button--prev js-projects-prev" type="button" aria-label="Попередній кейс">
                    <img
                        class="services-projects__nav-icon"
                        src="<?php echo esc_url(content_url('uploads/2026/04/l.svg')); ?>"
                        alt=""
                        width="18"
                        height="20"
                        decoding="async"
                    />
                </button>
                <button class="services-projects__nav-button services-projects__nav-button--next js-projects-next" type="button" aria-label="Наступний кейс">
                    <img
                        class="services-projects__nav-icon"
                        src="<?php echo esc_url(content_url('uploads/2026/04/r.svg')); ?>"
                        alt=""
                        width="18"
                        height="20"
                        decoding="async"
                    />
                </button>
            </div>
        </div>
    </div>
</section>
