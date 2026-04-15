<?php
/**
 * Front page (and About) inquiry CTA — same band as services page.
 *
 * Optional `get_template_part` args: `button_source`, `button_source_label`.
 *
 * @package graffit
 */

declare(strict_types=1);

$inquiry_button_source = isset($button_source) && is_string($button_source) && $button_source !== ''
    ? $button_source
    : 'home-inquiry';
$inquiry_button_source_label = isset($button_source_label) && is_string($button_source_label) && $button_source_label !== ''
    ? $button_source_label
    : 'Головна · CTA-блок · Залишити заявку';

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
        'button_source' => $inquiry_button_source,
        'button_source_label' => $inquiry_button_source_label,
        'theme' => 'light',
        'pattern_url' => get_template_directory_uri() . '/assets/images/cta-band-pattern.svg',
    ]
);
