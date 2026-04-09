<?php
/**
 * Services reasons section — hex-grid v2.
 *
 * All hex positions derive from a single modular grid:
 *   --hex-box  (bounding square of base hex)
 *   --hex-step (center-to-center distance, same for x and y)
 *   Row 0 (even): x = col × step
 *   Row 1 (odd):  x = col × step + step / 2
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$reasons_stack_icons = [
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-1_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-2_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-3_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-4_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-5_result.webp',
    'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/icon-6_result.webp',
];

$reasons_cursor_icon = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/cursor-5.svg';
$reasons_side_photo  = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/621_result.webp';
$reasons_lower_photo = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Polygon-110_result.webp';
?>
<section class="hex-reasons" aria-labelledby="hex-reasons-title">
    <div class="hex-reasons__head">
        <div class="hex-reasons__eyebrow">
            <img
                class="hex-reasons__eyebrow-icon"
                src="<?php echo esc_url( $logo_mark_url ); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="hex-reasons__eyebrow-text">Чому ми</p>
        </div>

        <h2 class="hex-reasons__title" id="hex-reasons-title">
            Ми не просто кодимо — ми глибоко занурюємось у бізнес клієнта, щоб
            створювати рішення, які не лише автоматизують, а й посилюють ефективність.
        </h2>
    </div>

    <div class="hex-reasons__scene" role="list" aria-label="Переваги GraffiT">

        <!-- ══ Decorative outline hex — row 0, col 0 (partially off-screen left) ══ -->
        <div
            class="hex-reasons__hex hex-reasons__hex--outline hex-reasons__hex--r0c0"
            aria-hidden="true"
        ></div>

        <!-- ══ Row 0, Col 1 — «Ми не нав'язуємо готову коробку» ══ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r0c1"
            role="listitem"
            aria-label="Ми не нав'язуємо готову коробку"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Ми не нав'язуємо готову "коробку"</h3>
                <p class="hex-reasons__hex-sub">створюємо рішення під ваші задачі</p>
            </div>
        </article>

        <!-- ══ Row 0, Col 2 — Enterprise stack ══ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r0c2"
            role="listitem"
            aria-label="Працюємо в стеку, який сумісний з вимогами enterprise"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading hex-reasons__hex-heading--narrow">Працюємо в стеку, який сумісний з вимогами enterprise:</h3>
                <div class="hex-reasons__icons" aria-hidden="true">
                    <?php foreach ( $reasons_stack_icons as $icon_url ) : ?>
                        <span class="hex-reasons__icon-wrap">
                            <img
                                class="hex-reasons__icon-img"
                                src="<?php echo esc_url( $icon_url ); ?>"
                                alt=""
                                width="32"
                                height="32"
                                loading="lazy"
                                decoding="async"
                            >
                        </span>
                    <?php endforeach; ?>
                </div>
                <p class="hex-reasons__hex-caption">Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first</p>
            </div>
        </article>

        <!-- ══ Photo — large (row 0 area, right side, scaled up) ══ -->
        <div
            class="hex-reasons__hex hex-reasons__hex--photo hex-reasons__hex--photo-lg hex-reasons__hex--plg"
            aria-hidden="true"
        >
            <img
                class="hex-reasons__hex-img"
                src="<?php echo esc_url( $reasons_side_photo ); ?>"
                alt=""
                width="559"
                height="559"
                loading="lazy"
                decoding="async"
            >
        </div>

        <!-- ══ Row 1, Col 0 — Складні кейси ══ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c0"
            role="listitem"
            aria-label="Допомагаємо в складних кейсах"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Допомагаємо в складних кейсах,</h3>
                <p class="hex-reasons__hex-sub">де інші кажуть "так не робиться"</p>
                <img
                    class="hex-reasons__cursor-img"
                    src="<?php echo esc_url( $reasons_cursor_icon ); ?>"
                    alt=""
                    width="28"
                    height="26"
                    loading="lazy"
                    decoding="async"
                >
            </div>
        </article>

        <!-- ══ Row 1, Col 1 — Інтеграція ══ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c1"
            role="listitem"
            aria-label="Інтегруємось у вже існуючий ландшафт"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Інтегруємось у вже існуючий ландшафт</h3>
                <p class="hex-reasons__hex-sub">(1С, CRM, ERP, маркетплейси, POS тощо)</p>
            </div>
        </article>

        <!-- ══ Row 1, Col 2 — Документація ══ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c2"
            role="listitem"
            aria-label="Даємо чітку документацію"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Даємо чітку документацію,</h3>
                <p class="hex-reasons__hex-sub">підтримку після запуску і прозору комунікацію</p>
            </div>
        </article>

        <!-- ══ Photo — small (row 1 area, right side, scaled down) ══ -->
        <div
            class="hex-reasons__hex hex-reasons__hex--photo hex-reasons__hex--photo-sm hex-reasons__hex--psm"
            aria-hidden="true"
        >
            <img
                class="hex-reasons__hex-img"
                src="<?php echo esc_url( $reasons_lower_photo ); ?>"
                alt=""
                width="365"
                height="365"
                loading="lazy"
                decoding="async"
            >
        </div>
    </div>
</section>
