# GraffiT Frontend Memo

Памятка собрана по фактической реализации страницы `/services/`, а не по абстрактным договорённостям.

## Откуда это взято

- `page-services.php`
- `template-parts/sections/services-*.php`
- `template-parts/components/*.php`
- `assets/scss/abstracts/_variables.scss`
- `assets/scss/abstracts/_mixins.scss`
- `assets/scss/pages/_services-page.scss`
- `assets/js/main.js`
- `docs/WORKFLOW_RULES.md`

## Как у нас собрана страница услуг

- `/services/` рендерится через отдельный page template: `page-services.php`.
- Сам template должен быть тонким: он только собирает страницу из секций через `get_template_part(...)`.
- Каждая крупная секция живёт отдельно в `template-parts/sections/`.
- Повторяемые куски выносим в `template-parts/components/`.
- Уже есть хорошие паттерны переиспользования:
  - `service-card.php`
  - `benefit-card.php`
  - `trust-card.php`
  - `project-case-card.php`
  - `process-step.php`
  - `cta-band.php`
- Данные для карточек/списков часто лежат прямо в section partial как массив, а рендер карточек идёт циклом через component partial.

Идея простая: page template собирает, section partial описывает секцию, component partial рендерит повторяемый UI.

## Где что менять

- PHP-разметка: `page-services.php`, `template-parts/sections/`, `template-parts/components/`
- SCSS-исходники: `assets/scss/`
- Главный page partial страницы услуг: `assets/scss/pages/_services-page.scss`
- Общий вход SCSS: `assets/scss/main.scss`
- JS-логика: `assets/js/main.js`
- Скомпилированный CSS: `assets/css/main.css`

Важно:

- Руками правим исходники, не `assets/css/main.css`.
- После правок SCSS нужно пересобрать CSS.
- Для сборки используются:
  - `npm run dev` - watch
  - `npm run build` - единичная сборка

## Базовые responsive-правила

Источник истины:

- desktop base: `1440`
- mobile base: `375`
- mobile breakpoint: `1024px`

Это уже зашито в:

- `assets/scss/abstracts/_variables.scss`
- `assets/scss/abstracts/_mixins.scss`

Основные функции:

- `mixins.vw(XXpx)` - переводит пиксели в `vw` относительно `1440`
- `mixins.mvw(XXpx)` - переводит пиксели в `vw` относительно `375`
- `@include mixins.mobile` - mobile styles до `1024px`

Формулы:

- desktop: `vw = px / 1440 * 100`
- mobile: `vw = px / 375 * 100`

Примеры:

- `16px -> 1.111111vw` на desktop
- `24px -> 1.666667vw` на desktop
- `32px -> 2.222222vw` на desktop
- `48px -> 3.333333vw` на desktop
- `1368px -> 95vw` на desktop
- `16px -> 4.266667vw` на mobile
- `24px -> 6.4vw` на mobile
- `32px -> 8.533333vw` на mobile
- `48px -> 12.8vw` на mobile
- `355px -> 94.666667vw` на mobile

## Что переводим во `vw`, а что можно оставить в `px`

Во `vw` обычно уводим:

- ширины
- высоты
- отступы
- gaps
- радиусы
- font-size
- позиционирование
- размеры декоративных элементов

В `px` можно оставлять:

- `1px` бордеры
- тонкие линии
- деликатные штрихи
- иногда маленькие тени или outline offsets, если так стабильнее
- html-атрибуты `width`/`height` у изображений для intrinsic size

Если чистый `vw` даёт нестабильный результат, допускается смешанный вариант через `clamp()`. Это уже есть в hero, где высота градиентной маски завязана и на `vw`, и на `vh`.

## Какой media query считаем дефолтным

Дефолт для страницы услуг сейчас такой:

```scss
@include mixins.mobile {
  ...
}
```

То есть:

```scss
@media (max-width: 1024px)
```

Не плодим raw media queries без причины. Если задача обычная, используем project mixin. `respond-max(md|lg|xl)` можно применять для редких промежуточных кейсов, но основной mobile split в проекте сейчас именно `1024`.

## Контейнеры и типовые размеры

Общий контейнерный паттерн уже есть в `@mixin container`:

```scss
width: min(100% - vw(72px), vw(1368px));
```

На mobile:

```scss
width: min(100% - mvw(32px), 100%);
```

Но на `/services/` есть и секции с кастомными контейнерами:

- где-то `1360px` под desktop
- на mobile боковые поля бывают `20px`, `32px`, `40px` в зависимости от композиции

Вывод:

- сначала смотри существующий паттерн соседней секции
- если это стандартный блок, можно брать общий container
- если секция завязана на точную FiCSS-композицию, контейнер можно задавать вручную

## Как мы верстаем секции

Основной подход по `/services/`:

- BEM-нейминг
- у крупной секции свой block: `services-hero`, `services-overview`, `services-benefits`, и т.д.
- у компонентов свои block-и: `service-card`, `cta-band`, `project-case-card`
- js-хуки отделены от стилевых классов и идут через `js-*`

Хорошая практика из текущего кода:

- стили и поведение не смешиваются в одном классе
- repeated UI не копипастится, а собирается из component partial
- данные секции можно хранить массивом рядом с шаблоном секции
- для вариаций компонента используются modifier class-ы вроде `service-card--low-copy`, `is-active`

## Когда можно делать отдельную mobile-разметку

