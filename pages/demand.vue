<template>
    <v-row>
        <v-col cols="12">
            <v-card class="demand-card">
                <v-app-bar color="teal darken-4" dense dark class="px-6 elevation-2">
                    <v-toolbar-title class="d-flex align-center">
                        <v-icon class="mr-3">mdi-file-document-outline</v-icon>
                        <span class="text-h6 font-weight-medium">{{ $t("Demand management") }}</span>
                        <v-divider vertical dark class="ml-3"></v-divider>
                        <v-chip-group v-model="selectedPositions" show-arrows multiple class="ml-10 chip-group-search">
                            <v-chip v-for="pos in itemsPos" :key="pos.en" filter
                            class="font-weight-medium" outlined label  :value="pos.en">
                            {{ getLocalizedItem(itemsPos, pos.en) }}
                        </v-chip>
                    </v-chip-group>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="$t('Search')" single-line
                hide-details filled rounded dense class="search-field mx-4" style="max-width: 300px"
                clearable></v-text-field>
                <v-btn color="error" @click="showDialog = true" class="elevation-1 animate-button"
                :loading="loading">
                <v-icon left dark>mdi-plus</v-icon>
                <span class="text-teal-darken-4">{{ $t("Add demand") }}</span>
            </v-btn>
            <v-btn icon class="ml-2" @click="showColumnDialog = true" title="Show/Hide Columns">
                <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
        </v-app-bar>
        
        <v-card-text class="pa-1">
            <v-col cols="12">
                <v-row align="center" justify="start" class="grey lighten-5 pa-1 rounded-lg">
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="selectDept" :items="itemsSelectDept" :label="$t('Department')"
                        hide-details outlined dense background-color="white" prepend-inner-icon="mdi-domain"
                        clearable @change="filterData"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-col>
            <v-data-table :headers="visibleHeaders" :items="mappedDemandData" :items-per-page="10" :loading="loading"
            :search="search" class="elevation-1 rounded-lg data-table"  :footer-props="{
                'show-current-page': true,
                'show-first-last-page': true
            }" >
            <template v-slot:[`item.actions`]="{ item }">
                <div class="action-buttons">
                    <v-icon color="warning" outline class="mr-1 action-icon"
                    @click="editItem(item)">mdi-square-edit-outline</v-icon>
                    <!-- thêm chức năng xóa dữ liệu-->
                    <v-icon color="error" outline class="mr-2 action-icon"
                    @click="deleteItem(item)">mdi-delete</v-icon>
                </div>
            </template>
            <template v-slot:[`item.dem_fulfilled`]="{ item }">
                <span :style="{
                    color: item.dem_fulfilled === 'yes' ? '#388e3c' : '#d32f2f',
                    fontWeight: 'bold'
                }">
                {{ item.dem_fulfilled === 'yes' ? $t('Yes') : $t('No') }}
            </span>
        </template>
        <template v-slot:[`item.dem_fullfilldate`]="{ item }">
            {{ item.dem_fullfilldate }}
        </template>
        <template v-slot:[`item.id_code`]="{ item }">
            <v-btn text color="primary" @click="editItem(item)">
                {{ item.id_code }}
            </v-btn>
        </template>
        <template v-slot:[`item.dem_inputdate`]="{ item }">
            {{ item.dem_inputdate || '' }}
        </template>
        <template v-slot:[`item.dem_note`]="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="note-icon" v-bind="attrs" v-on="on" @click="showNoteDialog(item)">
                        mdi-information-outline
                    </v-icon>
                </template>
                <span>View note</span>
            </v-tooltip>
        </template>
        <template v-slot:[`item.dem_candidates`]="{ item }">
            <div class="d-flex align-center candidates-text-truncate"
            @click="showCandidatesDialog(item.dem_candidates)"
            style="cursor: pointer;">
            {{ getCandidatesCount(item.dem_candidates) }}
        </div>
    </template>
    <template v-slot:[`item.dem_unit_name`]="{ item }">
        {{ item.dem_unit_name }}
    </template>
    <template v-slot:[`item.dem_position`]="{ item }">
        {{ item.dem_position_name }}
    </template>
    
    <template v-slot:[`item.dem_sub_position`]="{ item }">
        {{ item.dem_sub_position_name }}
    </template>
    <template v-slot:[`item.dem_recruited`]="{ item }">
        <nuxt-link
        :to="{ path: '/', query: { id: item.id, act_en_date: item.dem_fullfilldate } }"
        class="candidate-link">
        {{ item.dem_recruited || '' }}
    </nuxt-link>
</template>
<template v-slot:[`item.dem_cancel_date`]="{ item }">
    <v-chip x-small color="secondary" text-color="black" class="table-chip" label outlined @click="handleCancelDateClick(item)" :disabled="!!item.dem_cancel_date" >
        {{ formatCancelDate(item.dem_cancel_date) || $t('Set date') }}
    </v-chip>
</template>
<template #[`footer.prepend`]>
    <v-btn color="success" small dark @click="exportToExcel">
        <v-icon left>mdi-file-excel</v-icon>
        {{ $t('Export excel') }}
    </v-btn>
</template>
<template #[`header.dem_cancel_date`]>
    {{ $t('Cancel Date') }}
</template>
<template #[`header.dem_dept`]>
    <DsFilter :name="$t('Division')" :in-items="filterItems.dem_dept"
    @changed="updateFilter('dem_dept', $event)" />
</template>
<template #[`header.dem_sub_department`]>
    <DsFilter :name="$t('Department')" :in-items="filterItems.dem_sub_department"
    @changed="updateFilter('dem_sub_department', $event)" />
</template>
<template #[`header.dem_unit`]>
    <DsFilter :name="$t('Unit code')" :in-items="filterItems.dem_unit"
    @changed="updateFilter('dem_unit', $event)" />
</template>
<template #[`header.dem_unit_name`]>
    {{ $t('Unit name') }}
</template>
<template #[`header.dem_position`]>
    <DsFilter :name="$t('Position')" :in-items="filterItems.dem_position"
    @changed="updateFilter('dem_position', $event)" />
</template>
<template #[`header.dem_sub_position`]>
    <DsFilter :name="$t('Sub Position')" :in-items="filterItems.dem_sub_position"
    @changed="updateFilter('dem_sub_position', $event)" />
</template> 
<template #[`header.dem_amount`]>
    {{ $t('Amount') }}
</template>
<template #[`header.dem_inputdate`]>
    <DsFilter :name="$t('Request date')" :in-items="filterItems.dem_inputdate"
    @changed="updateFilter('dem_inputdate', $event)" />
</template>
<template #[`header.dem_recruited`]>
    <DsFilter :name="$t('Recruited')" :in-items="filterItems.dem_recruited"
    @changed="updateFilter('dem_recruited', $event)" />
</template>
<template #[`header.dem_fulfilled`]>
    <DsFilter :name="$t('Full filled')" :in-items="filterItems.dem_fulfilled"
    @changed="updateFilter('dem_fulfilled', $event)" />
</template>
<template #[`header.dem_fullfilldate`]>
    <DsFilter :name="$t('Full filled date')" :in-items="filterItems.dem_fullfilldate"
    @changed="updateFilter('dem_fullfilldate', $event)" />
</template>
<template #[`header.stocknumber`]>
    <DsFilter :name="$t('Still in need')" :in-items="filterItems.stocknumber"
    @changed="updateFilter('stocknumber', $event)" />
</template>
<template #[`header.dem_note`]>
    <DsFilter :name="$t('Note')" :in-items="filterItems.dem_note"
    @changed="updateFilter('dem_note', $event)" />
</template>
<template #[`header.dem_candidates`]>
    <DsFilter :name="$t('Candidates')" :in-items="filterItems.dem_candidates"
    @changed="updateFilter('dem_candidates', $event)" />
</template>
<template #[`header.dem_pause_start_at`]>
    <DsFilter :name="$t('On hold start')" :in-items="filterItems.dem_pause_start_at"
    @changed="updateFilter('dem_pause_start_at', $event)" />
</template>
<template #[`header.dem_pause_end_at`]>
    <DsFilter :name="$t('On hold end')" :in-items="filterItems.dem_pause_end_at"
    @changed="updateFilter('dem_pause_end_at', $event)" />
</template>
<template v-slot:[`header.actions`]="{ header }">
    {{ $t('Action') }}
</template>
<template v-slot:[`header.id_code`]="{ header }">
    {{ $t('ID') }}
    
