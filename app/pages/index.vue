<script setup lang="ts">
const { user, fetchUser } = useAuth();

await fetchUser();

if (user.value) {
  await navigateTo("/trips");
} else {
  await navigateTo("/login");
}
</script>

<!-- <template>
  <main>
    <h1>TripKit</h1>
  </main>
</template> -->
