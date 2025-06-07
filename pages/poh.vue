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
                                        <v-col cols="12" md="4">
                                            <v-select v-model="fid" :items="['D', 'I', 'O']" label="Nike definition"
                                                outlined dense hide-details
                                                clearable></v-select>
                                        </v-col>
                                        <!-- group code -->
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="group_code" :label="$t('Group code')" outlined dense
                                                hide-details clearable></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="group_name" :label="$t('Group name')" outlined dense
                                             hide-details clearable></v-text-field>
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
                                        {{ $t("Nike definition") }}
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
                                        {{ getLocalizedName(item.name) }}
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
      search: {
        department: '',
        position: '',
        status: ''
      },
      searchText: '',
      statusOptions: ['Đang làm việc', 'Nghỉ việc'],
      headers: [
        { text: 'Mã bộ phận', value: 'code' },
        { text: 'Tên bộ phận', value: 'department' },
        { text: 'Chức vụ', value: 'position' },
        { text: 'Trạng thái', value: 'status' }
      ],
      items: [
        // Chuyển đổi dữ liệu mẫu từ bảng của bạn
        {
          code: 'TAC000VG',
          department: '志要會計部',
          position: '副課長',
          status: '間工'
        },
        // ...Thêm các dòng dữ liệu khác
      ]
    }
  },
  methods: {
    addNewItem() {
      // Xử lý thêm mới
    }
  }
}
</script>

<style scoped>
.v-data-table {
  background: white;
}
</style>
