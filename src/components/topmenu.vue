<template>
<nav class="navbar navbar-expand-lg  bg-dark" >
        <div class="container-fluid">
            <img :src="logo" alt="" width="3%" class="m-1" style="border-radius: 10px;">
          <a class="navbar-brand" href="#"></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse " id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              
            </ul>
            <div class="d-flex">
              <div v-if="user.id" class="flex items-center rounded-lg bg-pink-deeper text-sm text-white py-2 px-3 connect-button" >
                 <div class="mr-2" @click="dialog = true">{{addressFormated}}</div>
             </div> 
             <button v-if="!user.id"  class="flex items-center rounded-lg bg-pink-deeper text-sm text-white py-2 px-3 connect-button" >
                <div class="mr-2" style="color: orangered;" @click="login()">connect wallet
            </div></button>
            </div>
          </div>
        </div>
        <v-dialog
        v-model="dialog"
        width="500"
        >
      

      <v-card>
   
<v-divider></v-divider>
        <v-card-text>

         Do you want to logout?
        </v-card-text>

        

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-btn
            color="warning"
            text
            @click="logout()"
          >
            logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </nav>
</template>
<script>
export default {
  data(){
      return {
        dialog : false,
          logo : require('@/assets/image.png')
      }
  },
   computed: {
    
    user : function(){
     return this.$store.state.currentUser.user;
   },
    addressFormated : function(){
     if(!this.user.address) return "";
     return this.user.address.substring(0 ,6) + "...." + this.user.address.substring(this.user.address.length -4 ,this.user.address.length)
   },
    },
  mounted(){
       setInterval(() => {
            if( localStorage.getItem("user") != null ){
               this.$store.dispatch("currentUser/setUser" , localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user"))  : {});   
            }
           if(this.user.address == undefined){
             this.$store.dispatch("currentUser/logout" );
           }
           
        }, 1000);
  },
  methods : {
      logout(){
         localStorage.removeItem("user");
         this.$store.dispatch("currentUser/logout" );
         this.dialog = false
      },
      login(){
        this.$store.dispatch('metamask/innitaliseWeb3').then(
            response =>{
              console.log(response);
              this.$store.dispatch('metamask/validateMetamaskAvailable')
              .then(
            response =>{
              console.log(response);
              this.$store.dispatch('metamask/loginMetaMask').then(
              () =>  {
                    this.$toast.success("login successful");
                    this.$store.dispatch("currentUser/setUser" , localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user"))  : {});
              }) 
            }
            ).catch (
                error => {
                    this.$toast.error(error.message);
                }
            )
            }
        ).catch (
            error => {
                this.$toast.error(error.message);
            }
        )
        }
  }

}
</script>