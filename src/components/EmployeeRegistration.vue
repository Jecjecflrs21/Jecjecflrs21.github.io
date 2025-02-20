<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center align-items-start" style="min-height: 100vh;">
      <div class="col-md-10 col-lg-6 col-sm-10 g-mt-10">
        <div class="g-pa-40 g-mb-30 vacant_positions" role="alert">
          <div class="row">
            <div class="col-lg-12 col-sm-12 g-pa-2">
              <div class="form-group g-mb-20">
                <v-form>
                  <v-container>
                    <v-row>
                      <v-text-field 
                        @keyup.enter="submitEmployeeId" 
                        label="EMPLOYEE ID INPUT"
                        persistent-hint
                        regular
                        tile
                        outlined
                        clearable
                        color="orange"
                        x-large
                        class="fill-width"
                        v-model="employeeId"
                      ></v-text-field>
                    </v-row>
                    <v-row justify="center">
                      <v-btn @click="submitEmployeeId" elevation="24" color="orange" icon rounded fab plain>
                        <v-icon size="40" left>mdi-account-plus</v-icon>
                        <span class="underline-animation" style="font-family: Evogria; font-size: 1.8rem; font-weight: bold;">Register Now!</span>
                      </v-btn>
                    </v-row>
                    <v-dialog v-model="uploadModalOpen" persistent max-width="430" transition="dialog-top-transition">
                      <v-card class="orange-border" style="font-family: Evogria; font-size: smaller !important;" >
                        <v-card-title @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'orange-text': hovered }" style="font-size: 24px; justify-content: center;" >
                          Attendee Event Information 
                        </v-card-title>
                        <v-divider :thickness="50"></v-divider>
                        <v-card-text><v-icon size="31" left>mdi-account-check</v-icon> Name: &nbsp; <span class="white-text">{{ employeeName }}</span>
                          <v-divider :thickness="50"></v-divider>
                        </v-card-text>
                        <v-card-text><v-icon size="31" left>mdi-chair-rolling</v-icon>Table Number:  &nbsp; <span class="white-text">Table {{ tableNumber }}</span>
                          <v-divider :thickness="50"></v-divider>
                        </v-card-text>
                        <v-card-text><v-icon size="31" left>mdi-silverware-variant</v-icon>Buffet Table:  &nbsp; <span class="white-text">Table {{ buffetTable }}</span>
                          <v-divider :thickness="50"></v-divider>
                        </v-card-text>
                        <v-card-text><v-icon size="31" left>mdi-glass-mug-variant</v-icon>Mobile Bar Ticket:  &nbsp; <span class="white-text">{{ mobileBarTicket }}</span>
                          <v-divider :thickness="50"></v-divider>
                        </v-card-text>
                        <v-card-text><v-icon size="30" left>mdi-qrcode-scan</v-icon>QR Code: 
                          <v-spacer></v-spacer>
                          <div style="margin-bottom: 10px;"></div>
                          <v-sheet style="font-size: 18px; display:flex; justify-content:center;">
                            <img :src="qrImage" alt="QR Code" style="width: 300px; height: 300px;" />
                          </v-sheet>
                          <v-card-text style="font-style: italic; text-align: center; font-size: 13px; color: orange;">
                            <span>"</span>
                            <span style="text-decoration: underline;">Note: Please save QR code to show in mobile bar</span>
                            <span>"</span>
                          </v-card-text>
                          <v-divider :thickness="50"></v-divider>
                        </v-card-text>
                        <div style="display: flex; justify-content: center;">
                          <v-btn @click="downloadQR" class="orange-border underline-animation-black" @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'orange-text': hovered }"  color="orange" dark>
                            <span style="color: black;"><v-icon size="24" left>mdi-download-box</v-icon>Download QR and Close</span></v-btn>
                        </div>
                      </v-card>
                    </v-dialog>
                  </v-container>
                </v-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'EmployeeRegistration',
  data() {
    return {
      employeeId: '',
      employeeName: '',
      dialog: false,
      uploadModalOpen: false,
      uploadFileModalOpen: false,
      showDialog: false,
      tableNumber: '',
      buffetTable: '',
      mobileBarTicket: '',
      qrImage: '',
      hovered: false,
    };
  },
  methods: {
    async submitEmployeeId() {
      Swal.showLoading();
      try {
        await axios.post('http://127.0.0.1:8000/api/check-employee-bar_register', {
          employee_id: this.employeeId
        }).then((response)=>{
          this.employeedData = response.data.remaining_tickets;
          if (response.data.message === "Registration is complete!") { 
            this.tableNumber = response.data["0"].table_num;
            this.buffetTable = response.data["0"].buffet_meal_id;
            this.mobileBarTicket = response.data["0"].mobile_bar_count;
            this.employeeName = response.data["0"].full_name;
            Swal.fire({
              title: 'Success!',
              html: `${response.data.message}<br><br> Welcome <br> ${response.data["0"].full_name}
              <br> of <br> ${response.data["0"].department_name} Department`,
              icon: 'success',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'orange-button',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this.generateQR(this.employeeId);
                this.uploadModalOpen = true;  
              }
            });
          }
        });
        // console.log(response.data);
        }catch (error) {
        if (error.response.status === 500) {
          this.uploadModalOpen = false;
          Swal.fire({
            title: "<strong><u>NOT FOUND</u></strong>",
            text: error.response.data.message, // Access the message property from the response data object
            icon: 'warning',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'orange-button',
            }
          });
        } else {
          console.error(error);
        }
        // this.showDialog = false;
      }
    },
    async generateQR(employee_id) { Swal.showLoading();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/generate_QR', {
                employee_id: employee_id
            });

            const svgDataUri = `data:image/svg+xml;base64,${btoa(response.data)}`;
    this.qrImage = svgDataUri;
  } catch (error) {
    console.error(error);
  }
},
async downloadQR() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${this.employeeName}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire({
            title: 'CHECK YOUR DOWNLOADS!',
            text: 'Your QR Code has been downloaded successfully!',
            icon: 'success',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'orange-button',
            }
            })
            this.uploadModalOpen = false;   
  };
  
  img.src = this.qrImage;
}
},
created() {
    document.title = 'Registration';
}
};
</script>

<style>
@import '/src/assets/css/HelloWorld.css';
.custom-spacing {
  padding-left: 140px; /* Adjust the padding as needed */
}
.custom-spacing-name {
  padding-left: 85px; /* Adjust the padding as needed */
}
.orange-text {
  color: orange;
  transition: color 0.5s; /* You can adjust the transition duration as needed */
}
.custom-spacing-name {
  display: inline-block;
  margin-left: auto;
}
.white-text {
  color: white;
}
</style>
