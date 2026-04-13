<div>
    @if($open)
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            wire:key="menu-form-modal-{{ $isEdit ? 'edit-'.$menu_id : 'create' }}"
        >
            <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">
                            {{ $isEdit ? 'Cập nhật menu' : 'Thêm menu' }}
                        </h2>
                        <p class="mt-1 text-sm text-slate-500">
                            {{ $previewLabel }}
                        </p>
                    </div>

                    <button
                        type="button"
                        wire:click="close"
                        class="text-2xl leading-none text-slate-400 hover:text-slate-600"
                    >
                        ×
                    </button>
                </div>

                <form wire:submit.prevent="save" class="space-y-6">
                    {{-- KIỂU TẠO --}}
                    <div>
                        <label class="mb-3 block text-sm font-semibold text-slate-700">
                            Bạn muốn tạo loại nào?
                        </label>

                        <div class="grid gap-3 md:grid-cols-3">
                            <button
                                type="button"
                                wire:click="$set('entry_mode', 'module')"
                                class="rounded-2xl border p-4 text-left transition {{ $entry_mode === 'module' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50' }}"
                            >
                                <div class="font-semibold text-slate-800">Module cha</div>
                                <div class="mt-1 text-sm text-slate-500">
                                    Ví dụ: Hệ thống, Bán hàng, Kho, Kế toán
                                </div>
                            </button>

                            <button
                                type="button"
                                wire:click="$set('entry_mode', 'page')"
                                class="rounded-2xl border p-4 text-left transition {{ $entry_mode === 'page' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50' }}"
                            >
                                <div class="font-semibold text-slate-800">Page con</div>
                                <div class="mt-1 text-sm text-slate-500">
                                    Ví dụ: Tài khoản, Hóa đơn, Đơn bán hàng
                                </div>
                            </button>

                            <button
                                type="button"
                                wire:click="$set('entry_mode', 'action')"
                                class="rounded-2xl border p-4 text-left transition {{ $entry_mode === 'action' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50' }}"
                            >
                                <div class="font-semibold text-slate-800">Action</div>
                                <div class="mt-1 text-sm text-slate-500">
                                    Ví dụ: Tạo, Sửa, Xóa, Duyệt, Gửi kho
                                </div>
                            </button>
                        </div>
                    </div>

                    {{-- THÔNG TIN CHÍNH --}}
                    <div class="grid gap-4 md:grid-cols-2">
                        @if($entry_mode === 'page')
                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Module cha
                                </label>
                                <select wire:model.live="parent_id" class="w-full rounded-xl border px-3 py-2">
                                    <option value="">-- Chọn module cha --</option>
                                    @foreach($moduleOptions as $parent)
                                        <option value="{{ $parent['id'] }}">
                                            {{ $parent['name'] }} ({{ $parent['permission_key'] }})
                                        </option>
                                    @endforeach
                                </select>
                                @error('parent_id')
                                    <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                                @enderror
                            </div>
                        @endif

                        @if($entry_mode === 'action')
                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Màn hình cha
                                </label>
                                <select wire:model.live="parent_id" class="w-full rounded-xl border px-3 py-2">
                                    <option value="">-- Chọn page cha --</option>
                                    @foreach($pageOptions as $parent)
                                        <option value="{{ $parent['id'] }}">
                                            {{ $parent['name'] }} ({{ $parent['permission_key'] }})
                                        </option>
                                    @endforeach
                                </select>
                                @error('parent_id')
                                    <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                                @enderror
                            </div>

                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Loại thao tác
                                </label>
                                <select wire:model.live="action_code" class="w-full rounded-xl border px-3 py-2">
                                    @foreach($actionOptions as $code => $label)
                                        <option value="{{ $code }}">{{ $label }}</option>
                                    @endforeach
                                </select>
                            </div>

                            @if($action_code === 'custom')
                                <div class="md:col-span-2">
                                    <label class="mb-1 block text-sm font-medium text-slate-700">
                                        Mã thao tác tự nhập
                                    </label>
                                    <input
                                        type="text"
                                        wire:model.live="custom_action_code"
                                        class="w-full rounded-xl border px-3 py-2"
                                        placeholder="VD: lock_user hoặc resend_mail"
                                    >
                                </div>
                            @endif
                        @endif

                        <div class="{{ $entry_mode === 'action' ? 'md:col-span-2' : '' }}">
                            <label class="mb-1 block text-sm font-medium text-slate-700">
                                {{ $entry_mode === 'action' ? 'Tên quyền hiển thị' : 'Tên menu hiển thị' }}
                            </label>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    wire:model.live="name"
                                    class="w-full rounded-xl border px-3 py-2"
                                    placeholder="
                                    @if($entry_mode === 'module') VD: Kế toán
                                    @elseif($entry_mode === 'page') VD: Hóa đơn
                                    @else VD: Tạo hóa đơn
                                    @endif
                                    "
                                >
                                @if($entry_mode === 'action')
                                    <button
                                        type="button"
                                        wire:click="useSuggestedActionName"
                                        class="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                                    >
                                        Tự điền
                                    </button>
                                @endif
                            </div>
                            @error('name')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        @if($entry_mode !== 'action')
                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Icon
                                </label>
                                <input
                                    list="menu-icon-options"
                                    wire:model.live="icon"
                                    class="w-full rounded-xl border px-3 py-2"
                                    placeholder="Chọn hoặc nhập icon, VD: FiHome"
                                >
                                <datalist id="menu-icon-options">
                                    @foreach($iconOptions as $iconName)
                                        <option value="{{ $iconName }}">{{ $iconName }}</option>
                                    @endforeach
                                </datalist>
                                @error('icon')
                                    <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                                @enderror
                            </div>
                        @endif

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">
                                Thứ tự hiển thị
                            </label>
                            <input
                                type="number"
                                min="0"
                                wire:model.live="order_index"
                                class="w-full rounded-xl border px-3 py-2"
                                placeholder="VD: 10"
                            >
                            @error('order_index')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    {{-- PERMISSION KEY --}}
                    <div class="rounded-2xl border border-slate-200 p-4">
                        <div class="mb-3 flex items-center justify-between">
                            <label class="block text-sm font-semibold text-slate-700">
                                Permission key
                            </label>

                            <label class="inline-flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" wire:model.live="manualPermissionKey" class="rounded border-slate-300">
                                Cho phép chỉnh tay
                            </label>
                        </div>

                        <div class="flex gap-2">
                            <input
                                type="text"
                                wire:model.live="permission_key"
                                class="w-full rounded-xl border px-3 py-2 {{ !$manualPermissionKey ? 'bg-slate-50 text-slate-600' : '' }}"
                                placeholder="Hệ thống sẽ tự sinh permission key"
                                @if(!$manualPermissionKey) readonly @endif
                            >

                            <button
                                type="button"
                                wire:click="useSuggestedPermissionKey"
                                class="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                            >
                                Tự sinh lại
                            </button>
                        </div>

                        <div class="mt-2 text-xs text-slate-500">
                            Gợi ý: <span class="font-medium text-slate-700">{{ $generatedPermissionKey ?: 'Chưa đủ dữ liệu để tạo' }}</span>
                        </div>

                        @error('permission_key')
                            <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- PATH --}}
                    @if($entry_mode === 'page')
                        <div class="rounded-2xl border border-slate-200 p-4">
                            <div class="mb-3 flex items-center justify-between">
                                <label class="block text-sm font-semibold text-slate-700">
                                    Path trang
                                </label>

                                <label class="inline-flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" wire:model.live="manualPath" class="rounded border-slate-300">
                                    Cho phép chỉnh tay
                                </label>
                            </div>

                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    wire:model.live="path"
                                    class="w-full rounded-xl border px-3 py-2 {{ !$manualPath ? 'bg-slate-50 text-slate-600' : '' }}"
                                    placeholder="Hệ thống sẽ tự sinh path"
                                    @if(!$manualPath) readonly @endif
                                >

                                <button
                                    type="button"
                                    wire:click="useSuggestedPath"
                                    class="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                                >
                                    Tự sinh lại
                                </button>
                            </div>

                            <div class="mt-2 text-xs text-slate-500">
                                Gợi ý: <span class="font-medium text-slate-700">{{ $generatedPath ?: 'Chưa đủ dữ liệu để tạo' }}</span>
                            </div>

                            @error('path')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>
                    @endif

                    {{-- STATUS --}}
                    <div class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-slate-700">Trạng thái</div>
                                <div class="mt-1 text-xs text-slate-500">
                                    Bật để menu/quyền hoạt động, tắt để ẩn hoặc vô hiệu hóa tạm thời.
                                </div>
                            </div>

                            <button
                                type="button"
                                wire:click="toggleStatus"
                                class="relative inline-flex h-8 w-16 items-center rounded-full transition {{ $status ? 'bg-emerald-500' : 'bg-slate-300' }}"
                            >
                                <span
                                    class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition {{ $status ? 'translate-x-9' : 'translate-x-1' }}"
                                ></span>
                            </button>
                        </div>

                        <div class="mt-3">
                            @if($status)
                                <span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                                    ON - Đang hoạt động
                                </span>
                            @else
                                <span class="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                                    OFF - Tạm ẩn / vô hiệu hóa
                                </span>
                            @endif
                        </div>
                    </div>

                    {{-- PREVIEW --}}
                    <div class="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
                        <div class="font-semibold">Xem trước dữ liệu sẽ lưu</div>

                        <div class="mt-3 grid gap-2 md:grid-cols-2">
                            <div><strong>Kiểu:</strong> {{ strtoupper($entry_mode) }}</div>
                            <div><strong>Tên:</strong> {{ $name ?: '---' }}</div>
                            <div><strong>Permission:</strong> {{ $permission_key ?: '---' }}</div>
                            <div><strong>Path:</strong> {{ $path ?: '---' }}</div>
                            <div><strong>Icon:</strong> {{ $icon ?: '---' }}</div>
                            <div><strong>Thứ tự:</strong> {{ $order_index }}</div>
                        </div>

                        <div class="mt-3 text-xs text-blue-700">
                            <ul class="ml-5 list-disc space-y-1">
                                <li><strong>Module cha</strong>: không có parent, không có path.</li>
                                <li><strong>Page con</strong>: phải có module cha và có path.</li>
                                <li><strong>Action</strong>: phải có page cha, không có path, không cần icon.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            wire:click="close"
                            class="rounded-xl bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            class="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            {{ $isEdit ? 'Cập nhật' : 'Lưu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</div>