<div
    x-data="{
        toasts: [],
        add(data) {
            const id = Date.now()

            this.toasts.push({
                id,
                title: data.title || 'Thông báo',
                message: data.message || '',
                type: data.type || 'info',
                show: true
            })

            setTimeout(() => {
                const item = this.toasts.find(t => t.id === id)
                if (item) item.show = false

                setTimeout(() => {
                    this.toasts = this.toasts.filter(t => t.id !== id)
                }, 250)
            }, data.duration || 2500)
        }
    }"
    x-on:notify.window="add($event.detail)"
    class="fixed top-5 right-5 z-[9999] space-y-3"
>
    <template x-for="toast in toasts" :key="toast.id">
        <div
            x-show="toast.show"
            x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="opacity-0 translate-y-2"
            x-transition:enter-end="opacity-100 translate-y-0"
            x-transition:leave="transition ease-in duration-150"
            x-transition:leave-start="opacity-100 translate-y-0"
            x-transition:leave-end="opacity-0 translate-y-2"
            :class="{
                'border-green-500': toast.type === 'success',
                'border-red-500': toast.type === 'error',
                'border-yellow-500': toast.type === 'warning',
                'border-blue-500': toast.type === 'info'
            }"
            class="w-[300px] bg-white border-l-4 rounded-xl shadow-lg px-4 py-3"
        >
            <div class="flex items-start justify-between gap-3">
                <div>
                    <div class="font-semibold text-slate-800" x-text="toast.title"></div>
                    <div class="text-sm text-slate-600 mt-1" x-text="toast.message"></div>
                </div>

                <button
                    @click="toast.show = false"
                    class="text-slate-400 hover:text-slate-600"
                >
                    ✕
                </button>
            </div>
        </div>
    </template>
</div>