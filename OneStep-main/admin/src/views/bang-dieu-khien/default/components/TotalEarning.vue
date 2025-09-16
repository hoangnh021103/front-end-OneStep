<script setup lang="ts">
import iconCard from '@/assets/images/icons/icon-card.svg';

</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-6">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <img :src="iconCard" width="25" />
        </v-btn>
      </div>
      <h2 class="text-h1 font-weight-medium">
        150,250.00 vnđ <a href="#"><CircleArrowUpRightIcon stroke-width="1.5" width="28" class="text-white" /> </a>
      </h2>
      <span class="text-subtitle-1 text-medium-emphasis text-white">Doanh Thu Giày Thể Thao</span>
    </v-card-text>
  </v-card>
</template>
