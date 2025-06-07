<template>
    <div>
        <div v-for="(candidate, index) in candidates" :key="index" class="page-container" :class="{ 'page-break': index > 0 }">
            <div ref="printContent">
                <table class="table table-bordered no-bottom-border" style="margin-bottom: 0">
                    <tr>
                        <td rowspan="2" class="align-middle text-header" style="width: 12%">
                            <img width="75px;" :src="`./logo.png`" class="img-fluid mx-auto mt-1" alt="" ref="logoImage" />
                        </td>
                        <td rowspan="3" class="text-center align-middle text-header_title">
                            BẢNG GHI NHẬN TUYỂN CHỌN (NHÂN VIÊN / CÁN BỘ）
                            <br />
                                  甄選紀錄表（非工人)
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
                            ADHR02-SP001-04<br />
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
                            6
                        </td>
                        <td class="colum3 align-middle">
                            Trang 頁次 <br />
                            1/3
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered" style="margin-top: 10px;">
                    <tr>
                        <td colspan="12" style="text-align: center; padding: 10px;"><strong>THÔNG TIN CÁ NHÂN 個人資料</strong></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Họ tên người ứng tuyển:
                            <br />應徵者姓名 : {{ candidate.candidate_name }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Thời gian và ngày tháng sơ tuyển:
                            <br />初試日期和時間：{{ candidate.hr_iv_date }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px; ">
                            Đơn vị xét tuyển：
                            <br />面試單位: {{ candidate.apply_dp }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Bộ phận/ chức vụ xin ứng tuyển:
                            <br />希望應徵部門/職務: {{ candidate.tmp_departid }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px;">
                            Thời gian ngày tháng phỏng vấn lại：
                            <br />複試日期和時間：{{ candidate.dp_iv_date }}
                        </td>
                        <td colspan="4" style="text-align: left; padding-bottom: 20px; ">
                            Phỏng vấn ứng viên:
                            <br />單位面試人員 :
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" style="text-align: left;">
                            Học lực 教育程度: {{ candidate.eduText }}
                            
                        </td>
                        <td colspan="6" style="text-align: left;">
                            Kinh nghiệm công việc 工作經驗: &nbsp;&nbsp; {{ extractNumber(candidate.work_exp) }} năm 年
                            <br />Kinh nghiệm việc bán thời gian 兼職工作經驗 &nbsp;&nbsp; {{ extractNumber(candidate.work_exp_pt) }} năm 年
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: left;">
                            Thông qua kênh tuyển dụng nào biết được thông tin công ty đang tuyển dụng透過什麼樣的招募管道知道志寧公司的招募資訊:
                            <div style="display: flex; justify-content: left; gap: 40px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === ''">Tìm việc nhanh 人力銀行網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '7'">Website công ty 志寧公司網站</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '4'">Bạn bè giới thiệu 親友介紹</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '1'">Băng rôn tuyển dụng 招募布條</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '2'">Tờ rơi tuyển dụng 招募傳單</label>
                            </div>
                            <div style="display: flex; justify-content: left; gap: 50px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '3'">Phát thanh văn phòng xã 村辦公室廣播</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '8'"> Website trường học, trung tâm đào tạo nghề 學校職訓中心網站,學校</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;" :checked="candidate.recru_source === '6'">Hội chợ việc làm ở trường 學校招募博覽會,學校</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left; width: 25%;">
                            Vui lòng điền tên trường:
                            <br />請填寫學校名稱: {{ candidate.school}}
                        </td>
                        <td colspan="2" style="text-align: left; width: 15%;">
                            Khoa
                            <br />科系:
                        </td>
                        <td colspan="3" style="text-align: left; width: 25%;">
                            Tên công ty đã làm việc/hiện tại
                            <br />現任/前任服務公司名稱: {{ candidate.ex_company}}
                        </td>
                        <td colspan="2" style="text-align: left; width: 20%;">
                            Bộ phận /chức vụ
                            <br />工作部門/職務: {{ candidate.ex_position}}
                        </td>
                        <td colspan="2" style="text-align: left; width: 15%;">
                            Thâm niên
                            <br />年資: {{ calculateTotalExperience() }}  năm 年
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            Khả năng ngôn ngữ 語言能力:
                            <br />(Thi viết kết quả HR điền <br />紙筆測驗結果HR填寫)
                        </td>
                        <td colspan="5" style="border: 1px solid #000; padding: 0; height: 80px;">
                            <div style="border-bottom: 1px solid #000; padding: 5px; height: 60%; box-sizing: border-box;">
                                <div style="margin-bottom: 5px;">
                                    <label style="white-space: nowrap; margin-right: 10px;">
                                        <input type="checkbox" readonly @click.prevent style="margin: 8px;">Lưu loát 精通
                                    </label>
                                    <label style="white-space: nowrap;">
                                        <input type="checkbox" readonly @click.prevent style="margin: 8px;">Khá尚可
                                    </label>
                                </div>
                                <div style="margin-top: 5px; text-align: left;">
                                    Tiếng Hoa/中文測驗分數:
                                </div>
                            </div>
                            <div style="padding: 5px; height: 40%; box-sizing: border-box; text-align: left;" >
                                Tiếng Anh / 英文測驗分數:
                            </div>
                        </td>
                        
                        <td colspan="5">
                            <div style=" text-align: left; padding: 5px; height: 50%; box-sizing: border-box;">
                                Mức lương mong muốn:
                                <br/>應徵者預期薪資:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNĐ
                            </div>
                            <div style="text-align: left;padding: 5px; height: 50%; box-sizing: border-box;">
                                Bộ phận HR kiến nghị lương:
                                <br/>人資部建議薪資:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNĐ
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            Kỹ năng nói口語能力
                            <br />(Chủ quản điền cấp bậc sau phỏng vấn主管面試評估)
                        </td>
                        <td colspan="1">
                            Tiếng Hoa
                            <br />中文
                        </td>
                        <td colspan="4">
                            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Lưu loát 精通</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Khá 尚可</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;"> Trung bình 略懂</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Kém 差</label>
                            </div>
                        </td>
                        <td colspan="1">
                            Tiếng Anh
                            <br />英文
                        </td>
                        <td colspan="4">
                            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Lưu loát 精通</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Khá 尚可</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;"> Trung bình 略懂</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 8px;">Kém 差</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 10px;">
                            Đánh giá phỏng vấn của ADHR/ ADHR面試評語
                        </td>
                        <td colspan="6">
                            Kết quả phỏng vấn ADHR ADHR面試結果
                            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Xuất sắc 優</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Giỏi 良</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Tốt 好</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Chấp nhận 可</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Kém 差</label>
                            </div>
                        </td>
                    </tr>
                </table>
                <table class="table table-bordered no-top-border" style="margin-top: 0; border-top: none;">
                    <tr>
                        <td colspan="2" style="width: 25%;">
                            Câu hỏi tham khảo
                            <br />參考問題
                        </td>
                        <td colspan="4" style="width: 25%;">
                            Hạng mục đánh giá
                            <br />評量項目
                        </td>
                        <td colspan="3" style="width: 25%;">
                            Đánh giá(A~E)
                            <br />評價(A~E)
                        </td>
                        <td colspan="3" style="width: 25%;">
                            Nhận xét
                            <br />評語
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3" style="text-align: center; vertical-align: middle; padding: 8px; width: 7%;">
                            Ấn tượng chung
                            <br />一般印象
                        </td>
                        <td rowspan="3" style="text-align: left; vertical-align: top; padding: 8px; width: 18%;">
                            1. Xin dành 2~3 phút tự giới thiệu bản thân
                            <br />請用2~3分鐘簡單自我介紹
                            <br />2. Nguyên nhân thôi việc công ty cũ (nếu có kinh nghiệm làm việc)
                            <br />離開前一家公司的原因 (如有工作經驗)
                            <br />3. Tại sao muốn ứng tuyển vào công ty chúng tôi ?
                            <br />為何應徵本公司?
                            <br />4. Công ty này có những bộ phận/ chức vụ nào bạn quan tâm
                            <br />本公司的那些部門/職務你有興趣
                            <br />5. Giải thích ưu điểm, khuyết điểm bản thân, tại sao ?
                            <br />說明自己的優缺點,為什麼?
                        </td>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            1. Biểu hiện cuộc nói chuyện, hình ảnh tốt đẹp, lịch sự, ăn nói lưu loát
                            <br />外表談吐, 形象好, 舉止得體,齒清晰
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            2. Động lực công việc là hợp lý
                            <br />求職動機是否合理
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            3. Trả lời câu hỏi khách quan, quan niệm tích cực về phía trước
                            <br />客觀回覆問題, 觀念積極正向
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td rowspan="5" style="text-align: center; vertical-align: middle; padding: 8px; width: 7%;">
                            Kinh nghiệm/ tiềm năng
                            <br />經驗/潛力
                            
                        </td>
                        <td rowspan="5" style="text-align: left; vertical-align: top; padding: 8px; width: 18%;">
                            1. Tham gia các hoạt động ngoại khóa/ tổ chức ở trường/ kinh nghiệm thực tập
                            <br />就學時參加校外活動/學校社團/實習經驗
                            <br />2. Ví dụ điều bổ ích nhất trong công việc đã làm hoặc học tập
                            <br />舉例在過去工作或是學習中最有成就感的事
                            <br />3. Trong công việc hoặc trong học tập gặp phải khó khăn và quá trình giải quyết
                            <br />工作中或課業中遇到困難與解決過程
                            <br />4. Bạn có làm việc một mình hoặc làm việc theo nhóm tại nơi làm việc/ trường học không ?
                            <br />在工作/學校中是屬於單獨完成任務或是團隊合作? 喜歡單獨完成或是團隊合作?
                            <br />5. Lãnh đạo nhóm hoặc thành viên trong nhóm? Kinh nghiệm hoàn thành nhiệm vụ theo nhóm ?
                            <br />領導者或是團隊成員? 團隊完成任務經驗?
                            
                        </td>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            1. Có tinh thần làm việc nhóm
                            <br />是否具備團隊精神
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            2. Có thể chuyển đổi làm việc độc lập và làm việc nhóm giữ vai trò cá nhân
                            <br />能否轉換單獨工作與團隊合作的角色
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            3. Các mối quan hệ 人際關係
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            4. Năng lực lãnh đạo 領導能力
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            5. Kỹ năng giải quyết vấn đề
                            解決問題能力
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td rowspan="5" style="text-align: center; vertical-align: middle; padding: 8px; width: 7%;">
                            Thái độ làm việc
                            <br />工作態度
                        </td>
                        <td rowspan="5" style="text-align: left; vertical-align: top; padding: 8px; width: 18%;">
                            1. Nếu như chủ quản/ thầy giáo hiểu lầm bạn, bạn sẽ làm như thế nào ?
                            <br />如果主管/老師對你有誤解,你會怎麼做?
                            
                            <br />2. Trước đây trong công việc/ khóa học trong hoàn cảnh nhận được lời phê bình, phản ứng
                            đầu tiên là gì ?
                            <br />上 次工作中/課業中受到批評的情景,第一反應是?
                            
                            <br />3. Môi trường làm việc và chủ quản như thế nào mà bạn không thể chấp nhận ?
                            <br />什麼樣的工作環境與主管是你無法接受?
                            <br />4. Do nhiệm vụ công ty phải sắp xếp công việc không quen thuộc, bạn sẽ làm như thế nào?
                            <br />公司因任務需要安排非常不熟悉的工作, 會怎麼做?
                            
                            <br />5. Cách giao tiếp hiệu quả nhất trong công việc/ khóa học ?<br />工作中/課業中最有效的溝通方式?
                            
                        </td>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            1. Can đảm để chấp nhận thách thức và tích cực làm việc
                            <br />積極並勇於接受挑戰性工作
                            
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            2. Tính ổn định và độ bền làm việc
                            <br />穩定性與工作耐力
                            
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            3. Kỹ năng giao tiếp 溝通能力
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            4. Tinh thần trách nhiệm 責任感
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            5. Sự dẻo dai trong công việc 工作彈性
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 25%;"></td>
                        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 25%;"></td>
                    </tr>
                    <tr>
                        <td rowspan="3" style="text-align: center; vertical-align: middle; padding: 8px; width: 7%;">
                            Kiến thức an toàn lao động 職場安全衛生知識知識
                        </td>
                        <td rowspan="3" style="text-align: left; vertical-align: top; padding: 8px; width: 18%;">
                            1. Theo bạn đối với công việc không thuộc về sản xuất thì có cần quan tâm đến an toàn lao động
                            hay không?
                            <br />您認為非直接生產的工作是否需要注意職場安全衛生？
                            
                            <br />2. Nếu bạn là người giám sát công việc của nhóm thì bạn có cần tuân thủ quy tắc an toàn
                            lao động hay không? Tại sao?
                            <br />如果您是幹部，請問您是否需要遵守職場安全衛生規則？為什麼？
                            
                            <br />3. Nếu bạn quan sát thấy tai nạn lao động xảy ra thì bạn sẽ xử lý như thế nào?
                            <br />如果您在工作時間中發現工傷事故，您將如何處理？
                        </td>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                            1. Có nhận thức cơ bản về an toàn lao động
                            <br />有基本的職場安全衛生意識
                            
                        </td>
                        <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 12.5%;">
                            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Có 有 </label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Không 否</label>
                            </div>
                        </td>
                        <td colspan="3" rowspan="3"
                        style="text-align: left; justify-content: top;padding: 8px; min-height: 120px; width: 12.5%;">
                        Tiêu chí đánh giá 評價標準
                        <br />Nhân viên: Mức độ 1 課員:第一級(問題1)
                        <br />Cán bộ: Mức độ 1,2,3 幹部:第三級(問題123)
                        <br />Đánh giá 评价
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Đạt 適任</label>
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Không đạt 不適</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                        2. Có kiến thức và tuân thủ quy tắc an toàn lao động
                        <br />了解和遵守職場安全衛生規則
                    </td>
                    <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 12.5%;">
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Có 有 </label>
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Không 否</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: left; padding: 8px; width: 25%;">
                        3. Hiểu nguyên tắc và quy trình xử lý về an toàn lao động
                        <br />了解處理職場安全衛生的原則和程序
                        
                    </td>
                    <td colspan="3" style="text-align: center; padding: 8px; min-height: 40px; width: 12.5%;">
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 5px;">
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px; margin-top: 25px;">Có 有 </label>
                            <label><input type="checkbox" readonly @click.prevent style="margin: 5px;margin-top: 25px;">Không 否</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: center; padding: 10px;">
                        Xét tuyển đánh giá 面談評語:
                    </td>
                    <td colspan="3" style="text-align: center; padding: 10px;">
                        Kết quả xét tuyển 面試結果
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: left; width: 33.33%;">
                        Bộ phận Tài Nguyên Nhân Lực 人力資源部:
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />Người phỏng vấn BP.HR ký tên:
                        HR面試人員簽名:_________________________
                    </td>
                    <td colspan="4" style="text-align: left; width: 33.33%;">
                        Đơn vị xét tuyển 面試單位:
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />Nhân viên đơn vị phỏng vấn ký tên:
                        單位面試人員簽名:_________________________
                    </td>
                    <td colspan="4" style="text-align: left; width: 33.33%;">
                        <div style="display: flex;flex-direction: column; justify-content: center; gap: 10px;">
                            <label><input type="checkbox" style="margin: 5px; ">Tuyển dụng 錄用
                                <br />Ngày dự kiến nhận việc 預計報到日:______________</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;">Không tuyển dụng 不錄用</label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; ">Lưu trữ hồ sơ 留作儲備 </label>
                                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;">Chuyển bộ phận khác 轉介給其他部門</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="text-align: center; padding: 10px;">
                            Phạm vi tiền lương 核薪範圍:
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: left; padding: 8px; width: 33.33%;">
                            Lương thử việc 試用期底薪：
                        </td>
                        
                        <td colspan="3" rowspan="3"
                        style="text-align: left; padding: 8px; min-height: 120px; width: 33.33%;">
                        Cấp 職級：
                        <div
                        style="display: flex; flex-direction: column;justify-content: center; gap: 0px; margin-top: 5px;">
                        <label><input type="checkbox" readonly @click.prevent style="margin: 5px; ">Không điều chỉnh, giữ cấp bậc cố định,
                            bậc:_________
                            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不調整,維持固定職級,職級: _________
                        </label>
                        <label><input type="checkbox" readonly @click.prevent style="margin: 5px;">Dựa theo bảng đánh giá thử việc điều
                            chỉnh, cấp bậc có thể điều chỉnh:
                            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;依照試用期表現調整, 職級可能調整
                        </label>
                    </div>
                </td>
                <td colspan="3" rowspan="3"
                style="text-align: left; padding: 8px; min-height: 120px; width: 33.33%;">
                <div
                style="display: flex; flex-direction: column; justify-content: center; gap: 10px; margin-top: 5px;">
                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; ">Tuyển dụng 錄用
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ngày dự kiến nhận việc 預計報到日:______________
                </label>
                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;">Không tuyển dụng 不錄用</label>
                <label><input type="checkbox" readonly @click.prevent style="margin: 5px; ">Lưu trữ hồ sơ 留作儲備</label>
                <label><input type="checkbox" readonly @click.prevent style="margin: 5px;">Chuyển bộ phận khác 轉介給其他部門</label>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="4" style="text-align: left; padding: 8px; width: 33.33%;">
            Lương sau thời gian thử việc 試用期後底薪：
            
        </td>
    </tr>
</table>
<table class="table table-bordered no-top-border" style="margin-top: 0; border-top: none;">
    <tr>
        <td rowspan="3" style="text-align: left; vertical-align: top; padding: 8px; width: 10%;">
            Phụ cấp ngôn ngữ
            <br />語言津貼：
        </td>
        <td colspan="4" style="text-align: left; padding: 8px; width: 20%;">
            Phụ cấp chuyên môn thử việc:
            <br />專業津貼試用期:
        </td>
        <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 20%;">
            Phụ cấp chức vụ (nếu có) thử việc:
            <br />職務津貼(如有)試用期
        </td>
        <td colspan="3" rowspan="3"
        style="text-align: left; vertical-align: top; padding: 8px; min-height: 120px; width: 10%;">
        Thưởng chuyên cần:
        <br />全勤獎金:
    </td>
    <td colspan="3" rowspan="3"
    style="text-align: left; vertical-align: top; padding: 8px; min-height: 120px; width: 10%;">
    Trợ cấp đi lại:
    <br />交通補助:
</td>
<td rowspan="1" style="text-align: left; vertical-align: top; padding: 8px; width: 20%;">
    Tổng lương thử việc:
    <br />試用期全薪:
</td>
</tr>
<tr>
    <td colspan="4" style="text-align: left; padding: 8px; width: 20%;">
        Phụ cấp chuyên môn sau thử việc:
        <br />專業津貼試用後:
    </td>
    <td colspan="3" style="text-align: left; padding: 8px; min-height: 40px; width: 20%;">
        Phụ cấp chức vụ (nếu có) sau thử việc:
        <br />職務津貼(如有試用後)
    </td>
    <td style="text-align: left; vertical-align: top; padding: 8px; width: 20%;">
        Tổng lương sau thử việc:
        <br />試用後全薪:
    </td>
</tr>

</table>
<table class="table table-bordered no-top-border" style="margin-top: 0; border-top: none;">
    <tr>
        <td colspan="12" style="text-align: center; padding: 10px;">Kí duyệt 簽核單位: </td>
    </tr>
    <tr>
        <td colspan="2" style="text-align: center;">Văn phòng TGĐ
            <br />總經理室
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
        <td colspan="2" style="text-align: center;">Khu quản lý
            <br />管理處
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
        <td colspan="2" style="text-align: center;">Bộ phận Tài Nguyên Nhân Lực
            <br />人力資源部:
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
        <td colspan="2" style="text-align: center;">Chủ Quản Cấp Sở
            <br />處級主管:
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
        <td colspan="2" style="text-align: center;">Chủ Quản Bộ Phận
            <br />部級主管
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
        <td colspan="2" style="text-align: center;">Chủ Quản Đơn Vị
            <br />單位主管
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
    </tr>
    <tr>
        <td colspan="12" style="text-align:left;">Lưu trình trình ký/表格流程: <br/>
            -  Chủ quản đơn vị ➜ Chủ quản bộ phận  ➜ Chủ quản cấp sở ➜ BP Tài Nguyên Nhân Lực(Chức vụ Trưởng ngành  trở xuống)
            <br/>&nbsp;&nbsp;單位主管 ➜ 部級主管 ➜ 處級主管 ➜ 人力資源部 (課長級(含)以下)<br/>
            -  Chủ quản đơn vị ➜ Chủ quản bộ phận ➜ Chủ quản cấp sở ➜ BP Tài Nguyên Nhân Lực Khu quản lý ➜ VP. TGĐ (Chức vụ Trưởng ngành cao cấp ( trở lên))
            <br/>&nbsp;&nbsp;單位主管 ➜ 部級主管 ➜ 處級主管 ➜  人力資源部 ➜ 管理處總經理室(資深課長級(含)以上)
            
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
                eduText: '',
                hr_iv_date: '',
                dp_iv_date: '',
                apply_dp: '',
                tmp_departid: '',
                hr_ac_qu: '',
                dp_ac_qu: '',
                recru_source: '',
                school: ''
            },
            candidates: [], // Array to store multiple candidates
            educationLevels: {
                '001': 'Tiểu học (5 năm)',
                '002': 'THCS (9 năm)',
                '003': 'Dưới Lớp 12',
                '004': 'Tốt nghiệp 12 (Không có kinh nghiệm)',
                '005': 'Tốt nghiệp 12 (Có kinh nghiệm)',
                '006': 'Trung học CN',
                '007': 'Cao đẳng',
                '008': 'Đại học',
                '009': 'Thạc sĩ',
                '10':'Tiến sĩ'
            },
            resignData: [],
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
                this.candidates = []; // Reset candidates array
                
                for (const id of idArray) {
                    const response = await this.$axios.get(`${this.api}getDataById/${id}`);
                    if (response && response.data) {
                        const candidateData = response.data;
                        console.log("Candidate data:", candidateData);
                        
                        if (candidateData?.position && 
                        candidateData.position.toLowerCase() !== 'worker' && 
                        candidateData.position.trim() !== '') {
                            this.candidates.push({
                                candidate_name: candidateData?.candidate_name || '',
                                position: candidateData?.position || '',
                                dateofbirth: candidateData?.dateofbirth || '',
                                emp_id: candidateData?.emp_id || '',
                                regAddress: candidateData?.regAddress || '',
                                email: candidateData?.email || '',
                                work_exp: candidateData?.work_exp || '',
                                work_exp_pt: candidateData?.work_exp_pt || '',
                                ex_company: candidateData?.ex_company || '',
                                ex_position: candidateData?.ex_position || '',
                                edu: candidateData?.edu || '',
                                eduText: this.educationLevels[candidateData?.edu] || '',
                                hr_ac_qu: candidateData?.hr_ac_qu || '',
                                dp_ac_qu: candidateData?.dp_ac_qu || '',
                                hr_iv_date: candidateData?.hr_iv_date || '',
                                dp_iv_date: candidateData?.dp_iv_date || '',
                                apply_dp: candidateData?.apply_dp || '',
                                tmp_departid: candidateData?.tmp_departid || '',
                                recru_source: candidateData?.recru_source || '',
                                school: candidateData?.school || '',

                            });
                        }
                    }
                    await this.getDataResign(); // Call getDataResign after fetching each candidate
                }
            } catch (error) {
                console.error("Error fetching candidate data:", error);
            }
        },
        async getDataResign() {
            let params = {
                emp_id: this.candidates[0]?.emp_id
            };
            try {
                const response = await this.$axios.post(this.api + 'GetDataByCCCDResign', params);
                this.resignData = response.data;
                console.log("Resign data:", this.resignData);
                
                
            } catch (error) {
                console.error("Error fetching employee data:", error);
            } finally {
            }
        },
        extractNumber(value) {
            if (!value) return '___';
            
            const str = value.toString().toUpperCase();
            // Check if contains "THÁNG"/"THANG"
            if (str.includes('THÁNG') || str.includes('THANG') ||str.includes('months') || str.includes('month')) {
                const numberMatch = str.match(/[\d.,]+/);
                if (!numberMatch) return '___';
                // Convert months to years (divide by 12) and round to 1 decimal
                return (parseFloat(numberMatch[0].replace(',', '.')) / 12);
            }
            
            // Handle regular year cases
            const numberMatch = str.match(/[\d.,]+/);
            if (!numberMatch) return '___';
            return parseFloat(numberMatch[0].replace(',', '.'));
        },
        
        calculateTotalExperience() {
            let workExp = this.candidates[0]?.work_exp || '0';
            let erSeniority = this.resignData[0]?.er_seniority || 0;
            const exCompany = this.candidates[0]?.ex_company || '';
            
            const str = workExp.toString().toUpperCase();
            let workExpNumber = 0;
            
            if (str.includes('THÁNG') || str.includes('THANG')) {
                const numberMatch = str.match(/[\d.,]+/);
                if (numberMatch) {
                    workExpNumber = parseFloat(numberMatch[0].replace(',', '.')) / 12;
                }
            } else {
                const numberMatch = str.match(/[\d.,]+/);
                if (numberMatch) {
                    workExpNumber = parseFloat(numberMatch[0].replace(',', '.'));
                }
            }
            // Only add erSeniority if CAN SPORTS VN is not in ex_company
            const total = workExpNumber + (exCompany.includes('CAN SPORTS VN') || exCompany.includes('CANSPORTS') ? 0 : erSeniority);
            return total;
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
    border: 1px solid #333 !important;
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
    border-collapse: collapse !important;
}

.no-interior-borders td,
.no-interior-borders th {
    border: 1px solid #333 !important;
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
        /* Changed to landscape orientation */
    }
    
    /* Scale content to 86% */
    [ref="printContent"] {
        transform: scale(0.84);
        transform-origin: top left;
    }
}

