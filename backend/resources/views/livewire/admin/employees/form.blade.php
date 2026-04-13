<div>
    @if($open)
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">
                            {{ $isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên' }}
                        </h2>
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
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">Tên nhân viên</label>
                            <input type="text" wire:model.live="name" class="w-full rounded-xl border px-3 py-2">
                            @error('name') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">Mã nhân viên</label>
                            <input type="text" wire:model.live="employee_code" class="w-full rounded-xl border px-3 py-2">
                            @error('employee_code') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</label>
                            <input type="text" wire:model.live="phone" class="w-full rounded-xl border px-3 py-2">
                            @error('phone') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">Phòng ban</label>
                            <select wire:model.live="department_id" class="w-full rounded-xl border px-3 py-2">
                                <option value="">-- Chọn phòng ban --</option>
                                @foreach($departmentOptions as $department)
                                    <option value="{{ $department->id }}">{{ $department->name }}</option>
                                @endforeach
                            </select>
                            @error('department_id') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-slate-700">Vai trò</label>
                            <select wire:model.live="role_id" class="w-full rounded-xl border px-3 py-2">
                                <option value="">-- Chọn vai trò --</option>
                                @foreach($roleOptions as $role)
                                    <option value="{{ $role->id }}">{{ $role->name }}</option>
                                @endforeach
                            </select>
                            @error('role_id') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>

                        <div class="col-span-2">
                            <label class="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
                            <select wire:model.live="status" class="w-full rounded-xl border px-3 py-2">
                                <option value="1">Hoạt động</option>
                                <option value="0">Không hoạt động</option>
                            </select>
                            @error('status') <div class="text-sm text-red-500">{{ $message }}</div> @enderror
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-6">
                        <button type="button" wire:click="close" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                            Hủy
                        </button>

                        <button type="submit" class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                            {{ $isEdit ? 'Cập nhật' : 'Lưu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</div>