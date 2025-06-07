<template>
    <div>
        <div class="header">
            <h2 style="margin: 0; text-align: center;">BẢNG THEO DÕI CÔNG NHÂN VIÊN ĐẾN NHẬN VIỆC</h2>
            <h3 style="margin: 0; text-align: center;">員工報到追蹤表</h3>
        </div>
        <table class="table" style="margin-bottom: 3px">
            <thead>
                <tr>
                    <td colspan="10" class="text-left">
                        Ngày điền biểu/填表日期: {{ today }} 
                    </td>
                </tr>
                <tr>
                    <th class="text-center"> STT <br /> 序號 </th>
                    <th class="text-center">DỰ KIẾN NHẬN VIỆC <br /> 報到日期 </th>
                    <th class="text-center name-column"> Họ và tên <br /> 姓名 </th>
                    <th class="text-center"> CHỨC VỤ <br /> 職務 </th>
                    <th class="text-center"> BỘ PHẬN <br /> 部門 </th>
                    <th class="text-center"> ĐÃ ĐẾN NHẬN VIỆC <br /> 已來任職 </th>
                    <th class="text-center"> KHÔNG ĐẾN NHẬN VIỆC <br /> 未來任職 </th>
                    <th class="text-center"> LÝ DO <br /> 理由 </th>
                    <th class="text-center"> ĐỔI NGÀY NHẬN VIỆC <br /> 改任職日期 </th>
                    <th class="text-center"> GHI CHÚ <br/> 備註 </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in formattedData" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ item.ex_en_date }}</td>
                    <td class="text-center">{{ item.candidate_name }}</td>
                    <td class="text-center">{{ item.duty_name }}</td>
                    <td class="text-center">{{ item.tmp_departid }}</td>
                    <td class="text-center">{{ item.reg === 'yes' ? '✓' : '' }}</td>
                    <td class="text-center">{{ item.reg !== 'yes' ? '✓' : '' }}</td>
                    <td class="text-center">{{ item.reason || '' }}</td>
                    <td class="text-center">{{ item.change_en_date || '' }}</td>
                    <td class="text-center">{{ item.note || '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    layout: "print",
    data() {
        return {
            api: 'http://gmo021.cansportsvg.com/api/vg-recuitingReport/',
            printData: [],
            today: dayjs().format("YYYY-MM-DD"),
            imageLoaded: true // No logo in this template, so we can set it to true
        };
    },
    computed: {
        formattedData() {
            return this.printData
                .map(item => ({
                    ...item,
                    duty_name: this.parseJson(item.duty_name)?.vi || '',
                    note: '' // Add note field if needed
                }))
                .sort((a, b) => {
                    return a.tmp_departid.localeCompare(b.tmp_departid, 'vi');
                });
        }
    },
    mounted() {
        // if (this.$route.query.data) {
        //     try {
        //         this.printData = JSON.parse(this.$route.query.data);
        //         console.log(this.$route.query.data);
        //         this.tryPrint();
        //     } catch (e) {
        //         console.error('Error parsing print data:', e);
        //         this.printData = [];
        //     }
        // }
        this.getDateHires();
    },
    methods: {
        parseJson(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                return null;
            }
        },
        // tryPrint() {
        //     if (this.imageLoaded && this.printData.length > 0) {
        //         setTimeout(() => {
        //             window.print();
        //         }, 500);
        //     }
        // }
        async getDateHires() {
            try {
                const res = await this.$axios.post(this.api + 'printHires', {
                    ex_en_date: this.$route.query.data,
                });
                this.printData = res.data;
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },  
    }
};
</script>
<style>
.header {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px 0;
}

.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    border-collapse: collapse; /* Collapse for cleaner borders */
    border-radius: 4px; /* Slightly increased border-radius */
    border: 1px solid #000; /* Border for the entire table */
}

.table thead th {
    padding: 10px; /* Padding for header cells */
    background-color: #f2f2f2; /* Light grey background for the header */
    color: #000;
    font-weight: bold;
    font-size: 14px; /* Increased font size for better visibility */
    border: 1px solid #000; /* Standardized border */
}

.table th.name-column {
    max-width: 150px; /* Adjust this value based on your needs */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table td {
    padding: 10px; /* Padding for data cells */
    font-size: 12px;
    border: 1px solid #000; /* Standardized border */
}

.table td:nth-child(3) { /* 3rd column - name column */
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table tbody tr {
    transition: background-color 0.2s ease; /* Smooth background transition */
}

.table tbody tr:hover {
    background-color: #e0e0e0; /* Light grey highlight on hover */
}

.text-center {
    text-align: center;
}

@media print {
    @page {
        size: landscape;
        margin: 10mm; /* Reduced margin to fit more content */
    }

    body {
        font-family: "Times New Roman", serif;
        -webkit-print-color-adjust: exact;
    }

    .table {
        table-layout: fixed; /* Force table to respect column widths */
        width: 100%;
        page-break-inside: auto;
    }

    .table th, .table td {
        overflow: visible !important; /* Override the ellipsis behavior for printing */
        white-space: normal !important; /* Allow text to wrap */
        word-wrap: break-word;
        font-size: 11px; /* Slightly smaller font size to fit content */
    }

    .table th.name-column, 
    .table td:nth-child(3) {
        max-width: none; /* Remove max-width restriction for printing */
    }

    tr {
        page-break-inside: avoid;
    }

    thead {
        display: table-header-group;
    }

    tfoot {
        display: table-footer-group;
    }

    .header h2, .header h3 {
        margin: 0;
        font-size: 16px; /* Increase font size for headings */
    }

    /* Specific styling for Chinese text */
    .chinese-text {
        font-family: "Simsun", "Times New Roman", serif; /* Use Simsun for Chinese text */
    }
}
</style>