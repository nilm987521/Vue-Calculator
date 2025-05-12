<template>
  <button 
    class="btn shadow function-button" 
    :class="buttonClass"
    @click="onClick"
  >
    {{ func }}
  </button>
</template>

<script>
export default {
  name: 'FunctionButton',
  props: {
    func: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'normal',
      validator: (value) => {
        return ['normal', 'operator', 'special'].includes(value);
      }
    },
    colWidth: {
      type: Number,
      default: 4,
      validator: (value) => {
        return value > 0 && value <= 12;
      }
    }
  },
  setup(props, { emit }) {
    const onClick = () => {
      emit('click-function', props.func);
    };

    const buttonClass = computed(() => {
      const classes = [`col-${props.colWidth}`];
      
      switch (props.type) {
        case 'operator':
          classes.push('btn-danger');
          break;
        case 'special':
          classes.push('btn-warning');
          break;
        default:
          classes.push('btn-info');
          break;
      }
      
      return classes;
    });

    return {
      onClick,
      buttonClass
    };
  }
};

import { computed } from 'vue';
</script>

<style scoped>
.function-button {
  border: 5px solid #fff;
  border-radius: 30px;
  padding: 15px;
  font-size: 20px;
}
</style>
