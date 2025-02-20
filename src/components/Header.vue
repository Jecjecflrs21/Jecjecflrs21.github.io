<template>
  <v-main>
    <v-container fluid>
      <v-row class="img-row">
        <img src="@/assets/ingcoph_logo_alt.png" width="10%" class="img-fluid ingco_image" style="margin-left: 7px;">
        <v-btn x-small @click="toggleMenu" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
          Menu
          <v-icon size="32" center>
            mdi-menu
          </v-icon>
        </v-btn>
        <transition name="slide">
          <div v-if="showMenu" style="display: flex;">
            <v-btn x-small to="/"  @click="reloadPage" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
              Mobile Bar
              <v-icon size="32" center>
                mdi-liquor
              </v-icon>
            </v-btn>
            <v-btn x-small to="/register" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
              pre-registration
              <v-icon size="32" center>
                mdi-fountain-pen-tip
              </v-icon>
            </v-btn>
            <v-btn x-small to="/confirmation" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
              confirm registration
              <v-icon size="32" center>
                mdi-check-all
              </v-icon>
            </v-btn>
            <v-btn disabled x-small to="/raffle" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
              Raffle Draw
              <v-icon size="32" center>
                mdi-trophy
              </v-icon>
            </v-btn>
            <v-btn x-small to="/INGCOdashboard" @click="$emit('toggle-sheet')" color="transparent" dark class="black-font underline-animation-black" style="margin-left: 10px; font-family: Evogria;">
              Official Participants
              <v-icon size="32" center>
                mdi-table-star
              </v-icon>
            </v-btn>
          </div>
        </transition>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
        showMenu: true
      };
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      toggleSheet() {
        this.$emit('toggle-sheet');
      },
      reloadPage() {
        window.location.reload();
      },
    },
  };
</script>

<style>
  .img-row { background-color: #f69f1a; height: 100%; display: flex; align-items: center; }
  .transparent-btn { background-color: transparent; border: none; }
  .black-font { color: black !important; }
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(-6%);
  }
</style>
