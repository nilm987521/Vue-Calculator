<template>
  <button 
    class="btn btn-secondary col-4 shadow number-button" 
    @click="onClick"
  >
    {{ number }}
  </button>
</template>

<script>
export default {
  name: 'NumberButton',
  props: {
    number: {
      type: Number,
      required: true,
      validator: (value) => {
        return value >= 0 && value <= 9 && Number.isInteger(value);
      }
    }
  },
  setup(props, { emit }) {
    const onClick = () => {
      emit('click-number', props.number);
    };

    return {
      onClick
    };
  }
};
</script>

<style scoped>
.number-button {
  border: 5px solid #fff;
  border-radius: 30px;
  padding: 15px;
  font-size: 20px;
}
</style>
