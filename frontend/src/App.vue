<template>
  <div class="app">
    <h1>Password Manager</h1>

    <!-- Password Input -->
    <label>Password:</label>
    <div style="display: flex; align-items: center;">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" />
      <button @click="togglePassword">{{ showPassword ? '🙈' : '👁️' }}</button>
    </div>

    <p>Password Strength: <strong>{{ passwordStrength }}</strong></p>
    <button @click="generatePassword">Generate Strong Password</button>

    <!-- Method Selector -->
    <label>Choose encryption method:</label>
    <select v-model="method">
      <option>AES</option>
      <option>RSA</option>
    </select>

    <div style="margin-top: 10px;">
      <button @click="encrypt">Encrypt</button>
      <button @click="clearAll">Clear</button>
    </div>

    <!-- Encrypted Output -->
    <div v-if="encrypted" style="margin-top: 20px;">
      <p><strong>Encrypted:</strong></p>
      <textarea rows="3" readonly>{{ encrypted }}</textarea>
      <p><em>Encrypted in {{ encryptionTime }} ms</em></p>
      <button @click="decrypt">Decrypt</button>
    </div>

    <!-- Decrypted Output -->
    <div v-if="decrypted" style="margin-top: 20px;">
      <p><strong>Decrypted:</strong> {{ decrypted }}</p>
      <p><em>Decrypted in {{ decryptionTime }} ms</em></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const password = ref('')
const method = ref('AES')
const encrypted = ref('')
const decrypted = ref('')
const aesKey = ref('')
const encryptionTime = ref(null)
const decryptionTime = ref(null)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearAll = () => {
  password.value = ''
  encrypted.value = ''
  decrypted.value = ''
  aesKey.value = ''
  encryptionTime.value = null
  decryptionTime.value = null
}

// Password strength checker
const passwordStrength = computed(() => {
  const p = password.value
  if (p.length < 6) return 'Weak'
  if (/[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)) return 'Strong'
  return 'Moderate'
})

// Password generator
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}'
  let pass = ''
  for (let i = 0; i < 16; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = pass
}

const encrypt = async () => {
  try {
    const res = await axios.post('http://localhost:3000/encrypt', {
      password: password.value,
      method: method.value
    })
    encrypted.value = res.data.encrypted
    aesKey.value = res.data.key || ''
    encryptionTime.value = res.data.duration.toFixed(2)
    decrypted.value = ''
    decryptionTime.value = null
  } catch (err) {
    alert('Encryption error: ' + err.response?.data?.error || err.message)
  }
}

const decrypt = async () => {
  try {
    const res = await axios.post('http://localhost:3000/decrypt', {
      encrypted: encrypted.value,
      method: method.value,
      key: aesKey.value
    })
    decrypted.value = res.data.decrypted
    decryptionTime.value = res.data.duration.toFixed(2)
  } catch (err) {
    alert('Decryption error: ' + err.response?.data?.error || err.message)
  }
}
</script>

<style scoped>
.app {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: sans-serif;
}
input, textarea, select, button {
  margin: 5px 0;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
button {
  cursor: pointer;
}
</style>
