<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="5" class="main-card">
                <!-- Enhanced Header -->
                <v-app-bar dark color="teal darken-4">
                    <div class="d-flex align-center">
                        <v-icon large class="mr-3">mdi-account-group</v-icon>
                        <span class="text-h5 font-weight-medium">{{ $t("Intern Management") }}</span>
                    </div>
                    <v-spacer></v-spacer>
                    <!-- Advanced Search -->
                    <v-menu offset-y :close-on-content-click="false" max-width="300">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                                :placeholder="$t('Search interns...')" dense filled rounded hide-details
                                class="search-field mx-2" style="max-width: 300px" v-on="on" clearable
                                @input="handleSearch"></v-text-field>
                        </template>
                    </v-menu>
                    <v-btn color="error" @click="openNewInternDialog">
                        <v-icon left>mdi-plus</v-icon>
                        {{ $t("New Intern") }}
                    </v-btn>
                </v-app-bar>
                <!-- Enhanced Table -->
                <v-card-text class="pa-6">
                    <v-data-table :headers="headers" :items="filteredInternData" :loading="loading" class="elevation-1 rounded-lg"
                        :items-per-page-options="[10, 25, 50]" multi-sort  :footer-props="{
                                    'items-per-page-options': [10, 15, 30, 100],
                                    'show-current-page': true,
                                    'show-first-last-page': true
                                  }" >
                        <template v-slot:[`item.in_empid`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <div class="d-flex align-center intern-id-container" v-bind="attrs" v-on="on"
                                        @click="editIntern(item)">
                                        <span class="intern-id">{{ item.in_empid }}</span>
                                        <v-icon size="16" color="grey lighten-1" class="edit-icon ml-1">
                                            mdi-pencil
                                        </v-icon>
                                    </div>
                                </template>
                                <span>{{ $t('Click to view or edit intern details') }}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.in_photo`]="{ item }">
                            <v-card 
                                v-if="item.in_photo" 
                                class="my-2 photo-thumbnail" 
                                elevation="2" 
                                width="fit-content" 
                                color="white"
                                outlined
                                @click="openPhotoDialog(item.in_photo)"
                            >
                                <v-img :src="item.in_photo" width="60" contain />
                            </v-card>
                        </template>
                        <template v-slot:[`item.in_allowance`]="{ item }">
                            <v-checkbox v-model="item.in_allowance" :value="item.in_allowance === 'yes' ? 0 : 1" dense
                                hide-details disabled></v-checkbox>
                        </template>
                        <template v-slot:[`item.in_bus`]="{ item }">
                            <v-checkbox v-model="item.in_bus" :value="item.in_bus === 'yes' ? 0 : 1" dense
                                hide-details disabled></v-checkbox>
                        </template>
                        <template v-slot:[`item.in_workingtime`]="{ item }">
                            <div class="d-flex flex-wrap gap-1">
                                <v-chip v-for="(day, index) in formatWorkingTime(item.in_workingtime)" :key="index"
                                    x-small label :color="getDayColor(day)" text-color="white" class="mr-1 mb-1 table-chip">
                                    {{ day }}
                                </v-chip>
                            </div>
                        </template>
                        <template v-slot:[`item.in_note`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon @click="openNoteDialog(item.in_note)" color="primary" class="note-icon" v-bind="attrs" v-on="on">
                                        mdi-information
                                    </v-icon>
                                </template>
                                <span>{{ $t('Click to view note details') }}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.in_startdate`]="{ item }">
                            <v-chip small label outlined color="success" class="table-chip">{{ item.in_startdate }}</v-chip>
                        </template>
                        <template v-slot:[`item.in_enddate`]="{ item }">
                            <v-chip small label outlined color="error" class="table-chip">{{ item.in_enddate }}</v-chip>
                        </template>
                        <template v-slot:[`item.in_deptcode`]="{ item }">
                            <span>{{ getSubDivision(item.in_deptcode) }}</span>
                        </template>
                        <template v-slot:[`header.in_empid`]="{ header }">
                            {{ $t("Empno") }}
                        </template>
                        <template v-slot:[`header.in_name`]="{ header }">
                            {{ $t("Name") }}
                        </template>
                        <template v-slot:[`header.in_school`]="{ header }">
                            {{ $t("School") }}
                        </template>
                        <template v-slot:[`header.in_deptcode`]="{ header }">
                            {{ $t("Dept") }}
                        </template>
                        <template v-slot:[`header.in_edulv`]="{ header }">
                            {{ $t("Edu") }}
                        </template>
                        <template v-slot:[`header.in_major`]="{ header }">
                            {{ $t("Major") }}
                        </template>
                        <template v-slot:[`header.in_rectype`]="{ header }">
                            {{ $t("Source") }}
                        </template>
                        <template v-slot:[`header.in_startdate`]="{ header }">
                            {{ $t("Period from") }}
                        </template>
                        <template v-slot:[`header.in_enddate`]="{ header }">
                            {{ $t("Period to") }}
                        </template>
                        <template v-slot:[`header.in_allowance`]="{ header }">
                            {{ $t("Allowance") }}
                        </template>
                        <template v-slot:[`header.in_bus`]="{ header }">
                            {{ $t("Bus") }}
                        </template>
                        <template v-slot:[`header.in_workingtime`]="{ header }">
                            {{ $t("Working days") }}
                        </template>
                        <template v-slot:[`header.in_photo`]="{ header }">
                            {{ $t("Photo") }}
                        </template>
                        <template v-slot:[`header.in_note`]="{ header }">
                            {{ $t("Note") }}
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>

        <!-- Enhanced Dialog -->
        <v-dialog v-model="dialog" max-width="1200px">
            <v-card class="custom-dialog">
                <v-card-title class="teal darken-2 white--text">
                    <v-icon large left color="white">mdi-account-plus</v-icon>
                    {{ $t("New Intern Registration") }}
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pt-6">
                    <v-form ref="form" v-model="valid">
                        <v-row>
                            <!-- Personal Information Section -->
                            <v-col cols="8">
                                <div class="text-h6 mb-2">
                                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                                    <span class="text-h6">[{{ $t("Basic Information") }}]</span>
                                </div>
                                <v-row dense>
                                    <v-col cols="6">
                                        <v-text-field v-model="internData.cardNumber" :label="$t('Empno*')" outlined
                                            dense hide-details="auto" :rules="[v => !!v || 'Required']"
                                            prepend-inner-icon="mdi-card-account-details"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field 
                                            ref="nameInput"
                                            v-model="internData.fullName" 
                                            :label="$t('Full Name *')" 
                                            outlined
                                            dense 
                                            hide-details="auto" 
                                            :rules="nameRules"
                                            :error-messages="nameError"
                                            @input="clearNameError"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Photo Upload Section -->
                            <v-col cols="1">
                                <v-btn block small dark color="success" outlined class="mt-10"
                                    @click="triggerFileInput">
                                    {{ $t("Upload photo") }}</v-btn>
                                <v-file-input id="fileInput" style="display: none" accept="image/*"
                                    @change="doUpload($event)"></v-file-input>
                            </v-col>
                            <v-col cols="3">
                                <div class="photo-frame-dialog">
                                    <v-img :src="internData.in_photo || './no-image-available-man.png'" contain
                                        height="250" width="150" class="mx-auto rounded-lg">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular indeterminate
                                                    color="grey lighten-2"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                </div>
                            </v-col>
                            <!-- Academic Information Section -->
                            <v-col cols="12">
                                <div class="text-h6">
                                    <v-icon color="amber darken-2" class="mr-2">mdi-school</v-icon>
                                    <span class="text-h6">[{{ $t("Academic Information") }}]</span>
                                </div>
                                <v-row dense >
                                    <v-col cols="4">
                                        <v-select v-model="internData.level" :items="level" :label="$t('Level')"
                                            outlined dense hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-text-field v-model="internData.schoolName" :label="$t('School Name')"
                                            outlined dense hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-text-field v-model="internData.major" :label="$t('Major')" outlined dense
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Company Details Section -->
                            <v-col cols="12">
                                <div class="text-h6">
                                    <v-icon color="green darken-2" class="mr-2">mdi-domain</v-icon>
                                    <span class="text-h6">[{{ $t("Company Details") }}]</span>
                                </div>
                                <v-row dense>
                                    <v-col cols="3">
                                        <v-select v-model="internData.department" :items="department"
                                            :label="$t('Department')" outlined dense hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select v-model="internData.recruitmentMethod" :items="recruitmentMethod"
                                            :label="$t('Recruitment Method')" outlined dense
                                            hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-menu v-model="menu" :close-on-content-click="false">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="internData.startDate" :label="$t('Start Date')"
                                                    readonly v-on="on" outlined dense hide-details="auto"
                                                    prepend-inner-icon="mdi-calendar"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="internData.startDate"
                                                @input="menu = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-menu v-model="menu2" :close-on-content-click="false">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="internData.endDate" :label="$t('End Date')"
                                                    readonly v-on="on" outlined dense hide-details="auto"
                                                    prepend-inner-icon="mdi-calendar"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="internData.endDate"
                                                @input="menu2 = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Work Schedule Section -->
                            <v-col cols="12">
                                <div class="text-h6">
                                    <v-icon color="blue darken-2" class="mr-2">mdi-calendar-clock</v-icon>
                                    <span class="text-h6">[{{ $t("Work Schedule") }}]</span>
                                </div>
                                <v-row>
                                    <v-col cols="12">
                                        <div class="schedule-grid">
                                            <v-checkbox v-for="day in weekDays.slice(0, 6)" :key="day.value"
                                                v-model="internData[day.value]" :label="$t(day.label)" hide-details
                                                dense class="schedule-checkbox"></v-checkbox>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <!-- Additional Options Section -->
                            <v-col cols="12">
                                <div class="text-h6">
                                    <v-icon color="purple darken-2" class="mr-2">mdi-cog</v-icon>
                                    <span class="text-h6">[{{ $t("Additional Options") }}]</span>
                                </div>
                                <v-row>
                                    <v-col cols="6">
                                        <v-checkbox v-model="internData.allowance" :label="$t('Allowance')"
                                            hide-details></v-checkbox>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-checkbox v-model="internData.bus" :label="$t('Register bus')"
                                            hide-details></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Notes Section -->
                            <v-col cols="12">
                                <v-textarea v-model="internData.note" :label="$t('Note')" outlined hide-details="auto"
                                    rows="1"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn color="error" text @click="dialog = false" :disabled="saving">
                        <v-icon left>mdi-close</v-icon>
                        {{ $t("Cancel") }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" dark @click="saveInternData" :loading="saving" class="px-4">
                        <v-icon left>mdi-content-save</v-icon>
                        {{ $t("Save") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Note Dialog -->
        <v-dialog v-model="noteDialog" max-width="700">
            <v-card>
                <v-card-title class="teal darken-4 white--text">
                    <span>{{ $t("Note Details") }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="noteDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pt-4">
                    <div class="note-content">{{ currentNote }}</div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Add this new dialog for photo display -->
        <v-dialog v-model="photoDialog" max-width="500" content-class="photo-dialog-wrapper" transition="photo-dialog-transition">
            <v-card class="photo-dialog">
                <v-card-title class="photo-dialog-header teal darken-4 white--text">
                    <div class="d-flex align-center">
                        <v-icon left color="white">mdi-image</v-icon>
                        <span>{{ $t("Photo Preview") }}</span>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="photoDialog = false" class="close-btn">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="photo-dialog-content pa-0">
                    <div class="image-container" ref="imageContainer" @wheel.prevent="handleWheel" @mousedown="startPan" @mousemove="pan" @mouseup="endPan" @mouseleave="endPan">
                        <div class="image-wrapper" :style="wrapperStyle">
                            <v-img :src="currentPhoto" max-height="80vh" max-width="900px" contain class="photo-preview" :style="imageTransformStyle">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                        <v-progress-circular indeterminate color="teal"></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>
                        </div>
                    </div>
                    <div class="photo-controls pa-4">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="teal" class="mx-2 control-btn" @click="zoomIn" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-magnify-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('Zoom in') }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="teal" class="mx-2 control-btn" @click="zoomOut" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-magnify-minus</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('Zoom out') }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="teal" class="mx-2 control-btn" @click="rotateImage" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-rotate-right</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('Rotate') }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="teal" class="mx-2 control-btn" @click="resetImage" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-refresh</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('Reset') }}</span>
                        </v-tooltip>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
