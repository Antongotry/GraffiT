<?php
/**
 * Services clients trust section.
 *
 * @package graffit
 */

declare(strict_types=1);

$extra_class = trim((string) ($args['section_extra_class'] ?? ''));
$enable_scroller = $args['enable_scroller'] ?? true;
$section_js_class = trim((string) ($args['section_js_class'] ?? ''));
$section_id = trim((string) ($args['section_id'] ?? ''));

$section_classes = ['services-clients'];

if ($enable_scroller) {
    $section_classes[] = 'js-clients-scroller';
}

if ($extra_class !== '') {
    $section_classes[] = $extra_class;
}

if ($section_js_class !== '') {
    $section_classes[] = $section_js_class;
}

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

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
<section
    class="<?php echo esc_attr(implode(' ', $section_classes)); ?>"
    <?php if ($section_id !== '') : ?>id="<?php echo esc_attr($section_id); ?>"<?php endif; ?>
    aria-labelledby="services-clients-title"
>
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
