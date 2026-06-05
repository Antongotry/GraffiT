<?php
/**
 * 404 section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
$home_url = home_url('/');
$contacts_url = home_url('/contacts/');
?>
<section class="not-found" aria-labelledby="not-found-title">
    <div class="not-found__inner">
        <header class="not-found__intro">
            <div class="not-found__eyebrow">
                <img
                    class="not-found__eyebrow-icon"
                    src="<?php echo esc_url($logo_mark_url); ?>"
                    alt=""
                    width="28"
                    height="32"
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                >
                <p class="not-found__eyebrow-text">Помилка</p>
            </div>

            <p class="not-found__code" aria-hidden="true">404</p>

            <h1 class="not-found__title" id="not-found-title">Сторінку не знайдено</h1>

            <p class="not-found__lead">
                Можливо, посилання застаріло або сторінку переміщено. Поверніться на головну або звʼяжіться з нами — допоможемо знайти потрібне.
            </p>
        </header>

        <div class="not-found__actions">
            <a class="not-found__cta not-found__cta--primary" href="<?php echo esc_url($home_url); ?>">
                На головну
            </a>
            <a class="not-found__cta not-found__cta--ghost" href="<?php echo esc_url($contacts_url); ?>">
                Контакти
            </a>
        </div>
    </div>
</section>
