<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="2">
                <!-- Header Section -->
                <v-app-bar color="teal darken-4" dense dark>
                    <v-toolbar-title class="d-flex align-center px-4">
                        <v-icon class="mr-2" @click="goToResign" style="cursor: pointer">mdi-file-document-outline</v-icon>
                        <span class="text-h6">{{ $t("Resign report") }}</span>
                    </v-toolbar-title>
                </v-app-bar>
                <!-- Filters Section -->
                <v-card-text>
                    <v-row class="grey lighten-5 pa-4 rounded-lg mb-4">
                         <!-- from date -->
                         <v-col cols="12" md="2">
                            <v-menu v-model="fromDateMenu" :close-on-content-click="false" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fromDate" :label="$t('From date')" readonly
                                        v-bind="attrs" v-on="on" outlined dense hide-details
                                        prepend-inner-icon="mdi-calendar"></v-text-field>
                                </template>
                                <v-date-picker v-model="fromDate" @input="fromDateMenu = false" header-color="teal"
                                    :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <!-- to date -->
                        <v-col cols="12" md="2">
                            <v-menu v-model="toDateMenu" :close-on-content-click="false" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="toDate" :label="$t('to date')" readonly
                                        v-bind="attrs" v-on="on" outlined dense hide-details
                                        prepend-inner-icon="mdi-calendar"></v-text-field>
                                </template>
                                <v-date-picker v-model="toDate" @input="toDateMenu = false" header-color="teal"
                                    :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <!-- Department Filter -->
                        <v-col cols="12" md="2">
                            <v-combobox v-model="selectDept" :items="item_dept" :label="$t('Select dept')" dense
                            outlined hide-details clearable multiple chips small-chips deletable-chips></v-combobox>
                        </v-col>
                       
                        <!-- Action Buttons -->
                        <v-col cols="12" md="2" class="d-flex align-center">
                            <v-btn color="primary" class="mr-3" @click="getDataReport" :loading="loading" elevation="2">
                                <v-icon left>mdi-magnify</v-icon>
                                {{ $t('Search') }}
                            </v-btn>
                            
                            <v-btn color="success" class="mr-3" @click="exportExcel" :loading="exporting" elevation="2">
                                <v-icon left>mdi-file-excel</v-icon>
                                {{ $t('Export') }}
                            </v-btn>
                            
                            <v-btn color="info" @click="showColumnDialog = true" elevation="2">
                                <v-icon left>mdi-eye</v-icon>
                                {{ $t('Manage Columns') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                    
                    <!-- Data Table -->
                    <v-data-table :headers="visibleHeaders" 
                                  :items="reportData" 
                                  :items-per-page="13" 
                                  :loading="loading"
                                  :footer-props="{
                                    'items-per-page-options': [10, 15, 30, 100],
                                    'show-current-page': true,
                                    'show-first-last-page': true
                                  }" 
                                   
                              >

                        <template v-slot:no-data>
                            {{ $t('No data available') }}
                        </template>
                        <template v-slot:[`header.dept`]="{ header }">
                            {{ $t('Dept') }}
                        </template>
                        <template v-slot:[`header.totalResign`]="{ header }">
                            {{ $t('Total') }}
                        </template>
                        <template v-slot:[`header.age18to30`]="{ header }">
                            {{ $t('Age[18-30]') }}
                        </template>
                        <template v-slot:[`header.age31to45`]="{ header }">
                            {{ $t('Age[31-45]') }}
                        </template>
                        <template v-slot:[`header.age46up`]="{ header }">
                            {{ $t('Age[>46]') }}
                        </template>
                        <template v-slot:[`header.seniorityLessThan1`]="{ header }">
                            {{ $t('Seniority[<1]') }}
                        </template>
                        <template v-slot:[`header.seniority1`]="{ header }">
                            {{ $t('Seniority[1]') }}
                        </template>
                        <template v-slot:[`header.seniority2`]="{ header }">
                            {{ $t('Seniority[2]') }}
                        </template>
                        <template v-slot:[`header.seniority3up`]="{ header }">
                            {{ $t('Seniority[>3]') }}
                        </template>
                        <template v-slot:[`header.bus`]="{ header }">
                            {{ $t('Bus') }}
                        </template>
                        <template v-slot:[`header.genderMale`]="{ header }">
                            {{ $t('Male') }}
                        </template>
                        <template v-slot:[`header.genderFemale`]="{ header }">
                            {{ $t('Female') }}
                        </template>
                        <template v-slot:[`header.tayNinh`]="{ header }">
                            {{ $t('Tay Ninh') }}
                        </template>
                        <template v-slot:[`header.notTayNinh`]="{ header }">
                            {{ $t('Other loc') }}
                        </template>
                        <template v-slot:[`header.reasonHometown`]="{ header }">
                            {{ $t('Hometown') }}
                        </template>
                        <template v-slot:[`header.reasonStudy`]="{ header }">
                            {{ $t('Study') }}
                        </template>
                        <template v-slot:[`header.reasonWorkIsUnsuitable`]="{ header }">
                            {{ $t('Work is unsuitable') }}
                        </template>
                        <template v-slot:[`header.reasonOther`]="{ header }">
                            {{ $t('Other') }}
                        </template>
                        <template v-slot:[`header.reasonAbsenteeismForFiveDays`]="{ header }">
                            {{ $t('5 days absent') }}
                        </template>
                        <template v-slot:[`header.reasonReturnHomeToTakeCareOfChildren`]="{ header }">
                            {{ $t('Take care of children') }}
                        </template>
                        <template v-slot:[`header.reasonPersonalReasons`]="{ header }">
                            {{ $t('Personal reasons') }}
                        </template>
                        <template v-slot:[`header.reasonHealthIsNotSufficientToContinueWorking`]="{ header }">
                            {{ $t('Health not good') }}
                        </template>
                        <template v-slot:[`header.reasonFamilyMatters`]="{ header }">
                            {{ $t('Family matters') }}
                        </template>
                        <template v-slot:[`header.reasonMisconductDismissedByTheCompany`]="{ header }">
                            {{ $t('Misconduct') }}
                        </template>
                        <template v-slot:[`header.reasonContractExpired`]="{ header }">
                            {{ $t('Contract expired') }}
                        </template>
                        <template v-slot:[`header.reasonFoundANewJob`]="{ header }">
                            {{ $t('New job') }}
                        </template>
                        <template v-slot:[`header.reasonFailedProbationPeriod`]="{ header }">
                            {{ $t('Failed probation period') }}
                        </template>

                        <template v-slot:body.append="{ items }">
                            <tr class="total-row">
                                <td >{{ $t('Total') }}</td>
                                <td v-for="header in visibleHeaders.slice(1)" 
                                    :key="header.value"
                                  >
                                    {{ calculateColumnTotal(items, header.value) }}
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
            </v-card-text>
        </v-card>
    </v-col>
    
    <!-- Column Management Dialog -->
    <v-dialog v-model="showColumnDialog" max-width="900px">
        <v-card>
            <v-card-title class="text-h6 grey lighten-2">
                {{ $t('Manage Columns') }}
                <v-spacer></v-spacer>
                <v-btn text color="success" @click="selectAllColumns">
                    <v-icon left small>mdi-check-all</v-icon>
                    {{ $t('Select All') }}
                </v-btn>
                <v-btn text color="error" class="ml-2" @click="deselectAllColumns">
                    <v-icon left small>mdi-close-box-multiple</v-icon>
                    {{ $t('Deselect All') }}
                </v-btn>
            </v-card-title>
            
            <v-card-text class="pt-4">
                <v-row dense>
                    <v-col cols="12" md="4" v-for="(group, index) in columnGroups" :key="index">
                        <v-card outlined>
                            <v-card-title class="subtitle-2 grey lighten-3 py-2">
                                {{ $t(group.title) }}
                            </v-card-title>
                            <v-card-text class="pa-2">
                                <v-checkbox v-for="header in group.headers" :key="header.value"
                                v-model="header.show" :label="$t(header.text)" dense hide-details
                                class="my-1"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            
            <v-divider></v-divider>
            
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn text @click="showColumnDialog = false">
                    {{ $t('Cancel') }}
                </v-btn>
                <v-btn color="primary" @click="saveAndCloseDialog" :loading="saving">
                    <v-icon left small>mdi-content-save</v-icon>
                    {{ $t('Apply') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-row>
</template>

<script>
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
export default {
       head: {
        title: 'Resign Report'
    },
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            today: dayjs().format('YYYY-MM-DD'),
            fromDate:dayjs().startOf('month').format('YYYY-MM-DD'),
            toDate:dayjs().endOf('month').format('YYYY-MM-DD'),
            fromDateMenu: false,
            toDateMenu: false,
            selectDept: [], 
            item_dept: [],
            headers: [
            { text: 'Dept', value: 'dept',  show: true, align: 'center' },
            { text: 'Total', value: 'totalResign',  show: true, align: 'center' },
            { text: 'Age[18-30]', value: 'age18to30',  show: true,align: 'center' },
            { text: 'Age[31-45]', value: 'age31to45',  show: true ,align: 'center'},
            { text: 'Age[>46]', value: 'age46up',  show: true ,align: 'center'},
            { text: 'Seniority[<1]', value: 'seniorityLessThan1',  show: true , align: 'center'},
            { text: 'Seniority[1]', value: 'seniority1',  show: true, align: 'center' },
            { text: 'Seniority[2]', value: 'seniority2',  show: true , align: 'center'},
            { text: 'Seniority[>3]', value: 'seniority3up',  show: true , align: 'center'},
            { text: 'Bus', value: 'bus',  show: true, align: 'center' },
            { text: 'Male', value: 'genderMale',  show: true, align: 'center' },
            { text: 'Female', value: 'genderFemale',  show: true, align: 'center' },
            { text: 'Tay Ninh', value: 'tayNinh',  show: true, align: 'center' },
            { text: 'Other loc', value: 'notTayNinh',  show: true , align: 'center'},
            
            { text: 'Hometown', value: 'reasonHometown',  show: true , align: 'center'},
            { text: 'Study', value: 'reasonStudy',  show: true, align: 'center'},
            { text: 'Work is unsuitable', value: 'reasonWorkIsUnsuitable',  show: true , align: 'center'},
            { text: 'Other', value: 'reasonOther',  show: true , align: 'center'},
            { text: '5 days absent', value: 'reasonAbsenteeismForFiveDays',  show: true , align: 'center'},
            { text: 'Take care of children', value: 'reasonReturnHomeToTakeCareOfChildren',  show: true , align: 'center'},
            { text: 'Personal reasons', value: 'reasonPersonalReasons',  show: true, align: 'center' },
            { text: 'Health not good', value: 'reasonHealthIsNotSufficientToContinueWorking',  show: true , align: 'center'},
            { text: 'Family matters', value: 'reasonFamilyMatters',  show: true , align: 'center'},
            { text: 'Misconduct', value: 'reasonMisconductDismissedByTheCompany',  show: true , align: 'center'},
            { text: 'Contract expired', value: 'reasonContractExpired',  show: true, align: 'center' },
            { text: 'New job', value: 'reasonFoundANewJob',  show: true, align: 'center'},
            { text: 'Failed probation period', value: 'reasonFailedProbationPeriod',  show: true, align: 'center' }
            ].map(h => ({ ...h, show: true })), // Initialize all columns as visible
            reportData: [], // Ensure it's initialized as an empty array
            loading: false,
            exporting: false,
            showColumnDialog: false,
            totalResign:{
                totalResign: 0,
                age18to30: 0,
                age31to45: 0,
                age46up: 0,
                seniorityLessThan1: 0,
                seniority1: 0,
                seniority2: 0,
                seniority3up: 0,
                bus: 0,
                genderMale: 0,
                genderFemale: 0,
                tayNinh: 0,
                notTayNinh: 0,
                reasonHometown: 0,
                reasonStudy: 0,
                reasonWorkIsUnsuitable: 0,
                reasonOther: 0,
                reasonAbsenteeismForFiveDays: 0,
                reasonReturnHomeToTakeCareOfChildren: 0,
                reasonPersonalReasons: 0,
                reasonHealthIsNotSufficientToContinueWorking: 0,
                reasonFamilyMatters: 0,
                reasonMisconductDismissedByTheCompany: 0,
                reasonOther: 0,
                reasonFoundANewJob: 0,
                reasonFailedProbationPeriod: 0
            },
            saving: false
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => header.show);
        },
        basicHeaders() {
            return this.headers.filter(h => ['dept', 'totalResign'].includes(h.value));
        },
        demographicHeaders() {
            return this.headers.filter(h => [
            'age18to30', 'age31to45', 'age46up',
            'seniorityLessThan1', 'seniority1', 'seniority2', 'seniority3up',
            'bus', 'genderMale', 'genderFemale', 'tayNinh', 'notTayNinh'
            ].includes(h.value));
        },
        reasonHeaders() {
            return this.headers.filter(h => h.value.startsWith('reason'));
        },
        columnGroups() {
            return [
            { title: 'Basic Info', headers: this.basicHeaders },
            { title: 'Demographics', headers: this.demographicHeaders },
            { title: 'Resign Reasons', headers: this.reasonHeaders }
            ];
        },
        total() {
            if (!this.reportData.length) return {};
            // Initialize totals object with all columns from first data row
            const totals = {};
            Object.keys(this.reportData[0]).forEach(key => {
                if (key !== 'dept') { // Skip the dept column
                    totals[key] = this.reportData.reduce((sum, row) => {
                        return sum + (Number(row[key]) || 0);
                    }, 0);
                }
            });
            return totals;
        }
    },
    watch: {
        selectDept: {
            handler: async function(newVal) {
                // Thêm async/await để đảm bảo dữ liệu được cập nhật
                await this.getDataReport();
            }
        },
        toDate(newVal) {
            this.getDataReport();
        },
        reportData: {
            immediate: true,
            handler(newData) {
                if (newData && newData.length) {
                    this.calTotalCol();
                }
            }
        }
    },
    methods: {
        async getAllDeptHrm() {
            try {
                const res = await this.$axios.get(this.api + 'getDataDeptHrm');
                this.item_dept = res.data.dataDeptHrm.map(dept => dept.dept_no);
                
            } catch (error) {
                console.log(error);
            }
        },
        async getDataReport() {
            try {
                this.loading = true;
                const requestData = {
                    from_er_resigndate: this.fromDate,
                    to_er_resigndate: this.toDate,
                    // Sửa lại cách xử lý selectDept
                    er_deptid: this.selectDept.length ? this.selectDept : this.item_dept // Bỏ [] bao ngoài
                };
                
                const response = await this.$axios.post(this.api + 'resignReport', requestData);
                this.reportData = Array.isArray(response.data) ? response.data : [response.data];
                // Đảm bảo tính toán lại tổng sau khi có dữ liệu mới
                await this.calTotalCol();
            } catch (error) {
                console.error('Error fetching report data:', error);
                this.reportData = []; // Reset to empty array on error
            } finally {
                this.loading = false;
            }
        },
        async exportExcel() {
            try {
                this.exporting = true;
                
                // Define custom headers mapping
                const headerMapping = {
                    dept: 'Dept',
                    totalResign: 'Total',
                    age18to30: 'Age[18-30]',
                    age31to45: 'Age[31-45]',
                    age46up: 'Age[46+]',
                    seniorityLessThan1: 'Seniority[<1Y]',
                    seniority1: 'Seniority[1Y]',
                    seniority2: 'Seniority[2Y]',
                    seniority3up: 'Seniority[3Y+]',
                    bus: 'Bus',
                    genderMale: 'Male',
                    genderFemale: 'Female',
                    tayNinh: 'Tay Ninh',
                    notTayNinh: 'Other loc',
                    reasonHometown: 'Hometown',
                    reasonStudy: 'Study',
                    reasonWorkIsUnsuitable: 'Work is unsuitable',
                    reasonOther: 'Other',
                    reasonAbsenteeismForFiveDays: '5 days absent',
                    reasonReturnHomeToTakeCareOfChildren: 'Take care of children',
                    reasonPersonalReasons: 'Personal reasons',
                    reasonHealthIsNotSufficientToContinueWorking: 'Health not good',
                    reasonFamilyMatters: 'Family matters',
                    reasonMisconductDismissedByTheCompany: 'Misconduct',
                    reasonContractExpired: 'Contract expired',
                    reasonFoundANewJob: 'New job',
                    reasonFailedProbationPeriod: 'Failed probation period'
                };
                
                // Transform data with new headers
                const exportData = this.reportData.map(item => {
                    const newItem = {};
                    Object.keys(item).forEach(key => {
                        if (headerMapping[key]) {
                            newItem[headerMapping[key]] = item[key];
                        }
                    });
                    return newItem;
                });
                
                // Create worksheet with transformed data
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Resign');
                
                XLSX.writeFile(wb, `resign_report_${this.today}.xlsx`);
            } catch (error) {
                console.error('Error exporting to Excel:', error);
            } finally {
                this.exporting = false;
            }
        },
        saveColumnSettings() {
            // Optionally save column visibility settings to localStorage
            localStorage.setItem('resignReportColumns', JSON.stringify(
            this.headers.map(h => ({ value: h.value, show: h.show }))
            ));
        },
        loadColumnSettings() {
            const saved = localStorage.getItem('resignReportColumns');
            if (saved) {
                const settings = JSON.parse(saved);
                this.headers = this.headers.map(header => ({
                    ...header,
                    show: settings.find(s => s.value === header.value)?.show ?? true
                }));
            }
        },
        selectAllColumns() {
            this.headers.forEach(header => header.show = true);
        },
        deselectAllColumns() {
            this.headers.forEach(header => header.show = false);
        },
        saveAndCloseDialog() {
            this.saveColumnSettings();
            this.showColumnDialog = false;
        },
        goToResign() {
            this.$router.push('/resign');
        },
        async calTotalCol() {
            if (!this.reportData.length) return;
            
            // Reset all totals
            const columnsToSum = [
                'totalResign', 'age18to30', 'age31to45', 'age46up',
                'seniorityLessThan1', 'seniority1', 'seniority2', 'seniority3up',
                'bus', 'genderMale', 'genderFemale', 'tayNinh', 'notTayNinh',
                'reasonHometown', 'reasonStudy', 'reasonWorkIsUnsuitable', 'reasonOther',
                'reasonAbsenteeismForFiveDays', 'reasonReturnHomeToTakeCareOfChildren',
                'reasonPersonalReasons', 'reasonHealthIsNotSufficientToContinueWorking',
                'reasonFamilyMatters', 'reasonMisconductDismissedByTheCompany', 'reasonOther',
                'reasonFoundANewJob', 'reasonFailedProbationPeriod'

            ];
            
            // Reset all totals to 0
            columnsToSum.forEach(column => {
                this.totalResign[column] = 0;
            });
            
            // Calculate sum for each column
            this.reportData.forEach(row => {
                columnsToSum.forEach(column => {
                    // Handle the special case for 'total' which maps to 'totalResign' in the data
                    const dataKey = column === 'totalResign' ? 'totalResign' : column;
                    this.totalResign[column] += Number(row[dataKey]) || 0;
                });
            });
        },
        calculateColumnTotal(items, column) {
            if (!items || !items.length) return 0;
            return items.reduce((sum, item) => {
                return sum + (Number(item[column]) || 0);
            }, 0);
        }
    },
    async mounted() {
        this.loadColumnSettings();
        await this.getAllDeptHrm();
        this.getDataReport();
    }
    
}
</script>

