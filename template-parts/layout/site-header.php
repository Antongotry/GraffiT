<?php
/**
 * Global site header.
 *
 * @package graffit
 */

declare(strict_types=1);
?>
<header class="site-header">
    <div class="site-header__inner">
        <a class="site-header__logo-link" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php esc_attr_e('На головну', 'graffit'); ?>">
            <img
                class="site-header__logo-image"
                src="<?php echo esc_url(graffit_logo_url()); ?>"
                alt="GraffiT"
                width="105"
                height="40"
                loading="eager"
                decoding="async"
            >
        </a>

        <nav class="site-header__nav" aria-label="<?php esc_attr_e('Primary', 'graffit'); ?>">
            <a class="site-header__nav-link" href="#">Про нас</a>
            <a class="site-header__nav-link is-active" href="<?php echo esc_url(home_url('/services/')); ?>">Послуги</a>
            <a class="site-header__nav-link" href="#">Продукти</a>
            <a class="site-header__nav-link" href="#">Проєкти</a>
            <a class="site-header__nav-link" href="#site-footer">Контакти</a>
        </nav>
    </div>
</header>
