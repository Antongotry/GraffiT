<?php
/**
 * Services reasons section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
?>
<section class="services-reasons" aria-labelledby="services-reasons-title">
    <div class="services-reasons__container">
        <div class="services-reasons__eyebrow">
            <img
                class="services-reasons__eyebrow-icon"
                src="<?php echo esc_url($logo_mark_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="services-reasons__eyebrow-text">Чому ми</p>
        </div>

        <h2 class="services-reasons__summary" id="services-reasons-title">
            Ми не просто кодимо — ми глибоко занурюємось у бізнес клієнта, щоб створювати рішення, які не лише автоматизують, а й посилюють ефективність.
        </h2>

        <div class="services-reasons__cluster" role="list" aria-label="Переваги GraffiT">
            <div class="services-reasons__outline-shape" aria-hidden="true"></div>
            <article class="services-reasons__primary-card" role="listitem" aria-label="Ми не нав’язуємо готову коробку">
                <div class="services-reasons__primary-card-inner">
                    <h3 class="services-reasons__primary-card-title">Ми не нав’язуємо готову “коробку”</h3>
                    <p class="services-reasons__primary-card-text">створюємо рішення під ваші задачі</p>
                </div>
            </article>
        </div>
    </div>
</section>
