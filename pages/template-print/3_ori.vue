<template>
    <div>
        <div v-if="loading" class="loading-indicator">
            Đang tải dữ liệu...
        </div>
        <div v-else-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-else-if="processedCandidates.length === 0" class="no-data-message">
            <v-alert
                type="warning"
                prominent
                border="left"
                colored-border
                color="warning"
                class="mb-0"
            >
                Không tìm thấy dữ liệu nghỉ việc cho các nhân viên được chọn!
            </v-alert>
        </div>
        <div v-else>
            <!-- Loop through all candidates -->
            <div v-for="(candidate, index) in processedCandidates" :key="index" :class="{'page-break': index > 0}" ref="printContent">
                <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                    <tr>
                        <td rowspan="2" class="align-middle text-header" style="width: 12%">
                            <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                        </td>
                        <td rowspan="3" class="text-center align-middle text-header_title">
                            BẢNG GHI NHẬN TRỞ LẠI CÔNG TY
                            <br />
                            回廠紀錄
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered no-interior-borders" style="margin-top: 10px;">
                    <tr>
                        <td colspan="12" style="text-align: left;"><strong>1. HỌ VÀ TÊN 姓名: {{ candidate.name }}</strong></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left;">Số lần vào công ty 進廠次數: </td>
                        <td colspan="3" style="text-align: left;">{{ candidate.times_in_company }} lần/次</td>
                        <td colspan="6" style="text-align: left;"></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left;">Số thẻ 工號:</td>
                        <td colspan="3" style="text-align: left;">{{ candidate.emp_id }}</td>
                        <td colspan="3" style="text-align: left;">Ngày vào công ty 進廠日</td>
                        <td colspan="3" style="text-align: left;">{{ formatDate(candidate.join_date) }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left;">Bộ phận 部門:</td>
                        <td colspan="3" style="text-align: left;">{{ candidate.dept_name }}</td>
                        <td colspan="3" style="text-align: left;">Ngày thôi việc 離職日</td>
                        <td colspan="3" style="text-align: left;">{{ formatDate(candidate.resign_date) }}</td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: left;">LÝ DO THÔI VIỆC 離職原因：{{ candidate.resign_type }} 
                            <template v-if="candidate.resign_reason_text">({{ candidate.resign_reason_text }})</template>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: left;"><strong>2. XÁC NHẬN CỦA CHỦ QUẢN CŨ CÓ PHỎNG VẤN KHÔNG:
                                原單位主管是否進行面試</strong></td>
                    </tr>
                    <tr>
                        <td colspan="6" style="text-align: left; width: 50%;">Lý do 理由:
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 5px;">
                                <label>
                                    <input type="checkbox" readonly @click.prevent v-model="candidate.return_to_old_dept" style="margin: 5px;">
                                    Có nhận vào bộ phận cũ 是,回原單位就職
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent v-model="candidate.transfer_to_other_dept" style="margin: 5px;">
                                    Chuyển bộ phận khác 否, 轉介其他單位
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent v-model="candidate.has_other_reason"
                                        style="margin: 5px; padding-bottom: 10px;">
                                    Lý do khác其他理由:
                                    <span v-if="candidate.has_other_reason" class="underline-input" style="width: 200px;">

                                    </span>
                                    <span v-else class="underline-input" style="width: 200px;"></span>
                                </label>
                            </div>
                        </td>
                        <td colspan="6" style="text-align: center; width: 50%;">KÝ TÊN 簽名
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 5px;">
                                <div style="height: 20px;"></div>
                                <div style="height: 20px;"></div>
                                <div style="height: 20px;"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: right; padding-bottom: 120px; padding-top: 50px;">
                            <div style="text-align: center; padding-left: 340px;">
                                <strong>CANSPORTS, NGÀY日 {{ currentDay }} THÁNG月 {{ currentMonth }} NĂM年 {{ currentYear }}
                                    <br />
                                    BỘ PHẬN TÀI NGUYÊN NHÂN LỰC
                                    <br />
                                    人力資源部
                                </strong>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: "print",
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            candidates: [],
            formData: {
                name: '',
                times_in_company: 0,
                emp_id: '',
                join_date: '',
                dept_name: '',
                resign_date: '',
                resign_reason: '',
                resign_note: '',
                return_to_old_dept: false,
                transfer_to_other_dept: false,
                has_other_reason: false,
                other_reason: '',
                resign_type: '', // Add resign_type to formData
                resign_reason_text: '', // Add this new property
            },
            reasons:[],
            loading: true,
            error: null,
            currentDay: new Date().getDate(),
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear(),
            processedCandidates: [], // Add this new property
        };
    },

    computed: {
    },

    async mounted() {
        await this.getReasons();
        const ids = this.$route.query.ids;
        if (ids) {
            try {
                this.loading = true;
                const idArray = ids.split(',');
                const responses = await Promise.all(
                    idArray.map(id => this.$axios.get(`${this.api}getDataById/${id}`))
                );

                // Extract actual data from responses
                this.candidates = responses.map(response => response.data);
                const processedData = [];
                
                for (const candidate of this.candidates) {
                    const resignData = await this.$axios.post(
                        this.api + 'GetDataByCCCDResign',
                        { emp_id: candidate.emp_id }
                    );

                    // Only process candidate if they have resignation data
                    if (resignData.data && resignData.data.length > 0) {
                        const processedCandidate = await this.processCandidate(candidate);
                        if (processedCandidate) {
                            processedData.push(processedCandidate);
                        }
                    }
                }
                
                this.processedCandidates = processedData;

                if (processedData.length === 0) {
                    setTimeout(() => {
                        window.close();
                    }, 10000); // Close window after 3 seconds
                }

            } catch (error) {
                console.error('Error loading data:', error);
                this.error = 'Failed to load data: ' + (error.message || 'Unknown error');
            } finally {
                this.loading = false;
            }
        }
    },

    methods: {
        async getReasons() {
            try {
                const res = await this.$axios.get(this.api + 'getDataReasonResign');
                if (res.status === 200 && res.data.dataReasonResign) {
                    this.reasons = res.data.dataReasonResign;
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
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;
            return new Intl.DateTimeFormat('vi-VN').format(date);
        },

        async loadFormData() {
            this.loading = true;
            this.error = null;

            try {
                const ids = this.$route.query.ids;
                if (!ids) {
                    this.error = "Invalid request: No ID provided";
                    return;
                }
                const idArray = typeof ids === 'string' ? ids.split(',') : [ids];
                const res = await Promise.all(
                    idArray.map(id => this.$axios.get(`${this.api}getDataById/${id}`))
                );
                this.candidates = res.data
                let resignData = null;


                if (candidateData.emp_id) {
                    const resignResponse = await this.$axios.post(
                        this.api + 'GetDataByCCCDResign',
                        { emp_id: candidateData.emp_id }
                    );
                    if (resignResponse.data && resignResponse.data.length > 0) {
                        resignData = resignResponse.data[0];
                    }
                }
                const timesResponse = await this.$axios.get(
                    `${this.api}checkCccd/${candidateData.emp_id}`
                );
                this.formData = {
                    ...this.formData,
                    name: resignData ? resignData.er_name : candidateData.candidate_name,
                    times_in_company: timesResponse.data.count || 0,
                    emp_id: resignData ? resignData.er_empid : candidateData.newEmpno,
                    join_date: resignData ? resignData.er_indate : candidateData.act_en_date,
                    department: resignData ? resignData.er_deptid : candidateData.tmp_departid,
                    dept_name: resignData ? resignData.er_deptname : this.getDepartmentName(candidateData.tmp_departid),
                    resign_date: resignData ? resignData.er_resigndate : '',
                    resign_reason: resignData ? resignData.er_type_resign : '',
                    resign_note: resignData ? resignData.er_note : '',
                    cccd: candidateData.er_numberid || '',
                };

            } catch (error) {
                console.error("Error loading form data:", error);
                this.error = "Failed to load data: " + (error.message || "Unknown error");
            } finally {
                this.loading = false;
            }
        },

                async processCandidate(candidateData) {
            try {
                const resignData = await this.$axios.post(
                    this.api + 'GetDataByCCCDResign',
                    { emp_id: candidateData.emp_id }
                );
        
                // Lấy record có er_resigndate lớn nhất
                const resignInfo = resignData.data && resignData.data.length > 0 
                    ? resignData.data.reduce((latest, current) => {
                        const latestDate = new Date(latest.er_resigndate);
                        const currentDate = new Date(current.er_resigndate);
                        return currentDate > latestDate ? current : latest;
                    }, resignData.data[0])
                    : null;
        
                const resignType = resignInfo?.er_type_resign ? JSON.parse(resignInfo.er_type_resign) : null;
        
                let reasonText = '';
                if (resignInfo?.er_reason && this.reasons.length > 0) {
                    const matchingReason = this.reasons.find(r => r.id.toString() === resignInfo.er_reason);
                    if (matchingReason) {
                        try {
                            const reasonObj = JSON.parse(matchingReason.reason);
                            reasonText = reasonObj.vi || '';
                        } catch (e) {
                            console.error('Error parsing reason:', e);
                        }
                    }
                }
        
                const timesResponse = await this.$axios.get(
                    `${this.api}checkCccd/${candidateData.emp_id}`
                );
        
                return {
                    name: resignInfo ? resignInfo.er_name : candidateData.candidate_name,
                    times_in_company: timesResponse.data.count || 0,
                    emp_id: resignInfo ? resignInfo.er_empid : candidateData.emp_id,
                    join_date: resignInfo ? resignInfo.er_indate : candidateData.act_en_date,
                    dept_name: resignInfo ? resignInfo.er_deptname : candidateData.tmp_departid,
                    resign_date: resignInfo ? resignInfo.er_resigndate : '',
                    resign_reason: resignInfo ? resignInfo.er_reason : '',
                    resign_note: resignInfo ? resignInfo.er_note : '',
                    resign_type: resignType ? resignType.vi : '',
                    resign_reason_text: reasonText,
                    return_to_old_dept: false,
                    transfer_to_other_dept: false,
                    has_other_reason: false,
                    other_reason: ''
                };
            } catch (error) {
                console.error('Error processing candidate:', error);
                return null;
            }
        },

        printDocument() {
            window.print();
        }
    }
};
</script>

<style>
/* CSS for the entire page */
body {
    font-family: "Times New Roman", Times, serif !important;
}

.text-header_title {
    font-size: 18px !important;
    font-family: "Times New Roman", Times, serif !important;
    width: 31%;
    padding: 10px !important;
    font-weight: bold;
}

.text-header {
    font-size: 16px !important;
    padding: 1px !important;
    line-height: 1.4;
}

.colum3 {
    width: 12%;
    padding: 5px !important;
    font-size: 15px !important;
}

.table {
    width: 100%;
    max-width: 100%;
    background-color: transparent;
    border-collapse: collapse !important;
    margin: 0;
}

.table td,
.table th {
    text-align: center;
    padding: 3px;
    vertical-align: middle;
    background-color: transparent;
}

.table-bordered {
    border: 1px solid #333;
}

/* First table styles */
.no-bottom-border {
    margin-bottom: 15px !important;
}

/* Second table styles */
.no-interior-borders {
    margin-top: 0 !important;
}

/* Remove interior borders */
.no-interior-borders td,
.no-interior-borders th {
    border: none;
}

/* First table should keep interior borders */
.no-bottom-border td,
.no-bottom-border th {
    border: 1px solid #333;
}

.align-middle {
    vertical-align: middle !important;
}

/* Style for logo */
img.img-fluid {
    padding: 3px;
    max-width: 100px;
    margin: 0 auto;
    display: block;
}

/* Ensure no margin between tables */
.table {
    margin-bottom: 0 !important;
}

/* Adjust border for table cells */
.no-bottom-border tr:last-child td {
    border-bottom: 1px solid #333 !important;
}

/* Ensure all borders are 1px thick */
.table-bordered {
    border: 1px solid #333;
}

/* Underline input style */
.underline-input {
    display: inline-block;
    width: 850px;
    height: 1px;
    border-bottom: 1px solid #000;
}

/* Loading and error states */
.loading-indicator,
.error-message {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    margin: 20px;
}

.error-message {
    color: #d9534f;
    border: 1px solid #d9534f;
    border-radius: 4px;
    background-color: #f9f2f2;
}

/* Print media query to hide elements */
@media print {
    .no-print {
        display: none !important;
    }

    /* Adjust margins for print layout */
    .table {
        margin: 0 !important;
    }

    .no-bottom-border {
        margin-bottom: 10px !important;
    }

    /* Set print margins to 0.1 inches */
    @page {
        margin: 0.1in;
    }

    /* Scale content to 86% */
    [ref="printContent"] {
        transform: scale(0.86);
        transform-origin: top left;
    }

    /* Add page break styling */
    .page-break {
        page-break-before: always;
    }
}

.no-data-message {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    padding: 20px;
}
</style>