</template>
<template v-slot:[`header.dem_status`]="slotProps">
    <DsFilter :name="$t('Status')" :in-items="filterItems.dem_status"
    @changed="updateFilter('dem_status', $event)" />
</template>
<template v-slot:[`item.dem_status`]="{ item }">
    {{ getStatusText(item) }}
</template>
<template v-slot:body.append>
    <tr class="total-row">
        <td colspan="5" class="text-center"> {{$t('Total')}}</td>
        <td v-for="header in headers.slice(5)" :key="header.value">
            <span v-if="header.value === 'dem_fulfilled'" class="text-center">
                {{ $t('Yes') }}: {{ totalSum[header.value].yes }} <br>
                {{ $t('No') }}: {{ totalSum[header.value].no }}
            </span>
            <span v-else-if="!['dem_dept', 'dem_cancel_date',
            'dem_sub_department', 'dem_unit', 'dem_position',
            'dem_sub_position', 'dem_inputdate', 'dem_fulfilled', 
            'dem_fullfilldate', 'dem_inputdate', 'dem_note', 
            'dem_pause_start_at', 'dem_pause_end_at', 'actions','dem_status'].includes(header.value)" class="text-center">
            {{ totalSum[header.value] || 0 }}
        </span>
    </td>
</tr>    
</template>
</v-data-table>
</v-card-text>
</v-card>
</v-col>

