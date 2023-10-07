<script>
export default {
    name: 'MatchmakingButton',
    props: {
        isRanked: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        buttonText() {
            return this.isRanked ? 'Ranked' : 'Standard';
        }
    },
    methods: {
        handleClick() {
            if (this.isRanked) {
                console.log('Joining a ranked match...');
            } else {
                console.log('Joining a standard match...');
            }
        }
    }
}
</script>

<template>
</template>

<style scoped>
</style>