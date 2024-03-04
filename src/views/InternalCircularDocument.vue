<template>
	<div class="container-fluid">
		<h1 class="page-title">{{ pageTitle }}</h1>
		<div class="row">
			<div class="col-sm border-grid">
				<form @submit.prevent="createCircularDocument" class="form-box">
					<div class="form-group row">
						<label for="specific_document_no" class="col-sm-4 col-form-label">
							เลขหนังสือจริง
						</label>
						<div class="col-sm-8">
							<input
							id="specific_document_no"
							type="text"
							class="form-control"
							v-model="createData.specific_document_no"
							required />
						</div>
					</div>
					<div class="form-group row">
						<label for="specific_date" class="col-sm-4 col-form-label">
							วันที่ลงนามจริง
						</label>
						<div class="col-sm-8">
							<input
							id="specific_date"
							type="text"
							class="form-control"
							v-model="createData.specific_date"
							required />
						</div>
					</div>
					<div class="form-group row">
						<label for="doc_file" class="col-sm-4 col-form-label">ไฟล์ D-Signature (.docx)</label>
						<div class="col-sm-8">
							<input
							id="doc_file"
							name="doc_file"
							type="file"
							class="form-control"
							@change="selectedDocFile($event)"
							accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
							required />
						</div>
					</div>
					<div class="form-group row">
						<label for="name_file" class="col-sm-4 col-form-label">ไฟล์รายชื่อ (.xlsx)</label>
						<div class="col-sm-8">
							<input
							id="name_file"
							name="name_file"
							type="file"
							class="form-control"
							@change="selectedNameFile($event)"
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							required />
						</div>
					</div>
					<div class="form-group mb-2">
						<button class="btn btn-primary btn-block mb-2">สร้าง</button>
					</div>
				</form>
			</div>
			<div class="col-sm">
			</div>
		</div>
	</div>
</template>

<script>
import Swal from 'sweetalert2'
import DocumentService from '@/services/document.service';
import helper from '@/helpers/helper';

export default {
	name: "InternalCircularDocument",
	data() {
		return {
			pageTitle: 'หนังสือเวียน',
			docFile: null,
			nameFile: null,
			createData: {
				document_type_select: "หนังสือภายนอก+หนังสือรับรอง",
				speed: "1",
				secret: "normal",
				subject: "หนังสือเวียน (API)",
				document_note: "หนังสือเวียน",
				internal_title: "หนังสือเวียน",
				dear_select: "หนังสือเวียน",
				material: "หนังสือเวียน",
				for_document: "เพื่อโปรดดำเนินการ",
				circular_letter_check: true,
				specific_document_no: null,
				specific_date: null
			}
		}
	},
	methods: {
		createCircularDocument() {
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
					let formData = new FormData()
					const json = JSON.stringify(this.createData)
					formData.append("create_data", json)
					formData.append("doc_file", this.docFile)
					formData.append("name_file", this.nameFile)

					DocumentService.createCircularDocument(formData).then(
						() => {
							helper.successAlert('สร้างหนังสือเวียนเรียบร้อย')
							this.$router.go()
						},
						error => {
							helper.failAlert(error)
						}
					)
				}
			})
		},
		selectedDocFile(event) {
			this.docFile = event.target.files[0]
		},
		selectedNameFile(event) {
			this.nameFile = event.target.files[0]
		}
	},
	computed: {
		currentUser() {
			return this.$store.state.auth.user;
		}
	}
}
</script>