<?php
/**
 * Projects catalog section (blog archive layout, product landing cards).
 *
 * @package graffit
 */

declare(strict_types=1);

$catalog_items = graffit_projects_catalog_items();
$filters = graffit_projects_catalog_filters();

$featured_item = $catalog_items[0] ?? null;
$secondary_items = array_slice($catalog_items, 1);

$render_project_card = static function (array $item, bool $is_featured): void {
    $permalink = (string) ($item['url'] ?? '');
    $title = (string) ($item['title'] ?? '');
    $meta = (string) ($item['meta'] ?? '');
    $image_url = (string) ($item['image_url'] ?? '');
    $categories = $item['categories'] ?? [];
    $category_slugs = is_array($categories)
        ? implode(' ', array_map(static fn ($slug): string => sanitize_title((string) $slug), $categories))
        : '';
    $tags = $item['tags'] ?? [];
    $card_class = $is_featured ? 'blog-post blog-post--featured' : 'blog-post blog-post--compact';
    $media_class = $is_featured ? 'blog-post__media blog-post__media--featured' : 'blog-post__media blog-post__media--compact';
    ?>
    <article
        class="<?php echo esc_attr($card_class); ?>"
        data-blog-post
        data-blog-categories="<?php echo esc_attr($category_slugs); ?>"
    >
        <div class="blog-post__content">
            <?php if ($meta !== '') : ?>
                <p class="blog-post__date"><?php echo esc_html($meta); ?></p>
            <?php endif; ?>

            <h2 class="blog-post__title">
                <a href="<?php echo esc_url($permalink); ?>">
                    <?php echo esc_html($title); ?>
                </a>
            </h2>

            <?php if (is_array($tags) && $tags !== []) : ?>
                <div class="blog-post__categories">
                    <?php foreach ($tags as $tag) : ?>
                        <span class="blog-post__category"><?php echo esc_html((string) $tag); ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <a class="<?php echo esc_attr($media_class); ?>" href="<?php echo esc_url($permalink); ?>">
            <?php if ($image_url !== '') : ?>
                <img
                    class="blog-post__image"
                    src="<?php echo esc_url($image_url); ?>"
                    alt=""
                    width="<?php echo $is_featured ? '325' : '150'; ?>"
                    height="<?php echo $is_featured ? '458' : '212'; ?>"
                    loading="lazy"
                    decoding="async"
                >
            <?php else : ?>
                <span class="blog-post__image-fallback" aria-hidden="true"></span>
            <?php endif; ?>
        </a>
    </article>
    <?php
};
?>
<section class="blog-section blog-section--archive" id="projects-catalog">
    <div class="blog-section__container">
        <div class="blog-section__head blog-section__head--archive">
            <div class="blog-section__marker">
                <span class="blog-section__marker-dot" aria-hidden="true"></span>
                <p class="blog-section__marker-text">Проєкти</p>
            </div>

            <h1 class="blog-section__title">Вміємо трансформувати ваші бізнес-запити у зрозумілі та робочі IT-рішення</h1>
        </div>

        <div class="blog-page__filters" aria-label="Категорії проєктів">
            <?php foreach ($filters as $filter) : ?>
                <?php
                $filter_slug = (string) ($filter['slug'] ?? '');
                $filter_label = (string) ($filter['label'] ?? '');
                $is_active = $filter_slug === '';
                ?>
                <button
                    type="button"
                    class="blog-page__filter<?php echo $is_active ? ' is-active' : ''; ?><?php echo $filter_slug === '' ? ' is-all' : ''; ?>"
                    data-blog-filter="<?php echo esc_attr($filter_slug); ?>"
                    <?php echo $is_active ? ' aria-current="true"' : ''; ?>
                >
                    <?php echo esc_html($filter_label); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <?php if ($featured_item) : ?>
            <div class="blog-layout blog-layout--archive">
                <?php $render_project_card($featured_item, true); ?>

                <?php if ($secondary_items !== []) : ?>
                    <div class="blog-layout__side">
                        <?php foreach ($secondary_items as $secondary_item) : ?>
                            <?php $render_project_card($secondary_item, false); ?>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php else : ?>
            <p class="blog-section__empty">Додайте проєкти в каталог, щоб показати цей блок.</p>
        <?php endif; ?>
    </div>
</section>
