<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2">
        <!-- Header -->
        <v-app-bar color="teal darken-4" dense dark>
          <v-toolbar-title class="d-flex align-center px-4">
            <v-icon class="mr-2">mdi-file-document-outline</v-icon>
            <span class="text-h6">{{ $t("Recruiting report") }}</span>
          </v-toolbar-title>
        </v-app-bar>
        <v-card-text class="pa-0">
          <!-- Filters Container -->
          <v-container fluid class="py-2">
            <v-card flat class="grey lighten-4 mb-2">
              <v-card-text>
                <!-- Row 1: Date Range and Position -->
                <v-row dense>
                  <!-- Date Range -->
                  <v-col cols="12" sm="6" md="4" lg="3">
                    <div class="d-flex">
                      <v-menu v-model="fromDateMenu" :close-on-content-click="false" max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field dense outlined hide-details v-model="fromDate" :label="$t('From date')"
                          prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          class="mr-2" clearable @click:clear="fromDate = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="fromDate" @input="fromDateMenu = false"></v-date-picker>
                      </v-menu>
                      <v-menu v-model="toDateMenu" :close-on-content-click="false" max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field dense outlined hide-details v-model="toDate" :label="$t('To date')"
                          prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          @change="getDataReport" clearable @click:clear="toDate = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="toDate" @input="toDateMenu = false"></v-date-picker>
                      </v-menu>
                    </div>
                  </v-col>
                  
                  <!-- Position Filter -->
                  <v-col cols="12" sm="6" md="8" lg="9">
                    <v-chip-group v-model="selectedPositions" multiple show-arrows>
                      <v-chip v-for="(item, i) in loc_apply" :key="i" filter small outlined color="teal darken-4"
                      class="font-weight-medium">
                      {{ item }}
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              
              <!-- Row 2: Department Filters and Action Buttons -->
              <v-row dense class="mt-2">
                <!-- Department Filters -->
                <v-col cols="12" sm="3">
                  <v-autocomplete v-model="selectDept" :items="uniqueItemDept" :label="$t('Division')"
                  item-text="department" item-value="id" hide-details outlined dense clearable multiple chips
                  small-chips prepend-inner-icon="mdi-domain"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-autocomplete v-model="selectDiv" :items="filteredItemsDiv" :label="$t('Department')"
                  item-text="sub_department" item-value="id" hide-details outlined dense clearable multiple chips
                  small-chips prepend-inner-icon="mdi-sitemap"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-autocomplete v-model="selectUnit" :items="filteredItemsUnit" :label="$t('Unit')"
                  item-text="dem_unit" item-value="id" hide-details outlined dense clearable multiple chips
                  small-chips prepend-inner-icon="mdi-office-building"></v-autocomplete>
                </v-col>
                
                <!-- Action Buttons -->
                <v-col cols="12" sm="3" class="d-flex align-center justify-end">
                  <v-btn color="primary" @click="getDataReport" :loading="loading" class="mr-2">
                    <v-icon left small>mdi-magnify</v-icon>{{ $t('Search') }}
                  </v-btn>
                  <v-btn color="success" @click="exportExcel" :loading="exporting">
                    <v-icon left small>mdi-file-excel</v-icon>{{ $t('Export') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- Data Table -->
          <v-data-table :headers="headers" :items="filteredReportData" :items-per-page="10" :loading="loading"
          fixed-header class="elevation-1 rounded-lg" :footer-props="{
            'items-per-page-options': [10, 15, 30, 100],
            'show-current-page': true,
            'show-first-last-page': true
          }">
          <template v-slot:[`item.dem_dept`]="{ item }">
            {{ (item.dem_dept) }}
          </template>
          <template v-slot:[`item.demand`]="{ item }">
            <nuxt-link
            :to="{
              path: '../demand',
              query: {
                id: item.id,
              }
            }"
            >
              {{ item.demand }}
          </nuxt-link>
          </template>
          <template v-slot:[`item.position`]="{ item }">
            <v-chip x-small outlined color="warning" class="font-weight-medium">
              {{ item.position }}
            </v-chip>
          </template>
          <template v-slot:[`item.actualVacancies`]="{ item }">
            {{ item.actualVacancies }}
          </template>
          <template v-slot:[`item.comeToInterview`]="{ item }">
            <nuxt-link
            :to="{
              path: '/',
              query: {
                id: item.id,
                fromDate: fromDate,
                toDate: toDate,
                source: 'comeToInterview' // Thêm parameter này thay vì thay đổi path
              }
            }">
             {{ item.comeToInterview }}
          </nuxt-link>
          </template>
          <template v-slot:[`item.accByHR`]="{ item }">
            <nuxt-link
            :to="{
              path: '/',
              query: {
                id: item.id,
                fromDate: fromDate,
                toDate: toDate,
                source: 'accHR' 
              }
            }">
             {{ item.accByHR }}
          </nuxt-link>
          </template>
          <template v-slot:[`item.accByDept`]="{ item }">
           
            <nuxt-link
            :to="{
              path: '/',
              query: {
                id: item.id,
                fromDate: fromDate,
                toDate: toDate,
                source: 'accDept' 
              }
            }">
             {{ item.accByDept }}
          </nuxt-link>
          </template>
          <template v-slot:[`item.expectedEnrollDate`]="{ item }">
            {{ item.expectedEnrollDate }}
          </template>
          <template v-slot:[`item.actualEnrollDate`]="{ item }">
            <nuxt-link
            :to="{
              path: '/',
              query: {
                id: item.id,
                fromDate: fromDate,
                toDate: toDate
              }
            }">
            {{ item.actualEnrollDate }}
          </nuxt-link>
        </template>
        <template v-slot:[`item.deptAccRate`]="{ item }">
          {{ (item.deptAccRate * 100).toFixed(0) }}%
        </template>
        <template v-slot:[`item.employmentRate`]="{ item }">
          {{ (item.employmentRate * 100).toFixed(0) }}%
        </template>
        <template v-slot:[`item.offerCycleTimeAvg`]="{ item }">
          {{ item.offerCycleTimeAvg.toFixed(1) }}
        </template>
        
        <template v-slot:[`item.enrolledCycleTimeAvg`]="{ item }">
          {{ item.enrolledCycleTimeAvg.toFixed(1) }}
        </template>
        <template v-slot:progress>
          <v-overlay :value="loading" absolute color="white">
            <v-progress-circular indeterminate color="teal darken-4"></v-progress-circular>
          </v-overlay>
        </template>
        <template v-slot:[`header.dem_dept`]="{ header }">
          {{ $t("Division") }}
        </template>
        <template v-slot:[`header.dem_sub_department`]="{ header }">
          {{ $t("Dept") }}
        </template>
        <template v-slot:[`header.dem_unit`]="{ header }">
          {{ $t("Unit") }}
        </template>
        <template v-slot:[`header.demand`]="{ header }">
          {{ $t("Demand") }}
        </template>
        <template v-slot:[`header.position`]="{ header }">
          {{ $t("Position") }}
        </template>
        <template v-slot:[`header.comeToInterview`]="{ header }">
          {{ $t("Come To Interview") }}
        </template>
        <template v-slot:[`header.accByHR`]="{ header }">
          {{ $t("Acc. By HR") }}
        </template>
        <template v-slot:[`header.accByDept`]="{ header }">
          {{ $t("Acc. By Dept.") }}
        </template>
        <template v-slot:[`header.deptAccRate`]="{ header }">
          {{ $t("Dept. Acc. Rate") }}
        </template>
        <template v-slot:[`header.employmentRate`]="{ header }">
          {{ $t("Employment rate") }}
        </template>
        <template v-slot:[`header.offerCycleTimeAvg`]="{ header }">
          {{ $t("Offer cycle time Avg") }}
        </template>
        <template v-slot:[`header.enrolledCycleTimeAvg`]="{ header }">
          {{ $t("Enrolled cycle time Avg") }}
        </template>

        <template v-slot:[`header.expectedEnrollDate`]="{ header }">
          {{ $t("Exp. To Enroll") }}
        </template>
        <template v-slot:[`header.actualEnrollDate`]="{ header }">
          {{ $t("Today Enrolled") }}
        </template>
        <template v-slot:[`header.actualVacancies`]="{ header }">
          {{ $t("Actual Vacancies") }}
        </template>

        <template v-slot:body.append>
          <tr class="total-row">
            <td colspan="4" class="text-center"> {{$t('Total')}}</td>
            <td v-for="header in headers.slice(4)" :key="header.value">
              <span v-if="!['dem_unit', 'dem_sub_department', 'dem_dept', 'position'].includes(header.value)">
                {{ totalSum[header.value] || 0 }}
              </span>
            </td>
          </tr>  
        </template>
      </v-data-table>
      
      <!-- Note Dialog -->
      <v-dialog v-model="noteDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ $t('Note') }}
            <v-spacer></v-spacer>
            <v-btn icon @click="noteDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            {{ selectedNote }}
          </v-card-text>
        </v-card>
      </v-dialog>
      
    </v-container>
  </v-card-text>
