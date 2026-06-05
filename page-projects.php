<?php
/**
 * Static page template for /projects/ archive output.
 *
 * @package graffit
 */

declare(strict_types=1);

$paged = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));

$projects_blog_query = new WP_Query(
    [
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => max(1, (int) get_option('posts_per_page')),
        'paged'               => $paged,
        'ignore_sticky_posts' => true,
    ]
);

set_query_var('graffit_projects_blog_query', $projects_blog_query);

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
get_footer();
