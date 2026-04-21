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

$reasons_hex_defaults = [
    'section_extra_class' => '',
    'eyebrow_text' => 'Чому ми',
    'eyebrow_icon_url' => $logo_mark_url,
    'title_id' => 'hex-reasons-title',
    'title_class_extra' => '',
    'custom_title_lines' => null,
];
$reasons_hex = wp_parse_args(
    isset($args) && is_array($args) ? $args : [],
    $reasons_hex_defaults
);

$reasons_section_classes = 'hex-reasons';
if ($reasons_hex['section_extra_class'] !== '') {
    $reasons_section_classes .= ' ' . sanitize_html_class($reasons_hex['section_extra_class']);
}

$reasons_title_classes = trim('hex-reasons__title ' . $reasons_hex['title_class_extra']);

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

$reasons_side_photo  = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/621_result.webp';
$reasons_lower_photo = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Polygon-110_result.webp';
/** Mobile row 2: single composite (three hexes in one asset). */
$hex_mobile_row2_composite_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-1707480427_result.webp';
/** Mobile row 3: two hexes + side FiCSS blocks. */
$hex_mobile_row3_composite_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2134_result.webp';
/** Mobile row 4: single hex photo composite. */
$hex_mobile_row4_composite_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/44444_result.webp';

$cover_style   = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['cover'] ) );
$primary_style = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['primary'] ) );
$stack_style   = sprintf( "--hex-card-bg: url('%s');", esc_url_raw( $hex_card_images['stack'] ) );
$home_card_style = $reasons_hex['section_extra_class'] === 'hex-reasons--home'
    ? sprintf(
        "--hex-card-bg: url('%s'); --hex-card-bg-hover: url('%s');",
        esc_url_raw($hex_card_images['stack']),
        esc_url_raw($hex_card_images['primary'])
    )
    : $stack_style;
?>
<section class="<?php echo esc_attr( $reasons_section_classes ); ?>" aria-labelledby="<?php echo esc_attr( (string) $reasons_hex['title_id'] ); ?>">
    <div class="hex-reasons__head">
        <div class="hex-reasons__eyebrow">
            <img
                class="hex-reasons__eyebrow-icon"
                src="<?php echo esc_url( (string) $reasons_hex['eyebrow_icon_url'] ); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="hex-reasons__eyebrow-text"><?php echo esc_html( (string) $reasons_hex['eyebrow_text'] ); ?></p>
        </div>

        <h2 class="<?php echo esc_attr( $reasons_title_classes ); ?>" id="<?php echo esc_attr( (string) $reasons_hex['title_id'] ); ?>">
            <?php
            if (! empty( $reasons_hex['custom_title_lines'] ) && is_array( $reasons_hex['custom_title_lines'] )) {
                $lines = array_values( array_filter( $reasons_hex['custom_title_lines'], 'is_string' ) );
                echo esc_html( (string) ( $lines[0] ?? '' ) );
                for ( $ri = 1, $rlen = count( $lines ); $ri < $rlen; $ri++ ) {
                    echo '<br>';
                    echo esc_html( (string) $lines[ $ri ] );
                }
            } else {
                ?>
            Ми не просто кодимо — ми глибоко занурюємось у бізнес клієнта, щоб
            створювати рішення, які не лише автоматизують, а й посилюють ефективність.
                <?php
            }
            ?>
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
            style="<?php echo esc_attr( $home_card_style ); ?>"
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
            style="<?php echo esc_attr( $home_card_style ); ?>"
            role="listitem"
            aria-label="Допомагаємо в складних кейсах"
        >
            <div class="hex-reasons__hex-body">
                <h3 class="hex-reasons__hex-heading">Допомагаємо в складних кейсах,</h3>
                <p class="hex-reasons__hex-sub">де інші кажуть "так не робиться"</p>
            </div>
        </article>

        <!-- ═ row 1 · col 1 — Інтеграція ═ -->
        <article
            class="hex-reasons__hex hex-reasons__hex--card hex-reasons__hex--r1c1"
            style="<?php echo esc_attr( $home_card_style ); ?>"
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
            style="<?php echo esc_attr( $home_card_style ); ?>"
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

            <!-- Row 2 (mobile): composite + centered 238 tile overlay (FiCSS 144×82 block) -->
            <div class="hex-reasons__m-row-bottom">
                <img
                    class="hex-reasons__m-row2-composite"
                    src="<?php echo esc_url( $hex_mobile_row2_composite_url ); ?>"
                    alt=""
                    width="1125"
                    height="732"
                    loading="lazy"
                    decoding="async"
                >
                <div class="hex-reasons__m-row2-hit">
                    <div class="hex-reasons__m-row2-block">
                        <p class="hex-reasons__m-row2-body-sm"><?php echo esc_html( 'Допомагаємо в складних кейсах, ' ); ?></p>
                        <p class="hex-reasons__m-row2-caption"><?php echo esc_html( 'де інші кажуть "так не робиться"' ); ?></p>
                    </div>
                </div>
            </div>

            <!-- Row 3 (mobile): two-hex composite + 238 tiles left/right (FiCSS blocks) -->
            <div class="hex-reasons__m-row3">
                <img
                    class="hex-reasons__m-row3-composite"
                    src="<?php echo esc_url( $hex_mobile_row3_composite_url ); ?>"
                    alt=""
                    width="1125"
                    height="714"
                    loading="lazy"
                    decoding="async"
                >
                <div class="hex-reasons__m-row3-hit hex-reasons__m-row3-hit--left">
                    <div class="hex-reasons__m-row3-block">
                        <p class="hex-reasons__m-row3-body-sm"><?php echo esc_html( 'Даємо чітку документацію, ' ); ?></p>
                        <p class="hex-reasons__m-row3-caption"><?php echo esc_html( 'підтримку після запуску і прозору комунікацію' ); ?></p>
                    </div>
                </div>
                <div class="hex-reasons__m-row3-hit hex-reasons__m-row3-hit--right">
                    <div class="hex-reasons__m-row3-block-2">
                        <p class="hex-reasons__m-row3-body-sm"><?php echo esc_html( 'Інтегруємось у вже існуючий ландшафт' ); ?></p>
                        <p class="hex-reasons__m-row3-caption-2"><?php echo esc_html( '(1С, CRM, ERP, маркетплейси, POS тощо)' ); ?></p>
                    </div>
                </div>
            </div>

            <!-- Row 4 (mobile): hex photo strip -->
            <div class="hex-reasons__m-row4">
                <img
                    class="hex-reasons__m-row4-composite"
                    src="<?php echo esc_url( $hex_mobile_row4_composite_url ); ?>"
                    alt=""
                    width="1089"
                    height="1251"
                    loading="lazy"
                    decoding="async"
                >
            </div>
    </div>
</section>
