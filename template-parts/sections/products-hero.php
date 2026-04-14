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
                <div class="products-hero__sparkles" aria-hidden="true">
                    <span class="products-hero__sparkle products-hero__sparkle--1"></span>
                    <span class="products-hero__sparkle products-hero__sparkle--2"></span>
                    <span class="products-hero__sparkle products-hero__sparkle--3"></span>
                    <span class="products-hero__sparkle products-hero__sparkle--4"></span>
                </div>

                <h1 class="products-hero__title">
                    <span class="products-hero__title-halo" aria-hidden="true">Graffit</span>
                    <span class="products-hero__title-text">Graffit – готові програмні рішення, створені на основі 18 років експертизи</span>
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
