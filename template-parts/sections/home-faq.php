<?php
/**
 * Front page FAQ accordion section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$faq_left = [
    [
        'question' => 'Які IT-рішення для бізнесу ви пропонуєте?',
        'answer' => 'Ми розробляємо індивідуальні IT-рішення під ключ, готові продукти для рітейлу, логістики та продажів, а також надаємо консалтинг і підтримку існуючих систем.',
    ],
    [
        'question' => 'Чи надаєте ви IT-підтримку після запуску системи?',
        'answer' => 'Так, ми супроводжуємо кожен проєкт після запуску — оновлення, моніторинг, підтримка користувачів і розвиток функціоналу.',
    ],
    [
        'question' => 'Чи можна замовити розробку програмного забезпечення під ключ?',
        'answer' => 'Так, це один із наших ключових напрямків. Ми беремо на себе весь цикл — від аналізу та проєктування до розробки, тестування й впровадження.',
    ],
];

$faq_right = [
    [
        'question' => 'Які готові IT-продукти для рітейлу та логістики у вас є?',
        'answer' => 'У нас є рішення для автоматизації торговельних мереж, складської логістики, POS-систем та управління ланцюгами поставок.',
    ],
    [
        'question' => 'Чи працюєте ви з компаніями за межами України?',
        'answer' => 'Так, ми працюємо з клієнтами з різних країн і маємо досвід міжнародних проєктів.',
    ],
    [
        'question' => 'Скільки часу займає розробка програмного рішення?',
        'answer' => 'Залежить від складності: від 2–3 місяців для MVP до 6–12 місяців для масштабних enterprise-систем. Точні строки визначаємо після аналізу.',
    ],
];
?>
<section class="home-faq" aria-labelledby="home-faq-title">
    <div class="home-faq__container">
        <div class="home-faq__eyebrow">
            <img
                class="home-faq__eyebrow-icon"
                src="<?php echo esc_url($logo_mark_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="home-faq__eyebrow-text">FAQ</p>
        </div>

        <h2 class="home-faq__title" id="home-faq-title">Нас часто запитують</h2>

        <div class="home-faq__grid">
            <div class="home-faq__column">
                <?php foreach ($faq_left as $item) : ?>
                    <details class="home-faq__item js-faq-item">
                        <summary class="home-faq__question">
                            <span class="home-faq__question-text"><?php echo esc_html($item['question']); ?></span>
                            <span class="home-faq__chevron" aria-hidden="true"></span>
                        </summary>
                        <div class="home-faq__answer">
                            <p><?php echo esc_html($item['answer']); ?></p>
                        </div>
                    </details>
                <?php endforeach; ?>
            </div>

            <div class="home-faq__column">
                <?php foreach ($faq_right as $item) : ?>
                    <details class="home-faq__item js-faq-item">
                        <summary class="home-faq__question">
                            <span class="home-faq__question-text"><?php echo esc_html($item['question']); ?></span>
                            <span class="home-faq__chevron" aria-hidden="true"></span>
                        </summary>
                        <div class="home-faq__answer">
                            <p><?php echo esc_html($item['answer']); ?></p>
                        </div>
                    </details>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
