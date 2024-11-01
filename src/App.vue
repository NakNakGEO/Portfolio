<template>
  <div
    class="h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black text-white"
  >
    <Navigation />
    <div class="h-screen overflow-y-auto snap-y snap-mandatory relative z-10">
      <section class="snap-start min-h-screen">
        <Home />
      </section>
      <section class="snap-start min-h-screen">
        <Projects />
      </section>
      <section class="snap-start min-h-screen">
        <About />
      </section>
      <section class="snap-start min-h-screen">
        <Contact />
      </section>
    </div>
    <GalaxyBackground />
  </div>
</template>

<script setup lang="ts">
import Navigation from './components/Navigation.vue';
import GalaxyBackground from './components/GalaxyBackground.vue';
import Home from './views/Home.vue';
import Projects from './views/Projects.vue';
import About from './views/About.vue';
import Contact from './views/Contact.vue';
</script>

<style scoped>
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
</style>
