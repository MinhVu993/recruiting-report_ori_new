<template>
    <div>
        <!-- Add no-print class to button -->
        <v-btn
            color="primary"
            class="mb-3 no-print"
            @click="downloadPDF"
            :loading="isProcessing"
            :disabled="!pdfBlob"
        >
            <v-icon left>mdi-download</v-icon>
            Tải xuống PDF
        </v-btn>

        <!-- Printable content -->
        <div ref="printContent">
            <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                <tr>
                    <td rowspan="2" class="align-middle text-header" style="width: 12%">
                        <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                    </td>
                    <td rowspan="3" class="text-center align-middle text-header_title">
                        DANH SÁCH BÙ QUẸT THẺ CÔNG NHÂN MỚI
                        <br>
                        新進員工補刷卡名單
                    </td>
                    <td>
                        Ngày thiết lập (sửa đổi) <br />
                        (修)訂日期
                    </td>
                    <td>15.04.2024</td>
                </tr>
                <tr>
                    <td>
                        Mã số tài liệu <br />
                        文件編號
                    </td>
                    <td>
                        HR02-SP001-11<br />
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
                        2
                    </td>
                    <td class="colum3 align-middle">
                        Trang 頁次 <br />
                        1
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: left;">Ngày điền biểu/填表日期: {{ today }}</td>
                </tr>
            </table>
        
            <table class="table table-bordered no-top-border">
                <tr>
                    <th> STT <br /> 序號 </th>
                    <th> Số thẻ <br /> 工號 </th>
                    <th> Họ và tên <br /> 姓名 </th>
                    <th> BỘ PHẬN <br /> 部門 </th>
                    <th> CHỨC VỤ <br /> 職務 </th>
                    <th> GHI CHÚ <br /> 備註 </th>
                </tr>
                <tr v-for="(item, index) in formattedData" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.empno }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.dept_name }}</td>
                    <td>{{ item.duty }}</td>
                    <td>{{ item.note }}</td>
                </tr>
            </table>
            <table class="signature-table">
                <tr>
                    <td class="signature-cell">
                        Chủ quản BP Tài Nguyên Nhân Lực <br />人力資源部
                    </td>
                    <td class="signature-cell">
                        Người lập biểu <br />填表人
                    </td>
                </tr>
                <tr>
                    <td class="signature-space"></td>
                    <td class="signature-space"></td>
                </tr>
                <tr>
                    <td colspan="2" class="signature-note">
                        Chú ý: Người lập biểu ➜ Chủ quản BP Tài Nguyên Nhân Lực <br>
                        表單流程：填表人 ➜ 人力資源部
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import dayjs from "dayjs";
import html2pdf from 'html2pdf.js';

