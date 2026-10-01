<script setup lang="ts">
const { t } = useI18n();
import { useTrips } from "~/composables/useTrips";

definePageMeta({ middleware: "auth" });

const { createTrip } = useTrips();
const { applyDefaultTemplate } = useChecklist();

const form = reactive({
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
});

const loading = ref(false);
const errorMessage = ref("");
const createStarterChecklist = ref(true);

const handleSubmit = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const trip = await createTrip(form);

    if (createStarterChecklist.value) {
      await applyDefaultTemplate(trip.id);
    }

    await navigateTo(`/trips/${trip.id}`);
  } catch (error: any) {
    errorMessage.value = t('trip.createError');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <UButton
      to="/trips"
      icon="i-lucide-arrow-left"
      :label="t('trip.backToTrips')"
      color="neutral"
      variant="ghost"
      class="mb-6"
    />

    <div class="mb-8">
      <h1 class="text-2xl font-semibold">{{ t('trip.create') }}</h1>

      <p class="mt-1 text-sm text-muted">{{ t('trip.createDescription') }}</p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :label="t('trip.name')" required>
          <UInput
            v-model="form.title"
            :placeholder="t('trip.titlePlaceholder')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('trip.destination')" required>
          <UInput
            v-model="form.destination"
            :placeholder="t('trip.destinationPlaceholder')"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t('trip.startDate')" required>
            <UInput v-model="form.startDate" type="date" class="w-full" />
          </UFormField>

          <UFormField :label="t('trip.endDate')" required>
            <UInput v-model="form.endDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField :label="t('trip.description')">
          <UTextarea
            v-model="form.description"
            :placeholder="t('trip.descriptionPlaceholder')"
            :rows="5"
            class="w-full"
          />
        </UFormField>

        <UCheckbox
          v-model="createStarterChecklist"
          :label="t('trip.starterChecklist')"
          :description="t('trip.starterDescription')"
        />

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :description="errorMessage"
        />

        <div class="flex justify-end gap-3">
          <UButton to="/trips" color="neutral" variant="ghost">{{ t('common.cancel') }}</UButton>

          <UButton type="submit" icon="i-lucide-plus" :loading="loading">{{ t('trip.create') }}</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
