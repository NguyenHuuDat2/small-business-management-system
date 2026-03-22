<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'ERP Admin' }}</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        [x-cloak] { display: none !important; }
    </style>

    @livewireStyles
</head>

<body class="bg-slate-50 text-slate-900">

<div x-data="{ sidebar:true }" class="flex min-h-screen">
    <x-layout.sidebar />

    <div class="flex-1 flex flex-col">
        <x-layout.header />

        <main class="p-6">
            {{ $slot }}
        </main>
    </div>
</div>

<livewire:ui.toast />
<livewire:ui.delete-modal />

@livewireScripts
</body>
</html>