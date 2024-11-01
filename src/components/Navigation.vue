<template>
  <nav 
    class="fixed top-0 left-0 w-full z-20 transition-all duration-300"
    :class="{ 'bg-black/50 backdrop-blur-lg shadow-lg': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex-shrink-0">
          <router-link 
            to="/" 
            class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Galaxy Portfolio
          </router-link>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-purple-400 hover:scale-105 transform"
              :class="[
                isActive(item.path) 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-gray-300 hover:bg-purple-500/5'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-500/20 focus:outline-none"
          >
            <span class="sr-only">Open menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu -->
    <div 
      v-show="mobileMenuOpen" 
      class="md:hidden bg-black/95 backdrop-blur-lg"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.path"
          :to="item.path"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
          :class="[
            isActive(item.path) 
              ? 'text-purple-400 bg-purple-500/10' 
              : 'text-gray-300 hover:bg-purple-500/5 hover:text-purple-400'
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

const isActive = (path: string) => route.path === path;

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>