export default {
     head: {
        title: 'Intern Management'
    },
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            dialog: false,
            menu: false,
            loading: false,
            search: "",
            internData: {
                in_empid: "",
                in_name: "",
                in_school: "",
                in_deptcode: "",
                in_edulv: "",
                in_major: "",
                in_startdate: "",
                in_enddate: "",
                in_allowance: false,
                in_bus: false,
                in_rectype: "",
                in_workingtime: [],
                in_photo: "",
                in_note: "",
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
            },
            department: [],
            level: ['College', 'University', 'Master', 'PhD'],
            recruitmentMethod: ['Job Fair', 'At School', 'VG website', 'Referral', 'Others'],
            headers: [
                { text: "Empno", value: "in_empid", sortable: false },
                { text: "Name", value: "in_name", sortable: false },
                { text: "School", value: "in_school", sortable: false },
                { text: "Dept", value: "in_deptcode", sortable: false },
                { text: "Edu", value: "in_edulv", sortable: false },
                { text: "Major", value: "in_major", sortable: false },
                { text: "Source", value: "in_rectype", sortable: false },
                { text: "Period from", value: "in_startdate", sortable: false },
                { text: "Period to", value: "in_enddate", sortable: false },
                { text: "Allowance", value: "in_allowance", sortable: false },
                { text: "Bus", value: "in_bus", sortable: false },
                { text: "Working days", value: "in_workingtime", sortable: false },
                { text: "Photo", value: "in_photo", sortable: false },
                { text: "Note", value: "in_note", sortable: false },
            ],
            activeTab: 0,
            saving: false,
            filterDepartment: [],
            weekDays: [
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
                { value: 'sunday', label: 'Sunday' },
            ],
            internDataApi: [],
            noteDialog: false,
            currentNote: "",
            item_dept: [],
            photoDialog: false,
            currentPhoto: "",
            imageScale: 1,
            imageRotation: 0,
            panPosition: { x: 0, y: 0 },
            isPanning: false,
            startPoint: { x: 0, y: 0 },
            zoomSensitivity: 0.1,
            nameError: '',
            nameRules: [
                v => !!v || this.$t('Name is required'),
                v => (v && v.trim().length > 0) || this.$t('Name cannot be empty')
            ],
            menu2: false,
            valid: false,
        }
    },
    computed: {
        filteredInternData() {
            if (!this.search) return this.internDataApi;

            const searchTerm = this.search.toLowerCase();
            return this.internDataApi.filter(intern => {
                // Search through all properties of the intern object
                return Object.keys(intern).some(key => {
                    const value = intern[key];
                    if (value === null || value === undefined) return false;

                    // Handle arrays (like working time)
                    if (Array.isArray(value) || typeof value === 'object') {
                        return JSON.stringify(value).toLowerCase().includes(searchTerm);
                    }

                    // Convert all values to string and search
                    return value.toString().toLowerCase().includes(searchTerm);
                });
            });
        },
        imageTransformStyle() {
            return {
                transform: `rotate(${this.imageRotation}deg) scale(${this.imageScale})`,
                transition: this.isPanning ? 'none' : 'transform 0.3s ease',
                transformOrigin: 'center center',
            }
        },
        wrapperStyle() {
            return {
                transform: `translate(${this.panPosition.x}px, ${this.panPosition.y}px)`,
                cursor: this.isPanning ? 'grabbing' : 'grab'
            }
        }
    },
    methods: {
        handleFullTimeChange(value) {
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
                this.internData[day] = value;
            });
        },
        triggerFileInput() {
            document.getElementById("fileInput").click();
        },
        async doUpload($file) {
            if ($file) {
                let formData = new FormData();
                formData.append("photo", $file);
                let options = {
                    method: "post",
                    url: this.api + "postUploadPhoto",
                    data: formData,
                    maxContentLength: 100000000,
                    maxBodyLength: 1000000000,
                };
                await this.$axios(options)
                    .then((res) => {
                        if (res.status === 200) {
                            this.internData.in_photo = this.$config.storageUrl + res.data;
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    });
            }
        },
        // get all intern
        async getInternData() {
            try {
                this.loading = true;
                const res = await this.$axios.get(this.api + "getInternData").then((res) => {
                    if (res.status === 200) {
                        this.internDataApi = res.data;
                    }
                });
            } catch (error) {
            }
            this.loading = false;
        },
        formatWorkingTime(workingTime) {
            const days = {
                "2": "Mon",
                "3": "Tue",
                "4": "Wed",
                "5": "Thu",
                "6": "Fri",
                "7": "Sat",
                "1": "Sun"
            };
            return workingTime ? JSON.parse(workingTime).map(day => days[day]) : [];
        },
        getDayColor(day) {
            const colors = {
                'Mon': 'indigo',
                'Tue': 'deep-purple',
                'Wed': 'blue',
                'Thu': 'cyan',
                'Fri': 'teal',
                'Sat': 'green',
                'Sun': 'red'
            };
            return colors[day] || 'grey';
        },
        openNoteDialog(note) {
            this.currentNote = note;
            this.noteDialog = true;
        },
        async getDeptCode() {
            try {
                const res = await this.$axios.get(this.api + 'getDataDeptCode');
                this.item_dept = res.data.dataDeptCode;
                this.department = this.item_dept.map(dept => dept.sub_division);
            } catch (error) {
                console.log(error);
            }
        },
        getSubDivision(dem_dept) {
            if (!dem_dept || !this.item_dept || !this.item_dept.length) {
                return '';
            }
            
            try {
                const dept = this.item_dept.find(dept => dept.id === dem_dept);
                return dept ? dept.sub_division : '';
            } catch (error) {
                console.error('Error in getSubDivision:', error);
                return '';
            }
        },
        editIntern(item) {
            const workingDays = JSON.parse(item.in_workingtime);
            this.internData = {
                cardNumber: item.in_empid,
                fullName: item.in_name,
                schoolName: item.in_school,
                department: this.getSubDivision(item.in_deptcode),
                level: item.in_edulv,
                major: item.in_major,
                startDate: item.in_startdate,
                endDate: item.in_enddate,
                allowance: item.in_allowance === 'yes',
                bus: item.in_bus === 'yes',
                recruitmentMethod: item.in_rectype,
                monday: workingDays.includes("2"),
                tuesday: workingDays.includes("3"),
                wednesday: workingDays.includes("4"),
                thursday: workingDays.includes("5"),
                friday: workingDays.includes("6"),
                saturday: workingDays.includes("7"),
                sunday: workingDays.includes("1"),
                in_photo: item.in_photo,
                note: item.in_note
            };
            this.dialog = true;
        },
        generateNextInternId() {
            if (!this.internDataApi || this.internDataApi.length === 0) {
                return 'INT0001';
            }

            // Find the highest intern number
            const maxId = Math.max(...this.internDataApi.map(intern => {
                const num = parseInt(intern.in_empid.replace('INT', ''));
                return isNaN(num) ? 0 : num;
            }));

            // Generate next number with padding
            const nextNum = maxId + 1;
            return `INT${String(nextNum).padStart(4, '0')}`;
        },

        async saveInternData() {
            // Kiểm tra tên trước khi lưu
            if (!this.internData.fullName || this.internData.fullName.trim().length === 0) {
                this.nameError = this.$t('Name is required');
                this.$refs.nameInput.focus();
                return;
            }

            // Kiểm tra department được chọn
            if (!this.internData.department) {
                this.$notify({
                    title: 'Error',
                    text: this.$t('Please select department'),
                    type: 'error'
                });
                return;
            }

            // Tìm department và kiểm tra tồn tại
            const selectedDept = this.item_dept.find(dept => dept.sub_division === this.internData.department);
            if (!selectedDept || !selectedDept.id) {
                this.$notify({
                    title: 'Error',
                    text: this.$t('Invalid department selected'),
                    type: 'error'
                });
                return;
            }

            // Generate next intern ID if this is a new entry
            if (!this.internData.cardNumber) {
                this.internData.cardNumber = this.generateNextInternId();
            }

            let params = {
                in_empid: this.internData.cardNumber,
                in_name: this.internData.fullName,
                in_school: this.internData.schoolName,
                in_deptcode: selectedDept.id, // Sử dụng id từ department đã kiểm tra
                in_edulv: this.internData.level,
                in_major: this.internData.major,
                in_startdate: this.internData.startDate,
                in_enddate: this.internData.endDate,
                in_allowance: this.internData.allowance ? 'yes' : 'no',
                in_bus: this.internData.bus ? 'yes' : 'no',
                in_rectype: this.internData.recruitmentMethod,
                in_workingtime: JSON.stringify(
                    Object.keys(this.internData)
                        .filter(key => this.internData[key] && this.weekDays.find(day => day.value === key))
                        .map(day => {
                            // Convert day name to number
                            switch (day) {
                                case 'monday': return "2";
                                case 'tuesday': return "3";
                                case 'wednesday': return "4";
                                case 'thursday': return "5";
                                case 'friday': return "6";
                                case 'saturday': return "7";
                                case 'sunday': return "1";
                                default: return "";
                            }
                        })
                        .filter(day => day !== "")
                ),
                in_photo: this.internData.in_photo,
                in_note: this.internData.note
            };

            try {
                this.saving = true;
                const res = await this.$axios.post(this.api + "postInternData", params);
                if (res.status === 200) {
                    this.getInternData();
                    this.dialog = false;
                    // this.$toast.success(this.$t('Saved successfully'));
                    this.$notify({
                        title: 'Success',
                        text: this.$t('Saved successfully'),
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error(error);
                // this.$toast.error(this.$t('Error saving data'));
            } finally {
                this.saving = false;
            }
        },
        clearNameError() {
            this.nameError = '';
        },
        initNewInternData() {
            this.internData = {
                cardNumber: this.generateNextInternId(), // Auto-generate ID
                fullName: "",
                schoolName: "",
                department: "",
                level: "",
                major: "",
                startDate: "",
                endDate: "",
                allowance: false,
                bus: false,
                recruitmentMethod: "",
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
                in_photo: "",
                note: ""
            };
        },

        openNewInternDialog() {
            this.initNewInternData();
            this.dialog = true;
            // Add focus after dialog opens
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.nameInput?.$el.querySelector('input')?.focus();
                }, 100);
            });
        },
        getInternStatusColor(intern) {
            // Đổi màu dot dựa trên trạng thái của intern
            const today = new Date();
            const endDate = new Date(intern.in_enddate);

            if (!intern.in_enddate) return 'grey';
            if (endDate < today) return 'red'; // Đã kết thúc
            if (endDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) return 'orange'; // Sắp kết thúc (7 ngày)
            return 'success';
        },
        handleSearch(value) {
            // Optional: Add debouncing if needed
            this.search = value;
        },
        openPhotoDialog(photoUrl) {
            this.currentPhoto = photoUrl;
            this.photoDialog = true;
            this.resetImage();
            // Add small delay to ensure image is centered after dialog opens
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.imageContainer) {
                        const container = this.$refs.imageContainer;
                        // Reset any scroll position
                        container.scrollTop = 0;
                        container.scrollLeft = 0;
                    }
                }, 100);
            });
        },
        zoomIn() {
            this.imageScale = Math.min(this.imageScale + 0.2, 3);
        },
        zoomOut() {
            this.imageScale = Math.max(this.imageScale - 0.2, 0.5);
        },
        rotateImage() {
            this.imageRotation = (this.imageRotation + 90) % 360;
        },
        resetImage() {
            this.imageScale = 1;
            this.imageRotation = 0;
            this.panPosition = { x: 0, y: 0 };
        },
        handleWheel(event) {
            const delta = Math.sign(event.deltaY) * -1;
            const newScale = this.imageScale + (delta * this.zoomSensitivity);
            this.imageScale = Math.min(Math.max(newScale, 0.5), 3);
        },
        startPan(event) {
            this.isPanning = true;
            this.startPoint = {
                x: event.clientX - this.panPosition.x,
                y: event.clientY - this.panPosition.y
            };
        },
        pan(event) {
            if (!this.isPanning) return;
            
            this.panPosition = {
                x: event.clientX - this.startPoint.x,
                y: event.clientY - this.startPoint.y
            };
        },
        endPan() {
            this.isPanning = false;
        },
    },
    mounted() {
        this.getInternData();
        this.getDeptCode();
    },
}
</script>
<style scoped>
/* Base Styles */
:root {
  --transition-default: all 0.2s ease;
  --border-radius: 8px;
  --shadow-default: 0 2px 8px rgba(0, 0, 0, 0.1);
  --color-bg-hover: #f3fd99;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Common Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Layout Components */
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: var(--border-radius);
  animation: fadeIn 0.3s ease-in-out;
}

