<template>
  <div class="row justify-content-center align-items-start" style="min-height: 95vh;">
    <v-dialog v-model="loginDialog" persistent max-width="430" transition="dialog-top-transition">
      <v-card class="orange-border" style="font-family: Evogria; font-size: smaller !important;">
        <v-card-title @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'orange-text': hovered }" style="font-size: 24px; justify-content: center;">
            Attendees Event Information
            <template>
              <v-sheet class="mx-auto" width="300">
                <v-form fast-fail @submit.prevent>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="Username"
                    color="orange"
                  ></v-text-field>
                  <v-text-field
                  @keyup.enter="loginClicked"
                    v-model="password"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    color="orange"
                    append-icon="mdi-eye"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-form>
              </v-sheet>
            </template>
          </v-card-title>
            <v-divider :thickness="50"></v-divider>
            <div style="display: flex; justify-content: center;">
            <v-btn to="/register" class="orange-border underline-animation-black" color="red" dark style="margin-right: 5px;">
              <span style="color: black;">
                <v-icon size="30"  class="flipped-icon">
                  mdi-home-export-outline
                </v-icon>
                Return
              </span>
            </v-btn>
            <v-btn @click="loginClicked" class="orange-border underline-animation-black" color="orange" dark>
              <span style="color: black;">
                <v-icon size="30">
                  mdi-login
                </v-icon>
                Log in
              </span>
            </v-btn>
          </div>
          </v-card>
          </v-dialog>
      <v-container v-if="loggedIn">
          <v-data-table v-model="selected" :headers="headers" :items="filteredEmployeeDatas" :single-select="singleSelect" item-key="id" show-select class="elevation-1 orange-border">
            <template v-slot:top>
              <div class="orange-bg" style="padding:0px; font-family: Evogria;">
                <v-row justify="space-between">
                  <v-col>
                    <v-btn color="black" @click="singleSelect = !singleSelect" class="pa-3 underline-animation-black" x-small plain style="font-size: 13px; height: 45px;">
                      <!-- {{ singleSelect ? 'Selecting Single' : 'Selecting Multiple' }} -->
                      <v-icon size="20">
                  mdi-file-table-box-multiple-outline
                </v-icon>
                    </v-btn> 
                    <v-btn color="black" @click="approveSelected" class="pa-3 underline-animation-black" x-small plain :disabled="selected.length === 0" style="font-size: 13px; height: 45px;">
                      {{ selected.length > 0 ? 'Approve' : 'Approved' }}
                    </v-btn>
                    <v-btn plain v-bind="attrs" v-on="on" to="/raffle" class="underline-animation-black" style="font-size: 13px; height: 45px;">
                          <span style="font-family: Evogria;">Raffle Draw</span>
                          <v-icon size="24" center>
                mdi-trophy
              </v-icon>
                        </v-btn>
                    <v-dialog max-width="430" transition="dialog-top-transition">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn plain v-bind="attrs" v-on="on" class="underline-animation-black" style="font-size: 13px; height: 45px;">
                          <span style="font-family: Evogria;">Download Data </span>
                          <v-icon size="24" center>
                                mdi-cloud-download
                              </v-icon>
                        </v-btn>
                      </template>
                      <v-card class="orange-border" style="font-family: Evogria; font-size: smaller !important;">
                        <v-card-title @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'orange-text': hovered }" style="font-size: 24px; justify-content: center;">
                          Attendees Event Information
                          <v-icon size="44" left>
                            mdi-microsoft-excel
                          </v-icon>
                        </v-card-title>
                        <v-divider :thickness="50"></v-divider>
                        <div style="display: flex; justify-content: center;">
                          <v-btn @click="downloadExcel" class="orange-border underline-animation-black" color="orange" dark @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'orange-text': hovered }">
                            <span style="color: black;">
                              <v-icon size="24" left>
                                mdi-download-box
                              </v-icon>
                              Download excel file
                            </span>
                          </v-btn>
                        </div>
                    </v-card>
                    </v-dialog>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                      @keyup.enter="filterData"
                          class="my-page"
                          dark
                          v-model="filterValue"
                          label="Enter Name or Employee ID"
                          @input="filterData"
                          color="black"
                          clearable
                          style="--v-text-field-outlined-border-color: black; --v-text-field-border-color: black;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
                          input-classes="black-text"
                        ></v-text-field>            
                    </v-col>
                </v-row>
              </div>
            </template>
          </v-data-table>
        </v-container>
    </div>
