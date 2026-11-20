import type { ComponentType } from "react";
import {
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Fan,
  Box,
  Mic,
  Network,
} from "lucide-react";

export interface SpecItem {
  key: string;
  label: string;
  endAnimationPath?: string;
  icon: ComponentType<{ className?: string }>;
}

const pcSpecs: SpecItem[] = [
  { key: "processor", label: "Процессор: AMD Ryzen 9 7900", icon: Cpu, endAnimationPath: "/animations/sprite_get_cpu_8x6.webp" },
  { key: "gpu", label: "Видеокарта: MSI GeForce RTX 4080 GAMING X SLIM WHITE", icon: Monitor, endAnimationPath: "/animations/sprite_get_gpu_8x6.webp" },
  { key: "ram", label: "ОЗУ: ADATA XPG Lancer 32 ГБ 5600 МГц DDR5", icon: HardDrive, endAnimationPath: "/animations/sprite_get_ram_8x6.webp" },
  { key: "motherboard", label: "Материнская плата: ASUS PRIME X670E-PRO WIFI", icon: Network, endAnimationPath: "/animations/sprite_get_motherboard_8x6.webp" },
  { key: "psu", label: "БП: ZALMAN TeraMax II 1200W WHITE [ZM1200-TMX2 WH]", icon: Zap, endAnimationPath: "/animations/sprite_get_psu_8x6.webp"  },
  { key: "cooling", label: "Водяное охлаждение: DEEPCOOL LS520 WH", icon: Fan, endAnimationPath: "/animations/sprite_get_cooler_8x6.webp" },
  { key: "case", label: "Корпус: MONTECH SKY TWO [SKY TWO White]", icon: Box, endAnimationPath: "/animations/sprite_get_box_8x6.webp" },
  { key: "monitor", label: "Монитор: Xiaomi Mi 2K Gaming 165 Гц", icon: Monitor },
  { key: "microphone", label: "Микрофон: Audio-Technica AT2020USB+", icon: Mic },
];

export default pcSpecs;