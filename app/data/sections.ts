import Home from "@/app/components/Home";
import MyPc from "@/app/components/MyPc";

export const sections = [
    { id: "home", label: "Главная", icon: "🏠", content: Home },
    {
        id: "wishes",
        label: "Мини отдых",
        icon: "🎂",
        bg: "/images/wishes-bg.jpg",
        gradient: "from-pink-500/60 to-purple-500/60",
        cards: [
            { title: "Birthday Wishes", description: "Мини отдых", image: "/images/wishes-bg.jpg", targetAmount: 10000, currentAmount: 3333 },
        ],
    },
    // { id: "games", label: "Games", icon: "🎮" },
    // { id: "movies", label: "Movies", icon: "🎬" },
    { id: "mypc", label: "Мой ПК", icon: "💻", content: MyPc },

];