import axios from 'axios'

import {CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET} from '@env'

interface UploadImageOptions {
  uri: string
  fileName: string
  folder?: string
  resourceType?: 'image'
}

export const uploadImageToCloudinary = async ({
  uri,
  fileName,
  folder = 'findMyJob/Images',
  resourceType = 'image',
}: UploadImageOptions) => {
  const formData = new FormData()

  // Prepare image data for the upload
  const file = {uri, type: 'image/jpeg', name: fileName}

  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)
  formData.append('resource_type', resourceType)

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image to Cloudinary.')
  }
}
