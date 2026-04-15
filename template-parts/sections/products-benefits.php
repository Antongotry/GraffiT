<?php
/**
 * Products page benefits section.
 *
 * @package graffit
 */

declare(strict_types=1);

$product_benefits = [
    [
        'icon' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1df.svg',
        'text' => "Швидке впровадження:\nне треба чекати місяцями",
    ],
    [
        'icon' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2df.svg',
        'text' => 'Адаптація під ваші процеси та існуючий ландшафт',
    ],
    [
        'icon' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/3df.svg',
        'text' => 'Підходять як для малого бізнесу, так і для мереж',
    ],
    [
        'icon' => 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/4df.svg',
        'text' => 'Економія витрат на розробку «з нуля»',
    ],
];
?>
<section class="products-benefits" aria-labelledby="products-benefits-title">
    <div class="products-benefits__container">
        <div class="products-benefits__intro">
            <h2 class="products-benefits__title" id="products-benefits-title">
                Кожен бізнес стикається з однаковими викликами: контроль, прозорість, швидкість.
            </h2>

            <p class="products-benefits__description">
                Ми перетворили ці задачі на продукти, створені за тими ж принципами, що й корпоративні рішення:
                стабільність, масштабованість і надійність, перевірені у проєктах лідерів ринку.
            </p>
        </div>

        <div class="products-benefits__grid">
            <?php foreach ($product_benefits as $benefit) : ?>
                <article class="products-benefits__card">
                    <img
                        class="products-benefits__card-icon"
                        src="<?php echo esc_url($benefit['icon']); ?>"
                        alt=""
                        width="64"
                        height="91"
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                    >

                    <p class="products-benefits__card-text">
                        <?php echo nl2br(esc_html((string) $benefit['text'])); ?>
                    </p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
