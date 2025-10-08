// 이미지 파일들을 StaticImageData로 import
import logo1 from "@/public/images/logo1.png";
import logo2 from "@/public/images/logo2.png";
import logo3 from "@/public/images/logo3.png";
import logo4 from "@/public/images/logo4.png";
import logo5 from "@/public/images/logo5.png";
import introImage from "@/public/images/intro_image.png";
import qrCode from "@/public/images/QRcode.png";
import kakaoLogo from "@/public/images/kakao_logo.png";
import defaultProfile from "@/public/images/default_profile.jpg";

// 아이콘 파일들을 StaticImageData로 import
import wordIcon from "@/public/icons/word.svg";
import zipIcon from "@/public/icons/zip.svg";
import noneIcon from "@/public/icons/none.svg";
import pdfIcon from "@/public/icons/pdf.svg";
import pptIcon from "@/public/icons/ppt.svg";
import textIcon from "@/public/icons/text.svg";
import videoIcon from "@/public/icons/video.svg";
import codeIcon from "@/public/icons/code.svg";
import excelIcon from "@/public/icons/excel.svg";
import imgIcon from "@/public/icons/img.svg";
import musicIcon from "@/public/icons/music.svg";

// 이미지 객체들을 export
export const IMAGES = {
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  introImage,
  qrCode,
  kakaoLogo,
  defaultProfile,
} as const;

// 아이콘 객체들을 export
export const ICONS = {
  word: wordIcon,
  zip: zipIcon,
  none: noneIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  text: textIcon,
  video: videoIcon,
  code: codeIcon,
  excel: excelIcon,
  img: imgIcon,
  music: musicIcon,
} as const;
