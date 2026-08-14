export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    profilePictureUrl?: string;
    summary?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Experience {
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    responsibilities: string[];
}

export interface Education {
    degree: string;
    institution: string;
    startDate: Date;
    endDate: Date;
}

export interface Certification {
    title: string;
    issuingOrganization: string;
    issueDate: Date;
    expirationDate?: Date;
}