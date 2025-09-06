<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" ref="printContent" class="page-break">
            <!-- Bảng tiêu đề -->
            <table class="table table-bordered">
                <tr>
                    <td rowspan="2" class="align-middle text-center text-header">
                        <img width="75px" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                    </td>
                    <td rowspan="3" class="text-center align-middle text-header_title">
                        ĐƠN XIN VIỆC <br />
                        (NHÂN VIÊN, CÁN BỘ, KỸ SƯ) <br />
                        選選紀錄表 (非工人)
                    </td>
                    <td class="align-middle text-center">Ngày thiết lập (sửa đổi) <br /> 制(修)訂日期</td>
                    <td class="align-middle text-center">14.08.2025</td>
                </tr>
                <tr>
                    <td class="align-middle text-center">Mã số tài liệu <br /> 文件編號</td>
                    <td class="align-middle text-center">ADHR02-SP001-03</td>
                </tr>
                <tr>
                    <td class="align-middle text-center">Bộ phận soạn thảo <br /> 編訂部門 <br /> Tài Nguyên Nhân Lực <br /> 人力資源部</td>
                    <td class="align-middle text-center">Phiên bản 版本 <br /> 7</td>
                    <td class="align-middle text-center">Trang 頁次 <br /> 1/2</td>
                </tr>
            </table>
            
            <!-- Giải thích -->
            <table class="table table-bordered explanation no-border">
                <tbody>
                    <tr>
                        <td colspan="2" class="text-left font-weight-bold" style="padding-left: 5px; vertical-align: top;">
                            Giải thích 說明
                        </td>
                    </tr>
                    <tr>
                        <td>
                            1.	Đơn này chỉ dành riêng cho người xin việc điền vào.<br />
                            &nbsp;&nbsp; &nbsp;此表格唯有申請人可填寫。
                        </td>
                        <td>
                            2.	Xin vui lòng điền đầy đủ thông tin vào bảng dưới đây. <br />
                            &nbsp;&nbsp; &nbsp;請用正楷字體清晰的填寫。
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Thông tin cá nhân -->
            <table class="table table-bordered">
                <tr>
                    <td colspan="3" class="text-center font-weight-bold" style="height: 60px;">TƯ LIỆU CÁ NHÂN 個人資料</td>
                </tr>
                <tr style="height: 60px">
                    <td >Họ & Tên 姓名: {{ candidate.data.candidate_name }}</td>
                    <td>Số CMND/CCCD 身份證號碼： {{ candidate.data.emp_id }}</td>
                </tr>
                <tr style="height: 60px">
                    <!-- <td>Ngày / tháng / năm sinh: 出生日期： {{ candidate.data.dateofbirth }}</td> -->
                    <td>  Số ĐTDĐ手機 (必留): {{ candidate.data.commTel || candidate.data.regTel }}</td>
                    <td>Email:</td>
                </tr>
                <tr style="height: 60px">
                    <td colspan="3">Địa chỉ 戶籍住址: {{ candidate.data.commAddress || candidate.data.regAddress }}</td>
                </tr>
                <tr style="height: 60px">
                    <td colspan="3">Địa chỉ liên lạc 聯絡地址: {{ candidate.data.commAddress || candidate.data.regAddress }}</td>
                </tr>
                
            </table>
            
            <!-- Thông tin người thân liên lạc -->
            <table class="table table-bordered no-top-border" style="margin-top: 0; border-top: none;">
                <tr style="height: 60px">
                    <td colspan="3" class="text-center font-weight-bold" style="height: 60px">Thông tin người thân liên lạc 緊急聯絡人</td>
                </tr>
                <tr style="height: 60px">
                    <td>Họ tên 姓名:</td>
                    <td>Quan hệ 關係:</td>
                    <td>SĐT liên lạc 聯絡電話:</td>
                </tr>
                <tr style="height: 60px">
                    <td colspan="3">Địa chỉ liên lạc 聯絡地址:</td>
                </tr>
            </table>
            <!-- Trình Độ Văn Hóa -->
            <table class="table table-bordered table-education ">
                <tr class="no-bottom-border"  style="height: 60px">
                    <td colspan="4" class="text-center font-weight-bold" style="height: 60px">
                        Trình Độ Văn Hóa 學歷背景 <br />
                        <i>(Xin đính kèm theo bản photo những hồ sơ liên quan) <br />
                        (請附上相關學歷證書的影印本)</i>
                    </td>
                </tr>
                <tr style="height:80px">
                    <td class="text-center">Học lực 最高學歷</td>
                    <td class="text-center">Từ 從</td>
                    <td class="text-center">Đến 至</td>
                    <td class="text-center">Tên trường 學校名稱</td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="height:70px">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <!-- Trình độ ngôn ngữ -->
            <table class="table table-bordered table-language ">
                <tr class="no-bottom-border" style="height: 60px">
                    <td colspan="13" class="text-center font-weight-bold" style="height: 58px">
                        Trình độ ngôn ngữ 語言能力
                    </td>
                </tr>
                <tr style="height: 58px">
                    <td rowspan="3" class="text-center"> Ngôn ngữ
                        <br/> 語言</td>
                        <td colspan="12" class="text-center"> Trình độ thấp –trung -cao程度 – 低、中、高 </td>
                        
                    </tr>
                    <tr style="height: 58px">
                        <td colspan="3" class="text-center" >Nghe 聽</td>
                        <td colspan="3" class="text-center" >Nói 說</td>
                        <td colspan="3" class="text-center" >Viết 寫</td>
                        <td colspan="3" class="text-center" >Đọc 讀</td>
                        
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
                    <tr style="height: 55px">
                        <td  class="text-center">Tiếng Anh <br/>英文</td>
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
                    <tr style="height: 55px">
                        <td  class="text-center">Tiếng Hoa <br/>中文</td>
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
                    <tr style="height: 55px">
                        <td  class="text-center"></td>
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
                    <tr style="height: 60px">
                        <td colspan="5" class="text-center font-weight-bold">Kinh nghiệm công việc 工作經驗</td>
                    </tr>
                    <tr>
                        <td class="text-center">Tên công ty đã từng làm <br/>公司名稱</td>
                        <td  class="text-center">Thời gian làm việc <br/>工作年資</td>
                        <td class="text-center">Chức vụ <br/>職稱</td>
                        <td class="text-center">Nguyên nhân thôi việc <br/>離職原因</td>
                        <td  class="text-center">Những bổ sung khác <br/>備註</td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="height: 90px">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <!-- Bảng Thông tin khác (fixed colspan and spacing to match other tables) -->
                <table class="table table-bordered table-experience info-table">
                    <tr style="height: 60px">
                        <td colspan="5" class="text-center font-weight-bold">Thông tin khác 其他資料</td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td style="text-align: left;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    1. Bạn đã từng bị sa thải hay bị đình chức chưa? Nếu có, xin nói rõ. <br/>
                                    你是否曾經被解僱或停職？如有，請說明
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="5" style="text-align: left;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    2. Bạn đã từng bị tạm giam hay xử tội gì chưa? Nếu có, xin nói rõ. <br/>
                                    你是否曾經被拘留或被判刑？如有，請說明。
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="5" style="text-align: left;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    3. Hiện tại bạn có đang tham gia bất cứ hành chính hay nhân sự hoặc vụ án hình sự nào chưa? Nếu có, xin nói rõ. <br/>
                                    你現在是否有參與任何行政、民事或刑事案件？如有，請說明.
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td colspan="5" style="text-align: left;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    4. Bạn có người thân hay bạn bè đang làm việc tại công ty chúng tôi không? Nếu có, xin nói rõ. <br/>
                                    你是否有任何親戚或朋友現在或曾經任職於我們公司？如有，請說明
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Có 有
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" readonly @click.prevent style="margin-right: 6px;">Không 無
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <tr class="no-bottom-border">
                        <td colspan="5" style="text-align: left;">
                            5. Thông qua thông tin nào bạn được biết công ty chúng tôi đang cần tuyển người? <br/>
                            你是從什麼管道知道這職缺？
                            <div class="checkbox-grid" style="margin-top:8px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '2'">Tờ rơi tuyển dụng 招募傳單</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '1'">Bảng rôn tuyển dụng 招募佈條</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === ''">Website trường học 學校網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '6'">Hội chợ việc làm trường học <br/>學校招聘會活動</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '4'">Bạn bè giới thiệu 親友介紹</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === ''">Phát thanh văn phòng xã 村辦公室廣播</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '7'">Website công ty 志寧公司網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '9' || candidate.data.recru_source === '17'">Phương tiện truyền thông xã hội: <br/>Tik tok, FB...社群媒體：抖音、臉書…</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === ''">CB-CNV trong xưởng giới thiệu <br/> (xin nói rõ) 廠員工介紹 (請回答第 6 項)</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 4px;" :checked="candidate.data.recru_source === '8'">Website tìm việc 人力銀行網站</label>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-bottom-border">
                        <td >
                            <div >
                                6. Nếu như bạn được CB-CNVcông ty chúng tôi giới thiệu xin hãy nói rõ họ tên người giới thiệu bạn tới phỏng vấn. <br/>
                                如果請問是廠內哪位員工介紹你來應徵？（Xin giải thích請說明）
                            </div>
                            <div style="margin-top: 8px; display: flex; flex-direction: row; justify-content: space-between;">
                                <div style="display: flex; gap: 10px;">
                                    <span>Họ tên 姓名:</span>
                                    <div style="min-width: 100px; "></div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <span>Điện thoại 電話:</span>
                                    <div style="min-width: 100px; "></div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <span>Số thẻ 工號:</span>
                                    <div style="min-width: 100px; "></div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <span>Bộ phận 部門:</span>
                                    <div style="min-width: 100px; "></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered table-experience">
                    <tr class="no-top-border">
                        <td class="text-center font-weight-bold no-top-border">Bảng Cam Kết 聲明</td>
                    </tr>
                    <tr>
                        <td>
                            <v-row>
                                <v-col cols="12">
                                    Tôi xin đảm bảo những gì tôi điền vào đơn xin việc và những tài liệu thông tin mà tôi cung cấp hoàn toàn đúng với sự thật, tôi cũng biết rõ nếu có hiểu lầm sai sót nào sẽ dẫn tới  đơn xin việc này sẽ không được chấp nhận.
                                    <br/>
                                    我在此聲明，本人在  CAN SPORTS  Co., Ltd.人員資料表裡所提供的資料與答案在我的認知裡都屬實，本人也理解如有任何錯誤與紕漏都可能導致申請被拒絕。
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
.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 40px;
    margin-top: 5px;
    margin-bottom: 5px;
}
.checkbox-grid label {
    display: flex;
    align-items: center;
    white-space: nowrap;
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

/* New: make rows of all tables (except the first header table in each page) uniform in height */
.page-break > .table:not(:first-of-type) th,
.page-break > .table:not(:first-of-type) td {
    /* set a consistent minimum row height */
    min-height: 36px !important;
    height: 36px !important;
    /* ensure text is vertically centered */
    vertical-align: middle !important;
    /* reduce excessive padding so each row visually matches height */
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
    /* consistent line-height */
    line-height: 1.2 !important;
    /* prevent cells from collapsing on print */
    overflow: visible !important;
    white-space: normal !important;
}

/* For multi-row header cells (like the first table) we intentionally do not change anything,
because the selector above excludes the first table inside .page-break. */

/* Ensure same behaviour when printing (reinforce selectors inside print) */
@media print {
    .page-break > .table:not(:first-of-type) th,
    .page-break > .table:not(:first-of-type) td {
        min-height: 36px !important;
        height: 36px !important;
        vertical-align: middle !important;
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        padding-left: 6px !important;
        padding-right: 6px !important;
        line-height: 1.2 !important;
        overflow: visible !important;
        white-space: normal !important;
    }
}

/* Tăng độ cao cho các bảng: Trình độ ngôn ngữ và Kinh nghiệm công việc */
.table-language th,
.table-language td,
.table-experience th,
.table-experience td {
    /* cao hơn để dòng phẳng và dễ đọc */
    min-height: 56px !important;
    height: 56px !important;
    /* tăng padding để nội dung không bị chồng */
    padding-top: 14px !important;
    padding-bottom: 14px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    vertical-align: middle !important;
    line-height: 1.2 !important;
    white-space: normal !important;
}

/* Áp dụng tương tự khi in */
@media print {
    .table-language th,
    .table-language td,
    .table-experience th,
    .table-experience td {
        min-height: 56px !important;
        height: 56px !important;
        padding-top: 14px !important;
        padding-bottom: 14px !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
        vertical-align: middle !important;
        line-height: 1.2 !important;
        white-space: normal !important;
    }
}

/* Ensure this specific "Thông tin khác" table matches spacing of other .table-experience tables */
.table-experience.info-table td,
.table-experience.info-table th {
    padding-top: 14px !important;
    padding-bottom: 14px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    min-height: 56px !important;
    vertical-align: middle !important;
    line-height: 1.2 !important;
}

@media print {
    .table-experience.info-table td,
    .table-experience.info-table th {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
        min-height: 56px !important;
    }
}
</style>
