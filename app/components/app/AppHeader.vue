<script setup lang="ts">
const { user, logout } = useAuth();
</script>

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

    <div class="flex items-center gap-3">
      <UButton icon="i-lucide-plus" label="New trip" to="/trips/new" />

      <div class="flex items-center gap-3">
        <div v-if="user" class="hidden text-right sm:block">
          <div class="text-sm font-medium">
            {{ user.name }}
          </div>

          <div class="text-xs text-muted">
            {{ user.email }}
          </div>
        </div>

        <UButton
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          aria-label="Log out"
          @click="logout"
        />
      </div>
    </div>
  </header>
</template>
