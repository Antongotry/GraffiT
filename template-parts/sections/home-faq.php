<?php
/**
 * Front page FAQ accordion section.
 *
 * @package graffit
 */

declare(strict_types=1);

$faq_icon_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8694.svg?v=2';
$faq_chevron_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-1321316906.svg';

$faq_left = [
    [
        'question' => 'Які IT-рішення для бізнесу ви пропонуєте?',
        'answer'   => 'Ми створюємо індивідуальні програмні рішення під задачі бізнесу, готові IT-продукти для рітейлу, логістики та продажів, а також надаємо консалтинг, підтримку й розвиток систем. Наш фокус — не просто написати код, а глибоко розібратися у бізнес-процесах, автоматизувати ручну рутину, інтегрувати рішення в існуючий ландшафт і зробити бізнес більш керованим, масштабованим та ефективним.',
    ],
    [
        'question' => 'Чи надаєте ви IT-підтримку після запуску системи?',
        'answer'   => 'Так. Ми супроводжуємо рішення після запуску, допомагаємо команді адаптуватися до системи, підтримуємо стабільну роботу продукту та розвиваємо його під нові потреби бізнесу. Для нас запуск — це не фінальна точка, а початок довгострокового партнерства.',
    ],
    [
        'question' => 'Чи можна замовити розробку програмного забезпечення під ключ?',
        'answer'   => 'Так. GraffIT бере на себе повний цикл роботи: аналіз задач і бізнес-процесів, проєктування архітектури, розробку, тестування, запуск, навчання команди та подальшу підтримку. Рішення створюється не за шаблоном, а під реальні процеси, інтеграції та цілі конкретного бізнесу.',
    ],
];

$faq_right = [
    [
        'question' => 'Які готові IT-продукти для рітейлу та логістики у вас є?',
        'answer'   => 'У GraffIT є готові програмні продукти, створені на основі 18 років корпоративної експертизи: PCЛояльті для управління бонусами, знижками та програмами лояльності, CAF для фінансових процесів, Butler для управління бізнес-операціями й завданнями, а також MediaHub для централізованого керування контентом, акціями та рекламними матеріалами в різних каналах.',
    ],
    [
        'question' => 'Чи працюєте ви з компаніями за межами України?',
        'answer'   => 'Ми розглядаємо запити індивідуально й працюємо з бізнесами різного масштабу та складності. Якщо ваша компанія працює за межами України, залиште заявку — ми уточнимо ваші задачі, технічний ландшафт, інтеграції та можливий формат співпраці.',
    ],
    [
        'question' => 'Скільки часу займає розробка програмного рішення?',
        'answer'   => 'Термін залежить від складності задачі, кількості інтеграцій, обсягу функціоналу та поточного стану бізнес-процесів. Саме тому ми починаємо з аналізу: фіксуємо потреби, перекладаємо їх у зрозумілі вимоги, проєктуємо рішення і тільки після цього можемо точніше оцінити етапи та строки реалізації.',
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