.photo-frame-dialog {
  width: 150px;
  height: 200px;
  margin: 0 auto;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: var(--shadow-default);
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-default);
}

.photo-frame-dialog:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Dialog Styles */
.custom-dialog {
  border-radius: var(--border-radius);
  overflow: hidden;
}

.note-dialog {
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: var(--shadow-default);
}

.note-content {
  background-color: #fff;
  border-radius: var(--border-radius);
  padding: 16px;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
}

/* Intern ID Styles */
.intern-id-container {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: var(--transition-default);
  display: inline-flex;
  align-items: center;
  color: rgba(0, 23, 156, 0.678);
  border: 1px solid transparent;
}

.intern-id-container:hover {
  background-color: var(--v-primary-lighten-4);
  border-color: var(--v-primary-lighten-2);
}

.intern-id {
  font-weight: 500;
  color: var(--v-primary-darken-1);
  letter-spacing: 0.5px;
}

.edit-icon {
  opacity: 0;
  transition: var(--transition-default);
  margin-left: 4px;
}

.intern-id-container:hover .edit-icon {
  opacity: 1;
  color: var(--v-primary-base) !important;
}

/* Utility Classes */
.gap-1 {
  gap: 4px;
}

.rounded-lg {
  border-radius: var(--border-radius);
}
/* Add these new styles */
.photo-thumbnail {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.photo-thumbnail:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

/* Photo Dialog Animations */
.photo-dialog-transition-enter-active,
.photo-dialog-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-dialog-transition-enter,
.photo-dialog-transition-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

/* Photo Dialog Styling */
.photo-dialog-wrapper {
  backdrop-filter: blur(5px);
}

.photo-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  height: auto !important;
  max-height: 90vh !important;
  display: flex;
  flex-direction: column;
}

