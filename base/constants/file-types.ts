export enum FileType {
  /**Image */
  PNG = "image/png",
  JPG = "image/jpg",
  JPEG = "image/jpeg",
  GIF = "image/gif",
  BMP = "image/bmp",
  WEBP = "image/webp",
  SVG = "image/svg+xml",

  /**Video and Audio */
  MP4 = "video/mp4",
  MP3 = "audio/mp3",
  AVI = "video/x-msvideo",
  MOV = "video/quicktime",
  MKV = "video/x-matroska",
  WAV = "audio/wav",
  OGG = "audio/ogg",
  WEBM = "video/webm",

  /**Text */
  CSV = "text/csv",
  TEXT = "text/plain",
  HTML = "text/html",
  MARKDOWN = "text/markdown",
  XML = "text/xml",
  JSON = "application/json",

  /**Application*/
  PDF = "application/pdf",
  WORD = "application/msword",
  WORDX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  EXCEL = "application/vnd.ms-excel",
  EXCELX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  POWERPOINT = "application/vnd.ms-powerpoint",
  POWERPOINTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  ZIP = "application/zip",
  RAR = "application/x-rar-compressed",
  TAR = "application/x-tar",
  GZIP = "application/gzip",
}

export const image_file_types = [
  FileType.PNG,
  FileType.JPG,
  FileType.JPEG,
  FileType.GIF,
  FileType.BMP,
  FileType.WEBP,
  FileType.SVG,
];

export const video_file_types = [
  FileType.MP4,
  FileType.MP3,
  FileType.AVI,
  FileType.MOV,
  FileType.MKV,
  FileType.WAV,
  FileType.OGG,
  FileType.WEBM,
];

export const text_file_types = [
  FileType.CSV,
  FileType.TEXT,
  FileType.HTML,
  FileType.MARKDOWN,
  FileType.XML,
  FileType.JSON,
];

export const application_file_types = [
  FileType.PDF,
  FileType.WORD,
  FileType.WORDX,
  FileType.EXCEL,
  FileType.EXCELX,
  FileType.POWERPOINT,
  FileType.POWERPOINTX,
];

export const zip_file_types = [
  FileType.ZIP,
  FileType.RAR,
  FileType.TAR,
  FileType.GZIP,
];
