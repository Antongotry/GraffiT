<?php
/**
 * About hero section.
 *
 * @package graffit
 */

declare(strict_types=1);
?>
<section
    class="about-hero"
    aria-labelledby="about-hero-title"
    style="
        --about-hero-image: url('<?php echo esc_url(graffit_about_hero_image_url()); ?>');
        --about-hero-image-mobile: url('<?php echo esc_url(graffit_about_hero_image_mobile_url()); ?>');
    "
>
    <div class="about-hero__backdrop" aria-hidden="true"></div>

    <div class="about-hero__container">
        <div class="about-hero__content">
            <div class="about-hero__headline">
                <span class="about-hero__title-shadow" aria-hidden="true">Graffit</span>

                <h1 class="about-hero__title" id="about-hero-title">
                    Graffit – 18 років довіри, якості та технологічного лідерства
                </h1>
            </div>

            <p class="about-hero__description">
                Ми створюємо програмні рішення, які не просто автоматизують процеси — а допомагають бізнесу зростати, ставати керованим і передбачуваним. Наш принцип простий: нічого зайвого — тільки технології, які працюють на результат.
            </p>

            <a class="about-hero__cta" href="#site-footer" data-popup-open="request" data-popup-source="about-hero" data-popup-source-label="About Hero · Отримати консультацію">
                Отримати консультацію
            </a>
        </div>
    </div>
</section>
