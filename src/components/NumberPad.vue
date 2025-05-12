<template>
  <div class="number-pad">
    <NumberButton
      v-for="(num, index) in numbers"
      :key="index"
      :number="num"
      @click-number="handleNumberClick"
    />
  </div>
</template>

<script>
import NumberButton from './NumberButton.vue';

export default {
  name: 'NumberPad',
  components: {
    NumberButton,
  },
  setup(props, { emit }) {
    const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

    const handleNumberClick = (number) => {
      emit('click-number', number);
    };

    return {
      numbers,
      handleNumberClick,
    };
  },
};
</script>

<style scoped>
.number-pad {
  display: contents;
}
</style>
