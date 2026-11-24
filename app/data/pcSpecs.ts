import type {ComponentType} from "react";
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
    link: string;
}

const pcSpecs: SpecItem[] = [
    {
        key: "processor",
        label: "Процессор: AMD Ryzen 9 7900",
        icon: Cpu,
        endAnimationPath: "/animations/sprite_get_cpu_8x6.webp",
        link: "https://www.ozon.ru/category/protsessory-15726/?category_was_predicted=true&deny_category_prediction=true&from_global=true&text=AMD+Ryzen+9+7900"
    },
    {
        key: "gpu",
        label: "Видеокарта: MSI GeForce RTX 4080 GAMING X SLIM WHITE",
        icon: Monitor,
        endAnimationPath: "/animations/sprite_get_gpu_8x6.webp",
        link: "https://www.ozon.ru/search/?text=MSI+GeForce+RTX+4080+GAMING+X+SLIM+WHITE&from_global=true",
    },
    {
        key: "ram",
        label: "ОЗУ: ADATA XPG Lancer 32 ГБ 5600 МГц DDR5",
        icon: HardDrive,
        endAnimationPath: "/animations/sprite_get_ram_8x6.webp",
        link: "https://www.ozon.ru/search/?brand=100105591&brand_was_predicted=true&deny_category_prediction=true&from_global=true&text=ADATA+XPG+Lancer+32+%D0%93%D0%91+5600+%D0%9C%D0%93%D1%86+DDR5",
    },
    {
        key: "motherboard",
        label: "Материнская плата: ASUS PRIME X670E-PRO WIFI",
        icon: Network,
        endAnimationPath: "/animations/sprite_get_motherboard_8x6.webp",
        link: "https://www.ozon.ru/search/?text=ASUS+PRIME+X670E-PRO+WIFI&from_global=true"
    },
    {
        key: "psu",
        label: "БП: ZALMAN TeraMax II 1200W WHITE [ZM1200-TMX2 WH]",
        icon: Zap,
        endAnimationPath: "/animations/sprite_get_psu_8x6.webp",
        link: "https://www.ozon.ru/search/?text=ZALMAN+TeraMax+II+1200W+WHITE+%5BZM1200-TMX2+WH%5D&from_global=true"
    },
    {
        key: "cooling",
        label: "Водяное охлаждение: DEEPCOOL LS520 WH",
        icon: Fan,
        endAnimationPath: "/animations/sprite_get_cooler_8x6.webp",
        link: "https://www.ozon.ru/category/sistemy-ohlazhdeniya-dlya-igrovyh-pk-15732/deepcool-26667812/?brand_was_predicted=true&category_was_predicted=true&deny_category_prediction=true&from_global=true&text=DEEPCOOL+LS520+WH"
    },
    {
        key: "case",
        label: "Корпус: MONTECH SKY TWO [SKY TWO White]",
        icon: Box,
        endAnimationPath: "/animations/sprite_get_box_8x6.webp",
        link: "https://www.ozon.ru/search/?brand=100888230&brand_was_predicted=true&deny_category_prediction=true&from_global=true&text=MONTECH+SKY+TWO+%5BSKY+TWO+White%5D"
    },
    {
        key: "monitor",
        label: "Монитор: Xiaomi Mi 2K Gaming 165 Гц",
        icon: Monitor,
        endAnimationPath: "/animations/sprite_get_monitor_8x6.webp",
        link: "https://www.ozon.ru/search/?text=%D0%9C%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80%3A+Xiaomi+Mi+2K+Gaming+165+%D0%93%D1%86&from_global=true"
    },
    {
        key: "microphone",
        label: "Микрофон: Audio-Technica AT2020USB+",
        icon: Mic,
        endAnimationPath: "/animations/sprite_get_mic_8x6.webp",
        link: "https://www.ozon.ru/category/mikrofony-15556/audio-technica-26303009/?brand_was_predicted=true&category_was_predicted=true&deny_category_prediction=true&from_global=true&text=Audio-Technica+AT2020USB%2B"
    },
];

export default pcSpecs;