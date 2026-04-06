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
        <a class="site-header__logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php esc_attr_e('На головну', 'graffit'); ?>">
            <span class="site-header__logo-mark" aria-hidden="true"></span>
            <span class="site-header__logo-text">GraffiT</span>
        </a>

        <nav class="site-header__nav" aria-label="<?php esc_attr_e('Primary', 'graffit'); ?>">
            <a class="site-header__nav-link" href="<?php echo esc_url(home_url('/')); ?>">Головна</a>
            <a class="site-header__nav-link is-active" href="<?php echo esc_url(home_url('/services/')); ?>">Послуги</a>
            <a class="site-header__nav-link" href="#site-footer">Контакти</a>
        </nav>

        <a class="site-header__cta" href="#site-popup">Обговорити проект</a>
    </div>
</header>

