<template>
    <div class="container">
        <h1>ลงนามเอกสาร</h1>
        <form @submit.prevent="signDocument" style="margin-top: 20px;">
            <div class="form-group row">
                <label for="x_axis" class="col-sm-2 col-form-label">ตำแหน่ง X</label>
                <div class="col-sm-10">
                    <input type="number" id="x_axis" 
                    v-model="x_axis" class="form-control"
                    @change="changeShowPreview"
                    required />
                </div>
            </div>
            <div class="form-group row">
                <label for="y_axis" class="col-sm-2 col-form-label">ตำแหน่ง Y</label>
                <div class="col-sm-10">
                    <input type="number" id="y_axis"
                    v-model="y_axis" class="form-control"
                    @change="changeShowPreview"
                    required />
                </div>
            </div>
            <div class="form-group row">
                <label for="page_number" class="col-sm-2 col-form-label">หน้า</label>
                <div class="col-sm-10">
                    <input type="number" id="page_number" v-model="page_number" class="form-control" required />
                </div>
            </div>
            <div class="form-group row">
                <label for="signer" class="col-sm-2 col-form-label">ผู้ลงนาม</label>
                <div class="col-sm-10">
                    <select v-model="selected_signer" id="signer" @change="changeShowPreview">
                        <option value="" disabled hidden>-- เลือกผู้ลงนาม --</option>
                        <option v-for="(signer, index) in signer_options" :value="signer.employee_id[0]" v-bind:key="index">
                            {{ signer.employee_id[1] }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <label for="pdf_file" class="col-sm-2 col-form-label">ไฟล์เอกสาร</label>
                <div class="col-sm-10">
                    <input type="file" id="pdf_file" name="pdf_file"
                    required @change="selectedPDF($event.target.files)"
                    />
                </div>
            </div>
            <div class="form-group mb-2">
                <button class="btn btn-warning btn-block mb-2" type="button" @click="showPreview" v-if="!previewPDF">ดูตัวอย่าง</button>
                <button class="btn btn-secondary btn-block mb-2" type="button" v-else @click="previewPDF = false">ปิดตัวอย่าง</button>
                <button class="btn btn-primary btn-block mb-2">ลงนาม</button>
            </div>
            <div v-show="previewPDF">
                <iframe width="100%" height="500px" :src="preview_src" title="preview.pdf"></iframe>
            </div>
        </form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Swal from 'sweetalert2';
import UserService from '@/services/user.service';
import api from '@/services/api';
import tokenService from '@/services/token.service';
import EventBus from '@/common/EventBus';

export default {
    name: 'SigningPage',
    data() {
        return {
            x_axis: 500,
            y_axis: 210,
            page_number: 1,
            cad_password: '',
            img_file: null,
            pdf_file: null,
            signer_options: null,
            selected_signer: '',
            previewPDF: false,
            preview_src: ''
        }
    },
    async mounted() {
        // this.axios({
        //     method: 'get',
        //     url: `${process.env.VUE_APP_API}/all/signer`,
        //     headers: authHeader()
        // }).then((response) => {
        //     this.signer_options = response.data;
        // })
        UserService.getAllSigners().then(
            (response) => {
                this.signer_options = response.data;
            },
            error => {
                this.content = 
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()

                if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout");
                }
            }
        )
    },
    methods: {
        LoadingAlert() {
            Swal.fire({
                title: 'กรุณารอสักครู่',
                allowOutsideClick: false
            })
            Swal.showLoading()
        },
        signDocument() {
            Swal.fire({
                title: "ยืนยัน?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "ยืนยัน",
                confirmButtonColor: "#039018",
                cancelButtonText: "ยกเลิก",
                cancelButtonColor: "#d33"
            }).then((result) => {
                if (result.isConfirmed) {
                    var data = {
                        x_axis: this.x_axis,
                        y_axis: this.y_axis,
                        page_number: this.page_number,
                        cad_password: this.signer_options.find(signer => signer.employee_id[0] === this.selected_signer).cad_password,
                        signer: this.selected_signer,
                        token: tokenService.getLocalRefreshToken()
                    }
                    let formData = new FormData();
                    const json = JSON.stringify(data);
                    formData.append("sign_data", json);
                    // formData.append("sign_img", this.img_file);
                    formData.append("pdf_file", this.pdf_file);

                    //this.axios({
                    api({
                        method: 'post',
                        url: `${process.env.VUE_APP_API}/sign`,
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data" },
                    }).then((response) => {
                        console.log(response)
                        if (response.data.data != false) {
                            var pdf = (response.data.data)
                            const linkSource = `data:application/pdf;base64,${pdf}`;
                            const downloadLink = document.createElement("a");
                            const fileName = "signed_document.pdf";

                            downloadLink.href = linkSource;
                            downloadLink.download = fileName;
                            downloadLink.click();
                        } else {
                            Swal.fire({
                                title: 'ผิดพลาด',
                                icon: 'error',
                                html: 'ไม่สามารถลงนามเอกสารได้',
                                confirmButtonText: 'ตกลง'
                            })
                        }
                    })
                }
            })
        },
        selectedImage(event) {
            this.img_file = event[0]
        },
        selectedPDF(event) {
            this.pdf_file = event[0]
        },
        changeShowPreview() {
            if (this.selected_signer && this.pdf_file &&
                this.x_axis && this.y_axis && this.previewPDF) {
                this.showPreview()
            }
        },
        showPreview() {
            if (this.selected_signer && this.pdf_file && this.x_axis && this.y_axis) {
                var data = {
                    x_axis: this.x_axis,
                    y_axis: this.y_axis,
                    page_number: this.page_number,
                    signer: this.selected_signer
                }
                let formData = new FormData();
                const json = JSON.stringify(data);
                formData.append("sign_data", json)
                formData.append("pdf_file", this.pdf_file);
                api({
                    method: 'post',
                    //url: `${process.env.VUE_APP_API}/preview`,
                    url: '/preview',
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                }).then((response) => {
                    if (response.data.data != false) {
                        var base64_pdf = response.data.data
                        this.preview_src = `data:application/pdf;base64,${base64_pdf}`
                        this.previewPDF = true
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'ผิดพลาด',
                            html: 'ไม่สามารถแสดงตัวอย่าง PDF ได้ กรุณาตรวจสอบความถุกต้องของไฟล์'
                        })
                    }
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'ข้อมูลไม่ครบถ้วน',
                    html: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดแสดงตัวอย่าง PDF'
                })
            }
        }
    },
    computed: {
        ...mapGetters(['accessToken']),
        ...mapGetters(['refreshToken']),
        currentUser() {
            return this.$store.state.auth.user;
        }
    }
}
</script>