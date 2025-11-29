/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // เพิ่มตัวแปร environment อื่นๆ ที่ต้องการได้ที่นี่
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
