<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="3" width="100%" class="main-card">
                <v-app-bar color="primary darken-1" dense dark class="app-bar-custom">
                    <v-toolbar-title class="d-flex align-center">
                        <v-icon class="mr-2 pulse-icon">mdi-listing</v-icon>
                        <span class="font-weight-medium">{{ $t("Dept listing") }}</span>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-col cols="2">
                        <v-text-field v-model="search" append-icon="mdi-magnify" :label="$t('Search')" outlined dense
                            hide-details clearable class="search-field" color="teal" dark></v-text-field>
                    </v-col>
                    <v-btn color="warning" dark @click="triggerFileInput">
                        <v-icon left>mdi-file-upload</v-icon>
                        {{ $t("Import") }}
                    </v-btn>
                    <v-file-input label="File input" outlined dense ref="fileInput" style="display: none"
                        accept=".xlsx,.xls,.csv"></v-file-input>
                </v-app-bar>
                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-card class="form-card" elevation="2">
                                <v-card-title class="headline primary--text py-3 px-4">
                                    <v-icon left color="primary">mdi-office-building</v-icon>
                                    {{ $t("Department Details") }}
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="pt-4">
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="dept" :label="$t('Department')" outlined dense
                                                :rules="[v => !!v || $t('Required')]" hide-details="auto"
                                                clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="subDept" :label="$t('Dept unit')" outlined dense
                                              hide-details
                                                clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="description" :label="$t('Division')" outlined dense
                                             hide-details clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu v-model="Sdate" :close-on-content-click="true"
                                                transition="scale-transition">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="startDate" :label="$t('Start date')" readonly
                                                        v-bind="attrs" v-on="on" outlined dense hide-details
                                                        prepend-inner-icon="mdi-calendar"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="startDate" @input="Sdate = false"
                                                    header-color="teal"
                                                    :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu v-model="Edate" :close-on-content-click="true"
                                                transition="scale-transition">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="endDate" :label="$t('End date')" readonly
                                                        v-bind="attrs" v-on="on" outlined dense hide-details
                                                        prepend-inner-icon="mdi-calendar"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="endDate" @input="Edate = false"
                                                    header-color="teal"
                                                    :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <!-- <v-col cols="12" md="4">
                                            <v-select v-model="fid" :items="['D', 'I', 'O']" :label="$t('Fac. definition')"
                                                outlined dense hide-details
                                                clearable></v-select>
                                        </v-col> -->
                                        <!-- group code -->
                                        <!-- <v-col cols="12" md="6">
                                            <v-text-field v-model="group_code" :label="$t('Group code')" outlined dense
                                                hide-details clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="group_name" :label="$t('Group name')" outlined dense
                                             hide-details clearable></v-text-field>
                                        </v-col> -->
                                        <v-col cols="12">
                                            <!-- <div class="subtitle-1 mb-2">{{ $t("Dept name") }}</div> -->
                                            <v-card-title class="headline primary--text py-3 px-1">
                                                <v-icon left color="primary">mdi-office-building</v-icon>
                                                {{ $t("Dept name") }}
                                            </v-card-title>
                                            <v-row>
                                                <v-col cols="12" sm="12">
                                                    <v-text-field v-model="nameVi" :label="$t('Vietnamese name')"
                                                        outlined dense prepend-inner-icon="mdi-translate" hide-details
                                                        clearable></v-text-field>
                                                </v-col>
                                                <!-- <v-col cols="12" sm="12">
                                                    <v-text-field v-model="nameEn" :label="$t('English name')" outlined
                                                        dense prepend-inner-icon="mdi-translate" hide-details
                                                        clearable></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12">
                                                    <v-text-field v-model="nameCn" :label="$t('Chinese name')" outlined
                                                        dense prepend-inner-icon="mdi-translate" hide-details
                                                        clearable></v-text-field>
                                                </v-col> -->
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-divider class="mx-4"></v-divider>
                                <v-card-actions class="py-3 px-4">
                                    <v-btn color="error" @click="clearForm" elevation="2">
                                        <v-icon left>mdi-close</v-icon>
                                        {{ $t("CLEAR") }}
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" :loading="saving" @click="saveDept" elevation="2">
                                        <v-icon left>mdi-content-save</v-icon>
                                        {{ $t("SAVE") }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-card class="table-card" elevation="2">
                                <v-data-table :headers="headers" :items="filteredDeptData" :items-per-page="10"
                                    class="elevation-0 custom-table" :loading="loading"
                                    loading-text="Loading departments..." fixed-header>
                                    <template v-slot:loading>
                                        <v-skeleton-loader v-for="n in 3" :key="n"
                                            type="list-item-two-line"></v-skeleton-loader>
                                    </template>
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon color="error" class="action-icon" @click="editDept(item)">
                                            mdi-square-edit-outline
                                        </v-icon>
                                    </template>
                                    <template v-slot:[`header.department`]="{ header }">
                                        {{ $t("Division") }}
                                    </template>
                                    <template v-slot:[`header.name`]="{ header }">
                                        {{ $t("Name") }}
                                    </template>
                                    <template v-slot:[`header.sub_department`]="{ header }">
                                        {{ $t("Department") }}
                                    </template>
                                    <template v-slot:[`header.sub_division`]="{ header }">
                                        {{ $t("Unit") }}
                                    </template>
                                    <template v-slot:[`header.start_date`]="{ header }">
                                        {{ $t("Start date") }}
                                    </template>
                                    <template v-slot:[`header.end_date`]="{ header }">
                                        {{ $t("End date") }}
                                    </template>
                                    <template v-slot:[`header.fid`]="{ header }">
                                        {{ $t("Fac. definition") }}
                                    </template>
                                    <template v-slot:[`header.group_code`]="{ header }">
                                        {{ $t("Group code") }}
                                    </template>
                                    <template v-slot:[`header.group_name`]="{ header }">
                                        {{ $t("Group name") }}
                                    </template>
                                    <template v-slot:[`header.created_at`]="{ header }">
                                        {{ $t("Created date") }}
                                    </template>
                                    <template v-slot:[`header.actions`]="{ header }">
                                        {{ $t("Actions") }}
                                    </template>
                                    <template v-slot:[`item.name`]="{ item }">
                                        <!-- {{ getLocalizedName(item.name) }} -->
                                          {{ item.name}}
                                    </template>
                                    <template v-slot:[`item.created_at`]="{ item }">
                                        {{ formatDate(item.created_at) }}
                                    </template>
                                    <template #[`footer.prepend`]>
                                        <v-btn color="success" dark class="ml-3" small>
                                            <export-excel worksheet="Dept control" :data="exporFullData()"
                                                :name="`Dept_control_${today}`">
                                                <v-icon left>mdi-file-excel</v-icon>
                                                {{ $t("Export data") }}
                                            </export-excel>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
export default {
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            today: new Date().toISOString().slice(0, 10),
            headers: [
                // { text: 'ID', value: 'id', sortable: true },
                { text: 'Division', value: 'department', sortable: true, align: 'center' },
                { text: 'Department', value: 'sub_department', sortable: true, align: 'center' },
                { text: 'Unit', value: 'sub_division', sortable: true, align: 'center' },
                { text: 'Name', value: 'name', sortable: true, align: 'center' },
                // { text: 'Nike definition', value: 'fid', sortable: true, align: 'center' },
                // { text: 'Group code', value: 'group_code', sortable: true, align: 'center' },
                // { text: 'Group name', value: 'group_name', sortable: true, align: 'center' },
                { text: 'Start date', value: 'start_date', sortable: true, align: 'center' },
                { text: 'End date', value: 'end_date', sortable: true, align: 'center' },
                { text: 'Created date', value: 'created_at', sortable: true, align: 'center' },
                { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            deptData: [],
            dialogNewDept: false,
            loading: false,
            saving: false,
            dept: '',
            subDept: '',
            description: '',
            search: '',
            id: '',
            nameVi: '',
            nameEn: '',
            nameCn: '',
            Sdate: false,
            Edate: false,
            startDate: '',
            endDate: '',
            fid: '',
            group_name: '',
            group_code: '',
        }
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale;
        },
        filteredDeptData() {
            if (!this.search) return this.deptData;

            return this.deptData.filter(item => {
                const searchTerm = this.search.toLowerCase();
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTerm)
                );
            });
        }
    },
    methods: {
        triggerFileInput() {
            const inputElement = this.$refs.fileInput.$el.querySelector('input');
            if (inputElement) {
                inputElement.click();
                inputElement.addEventListener('change', this.handleFileImport);
            }
        },
        async handleFileImport(event) {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await this.$axios.post(this.api + 'importDeptCode', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    this.$notify({
                        title: 'Success',
                        text: 'Data imported successfully',
                        type: 'success'
                    });
                    await this.getAllDept(); // Refresh data
                } else {
                    this.$notify({
                        title: 'Error',
                        text: response.data.message,
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('Import error:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Error importing file',
                    type: 'error'
                });
            }

            event.target.value = '';
        },
        getLocalizedName(name) {
            if (!name) return '';
            try {
                const nameObj = typeof name === 'string' ? JSON.parse(name) : name;
                return nameObj[this.currentLocale] || nameObj.vi || nameObj.en || nameObj.cn || '';
            } catch (e) {
                console.error('Error parsing name:', e);
                return '';
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            return dateStr.split(' ')[0]; 
        },
        async getAllDept() {
            try {
                const res = await this.$axios.get(this.api + 'getDataDeptCode');
                let _rdata = res.data.dataDeptCode;
                // _rdata.forEach((item) => {
                //     try {
                //         // Make sure name is properly parsed
                //         item.name = typeof item.name === 'string' ? JSON.parse(item.name) : item.name;
                //     } catch (e) {
                //         console.error('Error parsing name:', e);
                //         item.name = { vi: '', en: '', cn: '' };
                //     }
                // });
                this.deptData = _rdata;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        editDept(data) {
            this.id = data.id;
            this.dept = data.department;
            this.subDept = data.sub_department;
            this.description = data.sub_division;
            this.startDate = data.start_date;
            this.endDate = data.end_date;
            this.group_code = data.group_code;
            this.group_name = data.group_name;
            if (data.name) {
                this.nameVi = data.name;
                this.nameEn = data.name.en || '';
                this.nameCn = data.name.cn || '';
            }
            this.fid = data.fid;
        },
        async saveDept() {
            let params = {
                id: this.id,
                department: this.dept,
                sub_department: this.subDept,
                sub_division: this.description,
                start_date: this.startDate,
                end_date: this.endDate,
                group_code: this.group_code,
                group_name: this.group_name,
                // name: JSON.stringify({
                //     vi: this.nameVi,
                //     en: this.nameEn,
                //     cn: this.nameCn
                // }),
                name: this.nameVi, // Assuming name is a string for simplicity
                fid: this.fid,
            }
            try {
                this.saving = true;
                const res = await this.$axios.post(this.api + 'saveDeptCode', params).then((res) => {
                    if (res.status === 200) {
                        this.$notify({
                            title: 'Success',
                            text: 'Data saved successfully',
                            type: 'success'
                        });
                        this.getAllDept();
                        this.clearForm();
                    }
                });

            } catch (error) {
                console.log(error);
            } finally {
                this.saving = false;
            }

        },
        clearForm() {
            this.dept = '';
            this.group = '';
            this.subDept = '';
            this.description = '';
            this.nameVi = '';
            this.nameEn = '';
            this.nameCn = '';
            this.startDate = '';
            this.endDate = '';
            this.fid = '';
            this.id = '';
        },
        exporFullData() {
            let _data = [];
            this.deptData.forEach((item) => {
                _data.push({
                    'Division': item.department,
                    'Department': item.sub_department,
                    'Unit': item.sub_division,
                    'Name': (item.name),
                   // 'Nike definition': item.fid,
                  //  'Group code': item.group_code,
                  //  'Group name': item.group_name,
                    'Start date': item.start_date,
                    'End date': item.end_date,
                    'Created date': this.formatDate(item.created_at)
                });
            });
            return _data;
        }
    },
    async mounted() {
        await this.getAllDept();
    }
}
</script>
<style scoped>
.main-card {
    border-radius: 12px;
    background: linear-gradient(to bottom, #ffffff, #f8f9fa);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.app-bar-custom {
    border-radius: 16px 16px 0 0;
    background: linear-gradient(135deg, #00796b, #004d40);
}

.search-field {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    transition: all 0.3s ease;
}

.search-field:hover {
    background: rgba(255, 255, 255, 0.15);
}

.action-button {
    border-radius: 8px;
    transition: all 0.2s ease;
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

.v-data-table ::v-deep tbody tr:hover {
    background-color: #f3fd99 !important;
}

.action-icon {
    transition: all 0.2s ease;
    cursor: pointer;
}


.dialog-card {
    border-radius: 12px;
    overflow: hidden;
}

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 8px;
}

::v-deep .v-input__slot {
    min-height: 40px;
}

.form-card,
.table-card {
    border-radius: 12px;
    transition: all 0.3s ease;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.pulse-icon {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
<i18n>
    {
        "en": {
            "Dept listing": "Department Listing",
            "Search": "Search",
            "Department Details": "Department Details",
            "Department": "Department",
            "Dept unit": "Department Unit",
            "Division": "Division",
            "Start date": "Start Date",
            "End date": "End Date",
            "Dept name": "Department Name",
            "Vietnamese name": "Vietnamese Name",
            "English name": "English Name",
            "Chinese name": "Chinese Name",
            "CLEAR": "Clear",
            "SAVE": "Save",
            "Actions": "Actions",
            "Name": "Dept Name",
            "Unit": "Unit",
            "Required": "This field is required",
            "Created date": "Created date",
            "Group code": "Group code",
            "Group name": "Group name",
            "Fac. definition": "Fac. definition"
        },
        "vi": {
            "Dept listing": "Danh sách phòng ban",
            "Search": "Tìm kiếm",
            "Department Details": "Chi tiết phòng ban",
            "Department": "Bộ phận",
            "Dept unit": "Đơn vị",
            "Division": "Cấp sở",
            "Start date": "Ngày bắt đầu",
            "End date": "Ngày kết thúc",
            "Dept name": "Tên bộ phận",
            "Vietnamese name": "Tên tiếng Việt",
            "English name": "Tên tiếng Anh",
            "Chinese name": "Tên tiếng Trung",
            "CLEAR": "Xóa",
            "SAVE": "Lưu",
            "Actions": "Thao tác",
            "Name": "Tên BP",
            "Unit": "Đơn vị",
            "Required": "Trường này là bắt buộc",
            "Created date": "Ngày tạo",
            "Group code": "Mã nhóm",
            "Group name": "Tên nhóm",
            "Fac. definition": "Định nghĩa nhà máy"
        },
        "cn": {
            "Dept listing": "部门列表",
            "Search": "搜索",
            "Department Details": "部门详情",
            "Department": "部",
            "Dept unit": "部门单位",
            "Division": "處",
            "Start date": "开始日期",
            "End date": "结束日期",
            "Dept name": "部门名称",
            "Vietnamese name": "越南语名称",
            "English name": "英文名称",
            "Chinese name": "中文名称",
            "CLEAR": "清除",
            "SAVE": "保存",
            "Actions": "操作",
            "Name": "部门名称",
            "Unit": "单位",
            "Required": "此字段为必填项",
            "Created date": "创建日期",
            "Group code": "组代码",
            "Group name": "群組",
            "Fac. definition": "廠內定義"
        }
    }
</i18n>