export default {
    layout: "print",
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            printData: [],
            today: dayjs().format("YYYY-MM-DD"),
            imageLoaded: false,
            isProcessing: false,
            pdfBlob: null,
        };
    },
    computed: {
        formattedData() {
            return this.printData.map(item => {
                const deptName = item.name ? JSON.parse(item.name) : {};
                const dutyName = item.duty_name ? JSON.parse(item.duty_name) : {};
                
                return {
                    empno: item.newEmpno,
                    name: item.candidate_name,
                    dept_name: deptName.vi || '',
                    duty: dutyName.vi || '',
                    note: ''
                };
            });
        }
    },
    watch: {
        formattedData: {
            handler(newData) {
                if (newData && newData.length > 0) {
                    this.$nextTick(() => {
                        this.tryPrint();
                    });
                }
            },
            immediate: false
        }
    },
    mounted() {
        // Load image first
        const img = new Image();
        img.src = './logo.png';
        img.onload = () => {
            this.imageLoaded = true;
            this.getDateCandidate();
        };
    },
    methods: {
        async getDateCandidate() {
            try {
                const res = await this.$axios.post(this.api + 'printUnswiped', {
                    act_en_date: this.$route.query.data,
                });
                this.printData = res.data;
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },  
        async tryPrint() {
            if (!this.imageLoaded || this.printData.length === 0) return;
            
            this.isProcessing = true;
            try {
                // Use ref to target only printable content
                const element = this.$refs.printContent;
                // Generate PDF first
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: `BQT-${dayjs().format('YYYYMMDD')}.pdf`,
                    image: { type: 'jpeg', quality: 1.0 },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        logging: false,
                        backgroundColor: '#FFFFFF'
                    },
                    jsPDF: { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true
                    }
                };

                const pdf = await html2pdf().from(element).set(opt).outputPdf('blob');
                this.pdfBlob = pdf;

            } catch (error) {
                console.error('Error in PDF generation/printing:', error);
                alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.');
            } finally {
                this.isProcessing = false;
            }
        },

        downloadPDF() {
            if (!this.pdfBlob) return;
            
            try {
                const pdfUrl = URL.createObjectURL(this.pdfBlob);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `BQT-${dayjs().format('YYYYMMDD')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 1000);
            } catch (error) {
                console.error('Error downloading PDF:', error);
                alert('Có lỗi xảy ra khi tải PDF. Vui lòng thử lại.');
            }
        },

        async printDocument() {
            if (!this.pdfBlob) return;
            try {
                const pdfUrl = URL.createObjectURL(this.pdfBlob);
                const printWindow = window.open(pdfUrl, '_blank');
                if (printWindow) {
                    printWindow.onload = () => {
                        printWindow.print();
                        setTimeout(() => {
                            URL.revokeObjectURL(pdfUrl);
                        }, 1000);
                    };
                }
            } catch (error) {
                console.error('Error in printing:', error);
            }
        }
    }
};
</script>
<style>
/* css cả trang font-family: times new roman */
body {
    font-family: "Times New Roman", Times, serif !important;
}

/* Add rule for Chinese characters */
.chinese {
    font-family: Kaiti, "宋体", serif !important;
}

/* Override other font declarations */
.text-header_title,
.text-header,
.colum3,
.table th b,
.signature-cell {
    font-family: "Times New Roman", SimSun, "宋体", Times, serif !important;
}

.print-layout th {
    font-family: "Times New Roman", Times, serif !important;
}

.v-application {
    line-height: 1.2;
}

.text-header_title {
    font-size: 18px !important;
    font-family: "Times New Roman", Times, serif !important;
    width: 31%;
    padding: 15px !important;
    font-weight: bold;
}

.text-header {
    font-size: 16px !important;
    padding: 8px !important;
    line-height: 1.4;
}

.colum3 {
    width: 12%;
    padding: 8px !important;
    font-size: 15px !important;
}

.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
    border-collapse: collapse !important;
    /* box-shadow: 0 1px 3px rgba(0,0,0,0.1); */
}

.table td,
.table th {
    text-align: center;
    padding: 5px;
    vertical-align: middle;
    border: 1px solid #333;
    background-color: transparent !important;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #333;
}

.table tbody+tbody {
    border-top: 2px solid #333;
}

.table-bordered {
    border: 1px solid #333;
}

.table-bordered td,
.table-bordered th {
    border: 1px solid #333;
}

.table-bordered2 td,
.table-bordered2 th {
    border-top: none;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    border-bottom: 1px solid #333;
}

/* Style cho header của bảng dữ liệu */
.table th b {
    /* font-weight: bold; */
    text-transform: uppercase;
    font-size: 15px;
}

.align-middle {
    vertical-align: middle !important;
}

tr.textMid td {
    font-size: 12px !important;
    /* text-align: mid; */
}

/* Thêm style cho logo */
img.img-fluid {
    padding: 3px;
    max-width: 100px;
    margin: 0 auto;
    display: block;
}

.signature-cell {
    padding: 10px 50px;
    vertical-align: middle !important;
    text-align: center !important;
}
.signature-title {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.5;
    display: inline-block;
}

/* Thêm các styles mới */
.no-bottom-border {
    border-bottom: 1px solid #333 !important;
}

.no-top-border {
    border-top: none !important;
}

/* Đảm bảo không có khoảng cách giữa các bảng */
.table {
    margin-bottom: 0 !important;
}

/* Điều chỉnh lại border cho các cell trong bảng */
.no-bottom-border tr:last-child td {
    border-bottom: 1px solid #333 !important;
}

.no-top-border tr:first-child td,
.no-top-border tr:first-child th {
    border-top: none !important;
}

/* Cập nhật style cho bảng chữ ký */
.signature-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

.signature-space {
    height: 150px;
    border: none !important;
}

.signature-note {
    text-align: left;
    padding: 10px;
    white-space: nowrap;
}

/* Đảm bảo tất cả border có độ dày 1px */
.table-bordered {
    border: 1px solid #333;
}

.table td,
.table th {
    border: 1px solid #333;
}

.table thead th {
    border-bottom: 1px solid #333;
}

.table tbody+tbody {
    border-top: 1px solid #333;
}

/* Add loading state styles */
.processing {
    opacity: 0.7;
    pointer-events: none;
}

/* Add button style */
.mb-3 {
    margin-bottom: 1rem !important;
}

/* Add print media query to hide elements */
@media print {
    .no-print {
        display: none !important;
    }
}
</style>