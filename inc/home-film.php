<?php
/**
 * Homepage scroll-film frame config (sliced from MP4).
 *
 * @package graffit
 */

declare(strict_types=1);

/**
 * Toggle homepage scroll-film (hero + showcase frame scrub).
 * Set to true when designer webp frames should drive blocks 1–2 again.
 */
function graffit_home_film_enabled(): bool
{
    return true;
}

/**
 * @return array{
 *     p1Base: string,
 *     p2Base: string,
 *     p1Last: int,
 *     p2Last: int,
 *     poster: string,
 *     pad: int,
 *     ext: string,
 *     source: string,
 *     cacheKey: string
 * }
 */
function graffit_home_film_config(): array
{
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();
    $film_root = $theme_dir . '/assets/home-film';
    $manifest_path = $film_root . '/manifest.json';

    $defaults = [
        'pad' => 4,
        'ext' => '.webp',
        'p1Last' => 168,
        'p2Last' => 192,
    ];

    if (is_readable($manifest_path)) {
        $manifest = json_decode((string) file_get_contents($manifest_path), true);

        if (is_array($manifest)) {
            $defaults['p1Last'] = (int) ($manifest['p1']['lastIndex'] ?? $defaults['p1Last']);
            $defaults['p2Last'] = (int) ($manifest['p2']['lastIndex'] ?? $defaults['p2Last']);
            $defaults['pad'] = (int) ($manifest['pad'] ?? $defaults['pad']);
            $defaults['ext'] = (string) ($manifest['ext'] ?? $defaults['ext']);
            $defaults['scrollPace'] = (float) ($manifest['scrollPace'] ?? 1);
            $defaults['phase2ScrollPace'] = (float) ($manifest['phase2ScrollPace'] ?? 1.85);
        }
    }

    $defaults = array_merge($defaults, [
        'scrollPace' => $defaults['scrollPace'] ?? 1,
        'phase2ScrollPace' => $defaults['phase2ScrollPace'] ?? 1.85,
    ]);

    $p1_dir = $film_root . '/p1';
    $p2_dir = $film_root . '/p2';
    $p1_files = is_dir($p1_dir) ? (glob($p1_dir . '/frame-*.webp') ?: []) : [];
    $p2_files = is_dir($p2_dir) ? (glob($p2_dir . '/frame-*.webp') ?: []) : [];

    if ($p1_files !== []) {
        $defaults['p1Last'] = max(0, count($p1_files) - 1);
    }

    if ($p2_files !== []) {
        $defaults['p2Last'] = max(0, count($p2_files) - 1);
    }

    $p1_base = $theme_uri . '/assets/home-film/p1/frame-';
    $p2_base = $theme_uri . '/assets/home-film/p2/frame-';
    $poster = $p1_base . '0001' . $defaults['ext'];

    if ($p1_files === [] || $p2_files === []) {
        return graffit_home_film_legacy_config();
    }

    $cache_key_parts = [
        'designer-webp',
        (string) $defaults['p1Last'],
        (string) $defaults['p2Last'],
        (string) $defaults['pad'],
        (string) $defaults['ext'],
        is_readable($manifest_path) ? (string) filemtime($manifest_path) : 'no-manifest',
    ];

    return [
        'enabled' => graffit_home_film_enabled(),
        'p1Base' => $p1_base,
        'p2Base' => $p2_base,
        'p1Last' => $defaults['p1Last'],
        'p2Last' => $defaults['p2Last'],
        'poster' => $poster,
        'pad' => $defaults['pad'],
        'ext' => $defaults['ext'],
        'scrollPace' => (float) ($defaults['scrollPace'] ?? 1),
        'phase2ScrollPace' => (float) ($defaults['phase2ScrollPace'] ?? 1.85),
        'source' => 'designer-webp',
        'cacheKey' => 'home-film-' . substr(sha1(implode('|', $cache_key_parts)), 0, 16),
        'mobile' => graffit_home_film_mobile_config(),
    ];
}

/**
 * Mobile-only homepage scroll-film frame URLs.
 *
 * @return array{
 *     p1Base: string,
 *     p2Base: string,
 *     p1Last: int,
 *     p2Last: int,
 *     poster: string,
 *     pad: int,
 *     ext: string,
 *     source: string,
 *     p2FrameOffset: int,
 *     cacheKey: string
 * }
 */
function graffit_home_film_mobile_config(): array
{
    $base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/';

    return [
        'enabled' => graffit_home_film_enabled(),
        'p1Base' => $base . 'ezgif-frame-',
        'p2Base' => $base . 'ezgif-frame-',
        'p1Last' => 180,
        'p2Last' => 240,
        'poster' => $base . 'ezgif-frame-001_result-2-scaled.webp',
        'pad' => 3,
        'ext' => '_result-2-scaled.webp',
        'scrollPace' => 1,
        'phase2ScrollPace' => 1.85,
        'source' => 'mobile-ezgif',
        'p2FrameOffset' => 1,
        'p2Ext' => '_result-1-scaled.webp',
        'p2AltExt' => '_result-3-scaled.webp',
        'p2AltLastFrame' => 181,
        'cacheKey' => 'home-film-mobile-' . substr(sha1($base . '|p1:001-181:result-2|p2:001-181:result-3|p2:182-241:result-1|query-v1'), 0, 16),
    ];
}

/**
 * Legacy ezgif frame URLs (fallback when sliced frames are not deployed).
 *
 * @return array{
 *     p1Base: string,
 *     p2Base: string,
 *     p1Last: int,
 *     p2Last: int,
 *     poster: string,
 *     pad: int,
 *     ext: string,
 *     source: string,
 *     p2FrameOffset: int,
 *     cacheKey: string
 * }
 */
function graffit_home_film_legacy_config(): array
{
    $base = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/';

    return [
        'enabled' => graffit_home_film_enabled(),
        'p1Base' => $base . 'ezgif-frame-',
        'p2Base' => $base . 'ezgif-frame-',
        'p1Last' => 210,
        'p2Last' => 166,
        'poster' => $base . 'ezgif-frame-001_result-scaled.webp',
        'pad' => 3,
        'ext' => '_result-scaled.webp',
        'scrollPace' => 1,
        'phase2ScrollPace' => 1.85,
        'source' => 'legacy-ezgif',
        /*
         * Phase 2 starts at the non-repeating part of the second upload pack:
         * 075-211 *_result-1-scaled.webp, then 212-241 *_result-scaled.webp.
        */
        'p2FrameOffset' => 75,
        'p2Ext' => '_result-scaled.webp',
        'p2AltExt' => '_result-1-scaled.webp',
        'p2AltLastFrame' => 211,
        'cacheKey' => 'home-film-' . substr(sha1($base . '|211|75-241|result-scaled|result-1-scaled|query-v3'), 0, 16),
        'mobile' => graffit_home_film_mobile_config(),
    ];
}
