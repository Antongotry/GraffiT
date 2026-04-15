<?php
/**
 * Product MediaHub — «Для кого MediaHub» (audience cards).
 *
 * Desktop grid 3 + 2; sizes from 1440 → vw. Images 1l–5l in screenshot order.
 *
 * @package graffit
 */

declare(strict_types=1);

$mediahub_audience_cards = [
    [
        'image' => 1,
        'title' => 'Торговельні мережі',
        'text' => 'централізований контроль акцій і знижок у всіх магазинах.',
        'modifier' => '',
    ],
    [
        'image' => 2,
        'title' => 'Аптеки',
        'text' => 'швидке оновлення цін і спецпропозицій у різних локаціях.',
        'modifier' => 'mediahub-audience__card--body-wide',
    ],
    [
        'image' => 3,
        'title' => 'ТРЦ і сервісні точки',
        'text' => 'керування рекламними слотами для орендарів і партнерів.',
        'modifier' => '',
    ],
    [
        'image' => 4,
        'title' => 'E-commerce шоуруми',
        'text' => 'синхронізація онлайн-акцій з офлайн-екранами.',
        'modifier' => 'mediahub-audience__card--head-wide',
    ],
    [
        'image' => 5,
        'title' => 'Виробничі компанії з торговими точками',
        'text' => 'уніфіковане вікно для комунікації з клієнтом у залі.',
        'modifier' => 'mediahub-audience__card--tall-head',
    ],
];
?>
<section class="mediahub-audience" aria-labelledby="mediahub-audience-title">
    <div class="mediahub-audience__inner">
        <h2 id="mediahub-audience-title" class="mediahub-audience__title">Для кого MediaHub</h2>

        <div class="mediahub-audience__grid">
            <?php foreach ($mediahub_audience_cards as $card) : ?>
                <?php
                $card_classes = ['mediahub-audience__card'];
                if ($card['modifier'] !== '') {
                    $card_classes[] = $card['modifier'];
                }
                $img_url = graffit_product_mediahub_audience_image_url((int) $card['image']);
                ?>
                <article class="<?php echo esc_attr(implode(' ', $card_classes)); ?>">
                    <div class="mediahub-audience__thumb" style="--mediahub-audience-thumb: url('<?php echo esc_url($img_url); ?>');">
                        <span class="mediahub-audience__thumb-glow" aria-hidden="true"></span>
                    </div>
                    <h3 class="mediahub-audience__card-title"><?php echo esc_html($card['title']); ?></h3>
                    <div class="mediahub-audience__rule" aria-hidden="true"></div>
                    <p class="mediahub-audience__card-text"><?php echo esc_html($card['text']); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
