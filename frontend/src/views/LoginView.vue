<!-- Remove navbar for this view ? Or replace ? -->

<template>
    <div>
        <a :href="url">
            <span>Login</span>
        </a>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                url: "http://localhost:3000/auth/42/redirect",
            };
        },
    };
</script>