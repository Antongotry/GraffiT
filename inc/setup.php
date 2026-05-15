<?php
/**
 * Theme setup and asset loading.
 *
 * @package graffit
 */

declare(strict_types=1);

if (! defined('GRAFFIT_THEME_VERSION')) {
    define('GRAFFIT_THEME_VERSION', '0.1.1');
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

    if (! $modified_time) {
        return GRAFFIT_THEME_VERSION;
    }

    return GRAFFIT_THEME_VERSION . '-' . (string) $modified_time;
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
 * Front page hero image URL.
 */
function graffit_home_hero_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/home1440_result-scaled.webp';
}

/**
 * Front page hero background for viewports up to 1024px.
 */
function graffit_home_hero_image_mobile_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-2087325775_result.webp';
}

/**
 * Front page CTA gem image URL.
 */
function graffit_home_hero_cta_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Group-8668_result.webp';
}

/**
 * Products page hero background (desktop art).
 */
function graffit_products_hero_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-2087325709_result-scaled.webp';
}

/**
 * Products page hero background for viewports up to 1024px.
 */
function graffit_products_hero_image_mobile_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-2087325777_result.webp';
}

/**
 * About page hero background (desktop art).
 */
function graffit_about_hero_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-2087325771_result-scaled.webp';
}

/**
 * About page hero background for viewports up to 1024px.
 */
function graffit_about_hero_image_mobile_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Frame-2087325776_result.webp';
}

/**
 * About page «Наша історія» illustration (not the hero backdrop).
 */
function graffit_about_story_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/Polygon-14_result.webp';
}

/**
 * Product MediaHub hero background (desktop art, mockups in frame).
 */
function graffit_product_mediahub_hero_image_url(): string
{
    return 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/322_result-scaled.webp';
}

/**
 * MediaHub «audience» card image (1–5), 1440 art exports.
 */
function graffit_product_mediahub_audience_image_url(int $index): string
{
    $index = max(1, min(5, $index));

    return sprintf(
        'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/%dl_result.webp',
        $index
    );
}

/**
 * MediaHub «результат» — іконки-прапорці (1–5), gN_result.webp.
 */
function graffit_product_mediahub_result_image_url(int $index): string
{
    $index = max(1, min(5, $index));

    return sprintf(
        'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/04/g%d_result.webp',
        $index
    );
}

/**
 * Static route title by current path.
 */
