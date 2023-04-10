import api from '@/services/api';

class DocumentService {
	previewDocument(formData) {
		return api.post(
			"/preview",
			formData,
			{ "Content-Type": "multipart/form-data" }
		).then(response => {
			if (response.data.toLowerCase() != 'false') {
				return Promise.resolve(response.data)
			} else {
				return Promise.reject('ไม่สามารถแสดงตัวอย่าง PDF ได้<br/>กรุณาตรวจสอบความถุกต้องของไฟล์')
			}
		})
	}

	downloadDocument(formData) {
		return api.post(
			"/sign",
			formData,
			{ "Content-Type": "multipart/form-data" }
		).then(response => {
			if (response.data.toLowerCase() != 'false') {
				return Promise.resolve(response.data)
			} else {
				return Promise.reject('ไม่สามารถลงนามเอกสารได้')
			}
		})
	}

	previewSelfDocument(formData) {
		return api.post(
			"/self/preview",
			formData,
			{ "Content-Type": "multipart/form-data" }
		).then(response => {
			if (response.data.toLowerCase() != 'false') {
				return Promise.resolve(response.data)
			} else {
				return Promise.reject('ไม่สามารถแสดงตัวอย่าง PDF ได้<br/>กรุณาตรวจสอบความถูกต้องของไฟล์')
			}
		}) 
	}

	downloadSelfDocument(formData) {
		return api.post(
			"/self/sign",
			formData,
			{ "Content-Type": "multipart/form-data" }
		).then(response => {
			if (response.data.toLowerCase() != 'false') {
				return Promise.resolve(response.data)
			} else {
				return Promise.reject('ไม่สามารถลงนามเอกสารได้')
			}
		})
	}
}

export default new DocumentService()