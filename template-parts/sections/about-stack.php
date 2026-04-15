<?php
/**
 * About tech stack section.
 *
 * @package graffit
 */

declare(strict_types=1);

$stack_items = [
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h1_result.webp',
        'label'           => 'Java',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h2_result.webp',
        'label'           => 'Kotlin',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/3noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h3_result.webp',
        'label'           => 'PostgreSQL',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/4noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h4_result.webp',
        'label'           => 'Angular',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/5noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h5_result.webp',
        'label'           => 'Kafka',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/6noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h6_result.webp',
        'label'           => 'Docker',
    ],
    [
        'image_url'       => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/7noa_result.webp',
        'hover_image_url' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/h7_result.webp',
        'label'           => 'Spring Boot',
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
                            class="about-stack__image about-stack__image--default"
                            src="<?php echo esc_url($stack_item['image_url']); ?>"
                            alt=""
                            width="186"
                            height="217"
                            loading="lazy"
                            decoding="async"
                        >
                        <?php if (! empty($stack_item['hover_image_url'])) : ?>
                            <img
                                class="about-stack__image about-stack__image--hover"
                                src="<?php echo esc_url($stack_item['hover_image_url']); ?>"
                                alt=""
                                width="186"
                                height="217"
                                loading="lazy"
                                decoding="async"
                            >
                        <?php endif; ?>
                    </span>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
