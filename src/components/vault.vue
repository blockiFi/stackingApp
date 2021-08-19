<template>
<div class="container" style="height: 70vh; margin-top: 10vh; ">
       <v-data-table
    :headers="headers"
    :items="stacks"
    :items-per-page="5"
    
    class="elevation-1"
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus'
    }"
  >
  <template  v-slot:top="">
    <v-toolbar
    flat
  >
    <p><v-toolbar-title>Total Stacked Value : {{ new Intl.NumberFormat().format(lockedValue)}}</v-toolbar-title></p>
    <p></p>
    <v-divider
      class="mx-4"
      inset
      vertical
    ></v-divider>
    <v-spacer></v-spacer>
    <v-toolbar-title>Token Balance : {{new Intl.NumberFormat().format(balance)}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <button class="btn btn-primary" @click="stackModal = true">Stack Token</button>
  </v-toolbar>
   
  </template>
<template v-slot:item="row">
          <tr >
              <td>{{row.item.id}}</td>
              <td>{{new Intl.NumberFormat().format(row.item.amount)}} </td>
              <td>{{row.item.percentageReturn}}%</td>
              <td>
              <span >{{getDate(row.item.releaseDate)}}</span>
              </td>
              <td>
              <span v-if="row.item.claimed">Closed</span>
              <span v-else > Active</span>
              </td>
              <td>
                 <v-btn v-if="!row.item.claimed" color="success" @click="claimReward(row.item.id)">Claim</v-btn >
              </td>
          </tr>
      </template>
  </v-data-table>  

  <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="stackModal"
      >
        
        <template >
          <v-card>
          <v-toolbar
              color="dark"
              dark
            >Stack Token</v-toolbar>
            <v-row>
              <v-col
              col="6"
              >
              
            <v-text-field
              v-model="stackAmount"
              label="Stack Amount"
              type="number"
              required
            ></v-text-field>
             
              </v-col>
              <v-col
              col="6"
              >
             <v-select
              v-model="select"
              :items="packages"
              item-text="name"
              item-value="id"
              label="Package"
              required
            ></v-select>
              </v-col>
              
            </v-row>
            <v-row>  
            <v-col
              col="6"
              >
             <h4 @click="stackAmount = balance">Token Balance : {{new Intl.NumberFormat().format(balance)}}</h4>
              </v-col></v-row>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="stackModal = false"
              >Close</v-btn>
               <v-btn
               v-if="viewbutton && approve"
               color="warning"
                text
                @click="approveSpend"
              >Approve</v-btn>
                <v-btn
               v-if="viewbutton && stack"
               color="success"
                text
                @click="stackToken"
              >Stack</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>  
</div>
</template>


<script>
// import Web3 from 'web3';
import  { stakeAddress } from "../store/modules/abi";
export default {

  data(){
      return {
        stack: false,
        approve : true,
        select:"",
        stackAmount:0,
      stackModal : false,
        headers: [
                      
                        {
                        text: ' ID', 
                       
                        sortable: false,
                        value: 'id',
                        },
                        { text: 'Stacked Amount', value: 'amount' },
                        { text: ' Expected Yield ', value: 'reward' },
                        { text: 'Release Date', value: 'releaseDate' },
                        { text: 'Release Date', value: 'Status' },
                        { text: 'Action', sortable: false,},
                    ],  
      }
  },
   computed: {
     
     viewbutton: function(){
       if(this.stackAmount == 0 || this.select == ""){
         return false;
       }else{
         return true;
       }
     },
     packages:function(){
       return this.$store.state.vault.packages;
     },
     stacks : function(){
       return   this.$store.state.vault.stacks;
     },
     user : function(){
     return this.$store.state.currentUser.user;
   },
    balance : function(){
    return   this.$store.state.vault.tokenBalance;
      },
    lockedValue : function() {
     return   this.$store.state.vault.totalValueLocked; 
    }
    },

  mounted(){
     this.$store.dispatch('vault/availaleBalance');  
  },
  methods : {
    async claimReward(id){
       this.$store.dispatch("loading/activateLoader" , true)
        try {     
                 await window.stackContract.methods.unstack(id).send({from: this.$store.state.currentUser.user.address});
                 this.$toast.success("Token Stacked successfull");
             
                    this.$store.dispatch("loading/activateLoader" , false);
                    this.approve = true;
                    this.stack = false;
                    this.stackAmount = 0;
                    this.select = "";
                     this.$store.dispatch('vault/availaleBalance'); 
             }
            catch(error){
                this.$toast.error("Not yet time to unstack"); 
                console.log(error);
                 this.$store.dispatch("loading/activateLoader" , false)
            }
    },
    async currentBlock(){
     let block = await window.web3.eth.getBlock(await window.web3.eth.getBlockNumber());
     return block.timestamp;
    },
    
    async readyToclaim(date){
      console.log( await this.currentBlock())

      return Date.now() > date;
    },
    getDate(date){
       var date1 = new Date(date*1000);
       return date1.toUTCString();
     },
    async stackToken(){
      this.$store.dispatch("loading/activateLoader" , true)
      try {     
                 await window.stackContract.methods.stacktoken(window.web3.utils.toBN(window.web3.utils.toWei(this.stackAmount)).toString(), this.select ).send({from: this.$store.state.currentUser.user.address});
                 this.$toast.success("Token Stacked successfull");
             
                    this.$store.dispatch("loading/activateLoader" , false);
                    this.approve = true;
                    this.stack = false;
                    this.stackAmount = 0;
                    this.select = "";
                    this.$store.dispatch('vault/availaleBalance');
             }
            catch(error){
                this.$toast.error("Insufient Reward Balance"); 
                console.log(error);
                 this.$store.dispatch("loading/activateLoader" , false)
            }
    },
  async approveSpend(){
    
      this.$store.dispatch("loading/activateLoader" , true)
      try {     
                 await window.tokenContract.methods.approve(stakeAddress ,window.web3.utils.toBN(window.web3.utils.toWei(this.stackAmount)).toString() ).send({from: this.$store.state.currentUser.user.address});
                 this.$toast.success("Approval successfull");
                  
                    this.$store.dispatch("loading/activateLoader" , false);
                    this.approve = false;
                    this.stack = true;
                    
            }
            catch(error){
                this.activeapprove = false;
                this.$toast.error(error.message); 
                 this.$store.dispatch("loading/activateLoader" , false)
            }
  },
  async getTokenBalance(){
    await window.tokenContract.methods.balanceOf(this.user.address).call()
    .then(function(result){
      console.log(result);
    });
  }
  }
}
</script>