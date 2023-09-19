<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        numberOfPlayers: {
            type: Number,
            default: 0
        }
    },
    methods: {
        cancelSearch() {
            this.$emit('cancel');
        }
    }
}
</script>

<template>
    <div v-if="isOpen">
        <h2>Finding opponent</h2>
        <p>{{ numberOfPlayers }} player(s) in queue</p>
        <button @click="cancelSearch">Cancel</button>
    </div>
</template>

<style scoped>
</style>