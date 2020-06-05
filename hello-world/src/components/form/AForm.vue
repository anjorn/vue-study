<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            model: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            rules: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        methods: {
            validate() {
                this.$children
            }
        },
</script>

<style lang="scss" scoped>

</style>