</template>
  <script>
    import axios from 'axios';
    import * as XLSX from 'xlsx';
    import Swal from 'sweetalert2';

    export
  default {
      data() {
        return {
          singleSelect: false,
          dialog: false,
          loginDialog: true,
          loggedIn: false,
          username: '',
          hovered: false,
          password: '',
          showPassword: false,  
          selected: [],
          headers: [{
            text: 'Employee Name',
            align: 'start',
            sortable: true,
            value: 'full_name'
          },
          {
            text: 'Employee ID',
            value: 'employee_id'
          },
          {
            text: 'Table #',
            value: 'table_num'
          },
          {
            text: 'Mobile Bar Count',
            value: 'mobile_bar_count'
          },
          {
            text: 'Time Registered',
            value: 'time_in'
          },
          ],
          employeeDatas: [],
          filterValue: '',
        };
      },
      created() {
        document.title = 'Participants';
        this.fetchData();
      },
      methods: {
        async fetchData() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/event-participants');
      this.employeeDatas = response.data.eventParticipants;
    } catch(error) {
      console.error(error);
    }
  },
  async loginClicked() {
  if (this.username.toLowerCase() === 'test' && this.password.toLowerCase() === 'test') {
    try {
      // Fetch data from the backend
      await this.fetchData();
      // Close the login dialog and set loggedIn to true
      this.loginDialog = false;
      this.loggedIn = true;
    } catch(error) {
      console.error(error);
    }
  } else {
    // Show SweetAlert animation prompt
    Swal.fire({
      icon: 'error',
      title: 'Invalid username or password',
      text: 'Please try again',
      showConfirmButton: false,
      timer: 1500,
    });
  }
},
        filterData() {
          const filterText = this.filterValue.toLowerCase();
          this.filteredEmployeeDatas = this.employeeDatas.filter((employee) => employee.full_name.toLowerCase().includes(filterText) || employee.employee_id.toLowerCase().includes(filterText));
        },
        async approveSelected() {
          try {
            // Perform approval logic here, e.g., update the backend or show a success message
            console.log('Selected employees:', this.selected);
            // After approval, clear the selected employees
            this.selected = [];
          } catch(error) {
            console.error(error);
          }
        },
        async downloadExcel() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/event-participants');
    const employeeDatas = response.data.eventParticipants;

    // Convert employee data to a format compatible with xlsx
    const data = employeeDatas.map(employee => ({
      'Employee Name': employee.full_name,
      'Employee ID': employee.employee_id,
      'Table #': employee.table_num,
      'Mobile Bar Count': employee.mobile_bar_count,
      'Time Registered': employee.time_in
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Add the data to the workbook
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'INGCONITE_Official_Participants.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire({
  title: "Check your Downloads!",
  text: "Data Downloaded Successfully!",
  icon: "success",
  allowOutsideClick: false,
  customClass: {
                confirmButton: 'orange-button',
              },
});
  } catch (error) {
    console.error(error);
  }
}
},
      computed: {
        filteredEmployeeDatas() {
          if (!this.filterValue) return this.employeeDatas;
          return this.employeeDatas.filter((employee) => employee.full_name.toLowerCase().includes(this.filterValue.toLowerCase()) || employee.employee_id.toLowerCase().includes(this.filterValue.toLowerCase()));
        },
        usernameRules() {
      return [
        value => !!value || 'Username is required'
      ];
    },
    passwordRules() {
      return [
        value => !!value || 'Password is required'
      ];
    

      }
    }
  }
  </script>
  <style>

    .v-data-table tbody tr:hover { 
      background-color: #FFD700; 
    } 
    .orange-bg { 
      background-color: orange; height: 50px;
    display: inline-block; width: 100%; padding: 10px; 
    } 
    .orange-bg .v-btn, .orange-bg .v-text-field .v-text-field__slot{
      color: black; }
    .my-page .v-label {
      color: black !important;
    }
    .flipped-icon {
    transform: scaleX(-1);
  }
  .black-text {
  color: black !important;
}

  </style>