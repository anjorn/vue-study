<template>
    <div>
        <input :value="value" :type="type" :placeholder="placeholder" @input="onInput"/>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            placeholder: {
                type: String,
                default: '请输入'
            }
        },
        data() {
            return {
            }
        },
        methods: {
            onInput(e) {
                this.$emit('input', e.target.value)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>