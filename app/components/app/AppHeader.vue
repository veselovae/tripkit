<template>
  <header
    class="flex h-16 items-center justify-between border-b border-default px-4 md:px-6"
  >
    <div class="lg:hidden">
      <AppLogo />
    </div>

    <div class="hidden lg:block">
      <span class="text-sm text-muted"> Travel planner </span>
    </div>

    <div class="flex items-center gap-2">
      <UButton icon="i-lucide-plus" label="New trip" to="/trips/new" />

      <UAvatar alt="User" size="sm" />
    </div>
  </header>
</template>
