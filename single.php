<?php
/**
 * Single post template.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--single-post">
    <?php
    while (have_posts()) :
        the_post();
        get_template_part('template-parts/sections/single', 'post');
    endwhile;
    ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
