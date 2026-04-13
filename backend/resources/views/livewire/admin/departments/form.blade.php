<div>
    @if($open)
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            wire:key="department-form-modal-{{ $isEdit ? 'edit-'.$department_id : 'create' }}"
        >
            <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div class="mb-6 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-slate-800">
                        {{ $isEdit ? 'Cập nhật phòng ban' : 'Thêm phòng ban' }}
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
                    <div class="space-y-4">
                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">
                                Tên phòng ban
                            </label>
                            <input
                                type="text"
                                wire:model.live="name"
                                class="w-full rounded-xl border px-3 py-2"
                                placeholder="VD: Kế toán, Kho vận, Kinh doanh..."
                            >
                            @error('name')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">
                                Mô tả
                            </label>
                            <textarea
                                wire:model.live="description"
                                rows="4"
                                class="w-full rounded-xl border px-3 py-2"
                                placeholder="Nhập mô tả phòng ban..."
                            ></textarea>
                            @error('description')
                                <div class="mt-1 text-sm text-red-500">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        Phòng ban dùng để tổ chức nhân sự trong doanh nghiệp. Một phòng ban có thể có nhiều nhân viên.
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