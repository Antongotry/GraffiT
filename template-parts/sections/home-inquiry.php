<?php
/**
 * Front page inquiry CTA — same band as services page.
 *
 * @package graffit
 */

declare(strict_types=1);

get_template_part(
    'template-parts/components/cta',
    'band',
    [
        'classes' => ['services-inquiry'],
        'title' => 'Маєте комплексний або унікальний запит?',
        'title_parts' => [
            'Маєте комплексний',
            'або унікальний запит?',
        ],
        'text' => 'Поділіться з нами деталями — ми допоможемо знайти правильне рішення, навіть якщо воно виходить за рамки стандартних послуг',
        'button_label' => 'Залишити заявку',
        'button_url' => '#site-footer',
        'button_popup' => true,
        'button_source' => 'home-inquiry',
        'button_source_label' => 'Головна · CTA-блок · Залишити заявку',
        'theme' => 'light',
        'pattern_url' => get_template_directory_uri() . '/assets/images/cta-band-pattern.svg',
    ]
);
