<template>
  <div id="app" class="">
    <Toast />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup>
useHead({
  bodyAttrs: {
  },
  htmlAttrs: {
    // class: 'p-dark',
  },
})

window.onerror = function (message, source, lineno, colno, error) {
  console.error('Error caught:', { message, source, lineno, colno, error })
  // Send the error details to the server
  reportErrorToServer({ message, source, lineno, colno, error })
}

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  // Send the error details to the server
  reportErrorToServer({ message: event.reason })
})

function reportErrorToServer(errorData) {
  fetch('/api/log-error', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(errorData),
  });
}

</script>


<style lang="scss" scoped>
</style>