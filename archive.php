<?php
/**
 * Post archives (tags, dates, authors) — projects blog layout.
 *
 * @package graffit
 */

declare(strict_types=1);

if (! is_post_type_archive('post') && ! is_tag() && ! is_author() && ! is_date()) {
    global $wp_query;

    $wp_query->set_404();
    status_header(404);
    nocache_headers();

    include get_query_template('404');

    return;
}

$paged = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));
$category_slug = '';

if (is_category()) {
    $term = get_queried_object();

    if ($term instanceof WP_Term) {
        $category_slug = (string) $term->slug;
    }
}

$projects_blog_query = graffit_create_projects_blog_query($paged, $category_slug);

if (is_tag()) {
    $tag = get_queried_object();

    if ($tag instanceof WP_Term) {
        $projects_blog_query = new WP_Query(
            [
                'post_type'           => 'post',
                'post_status'         => 'publish',
                'posts_per_page'      => max(1, (int) get_option('posts_per_page')),
                'paged'               => $paged,
                'ignore_sticky_posts' => true,
                'tag_id'              => (int) $tag->term_id,
            ]
        );
    }
}

set_query_var('graffit_projects_blog_query', $projects_blog_query);
set_query_var('graffit_projects_active_category', $category_slug);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--projects">
    <?php get_template_part('template-parts/sections/projects', 'catalog'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
wp_reset_postdata();
set_query_var('graffit_projects_blog_query', null);
set_query_var('graffit_projects_active_category', null);
get_footer();
