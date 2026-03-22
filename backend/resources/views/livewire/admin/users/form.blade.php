<div>
    @if($open)
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            wire:key="user-form-modal-{{ $isEdit ? 'edit-'.$user_id : 'create' }}"
        >
            <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-slate-800">
                        {{ $isEdit ? 'Cập nhật tài khoản' : 'Thêm tài khoản' }}
                    </h2>

                    <button
                        type="button"
                        wire:click="close"
                        class="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                @php
                    $selectedRole = collect($roles)->firstWhere('id', $role_id);
                    $isAdminRole = $selectedRole && $selectedRole->role_code === 'ADMIN';
                    $needsAdminSecret = $isAdminRole || $editingAdmin;
                    $canEditAdminSensitive = ! $needsAdminSecret || filled($admin_creation_password);
                @endphp

                <form wire:submit.prevent="save">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 text-sm font-medium">Role</label>
                            <select wire:model.live="role_id" class="w-full border rounded-lg px-3 py-2">
                                <option value="">-- Chọn role --</option>
                                @foreach($roles as $role)
                                    <option value="{{ $role->id }}">{{ $role->name }}</option>
                                @endforeach
                            </select>
                            @error('role_id')
                                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">Số điện thoại</label>
                            <input
                                type="text"
                                wire:model.live="phone"
                                class="w-full border rounded-lg px-3 py-2 {{ $needsAdminSecret && ! $canEditAdminSensitive ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : '' }}"
                                @if($needsAdminSecret && ! $canEditAdminSensitive) readonly @endif
                            >
                            @error('phone')
                                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">Tên</label>
                            <input
                                type="text"
                                wire:model.live="name"
                                class="w-full border rounded-lg px-3 py-2"
                            >
                            @error('name')
                                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">Status</label>
                            <select wire:model.live="status" class="w-full border rounded-lg px-3 py-2">
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            @error('status')
                                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-span-2">
                            <label class="block mb-1 text-sm font-medium">Email</label>
                            <input
                                type="email"
                                wire:model.live="email"
                                class="w-full border rounded-lg px-3 py-2 {{ $needsAdminSecret && ! $canEditAdminSensitive ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : '' }}"
                                @if($needsAdminSecret && ! $canEditAdminSensitive) readonly @endif
                            >
                            @error('email')
                                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        @if($needsAdminSecret)
                            <div class="col-span-2">
                                <label class="block mb-1 text-sm font-medium text-red-600">
                                    Mã xác nhận Admin
                                </label>
                                <input
                                    type="password"
                                    wire:model.live="admin_creation_password"
                                    class="w-full border rounded-lg px-3 py-2"
                                    placeholder="Nhập mã xác nhận để tạo / sửa / đổi role Admin"
                                >
                                @error('admin_creation_password')
                                    <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                                @enderror
                            </div>
                        @endif
                    </div>

                    <div class="mt-4 rounded-lg px-4 py-3 text-sm {{ $needsAdminSecret ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700' }}">
                        @if($needsAdminSecret)
                            Tài khoản Admin chỉ được phép tạo, chỉnh sửa, hoặc chuyển sang role khác khi nhập đúng mã xác nhận. Email và số điện thoại của Admin cũng bị khóa chỉnh sửa cho đến khi nhập mã.
                        @elseif($isEdit)
                            Khi cập nhật tài khoản, hệ thống sẽ đồng bộ lại thông tin sang hồ sơ nhân viên.
                        @else
                            Hệ thống sẽ tự tạo hồ sơ nhân viên và gửi thông tin đăng nhập qua email.
                        @endif
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            wire:click="close"
                            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            {{ $isEdit ? 'Cập nhật' : 'Lưu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</div>