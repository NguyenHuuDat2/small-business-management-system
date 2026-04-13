<div>
    @if($open)
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            wire:key="role-form-modal-{{ $isEdit ? 'edit-'.$role_id : 'create' }}"
        >
            <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div class="mb-6 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-slate-800">
                        {{ $isEdit ? 'Cập nhật vai trò' : 'Thêm vai trò' }}
                    </h2>

                    <button
                        type="button"
                        wire:click="close"
                        class="text-2xl leading-none text-slate-400 hover:text-slate-600"
                    >
                        ×
                    </button>
                </div>

                <form wire:submit.prevent="save">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1 block text-sm font-medium">Mã vai trò</label>
                            <input
                                type="text"
                                wire:model.live="role_code"
                                placeholder="VD: SALES_MANAGER"
                                class="w-full rounded-lg border px-3 py-2 {{ $editingProtected ? 'bg-slate-100 cursor-not-allowed text-slate-400' : '' }}"
                                @if($editingProtected) readonly @endif
                            >
                            @error('role_code')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium">Tên vai trò</label>
                            <input
                                type="text"
                                wire:model.live="name"
                                placeholder="VD: Trưởng nhóm bán hàng"
                                class="w-full rounded-lg border px-3 py-2"
                            >
                            @error('name')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-span-2">
                            <label class="mb-1 block text-sm font-medium">Mô tả</label>
                            <textarea
                                wire:model.live="description"
                                rows="4"
                                placeholder="Nhập mô tả vai trò..."
                                class="w-full rounded-lg border px-3 py-2"
                            ></textarea>
                            @error('description')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="mt-4 rounded-lg px-4 py-3 text-sm {{ $editingProtected ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700' }}">
                        @if($editingProtected)
                            Vai trò ADMIN là vai trò hệ thống. Bạn có thể sửa tên hoặc mô tả, nhưng không nên đổi mã vai trò.
                        @else
                            Mã vai trò nên viết HOA, không dấu, dùng dấu gạch dưới để dễ mở rộng sau này.
                        @endif
                    </div>

                    <div class="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            wire:click="close"
                            class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            {{ $isEdit ? 'Cập nhật' : 'Lưu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</div>