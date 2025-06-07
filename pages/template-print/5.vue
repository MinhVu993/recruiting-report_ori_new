<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" ref="printContent" class="page-break">
            <!-- Bảng tiêu đề -->
            <table class="table table-bordered">
                <tr>
                    <td rowspan="2" class="align-middle text-center text-header" style="width: 12%;">
                        <img width="75px" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                    </td>
                    <td rowspan="3" class="text-center align-middle text-header_title">
                        ĐƠN XIN VIỆC <br />
                        (NHÂN VIÊN, CÁN BỘ, KỸ SƯ) <br />
                        選選紀錄表 (非工人)
                    </td>
                    <td class="align-middle text-center">Ngày thiết lập (sửa đổi) <br /> 制(修)訂日期</td>
                    <td class="align-middle text-center">23.03.2024</td>
                </tr>
                <tr>
                    <td class="align-middle text-center">Mã số tài liệu <br /> 文件編號</td>
                    <td class="align-middle text-center">ADHR02-SP001-03</td>
                </tr>
                <tr>
                    <td class="align-middle text-center">Bộ phận soạn thảo <br /> 編訂部門 <br /> Tài Nguyên Nhân Lực <br /> 人力資源部</td>
                    <td class="align-middle text-center">Phiên bản 版本 <br /> 6</td>
                    <td class="align-middle text-center">Trang 頁次 <br /> 1/2</td>
                </tr>
            </table>
            
            <!-- Giải thích -->
            <table class="table table-bordered explanation no-border">
                <tbody>
                    <tr class="text-left font-weight-bold" style="padding-left: 5px; vertical-align: top;" colspan="2"> 
                        <td>

                            Giải thích 說明
                        </td>
                        </tr>
                    <tr>
                        <td>
                            1. Đơn xin việc này sẽ được lưu trữ tại Phòng Nhân Sự của Công ty. <br />
                            &nbsp;&nbsp; &nbsp;這份申請表將被存檔在公司人事部。
                        </td>
                        <td>
                            2. Thông tin cá nhân của ứng viên sẽ được bảo mật và không được tiết lộ cho bất kỳ bên thứ ba nào. <br />
                            &nbsp;&nbsp; &nbsp;申請人的個人資料將被保密，不會被透露給任何第三方。
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Thông tin cá nhân -->
            <table class="table table-bordered">
                <tr>
                    <td colspan="3" class="text-center font-weight-bold">TƯ LIỆU CÁ NHÂN 個人資料</td>
                </tr>
                <tr>
                    <td colspan="3">Họ & Tên 姓名: {{ candidate.data.candidate_name }}</td>
                </tr>
                <tr>
                    <td colspan="3">Địa chỉ 戶籍住址: {{ candidate.data.commAddress || candidate.data.regAddress }}</td>
                </tr>
                <tr>
                    <td colspan="3">Địa chỉ liên lạc 聯絡地址: {{ candidate.data.commAddress || candidate.data.regAddress }}</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <v-row>
                            <v-col col="6">
                                Số ĐT Nhà 家裡電話 (如有):     
                            </v-col>
                            <v-col cols="4">
                                Số ĐTDĐ手機 (必留): {{ candidate.data.commTel || candidate.data.regTel }}
                            </v-col>
                            <v-col cols="2"></v-col>
                        </v-row>
                    </td>
                </tr>
                <tr>
                    <td>Ngày / tháng / năm sinh: 出生日期： {{ candidate.data.dateofbirth }}</td>
                    <td>Số CMND/CCCD 身份證號碼： {{ candidate.data.emp_id }}</td>
                    <td>Địa chỉ email/email 地址:</td>
                </tr>
            </table>
            
            <!-- Thông tin người thân liên lạc -->
            <table class="table table-bordered no-top-border" style="margin-top: 0; border-top: none;">
                <tr>
                    <td colspan="3" class="text-center font-weight-bold">Thông tin người thân liên lạc 緊急聯絡人</td>
                </tr>
                <tr>
                    <td>Họ tên 姓名:</td>
                    <td>Quan hệ 關係:</td>
                    <td>SĐT liên lạc 聯絡電話:</td>
                </tr>
                <tr>
                    <td colspan="3">Địa chỉ liên lạc 聯絡地址:</td>
                </tr>
            </table>
            
            <!-- Quan hệ gia đình -->
            <table class="table table-bordered table-family no-top-border" style="margin-top: 0; border-top: none;">
                <tr>
                    <td colspan="4" class="text-center font-weight-bold">
                        Quan hệ gia đình 家庭狀況 <br />
                        <i>(Vui lòng điền đầy đủ thông tin của cha mẹ, anh, chị, em, vợ hoặc chồng và con cái) <br />
                        (請填寫父母、兄弟姐妹、配偶及小孩的資料)</i>
                    </td>
                </tr>
                <tr>
                    <th>Quan hệ 關係</th>
                    <th>Họ tên 姓名</th>
                    <th>Tuổi 年齡</th>
                    <th>Nghề nghiệp 職業</th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <!-- Trình Độ Văn Hóa -->
            <table class="table table-bordered table-education no-top-border">
                <tr>
                    <td colspan="4" class="text-center font-weight-bold">
                        Trình Độ Văn Hóa 學歷背景 <br />
                        <i>(Xin đính kèm theo bản photo những hồ sơ liên quan) <br />
                        (請附上相關學歷證書的影印本)</i>
                    </td>
                </tr>
                <tr>
                    <th>Học lực 最高學歷</th>
                    <th>Từ 從</th>
                    <th>Đến 至</th>
                    <th>Tên trường 學校名稱</th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <!-- Trình độ ngôn ngữ -->
            <table class="table table-bordered table-language">
                <tr>
                    <td colspan="13" class="text-center font-weight-bold">
                        Trình độ ngôn ngữ 語言能力
                    </td>
                </tr>
                <tr>
                    <td rowspan="3" class="text-center"> Ngôn ngữ
                        <br/> 語言</td>
                        <td colspan="12" class="text-center"> Trình độ thấp –trung -cao程度 – 低、中、高 </td>
                        
                    </tr>
                    <tr>
                        <td colspan="3" class="text-center">Nghe 聽</td>
                        <td colspan="3" class="text-center">Nói 說</td>
                        <td colspan="3" class="text-center">Viết 寫</td>
                        <td colspan="3" class="text-center">Đọc 讀</td>
                        
                    </tr>
                    <tr>
                        <td class="text-center">Thấp  <br/>低</td>
                        <td class="text-center">Trung  <br/>中</td>
                        <td class="text-center">Cao  <br/>高</td>
                        <td class="text-center">Thấp  <br/>低</td>
                        <td class="text-center">Trung  <br/>中</td>
                        <td class="text-center">Cao  <br/>高</td>
                        <td class="text-center">Thấp  <br/>低</td>
                        <td class="text-center">Trung  <br/>中</td>
                        <td class="text-center">Cao  <br/>高</td>
                        <td class="text-center">Thấp  <br/>低</td>
                        <td class="text-center">Trung  <br/>中</td>
                        <td class="text-center">Cao  <br/>高</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                
                <!-- Kinh nghiệm công việc -->
                <table class="table table-bordered table-experience">
                    <tr>
                        <td colspan="5" class="text-center font-weight-bold">Kinh nghiệm công việc 工作經驗</td>
                    </tr>
                    <tr>
                        <td>Tên công ty đã từng làm 公司名稱</td>
                        <td>Thời gian làm việc 工作年資</td>
                        <td>Chức vụ 職稱</td>
                        <td>Nguyên nhân thôi việc 離職原因</td>
                        <td>Những bổ sung khác 備註</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <!-- Bảng Thông tin khác -->
                <table class="table table-bordered ">
                    <tr>
                        <td colspan="5" class="text-center font-weight-bold">Thông tin khác 其他資料</td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            <div style="display: flex; align-items: center;">
                                <div style="flex: 1">
                                    1. Bạn đã từng bị sa thải hay bị đình chức chưa? Nếu có, xin nói rõ. <br/>
                                    你是否曾經被解僱或停職？如有，請說明
                                </div>
                                <div style="display: flex; gap: 20px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            <div style="display: flex; align-items: center;">
                                <div style="flex: 1">
                                    2. Bạn đã từng bị tạm giam hay xử tội gì chưa? Nếu có, xin nói rõ. <br/>
                                    你是否曾經被拘留或被判刑？如有，請說明。
                                </div>
                                <div style="display: flex; gap: 20px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            <div style="display: flex; align-items: center;">
                                <div style="flex: 1">
                                    3. Hiện tại bạn có đang tham gia bất cứ hành chính hay nhân sự hoặc vụ án hình sự nào chưa? Nếu có, xin nói rõ. <br/>
                                    你現在是否有參與任何行政、民事或刑事案件？如有，請說明.
                                </div>
                                <div style="display: flex; gap: 20px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            <div style="display: flex; align-items: center;">
                                <div style="flex: 1">
                                    4. Bạn có người thân hay bạn bè đang làm việc tại công ty chúng tôi không? Nếu có, xin nói rõ. <br/>
                                    你是否有任何親戚或朋友現在或曾經任職於我們公司？如有，請說明
                                </div>
                                <div style="display: flex; gap: 20px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 5px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            5. Thông qua thông tin nào bạn được biết công ty chúng tôi đang cần tuyển người? <br/>
                            你是從什麼管道知道這職缺？
                            <div style="display: flex; justify-content: left; gap: 40px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '2'">Tờ rơi tuyển dụng 招募傳單</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '1'">Bảng rôn tuyển dụng 招募佈條</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === ''">Website trường học 學校網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '6'">Hội chợ việc làm trường học 學校招聘會活動</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === ''">CB-CNV trong xưởng giới thiệu (xin nói rõ) 廠員工介紹 (請回答第 6 項)</label>
                            </div>
                            <div style="display: flex; justify-content: left; gap: 50px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === ''">Phát thanh văn phòng xưởng 廠辦公室廣播</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '9' || candidate.data.recru_source === '17'"> Qua mạng 網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '7'">Website công ty 志豐公司網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '8'">Website tìm việc nhanh 人力銀行網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.data.recru_source === '4'">Bạn bè giới thiệu 親友介紹</label>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="12" style="text-align: left;">
                            <div style="flex: 1">
                                6. Nếu như bạn được CB-CNV công ty chúng tôi giới thiệu, xin hãy nói rõ họ tên người giới thiệu bạn tới phỏng vấn. <br/>
                                如果是請問是廠內哪位員工介紹你來面試？ (請填寫)
                            </div>
                            <div style="display: flex; justify-content: left; gap: 80px; margin-top: 5px;">
                                <label><input type="label" readonly @click.prevent style="margin: 8px;" >Họ tên 姓名:</label>
                                <label><input type="label" readonly @click.prevent style="margin: 8px;" >  Điện thoại 電話:</label>
                                <label><input type="label" readonly @click.prevent style="margin: 8px;" >Số thẻ 工號:</label>
                                <label><input type="label" readonly @click.prevent style="margin: 8px;" >Bộ phận 部門:</label>
                            </div>
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered">
                    <tr>
                        <td class="text-center font-weight-bold">Bảng Cam Kết 聲明</td>
                    </tr>
                    <tr>
                        <td>
                            <v-row>
                                <v-col cols="12">
                                    
                                    Tôi xin đảm bảo những gì tôi điền vào đơn xin việc và những tài liệu thông tin mà tôi cung cấp hoàn toàn đúng với sự thật, tôi cũng biết rõ nếu có hiểu lầm sai sót nào sẽ dẫn tới đơn xin việc này sẽ không được chấp nhận.
                                    <br/>
                                    我在此聲明，本人在 CAN SPORTS Co., Ltd.人員資料表裡所提供的資料與答案在我的認知裡都屬實，本人也理解如果有任何錯誤與私漏都可能導致申請被拒絕。
                                    
                                </v-col>
                                <v-col cols="6">
                                    Ký tên 签名:    
                                </v-col>
                                <v-col cols="6">
                                    Ngày 日期: {{ formatDate(candidate.data.key_in_date) }}
                                </v-col>
                            </v-row>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </template>
    
    <script>
    export default {
        layout: 'print',
        data() {
            return {
                api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
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
                        const response = await this.$axios.get(`${this.api}getDataById/${id}`);
                        if (response.data) {
                            this.candidates.push(response);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching candidate data:", error);
                }
            },
            formatDate(date) {
                if (!date) return '';
                return new Date(date).toLocaleDateString('vi-VN');
            },
            printDocument() {
                this.isPrinting = true;
                window.print();
            }
        }
    };
