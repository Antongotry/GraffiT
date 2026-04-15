<?php
/**
 * Static page template for /contacts/ output.
 *
 * @package graffit
 */

declare(strict_types=1);

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main site-main--contacts" aria-label="<?php esc_attr_e('Контакти', 'graffit'); ?>">
    <?php get_template_part('template-parts/sections/contacts'); ?>
</main>
<?php get_template_part('template-parts/components/site', 'popup'); ?>
<?php
get_footer();
