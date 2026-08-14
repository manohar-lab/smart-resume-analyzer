interface Job {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    salaryRange: {
        min: number;
        max: number;
    };
    requirements: string[];
    postedDate: Date;
    applicationDeadline: Date;
    skills: string[];
    isRemote: boolean;
}

export type { Job };