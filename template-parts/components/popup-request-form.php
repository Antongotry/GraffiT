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
        <div class="request-popup__intro">
            <p class="request-popup__eyebrow">Консультація GraffiT</p>

            <h2 class="request-popup__title" id="<?php echo esc_attr((string) $args['title_id']); ?>">
                Розкажіть, який процес потрібно автоматизувати або посилити
            </h2>

            <p class="request-popup__text">
                Залиште короткий запит, а ми повернемося з наступним кроком, релевантними кейсами та оцінкою, з чого краще почати.
            </p>

            <div class="request-popup__badges" aria-hidden="true">
                <span class="request-popup__badge">18 років досвіду</span>
                <span class="request-popup__badge">Enterprise-підхід</span>
                <span class="request-popup__badge">Під задачі бізнесу</span>
            </div>

            <div class="request-popup__highlights">
                <article class="request-popup__highlight">
                    <p class="request-popup__highlight-value">24h</p>
                    <p class="request-popup__highlight-copy">робочий SLA на первинний контакт</p>
                </article>

                <article class="request-popup__highlight">
                    <p class="request-popup__highlight-value">UX + Dev</p>
                    <p class="request-popup__highlight-copy">аналізуємо процеси, а не тільки код</p>
                </article>
            </div>
        </div>

        <div class="request-popup__form-shell">
            <p class="request-popup__form-kicker">Форма заявки</p>

            <form class="request-popup__form js-request-form" action="<?php echo esc_url(admin_url('admin-ajax.php')); ?>" method="post" novalidate>
                <input type="hidden" name="action" value="graffit_submit_request">
                <input type="hidden" name="source" value="site">
                <input type="hidden" name="source_label" value="Сайт">
                <?php wp_nonce_field('graffit_request_form', 'nonce'); ?>

                <div class="request-popup__fields">
                    <label class="request-popup__field" data-field-wrap="name">
                        <span class="request-popup__field-label">Імʼя*</span>
                        <input class="request-popup__input" type="text" name="name" autocomplete="name" placeholder="Як до вас звертатися" required>
                        <span class="request-popup__field-error" data-field-error="name"></span>
                    </label>

                    <label class="request-popup__field" data-field-wrap="phone">
                        <span class="request-popup__field-label">Телефон*</span>
                        <input class="request-popup__input" type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="+380 (__) ___ __ __" required>
                        <span class="request-popup__field-error" data-field-error="phone"></span>
                    </label>

                    <label class="request-popup__field" data-field-wrap="email">
                        <span class="request-popup__field-label">E-mail*</span>
                        <input class="request-popup__input" type="email" name="email" inputmode="email" autocomplete="email" placeholder="name@company.com" required>
                        <span class="request-popup__field-error" data-field-error="email"></span>
                    </label>

                    <label class="request-popup__field" data-field-wrap="company">
                        <span class="request-popup__field-label">Компанія</span>
                        <input class="request-popup__input" type="text" name="company" autocomplete="organization" placeholder="Назва компанії">
                        <span class="request-popup__field-error" data-field-error="company"></span>
                    </label>
                </div>

                <label class="request-popup__field request-popup__field--textarea" data-field-wrap="message">
                    <span class="request-popup__field-label">Коротко про задачу*</span>
                    <textarea class="request-popup__input request-popup__input--textarea" name="message" rows="5" placeholder="Що потрібно автоматизувати, інтегрувати або покращити?" required></textarea>
                    <span class="request-popup__field-error" data-field-error="message"></span>
                </label>

                <div class="request-popup__checks">
                    <label class="request-popup__checkbox" data-field-wrap="consent">
                        <input class="request-popup__checkbox-input" type="checkbox" name="consent" value="1" required>
                        <span class="request-popup__checkbox-ui" aria-hidden="true">
                            <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                                <path d="M3.5 8.4 6.6 11.5 12.7 4.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </span>
                        <span class="request-popup__checkbox-copy">Погоджуюсь на обробку персональних даних і звʼязок щодо цього запиту.</span>
                    </label>
                    <span class="request-popup__field-error request-popup__field-error--checkbox" data-field-error="consent"></span>

                    <label class="request-popup__checkbox request-popup__checkbox--secondary">
                        <input class="request-popup__checkbox-input" type="checkbox" name="wants_materials" value="1">
                        <span class="request-popup__checkbox-ui" aria-hidden="true">
                            <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                                <path d="M3.5 8.4 6.6 11.5 12.7 4.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </span>
                        <span class="request-popup__checkbox-copy">Надішліть мені на e-mail приклади схожих кейсів або напрям рішення.</span>
                    </label>
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
                    <p class="request-popup__submit-note">Відповідаємо в робочий час і повертаємося з конкретикою, без загальних фраз.</p>
                </div>
            </form>
        </div>
    </div>
</div>
