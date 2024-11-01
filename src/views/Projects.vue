<template>
  <div class="relative px-4 py-20">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-center">My Projects</h1>

      <!-- Add the carousel -->
      <div class="mb-12">
        <Carousel :slides="carouselSlides" :autoplay="true" :interval="5000" />
      </div>

      <!-- Rest of your projects grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projects"
          :key="project.id"
          class="group bg-black/30 backdrop-blur-lg rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
        >
          <div class="relative h-48">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
            ></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 text-purple-300">
              {{ project.title }}
            </h3>
            <p class="text-gray-300 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-2 py-1 text-sm bg-purple-600/30 rounded-full text-purple-300"
              >
                {{ tech }}
              </span>
            </div>
            <a
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              View Project
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from '../components/Carousel.vue';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with real-time inventory management.',
    image: '/projects/project1.jpg',
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    link: '#',
  },
  {
    id: 2,
    title: 'Social Media Dashboard',
    description:
      'Analytics dashboard for social media management and monitoring.',
    image: '/projects/project2.jpg',
    technologies: ['React', 'TypeScript', 'Firebase'],
    link: '#',
  },
  {
    id: 3,
    title: 'AI Chat Application',
    description: 'Real-time chat application with AI-powered responses.',
    image: '/projects/project3.jpg',
    technologies: ['Vue.js', 'Python', 'TensorFlow'],
    link: '#',
  },
];

// Create carousel slides from your projects
const carouselSlides = projects.map((project) => ({
  image: project.image,
  title: project.title,
  description: project.description,
}));
</script>
