<template>
  <div class="operator-pad">
    <FunctionButton
      v-for="(func, index) in functions"
      :key="index"
      :func="func"
      type="operator"
      :colWidth="12"
      @click-function="handleFunctionClick"
    />
  </div>
</template>

<script>
import FunctionButton from './FunctionButton.vue';

export default {
  name: 'OperatorPad',
  components: {
    FunctionButton,
  },
  setup(props, { emit }) {
    const functions = ['AC', '÷', '×', '-', '+'];

    const handleFunctionClick = (func) => {
      emit('click-function', func);
    };

    return {
      functions,
      handleFunctionClick,
    };
  },
};
</script>

<style scoped>
.operator-pad {
  display: contents;
}
</style>
