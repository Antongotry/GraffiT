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

        <div class="services-reasons__cluster" aria-hidden="true"></div>
    </div>
</section>