<v-dialog v-model="showDialog" max-width="950" transition="dialog-bottom-transition" persistent>
    <v-card class="form-card">
        <v-card-title class="teal darken-4 white--text px-6 py-4">
            <v-icon dark class="mr-2">{{ id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            <span class="text-h6">{{ id ? $t("Edit demand") : $t("Add demand") }}</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="showDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
            <v-form ref="form" v-model="formValid">
                <v-row>
                    <!-- Basic Information -->
                    <v-col cols="12">
                        <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">{{ $t("Basic Information") }}
                        </div>
                        <v-row>
                            <v-col cols="12" md="2">
                                <!-- <v-text-field v-model="demand.id" :label="$t('ID')" outlined dense hide-details prepend-inner-icon="mdi-identifier" disabled></v-text-field> -->
                                <v-text-field v-model="demand.id_code" :rules="[rules.required]" :label="$t('ID')" outlined dense hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-autocomplete v-model="demand.department" :items="itemsSelectDept"
                                :label="$t('Division') " :rules="[rules.required]" outlined dense
                                hide-details  clearable></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-autocomplete v-model="demand.sub_department" :items="filteredUnits"
                                :label="$t('Department') " :rules="[rules.required]" outlined dense
                                hide-details  clearable></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-autocomplete v-model="demand.sub_division" :items="itemsDiv"
                                :label="$t('Unit') " :rules="[rules.required]" outlined dense
                                hide-details   clearable></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-autocomplete 
                                v-model="demand.position"
                                :items="localizedItemsPos"
                                item-text="text"
                                item-value="en"
                                :label="$t('Position')" 
                                :rules="[rules.required]" 
                                outlined dense hide-details clearable
                                ></v-autocomplete>
                                
                                
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-autocomplete
                                v-model="demand.sub_position"
                                :items="localizedSubPositionItems"
                                item-text="text"
                                item-value="en"
                                :label="$t('Sub Position')"
                                outlined
                                dense
                                hide-details="auto"
                                :disabled="!['Staff', 'Staff (lang)', 'Translator'].includes(demand.position)"
                                :hint="getSubPositionHint"
                                persistent-hint
                                clearable
                                ></v-autocomplete>
                                
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="demand.quantity" :label="$t('Quantity') "
                                :rules="[rules.required, rules.number]" outlined dense hide-details
                                type="number" min="1"  clearable></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    
                    <!-- Dates Section -->
                    <v-col cols="12">
                        <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">{{ $t("Time Period") }}
                        </div>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-menu v-model="dateCreate" :close-on-content-click="false"
                                transition="scale-transition" max-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="createoDate" :label="$t('Start date')" readonly
                                    outlined dense hide-details v-bind="attrs" v-on="on"
                                    prepend-inner-icon="mdi-calendar-plus" clearable
                                    @click:clear="createoDate = ''"></v-text-field>
                                </template>
                                <v-date-picker v-model="createoDate" @input="dateCreate = false"
                                color="teal darken-4"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-menu v-model="date" :close-on-content-click="false"
                            transition="scale-transition" max-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fromDate" :label="$t('On hold start') " readonly
                                outlined dense hide-details v-bind="attrs" v-on="on"
                                prepend-inner-icon="mdi-calendar-start" clearable
                                @click:clear="fromDate = ''"></v-text-field>
                            </template>
                            <v-date-picker v-model="fromDate" @input="date = false"
                            color="teal darken-4"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-menu v-model="dateTo" :close-on-content-click="false"
                        transition="scale-transition" max-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="toDate" :label="$t('On hold end')" readonly outlined
                            dense hide-details v-bind="attrs" v-on="on"
                            prepend-inner-icon="mdi-calendar-end" clearable
                            @click:clear="toDate = ''"></v-text-field>
                        </template>
                        <v-date-picker v-model="toDate" @input="dateTo = false"
                        color="teal darken-4" :min="fromDate"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu v-model="s_fullfiledate" :close-on-content-click="false"
                    transition="scale-transition" max-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="fullfilldate" :label="$t('Full filled date')" readonly
                        outlined dense hide-details v-bind="attrs" v-on="on"
                        prepend-inner-icon="mdi-calendar-plus" clearable
                        @click:clear="fullfilldate = ''"></v-text-field>
                    </template>
                    <v-date-picker v-model="fullfilldate" @input="s_fullfiledate = false"
                    color="teal darken-4"></v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
    </v-col>
    <!-- Note Section -->
    <v-col cols="12">
        <!-- <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">{{ $t("Additional Information")}}
        </div> -->
        <v-textarea v-model="demand.content" :label="$t('Content') " outlined auto-grow
        hide-details="auto" rows="3" clearable></v-textarea>
    </v-col>
</v-row>
</v-form>
</v-card-text>
<v-divider></v-divider>
<v-card-actions class="pa-6">
    <v-btn color="error" @click="showDialog = false" class="px-6" :disabled="loading" elevation="2">
        <v-icon left>mdi-close</v-icon>
        {{ $t("Cancel") }}
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn color="success" @click="saveDemand" class="px-6" :loading="loading" elevation="2">
        <v-icon left>mdi-content-save</v-icon>
        {{ $t("Save") }}
    </v-btn>
</v-card-actions>
</v-card>
</v-dialog>

<!-- Note Detail Dialog -->
<v-dialog v-model="noteDialog" max-width="700">
    <v-card>
        <v-card-title class="text-h5" style="background-color: #00796b; color: white">
            <span>{{ $t("Note Details") }}</span>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="selectedLanguage" group class="mr-4" dark @change="helpTrans">
                <v-btn x-small value="vi">VI</v-btn>
                <v-btn x-small value="en">EN</v-btn>
                <v-btn x-small value="cn">中文</v-btn>
            </v-btn-toggle>
            <v-btn icon dark @click="noteDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
            <div class="note-content" style="white-space: pre-wrap;">
                {{ displayedNote }}
            </div>
        </v-card-text>
    </v-card>
</v-dialog>

<!-- Candidates Detail Dialog -->
<v-dialog v-model="candidatesDialog" max-width="700">
    <v-card>
        <v-card-title class="teal darken-4 white--text">
            <span>{{ $t("Candidates Details") }}</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="candidatesDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
            <v-data-table :headers="candidateHeaders" :items="parsedCandidates" :items-per-page="5" 
            class="elevation-3 data-table"  :footer-props="{'items-per-page-options': [10, 15, 30, 100],
            'show-current-page': true,'show-first-last-page': true }">
            <template v-slot:[`item.empno`]="{ item }">
                <div class="d-flex align-center">
                    {{ item.empno }}
                </div>
            </template>
            <template v-slot:[`item.name`]="{ item }">
                <div class="d-flex align-center">
                    {{ item.name }}
                </div>
            </template>
            <template v-slot:[`item.date`]="{ item }">
                <div class="d-flex align-center">
                    {{ formatDate(item.date) }}
                </div>
            </template>
            
        </v-data-table>
    </v-card-text>
</v-card>
</v-dialog>

<!-- Add this confirmation dialog -->
<v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
        <v-card-title class="text-h5">{{ $t('Warning') }}</v-card-title>
        <v-card-text>{{ $t('Do you want to delete this demand?') }}</v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="confirmDialog = false">
                {{ $t('Cancel') }}
            </v-btn>
            <v-btn color="red darken-1" text @click="confirmDelete">
                {{ $t('OK') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Column Selection Dialog -->
<v-dialog v-model="showColumnDialog" max-width="500">
    <v-card>
        <v-card-title class="teal darken-4 white--text">
            {{ $t('Column Settings') }}
            <v-spacer></v-spacer>
            <v-btn icon dark @click="showColumnDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        
        <v-card-text class="pt-4">
            <v-row>
                <v-col cols="12">
                    <v-btn-toggle v-model="selectAllColumns" dense class="mb-3">
                        <v-btn small @click="toggleAllColumns(true)">{{ $t('Select All') }}</v-btn>
                        <v-btn small @click="toggleAllColumns(false)">{{ $t('Deselect All') }}</v-btn>
                    </v-btn-toggle>
                </v-col>
                <v-col cols="6" v-for="header in headers" :key="header.value">
                    <v-checkbox
                    v-model="selectedColumns"
                    :label="$t(header.text)"
                    :value="header.value"
                    :disabled="header.value === 'actions'"
                    hide-details
                    dense
                    class="mt-0"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-card-text>
        
        <v-card-actions class="pb-4 px-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showColumnDialog = false">
                {{ $t('Done') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Add this Cancel Date Dialog -->
<v-dialog v-model="cancelDialog" max-width="500">
    <v-card>
        <v-card-title class="teal darken-4 white--text">
            {{ $t('Cancel Demand') }}
            <v-spacer></v-spacer>
            <v-btn icon dark @click="cancelDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
            <v-menu v-model="showCancelDatePicker" :close-on-content-click="false" transition="scale-transition" max-width="290px" >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    v-model="selectedCancelDate"
                    :label="$t('Cancel Date')"
                    readonly
                    outlined
                    dense
                    hide-details
                    class="mb-4"
                    v-bind="attrs"
                    v-on="on"
                    prepend-inner-icon="mdi-calendar"
                    clearable
                    @click:clear="selectedCancelDate = ''"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="selectedCancelDate" @input="showCancelDatePicker = false" color="teal darken-4" ></v-date-picker>
            </v-menu>
            <v-textarea v-model="cancelReason" :label="$t('Cancel Reason')" outlined hide-details="auto" rows="3" counter prepend-inner-icon="mdi-text-box" clearable ></v-textarea>
        </v-card-text>
        <v-card-actions class="pb-4 px-4">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="cancelDialog = false" :disabled="loading">
                {{ $t('Cancel') }}
            </v-btn>
            <v-btn color="success" @click="updateCancelDate" :loading="loading">
                {{ $t('Update') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</v-row>
</template>

<script>
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import DSFilter from '@/components/DsFilter.vue'
export default {
    components: { DSFilter },
    head: {
        title: 'Demand Management'
    },
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            demand: {
                id_code: '',
                department: '',
                sub_department: '',
                sub_division: '',
                position: '',
                sub_position: '',
                quantity: '',
                content: ''
            },
            // itemsDept: [],
            itemsPos: [
            { vi: 'Tất cả', en: 'All', cn: '所有' },
            { vi: 'Công nhân', en: 'Worker', cn: '工人' },
            { vi: 'Nhân viên', en: 'Staff', cn: '課員' },
            { vi: 'Nhân viên (ngôn ngữ)', en: 'Staff (lang)', cn: '语言課員' },
            { vi: 'Cán bộ', en: 'Leader', cn: '干部' },
            { vi: 'Phiên dịch', en: 'Translator', cn: '翻译' },
            { vi: 'Kỹ sư', en: 'Engineer', cn: '工程师' }
            ],
            
            itemsSub_staff: [
            { vi: 'Trợ lý nhân sự', en: 'HR Assistant', cn: '人力助理' },
            { vi: 'Trợ lý sản xuất', en: 'Prod assistant', cn: '生产助理' },
            { vi: 'Bảo trì', en: 'Maintenance', cn: '维护' },
            { vi: 'Kỹ thuật', en: 'Technical', cn: '技术' },
            { vi: 'Nhân viên', en: 'Officer', cn: '課員' }
            ], 
            
            itemsSub_Pos: [  
            { vi: 'Trợ lý nhân sự', en: 'HR Assistant', cn: '人力助理' },
            { vi: 'Trợ lý sản xuất', en: 'Prod assistant', cn: '生产助理' },
            { vi: 'Bảo trì', en: 'Maintenance', cn: '维护' },
            { vi: 'Kỹ thuật', en: 'Technical', cn: '技术' },
            { vi: 'Nhân viên', en: 'Officer', cn: '課員' }
            ],
            
            itemsSub_Pos_cn: [
            { vi: 'Tiếng Trung 2 kỹ năng', en: 'Chinese 2 Skills', cn: '中文2技能' },
            { vi: 'Tiếng Trung 4 kỹ năng', en: 'Chinese 4 Skills', cn: '中文4技能' },
            { vi: 'Tiếng Anh 2 kỹ năng', en: 'English 2 Skills', cn: '英文2技能' },
            { vi: 'Tiếng Anh 4 kỹ năng', en: 'English 4 Skills', cn: '英文4技能' }
            ],
            headers: [
            { text: 'ID', value: 'id_code' },
            // { text: 'Division', value: 'dem_dept'},
            // { text: 'Dept', value: 'dem_sub_department' },
            { text: 'Unit code', value: 'dem_unit' },
            { text: 'Unit name', value: 'dem_unit_name' },
            { text: 'Position', value: 'dem_position' },
            { text: 'Sub Position', value: 'dem_sub_position' },
            { text: 'Amount', value: 'dem_amount',align:"center" },
            { text: 'Request date', value: 'dem_inputdate' },
            { text: 'Status', value: 'dem_status' },
            { text: 'Recruited', value: 'dem_recruited', align:"center"},
            { text: 'Full filled', value: 'dem_fulfilled',  },
            { text: 'Full filled date', value: 'dem_fullfilldate',},
            { text: 'Still in need', value: 'stocknumber', align:"center" },
            { text: 'Candidates', value: 'dem_candidates', align:"center"},
            { text: 'Note', value: 'dem_note', sortable: false },
            { text: 'On hold start', value: 'dem_pause_start_at' },
            { text: 'On hold end', value: 'dem_pause_end_at' },
            { text: 'Cancel date', value: 'dem_cancel_date' },
            { text: 'Action', value: 'actions', }
            ],
            
            showDialog: false,
            date: false,
            dateTo: false,
            fromDate: '',
            toDate: '',
            loading: false,
            search: '',
            demandRules: {
                required: v => !!v || 'This field is required',
                number: v => Number.isInteger(Number(v)) && Number(v) > 0 || 'Must be a positive number'
            },
            createoDate: dayjs().format('YYYY-MM-DD'),
            dateCreate: false,
            demandData: [],
            dept: [],
            id: '',
            noteDialog: false,
            candidatesDialog: false,
            selectedCandidates: '',
            selectDept: '',
            itemsSelectDept: [], // giữ nguyên để tương thích với code cũ
            itemsSelectUnit: [], // giữ nguyên để tương thích với code cũ
            departmentData: [], // thêm mới để lưu trữ cấu trúc dữ liệu phòng ban
            itemsDiv: [], // thêm mới để lưu trữ cấu trúc dữ liệu đơn vị
            selectedPositions: [],
            originalDemandData: [],
            parsedCandidates: [],
            candidateHeaders: [
            { text: 'Empno', value: 'empno', align: 'start' },
            { text: 'Name', value: 'name' },
            { text: 'In date', value: 'date' }
            ],
            formValid: false,
            rules: {
                required: v => !!v || this.$t('This field is required'),
                number: v => (!!v && Number(v) > 0) || this.$t('Must be greater than 0')
            },
            fullfilldate: '',
            s_fullfiledate: false,
            confirmDialog: false,
            selectedItem: null,
            filters: {}, // Add this to store active filters
            filterItems: {
                dem_dept: [],
                dem_sub_department: [],
                dem_unit: [],
                dem_position: [], 
                dem_sub_position: [],
                dem_amount: [],
                dem_inputdate: [],
                dem_recruited: [],
                dem_fulfilled: ['yes', 'no'],
                dem_fullfilldate: [],
                stocknumber: [],
                dem_note: [],
                dem_candidates: [],
                dem_pause_start_at: [],
                dem_pause_end_at: [],
                dem_cancel_date: [], // Add this new filter item
                dem_status:[]
            },
            showColumnDialog: false,
            selectedColumns: [], // Will store selected column values
            selectAllColumns: null,
            selectedNote: '',
            selectedLanguage: 'vi',
            cancelDialog: false,
            showCancelDatePicker: false,
            selectedCancelDate: '',
            cancelReason: '',
            selectedDemand: null,
            dataNameDeptCode:[],
        }
    },
    computed: {
        localizedItemsPos() {
            const locale = this.$i18n.locale;
            return this.itemsPos.map(item => ({
                ...item,
                text: item[locale] || item.en
            }));
        },
        localizedSubPositionItems() {
            const locale = this.$i18n.locale;
            return this.getSubPositionItems.map(item => ({
                ...item,
                text: item[locale] || item.en
            }));
        },
        displayedNote() {
            if (!this.selectedNote) return '';
            if (typeof this.selectedNote === 'string') return this.selectedNote;
            return this.selectedNote[this.selectedLanguage] || Object.values(this.selectedNote)[0] || '';
        },
        totalSum() {
            const totals = this.headers.reduce((acc, header) => {
                acc[header.value] = 0;
                return acc;
            }, {});
            
            this.mappedDemandData.forEach(item => {
                Object.keys(totals).forEach(key => {
                    if (key === 'dem_status') {
                        return;
                    }
                    if (key === 'dem_candidates') {
                        totals[key] += this.getCandidatesCount(item[key]);
                    } else if (key === 'dem_fulfilled') {
                        // Skip adding to totals here, we'll handle it separately
                    } else {
                        totals[key] += parseInt(item[key]) || 0;
                    }
                });
            });
            
            // Calculate dem_fulfilled values
            totals['dem_fulfilled'] = {
                yes: this.countFulfilled(this.mappedDemandData, 'yes'),
                no: this.countFulfilled(this.mappedDemandData, 'no')
            };
            
            return totals;
        },
        // Add computed property to map departments
        mappedDemandData() {
            let filteredData = [...this.demandData];
            
            
            // Apply filters
            Object.entries(this.filters).forEach(([key, values]) => {
                if (values && values.length > 0) {
                    filteredData = filteredData.filter(item => {
                        if (key === 'dem_dept') {
                            return values.includes((item.dem_dept));
                        }
                        if (key === 'dem_candidates') {
                            const count = this.getCandidatesCount(item[key]);
                            return values.includes(count.toString());
                        }
                        if (key === 'dem_status') {
                            return values.includes(this.getStatusText(item));
                        }
                        else if (['dem_amount', 'stocknumber'].includes(key)) {
                            return values.includes(item[key].toString());
                        }
                        return values.includes(item[key]);
                    });
                }
            });
            if (this.selectDept) {
                const deptId = (this.selectDept);
                filteredData = filteredData.filter(item =>
                (item.dem_dept) === deptId
                );
            }
            if (this.selectedPositions.length > 0 && !this.selectedPositions.includes('All')) {
                filteredData = filteredData.filter(item =>
                this.selectedPositions.includes(item.dem_position)
                );
            }
            // Nếu có 'All' thì không lọc theo vị trí, tức lấy toàn bộ dữ liệu filteredData mà thôi
            
            
            return filteredData.map(item => ({
                ...item,
                dem_unit_name: this.getUnitName(item.dem_unit),
                dem_position_name: this.getLocalizedItem(this.itemsPos, item.dem_position),
                dem_sub_position_name: this.getSubPositionLocalizedName(item.dem_position, item.dem_sub_position)
            }));
        },
        getSubPositionItems() {
            switch (this.demand.position) {
                case 'Staff':
                return this.itemsSub_staff;
                case 'Staff (lang)' || 'Staff':
                return this.itemsSub_Pos;
                case 'Translator':
                return this.itemsSub_Pos_cn;
                default:
                return [];
            }
        },
        getSubPositionHint() {
            if (!['Staff', 'Staff (lang)', 'Translator'].includes(this.demand.position)) {
                return this.$t('Only available for Staff, Staff (lang) and Translator');
            }
            return '';
        },
        filteredUnits() {
            if (!this.demand.department) return [];
            
            const selectedDept = this.departmentData.find(
            dept => dept.department === this.demand.department
            );
            return selectedDept ? selectedDept.units.map(unit => unit.name) : [];
        },
        filteredSubUnits() {
            if (!this.demand.department || !this.demand.sub_department) return [];
            
            const selectedDept = this.departmentData.find(
            dept => dept.department === this.demand.department
            );
            
            if (!selectedDept) return [];
            
            const selectedUnit = selectedDept.units.find(
            unit => unit.name === this.demand.sub_department
            );
            
            return selectedUnit ? selectedUnit.sub_units : [];
        },
        visibleHeaders() {
            return this.headers.filter(header => 
            this.selectedColumns.includes(header.value) || header.value === 'actions'
            );
        }
        
    },
    methods: {
        getStatusText(item) {
            const locale = this.$i18n.locale;
            let statusKey = 'closed'; // Mặc định là "結案"
            
            if (item.dem_pause_start_at && item.dem_pause_start_at.trim() !== '' &&
            (!item.dem_pause_end_at || item.dem_pause_end_at.trim() === '')) {
                statusKey = 'on_hold'; // 暫停招募
            }
            else if ((!item.dem_cancel_date || item.dem_cancel_date.trim() === '') &&
            (item.dem_fulfilled?.toLowerCase() === 'no')) {
                statusKey = 'recruiting'; // 招募中
            }
            const statusLabels = {
                en: {
                    on_hold: 'On Hold',
                    recruiting: 'Recruiting',
                    closed: 'Closed'
                },
                vi: {
                    on_hold: 'Tạm dừng tuyển dụng',
                    recruiting: 'Đang tuyển',
                    closed: 'Đã kết thúc'
                },
                cn: {
                    on_hold: '暫停招募',
                    recruiting: '招募中',
                    closed: '結案'
                }
            };
            
            return (statusLabels[locale] && statusLabels[locale][statusKey]) || statusLabels['en'][statusKey];
        },
        getLocalizedItem(arr, value) {
            const currentLocale = this.$i18n.locale;
            const item = arr.find(i => i.en === value || i.vi === value || i.cn === value);
            if (item) {
                return item[currentLocale] || item.en; 
            }
            return value; 
        },
        getSubPositionLocalizedName(position, subPosition) {
            const currentLocale = this.$i18n.locale;
            if (position === 'Translator') {
                const item = this.itemsSub_Pos_cn.find(i => i.en === subPosition || i.vi === subPosition || i.cn === subPosition);
                return item ? item[currentLocale] || item.en : subPosition;
            } else if (['Staff', 'Staff (lang)'].includes(position)) {
                const item = this.itemsSub_Pos.find(i => i.en === subPosition || i.vi === subPosition || i.cn === subPosition);
                return item ? item[currentLocale] || item.en : subPosition;
            }
            return subPosition;
        },
        // get all data dataDeptCode
        async getDataNameDeptCode() {
            try {
                const res = await this.$axios.get(this.api + 'getDataNameDeptCode');
                this.dataNameDeptCode = res.data.dataNameDeptCode;
            } catch (error) {
                console.error("Error fetching department data:", error);
            }
        },
        
        async helpTrans(target) {
            if (!this.selectedNote) return;
            
            try {
                if (typeof this.selectedNote === 'string') {
                    const currentLocale = this.$i18n.locale;
                    this.selectedNote = {
                        [currentLocale]: this.selectedNote
                    };
                }
                let sourceText;
                let sourceLocale;
                
                const availableLocales = Object.keys(this.selectedNote);
                sourceLocale = availableLocales.find(locale => locale !== target) || target;
                sourceText = this.selectedNote[sourceLocale];
                if (!sourceText || availableLocales.length === 1) {
                    sourceText = Object.values(this.selectedNote)[0];
                }
                
                let code = '';
                switch (target) {
                    case 'vi':
                    code = 'secret-v';
                    break;
                    case 'en':
                    code = 'secret-e';
                    break;
                    case 'cn':
                    code = 'secret-c';
                    break;
                    default:
                    return;
                }
                
                const formData = new FormData();
                formData.append("type", code);
                formData.append("string", sourceText);
                
                const response = await this.$axios.post(
                "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
                formData
                );
                
                if (response.status === 200) {
                    // Update the translation while preserving others
                    this.selectedNote = {
                        ...this.selectedNote,
                        [target]: response.data
                    };
                }
            } catch (error) {
                console.error("Translation error:", error);
                this.$notify({
                    title: this.$t("error"),
                    text: error.message || this.$t('Translation failed'),
                    type: 'error'
                });
            }
        },
        
        async showNoteDialog(item) {
            try {
                if (typeof item.dem_note === 'string') {
                    const currentLocale = this.$i18n.locale;
                    this.selectedNote = {
                        [currentLocale]: item.dem_note
                    };
                } else {
                    this.selectedNote = item.dem_note;
                }
                
                this.selectedLanguage = this.$i18n.locale;
                this.noteDialog = true;
                const languages = ['vi', 'en', 'cn'];
                for (const lang of languages) {
                    await this.helpTrans(lang);
                }
            } catch (error) {
                console.error("Error showing note:", error);
                this.$notify({
                    title: this.$t("Error"),
                    text: this.$t("Error loading note"),
                    type: 'error'
                });
            }
        },
        countFulfilled(data, value) {
            return data.filter(item => item.dem_fulfilled === value).length;
        },
        
        getDepartmentId(deptName) {
            const department = this.dept.find(d => d.department === deptName);
            return department ? department.id : null;
        },
        getCandidatesCount(candidates) {
            try {
                const parsedCandidates = JSON.parse(candidates || '[]');
                return parsedCandidates.length;
            } catch (error) {
                console.error("Error parsing candidates:", error);
                return 0;
            }
        },
        getUnitName(demUnit) {
            const unit = this.dataNameDeptCode.find(item => item.dept_code === demUnit);
            if (unit) {
                try {
                    const nameObj = JSON.parse(unit.name);
                    const currentLocale = this.$i18n.locale;
                    return nameObj[currentLocale]; 
                } catch (error) {
                    console.error("JSON parse error:", error);
                    return ""; 
                }
            }
            return ""; 
        },
        async fetchDemand() {
            this.loading = true;
            try {
                const res = await this.$axios.get(this.api + 'getAllDemandData');
                this.demandData = res.data;
                this.originalDemandData = [...res.data];
                this.originalDemandData.forEach(item => {
                    item.dem_unit_name = this.getUnitName(item.dem_unit);
                });
                this.updateFilterItems(); // Update filter items after fetching data
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        async editItem(item) {
            this.id = item.id;
            this.demand.id_code = item.id_code;
            this.demand.department = (item.dem_dept);
            await this.$nextTick();
            
            this.demand.sub_department = item.dem_sub_department;
            await this.$nextTick();
            this.demand = {
                ...this.demand,
                id: item.id,
                id_code: item.id_code,
                position: item.dem_position,
                sub_position: item.dem_sub_position,
                quantity: item.dem_amount,
                content: item.dem_note,
                sub_division: item.dem_unit
            };
            
            this.fromDate = item.dem_pause_start_at;
            this.toDate = item.dem_pause_end_at;
            this.createoDate = dayjs(item.dem_inputdate).format('YYYY-MM-DD');
            this.fullfilldate = item.dem_fullfilldate;
            
            this.showDialog = true;
        },
        async deleteItem(item) {
            this.selectedItem = item;
            this.confirmDialog = true;
        },
        
        async confirmDelete() {
            if (!this.selectedItem) return;
            
            try {
                this.loading = true;
                this.confirmDialog = false;
                const res = await this.$axios.post(this.api + 'deleteDemandById', {
                    id: this.selectedItem.id
                });
                
                if (res.status === 200) {
                    this.$notify({
                        title: 'Success',
                        text: this.$t('Demand deleted successfully'),
                        type: 'success'
                    });
                    this.fetchDemand();
                }
            } catch (error) {
                console.error("Error deleting demand:", error);
                this.$notify({
                    title: 'Error',
                    text: error.response?.data?.message || this.$t('Failed to delete demand'),
                    type: 'error' 
                });
            } finally {
                this.loading = false;
                this.selectedItem = null;
            }
        },
        updateFulfilled(value, item) {
            item.dem_fulfilled = value ? 'yes' : 'no';
        },
        async getAllDept() {
            try {
                const response = await this.$axios.get(this.api + 'getDataDeptCode');
                this.dept = response.data.dataDeptCode;
                
                const deptMap = new Map();
                
                // Bước 1: Thu thập tất cả departments, bất kể end_date
                this.dept.forEach(item => {
                    if (!deptMap.has(item.department)) {
                        deptMap.set(item.department, {
                            department: item.department,
                            units: new Map(),
                        });
                    }
                    
                    const deptData = deptMap.get(item.department);
                    if (!deptData.units.has(item.sub_department)) {
                        deptData.units.set(item.sub_department, new Set());
                    }
                    if (!item.end_date && item.sub_division) {
                        deptData.units.get(item.sub_department).add(item.sub_division);
                    }
                });
                this.departmentData = Array.from(deptMap.values()).map(dept => ({
                    department: dept.department,
                    units: Array.from(dept.units.entries()).map(([unitName, subUnits]) => ({
                        name: unitName,
                        sub_units: Array.from(subUnits)
                    })),
                }));
                this.itemsSelectDept = this.departmentData.map(dept => dept.department);
                
            } catch (error) {
                console.error("Error fetching department data:", error);
            }
        },
        updateSubUnits() {
            if (this.demand.department && this.demand.sub_department) {
                const dept = this.departmentData.find(d => d.department === this.demand.department);
                if (dept) {
                    const unit = dept.units.find(u => u.name === this.demand.sub_department);
                    if (unit) {
                        this.itemsDiv = unit.sub_units;
                        return;
                    }
                }
            }
            this.itemsDiv = [];
        },
        resetForm() {
            // Reset demand object
            this.demand = {
                id_code: '',
                department: '',
                sub_department: '',
                sub_division: '',
                position: '',
                sub_position: '',
                quantity: '',
                content: ''
            };
            
            // Reset dates
            this.fromDate = '';
            this.toDate = '';
            this.createoDate = dayjs().format('YYYY-MM-DD');
            this.fullfilldate = '';
            
            // Reset ID
            this.id = '';
            
            // Reset form validation
            if (this.$refs.form) {
                this.$refs.form.reset();
            }
        },
        
        async saveDemand() {
            if (!this.$refs.form.validate()) {
                this.$notify({
                    title: 'Please fill all required fields',
                    text: this.$t('Please fill all required fields'),
                    type: 'error'
                });
                return;
            }
            let data = {
                id: this.id,
                id_code: this.demand.id_code,
                dem_dept:this.demand.department,
                dem_sub_department: this.demand.sub_department,
                dem_unit: this.demand.sub_division,
                dem_position: this.demand.position,
                dem_sub_position: this.demand.sub_position,
                dem_amount: this.demand.quantity,
                dem_inputdate: this.createoDate,
                dem_pause_start_at: this.fromDate,
                dem_pause_end_at: this.toDate,
                dem_note: this.demand.content,
                dem_fullfilldate: this.fullfilldate,
            };
            try {
                this.loading = true;
                const res = await this.$axios.post(this.api + 'addDemand', data);
                if (res.status === 200) {
                    this.$notify({
                        title: 'Demand',
                        text: 'Demand saved successfully',
                        type: 'success'
                    });
                    this.showDialog = false;
                    this.fetchDemand();
                    this.resetForm(); // Add this line to reset the form
                }
            } catch (error) {
                console.error("Error saving demand:", error);
            } finally {
                this.loading = false;
            }
            
        },
        formatDate(date) {
            return date ? dayjs(date).format('YYYY-MM-DD') : '';
        },
        filterData() {
            if (!this.selectDept) {
                // Reset to original data if no department selected
                this.demandData = [...this.originalDemandData];
                
            } else {
                // Filter by selected department
                this.demandData = this.originalDemandData.filter(item => {
                    return item.dem_dept === this.selectDept;
                });
            }
        },
        handlePositionSelect(positionEn) {
            const allPosWithoutAll = this.itemsPos.filter(pos => pos.en !== 'All').map(pos => pos.en);
            
            if (positionEn === 'All') {
                this.selectedPositions = ['All'];
            } else {
                let newSelection = [...this.selectedPositions];
                if (newSelection.includes('All')) {
                    newSelection = [];
                }
                
                if (newSelection.includes(positionEn)) {
                    newSelection = newSelection.filter(p => p !== positionEn);
                    if (newSelection.length === 0) {
                        newSelection = ['All'];
                    }
                } else {
                    newSelection.push(positionEn);
                    const allSelected = allPosWithoutAll.every(pos => newSelection.includes(pos));
                    if (allSelected) {
                        newSelection = ['All'];
                    }
                }
                this.selectedPositions = newSelection;
            }
        },
        exportToExcel() {
            // Lấy dữ liệu đã lọc và đã map (đã có trường tiếng Việt/Anh/Trung phù hợp)
            const exportData = this.mappedDemandData.map(item => ({
                'ID': item.id_code,
                'Mã đơn vị': item.dem_unit,
                'Tên đơn vị': item.dem_unit_name,            // dùng đã map trong computed
                'Vị trí': item.dem_position_name,             // map có dịch
                'Vị trí phụ': item.dem_sub_position_name,     // map có dịch
                'Số lượng': item.dem_amount,
                'Ngày yêu cầu': item.dem_inputdate,
                'Đã tuyển': item.dem_recruited,
                'Hoàn thành': item.dem_fulfilled,
                'Ngày hoàn thành': item.dem_fullfilldate,
                'Trạng Thái': this.getStatusText(item), 
                'Còn thiếu': item.stocknumber,
                'Ứng viên': this.getCandidatesCount(item.dem_candidates),
                'Ghi chú': item.dem_note,
                'Tạm dừng bắt đầu': item.dem_pause_start_at,
                'Tạm dừng kết thúc': item.dem_pause_end_at,
                'Ngày hủy': item.dem_cancel_date ? (() => {
                    try {
                        const cancelData = JSON.parse(item.dem_cancel_date);
                        return `${cancelData.date || ''} ${cancelData.reason ? `(${cancelData.reason})` : ''}`;
                    } catch (e) {
                        return item.dem_cancel_date;
                    }
                })() : '',
            }));
            
            // Tiêu đề 2 dòng: dòng 1 tiếng Việt, dòng 2 tiếng Trung theo thứ tự cột
            const headersVI = ['ID',  'Mã đơn vị', 'Tên đơn vị', 'Vị trí', 'Vị trí phụ', 'Số lượng', 'Ngày yêu cầu', 'Đã tuyển', 'Hoàn thành', 'Ngày hoàn thành', 'Trạng Thái', 'Còn thiếu', 'Ứng viên', 'Ghi chú', 'Tạm dừng bắt đầu', 'Tạm dừng kết thúc', 'Ngày hủy'];
            
            const headersCN = ['人員增補單編號', '單位代號', '單位名稱', '職位', '子職位', '需求人數', '申請日', '入職人數', '已招滿', '招滿日', '招募狀態', '待招募', '應徵者', '備註', '暫停起始日', '暫停結束日', '取消日'];
            
            
            // Tạo sheet trống và thêm 2 dòng tiêu đề
            const ws = XLSX.utils.aoa_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, [headersVI], { origin: 'A1' });
            XLSX.utils.sheet_add_aoa(ws, [headersCN], { origin: 'A2' });
            
            // Map dữ liệu thành mảng mảng theo thứ tự tiêu đề dòng 1
            const dataRows = exportData.map(row => headersVI.map(header => row[header] || ''));
            
            // Ghi dữ liệu bắt đầu từ dòng 3
            XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A3' });
            
            // Tạo workbook mới, append sheet, xuất file
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Demand Report');
            
            const fileName = `demand_report_${dayjs().format('YYYY-MM-DD')}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            this.$notify({
                title: 'Successfully',
                text: 'Excel file exported successfully',
                type: 'success'
            });
        },
        showCandidatesDialog(candidates) {
            try {
                this.parsedCandidates = JSON.parse(candidates || '[]');
                if (this.parsedCandidates.length > 0) {
                    this.candidatesDialog = true;
                } else {
                    this.$notify({
                        title: 'No Candidates',
                        text: 'No candidates data available',
                        type: 'info'
                    });
                }
            } catch (error) {
                this.$notify({
                    title: 'Error',
                    text: 'Error loading candidates data',
                    type: 'error'
                });
            }
        },
        updateFilter(filterName, values) {
            if (values && values.length) {
                this.$set(this.filters, filterName, values);
            } else {
                this.$delete(this.filters, filterName);
            }
        },
        updateFilterItems() {
            this.demandData.forEach(item => {
                const deptName = (item.dem_dept);
                if (!this.filterItems.dem_dept.includes(deptName)) {
                    this.filterItems.dem_dept.push(deptName);
                }
                
                if (!this.filterItems.dem_sub_department.includes(item.dem_sub_department)) {
                    this.filterItems.dem_sub_department.push(item.dem_sub_department);
                }
                
                if (!this.filterItems.dem_unit.includes(item.dem_unit)) {
                    this.filterItems.dem_unit.push(item.dem_unit);
                }
                
                if (!this.filterItems.dem_position.includes(item.dem_position)) {
                    this.filterItems.dem_position.push(item.dem_position);
                }
                
                if (!this.filterItems.dem_sub_position.includes(item.dem_sub_position)) {
                    this.filterItems.dem_sub_position.push(item.dem_sub_position);
                }
                
                if (!this.filterItems.dem_amount.includes(item.dem_amount.toString())) {
                    this.filterItems.dem_amount.push(item.dem_amount.toString());
                }
                
                if (!this.filterItems.dem_inputdate.includes(item.dem_inputdate)) {
                    this.filterItems.dem_inputdate.push(item.dem_inputdate);
                }
                
                if (!this.filterItems.dem_recruited.includes(item.dem_recruited?.toString())) {
                    this.filterItems.dem_recruited.push(item.dem_recruited?.toString());
                }
                
                if (!this.filterItems.dem_fullfilldate.includes(item.dem_fullfilldate)) {
                    this.filterItems.dem_fullfilldate.push(item.dem_fullfilldate);
                }
                
                if (!this.filterItems.stocknumber.includes(item.stocknumber?.toString())) {
                    this.filterItems.stocknumber.push(item.stocknumber?.toString());
                }
                
                if (!this.filterItems.dem_pause_start_at.includes(item.dem_pause_start_at)) {
                    this.filterItems.dem_pause_start_at.push(item.dem_pause_start_at);
                }
                
                if (!this.filterItems.dem_pause_end_at.includes(item.dem_pause_end_at)) {
                    this.filterItems.dem_pause_end_at.push(item.dem_pause_end_at);
                }
                const statusText = this.getStatusText(item);
                if (!this.filterItems.dem_status.includes(statusText)) {
                    this.filterItems.dem_status.push(statusText);
                }
                
                
                const candidatesCount = this.getCandidatesCount(item.dem_candidates).toString();
                if (!this.filterItems.dem_candidates.includes(candidatesCount)) {
                    this.filterItems.dem_candidates.push(candidatesCount);
                }
                
                
                // Add this new block to handle dem_cancel_date
                if (item.dem_cancel_date) {
                    try {
                        const cancelData = JSON.parse(item.dem_cancel_date);
                        if (cancelData.date && !this.filterItems.dem_cancel_date.includes(cancelData.date)) {
                            this.filterItems.dem_cancel_date.push(cancelData.date);
                        }
                    } catch (e) {
                        console.error('Error parsing cancel date:', e);
                    }
                }
            });
            
            ['dem_amount', 'stocknumber', 'dem_candidates'].forEach(key => {
                this.filterItems[key].sort((a, b) => Number(a) - Number(b));
            });
            
            ['dem_inputdate','dem_cancel_date', 'dem_fullfilldate', 'dem_pause_start_at', 'dem_pause_end_at'].forEach(key => {
                this.filterItems[key].sort();
            });
            
            Object.keys(this.filterItems).forEach(key => {
                this.filterItems[key] = this.filterItems[key].filter(item => item != null && item !== '');
            });
            
            this.filterItems.dem_dept.sort();
        },
        toggleAllColumns(value) {
            if (value) {
                this.selectedColumns = this.headers
                .filter(header => header.value !== 'actions')
                .map(header => header.value);
            } else {
                this.selectedColumns = ['id', 'dem_dept']; // Keep minimum required columns
            }
        },
        async handleDemandFromReport() {
            if (this.$route.query.id) {
                try {
                    const response = await this.$axios.post(
                    this.api + 'getDataByDemandFromRecruitReport', 
                    { id: this.$route.query.id }
                    );
                    if (response.data.success) {
                        this.demandData = [response.data.data];
                        this.originalDemandData = [response.data.data];
                        this.updateFilterItems();
                        this.demand = {
                            department: (response.data.data.dem_dept),
                            sub_department: response.data.data.dem_sub_department,
                            sub_division: response.data.data.dem_unit,
                            position: response.data.data.dem_position,
                            sub_position: response.data.data.dem_sub_position,
                            quantity: response.data.data.dem_amount,
                            content: response.data.data.dem_note
                        };
                        
                        this.fromDate = response.data.data.dem_pause_start_at;
                        this.toDate = response.data.data.dem_pause_end_at;
                        this.createoDate = response.data.data.dem_inputdate;
                        this.fullfilldate = response.data.data.dem_fullfilldate;
                        return;
                    } else {
                        throw new Error(response.data.message || 'Failed to load demand data');
                    }
                } catch (error) {
                    console.error('Error fetching demand:', error);
                    this.$notify({
                        title: 'Error',
                        text: error.response?.data?.message || 'Failed to load demand data',
                        type: 'error'
                    });
                }
            }
            this.fetchDemand();
        },
        // Add new methods
        async handleCancelDateClick(item) {
            this.selectedDemand = item;
            // Parse existing cancel date if it exists
            if (item.dem_cancel_date) {
                try {
                    const cancelData = JSON.parse(item.dem_cancel_date);
                    this.selectedCancelDate = cancelData.date || '';
                    this.cancelReason = cancelData.reason || '';
                } catch (e) {
                    this.selectedCancelDate = '';
                    this.cancelReason = '';
                }
            } else {
                this.selectedCancelDate = '';
                this.cancelReason = '';
            }
            this.cancelDialog = true;
        },
        
        async updateCancelDate() {
            if (!this.selectedDemand) return;
            
            try {
                this.loading = true;
                const cancelData = {
                    date: this.selectedCancelDate,
                    reason: this.cancelReason
                };
                
                const response = await this.$axios.post(this.api + 'updateCancelDate', {
                    id: this.selectedDemand.id,
                    dem_cancel_date: JSON.stringify(cancelData)
                });
                
                if (response.data.success) {
                    // Update local data
                    const index = this.demandData.findIndex(d => d.id === this.selectedDemand.id);
                    if (index !== -1) {
                        this.$set(this.demandData[index], 'dem_cancel_date', JSON.stringify(cancelData));
                    }
                    
                    this.$notify({
                        title: 'Success',
                        text: this.$t('Cancel date updated successfully'),
                        type: 'success'
                    });
                    this.cancelDialog = false;
                }
            } catch (error) {
                console.error('Error updating cancel date:', error);
                this.$notify({
                    title: 'Error',
                    text: this.$t('Failed to update cancel date'),
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        },
        
        // Add this computed property to format the cancel date display
        formatCancelDate(value) {
            if (!value) return '';
            try {
                const cancelData = JSON.parse(value);
                return cancelData.date || '';
            } catch (e) {
                return '';
            }
        },
    },
    watch: {
        '$i18n.locale': {
            handler(newLocale) {
                this.filterItems.dem_status = [];
                this.updateFilterItems();
                if (this.filters.dem_status) {
                    this.$delete(this.filters, 'dem_status');
                }
            },
            immediate: false
        },
        'demand.department': {
            handler(newDept) {
                const dept = this.departmentData.find(d => d.department === newDept);
                this.itemsSelectUnit = dept ? dept.units.map(u => u.name) : [];
                this.demand.sub_department = '';
                this.demand.sub_division = '';
                this.itemsDiv = [];
            },
            immediate: true
        },
        'demand.sub_department': {
            handler(newUnit) {
                this.updateSubUnits();
                this.demand.sub_division = '';
            }
        },
        '$route.query': {
            handler() {
                if (this.$route.query.id) {
                    this.handleDemandFromReport();
                }
            },
            immediate: true
        },
        
    },
    created() {
        this.selectedColumns = this.headers
        .filter(header => header.value !== 'actions')
        .map(header => header.value);
    },
    async mounted() {
        await this.getAllDept();
        await this.getDataNameDeptCode();
        if (this.$route.query.id) {
            await this.handleDemandFromReport();
        } else {
            await this.fetchDemand();
        }
    }
}
</script>

<i18n>
    {
        "en": {
            "Total": "Total",
            "Demand management": "Demand Management",
            "Search": "Search",
            "Add demand": "Add Demand",
            "Department": "Dept",
            "Position Apply": "Position Apply",
            "Division": "Div",
            "Unit code": "Unit code", 
            "Position": "Position",
            "Sub Position": "S.Position",
            "Amount": "Amount",
            "Request date": "Request Date",
            "Recruited": "Recruited",
            "Full filled": "Fulfilled",
            "Full filled date": "Fulfilled Date",
            "Still in need": "Still in Need",
            "Note": "Note",
            "Candidates": "Candidates",
            "On hold start": "On hold start",
            "On hold end": "On hold end",
            "Edit demand": "Edit Demand",
            "Basic Information": "Basic Information",
            "Time Period": "Time Period",
            "Start date": "Start Date",
            "On hold start": "Hold",
            "On hold end": "Release",
            "Additional Information": "Additional Information",
            "Content": "Content",
            "Cancel": "Cancel", 
            "Save": "Save",
            "Note Details": "Note Details",
            "Candidates Details": "Candidates Details",
            "Export excel": "Export Excel",
            "This field is required": "This field is required",
            "Must be greater than 0": "Must be greater than 0",
            "Please fill all required fields": "Please fill all required fields",
            "Only available for Staff, Staff (lang) and Translator": "Only available for Staff, Staff (lang) and Translator",
            "Warning": "Warning",
            "Do you want to delete this demand?": "Do you want to delete this demand?",
            "Failed to delete demand": "Failed to delete demand",
            "OK": "OK",
            "Success": "Success",
            "Error": "Error",
            "Demand deleted successfully": "Demand deleted successfully",
            "Error saving demand": "Error saving demand",
            "Successfully": "Successfully",
            "Excel file exported successfully": "Excel file exported successfully",
            "No Candidates": "No Candidates",
            "No candidates data available": "No candidates data available",
            "Error loading candidates data": "Error loading candidates data",
            "Cancel": "Cancel",
            "Action": "Action",
            "Column Settings": "Column Settings",
            "Select All": "Select All",
            "Deselect All": "Deselect All",
            "Done": "Done",
            "Translation failed": "Translation failed",
            "Error loading note": "Error loading note",
            "Cancel Demand": "Cancel Demand",
            "Cancel Date": "Cancel Date",
            "Cancel Reason": "Cancel Reason",
            "Update": "Update",
            "Cancel date updated successfully": "Cancel date updated successfully",
            "Failed to update cancel date": "Failed to update cancel date",
            "Set date": "Set date",
            "Quantity": "Quantity",
            "Unit name":"Unit name",
            "Status": "Status",
            "ID":"ID code",
            "Yes":"Yes"
        },
        "vi": {
            "Total": "Tổng",
            "Demand management": "Quản lý nhu cầu",
            "Search": "Tìm kiếm",
            "Add demand": "Thêm nhu cầu",
            "Department": "Bộ phận",
            "Position Apply": "Vị trí ứng tuyển",
            "Division": "Cấp sở",
            "Unit code": "Mã đơn vị",
            "Position": "Vị trí",
            "Sub Position": "Vị trí phụ",
            "Amount": "Số lượng",
            "Request date": "Ngày yêu cầu",
            "Recruited": "Đã tuyển",
            "Full filled": "Đã tuyển đủ",
            "Full filled date": "Ngày hoàn thành",
            "Still in need": "Còn thiếu",
            "Note": "Ghi chú",
            "Candidates": "Ứng viên",
            "On hold start": "Từ ngày",
            "On hold end": "Đến ngày",
            "Edit demand": "Sửa nhu cầu",
            "Basic Information": "Thông tin cơ bản",
            "Time Period": "Thời gian",
            "Start date": "Ngày bắt đầu",
            "On hold start": "Bắt đầu tạm dừng",
            "On hold end": "Kết thúc tạm dừng",
            "Additional Information": "Thông tin bổ sung",
            "Content": "Nội dung",
            "Cancel": "Hủy",
            "Save": "Lưu",
            "Note Details": "Chi tiết ghi chú",
            "Candidates Details": "Chi tiết ứng viên",
            "Export excel": "Xuất Excel",
            "This field is required": "Trường này là bắt buộc",
            "Must be greater than 0": "Phải lớn hơn 0",
            "Please fill all required fields": "Vui lòng điền đầy đủ các trường bắt buộc",
            "Only available for Staff, Staff (lang) and Translator": "Chỉ khả dụng cho Nhân viên, Nhân viên (ngôn ngữ) và Phiên dịch",
            "Warning": "Cảnh báo",
            "Do you want to delete this demand?": "Bạn có muốn xóa nhu cầu này không?",
            "Failed to delete demand": "Không thể xóa nhu cầu",
            "OK": "Đồng ý",
            "Success": "Thành công",
            "Error": "Lỗi",
            "Demand deleted successfully": "Xóa nhu cầu thành công",
            "Error saving demand": "Lỗi khi lưu nhu cầu",
            "Successfully": "Thành công",
            "Excel file exported successfully": "Xuất file Excel thành công",
            "No Candidates": "Không có ứng viên",
            "No candidates data available": "Không có dữ liệu ứng viên",
            "Error loading candidates data": "Lỗi khi tải dữ liệu ứng viên",
            "Cancel": "Hủy",
            "Action": "Hành động",
            "Column Settings": "Cấu hình cột",
            "Select All": "Chọn tất cả",
            "Deselect All": "Bỏ chọn tất cả", 
            "Done": "Xong",
            "Translation failed": "Dịch thất bại",
            "Error loading note": "Lỗi khi tải ghi chú",
            "Cancel Demand": "Hủy yêu cầu",
            "Cancel Date": "Ngày hủy",
            "Cancel Reason": "Lý do hủy",
            "Update": "Cập nhật",
            "Cancel date updated successfully": "Cập nhật ngày hủy thành công",
            "Failed to update cancel date": "Cập nhật ngày hủy thất bại",
            "Set date": "Đặt ngày",
            "Quantity": "Số lượng",
            "Unit name": "Tên đơn vị",
            "Status": "Trạng thái",
            "ID": "Mã đơn",
            "Yes": "Tuyển đủ",
            "No": "Đang tuyển"
            
            
        },
        "cn": {
            "Total": "总计",
            "Demand management": "需求管理",
            "Search": "搜索",
            "Add demand": "添加需求",
            "Department": "部",
            "Position Apply": "申请职位",
            "Division": "處", 
            "Unit code": "單位代號",
            "Position": "職位",
            "Sub Position": "子職位",
            "Amount": "需求人數",
            "Request date": "申請日",
            "Recruited": "入職人數",
            "Full filled": "已招滿",
            "Full filled date": "招滿日",
            "Still in need": "待招募",
            "Note": "備註",
            "Candidates": "應徵者",
            "On hold start": "暫停起始日",
            "On hold end": "暫停結束日",
            "Edit demand": "编辑需求",
            "Basic Information": "基本信息",
            "Time Period": "时间段",
            "Start date": "开始日期",
            "On hold start": "暂停开始",
            "On hold end": "暂停结束",
            "Additional Information": "附加信息",
            "Content": "内容",
            "Cancel": "取消",
            "Save": "保存",
            "Note Details": "备注详情",
            "Candidates Details": "候选人详情",
            "Export excel": "导出Excel",
            "This field is required": "此字段为必填项",
            "Must be greater than 0": "必须大于0",
            "Please fill all required fields": "请填写所有必填字段",
            "Only available for Staff, Staff (lang) and Translator": "仅适用于职员、语言职员和翻译",
            "Warning": "警告",
            "Do you want to delete this demand?": "您要删除此需求吗？", 
            "Failed to delete demand": "删除需求失败",
            "OK": "好的",
            "Success": "成功",
            "Error": "错误",
            "Demand deleted successfully": "需求删除成功",
            "Error saving demand": "保存需求时出错",
            "Successfully": "成功",
            "Excel file exported successfully": "Excel文件导出成功",
            "No Candidates": "没有候选人",
            "No candidates data available": "没有候选人数据",
            "Error loading candidates data": "加载注释时出错",
            "Cancel": "取消",
            "Action": "操作",
            "Column Settings": "列设置",
            "Select All": "全选",
            "Deselect All": "取消全选",
            "Done": "完成",
            "Translation failed": "翻译失败",
            "Error loading note": "加载注释时出错",
            "Cancel Demand": "取消需求",
            "Cancel Date": "取消日",
            "Cancel Reason": "取消原因",
            "Update": "更新",
            "Cancel date updated successfully": "取消日期更新成功",
            "Failed to update cancel date": "更新取消日期失败",
            "Set date": "设置日期",
            "Quantity": "数量",
            "Unit name":"單位名稱",
            "Status":"招募狀態",
            "ID":"人員增補單編號",
            "Yes": "已招满",
            "No": "正在招聘"
        }
    }
</i18n>

<style scoped>
.demand-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: #f8f9fa;
}

.search-field {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    transition: all 0.3s ease;
}

.search-field:hover {
    background: rgba(255, 255, 255, 0.2);
}

.data-table {
    background: white;
    border-radius: 8px;
}

.form-card {
    border-radius: 12px !important;
    overflow: hidden;
}

.animate-button {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.animate-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 96, 100, 0.2) !important;
}

.action-icon {
    transition: all 0.2s ease;
    color: #546E7A;
}

.action-icon:hover {
    color: #004D40;
    transform: scale(1.2);
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.3s ease-in-out;
}

.dialog-bottom-transition-enter,
.dialog-bottom-transition-leave-to {
    transform: translateY(100%);
}

.note-icon {
    cursor: pointer;
    color: #1976D2;
    /* Use blue color to indicate clickable/viewable content */
    transition: all 0.2s ease;
}

.note-icon:hover {
    transform: scale(1.2);
    opacity: 0.8;
}

/* Remove old note-text-truncate styles if not used elsewhere */

.note-content {
    white-space: pre-wrap;
    /* font-size: 14px; */
    line-height: 1.6;
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
    color: #000000;
}

.candidates-text-truncate {
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    
    &:hover {
        color: #00796b;
    }
}

.candidates-content {
    white-space: pre-wrap;
    /* font-size: 14px; */
    line-height: 1.6;
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
    color: #000000;
}

.v-chip--selected {
    background-color: #00796b !important;
    color: white !important;
}

.v-simple-table {
    background: #ffffff;
    border-radius: 4px;
}

.gap-1 {
    gap: 4px;
}

.table-chip {
    font-weight: 500;
    height: 24px !important;
    transition: all 0.2s ease;
    cursor: pointer !important;
    /* Thêm cursor pointer */
}

.table-chip:hover {
    background-color: var(--v-primary-base) !important;
    color: white !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.v-data-table {
    border: 1px solid #e0e0e0;
}

.v-data-table ::v-deep .v-data-table__wrapper {
    overflow-y: auto;
    /* overflow-x: hidden;  */
}
.v-data-table ::v-deep thead th {
    font-weight: 600 !important;
    color: #004D40 !important;
    background: white;
    position: sticky;
    top: 0;
    z-index: 1;
}
.v-data-table ::v-deep thead th.text-start {
    /* font-size: 11.3px; */
    white-space: nowrap; /* Ensure text does not wrap */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Add ellipsis for overflow text */
}
.v-data-table ::v-deep tbody tr:not(.total-row):hover {
    background-color: #f3fd99 !important;
}
.total-row {
    background-color: #004D40 !important; /* teal darken-4 */
}

.total-row td {
    color: white !important;
    /* font-size: 1.1em !important; */
    border-top: 2px solid #004D40 !important; /* teal darken-3 for border */
    border-bottom: none !important;
    text-align: left !important;
}

.total-row td:first-child {
    background-color: #004D40 !important; /* slightly lighter for first column */
    text-align: center !important;
    position: sticky;
    left: 0;
    z-index: 2;
}
.total-row td span {
    display: block;
}
.action-buttons {
    display: flex;
    align-items: center;
}
.v-btn-toggle {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
.v-data-table ::v-deep thead th,
.v-data-table ::v-deep tbody td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.chip-group-search .v-chip:hover {
    background-color: #f0f4ff; /* màu nền khi hover */
    color: #ffe600; /* màu chữ khi hover */
    border-color: #ffe600; /* viền khi hover */
    cursor: pointer;
}

/* Chip khi được chọn */
.chip-group-search .v-chip.v-chip--active {
    background-color: #0180ff !important; /* màu nền khi chọn */
    color: white !important; /* chữ trắng khi chọn */
    border-color: #0180ff;
}
</style>