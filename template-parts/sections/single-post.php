<?php
/**
 * Single post section.
 *
 * @package graffit
 */

declare(strict_types=1);

$post_id = (int) get_the_ID();
$post_permalink = get_permalink($post_id) ?: home_url('/');
$post_title = get_the_title($post_id);

$get_post_categories = static function (int $target_post_id): array {
    $categories = get_the_terms($target_post_id, 'category');

    if (empty($categories) || is_wp_error($categories)) {
        return [];
    }

    return array_slice($categories, 0, 2);
};

$post_categories = $get_post_categories($post_id);
$encoded_url = rawurlencode($post_permalink);
$encoded_title = rawurlencode($post_title);

$telegram_share_link = 'https://t.me/share/url?url=' . $encoded_url . '&text=' . $encoded_title;
$facebook_share_link = 'https://www.facebook.com/sharer/sharer.php?u=' . $encoded_url;
$instagram_link = 'https://www.instagram.com/';

$blog_archive_link = home_url('/projects/');

$related_posts = get_posts(
    [
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => 3,
        'post__not_in'        => [$post_id],
        'ignore_sticky_posts' => true,
    ]
);

$related_primary_post = $related_posts[0] ?? null;
$related_secondary_posts = array_slice($related_posts, 1, 2);
?>
<section class="single-article">
    <div class="single-article__container">
        <div class="single-article__marker">
            <span class="single-article__marker-dot" aria-hidden="true"></span>
            <p class="single-article__marker-text">Блог/Стаття</p>
        </div>

        <div class="single-article__layout">
            <aside class="single-article__share" aria-label="<?php esc_attr_e('Поділитись статтею', 'graffit'); ?>">
                <p class="single-article__share-label">Поділитись</p>
                <div class="single-article__share-list site-footer__social-list">
                    <a class="single-article__share-link site-footer__social-link" href="<?php echo esc_url($telegram_share_link); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Поділитися у Telegram', 'graffit'); ?>">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M20.76 4.2 3.95 10.68c-1.15.47-1.14 1.11-.2 1.39l4.31 1.34 9.96-6.28c.47-.29.9-.13.55.18l-8.07 7.29-.3 4.53c.44 0 .64-.2.89-.44l2.15-2.09 4.47 3.3c.83.46 1.42.22 1.63-.77l2.86-13.48c.31-1.21-.47-1.76-1.34-1.37z" fill="currentColor"/>
                        </svg>
                    </a>
                    <a class="single-article__share-link site-footer__social-link" href="<?php echo esc_url($instagram_link); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.5A3.25 3.25 0 0 0 4.5 7.75v8.5A3.25 3.25 0 0 0 7.75 19.5h8.5a3.25 3.25 0 0 0 3.25-3.25v-8.5A3.25 3.25 0 0 0 16.25 4.5h-8.5Zm8.88 1.12a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5a3.5 3.5 0 0 0 0-7Z" fill="currentColor"/>
                        </svg>
                    </a>
                    <a class="single-article__share-link site-footer__social-link" href="<?php echo esc_url($facebook_share_link); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Поділитися у Facebook', 'graffit'); ?>">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M13.5 21v-7h2.35l.35-2.73H13.5v-1.74c0-.8.22-1.34 1.37-1.34h1.46V5.75A19.31 19.31 0 0 0 14.2 5.6c-2.1 0-3.54 1.28-3.54 3.64v2.03H8.3V14h2.36v7h2.84Z" fill="currentColor"/>
                        </svg>
                    </a>
                </div>
            </aside>

            <article class="single-article__body">
                <h1 class="single-article__title"><?php echo esc_html($post_title); ?></h1>

                <div class="single-article__featured">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('large', ['class' => 'single-article__featured-image', 'loading' => 'eager', 'decoding' => 'async']); ?>
                    <?php else : ?>
                        <span class="single-article__featured-fallback" aria-hidden="true"></span>
                    <?php endif; ?>
                </div>

                <div class="single-article__content">
                    <?php the_content(); ?>
                </div>
            </article>

            <aside class="single-article__meta-column" aria-label="<?php esc_attr_e('Дані статті', 'graffit'); ?>">
                <div class="single-article__meta">
                    <time class="single-article__date" datetime="<?php echo esc_attr(get_the_date('c', $post_id)); ?>">
                        <?php echo esc_html(get_the_date('d.m.Y', $post_id)); ?>
                    </time>

                    <?php if ($post_categories) : ?>
                        <div class="single-article__categories">
                            <?php foreach ($post_categories as $category) : ?>
                                <a class="single-article__category" href="<?php echo esc_url(get_category_link($category)); ?>">
                                    <?php echo esc_html($category->name); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </aside>
        </div>
    </div>
