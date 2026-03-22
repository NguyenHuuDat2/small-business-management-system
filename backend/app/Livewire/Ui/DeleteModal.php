<?php

namespace App\Livewire\Ui;

use Livewire\Component;

class DeleteModal extends Component
{
    public bool $open = false;
    public $itemId = null;
    public string $targetEvent = '';

    protected $listeners = [
        'openDeleteModal' => 'openModal',
    ];

    public function openModal($itemId, $targetEvent)
    {
        $this->itemId = $itemId;
        $this->targetEvent = $targetEvent;
        $this->open = true;
    }

    public function closeModal()
    {
        $this->open = false;
        $this->itemId = null;
        $this->targetEvent = '';
    }

    public function confirm()
    {
        if ($this->itemId && $this->targetEvent) {
            $this->dispatch($this->targetEvent, itemId: $this->itemId);
        }

        $this->closeModal();
    }

    public function render()
    {
        return view('livewire.ui.delete-modal');
    }
}