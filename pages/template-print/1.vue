<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" :ref="`printContent${index}`" class="print-page">
            <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                <tr>
                    <td rowspan="2" class="align-middle text-header" style="width: 12%">
                        <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                    </td>
                    <td rowspan="3" class="text-center align-middle text-header_title">
                        GIẤY HẸN PHỎNG VẤN
                        <br />
                        面試通知單
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
                        ADHR02-SP001-13<br />
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
                        3
                    </td>
                    <td class="colum3 align-middle">
                        Trang 頁次 <br />
                        1/1
                    </td>
                </tr>
            </table>
            <table class="table table-bordered no-interior-borders" style="margin-top: 10px;">
                <tr>
                    <td colspan="4" style="text-align: left;">Mời anh (chị): {{ candidate.candidate_name }}</td>
                    <td colspan="4" style="text-align: left;">Vị trí ứng tuyển: {{ candidate.department }} ({{ candidate.position }})</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: left;">請先生（小姐）：</td>
                    <td colspan="4" style="text-align: left;">申請職位：</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Vào lúc: ............... giờ ............... ngày ............... tháng ............... năm ...............
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">時間：............... 點 ............... 日 ............... 月 ............... 年 ............... </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Đến tại trụ sở chính công ty : <strong>Thuận Hòa –
                            Truông Mít – Dương Minh Châu – Tây Ninh</strong></td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">至公司地址：<strong>Thuan Hoa, Truong Mit, Duong Minh Chau, Tay
                            Ninh</strong></td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Điện thoại: <strong>02763.721.111 (134, 139)</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">電話：<strong>02763.721.111 (134, 139)</strong></td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Lý do 理由:
                    <div style="display: flex; gap: 20px; margin-top: 5px;">
                        <label><input type="checkbox" readonly @click.prevent style="margin: 5px;"> Phỏng vấn 面試</label>
                        <label><input type="checkbox" readonly @click.prevent  style="margin: 5px;"> Hoàn tất hồ sơ 繳交面試相關檔案</label>
                        <label>
                            <input type="checkbox" readonly @click.prevent style="margin: 5px;"> Khác 其他:
                            <span class="underline-input"></span>
                        </label>
                    </div>
                </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: right; padding-bottom: 60px; padding-top: 5px;">
                        <div style="text-align: center; padding-left: 340px;">
                            <strong>CANSPORTS, NGÀY 日 {{ String(new Date().getDate()).padStart(2, '0') }} THÁNG 月 {{ String(new Date().getMonth() + 1).padStart(2, '0') }} NĂM 年 {{ new Date().getFullYear() }}
                                <br />
                                BỘ PHẬN TÀI NGUYÊN NHÂN LỰC
                                <br />
                                人力資源部
                            </strong>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left; font-style: italic; font-size: 13px;">*Lưu ý : Giấy hẹn có giá trị đến hết
                        ngày: Ngày .......
                        tháng ....... năm .......<br />
                        注意：此通知有效日只至：..........年............月...........日</td>
                </tr>
            </table>
            <!-- Add page break between candidates except for the last one -->
            <div v-if="index < candidates.length - 1" class="page-break"></div>
        </div>
        <div class="print-controls" v-if="!isPrinting">
            <v-btn color="primary" dark @click="printDocument">
                <v-icon left>mdi-printer</v-icon> {{ $t("Print All") }} ({{ candidates.length }})
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    layout: "print",
    data() {
        return {
            candidates: [],
            isPrinting: false
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
        window.addEventListener('beforeprint', () => this.isPrinting = true);
        window.addEventListener('afterprint', () => this.isPrinting = false);
    },

    beforeDestroy() {
        window.removeEventListener('beforeprint', () => this.isPrinting = true);
        window.removeEventListener('afterprint', () => this.isPrinting = false);
    },
    
    methods: {
        async fetchCandidateData(ids) {
            try {
                const idArray = typeof ids === 'string' ? ids.split(',') : [ids];
                const responses = await Promise.all(
                    idArray.map(id => this.$axios.get(`http://gmo021.cansportsvg.com/api/vg-recuitingReport/getDataById/${id}`))
                );
                
                this.candidates = responses.map(({ data }) => ({
                    candidate_name: data.candidate_name || '',
                    position: data.position || '',
                    department: data.tmp_departid || ''
                }));
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
    margin-bottom: 15px !important; /* Add space between first and second table */
}

/* Second table styles */
.no-interior-borders {
    margin-top: 0 !important; /* Remove the top margin to bring tables closer */
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

.table {
    margin-bottom: 0 !important;
}

.no-bottom-border tr:last-child td {
    border-bottom: 1px solid #333 !important;
}

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

/* Hide print controls when printing */
@media print {
    .print-controls {
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
        size: A5 landscape; /* Changed to landscape orientation */
    }
    
    /* Scale content to 86% */
    [ref^="printContent"] {
        transform: scale(0.86);
        transform-origin: top left;
    }
    
}

/* Add styles for multiple pages */
.print-page {
    page-break-after: always;
}

.page-break {
    page-break-after: always;
    break-after: page;
}

@media print {
    .print-page {
        margin-bottom: 0;
    }

    .print-page:last-child {
        page-break-after: avoid;
    }
}
</style>