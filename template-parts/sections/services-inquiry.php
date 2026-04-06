<?php
/**
 * Services inquiry CTA section.
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
        'text' => 'Поділіться з нами деталями — ми допоможемо знайти правильне рішення, навіть якщо воно виходить за рамки стандартних послуг',
        'button_label' => 'Залишити заявку',
        'button_url' => '#site-footer',
        'theme' => 'light',
        'pattern_url' => get_template_directory_uri() . '/assets/images/cta-band-pattern.svg',
    ]
);
