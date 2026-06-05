<?php
/**
 * 404 template.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--not-found" aria-label="<?php esc_attr_e('Сторінку не знайдено', 'graffit'); ?>">
    <?php get_template_part('template-parts/sections/not', 'found'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
