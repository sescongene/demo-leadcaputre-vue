<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const submitting = ref(false)
const success = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  submitting.value = true
  errorMessage.value = ''
  
  try {
    const response = await fetch('https://bot.mandalanarratives.com/webhook/2f7f8f15-58e2-4a68-b14f-5fdcf335034c', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })
    
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    
    // Clear form on success
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
    success.value = true
    
    setTimeout(() => {
      success.value = false
    }, 5000)
    
  } catch (err) {
    console.error('Submission failed', err)
    errorMessage.value = 'Failed to submit form. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

    <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
      
      <!-- Left side context -->
      <div class="flex flex-col justify-center text-white space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Unlock the Future of <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Your Business</span>
        </h1>
        <p class="text-lg text-slate-300 leading-relaxed max-w-md">
          Join our exclusive network today. Provide your details and we will reach out to schedule a free strategy session tailored just for you.
        </p>
        <ul class="space-y-3 pt-4">
          <li class="flex items-center space-x-3 text-slate-300">
            <svg class="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Personalized insights and analytics</span>
          </li>
          <li class="flex items-center space-x-3 text-slate-300">
            <svg class="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>24/7 Priority support</span>
          </li>
          <li class="flex items-center space-x-3 text-slate-300">
            <svg class="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Access to premium features</span>
          </li>
        </ul>
      </div>

      <!-- Right side form -->
      <div class="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white">Get Started Now</h2>
          <p class="text-slate-400 text-sm mt-2">Fill out the form below to claim your spot.</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="firstName" class="text-sm font-medium text-slate-300">First Name <span class="text-red-400">*</span></label>
              <input v-model="formData.firstName" required id="firstName" type="text" class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner" placeholder="John" />
            </div>
            <div class="space-y-1">
              <label for="lastName" class="text-sm font-medium text-slate-300">Last Name <span class="text-red-400">*</span></label>
              <input v-model="formData.lastName" required id="lastName" type="text" class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner" placeholder="Doe" />
            </div>
          </div>
          
          <div class="space-y-1">
            <label for="email" class="text-sm font-medium text-slate-300">Email Address <span class="text-red-400">*</span></label>
            <input v-model="formData.email" required id="email" type="email" class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner" placeholder="john@example.com" />
          </div>

          <div class="space-y-1">
            <label for="phone" class="text-sm font-medium text-slate-300">Phone Number</label>
            <input v-model="formData.phone" id="phone" type="tel" class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner" placeholder="+1 (555) 000-0000" />
          </div>

          <!-- Alert boxes -->
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm flex items-center shadow-lg">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ errorMessage }}
          </div>
          
          <div v-if="success" class="bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg p-3 text-sm flex items-center shadow-lg">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Successfully submitted! We'll be in touch soon.
          </div>

          <button :disabled="submitting" type="submit" class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden">
            <span v-if="!submitting" class="relative z-10 flex items-center justify-center">
              Sign Up Now
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span v-else class="relative z-10 flex items-center justify-center">
              <!-- Loading spinner -->
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