<i18n>
{
    "en": {
        "Resign report": "Resign Report",
        "From date": "From Date",
        "to date": "To Date",
        "Select dept": "Select Department",
        "Search": "Search",
        "Export": "Export",
        "Manage Columns": "Manage Columns",
        "Select All": "Select All",
        "Deselect All": "Deselect All",
        "Cancel": "Cancel",
        "Apply": "Apply",
        "No data available": "No data available",
        "Basic Info": "Basic Information",
        "Demographics": "Demographics",
        "Resign Reasons": "Resign Reasons",
        "Dept": "Department",
        "Total": "Total",
        "Age[18-30]": "Age [18-30]",
        "Age[31-45]": "Age [31-45]",
        "Age[>46]": "Age [>46]",
        "Seniority[<1]": "Seniority [<1Y]",
        "Seniority[1]": "Seniority [1Y]",
        "Seniority[2]": "Seniority [2Y]",
        "Seniority[>3]": "Seniority [>3Y]",
        "Bus": "Bus Service",
        "Male": "Male",
        "Female": "Female",
        "Tay Ninh": "Tay Ninh",
        "Other loc": "Other Location",
        "Hometown": "Hometown",
        "Study": "Study",
        "Work is unsuitable": "Work is unsuitable",
        "Other": "Other",
        "5 days absent": "5 days absent",
        "Take care of children": "Take care of children",
        "Personal reasons": "Personal reasons",
        "Health not good": "Health not good",
        "Family matters": "Family matters",
        "Misconduct": "Misconduct",
        "Contract expired": "Contract expired",
        "New job": "New job",
        "Failed probation period": "Failed probation period"
    },
    "vi": {
        "Resign report": "Báo cáo nghỉ việc",
        "From date": "Từ ngày",
        "to date": "Đến ngày",
        "Select dept": "Chọn bộ phận",
        "Search": "Tìm kiếm",
        "Export": "Xuất",
        "Manage Columns": "Quản lý cột",
        "Select All": "Chọn tất cả",
        "Deselect All": "Bỏ chọn tất cả",
        "Cancel": "Hủy",
        "Apply": "Áp dụng",
        "No data available": "Không có dữ liệu",
        "Basic Info": "Thông tin cơ bản",
        "Demographics": "Nhân khẩu học",
        "Resign Reasons": "Lý do nghỉ việc",
        "Dept": "Bộ phận",
        "Total": "Tổng",
        "Age[18-30]": "Tuổi [18-30]",
        "Age[31-45]": "Tuổi [31-45]",
        "Age[>46]": "Tuổi [>46]",
        "Seniority[<1]": "Thâm niên [<1 năm]",
        "Seniority[1]": "Thâm niên [1 năm]",
        "Seniority[2]": "Thâm niên [2 năm]",
        "Seniority[>3]": "Thâm niên [>3 năm]",
        "Bus": "Dịch vụ xe buýt",
        "Male": "Nam",
        "Female": "Nữ",
        "Tay Ninh": "Tây Ninh",
        "Other loc": "Địa điểm khác",
        "Hometown": "Về quê",
        "Study": "Đi học",
        "Work is unsuitable": "Công việc không phù hợp",
        "Other": "Khác",
        "5 days absent": "Vắng mặt 5 ngày KP",
        "Take care of children": "Chăm sóc con nhỏ",
        "Personal reasons": "Lý do cá nhân",
        "Health not good": "Sức khỏe không tốt",
        "Family matters": "Vấn đề gia đình",
        "Misconduct": "Hành vi xấu sai trái",
        "Contract expired": "Hợp đồng hết hạn",
        "New job": "Tìm được việc mới",
        "Failed probation period": "Thử việc không đạt"
    },
    "cn": {
        "Resign report": "辞职报告",
        "From date": "开始日期",
        "to date": "结束日期",
        "Select dept": "选择部门",
        "Search": "搜索",
        "Export": "导出",
        "Manage Columns": "管理列",
        "Select All": "全选",
        "Deselect All": "取消全选",
        "Cancel": "取消",
        "Apply": "应用",
        "No data available": "无可用数据",
        "Basic Info": "基本信息",
        "Demographics": "人口统计",
        "Resign Reasons": "辞职原因",
        "Dept": "部门",
        "Total": "总计",
        "Age[18-30]": "年龄 [18-30]",
        "Age[31-45]": "年龄 [31-45]",
        "Age[>46]": "年龄 [>46]",
        "Seniority[<1]": "资历 [<1年]",
        "Seniority[1]": "资历 [1年]",
        "Seniority[2]": "资历 [2年]",
        "Seniority[>3]": "资历 [>3年]",
        "Bus": "巴士服务",
        "Male": "男",
        "Female": "女",
        "Tay Ninh": "西宁",
        "Other loc": "其他地点",
        "Hometown": "家乡",
        "Study": "学习",
        "Work is unsuitable": "工作不适合",
        "Other": "其他",
        "5 days absent": "缺席5天",
        "Take care of children": "照顾孩子",
        "Personal reasons": "个人原因",
        "Health not good": "健康不好",
        "Family matters": "家庭事务",
        "Misconduct": "不当行为",
        "Contract expired": "合同到期",
        "New job": "新工作",
        "Failed probation period": "试用期未通过"
    }
}
</i18n>

<style scoped>
.v-checkbox {
    margin: 0 !important;
    padding: 4px 0 !important;
}

.total-row {
    background-color: #004D40 !important; /* teal darken-4 */
}

.total-row td {
    color: white !important;
    font-size: 1.1em !important;
    border-top: 2px solid #00695C !important; /* teal darken-3 for border */
    border-bottom: none !important;
    text-align: center !important;
    background-color: #004D40 !important; /* Thêm background-color cho tất cả các ô */
}

.total-row td:first-child {
    background-color: #00695C !important; 
    position: sticky;
    left: 0;
    z-index: 2;
}
/* New table styling */
::v-deep .v-data-table {
    border: 1px solid #e0e0e0 !important;
}

::v-deep .v-data-table__wrapper {
    overflow-y: auto !important;
    position: relative !important;
}

::v-deep .v-data-table thead th {
    font-weight: 600 !important;
    color: #004D40 !important;
    background: white !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1 !important;
    text-transform: uppercase !important;
}

::v-deep .v-data-table tbody tr:not(.total-row):hover {
    background-color: #f3fd99 !important;
}

::v-deep .v-data-table tbody tr.total-row {
    position: relative !important;
}

</style>