<?php
/**
 * Product MediaHub page — hero (desktop-first, 1440 → vw).
 *
 * @package graffit
 */

declare(strict_types=1);

$hero_img = graffit_product_mediahub_hero_image_url();
?>
<section class="mediahub-hero">
    <div class="mediahub-hero__container">
        <div class="mediahub-hero__content">
            <h1 class="mediahub-hero__title">
                <span class="mediahub-hero__title-line">MediaHub — ваш контроль</span>
                <span class="mediahub-hero__title-line">над рекламою на екранах</span>
            </h1>

            <p class="mediahub-hero__description">
                Оновлюйте контент у всіх торгових точках за кілька кліків, бачте результат у цифрах і заробляйте більше
            </p>

            <a
                class="mediahub-hero__cta"
                href="#site-footer"
                data-popup-open="request"
                data-popup-source="mediahub-hero"
                data-popup-source-label="MediaHub · Hero · Отримати консультацію"
            >Отримати консультацію</a>
        </div>
    </div>

    <div class="mediahub-hero__visual">
        <img
            class="mediahub-hero__image"
            src="<?php echo esc_url($hero_img); ?>"
            alt=""
            aria-hidden="true"
            loading="eager"
        >
    </div>
</section>
