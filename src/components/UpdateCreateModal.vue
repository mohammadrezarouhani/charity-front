<script setup>
const emit = defineEmits(["onClose", "onSubmit"]);
const { modalInputs, title, errorInput } = defineProps([
  "modalInputs",
  "title",
  "errorInput",
]);
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <span class="material-symbols-sharp" id="close" @click="emit('onClose')">
        close
      </span>
      <h2>{{ title }}</h2>
      <slot> </slot>
      <label style="color: red; height: 1rem">{{ errorInput.value }}</label>
      <input id="submit" type="button" value="ثبت" @click="emit('onSubmit')" />
    </div>
  </div>
</template>

<style>
.overlay {
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

.overlay .modal {
  align-items: center;
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  padding: var(--card-padding);
  position: relative;
  width: 40rem;
  min-height: 30rem;
  max-height: 50rem;
  /* overflow-y: auto; */
}

.overlay .modal #close {
  color: var(--color-danger);
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  padding: 1rem;
  top: 1rem;
  right: 1rem;
}

.overlay .modal #close:hover {
  color: red;
  transition: all 300ms ease;
}

.overlay .modal input[type="text"],
input[type="password"],
input[type="number"] {
  background-color: var(--color-light);
  border-radius: var(--border-radius-1);
  color: var(--color-dark);
  font-size: 1.2rem !important;
  margin-top: 1rem;
  width: 90%;
  height: 2.4em;
  padding: 0.6rem;
}

select {
  background-color: var(--color-light);
  border-radius: var(--border-radius-1);
  color: var(--color-dark);
  font-size: 1.2rem !important;
  margin-top: 1rem;
  width: 90%;
  height: 2.4em;
  padding: 0.6rem;
}

.overlay .modal textarea {
  background-color: var(--color-light);
  border-radius: var(--border-radius-1);
  color: var(--color-dark);
  font-size: 1.2rem !important;
  font-family: "Vazirmatn", sans-serif;
  margin-top: 2rem;
  width: 90%;
  height: 8rem;
  max-height: 8rem;
  overflow-y: auto;
  padding: 0.6rem;
  resize: none;
}

.overlay .modal .modal-opener {
  background-color: var(--color-light);
  border-radius: var(--border-radius-1);
  cursor: pointer;
  color: var(--color-dark);
  margin-top: 1rem;
  height: 2.6rem;
  transition: all 300ms ease;
  padding-right: 1rem;
  text-align: right;
  width: 90%;
}

.overlay .modal .modal-opener:hover {
  background-color: var(--color-background);
}

.overlay .modal #submit {
  background-color: var(--color-primary);
  border-radius: var(--card-border-radius);
  color: var(--color-white);
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 2.2rem;
  width: 90%;
  height: 3rem;
}
</style>
