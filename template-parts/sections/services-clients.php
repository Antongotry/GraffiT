<?php
/**
 * Services clients trust section.
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$trust_cards = [
    [
        'title' => 'Розуміння бізнесу',
        'text' => 'Багаторічна експертиза дозволяє будувати системи, які працюють на бізнес, а не проти нього.',
        'icon' => 'insight',
    ],
    [
        'title' => 'Нічого зайвого',
        'text' => 'Кожне рішення під конкретні задачі та масштаб компанії.',
        'icon' => 'focus',
    ],
    [
        'title' => 'Досвід роботи з лідерами ринку',
        'text' => 'Розуміємо вимоги великого бізнесу й будуємо рішення, що витримують навантаження.',
        'icon' => 'market',
    ],
    [
        'title' => 'Масштабованість',
        'text' => 'Створюємо архітектуру, яка росте разом із бізнесом.',
        'icon' => 'scale',
    ],
    [
        'title' => 'Партнерство',
        'text' => 'Не просто виконуємо завдання — підказуємо, як зробити ефективніше.',
        'icon' => 'partnership',
    ],
];
?>
<section class="services-clients js-clients-scroller" aria-labelledby="services-clients-title">
    <div class="services-clients__viewport">
        <div class="services-clients__container">
            <div class="services-clients__layout">
                <div class="services-clients__copy">
                    <div class="services-clients__eyebrow">
                        <img
                            class="services-clients__eyebrow-icon"
                            src="<?php echo esc_url($logo_mark_url); ?>"
                            alt=""
                            width="28"
                            height="32"
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                        >
                        <p class="services-clients__eyebrow-text">Чому клієнти обирають GraffIT</p>
                    </div>

                    <h2 class="services-clients__title" id="services-clients-title">
                        Уже 18 років наші рішення працюють у компаніях, де якість, безпека й надійність мають критичне значення. Нас обирають ті, хто не може дозволити собі збоїв — і саме тому довіряють <strong>GraffIT</strong>.
                    </h2>

                    <p class="services-clients__text">
                        Кожне рішення GraffIT — це результат аналітики, досвіду та відповідальності перед бізнесом клієнта.
                    </p>
                </div>

                <div class="services-clients__cards-stage js-clients-stage">
                    <div class="services-clients__cards-track js-clients-track">
                        <?php foreach ($trust_cards as $trust_card) : ?>
                            <?php get_template_part('template-parts/components/trust', 'card', $trust_card); ?>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
