<?php
/**
 * Product MediaHub — «В результаті використання MediaHub» (intro + benefits grid).
 *
 * @package graffit
 */

declare(strict_types=1);

$mediahub_results_eyebrow_icon_url = get_template_directory_uri() . '/assets/images/mediahub-benefits-eyebrow.svg';

$mediahub_results_cards = [
    [
        'title' => 'Зникає хаос',
        'text' => 'не потрібно бігати між локаціями й вручну змінювати контент – все централізовано.',
        'image' => 1,
        'text_modifier' => '',
    ],
    [
        'title' => 'Менше витрат',
        'text' => 'одна система замість десятків розрізнених процесів.',
        'image' => 2,
        'text_modifier' => 'mediahub-results__card-text--narrow',
    ],
    [
        'title' => 'Більше продажів',
        'text' => 'Клієнти бачать актуальні акції й пропозиції саме тоді, коли потрібно — і частіше купують.',
        'image' => 3,
        'text_modifier' => '',
    ],
    [
        'title' => 'Прозорий контроль',
        'text' => 'Зрозуміла аналітика допомагає оцінювати ефективність реклами й швидко коригувати кампанії.',
        'image' => 4,
        'text_modifier' => '',
    ],
    [
        'title' => 'Нові джерела доходу',
        'text' => 'Екрани можна монетизувати — продавати рекламні слоти партнерам і брендам.',
        'image' => 5,
        'text_modifier' => '',
    ],
];
?>
<section class="mediahub-results" aria-labelledby="mediahub-results-title">
    <div class="mediahub-results__inner">
        <div class="mediahub-results__layout">
            <header class="mediahub-results__intro">
                <div class="mediahub-results__eyebrow">
                    <img
                        class="mediahub-results__eyebrow-icon"
                        src="<?php echo esc_url($mediahub_results_eyebrow_icon_url); ?>"
                        alt=""
                        width="29"
                        height="32"
                        aria-hidden="true"
                        loading="eager"
                        decoding="async"
                    >
                    <p class="mediahub-results__eyebrow-text">Переваги</p>
                </div>
                <h2 id="mediahub-results-title" class="mediahub-results__title">
                    В результаті використання MediaHub
                </h2>
            </header>

            <?php foreach ($mediahub_results_cards as $card) : ?>
                <?php
                $img_url = graffit_product_mediahub_result_image_url((int) $card['image']);
                $text_classes = ['mediahub-results__card-text'];
                if ($card['text_modifier'] !== '') {
                    $text_classes[] = $card['text_modifier'];
                }
                ?>
                <div class="mediahub-results__cell mediahub-results__cell--card">
                    <article class="mediahub-results__card">
                        <img
                            class="mediahub-results__flag"
                            src="<?php echo esc_url($img_url); ?>"
                            alt=""
                            width="64"
                            height="90"
                            loading="lazy"
                            decoding="async"
                            aria-hidden="true"
                        >
                        <h3 class="mediahub-results__card-title"><?php echo esc_html($card['title']); ?></h3>
                        <p class="<?php echo esc_attr(implode(' ', $text_classes)); ?>">
                            <?php echo esc_html($card['text']); ?>
                        </p>
                    </article>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
