<!-- @format -->

<script setup>
import {onMounted} from 'vue'
import { useUsersApi } from '../composables/useUsersApi';
const emit=defineEmits(['exit'])
const {title,user,role}=defineProps(['title','user','role'])

const userApi=useUsersApi()
const {userHistory}=userApi

onMounted(async ()=>{
  await userApi.getUserAidHistoty(user,role)
})

function close(){
  emit('close')
  userHistory.value=[]
}

function convertToPersianDate(isoTimestamp) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const persianLocale = 'fa-IR-u-ca-persian';
  
  const date = new Date(isoTimestamp);
  const persianDate = new Intl.DateTimeFormat(persianLocale, options).format(date);
  
  return persianDate;
}

</script>

<template>
  <div class="user-history-overlay">
    <div class="history">
      <span
        class="material-symbols-sharp"
        id="exit"
        @click="close"
      >
        close
      </span>
      <h2>{{ title }}</h2>
      <table v-if="userHistory.length > 0">
        <thead>
          <tr>
            <th>عنوان</th>
            <th class="responsive-hidden">تعدا کالا</th>
            <th>تاریخ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in userHistory">
            <td>{{ history.title }}</td>
            <td>{{ history.quantity }}</td>
            <td>{{ convertToPersianDate(history.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.user-history-overlay {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  z-index: 9;
  overflow: auto;
}

.user-history-overlay .history {
  align-items: center;
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  padding: var(--card-padding);
  position: relative;
  width: 40rem;
  min-height: 30rem;
  max-height: 50rem;
}

#exit {
  color: var(--color-danger);
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

#exit:hover {
  color: red;
  transition: all 300ms ease;
}

.user-history-overlay .history table {
  background: var(--color-light);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  cursor: pointer;
  margin-top: 1rem;
  max-height: 24rem;
  overflow-y: auto;
  padding: var(--card-padding);
  transition: all 300ms ease;
  text-align: center;
  width: 95%;
}

.user-history-overlay .history table:hover {
  box-shadow: none;
}

.user-history-overlay .history table tbody tr td {
  height: 2.8rem;
  border-bottom: 1px solid var(--color-light);
  color: var(--color-dark);
}

.user-history-overlay .history table tbody tr:last-child td {
  border: none;
}
</style>
