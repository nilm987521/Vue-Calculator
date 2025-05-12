<template>
  <div class="equal-pad">
    <FunctionButton 
      v-for="(func, index) in functions"
      :key="index"
      :func="func"
      type="normal"
      @click-function="handleFunctionClick"
    />
  </div>
</template>

<script>
import FunctionButton from './FunctionButton.vue';

export default {
  name: 'EqualPad',
  components: {
    FunctionButton
  },
  setup(props, { emit }) {
    const functions = [".", "="];

    const handleFunctionClick = (func) => {
      emit('click-function', func);
    };

    return {
      functions,
      handleFunctionClick
    };
  }
};
</script>

<style scoped>
.equal-pad {
  display: contents;
}
</style>
