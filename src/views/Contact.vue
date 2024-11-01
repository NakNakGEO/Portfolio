<template>
  <div class="relative px-4 py-20">
    <div class="max-w-2xl mx-auto bg-black/30 backdrop-blur-lg rounded-lg p-8">
      <h1 class="text-4xl font-bold mb-8 text-center">Contact Me</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2"
            >Name</label
          >
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
          />
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-2"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
          />
        </div>

        <div>
          <label
            for="message"
            class="block text-sm font-medium text-gray-300 mb-2"
            >Message</label
          >
          <textarea
            id="message"
            v-model="formData.message"
            rows="6"
            required
            class="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
        >
          Send Message
        </button>
      </form>

      <div class="mt-12 space-y-4">
        <h2 class="text-2xl font-bold text-center mb-6">
          Other Ways to Connect
        </h2>
        <div class="flex justify-center space-x-6">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-300 hover:text-purple-400 transition-colors"
          >
            {{ social.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  message: '',
});

const socials = [
  { name: 'GitHub', link: '#' },
  { name: 'LinkedIn', link: '#' },
  { name: 'Twitter', link: '#' },
];

const handleSubmit = () => {
  // Handle form submission logic here
  console.log('Form submitted:', formData.value);
  // Reset form
  formData.value = {
    name: '',
    email: '',
    message: '',
  };
};
</script>
