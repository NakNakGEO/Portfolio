<template>
  <div class="relative min-h-screen">
    <!-- Profile Content -->
    <div class="relative z-10 px-6 pt-32">
      <div class="max-w-xl bg-black/30 backdrop-blur-lg rounded-lg p-8 border border-purple-500/20">
        <!-- Add profile image -->
        <div class="mb-6">
          <img 
            :src="profileImage"
            alt="Profile"
            class="w-24 h-24 rounded-full border-2 border-purple-500/30 object-cover"
          />
        </div>

        <h1 class="text-4xl font-bold mb-2">Suon Ratanak</h1>
        <h2 class="text-xl text-gray-300 mb-4">Full Stack Developer</h2>
        <p class="text-gray-300 mb-6">
          Passionate about creating immersive web experiences and pushing the
          boundaries of what's possible in web development.
          Specializing in modern web technologies and creative solutions.
        </p>
        <div class="flex gap-4">
          <button class="btn-primary">
            View My Work
          </button>
          <button class="btn-secondary">
            Contact Me
          </button>
        </div>
      </div>
    </div>

    <!-- Solar System Background -->
    <SolarSystem />
  </div>
</template>

<script setup lang="ts">
import SolarSystem from '../components/SolarSystem.vue';
import profileImage from '../assets/photo_2024-10-24_12-55-31.jpg';
</script>

<style scoped>
/* Add any missing styles here */
</style>
