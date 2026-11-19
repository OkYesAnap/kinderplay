import {Direction} from "@/app/slices/spriteAnimationSlice";

export const reverseDirection = (direction: Direction):Direction => {
    if(direction === "reverse"){
        return "forward"
    } else if (direction === "forward"){
        return "reverse";
    }
    return direction;
}
