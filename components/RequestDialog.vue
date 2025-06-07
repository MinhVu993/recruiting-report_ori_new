<template>
    <v-dialog v-model="dialog" fullscreen persistent hide-overlay
    transition="dialog-bottom-transition">
    <v-card class="request-page">
        <v-toolbar dark color="teal" >
            <v-btn icon dark @click="dialog = false" >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{$t('Create new request')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn @click="setLocale('vi')" text>VI</v-btn>
                <v-btn @click="setLocale('cn')" text>中文</v-btn>
                <v-btn @click="setLocale('en')" text class="mr-5">EN</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
            <div>
                <v-card-title class="section-title ">
                    <v-icon color="warning" size="32" class="mr-2">mdi-clipboard-list</v-icon>
                    <span class="text-h5 warning--text font-weight-medium">{{ $t('General Requirements') }}</span>
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="1">
                        <v-text-field disabled v-model="form.req_id" :label="$t('Req ID')" outlined dense hide-details ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field disabled v-model="activeUser.name" :label="$t('Name')" readonly outlined dense hide-details ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete :label="$t('Supp.Type')" outlined dense :items="suppTypeItems" v-model="form.suppType" item-text="name" item-value="id" hide-details  clearable ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="user.div" :items="itemsDiv"
                        :label="$t('Division') + '*'" outlined dense
                        hide-details class="mb-3" clearable></v-autocomplete>
                    </v-col>
                    <v-col cols="12"  md="2">
                        <v-autocomplete v-model="user.dept" :items="itemsDept"
                        :label="$t('Dept') + '*'" outlined dense
                        hide-details class="mb-3" clearable></v-autocomplete>
                    </v-col>
                    <v-col cols="12"  md="2">
                        <v-autocomplete v-model="user.unit" :items="itemUnits"
                        :label="$t('Unit') + '*'" outlined dense
                        hide-details class="mb-3"  clearable></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="1">
                        <v-autocomplete v-model="form.pos" :items="posItems" :label="$t('Type Apply')" outlined dense hide-details  item-text="name" item-value="id" clearable @change="handleTypeApplyChange" ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="1" v-if="showLevelField">
                        <v-text-field v-model="form.level" :label="$t('Level')"  outlined dense hide-details prepend-inner-icon="mdi-stairs" ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                        <v-text-field v-model="form.quantity" :label="$t('Quantity request')" type="number" dense outlined hide-details ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" class="equal-height">
                        <v-menu v-model="dateRequestMenu" :close-on-content-click="false" transition="scale-transition" offset-y >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="form.recruitment.requestDate" :label="$t('Req.date')" readonly outlined dense v-bind="attrs" v-on="on" hide-details prepend-inner-icon="mdi-calendar" ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="form.recruitment.requestDate"
                            @input="dateRequestMenu = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="4" class="equal-height">
                        <v-card outlined :class="{'error--text': formErrors.recruitment}" class="pa-1 custom-card-hover flex-grow-1">
                            <v-row>
                                <v-col cols="12" class="d-flex flex-wrap">
                                    <v-checkbox dense v-model="form.recruitment.isExpansion" :label="$t('Expansion of Staffing')" hide-details ></v-checkbox>
                                    <v-checkbox dense v-model="form.recruitment.isReplacement" :label="$t('Replacement')" hide-details ></v-checkbox>
                                    <v-text-field v-if="form.recruitment.isReplacement" v-model="form.recruitment.oldEmpNo" :label="$t('Old empno')" dense outlined hide-details class="mt-2 ml-2" style="max-width: 150px;"></v-text-field>
                                    <v-checkbox dense v-model="form.recruitment.isOther" :label="$t('Other')" hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="form.educationLevel" :items="educationLevelItems" :label="$t('Education Level')" outlined dense hide-details  item-text="name" item-value="id" clearable ></v-autocomplete>
                    </v-col>                        
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="form.workExperience" :items="workExpItems" :label="$t('Work Experience')" outlined dense hide-details  item-text="name" item-value="id" clearable ></v-autocomplete>
                    </v-col>      
                    <v-col cols="12">
                        <v-textarea v-model="form.specialization" outlined dense rows="2" hide-details :placeholder="$t('Enter specialization requirements...')" ></v-textarea>
                    </v-col>
                </v-row>
            </div>
            <!-- Section II: Job Description -->
            <div class="mt-2">
                <v-card-title class="section-title">
                    <v-icon color="warning" size="32" class="mr-2">mdi-text-box</v-icon>
                    <span class="text-h5 warning--text font-weight-medium">{{ $t('Job Description') }}</span>
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="8">
                        <v-textarea
                        v-model="form.jobDesc" outlined :error="formErrors.jobDesc" :label="$t('Basic Job Description')" rows="2" hide-details prepend-inner-icon="mdi-text-box-outline"></v-textarea>
                    </v-col>
                    <v-col cols="12" md="2" v-if="form.pos !== 1">
                        <v-file-input v-model="form.attachments.jobDesc" :label="$t('Job description file')" outlined dense hide-details @change="previewFile('jobDesc', $event)" prepend-inner-icon="mdi-file-document"></v-file-input>
                        <!-- Preview for job description file -->
                        <div v-if="filePreview.jobDesc" class="file-preview mt-2">
                            <v-chip small close @click:close="clearFile('jobDesc')" class="mb-1">
                                <v-icon left small>{{ getFileIcon(form.attachments.jobDesc?.type) }}</v-icon>
                                {{ form.attachments.jobDesc?.name }}
                            </v-chip>
                            <div class="d-flex align-center justify-space-between">
                                <span class="caption grey--text">{{ formatFileSize(form.attachments.jobDesc?.size) }}</span>
                                <v-btn x-small text color="primary" @click="openFile('jobDesc')">
                                    <v-icon small left>mdi-eye</v-icon>
                                    {{ $t('View') }}
                                </v-btn>
                            </div>
                        </div>
                    </v-col>
                    <!-- <v-col cols="12" md="2" v-else></v-col> -->
                    <v-col cols="12" md="2">
                        <v-file-input 
                        v-model="form.attachments.dimissionList" 
                        :label="$t('Dimission list file')" 
                        outlined 
                        dense 
                        :error="formErrors.dimissionList"
                        :error-messages="formErrors.dimissionList ? $t('Dimission list file is required') : ''"
                        hide-details="auto"
                        @change="previewFile('dimissionList', $event)"
                        prepend-inner-icon="mdi-file-account"
                        ></v-file-input>
                        <div v-if="filePreview.dimissionList" class="file-preview mt-2">
                            <v-chip small close @click:close="clearFile('dimissionList')" class="mb-1">
                                <v-icon left small>{{ getFileIcon(form.attachments.dimissionList?.type) }}</v-icon>
                                {{ form.attachments.dimissionList?.name }}
                            </v-chip>
                            <div class="d-flex align-center justify-space-between">
                                <span class="caption grey--text">{{ formatFileSize(form.attachments.dimissionList?.size) }}</span>
                                <v-btn x-small text color="primary" @click="openFile('dimissionList')">
                                    <v-icon small left>mdi-eye</v-icon>
                                    {{ $t('View') }}
                                </v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="mt-2">
                <v-card-title class="section-title">
                    <v-icon color="warning" size="32" class="mr-2">mdi-account-cog</v-icon>
                    <span class="text-h5 warning--text font-weight-medium">{{ $t('Skill Requirements') }}</span>
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="5" class="equal-height">
                        <v-card outlined class="pa-1 custom-card-hover flex-grow-1">
                            <div class="d-flex align-center">
                                <v-icon left color="primary">mdi-translate</v-icon>
                                <div class="text-subtitle-1 font-weight-medium">{{ $t('Foreign Language Proficiency') }}</div>
                            </div>
                            <div class="mb-4">
                                <div class="subtitle-2 mt-2">{{ $t('English:') }}</div>
                                <v-row>
                                    <v-col cols="12" class="d-flex flex-wrap">
                                        <v-checkbox 
                                            v-for="(level, index) in languageLevels" 
                                            :key="'english-' + index"
                                            v-model="form.english" 
                                            :value="level.value"
                                            dense 
                                            class="checkbox-spacing" 
                                            :label="level.label" 
                                            hide-details
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </div>
                            <div>
                                <div class="subtitle-2">{{ $t('Chinese:') }}</div>
                                <v-row>
                                    <v-col cols="12" class="d-flex flex-wrap">
                                        <v-checkbox 
                                            v-for="(level, index) in languageLevels" 
                                            :key="'chinese-' + index"
                                            v-model="form.chinese" 
                                            :value="level.value"
                                            dense 
                                            class="checkbox-spacing" 
                                            :label="level.label" 
                                            hide-details
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </div>
                            <div>
                                <div class="subtitle-2">{{ $t('Either:') }}</div>
                                <v-row>
                                    <v-col cols="12" class="d-flex flex-wrap">
                                        <v-checkbox 
                                            v-for="(level, index) in languageLevels" 
                                            :key="'either-' + index"
                                            v-model="form.either" 
                                            :value="level.value"
                                            dense 
                                            class="checkbox-spacing" 
                                            :label="level.label" 
                                            hide-details
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="5" class="equal-height">
                        <v-card outlined class="pa-1 custom-card-hover flex-grow-1">
                            <div class="d-flex align-center mb-3">
                                <v-icon left color="primary">mdi-laptop</v-icon>
                                <div class="text-subtitle-1 font-weight-medium">{{ $t('Computer Skills') }}</div>
                            </div>
                            <v-row>
                                <v-col cols="12" class="d-flex flex-wrap">
                                    <v-checkbox v-model="form.computerSkills" :value="'Word'" dense class="checkbox-spacing" :label="$t('Word')" hide-details></v-checkbox>
                                    <v-checkbox v-model="form.computerSkills" :value="'Excel'" dense class="checkbox-spacing" :label="$t('Excel')" hide-details></v-checkbox>
                                    <v-checkbox v-model="form.computerSkills" :value="'Access'" dense class="checkbox-spacing" :label="$t('Access')" hide-details></v-checkbox>
                                    <v-checkbox v-model="form.computerSkills" :value="'PowerPoint'" dense class="checkbox-spacing" :label="$t('PowerPoint')" hide-details></v-checkbox>
                                    <v-checkbox v-model="form.computerSkills" :value="'Internet'" dense class="checkbox-spacing" :label="$t('Internet')" hide-details></v-checkbox>
                                    <v-checkbox v-model="form.computerSkills" :value="'Other'" dense class="checkbox-spacing" :label="$t('Other')" hide-details></v-checkbox>
                                    
                                </v-col>
                            </v-row>
                            <v-textarea v-model="form.otherComputerSkills" :label="$t('Other Skills')" dense outlined class="mt-1" rows="3" hide-details></v-textarea>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="2" class="equal-height">
                        <v-card outlined class="pa-1 custom-card-hover flex-grow-1">
                            <div class="d-flex align-center mb-3">
                                <v-icon left color="primary">mdi-shield-account</v-icon>
                                <div class="text-subtitle-1 font-weight-medium">{{ $t('Workplace Safety') }}</div>
                            </div>
                            <div class="d-flex flex-column">
                                <v-checkbox
                                    v-for="(level, index) in safetyLevels" 
                                    :key="'safety-' + index"
                                    v-model="form.safetyLevels" 
                                    :value="level.fullData"
                                    :label="level.name"
                                    dense
                                    multiple
                                    hide-details
                                    class="my-0"
                                ></v-checkbox>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-textarea
                        v-model="form.remark" outlined :label="$t('Remark')" rows="2" hide-details prepend-inner-icon="mdi-note-text"></v-textarea>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="saveDB" class="mr-2">{{ $t('Save') }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t('Cancel') }}</v-btn>
                </v-row>
            </div>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "RequestDialog",
    props: {
        value: Boolean,
        editData: {
            type: Object,
            default: () => null
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            storageUrl:  "http://gmo021.cansportsvg.com/api/storage/app/recruiting-report/",
            dateKeyInMenu: false,
            dateRequestMenu: false,
            activeUser: {
                empNo: '',
                name: '',
                dept: '',
                dept_sumt: ''
            },
            user: {
                dept: '',
                div: '',
                unit: ''
            },
            dept: [],
            departmentData: [],
            itemsDiv:[],
            itemsDept:[],
            itemUnits:[],
            iSuppType: [
            {
                id: 1,
                cn: "資深課長級(含)以下幹部/職員",
                en: "Senior Manager & Below",
                vi: "Trưởng ngành cấp cao trở xuống"
            },
            {
                id: 2,
                cn: "工人以及主任級(含)以上幹部/職員",
                en: "Workers & Director & Above",
                vi: "Công nhân & cán bộ chủ nhiệm trở lên"
            }
            ],
            form: {
                keyInDate: new Date().toISOString().substr(0, 10),
                req_id: '', 
                suppType: '',
                
                education: {
                    below12: false,
                    level12: false,
                    intermediate: false,
                    college: false,
                    university: false
                },
                experience: {
                    notRequired: false,
                    lessThan1: false,
                    years1to2: false,
                    years2to3: false,
                    moreThan3: false
                },
                specialization: '',
                recruitment: {
                    isExpansion: false,
                    isReplacement: false,
                    oldEmpNo: '',
                    isOther: false,
                    requestDate: new Date().toISOString().substr(0, 10)
                },
                staffCount: {
                    workers: '',
                    staff: '',
                    officers: '',
                    engineers: '',
                    level: ''
                },
                jobDesc: '',
                attachments: {
                    jobDesc: undefined,
                    dimissionList: undefined
                },
                english: [], 
                chinese: [], 
                either: [], 
                
                computerSkills: [],
                otherComputerSkills: '',
                safetyLevels: [], // Đổi từ safetyLevel thành mảng safetyLevels
                remark: '',
                dataMpr: [],
                pos: null,
                level: '',
                quantity: 0,
                educationLevel: null,
                workExperience: null
            },
            formErrors: {
                education: false,
                experience: false,
                specialization: false,
                recruitment: false,
                staffCount: false,
                jobDesc: false,
                dimissionList: false 
            },
            filePreview: {
                jobDesc: false,
                dimissionList: false
            },
            workExp: [],
            pos: [],
            eduReq: [],
            lang: [],
            wps: [],
            showLevelField: false,
            parsedLanguageLevels: [], 
            parsedSafetyLevels: [], 
            defaultWpsSafety: null 
        }
    },
    watch: {
        editData: {
            handler(newData) {
                if (newData) {
                    this.populateForm(newData);
                }
            },
            immediate: true
        },
        'user.div': {
            handler(newDiv) {
                if (newDiv) {
                    const dept = this.departmentData.find(d => d.department === newDiv);
                    this.itemsDept = dept ? dept.units.map(u => u.name) : [];
                } else {
                    this.itemsDept = [];
                }
            },
            immediate: true
        },
        'user.dept': {
            handler(newDept) {
                if (newDept) {
                    const dept = this.departmentData.find(d => d.department === this.user.div);
                    if (dept) {
                        const unit = dept.units.find(u => u.name === newDept);
                        this.itemUnits = unit ? unit.sub_units : [];
                    }
                } else {
                    this.itemUnits = [];
                }
            }
        },
        'form.pos': {
            immediate: true,
            handler(newValue) {
                // Initialize the visibility of level field based on initial value
                this.showLevelField = newValue === 3;
            }
        },
        'form.quantity': {
            handler(newQuantity) {
                if (!this.form.pos) return;
                
                const qty = parseInt(newQuantity);
                switch (this.form.pos) {
                    case 1: // Worker
                        this.form.staffCount.workers = qty;
                        break;
                    case 2: // Staff
                        this.form.staffCount.staff = qty;
                        break;
                    case 3: // Officers/Leader
                        this.form.staffCount.officers = qty;
                        this.form.staffCount.level = this.form.level || '';
                        break;
                    case 4: // Engineers
                        this.form.staffCount.engineers = qty;
                        break;
                }
            }
        },
        'form.level': {
            handler(newLevel) {
                if (this.form.pos === 3) {
                    this.form.staffCount.level = newLevel;
                }
            }
        }
    },
    methods: {
        setLocale(tg) {
            this.$i18n.setLocale(tg);
            this.$nuxt.$emit('setLocale', tg);
        },
        async getAllDataWorkExp() {
            try {
                const response = await this.$axios.get(this.api + 'getAllDataWorkExp');
                this.workExp = response.data.dataWorkExp;
                
            } catch (error) {
                console.error("Error fetching work experience data:", error);
            }
        },
        async getAllDataTypeApply() {
            try {
                const response = await this.$axios.get(this.api + 'getAllDataTypeApply');
                this.pos = response.data.dataTypeApply;
            } catch (error) {
                console.error("Error fetching type apply data:", error);
            }
        },
        async getAllDataEduReq() {
            try {
                const response = await this.$axios.get(this.api + 'getAllDataEduReq');
                this.eduReq = response.data.dataEduReq;
                
            } catch (error) {
                console.error("Error fetching education requirement data:", error);
            }
        },
        async getAllDataLang() {
            try {
                const response = await this.$axios.get(this.api + 'getAllDataLang');
                this.lang = response.data.dataLang;
                
                // Parse the JSON string in the lang object to get the language levels
                if (this.lang && this.lang.lang) {
                    try {
                        this.parsedLanguageLevels = JSON.parse(this.lang.lang);
                    } catch (e) {
                        console.error("Error parsing language data:", e);
                        this.parsedLanguageLevels = [];
                    }
                }
            } catch (error) {
                console.error("Error fetching language data:", error);
            }
        },
        async getAllDataWps() {
            try {
                const response = await this.$axios.get(this.api + 'getAllDataWps');
                this.wps = response.data.dataWps;
                
                this.parsedSafetyLevels = this.wps.map(item => {
                    try {
                        const wpsParsed = JSON.parse(item.wps_name);
                        const fullData = {
                            id: item.id,
                            name: wpsParsed
                        };
                        
                        if (item.id === 1) {
                            this.defaultWpsSafety = fullData;
                            if (!this.form.safetyLevels) {
                                this.form.safetyLevels = [fullData];
                            }
                        }
                        
                        return {
                            id: item.id,
                            name: wpsParsed[this.$i18n.locale] || wpsParsed.en,
                            fullData: fullData
                        };
                    } catch (e) {
                        console.error("Error parsing WPS data:", e);
                        return {
                            id: item.id,
                            name: "Error",
                            fullData: { id: item.id, name: { en: "Error", vi: "Lỗi", cn: "错误" } }
                        };
                    }
                });
                
            } catch (error) {
                console.error("Error fetching workplace safety data:", error);
            }
        },
        async saveDB() {
            try {
                const id = this.editData?.id;

                const formData = new FormData();
                if (id) {
                    formData.append('id', id);
                }

                this.id = this.editData ? this.editData.id : null;
                this.formErrors = {
                    education: false,
                    experience: false,
                    specialization: false,
                    recruitment: false,
                    staffCount: false,
                    jobDesc: !this.form.jobDesc,
                    dimissionList: !this.form.attachments.dimissionList
                };
                if (Object.values(this.formErrors).some(error => error)) {
                    this.$notify({
                        title: 'Error',
                        text: this.$t('Please fill all required fields'),
                        type: 'error'
                    });
                    return;
                }

                const submitterData = {
                    empNo: this.activeUser.empNo,
                    name: this.activeUser.name,
                    dept_sumt: this.activeUser.dept_sumt,
                    dept: this.user.dept,
                    div: this.user.div,
                    unit: this.user.unit
                };
                formData.append('key_in_date', this.form.keyInDate);
                formData.append('req_id', this.form.req_id);
                formData.append('submiter', JSON.stringify(submitterData));
                formData.append('status', '');
                
                formData.append('supp_type', this.form.suppType || 0);
                
                let selectedEduLevel = null;
                if (this.form.educationLevel) {
                    selectedEduLevel = this.eduReq.find(edu => edu.id === this.form.educationLevel);
                    if (selectedEduLevel) {
                        const eduName = JSON.parse(selectedEduLevel.edu_name);
                        formData.append('edu', JSON.stringify({
                            id: selectedEduLevel.id,
                            name: eduName
                        }));
                    } else {
                        formData.append('edu', JSON.stringify({id: 0, name: {}}));
                    }
                } else {
                    formData.append('edu', JSON.stringify({id: 0, name: {}}));
                }
                formData.append('spec', this.form.specialization);
                let selectedWorkExp = null;
                if (this.form.workExperience) {
                    selectedWorkExp = this.workExp.find(exp => exp.id === this.form.workExperience);
                    if (selectedWorkExp) {
                        const expName = JSON.parse(selectedWorkExp.exp_name);
                        formData.append('w_exp', JSON.stringify({
                            id: selectedWorkExp.id,
                            name: expName
                        }));
                    } else {
                        formData.append('w_exp', JSON.stringify({id: 0, name: {}}));
                    }
                } else {
                    formData.append('w_exp', JSON.stringify({id: 0, name: {}}));
                }
                
                const reasonExp = {
                    isExpansion: this.form.recruitment.isExpansion,
                    isReplacement: this.form.recruitment.isReplacement,
                    isOther: this.form.recruitment.isOther
                };
                formData.append('reason_exp', JSON.stringify(reasonExp));
                formData.append('old_emp', this.form.recruitment.oldEmpNo || '');
                formData.append('date_req', this.form.recruitment.requestDate);
                formData.append('qty_req', JSON.stringify(this.form.staffCount));
                formData.append('total_qty', this.form.quantity);
                
                if (this.form.pos) {
                    const selectedTypeApply = this.pos.find(type => type.id === this.form.pos);
                    if (selectedTypeApply) {
                        const typeName = JSON.parse(selectedTypeApply.type_name.trim());
                        formData.append('pos', JSON.stringify({ 
                            id: selectedTypeApply.id,
                            name: typeName
                        }));
                        
                        // Add console log to verify the data
                    } else {
                        formData.append('pos', JSON.stringify({id: 0, name: {}}));
                    }
                } else {
                    formData.append('pos', JSON.stringify({id: 0, name: {}}));
                }
                
                formData.append('jd', this.form.jobDesc);
                
                // Attachments
                if (this.form.attachments.jobDesc) {
                    formData.append('jobDescFile', this.form.attachments.jobDesc);
                }
                
                if (this.form.attachments.dimissionList) {
                    formData.append('dimissionFile', this.form.attachments.dimissionList);
                }
                
                // Language skills - now using arrays instead of objects
                formData.append('eng_skill', JSON.stringify(this.form.english));
                formData.append('chn_skill', JSON.stringify(this.form.chinese));
                formData.append('either_skill', JSON.stringify(this.form.either));
                
                // Computer skills
                const computerSkillsData = {
                    skills: this.form.computerSkills,
                    others: this.form.otherComputerSkills
                };
                formData.append('comp_skill', JSON.stringify(computerSkillsData));
                
                // Work place safety - properly format for API
                if (this.form.safetyLevels && this.form.safetyLevels.length > 0) {
                    const wpsData = this.form.safetyLevels.map(level => ({
                        id: level.id,
                        wps_name: JSON.stringify(level.name)
                    }));
                    formData.append('wps', JSON.stringify(wpsData));
                } else if (this.defaultWpsSafety) {
                    const wpsData = [{
                        id: this.defaultWpsSafety.id,
                        wps_name: JSON.stringify(this.defaultWpsSafety.name)
                    }];
                    formData.append('wps', JSON.stringify(wpsData));
                } else {
                    formData.append('wps', JSON.stringify([]));
                }
                
                // Remarks - ensure it's an empty string if null or undefined
                formData.append('remark', this.form.remark || '');
                
                // Log the full form data before sending
                const formDataEntries = {};
                for (let pair of formData.entries()) {
                    formDataEntries[pair[0]] = pair[1];
                }
                
                // Send data to API
                const response = await this.$axios.post(this.api + 'saveManpower', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (response.data.success) {
                    this.$notify({
                        title: 'Success',
                        text: this.$t('Request submitted successfully'),
                        type: 'success'
                    });
                    this.dialog = false;
                    this.$emit('saved');
                    this.clearForm();
                } else {
                    this.$notify({
                        title: 'Error',
                        text: response.data.message || this.$t('Error submitting request'),
                        type: 'error'
                    });
                }
                
            } catch (error) {
                console.error('Error saving request:', error);
                this.$notify({
                    title: 'Error',
                    text: this.$t('Error submitting request') + ': ' + error.message,
                    type: 'error'
                });
            }
        },
        clearForm() {
            this.form = {
                keyInDate: new Date().toISOString().substr(0, 10),
                req_id: '',
                suppType: '',
                
                education: {
                    below12: false,
                    level12: false,
                    intermediate: false,
                    college: false,
                    university: false
                },
                experience: {
                    notRequired: false,
                    lessThan1: false,
                    years1to2: false,
                    years2to3: false,
                    moreThan3: false
                },
                specialization: '',
                recruitment: {
                    isExpansion: false,
                    isReplacement: false,
                    oldEmpNo: '',
                    isOther: false,
                    requestDate: new Date().toISOString().substr(0, 10)
                },
                staffCount: {
                    workers: 0,
                    staff: 0,
                    officers: 0,
                    engineers: 0,
                    level: ''
                },
                jobDesc: '',
                attachments: {
                    jobDesc: undefined,
                    dimissionList: undefined
                },
                english: [], // Reset to empty array
                chinese: [], // Reset to empty array
                either: [], // Reset to empty array
                
                computerSkills: [],
                otherComputerSkills: '',
                safetyLevels: this.defaultWpsSafety ? [this.defaultWpsSafety] : [], // Reset to default WPS object
                remark: '', // Make sure this is initialized as empty string, not null
                dataMpr: [],
                pos: null,
                level: '',
                quantity: 0,
                educationLevel: null,
                workExperience: null
            };
            
            this.formErrors = {
                education: false,
                experience: false,
                specialization: false,
                recruitment: false,
                staffCount: false,
                jobDesc: false,
                dimissionList: false
            };
            
            this.filePreview = {
                jobDesc: false,
                dimissionList: false
            };
        },
        async getAllDept() {
            try {
                const response = await this.$axios.get(this.api + 'getDataDeptCode');
                this.dept = response.data.dataDeptCode;
                
                // Log để debug
                const deptMap = new Map();
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
                
                // Log để debug sau khi xử lý
                
                this.itemsDiv = this.departmentData.map(dept => dept.department);
            } catch (error) {
                console.error("Error fetching department data:", error);
            }
        },
        handleTypeApplyChange(value) {
            // Show level field only when Type Apply is Leader (ID: 3)
            this.showLevelField = value === 3;
            
            // Clear the level when changing type if it's not Leader
            if (value !== 3) {
                this.form.level = '';
            }
            
            // Clear job description file when selecting Worker (ID: 1)
            if (value === 1) {
                this.clearFile('jobDesc');
            }

            // Reset all quantity fields
            this.form.staffCount = {
                workers: 0,
                staff: 0,
                officers: 0,
                engineers: 0,
                level: ''
            };

            // Set quantity to the appropriate field based on type
            if (value) {
                const qty = parseInt(this.form.quantity) || 0;
                switch (value) {
                    case 1: // Worker
                        this.form.staffCount.workers = qty;
                        break;
                    case 2: // Staff
                        this.form.staffCount.staff = qty;
                        break;
                    case 3: // Officers/Leader
                        this.form.staffCount.officers = qty;
                        this.form.staffCount.level = this.form.level;
                        break;
                    case 4: // Engineers
                        this.form.staffCount.engineers = qty;
                        break;
                }
            }
        },
        clearFile(fileType) {
            if (fileType === 'jobDesc') {
                this.form.attachments.jobDesc = undefined;
                this.filePreview.jobDesc = false;
            } else if (fileType === 'dimissionList') {
                this.form.attachments.dimissionList = undefined;
                this.filePreview.dimissionList = false;
            }
        },
        previewFile(fileType, event) {
            if (fileType === 'jobDesc' && this.form.attachments.jobDesc) {
                this.filePreview.jobDesc = true;
            } else if (fileType === 'dimissionList' && this.form.attachments.dimissionList) {
                this.filePreview.dimissionList = true;
            }
        },
        getFileIcon(mimeType) {
            if (!mimeType) return 'mdi-file-outline';
            
            if (mimeType.includes('pdf')) return 'mdi-file-pdf';
            if (mimeType.includes('word') || mimeType.includes('msword') || mimeType.includes('document')) return 'mdi-file-word';
            if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'mdi-file-excel';
            if (mimeType.includes('image')) return 'mdi-file-image';
            
            return 'mdi-file-outline';
        },
        formatFileSize(size) {
            if (!size) return '0 KB';
            
            if (size < 1024) return size + ' B';
            if (size < 1024 * 1024) return Math.round(size / 1024) + ' KB';
            return Math.round(size / (1024 * 1024) * 10) / 10 + ' MB';
        },
        openFile(fileType) {
            const file = fileType === 'jobDesc' ? this.form.attachments.jobDesc : this.form.attachments.dimissionList;
            if (!file) return;
            
            // Create a URL for the file and open it in a new tab
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        },
        populateForm(data) {
            if (!data) return;
            
            const submiter = typeof data.submiter === 'string' ? JSON.parse(data.submiter) : data.submiterInfo;
            this.$nextTick(() => {
                this.user.div = submiter.div;
                this.$nextTick(() => {
                    this.user.dept = submiter.dept;
                    
                    this.$nextTick(() => {
                        this.user.unit = submiter.unit;
                    });
                });
            });
            
            // Basic info
            this.form.keyInDate = data.key_in_date;
            this.form.req_id = data.req_id;
            this.form.suppType = data.supp_type;
            this.form.specialization = data.spec;
            this.form.jobDesc = data.jd;
            this.form.remark = data.remark || ''; // Ensure remark is never null
            
            // Parse JSON strings
            const education = typeof data.edu === 'string' ? JSON.parse(data.edu) : data.edu;
            const workExp = typeof data.w_exp === 'string' ? JSON.parse(data.w_exp) : data.w_exp;
            const reasonExp = typeof data.reason_exp === 'string' ? JSON.parse(data.reason_exp) : data.reason_exp;
            const computerSkills = typeof data.comp_skill === 'string' ? JSON.parse(data.comp_skill) : data.computerSkillsInfo;
            const wps = typeof data.wps === 'string' ? JSON.parse(data.wps) : data.wps;
            const position = typeof data.pos === 'string' ? JSON.parse(data.pos) : data.positionInfo;
            
            // Set department info
            this.user.div = submiter.div;
            this.user.dept = submiter.dept;
            this.user.unit = submiter.unit;
            
            // Education and work experience
            this.form.educationLevel = education?.id;
            this.form.workExperience = workExp?.id;
            
            // Recruitment info
            this.form.recruitment = {
                isExpansion: reasonExp?.isExpansion || false,
                isReplacement: reasonExp?.isReplacement || false,
                oldEmpNo: data.old_emp || '',
                isOther: reasonExp?.isOther || false,
                requestDate: data.date_req
            };
            
            // Type/position - with improved logging
            if (data.pos) {
                try {
                    const position = typeof data.pos === 'string' ? JSON.parse(data.pos) : data.positionInfo;
                    this.form.pos = position?.id;
                } catch (e) {
                    console.error('Error parsing position data:', e);
                }
            } else {
                console.log('No position data found in server response');
            }
            
            // Parse the quantity data if it's in JSON format
            let totalQuantity = 0;
            
            try {
                // Check if qty_req is a JSON string that contains our staffCount structure
                let qtyData;
                if (typeof data.qty_req === 'string') {
                    try {
                        qtyData = JSON.parse(data.qty_req);
                        // Check if the parsed object has our expected structure
                        if (qtyData && (qtyData.workers !== undefined || 
                                       qtyData.staff !== undefined || 
                                       qtyData.officers !== undefined || 
                                       qtyData.engineers !== undefined)) {
                            
                            // Update staffCount with parsed values
                            this.form.staffCount = {
                                workers: parseInt(qtyData.workers) || 0,
                                staff: parseInt(qtyData.staff) || 0,
                                officers: parseInt(qtyData.officers) || 0,
                                engineers: parseInt(qtyData.engineers) || 0,
                                level: qtyData.level || ''
                            };
                            
                            // Calculate total based on position type
                            if (this.form.pos === 1) {
                                totalQuantity = this.form.staffCount.workers;
                            } else if (this.form.pos === 2) {
                                totalQuantity = this.form.staffCount.staff;
                            } else if (this.form.pos === 3) {
                                totalQuantity = this.form.staffCount.officers;
                                this.form.level = this.form.staffCount.level;
                            } else if (this.form.pos === 4) {
                                totalQuantity = this.form.staffCount.engineers;
                            } else {
                                // If no specific type, sum all quantities
                                totalQuantity = this.form.staffCount.workers + 
                                               this.form.staffCount.staff + 
                                               this.form.staffCount.officers + 
                                               this.form.staffCount.engineers;
                            }
                        } else {
                            // If the structure doesn't match, it might be just a number
                            totalQuantity = parseInt(data.qty_req) || 0;
                        }
                    } catch (e) {
                        console.error("Error parsing qty_req:", e);
                        // If parsing fails, it might be just a number
                        totalQuantity = parseInt(data.qty_req) || 0;
                    }
                } else if (typeof data.qty_req === 'number') {
                    // If it's already a number, use it directly
                    totalQuantity = data.qty_req || 0;
                }
                
                // Set the total quantity
                this.form.quantity = totalQuantity;
                
                // If we have data.total_qty, use that instead
                if (data.total_qty) {
                    this.form.quantity = parseInt(data.total_qty) || 0;
                }
            } catch (error) {
                console.error("Error processing quantity data:", error);
                // Fall back to parsing qty_req as a direct number
                this.form.quantity = parseInt(data.qty_req) || 0;
            }
            
            // Language skills
            this.form.english = JSON.parse(data.eng_skill || '[]');
            this.form.chinese = JSON.parse(data.chn_skill || '[]');
            this.form.either = JSON.parse(data.either_skill || '[]');
            
            // Computer skills
            this.form.computerSkills = computerSkills?.skills || [];
            this.form.otherComputerSkills = computerSkills?.others || '';
            
            // Workplace safety
            if (wps) {
                if (Array.isArray(wps)) {
                    this.form.safetyLevels = wps.map(wp => ({
                        id: wp.id,
                        name: typeof wp.wps_name === 'string' ? JSON.parse(wp.wps_name) : wp.wps_name
                    }));
                } else {
                    this.form.safetyLevels = [{
                        id: wps.id,
                        name: typeof wps.wps_name === 'string' ? JSON.parse(wps.wps_name) : wps.wps_name
                    }];
                }
            }
            
            // Reset file previews
            this.filePreview = {
                jobDesc: !!data.att_jd,
                dimissionList: !!data.att_dis
            };
            
            if (data.att_jd) {
                this.form.attachments.jobDesc = data.att_jd;
            }
            if (data.att_dis) {
                this.form.attachments.dimissionList = data.att_dis;
            }
        }
    },
    mounted() {
        this.getAllDept().then(() => {
            this.$nextTick(() => {
                if (this.editData) {
                    this.populateForm(this.editData);
                }
            });
        });
        
        this.$nextTick(() => {
            const sessionUser = this.$session.get('recruiting-report');
            if (sessionUser) {
                this.activeUser = {
                    empNo: sessionUser.empno,
                    name: sessionUser.name,
                    dept_sumt: sessionUser.dept,
                };
            }
        });
        this.getAllDataWorkExp();
        this.getAllDataTypeApply();
        this.getAllDataEduReq();
        this.getAllDataLang();
        this.getAllDataWps();
    },
    computed: {
        dialog: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        workExpItems() {
            return this.workExp.map(exp => {
                const expName = JSON.parse(exp.exp_name);
                return {
                    id: exp.id,
                    name: expName[this.$i18n.locale] || expName.en // Fallback to English if translation not found
                };
            });
        },
        posItems() {
            // Add logging to check if pos data is available
            if (!this.pos || !Array.isArray(this.pos) || this.pos.length === 0) {
                console.warn('No position types available');
                return [];
            }
            
            return this.pos.map(type => {
                try {
                    // Need to trim the string because there's an extra space in some of the JSON strings
                    const typeName = JSON.parse(type.type_name.trim());
                    return {
                        id: type.id,
                        name: typeName[this.$i18n.locale] || typeName.en // Fallback to English if translation not found
                    };
                } catch (e) {
                    console.error('Error parsing type name:', type.type_name, e);
                    return { id: type.id, name: `Type ${type.id}` }; // Fallback value
                }
            });
        },
        educationLevelItems() {
            return this.eduReq.map(edu => {
                const eduName = JSON.parse(edu.edu_name);
                return {
                    id: edu.id,
                    name: eduName[this.$i18n.locale] || eduName.en // Fallback to English if translation not found
                };
            });
        },
        suppTypeItems() {
            return this.iSuppType.map(type => {
                return {
                    id: type.id,
                    name: type[this.$i18n.locale] || type.en // Fallback to English if translation not found
                };
            });
        },
        languageLevels() {
            if (!this.parsedLanguageLevels || this.parsedLanguageLevels.length === 0) {
                // Default values if API data is not available
                return [
                    { value: 'high', label: this.$t('Advanced') },
                    { value: 'medium', label: this.$t('Midium') },
                    { value: 'low', label: this.$t('low') },
                    { value: 'none', label: this.$t('None') },
                ];
            }
            
            // Convert parsed language levels to format needed for checkboxes
            return this.parsedLanguageLevels.map((level, index) => {
                return {
                    value: index.toString(), // Use index as value
                    label: level[this.$i18n.locale] || level.en // Use current locale or fall back to English
                };
            });
        },
        safetyLevels() {
            if (!this.parsedSafetyLevels || this.parsedSafetyLevels.length === 0) {
                // Default values if API data is not available
                return [
                    { 
                        id: 1, 
                        name: this.$t('Basic'),
                        fullData: { id: 1, name: { en: "Basic", vi: "Cơ bản", cn: "可" } }
                    },
                    { 
                        id: 2, 
                        name: this.$t('Fair'),
                        fullData: { id: 2, name: { en: "Fair", vi: "Khá", cn: "好" } }
                    },
                    { 
                        id: 3, 
                        name: this.$t('Good'),
                        fullData: { id: 3, name: { en: "Good", vi: "Tốt", cn: "優" } }
                    },
                ];
            }
            
            // Return the already formatted safety levels
            return this.parsedSafetyLevels;
        }
    }
}
</script>
<i18n>
    {
        "en": {
            
        },
        "vi": {
            
        },
        "cn": {
            
        }
    }
