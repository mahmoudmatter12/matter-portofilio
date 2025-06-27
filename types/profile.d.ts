export interface profileType {
  id: string;
  name: string;
  email: string[];
  location?: string;
  bio?: string;
  phone?: string[];
  professions?: string[];
  about?: string;
  avatar?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  CV?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ProfileUpdate {
  id?: string; // Optional for updates, required for creation
  name?: string;
  email?: string[];
  location?: string;
  bio?: string;
  phone?: string[];
  professions?: string[];
  about?: string;
  avatar?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  CV?: string;
}

export interface CreateProfile {
  name: string;
  email: string[];
  location?: string;
  bio?: string;
  phone?: string[];
  professions?: string[];
  about?: string;
  avatar?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  CV?: string;
}

// mock profile data
export const mockProfile: CreateProfile = {
  "name": "John Doe",
  "email": ["john.doe@example.com"],
  "location": "New York, USA",
  "bio": "Software Developer",
  "phone": ["123-456-7890"],
  "professions": ["Developer", "Designer"],
  "about": "Passionate about creating amazing web applications.",
  "avatar": "https://example.com/avatar.jpg",
  "website": "https://johndoe.com",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "facebook": "https://facebook.com/johndoe",
  "instagram": "https://instagram.com/johndoe",
  "CV": "https://johndoe.com/cv.pdf",
};
