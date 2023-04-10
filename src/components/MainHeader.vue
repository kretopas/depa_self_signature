<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <router-link to="/">
                <a class="navbar-brand">depa Self-Signature</a>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
            aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="currentUser">
                    <li class="nav-item">
                        <router-link to="/">
                            <a class="nav-link">ลงนาม (ผู้บริหาร)</a>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/self">
                            <a class="nav-link">ลงนาม (ด้วยตัวเอง)</a>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="#">
                            <a href="javascript:void(0)" @click="logoutClick"
                            class="nav-link">ออกจากระบบ</a>
                        </router-link>
                    </li>
                </ul>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-else>
                    <li class="nav-item">
                        <router-link to="/login">
                            <a class="nav-link">เข้าสู่ระบบ</a>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: 'mainHeader',
    data() {
        return {}
    },
    methods: {
        logoutClick() {
            Swal.fire({
                text: "ออกจากระบบหรือไม่?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "ออกจากระบบ",
                confirmButtonColor: "#d33",
                cancelButtonText: "ยกเลิก"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$store.dispatch('auth/logout');
                    this.$router.push('/login');
                }
            })
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    }
}

</script>