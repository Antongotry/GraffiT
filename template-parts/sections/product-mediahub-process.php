<?php
/**
 * Product MediaHub — «Процес / Як це працює».
 *
 * @package graffit
 */

declare(strict_types=1);

$mediahub_process_eyebrow_icon = content_url('uploads/2026/04/Group-86942.svg');
$mediahub_process_visual = content_url('uploads/2026/04/ban1440_result.webp');

$mediahub_process_steps = [
    [
        'number' => '1',
        'tag_prefix' => 'Крок',
        'title' => 'Завантажуєте контент у бібліотеку.',
        'text' => '',
        'result' => '',
        'active' => true,
    ],
    [
        'number' => '2',
        'tag_prefix' => 'Крок',
        'title' => 'Формуєте плейлисти з потрібними матеріалами.',
        'text' => '',
        'result' => '',
    ],
    [
        'number' => '3',
        'tag_prefix' => 'Крок',
        'title' => 'Вказуєте час і місце показу.',
        'text' => '',
        'result' => '',
    ],
    [
        'number' => '4',
        'tag_prefix' => 'Крок',
        'title' => 'Система сама транслює контент за заданими правилами.',
        'text' => '',
        'result' => '',
    ],
];
?>
<section
    class="services-process mediahub-process js-process-section"
    id="mediahub-process"
    aria-labelledby="mediahub-process-title"
>
    <div class="services-process__container">
        <div class="services-process__eyebrow">
            <img
                class="services-process__eyebrow-icon"
                src="<?php echo esc_url($mediahub_process_eyebrow_icon); ?>"
                alt=""
                width="28"
                height="32"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            >
            <p class="services-process__eyebrow-text">Процес</p>
        </div>

        <h2 class="services-process__title" id="mediahub-process-title">Як це працює</h2>

        <div class="services-process__layout">
            <div class="services-process__timeline">
                <div class="services-process__line" aria-hidden="true">
                    <span class="services-process__line-fill js-process-line-fill"></span>
                </div>

                <div class="services-process__steps">
                    <?php foreach ($mediahub_process_steps as $step) : ?>
                        <?php get_template_part('template-parts/components/process', 'step', $step); ?>
                    <?php endforeach; ?>
                </div>

                <div class="mediahub-process__note">
                    <p class="mediahub-process__note-text">
                        Весь процес займає пару кліків, а не тижні затверджень і оновлень.
                    </p>
                </div>
            </div>

            <div class="services-process__visual" aria-hidden="true">
                <div class="services-process__visual-frame">
                    <img
                        class="services-process__visual-photo"
                        src="<?php echo esc_url($mediahub_process_visual); ?>"
                        alt=""
                        width="1440"
                        height="900"
                        loading="eager"
                        decoding="async"
                    >
                </div>
            </div>
        </div>
    </div>
</section>
