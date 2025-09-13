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
    <div class="page-container" v-else>
        <div ref="printContent" class="print-page"  v-for="(candidate, index) in processedCandidates" :key="index">
            <!-- Thông tin cá nhân -->
            <table class="table table-bordered main-table">
                <thead>
                    <tr>
                        <td class="logo-cell">
                            <img width="75px" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage"/>
                        </td>
                        <td class="title-cell" colspan="5">
                            員工離職回廠紀錄與工作承諾書 <br />
                            BẢN CAM KẾT VỀ VIỆC NHÂN VIÊN NGHỈ VIỆC QUAY TRỞ LẠI CÔNG TY LÀM VIỆC
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colspan="6" class="section-title">THÔNG TIN CÁ NHÂN 個人基本資料:</th>
                    </tr>
                    <tr>
                        <td class="label" style="text-align: center;">Họ tên  <br />姓名</td>
                        <td style="text-align: center;"> {{ candidate.name }}</td>
                        <td style="text-align: center;" class="label">CCCD  <br />身分證號</td>
                        <td style="text-align: center;"> {{ candidate.cccd }}</td>
                        <td style="text-align: center;" class="label">Số lần vào công ty  <br />進廠次數</td>
                        <td style="text-align: center;">{{ candidate.times_in_company }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" class="label">Ngày vào công ty  <br />原入廠日</td>
                        <td style="text-align: center;">{{ formatDate(candidate.join_date) }}</td>
                        <td style="text-align: center;" class="label">Mã CNV cũ  <br />原員工編號</td>
                        <td style="text-align: center;">{{ candidate.emp_id }}</td>
                        <td style="text-align: center;" class="label">Bộ phận cũ  <br />原任職單位</td>
                        <td style="text-align: center;">{{ candidate.dept_name }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" class="label">Ngày thôi việc  <br />原離廠日</td>
                        <td style="text-align: center;">{{ formatDate(candidate.resign_date) }}</td>
                        <td style="text-align: center;" class="label">Loại thôi việc  <br />離職類型</td>
                        <td style="text-align: center;">{{ displayErType(candidate.er_type_resign) }}</td>
                        <td style="text-align: center;" class="label">Lý do thôi việc  <br />離職原因</td>
                        <td style="text-align: center;"><template v-if="candidate.resign_reason_text">{{ candidate.resign_reason_text }}</template></td>
                    </tr>
                    
                    <!-- Khen thưởng -->
                    <tr>
                        <td colspan="6" class="section-title">KHEN THƯỞNG VÀ XỬ PHẠT 獎勵與處分</td>
                    </tr>
                    <tr>
                        <td rowspan="2" style="text-align: center;">Khen thưởng  <br />獎勵</td>
                        <td style="text-align: center;" >Ghi công lớn (lần) <br/>
                            大功（次）
                        </td>
                        <td style="text-align: center;">Ghi công nhỏ (lần)  <br/>
                            小功（次）
                        </td>
                        <td style="text-align: center;" colspan="2">Khen thưởng (lần) <br/>
                            嘉獎（次）
                        </td>
                        <td style="text-align: center;" colspan="2">Loại khác (lần) <br/>
                            其他（次）
                        </td>
                        
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td colspan="2"></td>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" rowspan="2" >Xử phạt  <br />處分</td>
                        <td style="text-align: center;">Khiển trách bằng miệng (lần) <br/>
                            口頭警告（次）
                        </td>
                        <td style="text-align: center;">Khiển trách bằng văn bản (lần) <br/>
                            書面警告（次）
                        </td>
                        <td style="text-align: center;" colspan="2">Kéo dài thời hạn nâng lương 6 tháng hoặc  hạ chức (lần) <br/>
                            延後六個月調薪或調（次）
                        </td>
                        <td style="text-align: center;" colspan="2">Loại khác (lần) <br/>
                            其他（次）
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td colspan="2"></td>
                        <td colspan="2"></td>
                    </tr>
                    
                    <!-- Xác nhận -->
                    <tr>
                        <th colspan="6" class="section-title">
                            XÁC NHẬN CỦA CHỦ QUẢN CŨ CÓ PHỎNG VẤN KHÔNG: 原單位主管是否進行面試
                        </th>
                    </tr>
                    <tr>
                        <td colspan="5" class="checkbox-col">
                            <div class="checkbox-wrapper">
                                <label class="checkbox-item"><input type="checkbox" readonly @click.prevent /> Có nhận vào bộ phận cũ 是, 回原單位就職</label>
                                <label class="checkbox-item"><input type="checkbox" readonly @click.prevent /> Chuyển bộ phận khác 否, 轉介其他單位</label>
                                <label class="checkbox-item reason-label"><input type="checkbox" readonly @click.prevent /> Lý do khác 否, 請列出具體原因  <span class="line"></span></label>
                            </div>
                        </td>
                        <td style="vertical-align: top; text-align: center;">Ký tên 簽名</td>
                    </tr>
                    
                    <!-- Cam kết -->
                    <tr>
                        <td colspan="5" class="label" style="min-width: 400px; max-width: 600px;">
                            Nội dung tự kiểm điểm và cam kết 反思與承諾
                        </td>
                        <td style="text-align: center; min-width: 200px; max-width: 300px;">
                            Vâng, tôi đã hiểu 我已經明白了 <br/>
                            (đánh dấu sau khi xác nhận)（確認後打勾）
                        </td>
                         <!-- <td colspan="5" class="label" >
                            Nội dung tự kiểm điểm và cam kết 反思與承諾
                        </td>
                        <td style="text-align: center; ">
                            Vâng, tôi đã hiểu 我已經明白了 <br/>
                            (đánh dấu sau khi xác nhận)（確認後打勾）
                        </td> -->
                    </tr>
                    <tr>
                        <td colspan="5">1. Tôi hiểu hành vi của mình ảnh hưởng đến công việc và quyền lợi.<br />我已經知道自己的行為會影響工作表現和待遇。</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="5">2. Tôi hiểu thái độ làm việc ảnh hưởng đến đồng nghiệp và nhóm.<br />我已經知道自己的工作態度會影響團隊和同事。</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="5">3. Lần này công ty cho tôi cơ hội quay lại, tôi cam kết tuân thủ quy định công ty và hoàn thành công việc do chủ quản
                            giao. <br/>這次公司給我機會回來工作，我承諾遵守公司規定並完成主管交代的工作。</td>
                            <td></td>
                        </tr>
                        <tr class="final-note">
                            <td colspan="6" style="text-align: left; padding: 12px 8px; min-height: 120px; vertical-align: bottom;">
                                Chữ ký xác nhận của nhân viên 員工簽名確認 <br />
                                Ngày ký 簽署日期 <br /><br /><br /><br />
                                Người ghi biên bản / phỏng vấn ký tên <br /> 面談／紀錄人員簽名 <br /><br /><br />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="page-break"></div>
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
                times_in_company: '',
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
                cccd: '',
                er_type_resign: ''
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
                    // Try with emp_id first
                    let resignData = await this.$axios.post(
                    this.api + 'GetDataByCCCDResign',
                    { emp_id: candidate.emp_id }
                    );
                    
                    // If no data found with emp_id, try with emp_id_old
                    if (!resignData.data || resignData.data.length === 0) {
                        resignData = await this.$axios.post(
                        this.api + 'GetDataByCCCDResign',
                        { emp_id: candidate.emp_id_old }
                        );
                    }
                    
                    // Process candidate if we found resignation data with either ID
                    if (resignData.data && resignData.data.length > 0) {
                        const processedCandidate = await this.processCandidate(candidate);
                        if (processedCandidate) {
                            processedData.push(processedCandidate);
                        }
                    }
                }
                
                this.processedCandidates = processedData;
                console.log(this.processedCandidates);
                
                // if (processedData.length === 0) {
                //     setTimeout(() => {
                //         window.close();
                //     }, 10000); // Close window after 3 seconds
                // }
                
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
        async processCandidate(candidateData) {
            try {
                // Try with emp_id first
                let resignData = await this.$axios.post(
                this.api + 'GetDataByCCCDResign',
                { emp_id: candidateData.emp_id }
                );
                
                // If no data found, try with emp_id_old
                if (!resignData.data || resignData.data.length === 0) {
                    resignData = await this.$axios.post(
                    this.api + 'GetDataByCCCDResign',
                    { emp_id: candidateData.emp_id_old }
                    );
                }
                
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
                
                // Try to get times_in_company with emp_id first
                let timesResponse = await this.$axios.get(
                `${this.api}checkCccd/${candidateData.emp_id}`
                );
                
                // If no data found or count is 0, try with emp_id_old
                if (!timesResponse.data || timesResponse.data.count === 0) {
                    timesResponse = await this.$axios.get(
                    `${this.api}checkCccd/${candidateData.emp_id_old}`
                    );
                }
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
                    other_reason: '',
                    cccd: resignInfo ? resignInfo.er_numberid : '',
                    er_type_resign: resignInfo ? resignInfo.er_type_resign : ''
                };
            } catch (error) {
                console.error('Error processing candidate:', error);
                return null;
            }
        },
        
        printDocument() {
            window.print();
        },
        displayErType(value) {
            try {
                if (!value) return '';
                // If already an object
                if (typeof value === 'object') {
                    return value.vi || '';
                }
                // If it's a JSON string, parse it
                if (typeof value === 'string') {
                    const parsed = JSON.parse(value);
                    return (parsed && parsed.vi) ? parsed.vi : value;
                }
                return value;
            } catch (e) {
                // If parsing fails, return original value
                return value;
            }
        },
    }
};
</script>

