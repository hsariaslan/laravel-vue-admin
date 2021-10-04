<template>
  <div class="tw-flex tw-flex-col tw-w-4/12">
    <span class="tw-text-lg">{{ record.title }}</span>
    <span class="tw-text-2xl tw-font-bold">{{ record.value }}</span>
  </div>
</template>

<script>
  export default {
    name: 'UserRecords',
    props: ['record'],
  }
</script>
