import { TimeLinePostType } from "@prisma/client";

export interface TimelinePost {
    id: string;
    title: string;
    institution?: string;
    location?: string;
    year: string;
    description: string;
    type: TimeLinePostType;
    link?: string;
}