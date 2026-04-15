<?php
/**
 * About page trust section.
 *
 * @package graffit
 */

declare(strict_types=1);

$about_eyebrow_icon_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8694.svg';

$trust_cards = [
    [
        'title' => 'Розуміння бізнесу',
        'text' => 'Багаторічна експертиза дозволяє будувати системи, які працюють на бізнес, а не проти нього.',
    ],
    [
        'title' => 'Нічого зайвого',
        'text' => 'Кожне рішення під конкретні задачі та масштаб компанії.',
    ],
    [
        'title' => 'Досвід роботи з лідерами ринку',
        'text' => 'Розуміємо вимоги великого бізнесу й будуємо рішення, що витримують навантаження.',
    ],
    [
        'title' => 'Масштабованість',
        'text' => 'Створюємо архітектуру, яка росте разом із бізнесом.',
    ],
    [
        'title' => 'Партнерство',
        'text' => 'Не просто виконуємо завдання — підказуємо, як зробити ефективніше.',
    ],
];
?>
<section class="about-clients services-clients js-clients-scroller" id="about-clients" aria-labelledby="about-clients-title">
    <div class="services-clients__viewport">
        <div class="services-clients__container">
            <div class="services-clients__layout">
                <div class="services-clients__copy">
                    <div class="services-clients__eyebrow">
                        <img
                            class="services-clients__eyebrow-icon"
                            src="<?php echo esc_url($about_eyebrow_icon_url); ?>"
                            alt=""
                            width="28"
                            height="28"
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                        >
                        <p class="services-clients__eyebrow-text">Чому клієнти обирають GraffIT</p>
                    </div>

                    <h2 class="services-clients__title" id="about-clients-title">
                        <strong>GraffIT</strong> — українська IT-компанія з корінням у корпоративних рішеннях і 18-річним досвідом у рітейлі, логістиці, виробництві та сервісному бізнесі.
                    </h2>

                    <p class="services-clients__text">
                        Ми виросли з внутрішнього IT-департаменту, який десятиліттями будував інфраструктуру для великих компаній. Цей досвід сформував наш принцип: розуміти бізнес глибше, ніж звичайний розробник, і створювати технології, що працюють на результат. Сьогодні ми поєднуємо практику enterprise-розробки з гнучкістю команди, що мислить партнерськи, а не шаблонно.
                    </p>
                </div>

                <div class="services-clients__cards-stage js-clients-stage">
                    <div class="services-clients__cards-track js-clients-track">
                        <?php foreach ($trust_cards as $index => $trust_card) : ?>
                            <?php
                            $trust_card['badge_icon_url'] = sprintf(
                                'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/o%d.svg',
                                $index + 1
                            );
                            ?>
                            <?php get_template_part('template-parts/components/trust', 'card', $trust_card); ?>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
