import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export async function uploadBase64Image(dataUrl: string, path: string): Promise<string> {
  if (!storage) {
    console.warn("Storage is not initialized. Falling back to data URL.");
    return dataUrl;
  }
  
  if (!dataUrl.startsWith('data:image')) {
    return dataUrl; // 이미 URL 형식이면 그대로 반환
  }

  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    // 1MB 제한을 피하기 위해 업로드 실패 시 원본 큰 데이터 대신 대체 텍스트 반환
    return "error_uploading_to_storage"; 
  }
}
