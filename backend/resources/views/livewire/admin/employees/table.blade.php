<div>
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
        <div class="px-4 py-3 sm:px-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Danh sách nhân viên</h3>

                <div class="flex items-center gap-4">
                    <input type="text" wire:model="search" placeholder="Tìm kiếm..." class="px-4 py-2 border rounded-lg">
                    <select wire:model="perPage" class="px-4 py-2 border rounded-lg">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-200">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nhân viên</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã nhân viên</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($employees as $employee)
                        <tr>
                            <td class="px-4 py-3 text-sm text-gray-900">{{ $employee->name }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">{{ $employee->employee_code }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">{{ $employee->phone }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">{{ $employee->department->name ?? 'N/A' }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">{{ $employee->role->name ?? 'N/A' }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">
                                <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold text-green-800 bg-green-100">
                                    {{ $employee->status ? 'Hoạt động' : 'Không hoạt động' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-right">
                                <button wire:click="$emit('editEmployee', {{ $employee->id }})" class="text-indigo-600 hover:text-indigo-900">Sửa</button>
                                <button wire:click="$emit('confirmDelete', {{ $employee->id }})" class="text-red-600 hover:text-red-900">Xóa</button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="px-4 py-3 bg-gray-50 text-right">
                {{ $employees->links() }}
            </div>
        </div>
    </div>
</div>