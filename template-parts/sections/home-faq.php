<?php
/**
 * Front page FAQ accordion section.
 *
 * @package graffit
 */

declare(strict_types=1);

$faq_icon_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8694.svg?v=2';
$faq_chevron_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-1321316906.svg';

$faq_placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

$faq_left = [
    [
        'question' => 'Які IT-рішення для бізнесу ви пропонуєте?',
        'answer' => $faq_placeholder,
    ],
    [
        'question' => 'Чи надаєте ви IT-підтримку після запуску системи?',
        'answer' => $faq_placeholder,
    ],
    [
        'question' => 'Чи можна замовити розробку програмного забезпечення під ключ?',
        'answer' => $faq_placeholder,
    ],
];

$faq_right = [
    [
        'question' => 'Які готові IT-продукти для рітейлу та логістики у вас є?',
        'answer' => $faq_placeholder,
    ],
    [
        'question' => 'Чи працюєте ви з компаніями за межами України?',
        'answer' => $faq_placeholder,
    ],
    [
        'question' => 'Скільки часу займає розробка програмного рішення?',
        'answer' => $faq_placeholder,
    ],
];
?>
<section class="home-faq" aria-labelledby="home-faq-title">
    <div class="home-faq__container">
        <div class="home-faq__eyebrow">
            <img
                class="home-faq__eyebrow-icon"
                src="<?php echo esc_url($faq_icon_url); ?>"
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
                            <img
                                class="home-faq__chevron"
                                src="<?php echo esc_url($faq_chevron_url); ?>"
                                alt=""
                                width="14"
                                height="14"
                                loading="lazy"
                                decoding="async"
                                aria-hidden="true"
                            >
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
                            <img
                                class="home-faq__chevron"
                                src="<?php echo esc_url($faq_chevron_url); ?>"
                                alt=""
                                width="14"
                                height="14"
                                loading="lazy"
                                decoding="async"
                                aria-hidden="true"
                            >
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
