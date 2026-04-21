<?php
/**
 * Front page about trust section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_about_eyebrow_icon_url = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8694.svg';

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
<section class="home-about services-clients js-clients-scroller" id="home-about" aria-labelledby="home-about-title">
    <div class="services-clients__viewport">
        <div class="services-clients__container">
            <div class="services-clients__layout">
                <div class="services-clients__copy">
                    <div class="services-clients__eyebrow">
                        <img
                            class="services-clients__eyebrow-icon"
                            src="<?php echo esc_url($home_about_eyebrow_icon_url); ?>"
                            alt=""
                            width="28"
                            height="28"
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                        >
                        <p class="services-clients__eyebrow-text">Про нас</p>
                    </div>

                    <h2 class="services-clients__title" id="home-about-title">
                        <span class="services-clients__title-line"><strong>GraffIT</strong> — команда, що вийшла з </span>
                        <span class="services-clients__title-line">великого внутрішнього ІТ-департаменту, </span>
                        <span class="services-clients__title-line">який десятиліттями будував </span>
                        <span class="services-clients__title-line">інфраструктуру для торговельних </span>
                        <span class="services-clients__title-line">мереж, логістичних компаній, </span>
                        <span class="services-clients__title-line">сервісного та виробничого бізнесу.</span>
                    </h2>

                    <p class="services-clients__text">
                        Сьогодні цей досвід ми перенесли у комерційні проєкти й сформували підхід, що базується на реальних потребах клієнтів.
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
