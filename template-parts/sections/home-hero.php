<?php
/**
 * Front page hero section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_hero_background_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/home1440_result-scaled.webp?v=home-hero-1';
$home_hero_cta_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8668_result.webp?v=home-cta-1';
?>
<section class="home-hero">
    <div class="home-hero__media" aria-hidden="true" style="background-image: url('<?php echo esc_url($home_hero_background_image); ?>');"></div>

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
            <span class="home-hero__project-link-shape" aria-hidden="true" style="background-image: url('<?php echo esc_url($home_hero_cta_image); ?>');"></span>
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