.photo-dialog-header {
  padding: 16px;
  position: relative;
  z-index: 1;
}

.photo-dialog-content {
  background: #f5f5f5;
  position: relative;
  transform: none !important;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  max-height: calc(90vh - 120px);
  overflow: hidden;
  background: #f5f5f5;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.image-wrapper {
  position: relative;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  padding: 20px;
}

.photo-preview {
  max-width: 100%;
  max-height: calc(90vh - 150px);
  will-change: transform;
  pointer-events: none;
  margin: auto;
  object-fit: contain;
}

/* Enhanced dialog wrapper */
.photo-dialog-wrapper :deep(.v-dialog) {
  margin: 24px;
  height: auto !important;
  max-height: 90vh !important;
}

/* Responsive adjustments */
@media (max-height: 600px) {
  .image-container {
    min-height: 300px;
  }
  
  .photo-preview {
    max-height: calc(90vh - 100px);
  }
}

@media (max-width: 600px) {
  .photo-dialog {
    margin: 0;
    border-radius: 0;
  }
}

/* Add new table styling */
/* Cách 1: Cho Vue 3 */
:deep(.v-data-table) {
    border: 1px solid #e0e0e0 !important;
}

:deep(.v-data-table__wrapper) {
    overflow-y: auto !important;
}

