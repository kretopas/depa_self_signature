<template>
	<div class="container">
		<h1 class="page-title">{{ pageTitle }}</h1>
		<form @submit.prevent="signDocument" class="form-box">
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
                    <input type="number" class="form-control" 
                    id="page_number" v-model="page_number"
                    required />
                </div>
            </div>
			<div class="form-group row">
                <label for="img_file" class="col-sm-2 col-form-label">ไฟล์ภาพลายเซ็น</label>
                <div class="col-sm-10">
                    <input type="file" class="form-control"
					id="img_file" name="img_file"
                    @change="selectedImage($event.target.files)"
					required />
                </div>
            </div>
			<div class="form-group row">
                <label for="pdf_file" class="col-sm-2 col-form-label">ไฟล์เอกสาร (.pdf)</label>
                <div class="col-sm-10">
                    <input type="file" class="form-control"
					id="pdf_file" name="pdf_file"
                    @change="selectedPDF($event.target.files)"
					required />
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
import Swal from 'sweetalert2';
import DocumentService from '@/services/document.service';
import helper from '@/helpers/helper';

export default {
	name: 'SelfSigningPage',
	data() {
		return {
			pageTitle: 'ลงนามเอกสาร (ด้วยตัวเอง)',
			x_axis: 500,
			y_axis: 210,
			page_number: 1,
			img_file: null,
			pdf_file: null,
			previewPDF: false,
			preview_src: ''
		}
	},
	methods: {
        changeShowPreview() {
            if (this.img_file && this.pdf_file &&
                this.x_axis && this.y_axis && this.previewPDF) {
                this.showPreview()
            }
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
					}
					let formData = new FormData();
					const json = JSON.stringify(data);
					formData.append("sign_data", json);
					formData.append("img_file", this.img_file);
					formData.append("pdf_file", this.pdf_file);

					DocumentService.downloadSelfDocument(formData).then(
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
		showPreview() {
			if (this.x_axis && this.y_axis && this.img_file && this.pdf_file) {
				var data = {
					x_axis: this.x_axis,
					y_axis: this.y_axis,
					page_number: this.page_number
				}
				let formData = new FormData();
				const json = JSON.stringify(data);
				formData.append("sign_data", json);
				formData.append("img_file", this.img_file);
				formData.append("pdf_file", this.pdf_file);
				DocumentService.previewSelfDocument(formData).then(
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
		},
        selectedImage(event) {
            this.img_file = event[0]
        },
		selectedPDF(event) {
			this.pdf_file = event[0]
		}
	},
	computed: {
		currentUser() {
			return this.$store.state.auth.user;
		}
	}
}
</script>