<?php
/**
 * Global popup mount point.
 *
 * @package graffit
 */
?>
<div class="site-popup" id="site-popup" aria-hidden="true">
    <button class="site-popup__backdrop" type="button" data-popup-close tabindex="-1" aria-label="<?php esc_attr_e('Закрити попап', 'graffit'); ?>"></button>

    <div class="site-popup__stage">
        <section class="site-popup__panel site-popup__panel--request is-active" data-popup-panel="request" role="dialog" aria-modal="true" aria-labelledby="site-popup-request-title">
            <button class="site-popup__close" type="button" data-popup-close aria-label="<?php esc_attr_e('Закрити форму', 'graffit'); ?>">
                <span class="site-popup__close-line" aria-hidden="true"></span>
                <span class="site-popup__close-line" aria-hidden="true"></span>
            </button>

            <?php
            get_template_part(
                'template-parts/components/popup',
                'request-form',
                [
                    'title_id' => 'site-popup-request-title',
                ]
            );
            ?>
        </section>

        <section class="site-popup__panel site-popup__panel--thank-you" data-popup-panel="success" role="dialog" aria-modal="true" aria-labelledby="site-popup-success-title" hidden>
            <button class="site-popup__close" type="button" data-popup-close aria-label="<?php esc_attr_e('Закрити повідомлення', 'graffit'); ?>">
                <span class="site-popup__close-line" aria-hidden="true"></span>
                <span class="site-popup__close-line" aria-hidden="true"></span>
            </button>

            <?php
            get_template_part(
                'template-parts/components/popup',
                'thank-you',
                [
                    'title_id' => 'site-popup-success-title',
                ]
            );
            ?>
        </section>
    </div>
</div>
