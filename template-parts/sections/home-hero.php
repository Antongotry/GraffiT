<?php
/**
 * Front page hero section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_hero_cta_image = graffit_home_hero_cta_image_url() . '?v=home-cta-2';
?>
<section class="home-hero">

    <div class="home-hero__container">
        <div class="home-hero__summary">
            <p class="home-hero__description">
                Як графіт стає діамантом — так і ваш задум трансформується у точний, витончений і готовий до масштабування цифровий продукт.
            </p>
        </div>

        <a
            class="home-hero__project-link"
            href="#site-footer"
            data-popup-open="request"
            data-popup-source="home-hero"
            data-popup-source-label="Home Hero · Обговорити проєкт"
            aria-label="<?php esc_attr_e('Обговорити проєкт', 'graffit'); ?>"
        >
            <span class="home-hero__project-link-shape" aria-hidden="true">
                <img
                    class="home-hero__project-link-shape-image"
                    src="<?php echo esc_url($home_hero_cta_image); ?>"
                    alt=""
                    width="175"
                    height="187"
                    decoding="async"
                >
            </span>
            <span class="home-hero__project-link-text">Обговорити проєкт</span>
        </a>

        <div class="home-hero__title-wrap">
            <h1 class="home-hero__title">
                <span class="home-hero__title-line home-hero__title-line--primary">
                    <span class="home-hero__title-brand" data-text="Graffit">Graffit</span>
                    <span class="home-hero__title-copy">– технології, що</span>
                </span>
                <span class="home-hero__title-line home-hero__title-line--secondary">огранюють ваші ідеї</span>
            </h1>
        </div>
    </div>
</section>