/* Update no-top-border class */
.no-top-border {
    border-collapse: collapse !important;
    border-top: none !important;
}

.no-top-border tr:first-child td {
    border-top: none !important;
}

/* Ensure other borders remain visible */
.no-top-border td,
.no-top-border th {
    border: 1px solid #333 !important;
}

/* Add new styles for table cells */
.table td[style*="text-align: left"] {
    text-align: left !important;
    padding: 8px !important;
}

.table td[style*="text-align: center"] {
    text-align: center !important;
    padding: 8px !important;
    min-height: 40px;
}

/* Ensure minimum height for input cells */
.table td:empty {
    min-height: 40px;
    height: 40px;
}

/* Add specific styles for the evaluation table */
.table.no-top-border td[colspan="2"] {
    border-right: 1px solid #333 !important;
}

.table.no-top-border td[colspan="4"] {
    border-right: 1px solid #333 !important;
}

.table.no-top-border td[colspan="3"] {
    border-right: 1px solid #333 !important;
}

/* Update column widths for evaluation table */
.table.no-top-border td[rowspan="3"] {
    width: 7% !important;
    border-right: 1px solid #333 !important;
}

.table.no-top-border td[style*="width: 18%"] {
    width: 18% !important;
    border-right: 1px solid #333 !important;
}

.table.no-top-border td[style*="width: 25%"] {
    width: 25% !important;
    border-right: 1px solid #333 !important;
}

/* Update specific styles for the safety knowledge section */
.table.no-top-border td[style*="width: 12.5%"] {
    width: 12.5% !important;
    border-right: 1px solid #333 !important;
}

/* Add these new styles */
.page-container {
    width: 100%;
    height: 100%;
}

.page-break {
    page-break-before: always;
}

@media print {
    .page-container {
        page-break-after: always;
    }
    
    .page-container:last-child {
        page-break-after: avoid;
    }
}
</style>