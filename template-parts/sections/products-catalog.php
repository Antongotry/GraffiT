<?php
/**
 * Products page catalog slider section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$uploads_base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/';

$products_catalog_items = [
    [
        'slug' => 'loyalty',
        'title' => 'PCЛояльті — корпоративна система програм лояльності, перевірена в рітейлі',
        'description' => 'Керуйте бонусами, знижками та балами — від невеликого магазину до мережі з тисячами клієнтів.',
        'image_url' => $uploads_base . '1g_result.webp',
    ],
    [
        'slug' => 'caf',
        'title' => 'CAF — надійне рішення для управління фінансовими процесами',
        'description' => 'Автоматизуйте облік, документообіг і звітність без втрати контролю.',
        'image_url' => $uploads_base . '2g_result.webp',
    ],
    [
        'slug' => 'butler',
        'title' => 'Butler — платформа управління процесами, побудована за enterprise-принципами',
        'description' => 'Контроль бізнес-операцій і завдань у єдиній системі.',
        'image_url' => $uploads_base . '3g_result.webp',
    ],
    [
        'slug' => 'mediahub',
        'title' => 'MediaHub — стабільне середовище для синхронізації контенту у всіх каналах',
        'description' => 'Оновлення акцій, цін і матеріалів у всіх каналах — у єдиному інтерфейсі.',
        'image_url' => $uploads_base . '4g_result.webp',
    ],
];
?>
<section class="products-catalog js-products-catalog-scroller" aria-labelledby="products-catalog-title">
    <div class="products-catalog__viewport">
        <div class="products-catalog__container">
            <div class="products-catalog__header">
                <div class="products-catalog__eyebrow">
                    <img
                        class="products-catalog__eyebrow-icon"
                        src="<?php echo esc_url($logo_mark_url); ?>"
                        alt=""
                        width="28"
                        height="32"
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    >
                    <p class="products-catalog__eyebrow-text">Каталог продуктів</p>
                </div>

                <div class="products-catalog__nav">
                    <button class="products-catalog__nav-button products-catalog__nav-button--prev js-products-catalog-prev" type="button" aria-label="Попередній продукт">
                        <img
                            class="products-catalog__nav-icon"
                            src="<?php echo esc_url('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/left-white.svg'); ?>"
                            alt=""
                            width="18"
                            height="20"
                            decoding="async"
                        >
                    </button>

                    <button class="products-catalog__nav-button products-catalog__nav-button--next js-products-catalog-next" type="button" aria-label="Наступний продукт">
                        <img
                            class="products-catalog__nav-icon"
                            src="<?php echo esc_url('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/right-white.svg'); ?>"
                            alt=""
                            width="18"
                            height="20"
                            decoding="async"
                        >
                    </button>
                </div>
            </div>

            <h2 class="screen-reader-text" id="products-catalog-title">Каталог продуктів Graffit</h2>

            <div class="products-catalog__swipe-hint" aria-hidden="true">
                <img
                    class="products-catalog__swipe-icon"
                    src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/mdi-gesture-swipe-right.svg'); ?>"
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                    decoding="async"
                >
                <p class="products-catalog__swipe-text">гортайте вбік</p>
            </div>

            <div class="products-catalog__stage js-products-catalog-stage">
                <div class="products-catalog__track js-products-catalog-track">
                    <?php foreach ($products_catalog_items as $index => $catalog_item) : ?>
                        <article class="product-catalog-card<?php echo $index === 0 ? ' is-active' : ''; ?> is-<?php echo esc_attr($catalog_item['slug']); ?>">
                            <div class="product-catalog-card__media" aria-hidden="true">
                                <img
                                    class="product-catalog-card__media-image"
                                    src="<?php echo esc_url($catalog_item['image_url']); ?>"
                                    alt=""
                                    width="320"
                                    height="240"
                                    loading="lazy"
                                    decoding="async"
                                >
                            </div>

                            <h3 class="product-catalog-card__title"><?php echo esc_html($catalog_item['title']); ?></h3>
                            <p class="product-catalog-card__description"><?php echo esc_html($catalog_item['description']); ?></p>

                            <a
                                class="product-catalog-card__cta product-catalog-card__cta--desktop"
                                href="#site-footer"
                                data-popup-open="request"
                                data-popup-source="products-catalog"
                                data-popup-source-label="<?php echo esc_attr('Catalog · ' . $catalog_item['title']); ?>"
                            >Детальніше</a>

                            <a
                                class="product-catalog-card__cta product-catalog-card__cta--mobile"
                                href="#site-footer"
                                data-popup-open="request"
                                data-popup-source="products-catalog"
                                data-popup-source-label="<?php echo esc_attr('Catalog · ' . $catalog_item['title']); ?>"
                            >Детальніше</a>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="products-catalog__nav products-catalog__nav--mobile">
                <button class="products-catalog__nav-button products-catalog__nav-button--prev js-products-catalog-prev" type="button" aria-label="Попередній продукт">
                    <img
                        class="products-catalog__nav-icon"
                        src="<?php echo esc_url('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/left-white.svg'); ?>"
                        alt=""
                        width="18"
                        height="20"
                        decoding="async"
                    >
                </button>

                <button class="products-catalog__nav-button products-catalog__nav-button--next js-products-catalog-next" type="button" aria-label="Наступний продукт">
                    <img
                        class="products-catalog__nav-icon"
                        src="<?php echo esc_url('https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/right-white.svg'); ?>"
                        alt=""
                        width="18"
                        height="20"
                        decoding="async"
                    >
                </button>
            </div>
        </div>
    </div>
</section>
