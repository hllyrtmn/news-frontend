export interface Media {
  id: number;
  title: string;
  alt_text?: string;
  caption?: string;
  file: string;
  thumbnail?: string;
  file_type: 'image' | 'video' | 'audio' | 'document';
  mime_type?: string;
  file_size: number;
  width?: number;
  height?: number;
  duration?: number;
  uploaded_by: number;
  copyright_holder?: string;
  is_featured: boolean;
  created_at: string;
}

export interface MediaUploadRequest {
  file: File;
  title: string;
  alt_text?: string;
  caption?: string;
  copyright_holder?: string;
}

export interface MediaUpdateRequest {
  id: number;
  title?: string;
  alt_text?: string;
  caption?: string;
  copyright_holder?: string;
}
