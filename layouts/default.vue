<i18n>
    {
      "en": { 
          "appName" :"Recruitment tool"
      },
      "cn": {
          "appName" :"招聘工具"
      },
      "vi": {
          "appName" :"Công cụ tuyển dụng"
      }
    }
  </i18n>
<template>
<v-app dark>
    <notifications position="top center" animation-type="velocity" />
    <v-navigation-drawer temporary v-model="drawer" app  color="teal" dark>
        <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact @click="drawer = false">
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title[$i18n.locale]" />
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <!-- <v-list-item link @click="logout">
                <v-list-item-action>
                    <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ { en: 'Logout', cn: '登出', vi: 'Đăng xuất' }[$i18n.locale] }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item> -->
        </v-list>
    </v-navigation-drawer>
    <v-app-bar dense app absolute color="teal" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>
            <v-btn text to="/">
                <h3>
                    {{ $t('appName') }}
                </h3>
            </v-btn>
        </v-toolbar-title>
        <v-spacer />
        <v-btn @click="setLocale('vi')" text>VI</v-btn>
        <v-btn @click="setLocale('cn')" text>中文</v-btn>
        <v-btn @click="setLocale('en')" text>EN</v-btn>
        <!-- <v-btn style="text-transform: capitalize" text @click="logout">
            {{ $t('Welcome') }}: {{ $session.get('recruiting-report').name}} - {{ $session.get('recruiting-report').dept}}
            <v-icon class="ml-3">mdi-logout-variant</v-icon>
        </v-btn> -->
        <v-btn v-if="sessionLoaded" style="text-transform: capitalize" text >
            {{ $t('Welcome') }}: {{ $session.get('recruiting-report').name}} - {{ $session.get('recruiting-report').dept}}
        </v-btn>
    </v-app-bar>
    <v-main>
        <v-container fluid>
            <auth></auth>
            <AuthComp ref="authComp" app="recruiting-report" @setUser="setUser" />
            <nuxt />
        </v-container>
    </v-main>
</v-app>
</template>
<script>
import auth from '~/components/auth';
import AuthComp from "../../../@global-component/auth-comp";
export default {
    components: {
        auth,
        AuthComp,
    },
    data() {
        return {
            sessionLoaded: false,
            drawer: false,
            activeUser: {
                empno: null,
            },
            items: [{
                    icon: 'mdi-clipboard-text-outline', // Better represents requirements/demands
                    title: {
                        en: 'Demand',
                        cn: '需求',
                        vi: 'Yêu cầu',
                    },
                    to: '/demand',
                },
              
                {
                    icon: 'mdi-account-plus-outline', // Keep for adding new candidate
                    title: {
                        en: ' New candidate',
                        cn: '新候选人',
                        vi: 'Thêm ứng viên mới',
                    },
                    to: '/create-candidate',
                },
                {
                    icon: 'mdi-account-multiple', // Group of people for candidate list
                    title: {
                        en: 'Candidate listing',
                        cn: '候选人名单',
                        vi: 'Danh sách ứng viên',
                    },
                    to: '/',
                },
                {
                    icon: 'mdi-school', // School icon for interns
                    title: {
                        en: 'Intern',
                        cn: '实习生',
                        vi: 'Thực tập sinh',
                    },
                    to: '/intern',
                },
                {
                    icon: 'mdi-file-chart', // Better represents reports with charts
                    title: {
                        en: 'Recruiting Report',
                        cn: '招聘报告',
                        vi: 'Báo cáo tuyển dụng',
                    },
                    to: '/recruiting-report',
                },
                {
                    icon: 'mdi-office-building', // Better represents department/organization
                    title: {
                        en: 'Dept control',
                        cn: '部门控制',
                        vi: 'Quản lý bộ phận',
                    },
                    to: '/deptcontrol',
                },
                {
                    icon: 'mdi-account-arrow-right', // Better represents leaving/resignation
                    title: {
                        en: 'Resign listing',
                        cn: '离职名单',
                        vi: 'Danh sách thôi việc',
                    },
                    to: '/resign',
                },
                // resign-report
                {
                    icon: 'mdi-file-chart', // Better represents reports with charts
                    title: {
                        en: 'Resign Report',
                        cn: '离职报告',
                        vi: 'Báo cáo thôi việc',
                    },
                    to: '/resign-report',
                },
               
            ],
        };
    },
    methods: {
        setUser(user) {
            console.log("setUser triggered", user);
            console.log(user);
            this.$session.set("recruiting-report", {
                username: user.username,
                dept: user.dept,
                empno: user.empno,
                name: user.name,
                location: user.location,
            });
            this.sessionLoaded = true;
        },
        async logout() {
            this.$session.remove('recruiting-report');
            this.$session.remove('vg-portal');
            this.$router.push('./');
        },
        setLocale(tg) {
            this.$i18n.setLocale(tg);
            this.$nuxt.$emit('setLocale', tg);
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.activeUser = this.$session.get('recruiting-report');
        });
    },
};
</script>
 