function graffit_static_route_title(): ?string
{
    return match (graffit_current_request_path()) {
        'about' => 'Про нас',
        'contacts' => 'Контакти',
        'products' => 'Продукти',
        'product-mediahub' => 'Продукт - Медіахаб',
        default => null,
    };
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
 * Preload the front page hero images.
 */
function graffit_preload_home_hero(): void
{
    if (graffit_current_request_path() !== '') {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url(graffit_home_hero_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_home_hero_image_mobile_url()) . '" media="(max-width: 1024px)">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_home_hero_cta_image_url()) . '">' . "\n";
}
add_action('wp_head', 'graffit_preload_home_hero', 3);

/**
 * Preload the products hero image on the products page.
 */
function graffit_preload_products_hero(): void
{
    if (graffit_current_request_path() !== 'products') {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url(graffit_products_hero_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_products_hero_image_mobile_url()) . '" media="(max-width: 1024px)">' . "\n";
}
add_action('wp_head', 'graffit_preload_products_hero', 3);

/**
 * Preload the about hero image on the about page.
 */
function graffit_preload_about_hero(): void
{
    if (graffit_current_request_path() !== 'about') {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url(graffit_about_hero_image_url()) . '">' . "\n";
    echo '<link rel="preload" as="image" href="' . esc_url(graffit_about_hero_image_mobile_url()) . '" media="(max-width: 1024px)">' . "\n";
}
add_action('wp_head', 'graffit_preload_about_hero', 3);

/**
 * Preload the MediaHub product hero image.
 */
function graffit_preload_product_mediahub_hero(): void
{
    if (graffit_current_request_path() !== 'product-mediahub') {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url(graffit_product_mediahub_hero_image_url()) . '">' . "\n";
}
add_action('wp_head', 'graffit_preload_product_mediahub_hero', 3);

/**
 * Prevent WordPress from keeping static routes in a 404 state.
 */
function graffit_prevent_static_route_404($preempt, \WP_Query $query)
{
    if ($preempt || is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return $preempt;
    }

    global $wp_query;

    if (! $wp_query instanceof \WP_Query || $query !== $wp_query) {
        return $preempt;
    }

    if (graffit_static_route_title() === null) {
        return $preempt;
    }

    $query->is_404 = false;

    return true;
}
add_filter('pre_handle_404', 'graffit_prevent_static_route_404', 10, 2);

/**
 * Override the document title for static routes.
 *
 * @param array<string, string> $title_parts
 * @return array<string, string>
 */
function graffit_static_route_document_title(array $title_parts): array
{
    $title = graffit_static_route_title();

    if ($title === null) {
        return $title_parts;
    }

    $title_parts['title'] = $title;

    return $title_parts;
}
add_filter('document_title_parts', 'graffit_static_route_document_title');

/**
 * Remove 404 body class from static routes.
 *
 * @param array<int, string> $classes
 * @return array<int, string>
 */
function graffit_static_route_body_class(array $classes): array
{
    if (graffit_static_route_title() === null) {
        return $classes;
    }

    return array_values(array_diff($classes, ['error404']));
}
add_filter('body_class', 'graffit_static_route_body_class');

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
        file_exists(get_template_directory() . '/assets/css/main.v2.css')
            ? get_template_directory_uri() . '/assets/css/main.v2.css'
            : get_template_directory_uri() . '/assets/css/main.css',
        ['graffit-style'],
        file_exists(get_template_directory() . '/assets/css/main.v2.css')
            ? graffit_asset_version('/assets/css/main.v2.css')
            : graffit_asset_version('/assets/css/main.css')
    );

    $lenis_local_path = '/assets/vendor/lenis/lenis.min.js';
    $gsap_local_path = '/assets/vendor/gsap/gsap.min.js';
    $scrolltrigger_local_path = '/assets/vendor/gsap/ScrollTrigger.min.js';

    $lenis_src = file_exists(get_template_directory() . $lenis_local_path)
        ? get_template_directory_uri() . $lenis_local_path
        : 'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js';
    $gsap_src = file_exists(get_template_directory() . $gsap_local_path)
        ? get_template_directory_uri() . $gsap_local_path
        : 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
    $scrolltrigger_src = file_exists(get_template_directory() . $scrolltrigger_local_path)
        ? get_template_directory_uri() . $scrolltrigger_local_path
        : 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js';

    wp_enqueue_script('graffit-lenis', $lenis_src, [], graffit_asset_version($lenis_local_path), true);
    wp_enqueue_script('graffit-gsap', $gsap_src, [], graffit_asset_version($gsap_local_path), true);
    wp_enqueue_script(
        'graffit-scrolltrigger',
        $scrolltrigger_src,
        ['graffit-gsap'],
        graffit_asset_version($scrolltrigger_local_path),
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
 * Optional: discourage caching of HTML (browser/CDN that respect response headers).
 *
 * Full-page plugins (e.g. LiteSpeed Cache on Hostinger) may still serve a stored
 * copy until you purge the cache in the panel or adjust the plugin — PHP headers
 * alone do not always bypass that layer.
 *
 * In wp-config.php: define( 'GRAFFIT_DISABLE_HTML_CACHE', true );
 */
function graffit_maybe_send_nocache_headers(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (! defined('GRAFFIT_DISABLE_HTML_CACHE') || ! GRAFFIT_DISABLE_HTML_CACHE) {
        return;
    }

    nocache_headers();
}
add_action('send_headers', 'graffit_maybe_send_nocache_headers', 0);

/**
 * Handle AJAX request submissions from the site popup.
 */
function graffit_handle_request_submission(): void
{
    $nonce_valid = check_ajax_referer('graffit_request_form', 'nonce', false);

    if (! $nonce_valid) {
        wp_send_json_error(
            [
                'message' => __('Сесія форми завершилась. Оновіть сторінку та спробуйте ще раз.', 'graffit'),
            ],
            403
        );
    }

    $website = sanitize_text_field(wp_unslash($_POST['website'] ?? ''));

    if ($website !== '') {
        wp_send_json_success(
            [
                'message' => __('Дякуємо! Ми вже отримали ваш запит.', 'graffit'),
            ]
        );
    }

    $name = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    $phone = sanitize_text_field(wp_unslash($_POST['phone'] ?? ''));
    $message = sanitize_text_field(wp_unslash($_POST['message'] ?? ''));
    $source = sanitize_key(wp_unslash($_POST['source'] ?? 'site'));
    $source_label = sanitize_text_field(wp_unslash($_POST['source_label'] ?? __('Сайт', 'graffit')));
    $consent = ! empty($_POST['consent']);

    $errors = [];
    $phone_digits = preg_replace('/\D+/', '', $phone);

    if (mb_strlen($name) < 2) {
        $errors['name'] = __('Вкажіть імʼя, щоб ми могли до вас звернутися.', 'graffit');
    }

    if (strlen((string) $phone_digits) < 10) {
        $errors['phone'] = __('Вкажіть коректний номер телефону.', 'graffit');
    }

    if (mb_strlen($message) < 5) {
        $errors['message'] = __('Коротко опишіть запит.', 'graffit');
    }

    if (! $consent) {
        $errors['consent'] = __('Потрібно підтвердити згоду на обробку даних.', 'graffit');
    }

    if ($errors !== []) {
        wp_send_json_error(
            [
                'message' => __('Перевірте поля форми та спробуйте ще раз.', 'graffit'),
                'errors' => $errors,
            ],
            422
        );
    }

    $recipient = apply_filters('graffit_request_recipient_email', get_option('admin_email'));

    if (! is_email((string) $recipient)) {
        $recipient = get_option('admin_email');
    }

    $subject = sprintf(
        __('[%1$s] Нова заявка: %2$s', 'graffit'),
        wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
        $source_label !== '' ? $source_label : strtoupper($source)
    );

    $lines = [
        __('Нова заявка з сайту GraffiT', 'graffit'),
        '------------------------------',
        sprintf(__('Дата: %s', 'graffit'), wp_date('d.m.Y H:i')),
        sprintf(__('Джерело: %s', 'graffit'), $source_label !== '' ? $source_label : $source),
        sprintf(__('Імʼя: %s', 'graffit'), $name),
        sprintf(__('Телефон: %s', 'graffit'), $phone),
        '',
        __('Опис запиту:', 'graffit'),
        $message,
    ];

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . (string) $recipient,
    ];

    $sent = wp_mail((string) $recipient, $subject, implode("\n", $lines), $headers);

    if (! $sent) {
        wp_send_json_error(
            [
                'message' => __('Не вдалося відправити заявку. Спробуйте ще раз трохи пізніше.', 'graffit'),
            ],
            500
        );
    }

    wp_send_json_success(
        [
            'message' => __('Дякуємо! Ми вже отримали ваш запит.', 'graffit'),
        ]
    );
}
add_action('wp_ajax_graffit_submit_request', 'graffit_handle_request_submission');
add_action('wp_ajax_nopriv_graffit_submit_request', 'graffit_handle_request_submission');

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

/**
 * Force /products/ route to render static products template.
 */
function graffit_force_products_route_template(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (graffit_current_request_path() !== 'products') {
        return;
    }

    global $wp_query;

    if ($wp_query instanceof \WP_Query) {
        $wp_query->is_404      = false;
        $wp_query->is_page     = true;
        $wp_query->is_singular = true;
        $wp_query->is_home     = false;
        $wp_query->is_archive  = false;
    }

    status_header(200);
    nocache_headers();

    $template = locate_template('page-products.php');

    if ($template) {
        include $template;
        exit;
    }
}
add_action('template_redirect', 'graffit_force_products_route_template', 0);

/**
 * Force /about/ route to render static about template.
 */
function graffit_force_about_route_template(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (graffit_current_request_path() !== 'about') {
        return;
    }

    global $wp_query;

    if ($wp_query instanceof \WP_Query) {
        $wp_query->is_404      = false;
        $wp_query->is_page     = true;
        $wp_query->is_singular = true;
        $wp_query->is_home     = false;
        $wp_query->is_archive  = false;
    }

    status_header(200);
    nocache_headers();

    $template = locate_template('page-about.php');

    if ($template) {
        include $template;
        exit;
    }
}
add_action('template_redirect', 'graffit_force_about_route_template', 0);

/**
 * Force /contacts/ route to render static contacts template.
 */
function graffit_force_contacts_route_template(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (graffit_current_request_path() !== 'contacts') {
        return;
    }

    global $wp_query;

    if ($wp_query instanceof \WP_Query) {
        $wp_query->is_404      = false;
        $wp_query->is_page     = true;
        $wp_query->is_singular = true;
        $wp_query->is_home     = false;
        $wp_query->is_archive  = false;
    }

    status_header(200);
    nocache_headers();

    $template = locate_template('page-contacts.php');

    if ($template) {
        include $template;
        exit;
    }
}
add_action('template_redirect', 'graffit_force_contacts_route_template', 0);

/**
 * Force /product-mediahub/ route to render static MediaHub product template.
 */
function graffit_force_product_mediahub_route_template(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (graffit_current_request_path() !== 'product-mediahub') {
        return;
    }

    global $wp_query;

    if ($wp_query instanceof \WP_Query) {
        $wp_query->is_404      = false;
        $wp_query->is_page     = true;
        $wp_query->is_singular = true;
        $wp_query->is_home     = false;
        $wp_query->is_archive  = false;
    }

    status_header(200);
    nocache_headers();

    $template = locate_template('page-product-mediahub.php');

    if ($template) {
        include $template;
        exit;
    }
}
add_action('template_redirect', 'graffit_force_product_mediahub_route_template', 0);