Можно, если макет реально ломается на мобильном и костылить один DOM дороже, чем поддерживать два.

В проекте уже есть такой паттерн:

- `services-reasons-hex.php` содержит отдельную desktop scene и отдельную mobile composition

То есть правило не "один DOM любой ценой", а "поддерживаем тот DOM, который реально проще и чище обслуживать".

## Когда можно передавать стили из PHP через CSS custom properties

Это нормальный проектный паттерн. Уже используется для:

- hero background image
- project section background image
- card image position
- cta pattern image
- project-case media image

Если у блока динамический asset, удобнее пробрасывать его через inline custom property, чем плодить новые modifier-классы только ради URL.

## Нюансы именно по странице `/services/`

### 1. Hero не просто "блок на всю высоту"

- используется `100svh`
- на desktop hero фиксируется как screen-like section
- на mobile высота отпускается в `auto`, но секция всё равно держит full-screen характер
- заголовок на mobile часто не ужимается тем же DOM-потоком, а отдельно докручивается по line-break логике

### 2. Mobile у нас не "сжатый desktop"

По коду видно, что mobile версия часто пересобирается отдельно:

- меняется flow
- меняются размеры
- меняются переносы строк
- некоторые секции переходят из pinned/animated layout в native horizontal scroll или stacked layout

То есть mobile нужно проектировать отдельно, а не просто уменьшать desktop коэффициентом.

### 3. Горизонтальные секции на desktop и native fallback на mobile

Паттерн уже закреплён:

- desktop: GSAP + ScrollTrigger + pin
- mobile: обычный scroll/scroll-snap-подобное поведение или кнопочная прокрутка

Это уже сделано для:

- benefits
- projects
- process

### 4. Один общий `main.js`

Новая интерактивность по проекту пока добавляется в `assets/js/main.js`, отдельные файлы под каждую секцию сейчас не заведены.

Значит:

- новые init-функции добавляем туда же
- обязательно с ранними `return`, если DOM не найден
- отдельно обрабатываем desktop/mobile поведение

### 5. Если геометрия сложная, документируем математику рядом

Хороший текущий пример:

- `services-reasons-hex.php`

Там прямо в комментарии сохранена исходная геометрия hex-grid из пиксельной композиции. Такой подход правильный. Если секция строится по вычисляемой геометрии, оставляем рядом короткую математику/легенду.

## Правила по JS

Дефолты по текущему проекту:

- один файл `assets/js/main.js`
- каждая фича в своей init-функции
- вызов через общий `runInit(...)`
- защита от падений через `try/catch`
- проверка viewport внутри init-функции
- проверка наличия DOM-узлов до старта логики
- `js-*` классы используем как hooks

Используемые паттерны:

- `Lenis` для desktop smooth scroll
- `GSAP + ScrollTrigger` для pinned/scroll-driven секций
- `IntersectionObserver` для mobile process timeline
- native `scrollTo` / `scrollLeft` для mobile-каруселей

## Правила по компонентам

Если блок повторяется или может повториться, лучше сразу делать component partial.

По текущему проекту это означает:

- карточки не вшиваем в section template вручную
- CTA-полосы не копируем, а собираем через `cta-band`
- карточки проекта/услуг/процесса живут отдельно и получают данные через `$args`

Нормальный способ:

- section partial содержит массив данных
- в цикле вызывается `get_template_part(..., $args)`

## Правила по стилям

- Исходник страницы услуг: `assets/scss/pages/_services-page.scss`
- Подключение страницы идёт через `assets/scss/main.scss`
- SCSS разложен слоями: `abstracts`, `base`, `components`, `layouts`, `pages`

Что это значит practically:

- переменные и функции не дублируем в page partial
- общие миксины тянем из `abstracts`
- layout/style соглашения держим в существующей структуре, не создаём хаос из случайных папок

## Workflow по git

Зафиксировать как дефолт для этого проекта:

- если пользователь отдельно не сказал иначе, коммитим в `main`
- если пользователь отдельно не сказал иначе, пушим в `main`

Практически:

- перед коммитом смотрим `git status`
- не откатываем чужие или несвязанные изменения
- не трогаем грязные файлы без необходимости
- коммит должен быть маленьким и логичным

## Что считать good default для новых блоков

1. Сначала решить, это section или component.
2. Если повторяется, вынести в component partial.
3. Размеры считать от `1440` и `375`.
4. Mobile делать через `@include mixins.mobile`.
5. Технические `1px` можно не переводить.
6. JS hook-и выносить в `js-*`.
7. Анимацию на desktop не тянуть на mobile без причины.
8. Править source, потом пересобирать CSS.

## Короткий чеклист перед версткой

- Это точно новая секция, а не вариация существующего компонента?
- Есть ли смысл вынести повторяемую карточку/CTA в `template-parts/components/`?
- Все размеры посчитаны от `1440` / `375`?
- Mobile реально спроектирован, а не просто уменьшен?
- Нужен ли отдельный mobile DOM?
- Не лучше ли пробросить картинку через CSS custom property?
- Для JS есть отдельный `js-*` hook?
- После SCSS будет пересобран CSS?

## Короткий чеклист перед коммитом

- Менял исходники, а не только скомпилированный CSS
- Нет случайных правок в несвязанных файлах
- Если менялся SCSS, CSS пересобран
- Структура page/section/component не развалена
- Для GraffiT по умолчанию ветка и push target: `main`

