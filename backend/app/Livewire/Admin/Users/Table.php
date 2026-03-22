<?php

namespace App\Livewire\Admin\Users;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $sortField = 'id';
    public $sortDirection = 'asc';
    public $perPage = 10;

    public bool $showAdminActionModal = false;
    public $adminActionUserId = null;
    public $adminActionSecret = '';
    public $adminActionType = '';
    public $q = '';

    protected $listeners = [
        'refreshTable' => '$refresh',
        'usersDeleteConfirmed' => 'delete',
    ];

    protected $paginationTheme = 'tailwind';

    public function render()
    {
        $users = User::query()
            ->select('id', 'employee_id', 'role_id', 'email', 'phone', 'status', 'name')
            ->with([
                'role:id,name,role_code',
                'employee:id,name,phone',
            ])
            ->when($this->q, function ($query) {
                $query->where(function ($sub) {
                    $sub->where('name', 'like', '%' . $this->q . '%')
                        ->orWhere('email', 'like', '%' . $this->q . '%')
                        ->orWhere('phone', 'like', '%' . $this->q . '%');
                });
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage);

        return view('livewire.admin.users.table', [
            'users' => $users,
        ]);
    }

    public function updatedPerPage()
    {
        $this->resetPage();
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }

        $this->resetPage();
    }

    public function edit($id)
    {
        $this->dispatch('editUser', id: $id);
    }

    public function confirmDelete($id)
    {
        $user = User::with('role')->findOrFail($id);

        if ((int) Auth::id() === (int) $id) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Bạn không thể xóa chính tài khoản đang đăng nhập.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        if ($this->isAdminUser($user)) {
            $this->openAdminActionModal($user->id, 'delete');
            return;
        }

        $this->dispatch('openDeleteModal', itemId: $id, targetEvent: 'usersDeleteConfirmed');
    }

    public function delete($itemId)
    {
        $user = User::findOrFail($itemId);

        if ((int) Auth::id() === (int) $user->id) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Bạn không thể xóa chính tài khoản đang đăng nhập.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $user->delete();

        $this->resetPageIfNeeded();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Tài khoản đã được xóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }

    public function requestToggleStatus($id)
    {
        $user = User::with('role')->findOrFail($id);

        if ((int) Auth::id() === (int) $user->id) {
            $this->dispatch(
                'notify',
                title: 'Không thể thực hiện',
                message: 'Bạn không thể tự khóa tài khoản của mình.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $isLocking = (bool) $user->status === true;

        if ($this->isAdminUser($user) && $isLocking) {
            $this->openAdminActionModal($user->id, 'lock');
            return;
        }

        $this->toggleStatusDirect($user);
    }

    public function openAdminActionModal($userId, $type)
    {
        $this->adminActionUserId = $userId;
        $this->adminActionType = $type;
        $this->adminActionSecret = '';
        $this->resetValidation('adminActionSecret');
        $this->showAdminActionModal = true;
    }

    public function confirmAdminAction()
    {
        $this->validate([
            'adminActionSecret' => ['required', 'string'],
        ], [
            'adminActionSecret.required' => 'Vui lòng nhập mã xác nhận Admin.',
        ]);

        $secret = env('ADMIN_CREATION_SECRET');

        if (blank($secret) || $this->adminActionSecret !== $secret) {
            $this->addError('adminActionSecret', 'Mã xác nhận Admin không đúng.');
            return;
        }

        $user = User::with('role')->findOrFail($this->adminActionUserId);

        if ((int) Auth::id() === (int) $user->id) {
            $this->dispatch(
                'notify',
                title: 'Không thể thực hiện',
                message: 'Bạn không thể thao tác trên chính tài khoản đang đăng nhập.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        if ($this->adminActionType === 'lock') {
            $user->status = false;
            $user->save();

            $this->dispatch(
                'notify',
                title: 'Khóa thành công',
                message: 'Tài khoản Admin đã bị khóa.',
                type: 'success',
                duration: 2200
            );
        }

        if ($this->adminActionType === 'delete') {
            $user->delete();
            $this->resetPageIfNeeded();

            $this->dispatch(
                'notify',
                title: 'Xóa thành công',
                message: 'Tài khoản Admin đã được xóa.',
                type: 'success',
                duration: 2200
            );
        }

        $this->closeAdminActionModal();
        $this->dispatch('refreshTable');
    }

    public function closeAdminActionModal()
    {
        $this->showAdminActionModal = false;
        $this->adminActionUserId = null;
        $this->adminActionSecret = '';
        $this->adminActionType = '';
        $this->resetValidation('adminActionSecret');
    }

    protected function toggleStatusDirect(User $user): void
    {
        $user->status = ! $user->status;
        $user->save();

        $this->dispatch(
            'notify',
            title: 'Cập nhật trạng thái',
            message: $user->status ? 'Tài khoản đã được kích hoạt.' : 'Tài khoản đã bị khóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }

    protected function isAdminUser(User $user): bool
    {
        return $user->role && $user->role->role_code === 'ADMIN';
    }

    protected function resetPageIfNeeded(): void
    {
        $currentPageCount = User::query()
            ->select('id')
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage, ['*'], 'page', $this->getPage())
            ->count();

        if ($currentPageCount === 0 && $this->getPage() > 1) {
            $this->previousPage();
        }
    }

    public function mount()
    {
        $this->q = request('q', '');
    }
}