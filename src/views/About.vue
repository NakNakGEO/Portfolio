<template>
  <div class="relative px-4 py-20">
    <div class="max-w-3xl mx-auto bg-black/30 backdrop-blur-lg rounded-lg p-8">
      <h1 class="text-4xl font-bold mb-8 text-center">About Me</h1>
      <div class="space-y-6 text-gray-300">
        <p>
          Hello! I'm a passionate Full Stack Developer with expertise in modern
          web technologies. My journey in software development started with a
          curiosity about how things work on the internet, and it has evolved
          into a professional career building innovative web solutions.
        </p>

        <h2 class="text-2xl font-bold text-purple-300 mt-8 mb-4">Skills</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(skills, category) in skillSet"
            :key="category"
            class="space-y-2"
          >
            <h3 class="font-semibold text-white">{{ category }}</h3>
            <ul class="list-disc list-inside">
              <li v-for="skill in skills" :key="skill" class="text-gray-300">
                {{ skill }}
              </li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-purple-300 mt-8 mb-4">Experience</h2>
        <div class="space-y-6">
          <div
            v-for="job in experience"
            :key="job.company"
            class="border-l-2 border-purple-500 pl-4"
          >
            <h3 class="font-bold text-white">{{ job.title }}</h3>
            <p class="text-purple-300">{{ job.company }}</p>
            <p class="text-sm text-gray-400">{{ job.period }}</p>
            <p class="mt-2">{{ job.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const skillSet = {
  Frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS'],
  Backend: ['Node.js', 'Python', 'SQL', 'REST APIs'],
  Tools: ['Git', 'Docker', 'AWS', 'CI/CD'],
};

const experience = [
  {
    title: 'junior Full Stack Developer',
    company: 'Tech Innovation Labs',
    period: '2020 - Present',
    description:
      'Leading development of enterprise web applications and mentoring junior developers.',
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Solutions Inc',
    period: '2018 - 2020',
    description:
      'Developed and maintained multiple client projects using modern web technologies.',
  },
];
</script>
