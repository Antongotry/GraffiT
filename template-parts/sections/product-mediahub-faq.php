<?php
/**
 * Product MediaHub FAQ section.
 *
 * @package graffit
 */

declare(strict_types=1);

$faq_icon_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8694.svg?v=2';

$faq_left = [
    [
        'question' => 'Чи можна показувати різний контент у різних локаціях?',
        'answer'   => 'Так. MediaHub дозволяє показувати різний контент у різних місцях — наприклад, окремі акції для конкретних магазинів, відділів, торгових точок або груп локацій. Це допомагає робити комунікацію точнішою, а рекламні повідомлення — релевантнішими для клієнтів у конкретному місці.',
    ],
    [
        'question' => 'Чи можна планувати покази наперед?',
        'answer'   => 'Так. У MediaHub можна планувати покази заздалегідь: акції, спецпропозиції чи рекламні матеріали запускаються у потрібний день і час автоматично. Це допомагає контролювати рекламний календар на тижні або місяці вперед і зменшує вплив людського фактору.',
    ],
    [
        'question' => 'Які формати контенту підтримує система?',
        'answer'   => 'MediaHub підтримує різні формати контенту: відео, зображення, аудіо та текст. Це дозволяє комбінувати рекламні матеріали, акції, інформаційні повідомлення та інший контент у межах єдиної системи керування.',
    ],
];

$faq_right = [
    [
        'question' => 'Як швидко можна запустити MediaHub?',
        'answer'   => 'MediaHub створений так, щоб спростити запуск і керування контентом: ви завантажуєте матеріали в бібліотеку, формуєте плейлисти, вказуєте час і місце показу, а система транслює контент за заданими правилами. Після налаштування процес оновлення займає кілька кліків, а не тижні ручних погоджень і змін.',
    ],
    [
        'question' => 'Чи потрібне спеціальне обладнання?',
        'answer'   => 'Вимоги залежать від вашої поточної інфраструктури, кількості екранів і формату використання. Залиште заявку — команда GraffIT оцінить вашу ситуацію та підкаже, як оптимально запустити MediaHub саме у вашій мережі.',
    ],
    [
        'question' => 'Яку підтримку ви надаєте після впровадження?',
        'answer'   => 'Після впровадження GraffIT не просто “ставить систему”, а супроводжує клієнта: консультує, допомагає оптимізувати процеси, адаптує підхід під специфіку компанії та підтримує роботу рішення. Мета — щоб MediaHub реально спрощував роботу команди й приносив бізнесу користь.',
    ],
];
?>
<section class="mediahub-faq" id="mediahub-faq" aria-labelledby="mediahub-faq-title">
    <div class="mediahub-faq__container">
        <div class="mediahub-faq__eyebrow">
            <img
                class="mediahub-faq__eyebrow-icon"
                src="<?php echo esc_url($faq_icon_url); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="mediahub-faq__eyebrow-text">FAQ</p>
        </div>

        <h2 class="mediahub-faq__title" id="mediahub-faq-title">Нас часто запитують</h2>

        <div class="mediahub-faq__grid">
            <div class="mediahub-faq__column">
                <?php foreach ($faq_left as $item) : ?>
                    <details class="mediahub-faq__item js-faq-item">
                        <summary class="mediahub-faq__question">
                            <span class="mediahub-faq__question-text"><?php echo esc_html($item['question']); ?></span>
                            <span class="mediahub-faq__chevron" aria-hidden="true"></span>
                        </summary>
                        <div class="mediahub-faq__answer js-faq-answer">
                            <p><?php echo esc_html($item['answer']); ?></p>
                        </div>
                    </details>
                <?php endforeach; ?>
            </div>

            <div class="mediahub-faq__column">
                <?php foreach ($faq_right as $item) : ?>
                    <details class="mediahub-faq__item js-faq-item">
                        <summary class="mediahub-faq__question">
                            <span class="mediahub-faq__question-text"><?php echo esc_html($item['question']); ?></span>
                            <span class="mediahub-faq__chevron" aria-hidden="true"></span>
                        </summary>
                        <div class="mediahub-faq__answer js-faq-answer">
                            <p><?php echo esc_html($item['answer']); ?></p>
                        </div>
                    </details>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
