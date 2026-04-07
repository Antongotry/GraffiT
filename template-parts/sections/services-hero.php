<?php
/**
 * Services hero section.
 *
 * @package graffit
 */

declare(strict_types=1);
?>
<section
    class="services-hero"
    style="
        --services-hero-image: url('<?php echo esc_url(graffit_services_hero_image_url()); ?>');
        --services-experience-image: url('<?php echo esc_url(graffit_services_experience_image_url()); ?>');
    "
>
    <div class="services-hero__media" aria-hidden="true"></div>

    <div class="services-hero__container">
        <div class="services-hero__layout">
            <div class="services-hero__heading">
                <div class="services-hero__brand-row">
                    <div class="services-hero__brand-copy">
                        <h1 class="services-hero__title">
                            <span class="services-hero__title-line">
                                <span class="services-hero__title-brand">Graffit</span> – програмні рішення
                            </span>
                            <span class="services-hero__title-line services-hero__title-line--secondary">під задачі вашого бізнесу</span>
                        </h1>
                    </div>
                </div>
            </div>

            <div class="services-hero__aside">
                <p class="services-hero__description">Ми допомагаємо компаніям наводити лад у процесах — від автоматизації обліку до створення масштабних систем управління.</p>
                <a class="services-hero__cta" href="#site-footer">Отримати консультацію</a>
            </div>
        </div>

        <article class="services-hero__experience" aria-label="18 років досвіду">
            <p class="services-hero__experience-value">18</p>
            <p class="services-hero__experience-unit">років</p>
            <p class="services-hero__experience-text">досвіду, які перетворюють технології на результат.</p>
        </article>
    </div>
</section>
