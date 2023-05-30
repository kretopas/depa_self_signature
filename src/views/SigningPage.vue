<template>
    <div class="container-fluid">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="row">
            <div class="col-sm border-grid">
                <form @submit.prevent="signDocument" class="form-box">
                    <div class="form-group row">
                        <label for="x_axis" class="col-sm-4 col-form-label">ตำแหน่ง X</label>
                        <div class="col-sm-8">
                            <input type="number" id="x_axis" 
                            v-model="x_axis" class="form-control"
                            @change="changeShowPreview"
                            required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="y_axis" class="col-sm-4 col-form-label">ตำแหน่ง Y</label>
                        <div class="col-sm-8">
                            <input type="number" id="y_axis"
                            v-model="y_axis" class="form-control"
                            @change="changeShowPreview"
                            required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="page_number" class="col-sm-4 col-form-label">หน้า</label>
                        <div class="col-sm-8">
                            <input type="number" class="form-control" 
                            id="page_number" v-model="page_number"
                            required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="signer" class="col-sm-4 col-form-label">ผู้ลงนาม</label>
                        <div class="col-sm-8">
                            <select class="form-control"
                            v-model="selected_signer" id="signer" 
                            @change="changeShowPreview">
                                <option value="" disabled hidden>-- เลือกผู้ลงนาม --</option>
                                <option v-for="(signer, index) in signer_options" :value="signer.employee_id[0]" v-bind:key="index">
                                    {{ signer.employee_id[1] }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="pdf_file" class="col-sm-4 col-form-label">ไฟล์เอกสาร (.pdf)</label>
                        <div class="col-sm-8">
                            <input type="file" class="form-control"
                            id="pdf_file" name="pdf_file"
                            @change="selectedPDF($event.target.files)"
                            accept="application/pdf"
                            required />
                        </div>
                    </div>
                    <div class="form-group mb-2">
                        <button class="btn btn-warning btn-block mb-2" type="button" @click="showPreview" v-if="!previewPDF">ดูตัวอย่าง</button>
                        <button class="btn btn-secondary btn-block mb-2" type="button" v-else @click="previewPDF = false">ปิดตัวอย่าง</button>
                        <button class="btn btn-primary btn-block mb-2">ลงนาม</button>
                    </div>
                </form>
            </div>
            <div class="col-sm">
                <div v-show="previewPDF">
                    <iframe width="100%" height="500px"
                    :src="preview_src" title="preview.pdf"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import UserService from '@/services/user.service';
import DocumentService from '@/services/document.service';
import EventBus from '@/common/EventBus';
import helper from '@/helpers/helper';

export default {
    name: 'SigningPage',
    data() {
        return {
            pageTitle: 'ลงนามเอกสาร (สำหรับผู้บริหาร)',
            x_axis: 500,
            y_axis: 210,
            page_number: 1,
            cad_password: '',
            //img_file: null,
            pdf_file: null,
            signer_options: null,
            selected_signer: '',
            previewPDF: false,
            preview_src: ''
        }
    },
    async mounted() {
        UserService.getAllSigners().then(
            response => {
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
                        signer: this.selected_signer
                    }
                    let formData = new FormData();
                    const json = JSON.stringify(data);
                    formData.append("sign_data", json);
                    formData.append("pdf_file", this.pdf_file);

                    DocumentService.downloadDocument(formData).then(
                        response => {
                            const linkSource = `data:application/pdf;base64,${response}`;
                            const downloadLink = document.createElement("a");
                            const fileName = "signed_document.pdf";
                            downloadLink.href = linkSource;
                            downloadLink.download = fileName;
                            downloadLink.click();
                        },
                        error => {
                            helper.failAlert(error);
                        }
                    )
                }
            })
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
                DocumentService.previewDocument(formData).then(
                    response => {
                        this.preview_src = `data:application/pdf;base64,${response}`;
                        this.previewPDF = true;
                    },
                    error => {
                        helper.failAlert(error);
                    }
                )
            } else {
                helper.warningAlert('กรุณาใส่ข้อมูลให้ถูกต้องครบถ้วน')
            }
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    }
}
</script>