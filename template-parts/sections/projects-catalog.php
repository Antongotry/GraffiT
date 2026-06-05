<?php
/**
 * Projects archive section (real blog posts, GraffiT layout).
 *
 * @package graffit
 */

declare(strict_types=1);

$logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';

$custom_blog_query = get_query_var('graffit_projects_blog_query');
$blog_query = $custom_blog_query instanceof WP_Query ? $custom_blog_query : null;

$posts = [];

if ($blog_query instanceof WP_Query && ! empty($blog_query->posts)) {
    $posts = $blog_query->posts;
}

$featured_post = $posts[0] ?? null;
$secondary_posts = array_slice($posts, 1);

$categories = get_categories(
    [
        'taxonomy'   => 'category',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]
);

$get_post_categories = static function (int $post_id): array {
    $post_categories = get_the_terms($post_id, 'category');

    if (empty($post_categories) || is_wp_error($post_categories)) {
        return [];
    }

    return array_slice($post_categories, 0, 2);
};

$get_post_category_slugs = static function (int $post_id): array {
    $post_categories = get_the_terms($post_id, 'category');

    if (empty($post_categories) || is_wp_error($post_categories)) {
        return [];
    }

    return array_values(
        array_filter(
            array_map(
                static fn ($category): string => $category instanceof WP_Term ? (string) $category->slug : '',
                $post_categories
            )
        )
    );
};

$current_page = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));
$total_pages = max(1, (int) ($blog_query instanceof WP_Query ? $blog_query->max_num_pages : 1));
$pagination_base = str_replace('999999999', '%#%', esc_url(get_pagenum_link(999999999)));
?>
<section class="projects-catalog blog-section blog-section--archive" id="projects-catalog">
    <div class="blog-section__container">
        <header class="projects-catalog__head blog-section__head blog-section__head--archive">
            <div class="services-projects__eyebrow">
                <img
                    class="services-projects__eyebrow-icon"
                    src="<?php echo esc_url($logo_mark_url); ?>"
                    alt=""
                    width="28"
                    height="32"
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                >
                <p class="services-projects__eyebrow-text">Проєкти</p>
            </div>

            <h1 class="services-projects__title projects-catalog__title" id="projects-catalog-title">
                Вміємо трансформувати ваші бізнес-запити у зрозумілі та робочі IT-рішення
            </h1>
        </header>

        <div class="blog-page__filters" aria-label="Рубрики проєктів">
            <button
                type="button"
                class="blog-page__filter is-active is-all"
                data-blog-filter=""
                aria-current="true"
            >
                Усі проєкти
            </button>

            <?php foreach ($categories as $category) : ?>
                <button
                    type="button"
                    class="blog-page__filter"
                    data-blog-filter="<?php echo esc_attr((string) $category->slug); ?>"
                >
                    <?php echo esc_html($category->name); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <?php if ($featured_post) : ?>
            <?php
            $featured_permalink = get_permalink($featured_post);
            $featured_categories = $get_post_categories((int) $featured_post->ID);
            $featured_category_slugs = $get_post_category_slugs((int) $featured_post->ID);
            ?>
            <div class="blog-layout blog-layout--archive">
                <article
                    class="blog-post blog-post--featured"
                    data-blog-post
                    data-blog-categories="<?php echo esc_attr(implode(' ', $featured_category_slugs)); ?>"
                >
                    <div class="blog-post__content">
                        <time class="blog-post__date" datetime="<?php echo esc_attr(get_the_date('c', $featured_post)); ?>">
                            <?php echo esc_html(get_the_date('d.m.Y', $featured_post)); ?>
                        </time>

                        <h2 class="blog-post__title">
                            <a href="<?php echo esc_url($featured_permalink); ?>">
                                <?php echo esc_html(get_the_title($featured_post)); ?>
                            </a>
                        </h2>

                        <?php if ($featured_categories) : ?>
                            <div class="blog-post__categories">
                                <?php foreach ($featured_categories as $category) : ?>
                                    <span class="blog-post__category"><?php echo esc_html($category->name); ?></span>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <a class="blog-post__media blog-post__media--featured" href="<?php echo esc_url($featured_permalink); ?>">
                        <?php if (has_post_thumbnail($featured_post)) : ?>
                            <?php
                            echo get_the_post_thumbnail(
                                $featured_post,
                                'large',
                                [
                                    'class'    => 'blog-post__image',
                                    'loading'  => 'lazy',
                                    'decoding' => 'async',
                                ]
                            );
                            ?>
                        <?php else : ?>
                            <span class="blog-post__image-fallback" aria-hidden="true"></span>
                        <?php endif; ?>
                    </a>
                </article>

                <?php if ($secondary_posts !== []) : ?>
                    <div class="blog-layout__side">
                        <?php foreach ($secondary_posts as $secondary_post) : ?>
                            <?php
                            $secondary_permalink = get_permalink($secondary_post);
                            $secondary_categories = $get_post_categories((int) $secondary_post->ID);
                            $secondary_category_slugs = $get_post_category_slugs((int) $secondary_post->ID);
                            ?>
                            <article
                                class="blog-post blog-post--compact"
                                data-blog-post
                                data-blog-categories="<?php echo esc_attr(implode(' ', $secondary_category_slugs)); ?>"
                            >
                                <div class="blog-post__content">
                                    <time class="blog-post__date" datetime="<?php echo esc_attr(get_the_date('c', $secondary_post)); ?>">
                                        <?php echo esc_html(get_the_date('d.m.Y', $secondary_post)); ?>
                                    </time>

                                    <h2 class="blog-post__title">
                                        <a href="<?php echo esc_url($secondary_permalink); ?>">
                                            <?php echo esc_html(get_the_title($secondary_post)); ?>
                                        </a>
                                    </h2>

                                    <?php if ($secondary_categories) : ?>
                                        <div class="blog-post__categories">
                                            <?php foreach ($secondary_categories as $category) : ?>
                                                <span class="blog-post__category"><?php echo esc_html($category->name); ?></span>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>

                                <a class="blog-post__media blog-post__media--compact" href="<?php echo esc_url($secondary_permalink); ?>">
                                    <?php if (has_post_thumbnail($secondary_post)) : ?>
                                        <?php
                                        echo get_the_post_thumbnail(
                                            $secondary_post,
                                            'medium_large',
                                            [
                                                'class'    => 'blog-post__image',
                                                'loading'  => 'lazy',
                                                'decoding' => 'async',
                                            ]
                                        );
                                        ?>
                                    <?php else : ?>
                                        <span class="blog-post__image-fallback" aria-hidden="true"></span>
                                    <?php endif; ?>
                                </a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <?php if ($total_pages > 1) : ?>
                <nav class="blog-page__pagination" aria-label="Пагінація проєктів">
                    <?php
                    echo wp_kses_post(
                        paginate_links(
                            [
                                'type'      => 'list',
                                'base'      => $pagination_base,
                                'current'   => $current_page,
                                'total'     => $total_pages,
                                'mid_size'  => 1,
                                'prev_text' => '&larr;',
                                'next_text' => '&rarr;',
                            ]
                        )
                    );
                    ?>
                </nav>
            <?php endif; ?>
        <?php else : ?>
            <p class="blog-section__empty">Додайте записи блогу, щоб показати цей блок.</p>
        <?php endif; ?>
    </div>
</section>