:deep(.v-data-table thead th) {
    font-weight: 600 !important;
    color: #004D40 !important;
    background: white !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1 !important;
    text-transform: uppercase !important;
}

:deep(.v-data-table tbody tr:hover) {
    background-color: #f3fd99 !important;
}

:deep(.v-data-table tbody tr:nth-child(even)) {
    background-color: #f5f5f5;
}

:deep(.v-data-table tbody tr.v-data-table__selected) {
    background-color: #e3f2fd !important;
}

/* Hoặc Cách 2: Cho Vue 2 */
 .v-data-table {
    border: 1px solid #e0e0e0 !important;
}

 .v-data-table__wrapper {
    overflow-y: auto !important;
}

 .v-data-table thead th {
    font-weight: 600 !important;
    color: #004D40 !important;
    background: white !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1 !important;
    text-transform: uppercase !important;
}

 .v-data-table tbody tr:hover {
    background-color: #f3fd99 !important;
}

 .v-data-table tbody tr:nth-child(even) {
    background-color: #f5f5f5;
}

 .v-data-table tbody tr.v-data-table__selected {
    background-color: #e3f2fd !important;
}

/* Style for table chips to make them more compact */
.table-chip {
    height: 24px !important;
    font-size: 12px !important;
}

/* Note icon styling */
.note-icon {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.note-icon:hover {
    transform: scale(1.2);
}
</style>
<i18n>
{
    "en": {
        "Intern Management": "Intern Management",
        "Search interns...": "Search interns...",
        "New Intern": "New Intern",
        "Click to view or edit intern details": "Click to view or edit intern details",
        "New Intern Registration": "New Intern Registration",
        "Basic Information": "Basic Information",
        "Upload photo": "Upload photo",
        "Academic Information": "Academic Information",
        "Company Details": "Company Details",
        "Work Schedule": "Work Schedule",
        "Additional Options": "Additional Options",
        "Note": "Note",
        "Note Details": "Note Details",
        "Cancel": "Cancel",
        "Save": "Save",
        "Empno": "Empno",
        "Name": "Name",
        "School": "School",
        "Dept": "Department",
        "Edu": "Education",
        "Major": "Major",
        "Source": "Source",
        "Period from": "Period from",
        "Period to": "Period to",
        "Allowance": "Allowance",
        "Bus": "Bus",
        "Working days": "Working Days",
        "Photo": "Photo",
        "Level": "Education Level",
        "School Name": "School Name",
        "Department": "Department",
        "Recruitment Method": "Recruitment Method",
        "Start Date": "Start Date", 
        "End Date": "End Date",
        "Full Name *": "Full Name *",
        "Register bus": "Register Bus Service",
        "Click to enlarge": "Click to enlarge",
        "Photo Preview": "Photo Preview",
        "Zoom in": "Zoom in",
        "Zoom out": "Zoom out",
        "Rotate": "Rotate",
        "Reset": "Reset",
        "Name is required": "Name is required",
        "Name cannot be empty": "Name cannot be empty",
        "Please select department": "Please select department",
        "Invalid department selected": "Invalid department selected",
        "Saved successfully": "Saved successfully",
        "Error saving data": "Error saving data"
    },
    "vi": {
        "Intern Management": "Quản lý Thực tập sinh",
        "Search interns...": "Tìm kiếm thực tập sinh...",
        "New Intern": "Thêm thực tập sinh",
        "Click to view or edit intern details": "Nhấp để xem hoặc chỉnh sửa thông tin",
        "New Intern Registration": "Đăng ký Thực tập sinh Mới",
        "Basic Information": "Thông tin Cơ bản",
        "Upload photo": "Tải ảnh lên",
        "Academic Information": "Thông tin Học vấn",
        "Company Details": "Thông tin Công ty",
        "Work Schedule": "Lịch làm việc",
        "Additional Options": "Tùy chọn Thêm",
        "Note": "Ghi chú",
        "Note Details": "Chi tiết ghi chú",
        "Cancel": "Hủy",
        "Save": "Lưu",
        "Empno": "Mã nhân viên",
        "Name": "Họ tên",
        "School": "Trường",
        "Dept": "Bộ phận",
        "Edu": "Học vấn",
        "Major": "Chuyên ngành",
        "Source": "Nguồn",
        "Period from": "Từ ngày",
        "Period to": "Đến ngày",
        "Allowance": "Phụ cấp",
        "Bus": "Xe bus",
        "Working days": "Ngày làm việc",
        "Photo": "Ảnh",
        "Level": "Trình độ",
        "School Name": "Tên trường",
        "Department": "Bộ phận",
        "Recruitment Method": "Phương thức tuyển dụng",
        "Start Date": "Ngày bắt đầu",
        "End Date": "Ngày kết thúc",
        "Full Name *": "Họ và tên *",
        "Register bus": "Đăng ký xe bus",
        "Click to enlarge": "Nhấp để phóng to",
        "Photo Preview": "Xem ảnh",
        "Zoom in": "Phóng to",
        "Zoom out": "Thu nhỏ",
        "Rotate": "Xoay",
        "Reset": "Đặt lại",
        "Name is required": "Vui lòng nhập họ tên",
        "Name cannot be empty": "Họ tên không được để trống",
        "Please select department": "Vui lòng chọn bộ phận",
        "Invalid department selected": "Bộ phận không hợp lệ",
        "Saved successfully": "Lưu thành công",
        "Error saving data": "Lỗi khi lưu dữ liệu"
    },
    "cn": {
        "Intern Management": "实习生管理",
        "Search interns...": "搜索实习生...",
        "New Intern": "新增实习生",
        "Click to view or edit intern details": "点击查看或编辑详情",
        "New Intern Registration": "新实习生登记",
        "Basic Information": "基本信息",
        "Upload photo": "上传照片",
        "Academic Information": "学历信息",
        "Company Details": "公司信息",
        "Work Schedule": "工作时间",
        "Additional Options": "其他选项",
        "Note": "备注",
        "Note Details": "备注详情",
        "Cancel": "取消",
        "Save": "保存",
        "Empno": "工号",
        "Name": "姓名",
        "School": "学校",
        "Dept": "部门",
        "Edu": "学历",
        "Major": "专业",
        "Source": "来源",
        "Period from": "开始日期",
        "Period to": "结束日期",
        "Allowance": "补贴",
        "Bus": "班车",
        "Working days": "工作日",
        "Photo": "照片",
        "Level": "学历水平",
        "School Name": "学校名称",
        "Department": "部门",
        "Recruitment Method": "招聘方式",
        "Start Date": "开始日期",
        "End Date": "结束日期",
        "Full Name *": "姓名 *",
        "Register bus": "登记班车",
        "Click to enlarge": "点击放大",
        "Photo Preview": "照片预览",
        "Zoom in": "放大",
        "Zoom out": "缩小", 
        "Rotate": "旋转",
        "Reset": "重置",
        "Name is required": "请输入姓名",
        "Name cannot be empty": "姓名不能为空",
        "Please select department": "请选择部门",
        "Invalid department selected": "所选部门无效",
        "Saved successfully": "保存成功",
        "Error saving data": "保存数据时出错"
    }
}
</i18n>
