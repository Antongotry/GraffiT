<?php
/**
 * Fallback template.
 *
 * @package graffit
 */

get_header();
?>
<?php get_template_part('template-parts/layout/site', 'header'); ?>
<main id="primary" class="site-main">
    <section class="placeholder-page">
        <div class="placeholder-page__container">
            <h1 class="placeholder-page__title">GraffiT</h1>
            <p class="placeholder-page__text">Основна збірка теми розпочата. Перша готова сторінка доступна за адресою <a href="<?php echo esc_url(home_url('/services/')); ?>">/services/</a>.</p>
        </div>
    </section>
</main>
<?php
get_footer();

