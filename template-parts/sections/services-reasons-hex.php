<?php
/**
 * Services reasons section — hex-grid v2.
 *
 * Modular hex grid derived from original pixel positions:
 *
 *   hex-box  = 374 px  (square bounding box of each base hex)
 *   step-x   = 404 px  (horizontal center-to-center)
 *   step-y   = 298 px  (vertical center-to-center ≈ 0.797 × box)
 *   half     = 202 px  (odd-row x-offset = step-x / 2)
 *   r0y      = 251 px  (y-center of row 0 from scene top)
 *
 *   Row 0 (even): center_x = col × step-x
 *   Row 1 (odd):  center_x = col × step-x + half
 *   Any row:      center_y = r0y + row × step-y
 *   Position:     left = center_x − width / 2
 *                 top  = center_y − height / 2
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$hex_card_images = [
    'cover'   => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1-card_result.webp',
    'primary' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2-card_result.webp',
    'stack'   => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/4-card_result.webp',
];

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

$cover_style   = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['cover'] ) );
$primary_style = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['primary'] ) );
$stack_style   = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['stack'] ) );
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

    <div class="hex-reasons__scene hex-reasons__scene--desktop" role="list" aria-label="Переваги GraffiT">

        <!-- ═ row 0 · col 0 — decorative outline (half off-screen left) ═ -->
        <div
            class="hex-reasons__hex hex-reasons__hex--outline hex-reasons__hex--r0c0"
            style="<?php echo esc_attr( $cover_style ); ?>"
            aria-hidden="true"
        ></div>

        <!-- ═ row 0 · col 1 — «Ми не нав'язуємо готову коробку» ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r0c1"
            style="<?php echo esc_attr( $primary_style ); ?>"
            role="listitem"
            aria-label="Ми не нав'язуємо готову коробку"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Ми не нав'язуємо готову "коробку"</h3>
                <p class="hex-reasons__hex-sub">створюємо рішення під ваші задачі</p>
            </div>
        </article>

        <!-- ═ row 0 · col 2 — Enterprise stack ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r0c2"
            style="<?php echo esc_attr( $stack_style ); ?>"
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

        <!-- ═ photo large — grid ~(3.227, −0.388) ═ -->
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

        <!-- ═ row 1 · col 0 — Складні кейси ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c0"
            style="<?php echo esc_attr( $stack_style ); ?>"
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

        <!-- ═ row 1 · col 1 — Інтеграція ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c1"
            style="<?php echo esc_attr( $stack_style ); ?>"
            role="listitem"
            aria-label="Інтегруємось у вже існуючий ландшафт"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Інтегруємось у вже існуючий ландшафт</h3>
                <p class="hex-reasons__hex-sub">(1С, CRM, ERP, маркетплейси, POS тощо)</p>
            </div>
        </article>

        <!-- ═ row 1 · col 2 — Документація ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c2"
            style="<?php echo esc_attr( $stack_style ); ?>"
            role="listitem"
            aria-label="Даємо чітку документацію"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Даємо чітку документацію,</h3>
                <p class="hex-reasons__hex-sub">підтримку після запуску і прозору комунікацію</p>
            </div>
        </article>

        <!-- ═ photo small — grid ~(3.431, 1.290) ═ -->
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

    <!-- Mobile row1: 238×238 boxes, tight gap; WebP under FiCSS-scaled copy + icon row -->
    <div class="hex-reasons__mobi" role="region" aria-label="Переваги GraffiT">
            <div class="hex-reasons__m-row1">
                <div class="hex-reasons__m-slot hex-reasons__m-slot--card">
                    <article class="hex-reasons__m-card-tile">
                        <img
                            class="hex-reasons__m-card-bg"
                            src="<?php echo esc_url( $hex_card_images['primary'] ); ?>"
                            alt=""
                            width="374"
                            height="374"
                            loading="lazy"
                            decoding="async"
                            aria-hidden="true"
                        >
                        <div class="hex-reasons__m-card-overlay hex-reasons__m-card-overlay--box">
                            <h3 class="hex-reasons__m-card-boxtitle"><?php echo esc_html( 'Ми не нав\'язуємо готову "коробку"' ); ?></h3>
                            <p class="hex-reasons__m-card-boxcaption">створюємо рішення під ваші задачі</p>
                        </div>
                    </article>
                </div>
                <div class="hex-reasons__m-slot hex-reasons__m-slot--card">
                    <article class="hex-reasons__m-card-tile">
                        <img
                            class="hex-reasons__m-card-bg"
                            src="<?php echo esc_url( $hex_card_images['stack'] ); ?>"
                            alt=""
                            width="374"
                            height="374"
                            loading="lazy"
                            decoding="async"
                            aria-hidden="true"
                        >
                        <div class="hex-reasons__m-card-overlay hex-reasons__m-card-overlay--stack">
                            <p class="hex-reasons__m-stack-lead">Працюємо в стеку, який сумісний з вимогами enterprise:</p>
                            <div class="hex-reasons__m-stack-icons" aria-hidden="true">
                                <?php foreach ( $reasons_stack_icons as $icon_url ) : ?>
                                    <span class="hex-reasons__m-stack-icon-cell">
                                        <img
                                            class="hex-reasons__m-stack-icon-img"
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
                            <p class="hex-reasons__m-stack-caption">Java, Kotlin, Spring Boot, PostgreSQL, Angular, Kafka, Docker, мікросервіси, API-first</p>
                        </div>
                    </article>
                </div>
            </div>

            <div class="hex-reasons__m-grid">
            <div class="hex-reasons__m-hex hex-reasons__m-hex--empty" aria-hidden="true"></div>

            <article class="hex-reasons__m-hex hex-reasons__m-hex--gray">
                <div class="hex-reasons__m-body">
                    <h3 class="hex-reasons__m-heading">Допомагаємо в складних кейсах,</h3>
                    <p class="hex-reasons__m-text">де інші кажуть &quot;так не робиться&quot;</p>
                    <img
                        class="hex-reasons__m-cursor"
                        src="<?php echo esc_url( $reasons_cursor_icon ); ?>"
                        alt=""
                        width="28"
                        height="26"
                        loading="lazy"
                        decoding="async"
                    >
                </div>
            </article>

            <div class="hex-reasons__m-hex hex-reasons__m-hex--img hex-reasons__m-hex--img-sm" aria-hidden="true">
                <img
                    class="hex-reasons__m-img"
                    src="<?php echo esc_url( $reasons_lower_photo ); ?>"
                    alt=""
                    width="365"
                    height="365"
                    loading="lazy"
                    decoding="async"
                >
            </div>

            <article class="hex-reasons__m-hex hex-reasons__m-hex--gray">
                <div class="hex-reasons__m-body">
                    <h3 class="hex-reasons__m-heading">Даємо чітку документацію,</h3>
                    <p class="hex-reasons__m-text">підтримку після запуску і прозору комунікацію</p>
                </div>
            </article>

            <article class="hex-reasons__m-hex hex-reasons__m-hex--gray">
                <div class="hex-reasons__m-body">
                    <h3 class="hex-reasons__m-heading">Інтегруємось у вже існуючий ландшафт</h3>
                    <p class="hex-reasons__m-text">(1С, CRM, ERP, маркетплейси, POS тощо)</p>
                </div>
            </article>

            <div class="hex-reasons__m-hex hex-reasons__m-hex--img hex-reasons__m-hex--img-lg" role="presentation" aria-hidden="true">
                <img
                    class="hex-reasons__m-img"
                    src="<?php echo esc_url( $reasons_side_photo ); ?>"
                    alt=""
                    width="559"
                    height="559"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            </div>
    </div>
</section>
