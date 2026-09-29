<template>
  <div class="min-h-screen bg-default">
    <div class="flex min-h-screen">
      <aside class="hidden w-64 shrink-0 border-r border-default lg:block">
        <AppSidebar />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <main class="flex-1 p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
