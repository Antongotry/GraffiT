<?php
/**
 * Products page — hero section.
 *
 * @package graffit
 */

declare(strict_types=1);
?>
<section
    class="products-hero"
    style="--products-hero-image: url('<?php echo esc_url(graffit_products_hero_image_url()); ?>');"
>
    <div class="products-hero__backdrop" aria-hidden="true"></div>

    <div class="products-hero__container">
        <div class="products-hero__content">
            <div class="products-hero__headline">
                <h1 class="products-hero__title">
                    <span class="products-hero__title-line">
                        <span class="products-hero__title-brand">Graffit</span> – готові програмні
                    </span>
                    <span class="products-hero__title-line">рішення, створені на основі</span>
                    <span class="products-hero__title-line">18 років експертизи</span>
                </h1>
            </div>

            <p class="products-hero__description">
                Ми перетворюємо досвід корпоративної розробки на інструменти, які упорядковують процеси, підсилюють ефективність і зростають разом із бізнесом.
            </p>

            <a
                class="products-hero__cta"
                href="#site-footer"
                data-popup-open="request"
                data-popup-source="products-hero"
                data-popup-source-label="Hero · Отримати консультацію"
            >Отримати консультацію</a>
        </div>
    </div>
</section>
