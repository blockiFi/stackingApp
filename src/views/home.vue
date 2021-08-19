<template>
<div>
<topmenu></topmenu>
<vault v-if="user.address"></vault>
<div v-else class="alert alert-warninng "><h4 style="text-align:center; color : white">Please connect your wallet </h4></div>
</div>
</template>
<script>
export default {
  data(){
      return {
      }
  },
   computed: {
    user : function(){
     return this.$store.state.currentUser.user;
   }},
  

}
</script>