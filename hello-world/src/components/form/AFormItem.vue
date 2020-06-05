<template>
    <div>
        <label>
            <span v-if="requried" class="red">*</span>
            {{label}}
        </label>
        <slot></slot>
        <div v-if="error">{{error}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                default: ''
            },
            requried: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                error: ''
            }
        },
    }
</script>

<style>
.red {
    color: red;
}
</style>