</v-card>
</v-col>
</v-row>
</template>

<script>
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
export default {
  data() {
    return {
      api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
      today: dayjs().format('YYYY-MM-DD'),
      selectDept: [], // Ensure this is an array
      selectDiv: [], // Change from null to array
      selectUnit: [], // Add this new property
      itemsDiv: [],
      headers: [
      { text: this.$t('ID'), value: 'id', },
      { text: this.$t('Division'), value: 'dem_dept', },
      { text: this.$t('Dept'), value: 'dem_sub_department', },
      { text: this.$t('Unit'), value: 'dem_unit', },
      // { text: this.$t('Note'), value: 'dem_note', },
      { text: this.$t('Demand'), value: 'demand',  align: 'center' },
      { text: this.$t('Position'), value: 'position', }, // Update header to singular 'Position'
      { text: this.$t('Come To Interview'), value: 'comeToInterview',  align: 'center' },
      { text: this.$t('Acc. By HR'), value: 'accByHR',  align: 'center' },
      { text: this.$t('Acc. By Dept.'), value: 'accByDept',  align: 'center' },
      
      {text: this.$t('Dept. Acc. Rate'), value: 'deptAccRate', align: 'center'},
      
      { text: this.$t('Today Enrolled'), value: 'actualEnrollDate',  align: 'center' },
      
      { text: this.$t('Employment rate'), value: 'employmentRate',  align: 'center' },
      { text: this.$t('Offer cycle time Avg'), value: 'offerCycleTimeAvg',  align: 'center' },
      {text: this.$t('Enrolled cycle time Avg'), value: 'enrolledCycleTimeAvg', align: 'center'},
      { text: this.$t('Actual Vacancies'), value: 'actualVacancies',  align: 'center' },
      { text: this.$t('Exp. To Enroll'), value: 'expectedEnrollDate',  align: 'center' }
      ],
      reportData: [],
      loading: false,
      exporting: false,
      loc_apply: ['Worker', 'Staff', 'Staff (lang)', 'Leader', 'Translator', 'Engineer'],
      item_dept: [],
      selectedPositions: [], 
      dataCadidates: [],
      fromDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
      fromDateMenu: false,
      toDateMenu: false,
      noteDialog: false,
      selectedNote: '',
    }
  },
  computed: {
    totalSum() {
      const totals = {};
      
      this.filteredReportData.forEach(item => {
        this.headers.forEach(header => {
          const value = item[header.value];
          if (!totals[header.value]) {
            totals[header.value] = 0;
          }
          
          // Special handling for rate columns
          if (['deptAccRate', 'employmentRate'].includes(header.value)) {
            totals[header.value] = (((totals[header.value] * totals.accByDept || 0) + 
            (value * item.accByDept || 0)) / (totals.accByDept + item.accByDept || 1)) || 0;
          }
          // Special handling for average time columns
          else if (['offerCycleTimeAvg', 'enrolledCycleTimeAvg'].includes(header.value)) {
            const prevCount = totals.accByDept || 0;
            const newCount = item.accByDept || 0;
            totals[header.value] = (((totals[header.value] * prevCount) + 
            (value * newCount)) / (prevCount + newCount)) || 0;
          }
          // Normal sum for number columns, including demand
          else if (['demand', 'comeToInterview', 'accByHR', 'accByDept', 'actualEnrollDate', 
          'actualVacancies', 'expectedEnrollDate'].includes(header.value)) {
            totals[header.value] += Number(value) || 0;
          }
        });
      });
      
      // Format the special columns
      if (totals.deptAccRate) totals.deptAccRate = (totals.deptAccRate * 100).toFixed(0) + '%';
      if (totals.employmentRate) totals.employmentRate = (totals.employmentRate * 100).toFixed(0) + '%';
      if (totals.offerCycleTimeAvg) totals.offerCycleTimeAvg = totals.offerCycleTimeAvg.toFixed(1);
      if (totals.enrolledCycleTimeAvg) totals.enrolledCycleTimeAvg = totals.enrolledCycleTimeAvg.toFixed(1);
      
      return totals;
    },
    uniqueItemDept() {
      const uniqueDepartments = this.item_dept.reduce((acc, current) => {
        const x = acc.find(item => item.department === current.department);
        if (!x) {
          acc.push({ id: current.id, department: current.department });
        }
        return acc;
      }, []);
      return uniqueDepartments;
    },
    filteredItemsDiv() {
      if (!this.selectDept.length) {
        const uniqueSubDepts = Array.from(new Set(
        this.item_dept
        .filter(dept => dept.sub_department)
        .map(dept => dept.sub_department)
        )).map(sub_department => {
          const dept = this.item_dept.find(d => d.sub_department === sub_department);
          return {
            id: dept.id,
            sub_department: sub_department,
            department: dept.department
          };
        });
        return uniqueSubDepts;
      }
      
      const selectedDeptNames = this.selectDept.map(deptId =>
      this.uniqueItemDept.find(d => d.id === deptId)?.department
      ).filter(Boolean);
      
      // Get unique sub_departments for selected departments
      const uniqueFilteredSubDepts = Array.from(new Set(
      this.item_dept
      .filter(dept => selectedDeptNames.includes(dept.department) && dept.sub_department)
      .map(dept => dept.sub_department)
      )).map(sub_department => {
        const dept = this.item_dept.find(d => d.sub_department === sub_department);
        return {
          id: dept.id,
          sub_department: sub_department,
          department: dept.department
        };
      });
      
      return uniqueFilteredSubDepts;
    },
    filteredItemsUnit() {
      if (!this.selectDiv.length) {
        return [...new Set(this.reportData
        .filter(item => item.dem_unit)
        .map(item => item.dem_unit))].map(unit => ({
          id: unit,
          dem_unit: unit
        }));
      }
      
      const selectedSubDepts = this.selectDiv.map(id =>
      this.filteredItemsDiv.find(d => d.id === id)?.sub_department
      ).filter(Boolean);
      
      return [...new Set(this.reportData
      .filter(item =>
      selectedSubDepts.includes(item.dem_sub_department) &&
      item.dem_unit
      )
      .map(item => item.dem_unit))].map(unit => ({
        id: unit,
        dem_unit: unit
      }));
    },
    filteredReportData() {
      return this.reportData.filter(item => {
        const positionMatch = !this.selectedPositions.length ||
        this.selectedPositions.map(index => this.loc_apply[index]).includes(item.position);
        
        const deptMatch = !this.selectDept.length ||
        this.selectDept.some(deptId => {
          const selectedDept = this.uniqueItemDept.find(d => d.id === deptId);
          return (item.dem_dept) === selectedDept?.department;
        });
        
        const subDeptMatch = !this.selectDiv.length ||
        this.selectDiv.some(deptId => {
          const selectedSubDept = this.filteredItemsDiv.find(d => d.id === deptId);
          return item.dem_sub_department === selectedSubDept?.sub_department;
        });
        
        const unitMatch = !this.selectUnit.length ||
        this.selectUnit.some(unitId => item.dem_unit === unitId);
        
        return positionMatch && deptMatch && subDeptMatch && unitMatch;
      });
    }
  },
  watch: {
    selectDept() {
      this.selectDiv = [];
      this.selectUnit = [];
    },
    selectDiv() {
      this.selectUnit = [];
    }
  },
  methods: {
    exportExcel() {
      this.exporting = true;
      try {
        const dataToExport = this.filteredReportData.map(item => ({
          'Division': (item.dem_dept),
          'Dept': item.dem_sub_department,
          'Unit': item.dem_unit,
          Demand: item.demand,
          Position: item.position,
          'Come To Interview': item.comeToInterview,
          'Come By Bus': item.comeByBus,
          'Acc. By HR': item.accByHR,
          'Acc. By Dept.': item.accByDept,
          'Exp. To Enroll': item.expectedEnrollDate,
          'Today Enrolled': item.actualEnrollDate,
          'Total Recruited': item.totalRecruitedUntilToday,
          'Total Recruited By Bus': item.totalRecruitedByBusToday,
          'Total Reg For Bus': item.totalRegForBusToday,
          'Still In Need': item.stillInNeedUntilToday,
          'Actual Vacancies': item.actualVacancies
        }));
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        
        // Set column widths
        ws['!cols'] = [
        { wch: 10 }, // Department
        { wch: 10 }, // Main Group
        { wch: 10 }, // Sub Division
        { wch: 10 }, // Demand
        { wch: 12 }, // Position
        { wch: 20 }, // Come To Interview
        { wch: 12 }, // Come By Bus
        { wch: 12 }, // Acc. By HR
        { wch: 12 }, // Acc. By Dept.
        { wch: 12 }, // Exp. To Enroll
        { wch: 12 }, // Today Enrolled
        { wch: 12 }, // Total Recruited
        { wch: 12 }, // Total Recruited By Bus
        { wch: 12 }, // Total Reg For Bus
        { wch: 12 }, // Still In Need
        { wch: 12 }  // Actual Vacancies
        ];
        
        // Optional: Apply basic font formatting to header
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: 0 };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;
          ws[cell_ref].s = {
            font: { bold: true, sz: 14 }
          };
        }
        
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `Recruiting_Report_${this.today}.xlsx`);
      } catch (error) {
        console.error(error);
      } finally {
        this.exporting = false;
      }
    },
    async getDeptCode() {
      try {
        const res = await this.$axios.get(this.api + 'getDataDeptCode');
        this.item_dept = res.data.dataDeptCode;
        // Update how itemsDiv is created to include department information
        this.itemsDiv = res.data.dataDeptCode.map(dept => ({
          id: dept.id,
          department: dept.department,
          sub_department: dept.sub_department || dept.department,
          sub_division: dept.sub_division || dept.sub_department || dept.department
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async getAllData() {
      this.loading = true;
      try {
        const response = await this.$axios.get(this.api + 'getDataEmpnoInfo');
        this.dataCadidates = response.data.dataEmpnoInfo;
        
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        this.loading = false;
      }
    },
    async getDataReport() {
      let params = {
        key_in_date: this.today,
        // tmp_departid: this.dataCadidates.map(item => item.tmp_departid),
        dem_dept: this.selectDept.length ? this.selectDept : this.item_dept.map(dept => dept.department),
        fromdate: this.fromDate,
        todate: this.toDate
      }
      this.loading = true;
      try {
        const res = await this.$axios.post(this.api + 'recruitReport', params);
        this.reportData = Array.isArray(res.data) ? res.data : [res.data];
        
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // getDepartmentName(dem_dept) {
    //   const dept = this.item_dept.find(dept => String(dept.id) === String(dem_dept));
    //   return dept ? dept.department : '';
    // },
    showNoteDialog(note) {
      this.selectedNote = note;
      this.noteDialog = true;
    },
  },
  async mounted() {
    await this.getDeptCode();
    await this.getAllData();
    this.getDataReport();
  }
}
</script>

<i18n>
  {
    "en": {
      "Total": "Total",
      "Recruiting report": "Recruiting Report",
      "From date": "From Date",
      "To date": "To Date",
      "Department": "Dept",
      "Division": "Div",
      "Position Apply": "Position Apply",
      "Search": "Search",
      "Export": "Export",
      "Dept": "Dept",
      "Demand": "Demand",
      "Position": "Position",
      "Come To Interview": "Come To Interview",
      "Come By Bus": "Come By Bus",
      "Acc. By HR": "Accepted By HR",
      "Acc. By Dept.": "Accepted By Dept",
      "Exp. To Enroll": "Expected To Enroll",
      "Today Enrolled": "Today Enrolled",
      "Total Recruited": "Total Recruited",
      "Total Recruited By Bus": "Total Recruited By Bus",
      "Total Reg For Bus": "Total Registered For Bus",
      "Still In Need": "Still In Need",
      "Actual Vacancies": "Actual Vacancies",
      "Unit": "Unit",
      "Note": "Note",
      "Dept. Acc. Rate": "Dept. Acc. Rate",
      "Employment rate": "Employment rate",
      "Offer cycle time Avg": "Offer cycle time Avg",
      "Enrolled cycle time Avg": "Enrolled cycle time Avg"
    },
    "vi": {
      "Total": "Tổng",
      "Recruiting report": "Báo Cáo Tuyển Dụng",
      "From date": "Từ Ngày",
      "To date": "Đến Ngày",
      "Department": "Bộ phận",
      "Division": "Cấp sở",
      "Position Apply": "Vị Trí Ứng Tuyển",
      "Search": "Tìm Kiếm",
      "Export": "Xuất Excel",
      "Dept": "Bộ phận",
      "Unit": "Đơn vị",
      "Demand": "Nhu Cầu",
      "Position": "Vị Trí",
      "Come To Interview": "Đến Phỏng Vấn",
      "Come By Bus": "Đến Bằng Xe Bus",
      "Acc. By HR": "HR Duyệt",
      "Acc. By Dept.": "PB Duyệt",
      "Exp. To Enroll": "Dự Kiến Vào Làm",
      "Today Enrolled": "Vào Làm Hôm Nay",
      "Total Recruited": "Tổng Đã Tuyển",
      "Total Recruited By Bus": "Tổng Tuyển Bằng Xe Bus",
      "Total Reg For Bus": "Tổng Đăng Ký Xe Bus",
      "Still In Need": "Còn thiếu",
      "Actual Vacancies": "Số Lượng Thực Tế",
      "Unit": "Đơn Vị",
      "Note": "Ghi chú",
      "Dept. Acc. Rate": "Tỷ lệ duyệt",
      "Employment rate": "Tỷ lệ tuyển",
      "Offer cycle time Avg": "Thời gian đề nghị trung bình",
      "Enrolled cycle time Avg": "Thời gian vào làm trung bình"
    },
    "cn": {
      "Total": "总计",
      "Recruiting report": "招聘报告",
      "From date": "起始日期",
      "To date": "结束日期",
      "Department": "部门",
      "Division": "處",
      "Position Apply": "申请职位",
      "Search": "搜索",
      "Export": "导出",
      "Dept": "部",
      "Unit": "廠/課",
      "Demand": "需求人數",
      "Position": "職位",
      "Come To Interview": "應徵人數",
      "Come By Bus": "乘车来",
      "Acc. By HR": "HR通過人數",
      "Acc. By Dept": "部門通過人數",
      "Exp. To Enroll": "預計入職人數",
      "Today Enrolled": "實際入職人數",
      "Total Recruited": "总招聘人数",
      "Total Recruited By Bus": "总乘车招聘",
      "Total Reg For Bus": "总车辆登记",
      "Still In Need": "仍需人数",
      "Actual Vacancies": "實際待招募人數",
      "Unit": "单位",
      "Note": "备注",
      "Dept. Acc. Rate": "部門錄取率",
      "Employment rate": "報到率",
      "Offer cycle time Avg": "平均提供周期时间",
      "Enrolled cycle time Avg": "平均入职周期时间",
      "Acc. By Dept.":"部门认可"
    }
  }
</i18n>

<style scoped>
.v-text-field.v-text-field--enclosed .v-text-field__details,
.v-autocomplete.v-text-field--enclosed .v-text-field__details {
  display: none;
}

.v-data-table {
  border: 1px solid #e0e0e0;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-y: auto;
}

.v-data-table ::v-deep thead th {
  font-weight: 600 !important;
  color: #004D40 !important;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
  text-transform: uppercase;
}

.v-data-table ::v-deep tbody tr:not(.total-row):hover{
  background-color: #f3fd99 !important;
}

.v-chip {
  font-size: 12px !important;
}

.v-btn--small {
  text-transform: none;
  font-weight: 500;
}

.theme--light.v-chip.v-chip--outlined.v-chip.v-chip--active {
  border-color: var(--v-primary-base);
  color: var(--v-primary-base);
}

/* Add these new styles */
.v-btn--small {
  min-width: 90px;
}

.v-autocomplete {
  max-height: 40px;
}

.v-autocomplete ::v-deep .v-input__slot {
  min-height: 40px !important;
}

.cursor-pointer {
  cursor: pointer;
}
.v-data-table ::v-deep thead th.text-start {
  /* font-size: 10px; */
}
.v-data-table ::v-deep thead th.text-center {
  font-size: 10px;
}
.cursor-pointer:hover {
  opacity: 0.8;
}
.total-row {
  background-color: #004D40 !important; /* teal darken-4 */
}

.total-row td {
  color: white !important;
  font-size: 1.1em !important;
  border-top: 2px solid #004D40 !important; /* teal darken-3 for border */
  border-bottom: none !important;
  text-align: center !important;
}

.total-row td:first-child {
  background-color: #004D40 !important; /* slightly lighter for first column */
  position: sticky;
  left: 0;
  z-index: 2;
}
.total-row td span {
  display: block;
}

.demand-link {
  color: #00796b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.demand-link:hover {
  color: #004d40;
  text-decoration: underline;
}

</style>