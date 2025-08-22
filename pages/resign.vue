<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="5" width="100%" :loading="loading">
                <v-app-bar color="teal darken-4" dense dark class="px-2">
                    <v-toolbar-title>
                        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                        {{ $t("Resignation listing") }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-col cols="2" class="px-2">
                        <v-text-field v-model="search" append-icon="mdi-magnify" :label="$t('Search')" outlined dense
                        hide-details clearable class="search-field"></v-text-field>
                    </v-col>
                    <v-btn dark class="ml-2 btn-hover" color="error" @click="dialog = true">
                        <v-icon left>mdi-plus</v-icon>
                        {{ $t("Input resign") }}
                    </v-btn>
                    <v-btn dark class="ml-2 btn-hover" color="success" to="/resign-report">
                        <v-icon left>mdi-export</v-icon>
                        {{ $t("Report") }}
                    </v-btn>
                    <v-menu v-model="menuOpen" offset-y :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn dark class="ml-2 btn-hover" color="primary" v-bind="attrs" v-on="on">
                                <v-icon left>mdi-eye</v-icon>
                                {{ $t("Toggle Columns") }}
                            </v-btn>
                        </template>
                        <v-list dense>
                            <v-list-item @click.stop>
                                <v-list-item-action>
                                    <v-checkbox v-model="selectAll" @change="toggleAllColumns" hide-details dense ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>{{ $t("Select All") }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item 
                            v-for="header in headers" 
                            :key="header.value"
                            @click.stop
                            >
                            <v-list-item-action>
                                <v-checkbox v-model="visibleColumns" :value="header.value" hide-details dense multiple ></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t(header.text) }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
            <v-card-text>
                <v-row dense class="mb-2">
                    <v-col cols="1">
                        <v-select v-model="filters.deptid" :items="deptOptions" item-text="text" item-value="value"
                        :label="$t('Dept')" outlined dense clearable hide-details
                        ></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-menu v-model="dateMenu" :close-on-content-click="false" max-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field :value="formatDateRange" :label="$t('Resignation Date Range')" readonly
                                v-bind="attrs" v-on="on" outlined dense clearable hide-details
                                @click:clear="clearDateRange"></v-text-field>
                            </template>
                            <v-date-picker v-model="filters.dateRange" range 
                            header-color="teal darken-4" color="teal darken-4"
                            :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="3">
                        <v-btn color="error" dark @click="clearFilters" outlined>
                            <v-icon left>mdi-filter-remove</v-icon>
                            {{ $t("Clear filters") }}
                        </v-btn>
                        <v-btn color="primary" dark @click="printData" outlined class="ml-2">
                            <v-icon left>mdi-printer</v-icon>
                            {{ $t("Print") }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table 
                :headers="visibleHeaders" 
                :items="paginatedData"
                :items-per-page="itemsPerPage" 
                :search="search"
                :custom-filter="filterBy"
                class="elevation-3 data-table" 
                :footer-props="{
                    'items-per-page-options': [10, 15, 30, 50, 100],
                    'show-current-page': true,
                    'show-first-last-page': true
                }"
                :server-items-length="totalItems"
                @update:options="handleTableOptions"
                :options.sync="tableOptions"
                item-key="uniqueId"
                >
                <template v-slot:[`item.action`]="{ item }">
                    <v-btn icon color="teal darken-4" @click="editDataResign(item)">
                        <v-icon color="error">mdi-square-edit-outline</v-icon>
                    </v-btn>
                </template>
                <template v-slot:[`item.er_name`]="{ item }">
                    <span class="name-link" @click="editDataResign(item)">
                        {{ item.er_name }}
                    </span>
                </template>
                <template v-slot:[`item.er_reason`]="{ item }">
                    {{ getLocalizedReason(item.er_reason) }}
                </template>
                <template v-slot:[`item.er_indate`]="{ item }">
                    <v-chip small label color="success" outlined>
                        {{ item.er_indate }}
                    </v-chip>
                </template>
                
                <template v-slot:[`item.er_resigndate`]="{ item }">
                    <v-chip small label color="error" outlined>
                        {{ item.er_resigndate }}
                    </v-chip>
                </template>
                <template v-slot:[`item.er_type_resign`]="{ item }">
                    {{ getLocalizedTypeResign(item.er_reason) }}
                </template>
                <template v-slot:[`item.er_age`]="{ item }">
                    {{ Number(item.er_age) }}
                </template>
                
                <template v-slot:[`item.er_seniority`]="{ item }">
                    {{ Number(item.er_seniority).toFixed(1) }}
                </template>
                <template #[`footer.prepend`]>
                    <v-btn color="success" dark @click="exportExcel">
                        <v-icon left>mdi-file-excel</v-icon>
                        {{ $t("Export to Excel") }}
                    </v-btn>
                </template>
                <template #[`header.er_empid`]>
                    <DsFilter :name="$t('Empno')" :in-items="filterItems.er_empid"
                    @changed="updateFilter('er_empid', $event)" />
                    <!-- {{ $t('Empno') }} -->
                </template>
                
                <template #[`header.er_name`]>
                    {{ $t('Name') }}
                </template>
                
                <template #[`header.er_deptid`]>
                    <DsFilter :name="$t('Dept')" :in-items="filterItems.er_deptid"
                    @changed="updateFilter('er_deptid', $event)" />
                    <!-- {{ $t('Dept') }} -->
                </template>
                
                <template #[`header.er_indate`]>
                    {{ $t('In date') }}
                </template>
                
                <template #[`header.er_deptname`]>
                    {{ $t('Dept name') }}
                </template>
                
                <template #[`header.er_joblevel`]>
                    <DsFilter :name="$t('Job level')" :in-items="filterItems.er_joblevel"
                    @changed="updateFilter('er_joblevel', $event)" />
                    <!-- {{ $t('Job level') }} -->
                </template>
                
                <template #[`header.er_age`]>
                    {{ $t('Age') }}
                </template>
                
                <template #[`header.er_seniority`]>
                    {{ $t('Seniority') }}
                </template>
                
                <template #[`header.er_bus`]>
                    <DsFilter :name="$t('Bus')" :in-items="filterItems.er_bus"
                    @changed="updateFilter('er_bus', $event)" />
                    <!-- {{ $t('Bus') }} -->
                </template>
                
                <template #[`header.er_gender`]>
                    <DsFilter :name="$t('Gender')" :in-items="filterItems.er_gender"
                    @changed="updateFilter('er_gender', $event)" />
                    <!-- {{ $t('Gender') }} -->
                </template>
                
                <template #[`header.er_hometown`]>
                    <DsFilter :name="$t('Home town')" :in-items="filterItems.er_hometown"
                    @changed="updateFilter('er_hometown', $event)" />
                    <!-- {{ $t('Home town') }} -->
                </template>
                
                <template #[`header.er_reason`]>
                    {{ $t('Reasons') }}
                </template>
                
                <template #[`header.er_note`]>
                    {{ $t('Note') }}
                </template>
                
                <template #[`header.er_numberid`]>
                    {{ $t('IC no') }}
                </template>
                
                <template #[`header.er_resigndate`]>
                    <DsFilter :name="$t('Resign date')" :in-items="filterItems.er_resigndate"
                    @changed="updateFilter('er_resigndate', $event)" />
                    <!-- {{ $t('Resign date') }} -->
                </template>
                
                <template #[`header.er_type_resign`]>
                    {{ $t('Type resign') }}
                </template>
                
                <template #[`header.action`]>
                    {{ $t('Action') }}
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</v-col>
<!-- <v-col cols="12" v-if="!isSearching && hasMoreData" class="text-center">
    <v-btn color="primary" :loading="loadingMore" @click="loadMoreData" > {{ $t("Load More Data") }} </v-btn>
</v-col> -->
<v-dialog v-model="dialog" max-width="900px">
    <v-card class="resign-dialog">
        <v-card-title class="headline py-4 teal darken-4 white--text">
            <v-icon large left color="white">mdi-account-arrow-right</v-icon>
            {{ $t("Input Resignation") }}
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-6">
            <v-form ref="form" v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <div class="text-h6 mb-4">
                            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                            <span class="text-h6">[{{ $t("Personal Information") }}]</span>
                        </div>
                        <v-row dense>
                            <v-col cols="2">
                                <v-text-field v-model="displayEmpno" v-mask="'######'" outlined dense
                                hide-details="auto" :rules="empnoRules" :error-messages="empnoErrorMessage" :label="$t('Empno')"
                                @change="checkEmpno()" prepend-inner-icon="mdi-card-account-details"
                                autofocus></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-model="name" :label="$t('Full Name')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="numid" :label="$t('Numid')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <v-select v-model="gender" :items="itemGender" :label="$t('Gender')" outlined
                                dense disabled hide-details="auto"></v-select>
                            </v-col>
                            <v-col cols="1">
                                <v-text-field v-model="age" :label="$t('Age')" outlined dense
                                hide-details="auto" disabled type="number"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <div class="text-h6 mb-4">
                            <v-icon color="amber darken-2" class="mr-2">mdi-briefcase</v-icon>
                            <span class="text-h6">[{{ $t("Work Information") }}]</span>
                        </div>
                        <v-row dense>
                            <v-col cols="4">
                                <v-text-field v-model="inDate" :label="$t('In date')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="dept" :label="$t('Dept')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="deptName" :label="$t('Dept name')" outlined dense
                                disabled hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="position" :label="$t('Position')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="seniority" :label="$t('Seniority Years')" outlined
                                dense disabled hide-details="auto" type="number"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-select v-model="vehicle" :items="['Tự túc', 'Xe đưa rước']"
                                :label="$t('Vehicle')" outlined dense hide-details="auto"
                                :rules="vehicleRules" clearable></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="hometown" :label="$t('Hometown')" outlined dense disabled
                                hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="address" :label="$t('Current Address')" outlined dense
                                disabled hide-details="auto"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    
                    <v-col cols="12">
                        <div class="text-h6 mb-4">
                            <v-icon color="red darken-2" class="mr-2">mdi-exit-run</v-icon>
                            <span class="text-h6">[{{ $t("Resignation Details") }}]</span>
                        </div>
                        <v-row dense>
                            <v-col cols="3">
                                <v-menu v-model="birthMenu" :close-on-content-click="false">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateResign" :label="$t('Resignation Date')"
                                        readonly v-bind="attrs" v-on="on" outlined dense :rules="dateRules"
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-calendar"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="dateResign" @input="birthMenu = false"
                                    header-color="teal darken-4" color="teal darken-4"
                                    :locale="$i18n.locale == 'cn' ? 'zh' : $i18n.locale">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="6">
                            <v-select v-model="reason" :items="localizedReasons"
                            :label="$t('Reason for Resignation')" outlined dense hide-details="auto"
                            :rules="reasonRules"></v-select>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field 
                            v-model="localizedTypeResign" 
                            :label="$t('Type resign')" 
                            outlined 
                            dense 
                            clearable
                            hide-details="auto" 
                            disabled
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="note" :label="$t('Additional Notes')" outlined dense clearable
                            hide-details="auto" rows="3"></v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
        <v-btn color="error" text dark @click="dialog = false" :disabled="saving" outlined>
            <v-icon left>mdi-close</v-icon>
            {{ $t("Cancel") }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="teal darken-4" dark @click="saveResign" :loading="saving" class="px-4">
            <v-icon left>mdi-content-save</v-icon>
            {{ $t("Save") }}
        </v-btn>
    </v-card-actions>
</v-card>
</v-dialog>
</v-row>
</template>

<script>
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import { mask } from 'v-mask'
import DsFilter from '../components/DsFilter.vue';

export default {
    directives: {
        mask
    },
       head: {
        title: 'Resignation listing'
    },
    components: { DsFilter },
    data() {
        return {
            search: '', 
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            api_mpr: 'http://gmo021.cansportsvg.com/api/vg-mpr/',
            today: dayjs().format('YYYY-MM-DD'),
            dialog: false,
            saving: false,
            loading: false,
            birthMenu: false,
            dateMenu: false,
            menuOpen: false,
            filters: {
                deptid: null,
                dateRange: []
            },
            reasons: [],
            id: '',
            empno: '',
            name: '',
            gender: '',
            age: null,
            dept: '',
            deptName: '',
            position: '',
            seniority: null,
            vehicle: '',
            dateResign: '',
            hometown: '',
            address: '',
            reason: '',
            note: '',
            inDate: '',
            itemGender: ['Nam', 'Nữ'],
            type_resign: '',
            localizedTypeResign: '',
            empnoRules: [
            v => !!v || 'Employee number is required',
            v => v.length === 6 || 'Employee number must be 6 digits',
            v => !this.isEmployeeExists || this.$t('Employee already exists')
            ],
            dateRules: [
            v => !!v || 'Resignation date is required',
            ],
            reasonRules: [v => !!v || 'Reason is required'],
            vehicleRules: [v => !!v || 'Vehicle is required'],
            valid: false,
            headers: [
            { text: 'Empno', value: 'er_empid', sortable: false },
            { text: 'Name', value: 'er_name', class: 'clickable-cell', sortable: false }, 
            { text: 'In date', value: 'er_indate', sortable: false },
            { text: 'Resign date', value: 'er_resigndate', sortable: false },
            { text: 'IC no', value: 'er_numberid', sortable: false },
            { text: 'Dept', value: 'er_deptid', sortable: false },
            { text: 'Dept name', value: 'er_deptname', sortable: false },
            { text: 'Job level', value: 'er_joblevel', sortable: false }, 
            { text: 'Age', value: 'er_age', sortable: false, align: 'center' }, 
            { text: 'Seniority', value: 'er_seniority', sortable: false, align: 'center' },
            { text: 'Bus', value: 'er_bus', sortable: false },
            { text: 'Gender', value: 'er_gender', sortable: false },
            { text: 'Home town', value: 'er_hometown', sortable: false },
            { text: 'Reasons', value: 'er_reason', sortable: false },
            {text: 'Type resign', value: 'er_type_resign', sortable: false },
            { text: 'Note', value: 'er_note', sortable: false },
            { text: 'Action', value: 'action', sortable: false },
            ],
            data: [],
            resignData: [],
            numid: '',
            visibleColumns: [],
            selectAll: true,
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            loadingMore: false,
            paginatedData: [], 
            hasMoreData: false,
            tableOptions: {
                page: 1,
                itemsPerPage: 10, // Sửa lại thành 10 để đồng bộ với itemsPerPage
                sortBy: ['er_resigndate'],
                sortDesc: [true],
            },
            isSearching: false,
            filterItems: {
                er_empid: [],
                er_resigndate: [],
                er_deptid: [],
                er_joblevel: [],
                er_gender: [],
                er_bus: [],
                er_hometown: []
            },
            activeFilters: {},
            filtersInitialized: false, // Add this line
        }
    },
    computed: {
        formatDateRange() {
            if (!this.filters.dateRange || this.filters.dateRange.length !== 2) return '';
            return `${this.filters.dateRange[0]} ~ ${this.filters.dateRange[1]}`;
        },
        filteredData() {
            // Nếu đang tìm kiếm, sử dụng paginatedData đã được lọc
            if (this.search) {
                return this.paginatedData.filter(item => 
                Object.entries(item).some(([key, value]) => 
                this.filterBy(value, this.search, { key })
                )
                );
            }
            
            // Nếu không tìm kiếm, áp dụng các bộ lọc
            return this.paginatedData.filter(item => this.applyFilters(item));
        },
        displayEmpno: {
            get() {
                return this.empno.toString().padStart(6, '0');
            },
            set(value) {
                this.empno = value.replace(/^0+/, ''); 
            }
        },
        localizedReasons() {
            return this.reasons.map(item => {
                try {
                    return {
                        value: item.id,
                        text: item.reason[this.$i18n.locale] || item.reason.en
                    };
                } catch (e) {
                    console.error('Error processing reason:', e);
                    return {
                        value: item.id,
                        text: 'Error loading reason'
                    };
                }
            });
        },
        localizedReasonOptions() {
            if (!this.reasons || !Array.isArray(this.reasons)) return [];
            
            return this.reasons.map(item => {
                try {
                    if (typeof item.reason === 'object') {
                        return {
                            value: item.id,
                            text: item.reason[this.$i18n.locale] || item.reason.en || ''
                        };
                    }
                    const reasonObj = JSON.parse(item.reason);
                    return {
                        value: String(item.id),
                        text: reasonObj[this.$i18n.locale] || reasonObj.en || ''
                    };
                } catch (e) {
                    console.error('Error parsing reason:', e);
                    return {
                        value: String(item.id),
                        text: item.reason || ''
                    };
                }
            });
        },
        isEmployeeExists() {
            const paddedEmpno = this.padEmpno(this.empno);
            return this.resignData.some(item => 
            item.er_empid === paddedEmpno && (!this.id || item.id !== this.id)
            );
        },
        empnoErrorMessage() {
            if (this.isEmployeeExists) {
                return this.$t('Employee already exists');
            }
            return '';
        },
        visibleHeaders() {
            if (this.visibleColumns.length === 0) {
                return this.headers;
            }
            return this.headers.filter(header => 
            this.visibleColumns.includes(header.value)
            );
        },
        deptOptions() {
            const uniqueDepts = [...new Set(this.resignData.map(item => ({
                deptId: item.er_deptid,
                deptName: item.er_deptname
            })).filter(dept => dept.deptId).map(dept => JSON.stringify(dept)))].map(dept => JSON.parse(dept));
            
            return uniqueDepts.sort((a, b) => a.deptId.localeCompare(b.deptId)).map(dept => ({
                text: `${dept.deptId}`,
                value: dept.deptId
            }));
        },
        
    },
    methods: {
    async getResignedCandidatesCount() {
            try {
                const res = await this.$axios.get(this.api_mpr + 'countResignedCandidates');
                if (res.status === 200) {
                }
            } catch (error) {
                console.error('Error fetching resigned candidates count:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to fetch resigned candidates count',
                    type: 'error'
                });
            }
            return 0;
        },
        async getReasons() {
            try {
                const res = await this.$axios.get(this.api + 'getDataReasonResign');
                if (res.status === 200 && res.data.dataReasonResign) {
                    this.reasons = res.data.dataReasonResign.map(r => ({
                        ...r,
                        reason: typeof r.reason === 'string' ? JSON.parse(r.reason) : r.reason,
                        type_resign: typeof r.type_resign === 'string' ? JSON.parse(r.type_resign) : r.type_resign
                    }));
                    
                }
            } catch (error) {
                console.error('Error loading reasons:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to load reasons',
                    type: 'error'
                });
            }
        },
        clearDateRange() {
            this.filters.dateRange = [];
        },
        applyFilters(item) {
            if (!item) return true;
            
            // Department filter
            if (this.filters.deptid && item.er_deptid !== this.filters.deptid) {
                return false;
            }
            
            // Date range filter
            if (this.filters.dateRange && this.filters.dateRange.length === 2) {
                const itemDate = new Date(item.er_resigndate);
                const startDate = new Date(this.filters.dateRange[0]);
                const endDate = new Date(this.filters.dateRange[1]);
                if (itemDate < startDate || itemDate > endDate) {
                    return false;
                }
            }
            
            // Employee ID filter
            if (this.activeFilters.er_empid && this.activeFilters.er_empid.length > 0) {
                if (!this.activeFilters.er_empid.includes(item.er_empid)) {
                    return false;
                }
            }
            
            // Resign date filter
            if (this.activeFilters.er_resigndate && this.activeFilters.er_resigndate.length > 0) {
                if (!this.activeFilters.er_resigndate.includes(item.er_resigndate)) {
                    return false;
                }
            }
            
            return true;
        },
        normalizeText(text) {
            if (!text) return '';
            return String(text).toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') 
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        },
        async saveResign() {
            if (!this.$refs.form.validate()) {
                this.$notify({
                    title: 'Error',
                    text: 'Please fill in all required fields',
                    type: 'error'
                })
                return;
            }
            
            if (!this.id && this.isEmployeeExists) {
                this.$notify({
                    title: 'Error',
                    text: this.$t('Employee already exists'),
                    type: 'error'
                });
                return;
            }
            
            this.saving = true; 
            const paddedEmpId = this.empno.toString().padStart(6, '0');
            let params = {
                id: this.id,
                er_empid: paddedEmpId, 
                er_numberid: this.numid,
                er_name: this.name,
                er_deptid: this.dept,
                er_deptname: this.deptName,
                er_joblevel: this.position,
                er_indate: this.inDate,
                er_age: this.age,
                er_seniority: this.seniority,
                er_bus: this.vehicle,
                er_gender: this.gender,
                er_hometown: this.hometown,
                er_reason: this.reason,
                er_note: this.note,
                er_resigndate: this.dateResign,
                er_keyindate: this.today,
                er_address: this.address,
                er_type_resign: this.type_resign
            };
            try {
                let res = await this.$axios.post(this.api + 'saveResign', params);
                if (res.status === 200) {
                    
                    this.$notify({
                        title: 'Success',
                        text: this.id ? 'Updated successfully' : 'Save successfully',
                        type: 'success'
                    });
                    await this.getAllData();
                    await this.getResignedCandidatesCount();
                    this.resetForm();
                    // this.dialog = false;
                }
            } catch (error) {
                console.error('Save error:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to save data',
                    type: 'error'
                });
            } finally {
                this.saving = false;
            }
        },
        
        resetForm() {
            this.empno = '';
            this.name = '';
            this.gender = '';
            this.age = null;
            this.inDate = '';
            this.numid = '';
            this.dept = '';
            this.deptName = '';
            this.position = '';
            this.seniority = null;
            this.vehicle = '';
            this.dateResign = '';
            this.hometown = '';
            this.address = '';
            this.reason = '';
            this.note = '';
            this.type_resign = '';
            this.localizedTypeResign = '';
            
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
            }
        },
        padEmpno(empno) {
            return empno.toString().padStart(6, '0');
        },
        
        async checkEmpno() {
            const paddedEmpno = this.padEmpno(this.empno);
            
            let params = {
                empno: paddedEmpno
            };
            
            try {
                let res = await this.$axios.post(this.api + 'postByEmpNoHRM', params);
                if (res.status === 200) {
                    this.data = res.data;
                    this.numid = this.data.ic_no;
                    this.name = this.data.name;
                    this.gender = this.data.sex;
                    this.inDate = this.data.in_date;
                    this.dept = this.data.dept_code;
                    this.deptName = this.data.dept_name;
                    this.address = this.data.address;
                    this.hometown = this.data.country;
                    this.position = this.data.duty;
                    this.age = this.data.age;
                    this.dateResign = this.data.dismiss;
                    this.seniority = this.data.seniority;
                }
            } catch (error) {
                console.log(error);
                this.$notify({
                    title: 'Error',
                    text: 'Employee not found or error occurred',
                    type: 'error'
                });
            }
        },
        async initializeFilters() {
            try {
                // Fetch distinct values for filters
                const response = await this.$axios.post(this.api + 'getDistinctValues');
                if (response.status === 200) {
                    const data = response.data;
                    // Update filterItems with distinct values
                    this.filterItems = {
                        er_empid: data.empids || [],
                        er_resigndate: data.resignDates || [],
                        er_deptid: data.departments || [],
                        er_joblevel: data.positions || [],
                        er_gender: data.genders || [],
                        er_bus: data.transportation || [],
                        er_hometown: data.hometowns || [],
                    };
                    
                    // After getting reasons, update reason-related filters
                    await this.getReasons();
                }
            } catch (error) {
                console.error('Error initializing filters:', error);
            }
        },
        
        async getAllData() {
            this.loading = true;
            try {
                // First load the filters if they haven't been initialized
                if (!this.filtersInitialized) {
                    await this.initializeFilters();
                    this.filtersInitialized = true;
                }
                
                // Convert client-side filter format to server-side format
                const serverFilters = {
                    ...this.filters,
                    activeFilters: this.activeFilters
                };
                
                const params = {
                    page: this.currentPage,
                    perPage: this.itemsPerPage,
                    filters: serverFilters,
                    search: this.search,
                    sortBy: this.tableOptions.sortBy[0] || 'er_resigndate',
                    sortDesc: this.tableOptions.sortDesc[0] || true
                };
                
                const response = await this.$axios.post(this.api + 'getResignData_new', params);
                
                if (response.status === 200) {
                    this.paginatedData = response.data.data;
                    this.totalItems = response.data.total;
                    this.processReasonData();
                    
                    // Update resignData for other computations
                    this.resignData = this.paginatedData;
                }
            } catch (error) {
                console.error('Error loading data:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to load data',
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        },
        async fetchPagedData() {
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.itemsPerPage
                };
                
                const res = await this.$axios.post(this.api + 'getResignData_new', params);
                
                if (res.status === 200) {
                    const newData = res.data.data;
                    
                    this.resignData = [...this.resignData, ...newData];
                    
                    this.paginatedData = [...this.paginatedData, ...newData];
                    
                    this.totalItems = res.data.total;
                    this.hasMoreData = this.paginatedData.length < this.totalItems;
                    
                    this.processReasonData();
                    this.loadingMore = false;
                }
            } catch (error) {
                console.error('Error loading paginated data:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to load data',
                    type: 'error'
                });
                this.loadingMore = false;
            }
        },
        processReasonData() {
            const processedData = this.paginatedData.map((item, index) => {
                const reasonId = item.er_reason;
                const reason = this.reasons.find(r => r.id === parseInt(reasonId));
                return {
                    ...item,
                    uniqueId: `${item.id || ''}${item.er_empid || ''}${index}`, // Add unique identifier
                    originalReasonId: reasonId,
                    displayReason: reason ? reason.reason[this.$i18n.locale] || reason.reason.en : reasonId,
                    er_type_resign: reason ? reason.type_resign[this.$i18n.locale] || reason.type_resign.en : ''
                };
            });
            
            this.paginatedData = processedData;
        },
        handleTableOptions(options) {
            this.tableOptions = options;
            this.currentPage = options.page;
            this.itemsPerPage = options.itemsPerPage;
            
            // Thêm sort options vào params nếu cần
            const sortParams = options.sortBy.map((item, index) => ({
                field: item,
                desc: options.sortDesc[index]
            }));
            
            this.getAllData();
        },
        loadMoreData() {
            this.loadingMore = true;
            this.currentPage++;
            this.fetchPagedData();
        },
        editDataResign(item) {
            this.id = item.id;
            this.dialog = true;
            this.numid = item.er_numberid;
            this.empno = item.er_empid;
            this.name = item.er_name;
            this.gender = item.er_gender;
            this.inDate = item.er_indate;
            this.dept = item.er_deptid;
            this.deptName = item.er_deptname;
            this.position = item.er_joblevel;
            this.age = item.er_age;
            this.seniority = item.er_seniority;
            this.vehicle = item.er_bus;
            this.dateResign = item.er_resigndate;
            this.hometown = item.er_hometown;
            this.reason = parseInt(item.originalReasonId);
            this.address = item.er_address;
            this.note = item.er_note;
        },
        formatExcelData() {
            return this.filteredResignData.map(item => {
                return {
                    ...item,
                    er_resigndate: dayjs(item.er_resigndate).format('YYYY-MM-DD'),
                    er_seniority: item.er_seniority,
                    er_reason: this.getReasonText(item.er_reason) 
                }
            });
        },
        async exportExcel() {
            try {
                this.loading = true;
                // Lấy toàn bộ dữ liệu đã lọc (không phân trang)
                const response = await this.$axios.post(this.api + 'getResignData_new', {
                    all: true,
                    filters: this.filters,
                    search: this.search
                });
                
                let allData = response.data && response.data.data ? response.data.data : [];
                // Áp dụng filter lại nếu cần (nếu server chưa filter đủ)
                allData = allData.filter(item => this.applyFilters(item));
                
                if (!allData.length) {
                    this.$notify({
                        title: 'Warning',
                        text: 'No data to export',
                        type: 'warning'
                    });
                    return;
                }
                
                const colWidths = [
                { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 10 },
                { wch: 25 }, { wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 15 }, { wch: 10 },
                { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 40 }, { wch: 30 },
                ];
                const headers = [
                'Employee ID', 'Full Name', 'IC no', 'Indate', 'Resignation Date', 'Department', 'Department Name',
                'Position', 'Age', 'Seniority', 'Transportation', 'Gender',
                'Hometown', 'Reason', 'Note', 'Address', 'Type resign'
                ];
                const data = allData.map(item => [
                { v: item.er_empid, t: 's', z: '@' },
                item.er_name,
                item.er_numberid,
                dayjs(item.er_indate).format('YYYY-MM-DD'),
                dayjs(item.er_resigndate).format('YYYY-MM-DD'),
                item.er_deptid,
                item.er_deptname,
                item.er_joblevel,
                item.er_age,
                item.er_seniority,
                item.er_bus,
                item.er_gender,
                item.er_hometown,
                this.getLocalizedReason(item.er_reason),
                item.er_note,
                item.er_address,
                this.getLocalizedTypeResign(item.er_reason)
                ]);
                const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
                ws['!cols'] = colWidths;
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Resignation List');
                
                let filename = 'Resignation_Report';
                if (this.filters.deptid) filename += `_Dept${this.filters.deptid}`;
                if (this.filters.reason) filename += `_${this.filters.reason.substring(0, 10)}`;
                if (this.filters.dateRange && this.filters.dateRange.length === 2) {
                    filename += `_${this.filters.dateRange[0]}_${this.filters.dateRange[1]}`;
                }
                filename += `_${this.today}.xlsx`;
                
                XLSX.writeFile(wb, filename);
                
                this.$notify({
                    title: 'Success',
                    text: `Exported ${data.length} records successfully`,
                    type: 'success'
                });
            } catch (error) {
                console.error('Export error:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to export Excel file',
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        },
        clearFilters() {
            this.search = '';
            this.filters = {
                deptid: null,
                dateRange: [],
            };
            this.activeFilters = {}; // Clear active filters as well
            
            this.dateMenu = false;
            
            this.$nextTick(() => {
                this.handleFilterChange();
                this.$forceUpdate();
            });
            
            this.$notify({
                title: 'Success',
                text: this.$t('All filters have been cleared'),
                type: 'success'
            });
        },
        getReasonText(reasonId) {
            const reason = this.reasons.find(r => r.id === parseInt(reasonId));
            if (reason) {
                try {
                    return reason.reason[this.$i18n.locale] || reason.reason.en || '';
                } catch (e) {
                    console.error('Error parsing reason:', e);
                    return reason.reason;
                }
            }
            return reasonId; 
        },
        async printData() {
            try {
                this.loading = true;
                // Lấy tất cả dữ liệu
                const response = await this.$axios.post(this.api + 'getResignData_new', {
                    all: true, // Request all records without pagination
                    filters: this.filters
                });
                
                if (!response.data || !response.data.data) {
                    this.$notify({
                        title: 'Warning',
                        text: 'No data to print',
                        type: 'warning'
                    });
                    return;
                }
                
                // Áp dụng bộ lọc cho tất cả dữ liệu
                let allFilteredData = response.data.data;
                
                // Áp dụng search nếu có
                if (this.search) {
                    allFilteredData = allFilteredData.filter(item =>
                    Object.entries(item).some(([key, value]) => {
                        if (key === 'er_reason') {
                            return this.normalizeText(this.getLocalizedReason(value))
                            .includes(this.normalizeText(this.search));
                        }
                        if (key === 'er_type_resign') {
                            return this.normalizeText(this.getLocalizedTypeResign(item.er_reason))
                            .includes(this.normalizeText(this.search));
                        }
                        return value && this.normalizeText(String(value))
                        .includes(this.normalizeText(this.search));
                    })
                    );
                }
                
                // Áp dụng các bộ lọc khác
                allFilteredData = allFilteredData.filter(item => this.applyFilters(item));
                
                if (allFilteredData.length === 0) {
                    this.$notify({
                        title: 'Warning',
                        text: 'No data matches the current filters',
                        type: 'warning'
                    });
                    return;
                }
                
                // Process data for printing
                const printData = {
                    data: allFilteredData.map(item => ({
                        ...item,
                        er_reason: item.er_reason ? this.getReasonText(item.er_reason) : '',
                        er_type_resign: item.er_reason ? this.getLocalizedTypeResign(item.er_reason) : ''
                    })),
                    dateRange: this.formatDateRange || ''
                };
                
                // Save to localStorage for print page
                const printKey = `resign-print-data-${Date.now()}`;
                localStorage.setItem(printKey, JSON.stringify(printData));
                
                // Open print window
                const route = this.$router.resolve({
                    path: '/template-print/resign',
                    query: { key: printKey }
                });
                window.open(route.href, '_blank');
                
            } catch (error) {
                console.error('Print error:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to open print view',
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        },
        updateTypeResign(reasonId) {
            if (reasonId) {
                const selectedReason = this.reasons.find(r => r.id === parseInt(reasonId));
                if (selectedReason && selectedReason.type_resign) {
                    this.type_resign = selectedReason.type_resign;
                    this.localizedTypeResign = selectedReason.type_resign[this.$i18n.locale] || 
                    selectedReason.type_resign.en;
                }
            } else {
                this.type_resign = '';
                this.localizedTypeResign = '';
            }
        },
        getLocalizedReason(reasonId) {
            const reason = this.reasons.find(r => r.id === parseInt(reasonId));
            if (reason) {
                try {
                    return reason.reason[this.$i18n.locale] || reason.reason.en;
                } catch (e) {
                    console.error('Error getting localized reason:', e);
                    return 'Unknown reason';
                }
            }
            return reasonId;
        },
        getLocalizedTypeResign(reasonId) {
            const reason = this.reasons.find(r => r.id === parseInt(reasonId));
            if (reason) {
                try {
                    return reason.type_resign[this.$i18n.locale] || reason.type_resign.en;
                } catch (e) {
                    console.error('Error getting localized type resign:', e);
                    return 'Unknown type';
                }
            }
            return '';
        },
        getLocalizedValue(jsonString, defaultLocale = 'vi') {
            try {
                if (typeof jsonString === 'object') {
                    return jsonString[this.$i18n.locale] || jsonString[defaultLocale] || jsonString.en;
                }
                const parsed = JSON.parse(jsonString);
                return parsed[this.$i18n.locale] || parsed[defaultLocale] || parsed.en;
            } catch (e) {
                console.error('Error parsing JSON:', e);
                return jsonString;
            }
        },
        filterBy(value, search, item) {
            if (!search || search.trim() === '') return true;
            
            const searchTerm = this.normalizeText(search);
            
            if (value === null || value === undefined) return false;
            
            if (item) {
                const field = item.key || '';
                
                if (field === 'er_reason') {
                    const reason = this.getLocalizedReason(value);
                    return this.normalizeText(reason).includes(searchTerm);
                }
                if (field === 'er_type_resign') {
                    const typeResign = this.getLocalizedTypeResign(item.er_reason);
                    return this.normalizeText(typeResign).includes(searchTerm);
                }
            }
            return this.normalizeText(String(value)).includes(searchTerm);
        },
        
        normalizeText(text) {
            if (!text) return '';
            return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .trim();
        },
        
        handleSearch() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            this.searchTimeout = setTimeout(async () => {
                this.loading = true;
                
                try {
                    if (this.search) {
                        // Load all data when searching
                        const response = await this.$axios.post(this.api + 'getResignData_new', {
                            all: true, // Request all records
                            filters: {
                                ...this.filters,
                                ...this.activeFilters
                            }
                        });
                        
                        if (response.status === 200) {
                            const allData = response.data.data;
                            // Apply search filter on all data
                            this.paginatedData = allData.filter(item => 
                            Object.entries(item).some(([key, value]) => {
                                if (key === 'er_reason') {
                                    return this.normalizeText(this.getLocalizedReason(value))
                                    .includes(this.normalizeText(this.search));
                                }
                                if (key === 'er_type_resign') {
                                    return this.normalizeText(this.getLocalizedTypeResign(item.er_reason))
                                    .includes(this.normalizeText(this.search));
                                }
                                return value && this.normalizeText(String(value))
                                .includes(this.normalizeText(this.search));
                            })
                            );
                            this.totalItems = this.paginatedData.length;
                            this.isSearching = true;
                        }
                    } else {
                        // If no search term, revert to paginated data
                        await this.getAllData();
                        this.isSearching = false;
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    this.$notify({
                        title: 'Error',
                        text: 'Failed to search data',
                        type: 'error'
                    });
                } finally {
                    this.loading = false;
                }
            }, 300);
        },
        updateFilter(field, selectedItems) {
            if (selectedItems && selectedItems.length > 0) {
                this.$set(this.activeFilters, field, selectedItems);
            } else {
                this.$delete(this.activeFilters, field);
            }
            this.handleFilterChange();
        },
        
        handleFilterChange() {
            // Reset về trang đầu tiên khi filter thay đổi
            this.currentPage = 1;
            this.tableOptions.page = 1;
            // Gọi lại API để lấy dữ liệu đã lọc
            this.getAllData();
        },
        toggleAllColumns(val) {
            this.visibleColumns = val ? this.headers.map(header => header.value) : [];
        },
    },
    async created() { 
        this.visibleColumns = this.headers.map(header => header.value);
        this.initializeFilters(); // Initialize filters when component is created
    },
    mounted() {
        this.getReasons();
    },
    watch: {
        visibleColumns(val) {
            this.selectAll = val.length === this.headers.length;
        },
        reason(newValue) {
            this.updateTypeResign(newValue);
        },
        filters: {
            handler() {
                this.currentPage = 1; // Reset to first page when filters change
                this.getAllData();
            },
            deep: true
        },
        search: {
            handler(newVal) {
                // Debounce search để tránh gọi API quá nhiều
                if (this.searchTimeout) clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch();
                }, 300);
            }
        },
        activeFilters: {
            handler() {
                this.handleFilterChange();
            },
            deep: true
        },
    }
}
</script>
<style scoped>
.resign-dialog {
    border-radius: 8px;
}
.resign-dialog .v-input {
    transition: all 0.3s;
}
.resign-dialog .v-input:hover {
    transform: translateY(-2px);
}
.v-btn {
    text-transform: none;
    letter-spacing: 0.5px;
}
.text-h6 {
    color: #1976d2;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
}
.excel-export-btn {
    text-decoration: none;
}
.search-field {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    transition: all 0.3s ease;
}
.name-link {
    color: #1976d2;
    cursor: pointer;
    text-decoration: none;
}
.name-link:hover {
    text-decoration: underline;
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
.v-data-table ::v-deep thead th,
.v-data-table ::v-deep tbody td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.v-data-table ::v-deep tbody tr:hover {
    background-color: #f3fd99 !important;
}
.v-list-item {
    min-height: 35px !important;
    cursor: pointer;
}
.filter-menu {
    max-height: 300px;
    overflow-y: auto;
}
.filter-chip {
    margin: 2px;
}
</style>
<i18n>
    {   "en": {
        "Resignation listing": "Resignation listing",
        "Search": "Search",
        "Input resign": "Input resign",
        "Export to Excel": "Export to Excel",
        "Empno": "Empno",
        "Name": "Name",
        "Dept": "Dept",
        "Dept name": "Dept Name",
        "Job level": "Position",
        "Age": "Age",
        "Seniority": "Seniority",
        "Bus": "Transportation",
        "Gender": "Gender",
        "Home town": "Home town",
        "Reasons": "Reasons",
        "Note": "Note",
        "Resign date": "Resign date",
        "Action": "Action",
        "Input Resignation": "Input Resignation",
        "Personal Information": "Personal Information",
        "Full Name": "Full Name",
        "Work Information": "Work Information",
        "Position": "Position",
        "Vehicle": "Transportation",
        "Resignation Details": "Resignation Details",
        "Resignation Date": "Resignation Date",
        "Reason for Resignation": "Reason for Resignation",
        "Hometown": "Hometown",
        "Current Address": "Current Address",
        "Additional Notes": "Additional Notes",
        "Cancel": "Cancel",
        "Save": "Save",
        "Report": "Report",
        "Resignation Date Range": "Resignation Date Range",
        "Clear filters": "Clear filters",
        "IC no": "IC no",
        "Print": "Print Resignation List",
        "Numid": "Number id",
        "In date": "In date",
        "Employee already exists": "Employee already exists in resignation list",
        "Toggle Columns": "Show Columns",
        "Select All": "Select All",
        "Type resign": "Type of Resignation",
        "Load More Data": "Load More Data",
        "Seniority Years": "Seniority (Years)"
    },
    "vi": {
        "Resignation listing": "Danh sách nghỉ việc",
        "Search": "Tìm kiếm",
        "Input resign": "Nhập thông tin nghỉ việc",
        "Export to Excel": "Xuất Excel",
        "Empno": "Mã NV",
        "Name": "Họ tên",
        "Dept": "Bộ phận",
        "Dept name": "Tên BP",
        "Job level": "Chức vụ",
        "Age": "Tuổi",
        "Seniority": "Thâm niên",
        "Bus": "Xe đưa rước",
        "Gender": "Giới tính",
        "Home town": "Quê quán",
        "Reasons": "Lý do",
        "Note": "Ghi chú",
        "Resign date": "N.thôi việc",
        "Action": "Thao tác",
        "Input Resignation": "Nhập thông tin nghỉ việc",
        "Personal Information": "Thông tin cá nhân",
        "Full Name": "Họ và tên",
        "Work Information": "Thông tin công việc",
        "Position": "Chức vụ",
        "Vehicle": "Phương tiện",
        "Resignation Details": "Chi tiết nghỉ việc",
        "Resignation Date": "Ngày nghỉ việc",
        "Reason for Resignation": "Lý do",
        "Hometown": "Quê quán",
        "Current Address": "Địa chỉ hiện tại",
        "Additional Notes": "Ghi chú",
        "Cancel": "Hủy",
        "Save": "Lưu",
        "Report": "Báo cáo",
        "Resignation Date Range": "N.nghỉ việc",
        "Clear filters": "Xóa lọc",
        "IC no": "Số CCCD",
        "Print": "In DS nghỉ việc",
        "Numid": "Số CCCD",
        "In date": "Ngày vào",
        "Employee already exists": "Nhân viên đã có trong danh sách nghỉ việc",
        "Toggle Columns": "Ẩn/Hiện Cột",
        "Select All": "Chọn tất cả",
        "Type resign": "Loại nghỉ việc",
        "Load More Data": "Tải thêm dữ liệu",
        "Seniority Years": "Thâm niên (Năm)"
    },
    "cn": {
        "Resignation listing": "离职列表",
        "Search": "搜索",
        "Input resign": "输入离职信息",
        "Export to Excel": "导出Excel",
        "Empno": "员工编号",
        "Name": "姓名",
        "Dept": "部门",
        "Dept name": "部门名称",
        "Job level": "职位",
        "Age": "年龄",
        "Seniority": "工龄",
        "Bus": "交通",
        "Gender": "性别",
        "Home town": "籍贯",
        "Reasons": "原因",
        "Note": "备注",
        "Resign date": "离职日期",
        "Action": "操作",
        "Input Resignation": "输入离职信息",
        "Personal Information": "个人信息",
        "Full Name": "全名",
        "Work Information": "工作信息",
        "Position": "职位",
        "Vehicle": "交通工具",
        "Resignation Details": "离职详情",
        "Resignation Date": "离职日期",
        "Reason for Resignation": "离职原因",
        "Hometown": "籍贯",
        "Current Address": "现居地址",
        "Additional Notes": "附加说明",
        "Cancel": "取消",
        "Save": "保存",
        "Report": "报告",
        "Resignation Date Range": "离职日期范围",
        "Clear filters": "清除过滤器",
        "IC no": "身份证号",
        "Print": "打印离职列表",
        "Numid": "身份证号",
        "In date": "入职日期",
        "Employee already exists": "员工已存在于离职名单中",
        "Toggle Columns": "显示/隐藏列",
        "Select All": "全选",
        "Type resign": "离职类型",
        "Load More Data": "加载更多数据",
        "Seniority Years": "工龄（年）"
    }
}
</i18n>