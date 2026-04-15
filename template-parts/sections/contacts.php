<?php
/**
 * Contacts page: compact layout (data aligned with site footer).
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$phone_display = '(056) 373 28 77';
$phone_href = 'tel:+380563732877';
$email = 'office@pc-service.ua';
$address = '49000, Україна, м. Дніпро, пр.Науки, 40';
?>
<section class="contacts" aria-labelledby="contacts-title">
    <div class="contacts__inner">
        <header class="contacts__intro">
            <div class="contacts__eyebrow">
                <img
                    class="contacts__eyebrow-icon"
                    src="<?php echo esc_url($logo_mark_url); ?>"
                    alt=""
                    width="28"
                    height="32"
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                >
                <p class="contacts__eyebrow-text">Звʼязок</p>
            </div>
            <h1 class="contacts__title" id="contacts-title">Контакти</h1>
            <p class="contacts__lead">
                Залиште заявку або напишіть нам — відповімо та запропонуємо доречний наступний крок.
            </p>
        </header>

        <ul class="contacts__grid" role="list">
            <li class="contacts__card">
                <p class="contacts__label">Телефон</p>
                <a class="contacts__value contacts__value--link" href="<?php echo esc_url($phone_href); ?>"><?php echo esc_html($phone_display); ?></a>
            </li>
            <li class="contacts__card">
                <p class="contacts__label">E-mail</p>
                <a class="contacts__value contacts__value--link" href="<?php echo esc_url('mailto:' . $email); ?>"><?php echo esc_html($email); ?></a>
            </li>
            <li class="contacts__card">
                <p class="contacts__label">Адреса</p>
                <p class="contacts__value"><?php echo esc_html($address); ?></p>
            </li>
        </ul>

        <div class="contacts__actions">
            <a
                class="contacts__cta"
                href="<?php echo esc_url('mailto:' . $email . '?subject=' . rawurlencode('Залишити заявку')); ?>"
                data-popup-open="request"
                data-popup-source="contacts-page"
                data-popup-source-label="Контакти · Залишити заявку"
            >Залишити заявку</a>

            <div class="contacts__socials" aria-label="<?php esc_attr_e('Соціальні мережі', 'graffit'); ?>">
                <a class="contacts__social-link" href="#" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95V21h-4V9Z" fill="currentColor"/>
                    </svg>
                </a>
                <a class="contacts__social-link" href="#" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.5A3.25 3.25 0 0 0 4.5 7.75v8.5A3.25 3.25 0 0 0 7.75 19.5h8.5a3.25 3.25 0 0 0 3.25-3.25v-8.5A3.25 3.25 0 0 0 16.25 4.5h-8.5Zm8.88 1.12a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5a3.5 3.5 0 0 0 0-7Z" fill="currentColor"/>
                    </svg>
                </a>
                <a class="contacts__social-link" href="#" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.48.59a2.98 2.98 0 0 0-2.1 2.1A31.5 31.5 0 0 0 2 12a31.5 31.5 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.1c1.88.59 7.48.59 7.48.59s5.6 0 7.48-.59a2.98 2.98 0 0 0 2.1-2.1A31.5 31.5 0 0 0 22 12a31.5 31.5 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor"/>
                    </svg>
                </a>
                <a class="contacts__social-link" href="#" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M13.5 21v-7h2.35l.35-2.73H13.5v-1.74c0-.8.22-1.34 1.37-1.34h1.46V5.75A19.31 19.31 0 0 0 14.2 5.6c-2.1 0-3.54 1.28-3.54 3.64v2.03H8.3V14h2.36v7h2.84Z" fill="currentColor"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</section>
