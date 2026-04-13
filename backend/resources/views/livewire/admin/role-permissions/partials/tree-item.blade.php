@php
    $hasChildren = !empty($node['children']);
    $isChecked = in_array((string) $node['id'], $selectedMenuIds, true);
@endphp

<div class="rounded-xl border border-slate-200 bg-white">
    <div
        class="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-start lg:justify-between"
        style="margin-left: {{ $level * 14 }}px"
    >
        <div class="min-w-0 flex-1">
            <div class="flex items-start gap-3">
                <input
                    type="checkbox"
                    wire:model.live="selectedMenuIds"
                    value="{{ $node['id'] }}"
                    class="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                >

                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="font-medium text-slate-800">
                            {{ $node['name'] }}
                        </div>

                        @if($node['menu_type'] === 'sidebar')
                            <span class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-[11px] font-medium text-blue-700">
                                Sidebar
                            </span>
                        @else
                            <span class="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
                                Action
                            </span>
                        @endif

                        @if($node['status'])
                            <span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-[11px] font-medium text-green-700">
                                Active
                            </span>
                        @else
                            <span class="inline-flex rounded-full bg-red-100 px-2 py-1 text-[11px] font-medium text-red-700">
                                Inactive
                            </span>
                        @endif
                    </div>

                    <div class="mt-2 flex flex-wrap gap-2 text-xs">
                        @if($node['permission_key'])
                            <span class="rounded bg-slate-100 px-2 py-1 text-slate-700">
                                {{ $node['permission_key'] }}
                            </span>
                        @endif

                        @if($node['path'])
                            <span class="rounded bg-blue-50 px-2 py-1 text-blue-700">
                                {{ $node['path'] }}
                            </span>
                        @endif

                        @if($node['icon'])
                            <span class="rounded bg-purple-50 px-2 py-1 text-purple-700">
                                {{ $node['icon'] }}
                            </span>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        @if($hasChildren)
            <div class="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    wire:click="addBranch({{ $node['id'] }})"
                    class="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                >
                    Chọn nhánh
                </button>

                <button
                    type="button"
                    wire:click="removeBranch({{ $node['id'] }})"
                    class="rounded-lg bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-200"
                >
                    Bỏ nhánh
                </button>
            </div>
        @endif
    </div>

    @if($hasChildren)
        <div class="space-y-2 px-3 pb-3">
            @foreach($node['children'] as $child)
                @include('livewire.admin.role-permissions.partials.tree-item', [
                    'node' => $child,
                    'level' => $level + 1,
                ])
            @endforeach
        </div>
    @endif
</div>