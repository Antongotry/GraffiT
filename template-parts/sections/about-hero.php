<?php
/**
 * About hero section.
 *
 * @package graffit
 */

declare(strict_types=1);
?>
<section class="about-hero" aria-labelledby="about-hero-title">
    <div class="about-hero__backdrop" aria-hidden="true"></div>

    <div class="about-hero__container">
        <div class="about-hero__content">
            <div class="about-hero__eyebrow">
                <img
                    class="about-hero__eyebrow-icon"
                    src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo-mark.svg'); ?>"
                    width="28"
                    height="32"
                    alt=""
                    loading="lazy"
                    decoding="async"
                >
                <p class="about-hero__eyebrow-text">Наша історія</p>
            </div>

            <h1 class="about-hero__title" id="about-hero-title">
                Ми починали як внутрішня ІТ-команда, яка вирішувала складні задачі у великому рітейлі.
            </h1>

            <p class="about-hero__description">
                Тоді ми навчились будувати системи, що витримують навантаження тисяч користувачів, інтегруються з десятками платформ і працюють безвідмовно.
            </p>
            <p class="about-hero__description about-hero__description--secondary">
                Саме тому ми розуміємо бізнес не теоретично, а зсередини.
            </p>
        </div>

        <div class="about-hero__media" aria-hidden="true">
            <img
                class="about-hero__image"
                src="<?php echo esc_url(graffit_about_hero_image_url()); ?>"
                width="810"
                height="951"
                alt=""
                loading="eager"
                decoding="async"
            >
        </div>
    </div>
</section>
