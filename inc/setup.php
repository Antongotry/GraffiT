<?php
/**
 * Theme setup and asset loading.
 *
 * @package graffit
 */

declare(strict_types=1);

if (! defined('GRAFFIT_THEME_VERSION')) {
    define('GRAFFIT_THEME_VERSION', '0.1.0');
}

/**
 * Configure theme features.
 */
function graffit_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support(
        'html5',
        [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]
    );

    register_nav_menus(
        [
            'primary' => esc_html__('Primary Menu', 'graffit'),
        ]
    );
}
add_action('after_setup_theme', 'graffit_theme_setup');

/**
 * Get asset version based on file modification time.
 */
function graffit_asset_version(string $relative_path): string
{
    $file_path = get_template_directory() . $relative_path;

    if (! file_exists($file_path)) {
        return GRAFFIT_THEME_VERSION;
    }

    $modified_time = filemtime($file_path);

    return $modified_time ? (string) $modified_time : GRAFFIT_THEME_VERSION;
}

/**
 * Current request path relative to home path.
 */
function graffit_current_request_path(): string
{
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    $request_path = trim((string) wp_parse_url((string) $request_uri, PHP_URL_PATH), '/');
    $home_path = trim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');

    if ($home_path !== '' && str_starts_with($request_path, $home_path . '/')) {
        $request_path = substr($request_path, strlen($home_path) + 1);
    } elseif ($request_path === $home_path) {
        $request_path = '';
    }

    return trim((string) $request_path, '/');
}

/**
 * Services hero image URL.
 */
function graffit_services_hero_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/herob-1440_result-scaled.webp';
}

/**
 * Services hero background for viewports up to 1024px (375 design width, full mobile art).
 */
function graffit_services_hero_image_mobile_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/hero-mob-p_result.webp';
}

/**
 * Services experience badge image URL.
 */
function graffit_services_experience_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/romb_result.webp';
}

/**
 * Services automation card image URL.
 */
function graffit_services_automation_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/1i2_result.webp';
}

/**
 * Services outsourcing card image URL.
 */
function graffit_services_outsourcing_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/2i2_result.webp';
}

/**
 * Header logo URL.
 */
function graffit_logo_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/logo.svg';
}

/**
 * Resource hints for external scripts.
 */
function graffit_resource_hints(): void
{
    echo '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>' . "\n";
}
add_action('wp_head', 'graffit_resource_hints', 1);

/**
 * Preload the services hero image on the services page.
 */
function graffit_preload_services_hero(): void
{
    if (graffit_current_request_path() !== 'services') {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url(graffit_services_hero_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_services_experience_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_services_automation_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_services_outsourcing_image_url()) . '">' . "\n";
}
add_action('wp_head', 'graffit_preload_services_hero', 3);

/**
 * Load theme assets.
 */
function graffit_enqueue_assets(): void
{
    wp_enqueue_style(
        'graffit-style',
        get_stylesheet_uri(),
        [],
        graffit_asset_version('/style.css')
    );

    wp_enqueue_style(
        'graffit-main',
        get_template_directory_uri() . '/assets/css/main.css',
        ['graffit-style'],
        graffit_asset_version('/assets/css/main.css')
    );

    wp_enqueue_script(
        'graffit-lenis',
        'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js',
        [],
        '1.3.11',
        true
    );

    wp_enqueue_script(
        'graffit-gsap',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
        [],
        '3.13.0',
        true
    );

    wp_enqueue_script(
        'graffit-scrolltrigger',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
        ['graffit-gsap'],
        '3.13.0',
        true
    );

    wp_enqueue_script(
        'graffit-main',
        get_template_directory_uri() . '/assets/js/main.js',
        ['graffit-lenis', 'graffit-gsap', 'graffit-scrolltrigger'],
        graffit_asset_version('/assets/js/main.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'graffit_enqueue_assets');

/**
 * Force /services/ route to render static services template.
 */
function graffit_force_services_route_template(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (graffit_current_request_path() !== 'services') {
        return;
    }

    status_header(200);
    nocache_headers();

    $template = locate_template('page-services.php');

    if ($template) {
        include $template;
        exit;
    }
}
add_action('template_redirect', 'graffit_force_services_route_template', 0);
