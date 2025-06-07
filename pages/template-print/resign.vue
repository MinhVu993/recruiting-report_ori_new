<template>
    <div>
        <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
            <tr>
                <td rowspan="2" class="align-middle text-header" style="width: 12%">
                    <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                </td>
                <td rowspan="3" class="text-center align-middle text-header_title">
                    DANH SÁCH CÔNG NHÂN VIÊN THÔI VIỆC
                    <br>
                    員工離職名單
                </td>
                <td>
                    Ngày thiết lập (sửa đổi) <br />
                    (修)訂日期
                </td>
                <td>15.04.2019</td>
            </tr>
            <tr>
                <td>
                    Mã số tài liệu <br />
                    文件編號
                </td>
                <td>
                    HR02-SP008-02<br />
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
                    1/3
                </td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: left;">Từ/從: {{ dateRange }}</td>
            </tr>
        </table>
     
        <table class="table table-bordered no-top-border">
            <tr>
                <th> STT <br />序號 </th>
                <th> Số thẻ <br />工號 </th>
                <th> Họ và tên <br />姓名 </th>
                <th> BỘ PHẬN <br />部門 </th>
                <th> LÝ DO<br />離職原因</th>
                <th> LOẠI NGHỈ <br />離職種類 </th>
                <th> NGÀY VÀO <br />進廠日期</th>
                <th> NGÀY THÔI VIỆC <br />離職日期</th>
                <th> SỐ CCCD <br />身分證號碼 </th>
                <th> HÌNH <br />相片 </th>
            </tr>
            <tr v-for="(item, index) in resignData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.er_empid }}</td>
                <td>{{ item.er_name }}</td>
                <td>{{ item.er_deptname }}</td>
                <td>{{ item.er_reason }}</td>
                <td>{{ item.er_type_resign }}</td>
                <td>{{ formatDate(item.er_indate) }}</td>
                <td>{{ formatDate(item.er_resigndate) }}</td>
                <td>{{ item.er_numberid }}</td>
                <td>
                    <img v-if="photoUrls[item.er_empid]" :src="photoUrls[item.er_empid]" alt="Employee photo" style="max-width: 100px;">
                    <span v-else>No photo</span>
                </td>
            </tr>
        </table>
        <table class="signature-table">
            <tr>
                <td class="signature-cell">
                    Chủ quản BP Tài Nguyên Nhân Lực <br />人力資源部
                </td>
                <td class="signature-cell">
                    Trưởng nhóm ER <br /> ER組長
                </td>
                <td class="signature-cell">
                    Người lập biểu <br />填表人
                </td>
            </tr>
            <tr>
                <td class="signature-space"></td>
                <td class="signature-space"></td>
                <td class="signature-space"></td>
            </tr>
            <tr>
                <td colspan="3" class="signature-note">
                    Lưu trình trình ký: Người lập biểu ➜ Trưởng nhóm ER ➜ Chủ quản BP tài nguyên nhân lực <br>
                    簽認流程: 填表人 ➜ ER組長 ➜ 人力資源部
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import dayjs from "dayjs";
export default {
    layout: "print",
    data() {
        return {
            resignData: [],
            storageUrl: 'http://gmo021.cansportsvg.com/api/',
            tokenApi: 'vg-recuitingReport/getphoto/epm/',
            photos: {},
            photoUrls: {},
            dateRange: '', // Add this line
            printData: []
        };
    },
    created() {
    },
    async mounted() {
        await this.loadData();
    },
    beforeDestroy() {
        Object.values(this.photoUrls).forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    },
    methods: {
        async loadData() {
            try {
                const printKey = this.$route.query.key;
                if (!printKey) {
                    return;
                }
                const data = localStorage.getItem(printKey);
                if (data) {
                    try {
                        const parsedData = JSON.parse(data);
                        // Add null checks and default values
                        this.resignData = Array.isArray(parsedData.data) ? parsedData.data : [];
                        this.dateRange = parsedData.dateRange || '';
                        
                        if (this.resignData.length > 0) {
                            await Promise.all(
                                this.resignData.map(item => 
                                    item.er_empid ? this.getPhoto(item.er_empid) : Promise.resolve()
                                )
                            );
                            
                            localStorage.removeItem(printKey);
                            await this.$nextTick();
                            setTimeout(() => {
                                window.print();
                            }, 500);
                        }
                    } catch (e) {
                        console.error('Error parsing data:', e);
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        formatDate(date) {
            return dayjs(date).format('DD/MM/YYYY');
        },
        async getPhoto(empid) {
            try {
                if (this.photoUrls[empid]) return; 
                
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$session.get('token')}`  
                };
                const response = await this.$axios.get(
                    `${this.storageUrl}${this.tokenApi}${empid}`,
                    { headers, responseType: 'blob' }
                );
                const blob = new Blob([response.data], { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                this.$set(this.photoUrls, empid, url);

            } catch (error) {
                console.error('Error loading photo:', error);
                this.$set(this.photoUrls, empid, '/default-avatar.png');
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
    border-bottom: 1px solid #333;
}

.table tbody+tbody {
    border-top: 1px solid #333;
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

.table th b {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 15px;
}

.align-middle {
    vertical-align: middle !important;
}

tr.textMid td {
    font-size: 12px !important;
}
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

.signature-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

.signature-cell {
    width: 33.33%;
    text-align: center;
    padding: 10px;
    vertical-align: middle;
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

/* Thêm các styles mới */
.no-bottom-border {
    border-bottom: 1px solid #333 !important; /* Đổi thành 2px solid để khớp với border chính */
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
    border-bottom: 1px solid #333 !important; /* Đặt lại border bottom cho hàng cuối */
}

.no-top-border tr:first-child td,
.no-top-border tr:first-child th {
    border-top: none !important;
}
</style>