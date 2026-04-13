<?php

namespace App\Livewire\Admin\Departments;

use Livewire\Component;
use Livewire\Attributes\Layout;

#[Layout('layouts.admin')]
class Index extends Component
{
    public function render()
    {
        return view('livewire.admin.departments.index');
    }
}