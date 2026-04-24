<?php
/**
 * About story section.
 *
 * @package graffit
 */

declare(strict_types=1);

$about_story_image_url = graffit_about_story_image_url();
?>
<section class="about-story" aria-labelledby="about-story-title" style="--about-story-seam-image: url('<?php echo esc_url($about_story_image_url); ?>');">
    <div class="about-story__backdrop" aria-hidden="true"></div>

    <div class="about-story__container">
        <div class="about-story__content">
            <div class="about-story__eyebrow">
                <img
                    class="about-story__eyebrow-icon"
                    src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo-mark.svg'); ?>"
                    width="28"
                    height="32"
                    alt=""
                    loading="lazy"
                    decoding="async"
                >
                <p class="about-story__eyebrow-text">Наша історія</p>
            </div>

            <h2 class="about-story__title" id="about-story-title">
                Ми починали як внутрішня ІТ-команда, яка вирішувала складні задачі у великому рітейлі.
            </h2>

            <p class="about-story__description">
                Тоді ми навчились будувати системи, що витримують навантаження тисяч користувачів, інтегруються з десятками платформ і працюють безвідмовно.
            </p>
            <p class="about-story__description about-story__description--secondary">
                Саме тому ми розуміємо бізнес не теоретично, а зсередини.
            </p>
        </div>

        <div class="about-story__media" aria-hidden="true">
            <img
                class="about-story__image"
                src="<?php echo esc_url($about_story_image_url); ?>"
                width="810"
                height="951"
                alt=""
                loading="lazy"
                decoding="async"
            >
        </div>
    </div>
</section>
