<template>
  <div class="relative overflow-hidden">
    <!-- Main carousel container -->
    <div
      class="flex transition-transform duration-500 ease-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(slide, index) in slides" :key="index" class="min-w-full">
        <div class="relative h-[400px] w-full">
          <img
            :src="slide.image"
            :alt="slide.title"
            class="w-full h-full object-cover rounded-lg"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"
          ></div>
          <div class="absolute bottom-0 left-0 p-6 text-white">
            <h3 class="text-2xl font-bold mb-2">{{ slide.title }}</h3>
            <p class="text-gray-200">{{ slide.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <button
      @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Dots indicators -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="index === currentIndex ? 'bg-white w-4' : 'bg-white/50'"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Slide {
  image: string;
  title: string;
  description: string;
}

const props = defineProps<{
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}>();

const currentIndex = ref(0);
let autoplayInterval: number | undefined;

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
};

const prev = () => {
  currentIndex.value =
    currentIndex.value === 0 ? props.slides.length - 1 : currentIndex.value - 1;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const startAutoplay = () => {
  if (props.autoplay && props.interval) {
    autoplayInterval = setInterval(next, props.interval) as unknown as number;
  }
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>
