<!-- <template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto text-center mb-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Home Improvement Projects
      </h1>
      <p class="text-lg text-gray-600">
        Discover our collection of beautiful home transformation projects
      </p>
    </div>

    <!-- Projects List -->
    <div class="max-w-4xl mx-auto space-y-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <!-- Project Header -->
        <div
          @click="toggleProject(project.id)"
          class="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
        >
          <h2 class="text-xl font-semibold text-gray-900">
            {{ project.title }}
          </h2>
          <svg
            :class="[
              'w-6 h-6 transform transition-transform',
              activeProject === project.id ? 'rotate-180' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <!-- Project Details -->
        <div
          v-show="activeProject === project.id"
          class="transition-all duration-500 ease-in-out"
        >
          <div class="border-t border-gray-200">
            <div class="p-6">
              <!-- Project Image -->
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-64 object-cover rounded-lg mb-6"
              />

              <!-- Project Description -->
              <p class="text-gray-600 mb-4">
                {{ project.description }}
              </p>

              <!-- Project Features -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Features:</h3>
                <ul class="list-disc list-inside space-y-1 text-gray-600">
                  <li v-for="feature in project.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <!-- Timeline -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Timeline:</h3>
                <p class="text-gray-600">{{ project.timeline }}</p>
              </div>

              <!-- Budget -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Budget Range:</h3>
                <p class="text-gray-600">{{ project.budget }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center mb-8">
        Ready to Start Your Project?
      </h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="contactForm.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="contactForm.email"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            v-model="contactForm.message"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div class="text-center">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
  timeline: string;
  budget: string;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Sample projects data
const projects = ref<Project[]>([
  {
    id: 1,
    title: 'Modern Kitchen Renovation',
    description:
      'Complete kitchen transformation with custom cabinets, quartz countertops, and smart appliances.',
    image: '/images/kitchen-renovation.jpg',
    features: [
      'Custom maple cabinets',
      'Quartz countertops',
      'Smart appliances',
      'LED lighting system',
      'Island with seating',
    ],
    timeline: '6-8 weeks',
    budget: '$30,000 - $45,000',
  },
  {
    id: 2,
    title: 'Master Bathroom Remodel',
    description:
      'Luxury bathroom renovation featuring a walk-in shower, double vanity, and heated floors.',
    image: '/images/bathroom-remodel.jpg',
    features: [
      'Walk-in shower with glass enclosure',
      'Double vanity with marble top',
      'Heated floor system',
      'Custom tile work',
      'Modern fixtures',
    ],
    timeline: '4-6 weeks',
    budget: '$20,000 - $35,000',
  },
  // Add more projects as needed
]);

const activeProject = ref<number | null>(null);
const contactForm = ref<ContactForm>({
  name: '',
  email: '',
  message: '',
});

const toggleProject = (projectId: number) => {
  activeProject.value = activeProject.value === projectId ? null : projectId;
};

const submitForm = () => {
  // Implement form submission logic here
  console.log('Form submitted:', contactForm.value);
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    message: '',
  };
  // Show success message or handle errors
};
</script> -->
