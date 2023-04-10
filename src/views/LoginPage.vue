<template>
    <h1 class="page-title">{{ pageTitle }}</h1>
    <div class="container">
        <form @submit.prevent="handleSubmit">
            <div class="form-group row mb-3">
                <div class="mx-auto col-sm-4 form-label">
                    <label for="username">ชื่อผู้ใช้</label>
                    <input type="text" class="form-control"
                    id="username" v-model="username"
                    placeholder="Enter Username"/>
                </div>
            </div>
            <div class="form-group row mb-4">
                <div class="mx-auto col-sm-4 form-label">
                    <label for="password">รหัสผ่าน</label>
                    <input type="password" class="form-control"
                    id="password" v-model="password"
                    placeholder="Enter Password"/>
                </div>
            </div>
            <button class="btn btn-primary btn-block">Login</button>
        </form>
    </div>
</template>

<script>
import helper from '@/helpers/helper';

export default {
    name: 'loginPage',
    data() {
        return {
            pageTitle: 'เข้าสู่ระบบ',
            username: '',
            password: '',
        }
    },
    methods: {
        async handleSubmit() {
            const data = {
                username: this.username,
                password: this.password
            }
            this.$store.dispatch('auth/login', data).then(
                () => {
                    this.$router.push("/")
                },
                error => {
                    helper.failAlert(error);
                }
            )
        }
    }
}
</script>