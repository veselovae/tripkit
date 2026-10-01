<template>
  <div class="flex min-h-screen items-center justify-center bg-default p-4">
    <div class="w-full max-w-md">
      <div class="mb-4 flex justify-end">
        <LanguageSwitcher />
      </div>
      <div class="mb-8 flex justify-center">
        <AppLogo />
      </div>

      <slot />
    </div>
  </div>
</template>