</script>

<style>
* {
    font-family: "Times New Roman", Times, serif !important;
}

.text-header_title {
    font-size: 24px;
    font-weight: bold;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table-bordered td, .table-bordered th {
    border: 1px solid black;
    padding: 6px;
}

.text-center {
    text-align: center;
}

.text-left {
    text-align: left;
}

.font-weight-bold {
    font-weight: bold;
}

.explanation td {
    font-size: 14px;
    padding: 8px;
}
.no-bottom-border td {
    border-bottom: none !important;
    border-top: none !important;
}

.no-bottom-border:last-child td {
    border-bottom: 1px solid black !important;
}
.no-border td{
    border: none !important;
}
@media print {
    .no-print {
        display: none !important;
    }
    
    .table {
        margin: 0 !important;
    }
    
    .no-bottom-border {
        margin-bottom: 10px !important;
    }
    
    @page {
        margin: 0.1in;
        size: A4 portrait;
    }
    
    [ref="printContent"] {
        transform: scale(0.86);
        transform-origin: top left;
    }
}

/* Add padding for specific tables */
.table-family,     /* Quan hệ gia đình */
.table-education,  /* Trình Độ Văn Hóa */ 
.table-language,   /* Trình độ ngôn ngữ */
.table-experience  /* Kinh nghiệm công việc */ {
    margin: 20px 0;
}

.table-family td,
.table-education td,
.table-language td,
.table-experience td {
    padding: 20px;
}

.table-family th,
.table-education th,
.table-language th,
.table-experience th {
    padding: 20px;
}

.no-top-border {
    border-top: 0 !important;
}

.no-top-border tr:first-child td {
    border-top: 0 !important;
}

/* Add these new styles for page breaks */
.page-break {
    page-break-after: always;
    margin-bottom: 30px;
}

/* Remove margin for last page */
.page-break:last-child {
    page-break-after: avoid;
    margin-bottom: 0;
}

@media print {
    .page-break {
        page-break-after: always;
    }
    
    /* Ensure each page starts on a new page */
    .page-break {
        display: block;
        clear: both;
    }
    
    /* Reset transform for proper page breaks */
    [ref="printContent"] {
        transform: scale(1);
        transform-origin: initial;
    }
    
    @page {
        margin: 0.5cm;
        size: A4 portrait;
    }
}
</style>
