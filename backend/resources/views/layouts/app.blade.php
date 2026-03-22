<!DOCTYPE html>
<html lang="vi">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>{{ $title ?? 'ERP Admin' }}</title>

<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
@livewireStyles



</head>

<body class="bg-slate-50 text-slate-900">

@php
$userName = auth()->user()->name ?? 'Admin';

$initials = collect(explode(' ', trim($userName)))
->filter()
->take(2)
->map(fn($w) => mb_strtoupper(mb_substr($w,0,1)))
->implode('');

$nav = [
    ['label'=>'Dashboard','icon'=>'home','url'=>'#'],
    ['label'=>'Nhân viên','icon'=>'users','url'=>'#'],
];

$icons = [

'home'=>'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z"/>
</svg>',

'users'=>'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
<circle cx="9" cy="7" r="4" stroke-width="2"/>
</svg>'

];

$pageTitle = $title ?? 'Nhóm 15(T4C1)- Hệ thống Admin (Livewire Backend) | API Endpoint: domain(here)/api/...';

@endphp


<div x-data="{ sidebar:true }" class="flex min-h-screen">

<!-- SIDEBAR -->
<aside
:class="sidebar ? 'w-64' : 'w-20'"
class="bg-white border-r flex flex-col transition-all duration-300">

<!-- Logo -->
<div class="p-5 border-b flex items-center gap-3">

<div class="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-bold">
ERP
</div>

<div x-show="sidebar" x-transition>
<div class="font-bold">ERP System</div>
<div class="text-xs text-gray-500">Management</div>
</div>

</div>


<!-- Menu -->
<nav class="p-3 space-y-1">

@foreach($nav as $item)

<a href="{{ $item['url'] }}"
class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">

<span>{!! $icons[$item['icon']] !!}</span>

<span x-show="sidebar" x-transition>
{{ $item['label'] }}
</span>

</a>

@endforeach

</nav>


<!-- User -->
<div class="mt-auto p-4 border-t">

<div class="flex items-center gap-3">

<div class="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-full font-bold">
{{ $initials ?: 'AD' }}
</div>

<div x-show="sidebar">
<div class="text-sm font-semibold">{{ $userName }}</div>
<div class="text-xs text-gray-500">Administrator</div>
</div>

</div>

</div>

</aside>


<!-- MAIN -->
<div class="flex-1 flex flex-col">


<header class="bg-white border-b px-6 py-4 flex justify-between items-center">

<div class="flex items-center gap-3">

<!-- Nút thu sidebar -->
<button
@click="sidebar = !sidebar"
class="p-2 rounded hover:bg-gray-100">

☰

</button>

<div class="font-bold text-lg">
{{ $pageTitle }}
</div>

</div>


<div class="flex items-center gap-3">

<div class="text-sm text-gray-600">
{{ $userName }}
</div>

<div class="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-full font-bold">
{{ $initials ?: 'AD' }}
</div>

</div>

</header>


<main class="p-6">

{{ $slot }}

</main>


</div>

</div>


@livewireScripts
<div
    x-data="toastSystem()"
    x-on:notify.window="add($event.detail)"
    class="fixed top-5 right-5 space-y-3 z-50"
>

    <template x-for="toast in toasts" :key="toast.id">
        <div
            x-show="toast.show"
            x-transition:enter="transition ease-out duration-300"
            x-transition:leave="transition ease-in duration-200"
            :class="{
                'bg-green-500': toast.type === 'success',
                'bg-red-500': toast.type === 'error',
                'bg-yellow-500': toast.type === 'warning',
                'bg-blue-500': toast.type === 'info'
            }"
            class="text-white px-5 py-3 rounded-lg shadow-lg min-w-[250px]"
        >
            <div class="flex justify-between items-center gap-3">
                <span x-text="toast.message"></span>

                <button @click="removeById(toast.id)">✖</button>
            </div>
        </div>
    </template>

</div>

<script>
function toastSystem() {
    return {
        toasts: [],

        add(data) {
            let toast = {
                message: data.message || 'Thông báo',
                type: data.type || 'info',
                show: true
            };

            this.toasts.push(toast);

            setTimeout(() => {
                toast.show = false;
            }, 3000);
        },

        remove(index) {
            this.toasts.splice(index, 1);
        }
    }
}
</script>
</body>

</html>
