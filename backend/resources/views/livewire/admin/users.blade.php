<div class="space-y-6">

    {{-- THÔNG BÁO --}}
    @if (session()->has('message'))
        <div class="bg-green-100 text-green-700 p-3 rounded-lg">
            {{ session('message') }}
        </div>
    @endif


    {{-- FORM THÊM / SỬA --}}
    <div class="bg-white p-6 rounded-xl shadow">

        <h2 class="text-xl font-semibold text-slate-700 mb-5 flex items-center gap-2">
             {{ $isEdit ? 'Cập nhật nhân sự' : 'Thêm nhân sự' }}
        </h2>

        <div class="grid grid-cols-3 gap-4">

            <input
                type="text"
                wire:model="name"
                placeholder="Tên nhân sự"
                class="border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            >

            <input
                type="email"
                wire:model="email"
                placeholder="Email"
                class="border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            >

            <input
                type="text"
                wire:model="phone"
                placeholder="Số điện thoại"
                class="border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            >

        </div>

        <div class="mt-4 space-x-2">

            @if($isEdit)

                <button
                    wire:click="update"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Cập nhật
                </button>

                <button
                    wire:click="resetInput"
                    class="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                    Huỷ
                </button>

            @else

                <button
                    wire:click="store"
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
                >
                    <span class="text-lg">＋</span>Thêm
                </button>

            @endif

        </div>

    </div>



    {{-- DANH SÁCH NHÂN SỰ --}}
    <div class="bg-white p-6 rounded-xl shadow">

        <div class="flex justify-between items-center mb-4">

            <h2 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
                 DANH SÁCH NHÂN SỰ
            </h2>

            {{-- CHỌN SỐ DÒNG --}}
            <select
                wire:model.live="perPage"
                class="border p-2 rounded-lg"
            >
                <option value="5">5 dòng</option>
                <option value="10">10 dòng</option>
                <option value="20">20 dòng</option>
            </select>

        </div>


        <table class="w-full border">

            <thead class="bg-slate-50 border-b border-slate-200 text-sm text-slate-700">

            <tr>

                <th class="px-5 py-3 text-left w-20">
                    <button
                        type="button"
                        wire:click="sortBy('id')"
                        class="flex items-center gap-1 font-semibold hover:text-green-600 transition"
                    >
                        ID

                        @if($sortField === 'id')
                            <span class="text-xs text-green-600">
                                {{ $sortDirection === 'asc' ? '▲' : '▼' }}
                            </span>
                        @endif
                    </button>
                </th>


                <th class="px-5 py-3 text-left font-semibold">
                    Tên
                </th>


                <th class="px-5 py-3 text-left font-semibold">
                    Email
                </th>


                <th class="px-5 py-3 text-left font-semibold">
                    Số điện thoại
                </th>


                <th class="px-5 py-3 text-right w-40 font-semibold">
                    Hành động
                </th>

            </tr>

            </thead>

            <tbody>

                @foreach($users as $user)

                <tr>

                <td class="p-2 border text-center">
                    {{ $user->id }}
                </td>

                <td class="p-2 border">
                    {{ $user->name }}
                </td>

                <td class="p-2 border">
                    {{ $user->email }}
                </td>

                <td class="p-2 border">
                    {{ $user->phone }}
                </td>

                <td class="px-4 py-3 flex justify-end gap-2">

                <button
                wire:click="edit({{ $user->id }})"
                class="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
                >
                Sửa
                </button>

                <button
                wire:click="delete({{ $user->id }})"
                onclick="confirm('Bạn chắc chắn xoá?') || event.stopImmediatePropagation()"
                class="inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-700 transition"
                >
                Xóa
                </button>

                </td>

                </tr>

                @endforeach

                </tbody>

        </table>


        {{-- PHÂN TRANG --}}
        <div class="mt-4">

            {{ $users->links() }}

        </div>

    </div>

</div>