</i18n>

<style scoped>
.request-page {
    background-color: #f8f9fa;
    min-height: 100vh;
}

.section-title {
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 16px;
}

.custom-card-hover {
    border: 1px solid #e0e0e0;
    box-shadow: none;
    transition: box-shadow 0.3s ease-in-out;
}

.custom-card-hover:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.v-input--selection-controls {
    margin: 0;
    padding: 4px;
}

.text-h5 {
    font-size: 1.4rem !important;
}

.text-h6 {
    font-size: 1rem !important;
}

.checkbox-spacing {
    margin-right: 30px !important;
    min-width: auto;
    margin-bottom: 4px !important;
}

.equal-height {
    display: flex;
}

.equal-height > .v-card {
    flex: 1;
    background-color: #fff;
    transition: transform 0.2s;
}

.equal-height > .v-card:hover {
    transform: translateY(-2px);
}

.error--text {
    border-color: #ff5252 !important;
}

.file-preview {
    border: 1px dashed #e0e0e0;
    border-radius: 4px;
    padding: 4px 8px;
    background-color: #f5f5f5;
}

.caption {
    font-size: 0.75rem;
}

.file-preview .v-btn {
    min-width: auto;
    height: 20px !important;
    padding: 0 8px !important;
}

.v-text-field.v-text-field--enclosed .v-input__prepend-inner {
    margin-right: 8px;
}

</style>