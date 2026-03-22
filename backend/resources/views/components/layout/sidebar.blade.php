@php
    $menu = config('admin_menu');
@endphp

<aside
    :class="sidebar ? 'w-64' : 'w-20'"
    class="bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm"
>
    {{-- Brand --}}
    <div class="p-3 border-b border-slate-200 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center text-xl font-bold shadow shrink-0">
                    E
                </div>

                <div x-show="sidebar" x-cloak class="min-w-0">
                    <div class="text-2xl font-extrabold tracking-tight text-white leading-none">
                        ERP
                    </div>
                    <div class="mt-1 text-xs font-medium text-emerald-50/90">
                        Admin Panel
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Navigation --}}
    <nav class="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
        <div x-show="sidebar" x-cloak class="px-2 pb-1 text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
            Menu chính
        </div>

        @foreach($menu as $item)
            @php
                $hasChildren = isset($item['children']);
                $isActive = false;

                if (!$hasChildren && isset($item['route']) && Route::has($item['route'])) {
                    $isActive = request()->routeIs($item['route']);
                }

                if ($hasChildren) {
                    foreach ($item['children'] as $child) {
                        if (isset($child['route']) && Route::has($child['route']) && request()->routeIs($child['route'])) {
                            $isActive = true;
                            break;
                        }
                    }
                }
            @endphp

            @if(!$hasChildren)
                <a
                    href="{{ Route::has($item['route']) ? route($item['route']) : '#' }}"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200
                    {{ $isActive
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-white hover:text-emerald-700'
                    }}"
                >
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl shrink-0
                        {{ $isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                        }}">
                        <x-layout.sidebar-icon :name="$item['icon']" />
                    </span>

                    <div x-show="sidebar" x-cloak class="min-w-0 flex-1">
                        <div class="truncate text-[14px] font-semibold">
                            {{ $item['label'] }}
                        </div>
                    </div>
                </a>
            @else
                <div x-data="{ openMenu: {{ $isActive ? 'true' : 'false' }} }" class="space-y-1">
                    <button
                        type="button"
                        @click="openMenu = !openMenu"
                        class="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-all duration-200
                        {{ $isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                        }}"
                    >
                        <span class="flex items-center gap-3 min-w-0">
                            <span class="flex h-10 w-10 items-center justify-center rounded-xl shrink-0
                                {{ $isActive ? 'bg-white text-emerald-600 shadow-sm' : 'bg-slate-100 text-slate-500' }}">
                                <x-layout.sidebar-icon :name="$item['icon']" />
                            </span>

                            <span x-show="sidebar" x-cloak class="truncate text-[14px] font-semibold">
                                {{ $item['label'] }}
                            </span>
                        </span>

                        <svg
                            x-show="sidebar"
                            x-cloak
                            :class="openMenu ? 'rotate-90 text-emerald-600' : 'text-slate-400'"
                            class="w-4 h-4 transition-transform shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>

                    <div x-show="sidebar && openMenu" x-cloak class="ml-5 pl-4 border-l border-slate-200 space-y-1">
                        @foreach($item['children'] as $child)
                            <a
                                href="{{ Route::has($child['route']) ? route($child['route']) : '#' }}"
                                class="block rounded-lg px-3 py-2 text-[13px] transition
                                {{ Route::has($child['route']) && request()->routeIs($child['route'])
                                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-800'
                                }}"
                            >
                                {{ $child['label'] }}
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif
        @endforeach
    </nav>


</aside>