<?php
/**
 * Popup request form component.
 *
 * @package graffit
 */

declare(strict_types=1);

$args = wp_parse_args(
    $args ?? [],
    [
        'title_id' => 'site-popup-request-title',
    ]
);
?>
<div class="request-popup">
    <div class="request-popup__layout">
        <div class="request-popup__form-shell">
            <h2 class="request-popup__title" id="<?php echo esc_attr((string) $args['title_id']); ?>">
                Залиште заявку
            </h2>

            <p class="request-popup__text">
                Ми звʼяжемося з вами найближчим робочим часом.
            </p>

            <form class="request-popup__form js-request-form" action="<?php echo esc_url(admin_url('admin-ajax.php')); ?>" method="post" novalidate>
                <input type="hidden" name="action" value="graffit_submit_request">
                <input type="hidden" name="source" value="site">
                <input type="hidden" name="source_label" value="Сайт">
                <?php wp_nonce_field('graffit_request_form', 'nonce'); ?>

                <div class="request-popup__fields">
                    <label class="request-popup__field" data-field-wrap="name">
                        <input class="request-popup__input" type="text" name="name" autocomplete="name" placeholder="Імʼя*" required>
                        <span class="request-popup__field-error" data-field-error="name"></span>
                    </label>

                    <label class="request-popup__field" data-field-wrap="phone">
                        <input class="request-popup__input" type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="Телефон*" required>
                        <span class="request-popup__field-error" data-field-error="phone"></span>
                    </label>

                    <label class="request-popup__field" data-field-wrap="message">
                        <input class="request-popup__input" type="text" name="message" autocomplete="off" placeholder="Коментар*" required>
                        <span class="request-popup__field-error" data-field-error="message"></span>
                    </label>
                </div>

                <div class="request-popup__checks">
                    <label class="request-popup__checkbox" data-field-wrap="consent">
                        <input class="request-popup__checkbox-input" type="checkbox" name="consent" value="1" required>
                        <span class="request-popup__checkbox-ui" aria-hidden="true">
                            <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                                <path d="M3.5 8.4 6.6 11.5 12.7 4.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </span>
                        <span class="request-popup__checkbox-copy">Погоджуюсь з політикою конфіденційності та обробкою персональних даних.</span>
                    </label>
                    <span class="request-popup__field-error request-popup__field-error--checkbox" data-field-error="consent"></span>
                </div>

                <div class="request-popup__honeypot" aria-hidden="true">
                    <label>
                        Website
                        <input type="text" name="website" tabindex="-1" autocomplete="off">
                    </label>
                </div>

                <p class="request-popup__form-status" data-form-status role="status" aria-live="polite"></p>

                <div class="request-popup__actions">
                    <button class="request-popup__submit" type="submit">Надіслати заявку</button>
                </div>
            </form>
        </div>
    </div>
</div>
