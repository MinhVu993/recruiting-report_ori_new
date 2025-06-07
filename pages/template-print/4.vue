<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" ref="printContent">
            <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                <tr>
                    <td rowspan="2" class="align-middle text-header" style="width: 12%">
                        <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                    </td>
                    <td rowspan="3" class="text-center align-middle text-header_title">
                        THƯ MỜI NHẬN VIỆC
                        <br />
                        錄用通知書
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
                        ADHR02-SP001-05<br />
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
                        4
                    </td>
                    <td class="colum3 align-middle">
                        Trang 頁次 <br />
                        1/1
                    </td>
                </tr>
            </table>
            <table class="table table-bordered no-interior-borders" style="margin-top: 10px;">
                <tr>
                    <td colspan="12" style="text-align: left; padding-left: 30px; font-weight: bold;">Kính gửi: Anh/Chị {{ candidate.candidate_name }}</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;padding-left: 30px;font-weight: bold;">親愛的先生小姐您好:</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Trước tiên, xin chân thành cám ơn Anh/Chị đã đến dự cuộc
                        phỏng vấn của Công ty chúng tôi, sau khi thông qua sự đánh giá của Chủ quản Công ty chúng tôi,
                        nay chúng tôi thông báo Anh/Chị chính thức gia nhập Công ty TNHH Can Sports.
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">首先,我們公司誠摯的感謝您抽空到Can Sports Vietnam面試, 也恭喜您通過我們公司主管們的面試,
                        故以此錄用通知書知會與期盼您加入我們公司.</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">
                        Thời gian thử việc 試用期時間 : 
                        <label style="margin-left: 20px;"><input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.probation === '6'"> 06 ngày日</label>
                        <label style="margin-left: 20px;"><input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.probation === '30'"> 30 ngày日</label>
                        <label style="margin-left: 20px;"><input type="checkbox" readonly @click.prevent style="margin: 5px;" :checked="candidate.probation === '60'"> 60 ngày日</label>
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">Thời gian nhận việc 正式報到日期為: 07 h 15 Ngày 日
                        {{ getFormattedDate(candidate.ex_en_date).day }} Tháng 月 {{ getFormattedDate(candidate.ex_en_date).month }} Năm 年 {{ getFormattedDate(candidate.ex_en_date).year }}</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">* Những điều cần lưu ý: Khi đến nhận việc phải bổ sung đầy
                        đủ những hồ sơ còn thiếu cho Tổ tuyển dụng. Mặc áo bỏ vào quần, mang giày hoặc dép quai hậu, tập
                        trung tại cổng bảo vệ công ty đúng giờ hẹn đã ghi trên. Không được tự ý vào xưởng khi chưa có
                        hướng dẫn của nhân viên Tổ tuyển dụng. Không trả lại hồ sơ đã nhận. Nếu Anh/Chị chưa sắp xếp được
                        thời gian đến nhận việc, xin điện thoại thông báo trước 02 ngày gặp Tổ tuyển dụng Bộ phân Nhân
                        sự. ĐT : 0276.3721.111 (134,139)</td>
                </tr>
                <tr>
                    <td colspan="12" style="text-align: left;">注意事項: 報到當天請務必備齊所有報到所需要的文件資料,以便招募組查核使用, 請著較適合上班的衣服,請勿穿著拖鞋.
                        並於報到時間之前在公司警衛室前集合完畢. 如果您未能於約定時間報到,請務必於報到前兩天知會HR招募組</td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: left; font-style: italic; font-size: 10px !important; vertical-align: top; padding-top: 10px;">Cc hồ sơ cần bổ sung
                        :<br />報到所需文件:
                        <span style="font-size: 10px !important;">1. Hồ sơ OK所有文件都已備齊,無須捕充<br/>
                        2. ___ Tấm ảnh 3x 43*4照片____張<br/>
                        3. ___ CMND身分證<br/>
                        4. ___ Sơ yếu lý lịch無犯罪證明<br/>
                        5. ___ Giấy xác nhân HK個人履歷<br/>
                        6. ___ Hộ khẩu戶口名簿<br/>
                        7. ___ Đơn xin việc職位申請表<br/>
                        8. ___ Giấy KSK體檢報告</span>
                    </td>
                    <td colspan="6" style="text-align: center; vertical-align: top; padding-top: 10px;">
                        <strong>CANSPORTS, NGÀY 日 {{ String(new Date().getDate()).padStart(2, '0') }} THÁNG 月 {{ String(new Date().getMonth() + 1).padStart(2, '0') }} NĂM 年 {{ new Date().getFullYear() }}
                                <br />
                                BỘ PHẬN TÀI NGUYÊN NHÂN LỰC
                                <br />
                                人力資源部
                            </strong>
                    </td>
                </tr>
            </table>
            <div v-if="index < candidates.length - 1" style="page-break-after: always;"></div>
        </div>
    </div>
</template>

<script>
export default {
    layout: "print",
    data() {
        return {
            candidates: [],
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            loading: true
        };
    },
    async mounted() {
        const ids = this.$route.query.ids;
        if (ids) {
            try {
                this.loading = true;
                const idArray = ids.split(',');
                const responses = await Promise.all(
                    idArray.map(id => this.$axios.get(`${this.api}getDataById/${id}`))
                );
                this.candidates = responses.map(({ data }) => ({
                    candidate_name: data.candidate_name || '',
                    position: data.position || '',
                    department: data.tmp_departid || '',
                    probation: data.probation || '',
                    ex_en_date: data.ex_en_date || ''
                }));
            } catch (error) {
                console.error('Error fetching candidate data:', error);
                this.candidates = [];
            } finally {
                this.loading = false;
            }
        }
    },
    methods: {
        getFormattedDate(dateString) {
            if (!dateString) return { day: '', month: '', year: '' };
            const date = new Date(dateString);
            return {
                day: String(date.getDate()).padStart(2, '0'),
                month: String(date.getMonth() + 1).padStart(2, '0'),
                year: date.getFullYear()
            };
        }
    }
};
</script>

<style>
/* CSS for the entire page */
* {
    font-family: "Times New Roman", Times, serif !important;
}

body {
    font-family: "Times New Roman", Times, serif !important;
}

.text-header_title {
    font-size: 36px !important;
    font-family: "Times New Roman", Times, serif !important;
    width: 31%;
    padding: 10px !important;
    font-weight: bold;
}

.text-header {
    font-size: 20px !important;
    padding: 1px !important;
    line-height: 1.5;
}

.colum3 {
    width: 12%;
    padding: 5px !important;
    font-size: 13px !important;
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
    padding: 4px;
    vertical-align: middle;
    background-color: transparent;
    font-size: 13px !important;
    line-height: 1.4;
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

.table.table-bordered.no-interior-borders td,
.table.table-bordered.no-interior-borders td * {
    font-size: 13px !important;
}

/* Specific style for the document list */
.table td[style*="font-style: italic"] span,
.table td[style*="font-style: italic"] {
    font-size: 10px !important;
    line-height: 1.3 !important;
}

/* Specific style for the signature section */
.table td[style*="text-align: center; vertical-align: top;"] strong {
    font-size: 14px !important;
    line-height: 1.5 !important;
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

@media print {
    .table {
        margin: 0 !important;
    }

    .no-bottom-border {
        margin-bottom: 10px !important;
    }

    @page {
        margin: 0.2in;
        size: A5 landscape; /* Changed to landscape orientation */
    }

    [ref="printContent"] {
        transform: scale(0.84);
        transform-origin: top left;
    }
}
</style>