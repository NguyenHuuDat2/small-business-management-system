@props(['name'])

@switch($name)
    @case('home')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5 12 3l9 7.5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 9.75V19.5A1.5 1.5 0 0 0 6.75 21h10.5a1.5 1.5 0 0 0 1.5-1.5V9.75" />
        </svg>
        @break

    @case('settings')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317a1 1 0 0 1 .95-.69h1.45a1 1 0 0 1 .95.69l.285.878a1 1 0 0 0 .95.69h.924a1 1 0 0 1 .8.4l.85 1.17a1 1 0 0 1 0 1.18l-.57.784a1 1 0 0 0 0 1.176l.57.784a1 1 0 0 1 0 1.18l-.85 1.17a1 1 0 0 1-.8.4h-.924a1 1 0 0 0-.95.69l-.285.878a1 1 0 0 1-.95.69h-1.45a1 1 0 0 1-.95-.69l-.285-.878a1 1 0 0 0-.95-.69h-.924a1 1 0 0 1-.8-.4l-.85-1.17a1 1 0 0 1 0-1.18l.57-.784a1 1 0 0 0 0-1.176l-.57-.784a1 1 0 0 1 0-1.18l.85-1.17a1 1 0 0 1 .8-.4h.924a1 1 0 0 0 .95-.69l.285-.878Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" />
        </svg>
        @break

    @case('users')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0-3-.503 9.38 9.38 0 0 0-3 .503M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM3.75 20.25a8.25 8.25 0 0 1 16.5 0" />
        </svg>
        @break

    @case('shopping-cart')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386a1.5 1.5 0 0 1 1.45 1.12L5.82 7.5m0 0h12.208a1.5 1.5 0 0 1 1.45 1.88l-1.2 4.5a1.5 1.5 0 0 1-1.45 1.12H8.25a1.5 1.5 0 0 1-1.45-1.12L5.82 7.5Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm9 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
        @break

    @case('cube')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5m0-9L3 7.5m9 4.5v9" />
        </svg>
        @break

    @case('credit-card')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <rect x="2.25" y="5.25" width="19.5" height="13.5" rx="2.25" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 9.75h19.5" />
        </svg>
        @break

    @case('archive-box')
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5v10.125A2.625 2.625 0 0 1 17.625 20.25H6.375A2.625 2.625 0 0 1 3.75 17.625V7.5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 3.75H2.25v3.75h19.5V3.75Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 12h3" />
        </svg>
        @break

    @default
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="8" />
        </svg>
@endswitch