<style>
body {
    font-family: "Times New Roman", Times, serif;
}

.table {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
    
}

.table td,
.table th {
    border: 1px solid #000;
    /* text-align: left; */
    padding: 5px;
    vertical-align: middle;
}

.table.no-border td,
.table.no-border th {
    border: none !important;
}

.logo-cell {
    width: 12%;
    text-align: center;
    vertical-align: middle;
}
.title-cell {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}
.section-title {
    font-weight: bold;
    background: #f0f0f0;
    text-align: left;
}
.label {
    text-align: left;
    width: 16.66%;
}
.label_khen_thuong {
    text-align: left;
    width: 20%;
}
.checkbox-col {
    margin-bottom: 10px;
    text-align: left;
    padding: 5px;
}

.checkbox-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
}

.checkbox-item input[type="checkbox"] {
    margin: 0;
    width: 16px;
    height: 16px;
}

/* Ensure uniform row heights in the main table */
.main-table td,
.main-table th {
    min-height: 40px; /* minimum height for each cell */
    height: 40px;     /* fixed visual height to align rows */
    line-height: 1.2;
    padding-top: 6px;
    padding-bottom: 6px;
    box-sizing: border-box;
    vertical-align: middle;
}

/* Make sure rowspan cells keep consistent sizing */
.main-table tr > .label {
    vertical-align: middle;
}
.reason-label {
    display: flex;
    align-items: center;
    gap: 8px;
}

.reason-label .line {
    flex: 1; /* Tự giãn chiếm hết chiều ngang */
    border-bottom: 1px solid #000; /* Gạch ngang */
    height: 1em;
}

/* Thead border customization */
.main-table thead td,
.main-table thead th {
    border: none;
}

.main-table thead tr:last-child td,
.main-table thead tr:last-child th {
    border-bottom: 1px solid #000;
}

/* Keep other table borders */
.main-table tbody td,
.main-table tbody th,
.main-table tfoot td {
    border: 1px solid #000;
}

@media print {
    .page-break {
        page-break-after: always;
    }
}
</style>