</section>

<?php if ($related_primary_post) : ?>
<section class="blog-section single-related" id="more-news">
    <div class="blog-section__container">
        <h2 class="single-related__title">Інші публікації</h2>

        <div class="blog-layout single-related__layout">
            <?php
            $primary_permalink = get_permalink($related_primary_post);
            $primary_categories = $get_post_categories((int) $related_primary_post->ID);
            ?>
            <article class="blog-post blog-post--featured">
                <div class="blog-post__content">
                    <time class="blog-post__date" datetime="<?php echo esc_attr(get_the_date('c', $related_primary_post)); ?>">
                        <?php echo esc_html(get_the_date('d.m.Y', $related_primary_post)); ?>
                    </time>

                    <h3 class="blog-post__title">
                        <a href="<?php echo esc_url($primary_permalink); ?>">
                            <?php echo esc_html(get_the_title($related_primary_post)); ?>
                        </a>
                    </h3>

                    <?php if ($primary_categories) : ?>
                        <div class="blog-post__categories">
                            <?php foreach ($primary_categories as $category) : ?>
                                <span class="blog-post__category"><?php echo esc_html($category->name); ?></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <a class="blog-post__media blog-post__media--featured" href="<?php echo esc_url($primary_permalink); ?>">
                    <?php if (has_post_thumbnail($related_primary_post)) : ?>
                        <?php echo get_the_post_thumbnail($related_primary_post, 'large', ['class' => 'blog-post__image', 'loading' => 'lazy', 'decoding' => 'async']); ?>
                    <?php else : ?>
                        <span class="blog-post__image-fallback" aria-hidden="true"></span>
                    <?php endif; ?>
                </a>
            </article>

            <div class="blog-layout__side">
                <?php foreach ($related_secondary_posts as $secondary_post) : ?>
                    <?php
                    $secondary_permalink = get_permalink($secondary_post);
                    $secondary_categories = $get_post_categories((int) $secondary_post->ID);
                    ?>
                    <article class="blog-post blog-post--compact">
                        <div class="blog-post__content">
                            <time class="blog-post__date" datetime="<?php echo esc_attr(get_the_date('c', $secondary_post)); ?>">
                                <?php echo esc_html(get_the_date('d.m.Y', $secondary_post)); ?>
                            </time>

                            <h3 class="blog-post__title">
                                <a href="<?php echo esc_url($secondary_permalink); ?>">
                                    <?php echo esc_html(get_the_title($secondary_post)); ?>
                                </a>
                            </h3>

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
                                <?php echo get_the_post_thumbnail($secondary_post, 'medium_large', ['class' => 'blog-post__image', 'loading' => 'lazy', 'decoding' => 'async']); ?>
                            <?php else : ?>
                                <span class="blog-post__image-fallback" aria-hidden="true"></span>
                            <?php endif; ?>
                        </a>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>

        <a class="blog-section__all-link" href="<?php echo esc_url($blog_archive_link); ?>">
            <span>Усі публікації</span>
        </a>
    </div>
</section>
<?php endif; ?>
