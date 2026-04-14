<?php
/**
 * Front page chaos section.
 *
 * @package graffit
 */

declare(strict_types=1);

$home_chaos_image = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-1707480434_result.webp?v=home-chaos-1';
?>
<section class="home-chaos" aria-label="<?php esc_attr_e('Коли бізнес росте — разом із ним хаос', 'graffit'); ?>">
    <div class="home-chaos__inner">
        <h2 class="home-chaos__display">
            Бізнес росте<br>
            — і разом<br>
            із ним хаос
        </h2>

        <div class="home-chaos__visual" aria-hidden="true">
            <img
                class="home-chaos__image"
                src="<?php echo esc_url($home_chaos_image); ?>"
                alt=""
                width="1866"
                height="1696"
                loading="lazy"
                decoding="async"
            >
        </div>

        <p class="home-chaos__headline">
            Коли шаблонні рішення<br>
            не працюють<br>
            — ми створюємо свої
        </p>

        <p class="home-chaos__experience">&gt;18 років досвіду</p>
        <p class="home-chaos__copy">
            лежать в основі<br>
            нашого розуміння саме<br>
            таких задач
        </p>
    </div>
</section>
