<?php
/**
 * About tech stack section.
 *
 * @package graffit
 */

declare(strict_types=1);

$stack_items = [
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics1.svg',
        'label'    => 'Java',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics2.svg',
        'label'    => 'Kotlin',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics3.svg',
        'label'    => 'PostgreSQL',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics4.svg',
        'label'    => 'Angular',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics5.svg',
        'label'    => 'Kafka',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics6.svg',
        'label'    => 'Docker',
    ],
    [
        'icon_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/ics7.svg',
        'label'    => 'Spring Boot',
    ],
];
?>
<section class="about-stack" aria-labelledby="about-stack-title">
    <div class="about-stack__container">
        <h2 class="about-stack__title" id="about-stack-title">
            У підсумку клієнти отримують контроль, ефективність і впевненість у розвитку
        </h2>

        <p class="about-stack__lead">
            Використовуємо сучасний стек і закладаємо масштабованість із самого початку:
        </p>

        <div class="about-stack__grid" role="list" aria-label="Технологічний стек GraffIT">
            <?php foreach ($stack_items as $index => $stack_item) : ?>
                <?php
                $card_classes = ['about-stack__card'];

                if (! empty($stack_item['active'])) {
                    $card_classes[] = 'is-active';
                }

                $card_classes[] = 'about-stack__card--' . ($index + 1);
                ?>
                <article class="<?php echo esc_attr(implode(' ', $card_classes)); ?>" role="listitem" aria-label="<?php echo esc_attr($stack_item['label']); ?>">
                    <span class="about-stack__card-inner">
                        <img
                            class="about-stack__icon"
                            src="<?php echo esc_url($stack_item['icon_url']); ?>"
                            alt=""
                            width="80"
                            height="80"
                            loading="lazy"
                            decoding="async"
                        >
                    </span>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
