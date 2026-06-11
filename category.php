<?php
/**
 * Category archive — same layout as /projects/ with filtered posts.
 *
 * @package graffit
 */

declare(strict_types=1);

$category = get_queried_object();

if (! $category instanceof WP_Term || $category->taxonomy !== 'category') {
    global $wp_query;

    $wp_query->set_404();
    status_header(404);
    nocache_headers();

    include get_query_template('404');

    return;
}

$paged = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));

$projects_blog_query = graffit_create_projects_blog_query($paged, (string) $category->slug);

set_query_var('graffit_projects_blog_query', $projects_blog_query);
set_query_var('graffit_projects_active_category', (string) $category->slug);

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
