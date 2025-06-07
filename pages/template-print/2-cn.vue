<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" class="page-container">
            <div ref="printContent" class="print-page">
                <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                    <tr>
                        <td rowspan="2" class="align-middle text-header" style="width: 12%">
                            <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                        </td>
                        <td rowspan="3" class="text-center align-middle text-header_title">
                            BẢNG GHI NHẬN TUYỂN CHỌN CÔNG NHÂN
                            <br />
                              甄選紀錄表 (工人)
                        </td>
                        <td>
                            Ngày thiết lập (sửa đổi) <br />
                            制(修)訂日期
                        </td>
                        <td>23.03.2024</td>
                    </tr>
                    <tr>
                        <td>
                            Mã số tài liệu <br />
                            文件編號
                        </td>
                        <td>
                            ADHR02-SP001-09<br />
                        </td>
                    </tr>
                    <tr>
                        <td class="colum3 align-middle">
                            Bộ phận soạn thảo <br />
                            編訂部門 <br />
                            Tài Nguyên Nhân Lực <br />
                            人力資源部 <br />
                        </td>
                        <td class="colum3 align-middle">
                            Phiên bản 版本<br />
                            7
                        </td>
                        <td class="colum3 align-middle">
                            Trang 頁次 <br />
                            1/1
                        </td>
                    </tr>
                </table>
                <table class="table" style="margin-top: 20px;">
                    <tr>
                        <td style="text-align: left; width: 33.33%; border: none;">
                            Ngày điền biểu 填表日期: {{ candidate.data.key_in_date || '' }}
                        </td>
                        <td style="text-align: left; width: 33.33%; border: none;">
                            Vị trí ứng tuyển 應徵工作: 
                        </td>
                        <td style="text-align: left; width: 33.33%; border: none;">
                            Nhân viên ADHR phỏng vấn ADHR 面試人員:
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered" style="margin-top: 10px;">
                    <tr>
                        <td colspan="12" style="text-align: center;"><strong>THÔNG TIN CÁ NHÂN 個人資料</strong></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Họ tên 姓名: {{ candidate.data.candidate_name || '' }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Năm sinh 出生年月: {{ candidate.data.dateofbirth || '' }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px; ">
                            Số CMND/CCCD 身份證字號: {{ candidate.data.emp_id || '' }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: left;">Học vấn 學歷
                            <div style="display: flex; gap: 40px; margin-top: 5px;">
                                <label>
                                    <input type="checkbox"  readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '001'"
                                           >
                                    Tiểu học 小學
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '002' || candidate.data.edu === '003'"
                                           >
                                    THCS 初中畢業
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '004' || candidate.data.edu === '005'"
                                           >
                                    THPT 高中畢業
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '006'"
                                           >
                                    Trung Cấp 中專
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '007'"
                                           >
                                    Cao đẳng 專科
                                </label>
                                <label>
                                    <input type="checkbox" readonly @click.prevent
                                           style="margin: 5px;"
                                           :checked="candidate.data.edu === '008'"
                                           >
                                    Đại học 大學
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="9" style="text-align: left; padding-bottom: 20px;">
                            Địa chỉ thường trú 戶籍住址: {{ candidate.data.regAddress || '' }}
                        </td>
                        <td colspan="3" style="text-align:left; ">Điện thoại di động 手機: {{ candidate.data.regTel || candidate.data.commTel || '' }}</td>
                    </tr>
                    <tr>
                        <td colspan="9" style="text-align: left;padding-bottom: 20px;">Địa chỉ liên hệ 聯絡地址: {{
                            candidate.data.commAddress || candidate.data.regAddress || '' }}</td>
                        <td colspan="3" style="text-align:left;">Địa chỉ email: Email 地址:</td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: left;">Kinh nghiệm công việc工作經驗:
                            <div style="display: flex; gap: 40px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent
                                        :checked="candidate.data.ex_company || candidate.data.ex_position || candidate.data.work_exp"
                                        style="margin: 5px;"> Có 有</label>
                                <span style="margin: 5px;">
                                    Tên công ty 公司名稱: <span :style="{'font-size': candidate.data.ex_company && candidate.data.ex_company.length > 30 ? '0.85em' : '1em'}">{{ candidate.data.ex_company || '________________________' }}</span>
                                    &nbsp;&nbsp;
                                    Chức vụ 職務: {{ candidate.data.ex_position || '________________________' }}
                                    &nbsp;&nbsp;
                                    Kinh nghiệm 經驗: {{ candidate.data.work_exp ? candidate.data.work_exp + ' năm 年' :
                                    '_____________________ năm 年' }}
                                </span>
                                <label><input type="checkbox" readonly @click.prevent
                                        :checked="!candidate.data.ex_company && !candidate.data.ex_position && !candidate.data.work_exp"
                                        style="margin: 5px;">Không 否</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: left;">Địa chỉ liên hệ 聯絡地址:
                            <div style="display: flex; gap: 40px; margin-top: 5px;">
                                <label>1. Bạn nghĩ an toàn lao động có quan trọng trong công việc không?<br />
                                    &nbsp;&nbsp;&nbsp;您認為職場安全衛生是否重要？
                                    <input type="checkbox" readonly @click.prevent style="margin: 10px; margin-left: 400px;">Có 有
                                    <input type="checkbox" readonly @click.prevent style="margin: 10px;">Không 否
                                </label>
                            </div>
                            <div style="display: flex; gap: 40px; margin-top: 25px;">
                                <label>2. Bạn có sẵn sàng tham gia các khóa học về an toàn lao động do công ty tổ chức không?<br />
                                    &nbsp;&nbsp;&nbsp;您願意參加公司組織的職場安全衛生課程嗎？
                                    <input type="checkbox" readonly @click.prevent style="margin: 10px; margin-left: 305px;">Có 有
                                    <input type="checkbox" readonly @click.prevent style="margin: 5px;">Không 否
                                </label>

                            </div>
                        </td>
                        <td colspan="4" style="text-align: left; vertical-align: top;">Đánh giá 評價
                            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;"> Đạt 適任</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Không đạt 不適任 </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">Xác nhận của ADHR <br/> 人力資源部確認</td>
                        <td colspan="4">Xác nhận của chủ quản bộ phận / cấp sở phỏng vấn <br /> 面試處/部級主管確認</td>
                        <td colspan="4">Xác nhận của chủ quản đơn vị <br/> 面試單位主管確認</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.hr_ac_qu === 'yes'"> Tuyển dụng 錄用 
                        </td>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.hr_ac_qu === ''"> Không tuyển dụng 不錄用
                        </td>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.dp_ac_qu === 'yes'"> Tuyển dụng 錄用
                        </td>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.dp_ac_qu === ''"> Không tuyển dụng 不錄用
                        </td>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.hr_ac_qu === 'yes'"> Tuyển dụng 錄用
                        </td>
                        <td colspan="2">
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.data.hr_ac_qu === ''"> Không tuyển dụng 不錄用
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="padding-bottom: 70px;">Ký tên 簽名: </td>
                        <td colspan="4" style="padding-bottom: 70px;">Ký tên 簽名: </td>
                        <td colspan="4" style="padding-bottom: 70px;">Ký tên 簽名: </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align:left;">Trình tự trình ký: Chủ quản đơn vị phỏng vấn xác nhận ➜ Chủ
                            quản bộ phận/cấp sở phỏng vấn xác nhận ➜ Bộ phận Tài Nguyên Nhân Lực xác nhận<br />
                            簽認流程: 面試單位主管確認 ➜ 面試處/部級主管確認 ➜ 人力資源部確認
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
            formData: {
                fill_date: '',
                position: '',
                candidate_name: '',
                dateofbirth: '',
                emp_id: '',
                address: '',
                phone: '',
                regAddress: '',
                email: '',
                work_exp: '',
                ex_company: '',
                ex_position: '',
                candidate_id: null,
                edu: '',
                work_exp: '',
                ex_company: '',
                ex_position: '',
                hr_ac_qu:'',
                dp_ac_qu:''
            },
            candidates: []
        };
    },
    async mounted() {
        try {
            const { ids, id } = this.$route.query;
            if (ids || id) {
                await this.fetchCandidateData(ids || id);
            }
        } catch (error) {
            console.error("Error processing candidates data:", error);
        }
    },
    methods: {
        async fetchCandidateData(ids) {
            try {
                const idArray = typeof ids === 'string' ? ids.split(',') : [ids];
                this.candidates = [];
                
                for (const id of idArray) {
                    const response = await this.$axios.get(`http://gmo021.cansportsvg.com/api/vg-recuitingReport/getDataById/${id}`);
                    if (response && response.data) {
                        if (response.data.position && response.data.position.toLowerCase() === 'worker') {
                            this.candidates.push(response);
                        }
                    }
                }
                if (this.candidates) {
                    const candidateData = this.candidates[0].data;
                    this.formData = {
                        fill_date: candidateData.key_in_date || '',
                        position: candidateData.position || '',
                        candidate_name: candidateData.candidate_name || '',
                        dateofbirth: candidateData.dateofbirth || '',
                        emp_id: candidateData.emp_id || '',
                        address: candidateData.commAddress || candidateData.regAddress || '',
                        phone: candidateData.commTel || candidateData.regTel || '',
                        regAddress: candidateData.regAddress || '',
                        email: '',  // Not provided in the API response
                        work_exp: candidateData.work_exp || '',
                        ex_company: candidateData.ex_company || '',
                        ex_position: candidateData.ex_position || '',
                        candidate_id: candidateData.id || null,
                        edu: candidateData.edu || '',
                        hr_ac_qu: candidateData.hr_ac_qu || '',
                        dp_ac_qu: candidateData.dp_ac_qu || ''
                    };
                }
            } catch (error) {
                console.error("Error fetching candidate data:", error);
            }
        },
        
        printDocument() {
            this.isPrinting = true;
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

/* Set font size to 14px for the specified tables */
.table[style*="margin-top: 20px"],
.table.table-bordered[style*="margin-top: 10px"] {
    font-size: 16px !important;
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

/* Ensure all borders are visible in the specified table */
.table.table-bordered[style*="margin-top: 10px"] {
    font-size: 16px !important;
    border-collapse: collapse !important;
}

.table.table-bordered[style*="margin-top: 10px"] td,
.table.table-bordered[style*="margin-top: 10px"] th {
    border: 1px solid #333 !important;
    border-collapse: collapse !important;
}

/* First table styles */
.no-bottom-border {
    margin-bottom: 15px !important;
    /* Add space between first and second table */
}

/* Second table styles */
.no-interior-borders {
    margin-top: 0 !important;
    /* Remove the top margin to bring tables closer */
}

/* Remove interior borders * /

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
    width: 300px;
    height: 1px;
    border-bottom: 1px solid #000;
    margin-bottom: 0px;
    margin-left: 5px;
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
        size: A4 landscape;
    }

    /* Scale content to 86% */
    [ref="printContent"] {
        transform: scale(0.86);
        transform-origin: top left;
    }
}

/* Add styles for multi-page printing */
.page-container {
    page-break-after: always;
    margin-bottom: 20px;
}

.page-container:last-child {
    page-break-after: avoid;
}

.print-page {
    width: 100%;
}

@media print {
    .page-container {
        page-break-after: always;
        margin: 0;
        padding: 0;
    }
    
    /* ...existing code... */
}
</style>