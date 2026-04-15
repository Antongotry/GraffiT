<?php
/**
 * Global site header.
 *
 * @package graffit
 */

declare(strict_types=1);

$current_path = graffit_current_request_path();
$is_front_page = $current_path === '';

$services_link_classes = ['site-header__nav-link'];
$mobile_services_link_classes = ['mobile-menu__nav-link'];

$products_link_classes = ['site-header__nav-link'];
$mobile_products_link_classes = ['mobile-menu__nav-link'];

$about_link_classes = ['site-header__nav-link'];
$mobile_about_link_classes = ['mobile-menu__nav-link'];

$contacts_link_classes = ['site-header__nav-link'];
$mobile_contacts_link_classes = ['mobile-menu__nav-link'];

$mediahub_link_classes = ['site-header__nav-link'];
$mobile_mediahub_link_classes = ['mobile-menu__nav-link'];

$about_url = home_url('/about/');
$mediahub_url = home_url('/product-mediahub/');
$contacts_url = home_url('/contacts/');
$projects_url = ($is_front_page || $current_path === 'services')
    ? '#services-projects'
    : home_url('/#services-projects');

if ($current_path === 'about') {
    $about_link_classes[] = 'is-active';
    $mobile_about_link_classes[] = 'is-active';
}

if ($current_path === 'contacts') {
    $contacts_link_classes[] = 'is-active';
    $mobile_contacts_link_classes[] = 'is-active';
}

if ($current_path === 'services') {
    $services_link_classes[] = 'is-active';
    $mobile_services_link_classes[] = 'is-active';
}

if ($current_path === 'products') {
    $products_link_classes[] = 'is-active';
    $mobile_products_link_classes[] = 'is-active';
}

if ($current_path === 'product-mediahub') {
    $mediahub_link_classes[] = 'is-active';
    $mobile_mediahub_link_classes[] = 'is-active';
}
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
            <a class="<?php echo esc_attr(implode(' ', $about_link_classes)); ?>" href="<?php echo esc_url($about_url); ?>">Про нас</a>
            <a class="<?php echo esc_attr(implode(' ', $services_link_classes)); ?>" href="<?php echo esc_url(home_url('/services/')); ?>">Послуги</a>
            <a class="<?php echo esc_attr(implode(' ', $products_link_classes)); ?>" href="<?php echo esc_url(home_url('/products/')); ?>">Продукти</a>
            <a class="<?php echo esc_attr(implode(' ', $mediahub_link_classes)); ?>" href="<?php echo esc_url($mediahub_url); ?>">Медіахаб</a>
            <a class="site-header__nav-link" href="<?php echo esc_url($projects_url); ?>">Проєкти</a>
            <a class="<?php echo esc_attr(implode(' ', $contacts_link_classes)); ?>" href="<?php echo esc_url($contacts_url); ?>">Контакти</a>
        </nav>

        <button class="site-header__burger js-mobile-menu-toggle" type="button" aria-label="<?php esc_attr_e('Меню', 'graffit'); ?>" aria-expanded="false">
            <img class="site-header__burger-icon" src="https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/hamb.svg" alt="" width="24" height="24" loading="eager" decoding="async">
        </button>
    </div>
</header>

<div class="mobile-menu js-mobile-menu" aria-hidden="true">
    <div class="mobile-menu__overlay js-mobile-menu-toggle"></div>
    <div class="mobile-menu__panel">
        <div class="mobile-menu__header">
            <a class="mobile-menu__logo-link" href="<?php echo esc_url(home_url('/')); ?>">
                <img class="mobile-menu__logo-image" src="<?php echo esc_url(graffit_logo_url()); ?>" alt="GraffiT" width="105" height="40" loading="lazy" decoding="async">
            </a>
            <button class="mobile-menu__close js-mobile-menu-toggle" type="button" aria-label="<?php esc_attr_e('Закрити', 'graffit'); ?>">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </button>
        </div>

        <nav class="mobile-menu__nav" aria-label="<?php esc_attr_e('Mobile', 'graffit'); ?>">
            <a class="<?php echo esc_attr(implode(' ', $mobile_about_link_classes)); ?>" href="<?php echo esc_url($about_url); ?>">Про нас</a>
            <a class="<?php echo esc_attr(implode(' ', $mobile_services_link_classes)); ?>" href="<?php echo esc_url(home_url('/services/')); ?>">Послуги</a>
            <a class="<?php echo esc_attr(implode(' ', $mobile_products_link_classes)); ?>" href="<?php echo esc_url(home_url('/products/')); ?>">Продукти</a>
            <a class="<?php echo esc_attr(implode(' ', $mobile_mediahub_link_classes)); ?>" href="<?php echo esc_url($mediahub_url); ?>">Медіахаб</a>
            <a class="mobile-menu__nav-link" href="<?php echo esc_url($projects_url); ?>">Проєкти</a>
            <a class="<?php echo esc_attr(implode(' ', $mobile_contacts_link_classes)); ?>" href="<?php echo esc_url($contacts_url); ?>">Контакти</a>
        </nav>

        <div class="mobile-menu__contacts">
            <div class="mobile-menu__contact-group">
                <p class="mobile-menu__label">Номери телефону</p>
                <a class="mobile-menu__contact-link" href="tel:+380563732877">(056) 373 28 77</a>
            </div>
            <div class="mobile-menu__contact-group">
                <p class="mobile-menu__label">E-mail</p>
                <a class="mobile-menu__contact-link" href="mailto:office@pc-service.ua">office@pc-service.ua</a>
            </div>
            <div class="mobile-menu__contact-group">
                <p class="mobile-menu__label">Адреса</p>
                <p class="mobile-menu__contact-text">49000, Україна, м. Дніпро, пр.Науки, 40</p>
            </div>
        </div>

        <div class="mobile-menu__footer">
            <div class="mobile-menu__socials">
                <a class="mobile-menu__social-link" href="#" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95V21h-4V9Z" fill="currentColor"/></svg>
                </a>
                <a class="mobile-menu__social-link" href="#" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.5A3.25 3.25 0 0 0 4.5 7.75v8.5A3.25 3.25 0 0 0 7.75 19.5h8.5a3.25 3.25 0 0 0 3.25-3.25v-8.5A3.25 3.25 0 0 0 16.25 4.5h-8.5Zm8.88 1.12a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5a3.5 3.5 0 0 0 0-7Z" fill="currentColor"/></svg>
                </a>
                <a class="mobile-menu__social-link" href="#" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.48.59a2.98 2.98 0 0 0-2.1 2.1A31.5 31.5 0 0 0 2 12a31.5 31.5 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.1c1.88.59 7.48.59 7.48.59s5.6 0 7.48-.59a2.98 2.98 0 0 0 2.1-2.1A31.5 31.5 0 0 0 22 12a31.5 31.5 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor"/></svg>
                </a>
                <a class="mobile-menu__social-link" href="#" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7h2.35l.35-2.73H13.5v-1.74c0-.8.22-1.34 1.37-1.34h1.46V5.75A19.31 19.31 0 0 0 14.2 5.6c-2.1 0-3.54 1.28-3.54 3.64v2.03H8.3V14h2.36v7h2.84Z" fill="currentColor"/></svg>
                </a>
            </div>
        </div>
    </div>
</div>
